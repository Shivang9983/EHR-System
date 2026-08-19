const { GoogleGenAI } = require('@google/genai');

/**
 * Parses raw consultation transcripts or voice notes into structured SOAP clinical notes.
 *
 * @param {Object} params
 * @param {string} params.transcript - Text transcript or rough notes
 * @param {Object} [params.patientContext] - { name, age, gender, medicalHistory }
 * @param {Object} [params.audioFile] - Optional multer audio file { buffer, mimetype }
 * @returns {Promise<Object>} Structured SOAP note and vitals
 */
async function generateSoapNote({ transcript, patientContext = {}, audioFile = null }) {
  const apiKey = process.env.GEMINI_API_KEY;

  const systemInstruction = `You are a Board-Certified Clinical AI Medical Scribe assisting a physician in an Electronic Health Record (EHR) system.
Your task is to convert unstructured consultation notes, physician dictation, or conversation summaries into a standardized, high-quality SOAP clinical note and extract vital signs if mentioned.

Patient Context:
- Name: ${patientContext.name || 'Unknown'}
- Age: ${patientContext.age ? `${patientContext.age} years old` : 'Unknown'}
- Gender: ${patientContext.gender || 'Unknown'}
- Known Chronic History / Allergies: ${patientContext.medicalHistory || 'None declared'}

Output JSON ONLY with the exact following structure:
{
  "subjective": "Detailed Subjective section (Chief complaint, History of Present Illness, symptom onset/duration/character/severity, pertinent review of systems)",
  "objective": "Detailed Objective section (Physical examination findings, clinical observations, listed vitals)",
  "assessment": "Assessment (Primary diagnosis and differential diagnoses with clinical reasoning)",
  "plan": "Plan (Medications/prescriptions with dosages, diagnostic tests/labs ordered, patient education, follow-up timeline)",
  "summarySymptoms": "Concise 1-3 line summary of symptoms for primary EHR view",
  "primaryDiagnosis": "Primary diagnosis string (e.g. 'Essential Hypertension (ICD-10 I10)')",
  "vitals": {
    "bloodPressure": "e.g. 120/80 or empty string if not mentioned",
    "temperature": 98.6 or null if not mentioned (number in Fahrenheit),
    "pulse": 72 or null if not mentioned (number bpm),
    "respiratoryRate": 16 or null if not mentioned (number bpm)
  },
  "formattedClinicalNote": "Complete cleanly-formatted SOAP note text for clinical chart"
}`;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.warn('GEMINI_API_KEY not configured. Utilizing intelligent heuristic clinical scribe fallback.');
    return generateFallbackSoapNote(transcript, patientContext);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    
    let contents = [];

    if (audioFile && audioFile.buffer) {
      contents.push({
        inlineData: {
          mimeType: audioFile.mimetype || 'audio/webm',
          data: audioFile.buffer.toString('base64')
        }
      });
      contents.push({
        text: `Listen to this clinical consultation audio recording and generate the structured SOAP note according to the patient context and JSON schema.\nAdditional Notes: ${transcript || 'None'}`
      });
    } else {
      contents.push({
        text: `Consultation Notes / Physician Dictation:\n"""\n${transcript}\n"""\n\nGenerate the structured SOAP note in JSON.`
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const rawText = response.text || (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text);
    if (!rawText) {
      throw new Error('Empty response received from Gemini model');
    }

    const cleanedText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    return {
      success: true,
      provider: 'gemini-2.5-flash',
      soap: {
        subjective: parsed.subjective || '',
        objective: parsed.objective || '',
        assessment: parsed.assessment || '',
        plan: parsed.plan || '',
      },
      symptoms: parsed.summarySymptoms || parsed.subjective || '',
      diagnosis: parsed.primaryDiagnosis || parsed.assessment || '',
      notes: parsed.formattedClinicalNote || `SOAP NOTE:\n\n[SUBJECTIVE]\n${parsed.subjective}\n\n[OBJECTIVE]\n${parsed.objective}\n\n[ASSESSMENT]\n${parsed.assessment}\n\n[PLAN]\n${parsed.plan}`,
      vitals: {
        bloodPressure: parsed.vitals?.bloodPressure || '',
        temperature: parsed.vitals?.temperature ? Number(parsed.vitals.temperature) : null,
        pulse: parsed.vitals?.pulse ? Number(parsed.vitals.pulse) : null,
        respiratoryRate: parsed.vitals?.respiratoryRate ? Number(parsed.vitals.respiratoryRate) : null,
      }
    };
  } catch (error) {
    console.error('Gemini AI Scribe Error:', error);
    // If Gemini fails (e.g. quota, network), fallback gracefully so user flow is not interrupted
    const fallback = generateFallbackSoapNote(transcript, patientContext);
    fallback.aiWarning = `Gemini API query failed (${error.message}). Generated via local clinical parser fallback.`;
    return fallback;
  }
}

/**
 * Local clinical heuristic fallback when AI API is unavailable.
 */
function generateFallbackSoapNote(rawText = '', patientContext = {}) {
  const text = String(rawText || '');
  
  // Extract vitals if mentioned in text using regex
  const bpMatch = text.match(/\b(?:bp|blood pressure|pressure)[:\s]*([0-9]{2,3}\/[0-9]{2,3})\b/i) || text.match(/\b([0-9]{2,3}\/[0-9]{2,3})\s*(?:mmhg)?\b/i);
  const tempMatch = text.match(/\b(?:temp|temperature)[:\s]*([0-9]{2,3}(?:\.[0-9])?)\s*(?:f|°f|c|°c)?\b/i);
  const pulseMatch = text.match(/\b(?:pulse|heart rate|hr|bpm)[:\s]*([0-9]{2,3})\b/i);
  const respMatch = text.match(/\b(?:resp|respiratory rate|rr)[:\s]*([0-9]{1,2})\b/i);

  const bp = bpMatch ? bpMatch[1] : '';
  const temp = tempMatch ? Number(tempMatch[1]) : null;
  const pulse = pulseMatch ? Number(pulseMatch[1]) : null;
  const respRate = respMatch ? Number(respMatch[1]) : null;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const chief = lines[0] || 'Patient presenting for clinical evaluation.';
  
  const subjective = `Patient reports: ${text || 'Routine follow-up'}. Relevant history: ${patientContext.medicalHistory || 'None declared'}.`;
  const objective = `Vitals recorded: BP: ${bp || 'Not recorded'}, Pulse: ${pulse || 'Not recorded'}, Temp: ${temp ? `${temp}°F` : 'Not recorded'}, Resp: ${respRate || 'Not recorded'}. Physical observations noted.`;
  const assessment = `Clinical evaluation based on reported symptoms: ${chief}`;
  const plan = `1. Continue prescribed care plan.\n2. Supportive therapies and follow-up as clinically indicated.\n3. Return if symptoms worsen.`;

  return {
    success: true,
    provider: 'local-heuristic-scribe',
    soap: {
      subjective,
      objective,
      assessment,
      plan,
    },
    symptoms: chief,
    diagnosis: 'Clinical Consultation Assessment',
    notes: `[SUBJECTIVE]\n${subjective}\n\n[OBJECTIVE]\n${objective}\n\n[ASSESSMENT]\n${assessment}\n\n[PLAN]\n${plan}`,
    vitals: {
      bloodPressure: bp,
      temperature: temp,
      pulse: pulse,
      respiratoryRate: respRate,
    }
  };
}

module.exports = {
  generateSoapNote,
};
