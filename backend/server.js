const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Encounter = require('./models/Encounter');
const Organization = require('./models/Organization');
const swaggerSetup = require('./config/swagger');

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing');
}

connectDB();

const app = express();

// Security HTTP Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows cross-origin image retrieval if frontend/backend are on different ports/domains
}));

// API Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EHR Backend API is active!' });
});

// Register routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patient'));
app.use('/api/encounters', require('./routes/encounter'));
app.use('/api/appointments', require('./routes/appointment'));
app.use('/api/files', require('./routes/file'));
app.use('/api/analytics', require('./routes/analytics'));

// Swagger UI Setup
swaggerSetup(app);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const seedDemoUsersAndMigrate = async () => {
  try {
    // 1. Create or Find Default Organization
    let defaultOrg = await Organization.findOne({ name: 'Default Health Clinic' });
    if (!defaultOrg) {
      defaultOrg = await Organization.create({ name: 'Default Health Clinic' });
      console.log('Seeded Default Health Clinic organization.');
    }

    // 2. Database Migration for Backwards Compatibility
    // If there is existing data in MongoDB, automatically associate it with the default organization
    const patientsToMigrate = await Patient.countDocuments({ organization: { $exists: false } });
    if (patientsToMigrate > 0) {
      await Patient.updateMany({ organization: { $exists: false } }, { $set: { organization: defaultOrg._id } });
      console.log(`Migrated ${patientsToMigrate} existing Patient records to Default Health Clinic.`);
    }

    const encountersToMigrate = await Encounter.countDocuments({ organization: { $exists: false } });
    if (encountersToMigrate > 0) {
      await Encounter.updateMany({ organization: { $exists: false } }, { $set: { organization: defaultOrg._id } });
      console.log(`Migrated ${encountersToMigrate} existing Encounter records to Default Health Clinic.`);
    }

    const usersToMigrate = await User.countDocuments({ organization: { $exists: false } });
    if (usersToMigrate > 0) {
      await User.updateMany({ organization: { $exists: false } }, { $set: { organization: defaultOrg._id } });
      console.log(`Migrated ${usersToMigrate} existing User records to Default Health Clinic.`);
    }

    // 3. Pre-seed users if empty
    const userCount = await User.countDocuments();
    if (userCount === 0 || (await User.countDocuments({ role: 'Admin' })) === 0) {
      console.log('Seeding demo users for testing...');
      
      // Admin
      if (!(await User.findOne({ username: 'admin' }))) {
        await User.create({
          username: 'admin',
          password: 'admin123',
          role: 'Admin',
          organization: defaultOrg._id,
        });
      }

      // Doctor
      if (!(await User.findOne({ username: 'doctor' }))) {
        await User.create({
          username: 'doctor',
          password: 'doctor123',
          role: 'Doctor',
          organization: defaultOrg._id,
        });
      }

      // Receptionist
      if (!(await User.findOne({ username: 'receptionist' }))) {
        await User.create({
          username: 'receptionist',
          password: 'receptionist123',
          role: 'Receptionist',
          organization: defaultOrg._id,
        });
      }

      console.log('Demo Users seeded successfully!');
      console.log('  -> Admin: admin / admin123');
      console.log('  -> Doctor: doctor / doctor123');
      console.log('  -> Receptionist: receptionist / receptionist123');
    }
  } catch (err) {
    console.error('Migration and Seed error:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`EHR server running on port ${PORT}`);
  await seedDemoUsersAndMigrate();
});

process.on('unhandledRejection', (err) => {
  console.log(`Unhandled promise error: ${err.message}`);
  server.close(() => process.exit(1));
});
