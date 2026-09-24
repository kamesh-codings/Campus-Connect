import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  Plus,
  Video,
  CheckCircle2,
  Ticket,
  X,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['All', 'Workshop', 'Hackathon', 'Seminar', 'Cultural Fest', 'Competition', 'Sports Meet'];

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterType, setFilterType] = useState('all'); // all, upcoming, past
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Form state for creating event
  const [formData, setFormData] = useState({
    title: '',
    club: '',
    description: '',
    category: 'Workshop',
    venue: '',
    isOnline: false,
    meetingUrl: '',
    startDate: '',
    endDate: '',
    maxCapacity: 100,
  });

  const canCreate = ['admin', 'club_admin', 'faculty'].includes(user?.role);

  useEffect(() => {
    fetchEvents();
    fetchClubs();
  }, [filterType]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterType !== 'all') params.type = filterType;
      const res = await API.get('/events', { params });
      setEvents(res.data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const res = await API.get('/clubs');
      setClubs(res.data);
      if (res.data.length > 0 && !formData.club) {
        setFormData((prev) => ({ ...prev, club: res.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const res = await API.post(`/events/${eventId}/register`);
      toast.success(res.data.message || 'Registered successfully!');
      fetchEvents();
      if (selectedEvent && selectedEvent._id === eventId) {
        const updated = await API.get(`/events/${eventId}`);
        setSelectedEvent(updated.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/events', formData);
      toast.success('Event published successfully!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        club: clubs[0]?._id || '',
        description: '',
        category: 'Workshop',
        venue: '',
        isOnline: false,
        meetingUrl: '',
        startDate: '',
        endDate: '',
        maxCapacity: 100,
      });
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.description?.toLowerCase().includes(search.toLowerCase()) ||
      ev.venue?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-['Outfit']">
            Campus Events
          </h1>
          <p className="text-text-secondary mt-1">
            Discover workshops, hackathons, guest seminars, and club fests.
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus size={18} />
            Create Event
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="glass p-4 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search by title, venue, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Time Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-light/60 rounded-xl w-full md:w-auto">
            {['all', 'upcoming', 'past'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all flex-1 md:flex-initial ${
                  filterType === type
                    ? 'bg-primary text-white shadow-md'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary/20 text-primary-light border border-primary/40'
                  : 'bg-surface-light text-text-secondary hover:bg-surface-lighter hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl">
          <Calendar size={48} className="mx-auto text-text-muted mb-3 opacity-40" />
          <h3 className="text-lg font-semibold text-text-primary">No events found</h3>
          <p className="text-text-secondary text-sm mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => {
            const isRegistered = ev.registeredUsers?.some(
              (r) => r.user?._id === user?._id || r.user === user?._id
            );
            const userRegistration = ev.registeredUsers?.find(
              (r) => r.user?._id === user?._id || r.user === user?._id
            );
            const isFull = (ev.registeredUsers?.length || 0) >= ev.maxCapacity;

            return (
              <div
                key={ev._id}
                className="card group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Club & Category */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="badge-primary text-xs font-semibold">
                      {ev.category}
                    </span>
                    <span className="text-xs text-text-muted truncate max-w-[150px]">
                      {ev.club?.name || 'Campus Club'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors line-clamp-1 mb-2">
                    {ev.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary text-xs line-clamp-2 mb-4 leading-relaxed">
                    {ev.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 text-xs text-text-muted mb-4 border-t border-glass-border pt-3">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-secondary" />
                      <span>{new Date(ev.startDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {ev.isOnline ? (
                        <>
                          <Video size={14} className="text-primary-light" />
                          <span className="text-primary-light font-medium">Virtual Event</span>
                        </>
                      ) : (
                        <>
                          <MapPin size={14} className="text-accent" />
                          <span className="truncate">{ev.venue}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-success" />
                      <span>
                        {ev.registeredUsers?.length || 0} / {ev.maxCapacity} registered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-glass-border flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedEvent(ev)}
                    className="text-xs font-semibold text-text-secondary hover:text-white transition-colors"
                  >
                    View Details
                  </button>

                  {isRegistered ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/20 text-success text-xs font-semibold">
                      <CheckCircle2 size={14} />
                      Registered
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegister(ev._id)}
                      disabled={isFull}
                      className={`btn-primary text-xs py-1.5 px-3 ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isFull ? 'Full' : 'RSVP Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass max-w-lg w-full rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-white"
            >
              <X size={20} />
            </button>

            <span className="badge-primary text-xs font-semibold mb-2 inline-block">
              {selectedEvent.category}
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h2>
            <p className="text-xs text-text-muted mb-4">
              Organized by <strong className="text-text-primary">{selectedEvent.club?.name}</strong>
            </p>

            <div className="space-y-3 mb-6 bg-surface-light/40 p-4 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-secondary" />
                <span>
                  <strong>Starts:</strong>{' '}
                  {new Date(selectedEvent.startDate).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-secondary" />
                <span>
                  <strong>Ends:</strong>{' '}
                  {new Date(selectedEvent.endDate).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                <span>
                  <strong>Venue:</strong> {selectedEvent.venue}
                </span>
              </div>
              {selectedEvent.isOnline && selectedEvent.meetingUrl && (
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-primary-light" />
                  <a
                    href={selectedEvent.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-light underline"
                  >
                    Join Meeting Link
                  </a>
                </div>
              )}
            </div>

            <h4 className="text-sm font-semibold text-white mb-1">About This Event</h4>
            <p className="text-text-secondary text-xs leading-relaxed mb-6 whitespace-pre-line">
              {selectedEvent.description}
            </p>

            {/* Check if user registered and has ticketCode */}
            {(() => {
              const reg = selectedEvent.registeredUsers?.find(
                (r) => r.user?._id === user?._id || r.user === user?._id
              );
              if (reg?.ticketCode) {
                return (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-primary-light font-semibold uppercase tracking-wider">
                        Your Entry Pass
                      </p>
                      <p className="text-lg font-mono font-bold text-white tracking-widest mt-0.5">
                        {reg.ticketCode}
                      </p>
                    </div>
                    <Ticket className="text-primary-light" size={28} />
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="btn-outline text-xs"
              >
                Close
              </button>
              {selectedEvent.registeredUsers?.some(
                (r) => r.user?._id === user?._id || r.user === user?._id
              ) ? (
                <button
                  onClick={() => handleRegister(selectedEvent._id)}
                  className="btn-danger text-xs"
                >
                  Cancel RSVP
                </button>
              ) : (
                <button
                  onClick={() => handleRegister(selectedEvent._id)}
                  className="btn-primary text-xs"
                >
                  Confirm Registration
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass max-w-xl w-full rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-1 font-['Outfit']">Host New Event</h2>
            <p className="text-xs text-text-secondary mb-6">
              Create an event under a club for campus students to attend.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Cloud Hackathon 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Hosting Club *
                  </label>
                  <select
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    className="input-field"
                    required
                  >
                    {clubs.map((c) => (
                      <option key={c._id} value={c._id} className="bg-surface">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat} className="bg-surface">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Description *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Provide schedule, prerequisites, and what attendees will learn..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Venue *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Auditorium B, Lab 4, etc."
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Maximum Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="isOnline"
                  checked={formData.isOnline}
                  onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary bg-surface border-glass-border"
                />
                <label htmlFor="isOnline" className="text-xs text-text-secondary">
                  This is a virtual / online session
                </label>
              </div>

              {formData.isOnline && (
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Meeting Link (Zoom / Google Meet)
                  </label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/xyz"
                    value={formData.meetingUrl}
                    onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                    className="input-field"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-glass-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-outline text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
