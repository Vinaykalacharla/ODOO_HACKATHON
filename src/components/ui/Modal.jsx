import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useMemo, useRef } from 'react';
import { cn } from '../../lib/cn';

export default function Modal({ open, title, description, children, onClose, className }) {
  const contentRef = useRef(null);
  const titleId = useMemo(() => `modal-title-${Math.random().toString(36).slice(2, 8)}`, []);
  const descriptionId = useMemo(() => `modal-desc-${Math.random().toString(36).slice(2, 8)}`, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousActiveElement = document.activeElement;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusFirst = () => {
      const focusable = contentRef.current?.querySelectorAll(focusableSelector);
      focusable?.[0]?.focus?.();
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }

      if (event.key !== 'Tab') return;
      const focusable = Array.from(contentRef.current?.querySelectorAll(focusableSelector) || []);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    focusFirst();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousActiveElement?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-slate-950/55 px-4 py-6 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'mx-auto max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border/70 bg-[linear-gradient(180deg,#ffffff,#f7fbff)] px-6 py-5">
          <div>
            <h3 id={titleId} className="text-xl font-semibold text-text">
              {title}
            </h3>
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text transition hover:bg-[#f4f8ff]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[calc(90vh-81px)] overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
