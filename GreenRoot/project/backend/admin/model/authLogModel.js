const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authLogSchema = new Schema({
    event: {
        type: String,
        required: true,
        enum: ['password_login', 'google_login']
    },
    success: {
        type: Boolean,
        required: true
    },
    reason: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ip: {
        type: String,
        default: ''
    },
    userAgent: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 90
    },
});

authLogSchema.index({ event: 1, createdAt: -1 });

module.exports = mongoose.model("AuthLog", authLogSchema);
