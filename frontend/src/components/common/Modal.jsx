import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Universal Portal-based Modal Component
 * Renders directly onto document.body to bypass any ancestor CSS transforms
 * Guarantees centered placement in the active viewport without page scrolling.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  maxWidth = 'max-w-xl',
  children,
  footer,
}) => {
  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm transition-all duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full ${maxWidth} bg-[#0D111A] border border-white/15 rounded-2xl shadow-2xl shadow-black/90 flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-200 animate-in fade-in zoom-in-95`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Fixed at top) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 shrink-0 bg-slate-900/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Icon size={18} />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-white tracking-tight leading-snug">{title}</h3>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body (Scrollable if height exceeds viewport) */}
        <div className="px-5 sm:px-6 py-4 overflow-y-auto flex-1 space-y-4 overscroll-contain">
          {children}
        </div>

        {/* Modal Footer (Fixed at bottom, never scrolled out of view) */}
        {footer && (
          <div className="px-5 sm:px-6 py-3.5 border-t border-white/10 bg-slate-900/80 backdrop-blur-md shrink-0 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
