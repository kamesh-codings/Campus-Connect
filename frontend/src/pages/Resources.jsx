import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Plus,
  X,
  FileCheck,
  Building,
  Sparkles,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['All', 'Event Poster', 'Academic Notice', 'Club Resource', 'Syllabus & Material', 'General'];

const Resources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    file: null,
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await API.get('/upload/resources');
      setResources(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load resources:', err);
      toast.error('Failed to load campus resources');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('File size exceeds 5MB limit');
      }
      setFormData({ ...formData, file });
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      return toast.error('Please select a file to upload');
    }

    try {
      setUploading(true);
      const uploadData = new FormData();
      uploadData.append('file', formData.file);

      // 1. Upload to /api/upload
      const uploadRes = await API.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 2. Save resource metadata
      await API.post('/upload/resources', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fileUrl: uploadRes.data.url,
        fileName: uploadRes.data.fileName,
        fileType: uploadRes.data.fileType,
        fileSize: uploadRes.data.size,
      });

      toast.success('Campus resource published successfully!');
      setShowUploadModal(false);
      setFormData({ title: '', description: '', category: 'General', file: null });
      fetchResources();
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(err.response?.data?.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this resource file?')) return;
    try {
      await API.delete(`/upload/resources/${id}`);
      toast.success('Resource removed');
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete resource');
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.fileName?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const formatFileSize = (bytes) => {
    if (!bytes) return '1.2 MB';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const categoryStyles = {
    'Event Poster': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    'Academic Notice': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    'Club Resource': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    'Syllabus & Material': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    'General': 'bg-slate-800 text-slate-300 border-white/10',
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-12 font-sans">
      {/* ── 1. HEADER ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles size={12} className="text-indigo-400" />
            <span>Centralized Campus Content & File Sharing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Campus Files & Resources
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Access verified event posters, academic circulars, question banks, club starter kits, and institutional handbooks.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-md shadow-indigo-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Upload size={14} /> Upload Resource
        </button>
      </div>

      {/* ── 2. SEARCH & CATEGORY FILTERS ─────────────────── */}
      <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search documents, posters, files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {filteredResources.length} files available
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. RESOURCES GRID ────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="p-10 text-center rounded-xl bg-[#0D111A] border border-white/10">
          <FileText size={40} className="mx-auto text-slate-600 mb-2.5 opacity-50" />
          <h3 className="text-base font-bold text-white">No files found</h3>
          <p className="text-slate-400 text-xs mt-1">Upload a campus poster or syllabus document to share with students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res) => {
            const isImage = res.fileType?.startsWith('image') || res.fileName?.match(/\.(jpg|jpeg|png|webp|gif)$/i);
            const canDelete = user?.role === 'admin' || user?._id === res.uploadedBy?._id;

            return (
              <div
                key={res._id}
                className="p-4 rounded-xl bg-[#0D111A] border border-white/10 hover:border-indigo-500/30 transition-all duration-200 shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Category Pill & File Type */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${categoryStyles[res.category] || categoryStyles.General}`}>
                      {res.category}
                    </span>

                    <span className="text-xs text-slate-400 font-mono">
                      {formatFileSize(res.fileSize)}
                    </span>
                  </div>

                  {/* Thumbnail / Icon preview if image */}
                  {isImage && res.fileUrl ? (
                    <div className="w-full h-32 rounded-lg overflow-hidden mb-3 border border-white/5 bg-slate-950">
                      <img
                        src={res.fileUrl}
                        alt={res.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-20 rounded-lg mb-3 border border-white/5 bg-slate-900/60 flex items-center justify-center text-slate-400">
                      <FileText size={28} className="text-indigo-400/80" />
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white mb-1 leading-snug line-clamp-2">
                    {res.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
                    {res.description || 'Official campus file uploaded for student reference.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white shrink-0">
                      {res.uploadedBy?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs text-slate-400 truncate">
                      {res.uploadedBy?.name || 'Staff'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(res._id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete file"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}

                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
                      download={res.fileName}
                    >
                      <Download size={12} /> View / Get
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 4. UPLOAD MODAL ──────────────────────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="bg-[#0D111A] max-w-lg w-full rounded-xl p-6 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl font-sans">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Upload Campus Resource</h2>
            <p className="text-xs text-slate-400 mb-5">
              Upload verified event posters, academic circulars, or club documentation.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hackathon 2026 Poster or CS8601 Syllabus"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description or purpose of this file..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select File (Max 5MB: Image or PDF) *</label>
                <div className="border border-dashed border-white/15 rounded-lg p-4 text-center hover:border-indigo-500/50 transition-colors bg-[#080B12]">
                  <input
                    type="file"
                    required
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resource-file-input"
                  />
                  <label htmlFor="resource-file-input" className="cursor-pointer block">
                    <Upload size={24} className="mx-auto text-indigo-400 mb-1.5" />
                    <span className="text-xs text-indigo-300 font-semibold block">
                      {formData.file ? formData.file.name : 'Click to select file'}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Supports PNG, JPG, WebP, and PDF up to 5MB
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {uploading ? 'Uploading...' : 'Publish File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
