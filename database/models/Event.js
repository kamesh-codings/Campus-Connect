const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    banner: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Workshop', 'Hackathon', 'Seminar', 'Cultural Fest', 'Competition', 'Sports Meet'],
      required: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    meetingUrl: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    maxCapacity: {
      type: Number,
      default: 100,
    },
    registrationDeadline: {
      type: Date,
    },
    registeredUsers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        ticketCode: { type: String },
        registeredAt: { type: Date, default: Date.now },
        attended: { type: Boolean, default: false },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
