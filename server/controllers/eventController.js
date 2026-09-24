const Event = require('../models/Event');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const { category, type, club } = req.query;
    let query = {};

    if (category) query.category = category;
    if (club) query.club = club;

    // Filter by upcoming or past
    if (type === 'upcoming') {
      query.startDate = { $gte: new Date() };
    } else if (type === 'past') {
      query.endDate = { $lt: new Date() };
    }

    const events = await Event.find(query)
      .populate('club', 'name logo category')
      .populate('createdBy', 'name avatar')
      .sort({ startDate: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club', 'name logo category leads')
      .populate('createdBy', 'name avatar')
      .populate('registeredUsers.user', 'name email avatar department');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private/ClubAdmin/Faculty
const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const event = await Event.create(eventData);

    const populatedEvent = await Event.findById(event._id)
      .populate('club', 'name logo')
      .populate('createdBy', 'name avatar');

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to('campus_all').emit('NEW_EVENT', {
        eventId: event._id,
        title: event.title,
        category: event.category,
        startDate: event.startDate,
      });
    }

    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/ClubAdmin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('club', 'name logo')
      .populate('createdBy', 'name avatar');

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register for event (RSVP)
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check capacity
    if (event.registeredUsers.length >= event.maxCapacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    // Check if registration deadline has passed
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // Check if already registered
    const alreadyRegistered = event.registeredUsers.some(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Generate unique ticket code
    const ticketCode = `CC-${uuidv4().slice(0, 8).toUpperCase()}`;

    event.registeredUsers.push({
      user: req.user._id,
      ticketCode,
    });
    await event.save();

    res.json({
      message: 'Successfully registered for the event',
      ticketCode,
      eventTitle: event.title,
      venue: event.venue,
      startDate: event.startDate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Check-in attendee (scan QR / validate ticket)
// @route   POST /api/events/:id/check-in
// @access  Private/ClubAdmin
const checkInAttendee = async (req, res) => {
  try {
    const { ticketCode } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registration = event.registeredUsers.find((r) => r.ticketCode === ticketCode);
    if (!registration) {
      return res.status(404).json({ message: 'Invalid ticket code' });
    }

    if (registration.attended) {
      return res.status(400).json({ message: 'Attendee already checked in' });
    }

    registration.attended = true;
    await event.save();

    res.json({ message: 'Check-in successful', ticketCode });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  registerForEvent,
  checkInAttendee,
  deleteEvent,
};
