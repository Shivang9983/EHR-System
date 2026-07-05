const swaggerUi = require('swagger-ui-express');

// Static Swagger API spec to avoid bloating code with large inline JSDoc comments
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'EHR SaaS API Documentation',
    version: '1.0.0',
    description: 'API endpoints for the multi-tenant Electronic Health Record (EHR) SaaS Application.',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new Organization and Admin user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password', 'organizationName'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                  organizationName: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Success' },
          400: { description: 'Bad Request' },
        },
      },
    },
    '/api/auth/register-staff': {
      post: {
        summary: 'Register a Doctor or Receptionist (Admin Only)',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password', 'role'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['Doctor', 'Receptionist'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Success' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Log in as a staff member or admin',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Success' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/patients': {
      get: {
        summary: 'Get all patients in organization',
        tags: ['Patients'],
        responses: {
          200: { description: 'Success' },
        },
      },
      post: {
        summary: 'Create a new patient',
        tags: ['Patients'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'age', 'gender', 'contactNumber'],
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  age: { type: 'integer' },
                  gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
                  contactNumber: { type: 'string' },
                  email: { type: 'string' },
                  medicalHistory: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Success' },
        },
      },
    },
    '/api/appointments': {
      get: {
        summary: 'Get all appointments in organization',
        tags: ['Appointments'],
        responses: {
          200: { description: 'Success' },
        },
      },
      post: {
        summary: 'Create a new appointment (Admin/Receptionist Only)',
        tags: ['Appointments'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['patientId', 'doctorId', 'date', 'time', 'reason'],
                properties: {
                  patientId: { type: 'string' },
                  doctorId: { type: 'string' },
                  date: { type: 'string', format: 'date' },
                  time: { type: 'string' },
                  reason: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Success' },
        },
      },
    },
  },
};

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
