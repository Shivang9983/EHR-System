const mongoose = require('mongoose');


const auditLogSchema = new mongoose.Schema({
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  actionPerformed: {
    type: String, 
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
