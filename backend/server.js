const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');


dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing');
}

connectDB();

const app = express();


app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EHR Backend API is active!' });
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patient'));
app.use('/api/encounters', require('./routes/encounter'));


app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});


const seedDemoUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database empty! Pre-seeding demo users for testing...');
      
      

      await User.create({
        username: 'doctor',
        password: 'doctor123',
        role: 'Doctor',
      });
      
     

      await User.create({
        username: 'receptionist',
        password: 'receptionist123',
        role: 'Receptionist',
      });

      console.log('Demo Users seeded successfully!');
      console.log('  -> Doctor: doctor / doctor123');
      console.log('  -> Receptionist: receptionist / receptionist123');
    }
  } catch (err) {
    console.error('Pre-seed error:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`EHR server running on port ${PORT}`);
  
  await seedDemoUsers();
});



process.on('unhandledRejection', (err) => {
  console.log(`Unhandled promise error: ${err.message}`);
  server.close(() => process.exit(1));
});
