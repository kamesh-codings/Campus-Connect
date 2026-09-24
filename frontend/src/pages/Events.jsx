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
  Sparkles,
  Award,
  ChevronRight,
  Printer,
  QrCode,
  Flame,
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
  const [registeredTicket, setRegisteredTicket] = useState(null);
  const [checkInModalEvent, setCheckInModalEvent] = useState(null);
  const [checkInCode, setCheckInCode] = useState('');
  const [checkInLoading, setCheckInLoading] = useState(false);

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
      if (res.data.qrCode) {
        setRegisteredTicket(res.data);
      }
      fetchEvents();
      if (selectedEvent && selectedEvent._id === eventId) {
        const updated = await API.get(`/events/${eventId}`);
        setSelectedEvent(updated.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!checkInModalEvent || !checkInCode.trim()) return;
    setCheckInLoading(true);
    try {
      const res = await API.post(`/events/${checkInModalEvent._id}/check-in`, {
        ticketCode: checkInCode.trim().toUpperCase(),
      });
      toast.success(res.data.message || 'Check-in successful! +25 Points awarded.');
      setCheckInCode('');
      setCheckInModalEvent(null);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    } finally {
      setCheckInLoading(false);
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

  // Featured event (first upcoming or first available)
  const featuredEvent = events.length > 0 ? events[0] : null;

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* ── 1. HEADER ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles size={13} className="text-indigo-400" />
            <span>Campus Event Discovery & Digital Passes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-['Outfit']">
            Discover What's Happening
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse hackathons, technical workshops, cultural fests, and guest lectures.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} /> Host New Event
          </button>
        )}
      </div>

      {/* ── 2. FEATURED EVENT BANNER ──────────────────────── */}
      {featuredEvent && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 sm:p-7 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Info */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  <Flame size={13} /> Featured Spotlight
                </span>
                <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  {featuredEvent.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                {featuredEvent.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed max-w-2xl">
                {featuredEvent.description}
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-indigo-400" />
                  {new Date(featuredEvent.startDate).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-cyan-400" />
                  {featuredEvent.venue}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} className="text-emerald-400" />
                  {featuredEvent.registeredUsers?.length || 0} / {featuredEvent.maxCapacity} seats filled
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-md bg-slate-800 rounded-full h-2 overflow-hidden border border-white/10 mt-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      ((featuredEvent.registeredUsers?.length || 0) / (featuredEvent.maxCapacity || 100)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center space-y-3">
              {featuredEvent.registeredUsers?.some(
                (r) => r.user?._id === user?._id || r.user === user?._id
              ) ? (
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-xs">
                  <CheckCircle2 size={16} /> Registered & Pass Active
                </div>
              ) : (
                <button
                  onClick={() => handleRegister(featuredEvent._id)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <QrCode size={16} /> 1-Tap RSVP & Get Pass
                </button>
              )}

              <button
                onClick={() => setSelectedEvent(featuredEvent)}
                className="text-xs text-slate-400 hover:text-white transition-colors underline underline-offset-4"
              >
                View Full Event Agenda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. SEARCH & CATEGORY FILTERS ─────────────────── */}
      <div className="glass p-4 sm:p-5 rounded-2xl space-y-4 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by event title, venue, or club..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#080B12] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl w-full md:w-auto border border-white/5">
            {['all', 'upcoming', 'past'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all flex-1 md:flex-initial cursor-pointer ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. EVENTS GRID ───────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-10 text-center rounded-xl bg-[#0D111A] border border-white/10">
          <Calendar size={40} className="mx-auto text-slate-600 mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-white">No events found</h3>
          <p className="text-slate-400 text-xs mt-1">Try adjusting your search terms or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((ev) => {
            const isRegistered = ev.registeredUsers?.some(
              (r) => r.user?._id === user?._id || r.user === user?._id
            );
            const isFull = (ev.registeredUsers?.length || 0) >= ev.maxCapacity;
            const eventDate = new Date(ev.startDate);

            return (
              <div
                key={ev._id}
                className="p-4 rounded-xl bg-[#0D111A] border border-white/10 hover:border-indigo-500/40 transition-all duration-200 shadow-sm flex flex-col justify-between group"
              >
                <div>
                  {/* Top category & club */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                      {ev.category}
                    </span>
                    <span className="text-xs text-slate-400 truncate max-w-[150px]">
                      {ev.club?.name || 'Campus Club'}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                    {ev.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-1.5 text-xs text-slate-400 mb-3 border-t border-white/5 pt-2.5">
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-indigo-400" />
                      <span>{eventDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {ev.isOnline ? (
                        <>
                          <Video size={13} className="text-cyan-400" />
                          <span className="text-cyan-400 font-medium">Virtual Session</span>
                        </>
                      ) : (
                        <>
                          <MapPin size={13} className="text-amber-400" />
                          <span className="truncate">{ev.venue}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-emerald-400" />
                      <span>{ev.registeredUsers?.length || 0} / {ev.maxCapacity} seats filled</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedEvent(ev)}
                    className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Details
                  </button>

                  <div className="flex items-center gap-2">
                    {isRegistered ? (
                      <button
                        onClick={() => setSelectedEvent(ev)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30 cursor-pointer"
                      >
                        <CheckCircle2 size={12} /> Pass Ready
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(ev._id)}
                        disabled={isFull}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                          isFull
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                        }`}
                      >
                        {isFull ? 'Full' : 'RSVP'}
                      </button>
                    )}

                    {canCreate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCheckInModalEvent(ev);
                        }}
                        className="p-1 rounded-md bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Check-in station for club organizers"
                      >
                        <Ticket size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 5. EVENT DETAILS MODAL ───────────────────────── */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="glass max-w-lg w-full rounded-3xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 mb-2 inline-block">
              {selectedEvent.category}
            </span>
            <h2 className="text-2xl font-black text-white mb-1 font-['Outfit']">{selectedEvent.title}</h2>
            <p className="text-xs text-slate-400 mb-4">
              Organized by <strong className="text-white">{selectedEvent.club?.name || 'Campus Club'}</strong>
            </p>

            <div className="space-y-2.5 mb-6 bg-slate-900/80 p-4 rounded-2xl border border-white/5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock size={14} className="text-indigo-400" />
                <span>
                  <strong>Starts:</strong> {new Date(selectedEvent.startDate).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin size={14} className="text-amber-400" />
                <span>
                  <strong>Venue:</strong> {selectedEvent.venue}
                </span>
              </div>
              {selectedEvent.isOnline && selectedEvent.meetingUrl && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Video size={14} className="text-cyan-400" />
                  <a
                    href={selectedEvent.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 underline"
                  >
                    Join Virtual Session
                  </a>
                </div>
              )}
            </div>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5">About This Event</h4>
            <p className="text-slate-300 text-xs leading-relaxed mb-6 whitespace-pre-line">
              {selectedEvent.description}
            </p>

            {/* Check if user registered and has ticket */}
            {(() => {
              const reg = selectedEvent.registeredUsers?.find(
                (r) => r.user?._id === user?._id || r.user === user?._id
              );
              if (reg?.ticketCode) {
                return (
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                        Your Verified Ticket Token
                      </p>
                      <p className="text-base font-mono font-extrabold text-white tracking-widest mt-0.5">
                        {reg.ticketCode}
                      </p>
                    </div>
                    <Ticket className="text-indigo-400" size={24} />
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
              {selectedEvent.registeredUsers?.some(
                (r) => r.user?._id === user?._id || r.user === user?._id
              ) ? (
                <button
                  onClick={() => handleRegister(selectedEvent._id)}
                  className="px-4 py-2 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-600/30 cursor-pointer"
                >
                  Cancel Registration
                </button>
              ) : (
                <button
                  onClick={() => handleRegister(selectedEvent._id)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  Confirm RSVP & Get Pass
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 6. CREATE EVENT MODAL ────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="glass max-w-xl w-full rounded-xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-1 font-['Outfit']">Host New Campus Event</h2>
            <p className="text-xs text-slate-400 mb-6">
              Create an event under a registered student club or department.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Cloud Hackathon 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Hosting Club *</label>
                  <select
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    required
                  >
                    {clubs.map((c) => (
                      <option key={c._id} value={c._id} className="bg-slate-900 text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Provide schedule, prerequisites, and what attendees will learn..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">End Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Venue *</label>
                  <input
                    type="text"
                    required
                    placeholder="Auditorium B, Lab 4, etc."
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Max Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm cursor-pointer"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 7. MODAL: DIGITAL QR EVENT PASS ─────────────── */}
      {registeredTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in-up">
          <div className="w-full max-w-md rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setRegisteredTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <CheckCircle2 size={14} /> Official Verified Campus Ticket
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              {registeredTicket.eventTitle}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              📍 {registeredTicket.venue}
            </p>

            {/* QR Code */}
            <div className="p-4 bg-white rounded-xl inline-block shadow-xl my-2 border border-indigo-500/20">
              <img
                src={registeredTicket.qrCode}
                alt="Event Ticket QR"
                className="w-44 h-44 object-contain mx-auto"
              />
            </div>

            <div className="mt-3 p-3 rounded-lg bg-slate-800/80 border border-white/10 font-mono text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Ticket ID</span>
              <span className="text-sm font-bold text-indigo-300 tracking-widest">
                {registeredTicket.ticketCode}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Show this QR pass at the venue entrance. Club organizers will scan it to verify entry and award <strong className="text-amber-400">+25 Reputation Points</strong>.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => window.print()}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} /> Print Pass
              </button>
              <button
                onClick={() => setRegisteredTicket(null)}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. MODAL: CLUB ADMIN CHECK-IN STATION ───────── */}
      {checkInModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in-up">
          <div className="w-full max-w-lg rounded-xl bg-slate-900 border border-amber-500/30 p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setCheckInModalEvent(null);
                setCheckInCode('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Ticket size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Attendee Check-In Station</h3>
                <p className="text-xs text-slate-400">{checkInModalEvent.title}</p>
              </div>
            </div>

            <form onSubmit={handleCheckIn} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enter or Scan Ticket Code (e.g., CC-XXXXXXXX)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="CC-XXXXXX"
                    value={checkInCode}
                    onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
                    className="font-mono text-sm uppercase font-bold tracking-wider bg-slate-950 border border-white/15 focus:border-amber-400 rounded-lg px-3 py-2 w-full text-white"
                  />
                  <button
                    type="submit"
                    disabled={checkInLoading || !checkInCode.trim()}
                    className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 rounded-lg shrink-0 transition-colors cursor-pointer"
                  >
                    {checkInLoading ? 'Validating...' : 'Verify'}
                  </button>
                </div>
              </div>

              {/* Registered Attendees List */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300">
                    Registered Attendees ({checkInModalEvent.registeredUsers?.length || 0})
                  </span>
                  <span className="text-xs text-slate-400">
                    {checkInModalEvent.registeredUsers?.filter((r) => r.attended).length || 0} Checked In
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-white/5 pr-1">
                  {checkInModalEvent.registeredUsers?.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 text-center">No attendees registered yet.</p>
                  ) : (
                    checkInModalEvent.registeredUsers?.map((reg) => (
                      <div
                        key={reg.ticketCode || Math.random()}
                        className="flex items-center justify-between py-1.5 text-xs"
                      >
                        <div>
                          <span className="font-mono text-slate-300 font-semibold mr-2">{reg.ticketCode}</span>
                          <span className="text-slate-400">
                            {new Date(reg.registeredAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        {reg.attended ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            <CheckCircle2 size={11} /> Attended (+25 pts)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setCheckInCode(reg.ticketCode);
                            }}
                            className="text-xs text-amber-400 hover:underline cursor-pointer"
                          >
                            Quick Check-In
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
