# 🏥 EHR Clinical Suite – Enterprise Electronic Health Record Platform

A modern, production-grade Electronic Health Record (EHR) operating system built with the **MERN Stack (MongoDB, Express, React, Node.js)** and integrated with **Google Gemini 2.5 Flash** for ambient clinical scribe documentation.

Designed for high-trust medical practices, clinics, and multi-tenant healthcare organizations to streamline patient registries, SOAP charting, clinic scheduling, medical scan vaults, and executive analytics.

---

## 🌐 Live Access & Deployment

- **Frontend Portal & Showcase**: [https://ehr-system-xi.vercel.app](https://ehr-system-xi.vercel.app)
- **Backend REST API**: [https://ehr-system-9e0d.onrender.com](https://ehr-system-9e0d.onrender.com)
- **Interactive Swagger API Docs**: `https://ehr-system-9e0d.onrender.com/api-docs`

---

## ⚡ Instant Sandbox Demo Credentials

The database comes pre-seeded with three segregated role accounts:

| Role | Username | Password | Permission Highlights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Staff account provisioning, system settings, full patient & appointment management. |
| **Doctor** | `doctor` | `doctor123` | AI Ambient Scribe, SOAP clinical charting, diagnostic scans upload, vital signs logging. |
| **Receptionist** | `receptionist` | `receptionist123` | Patient demographics registration, appointment booking, calendar slot management. |

---

## ✨ Core System Modules

### 🎙️ 1. AI Ambient Clinical Scribe (Gemini 2.5 Flash)
- **Live Voice Dictation & Audio Processing**: Web Speech API speech-to-text recognition and audio file upload (`.mp3`, `.wav`, `.m4a`, `.webm`).
- **Automated SOAP Structuring**: Translates natural doctor-patient dialogue into standardized **Subjective**, **Objective**, **Assessment**, and **Plan** sections.
- **Intelligent Vitals Extraction**: Automatically extracts Blood Pressure (BP), Temperature (°F), Heart Rate (Pulse bpm), and Respiratory Rate from conversation text.
- **Clinician Review Mode**: Doctors can review, edit, copy, and approve generated SOAP notes before saving to patient charts.

### 👥 2. Patient Demographics & Registry Directory
- Instant multi-field search (Patient full name, contact phone number).
- Real-time gender filtering (`All`, `Male`, `Female`, `Other`) and dynamic age sorting.
- Chronic illness tracking and declared drug allergy index.
- Comprehensive demographic metadata (Age, Gender, Contact Phone, Email).

### 📅 3. Interactive Clinic Scheduling & Agenda
- Full monthly visual calendar grid with daily appointment density tags.
- Daily slot agenda with real-time status management (`Scheduled`, `Completed`, `Cancelled`).
- Direct clinician assignment from active organization doctors.
- Conflict prevention and one-click patient chart navigation.

### 📁 4. Medical Scans & Diagnostic Vault
- Cloudinary-backed digital archive for diagnostic imaging, prescriptions, scans, and lab reports.
- Role-restricted document upload and deletion for Doctors & Admins.
- Formatted file metadata (file size in KB/MB, uploader attribution, timestamps).
- Direct inline preview and secure file downloads.

### 📊 5. Executive Analytics & Client-Side PDF Reports
- Real-time gender demographic calculations and age bracket distributions (`0-18`, `19-35`, `36-50`, `51-65`, `65+`).
- 6-month historical visit trend charts and registration growth tracking (`Recharts`).
- One-click client-side Executive Clinical Summary PDF export powered by `jsPDF`.

### 🛡️ 6. 3-Tier Granular RBAC & Multi-Tenancy
- Strict organization-level data scoping (`req.user.organization._id`) preventing cross-tenant access.
- Role-enforced API routes and conditional UI rendering for Admin, Doctor, and Receptionist.
- HIPAA-style audit trail logging (`AuditLog` model).

---

## 🎨 Design System & Visual Identity

The EHR application features an intentional **Espresso Umber, Warm Parchment Cream, Crisp White, and Linen** design identity:

- **Deep Espresso Umber (`#1C1613`)**: Authoritative text ink, brand emblems, and primary action controls.
- **Warm Parchment Cream (`#FAF7F2`)**: Serene, eye-friendly clinical background canvas.
- **Crisp Clinic White (`#FFFFFF`)**: High-contrast elevated cards, modals, and input fields.
- **Hairline Linen (`#E8E2D8`)**: Subtle structural framing with zero visual clutter.
- **Restorative Sage (`#2D5A43`)**: Telemetry indicators and chart status badges.
- **Typography**: Geometric clarity with **Plus Jakarta Sans** for headlines and **Inter** for tabular clinical figures.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS Variables
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Document Generation**: jsPDF
- **Speech API**: Web Speech API (`SpeechRecognition`) & MediaRecorder

### Backend
- **Runtime**: Node.js v24+ & Express 4
- **Database**: MongoDB Atlas with Mongoose 8
- **AI Engine**: Google Gemini API (`@google/genai` - `gemini-2.5-flash`)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs password hashing
- **Security**: Helmet HTTP headers, IP Rate Limiting (`express-rate-limit`), Parameterized queries
- **Documentation**: Swagger UI (`swagger-ui-express`)
- **File Storage**: Multer & Cloudinary v2

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React 18 + Vite)                │
│  [Landing Page]  [Dashboard]  [Registry]  [AI Scribe]  ...  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST (Bearer JWT)
┌──────────────────────────────▼──────────────────────────────┐
│                    Express REST API Gateway                 │
│  [Helmet Security] [Rate Limiter] [Auth Middleware & RBAC]  │
└──────┬───────────────────────┬───────────────────────┬──────┘
       │                       │                       │
┌──────▼──────┐         ┌──────▼──────┐         ┌──────▼──────┐
│   MongoDB   │         │   Gemini    │         │ Cloudinary  │
│    Atlas    │         │ 2.5 Flash   │         │ Document    │
│ Multi-Tenant│         │  AI Scribe  │         │    Vault    │
└─────────────┘         └─────────────┘         └─────────────┘
```

---

## 📂 Project Structure

```bash
EHR-System/
├── backend/
│   ├── config/             # Database connection & Swagger UI setup
│   ├── middleware/         # JWT verification, RBAC checkRole, validation
│   ├── models/             # Mongoose schemas: User, Patient, Encounter, Appointment, MedicalFile, AuditLog, Organization
│   ├── routes/             # REST controllers: auth, patient, encounter, appointment, file, analytics, ai
│   ├── services/           # Gemini 2.5 Flash AI Scribe service
│   ├── .env.example        # Environment variable template
│   ├── Dockerfile          # Backend container specification
│   ├── package.json
│   └── server.js           # Server bootstrap & multi-tenant seed migration
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components: AiAmbientScribe, EncounterForm, EncounterTimeline, PatientFilesSection, Header, Sidebar, LoadingScreen
│   │   ├── context/        # AuthContext state provider
│   │   ├── pages/          # Landing, Login, Dashboard, PatientList, PatientChart, Appointments, Reports, Settings
│   │   ├── utils/          # jsPDF report generators
│   │   ├── App.jsx         # Client routing with public & protected routes
│   │   ├── index.css       # Tailwind CSS v4 design tokens & theme overrides
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml       # Full stack container orchestration
└── README.md
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+ (Node 20 or 24 recommended)
- MongoDB instance (local or MongoDB Atlas connection string)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Shivang9983/EHR-System.git
cd EHR-System
```

### 2. Backend Configuration & Launch
```bash
cd backend
npm install

# Create local environment file from template
cp .env.example .env
```

Configure `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here

# Optional: Cloudinary credentials for scan uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:
```bash
npm run dev
```
*The backend automatically seeds the default organization and demo user accounts on first boot.*

### 3. Frontend Configuration & Launch
```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Docker Deployment

Run the entire full-stack application (frontend + backend) using Docker Compose:

```bash
# In project root
docker-compose up --build
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Swagger Documentation**: `http://localhost:5000/api-docs`

---

## 🔑 REST API Reference

| Method | Endpoint | Access / Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT token |
| `POST` | `/api/auth/register-staff` | Admin | Provision new Doctor or Receptionist account |
| `PUT` | `/api/auth/change-password` | Authenticated | Update user password credentials |
| `GET` | `/api/patients` | Admin, Doctor, Receptionist | Get organization patient registry |
| `POST` | `/api/patients` | Admin, Doctor, Receptionist | Register new patient chart |
| `GET` | `/api/patients/:id` | Admin, Doctor, Receptionist | Get detailed patient profile |
| `DELETE` | `/api/patients/:id` | Admin, Doctor | Delete permanent clinical record |
| `POST` | `/api/encounters` | Admin, Doctor | Create clinical SOAP encounter |
| `GET` | `/api/encounters/patient/:patientId`| Admin, Doctor | Get patient encounter timeline |
| `POST` | `/api/ai/scribe` | Admin, Doctor | Gemini AI voice/text SOAP transcription |
| `GET` | `/api/appointments` | Authenticated | Fetch appointment schedule |
| `POST` | `/api/appointments` | Admin, Receptionist | Book patient checkup slot |
| `PUT` | `/api/appointments/:id` | Admin, Doctor, Receptionist | Update appointment status |
| `POST` | `/api/files/upload` | Admin, Doctor | Upload medical scan or document |
| `GET` | `/api/files/patient/:patientId` | Authenticated | Fetch patient scan records |
| `GET` | `/api/analytics/dashboard` | Authenticated | Aggregate clinic statistics & trends |

---

## 👨‍💻 Author & Contact

**Shivang Kumar**
- GitHub: [@Shivang9983](https://github.com/Shivang9983)
- Repository: [https://github.com/Shivang9983/EHR-System](https://github.com/Shivang9983/EHR-System)
