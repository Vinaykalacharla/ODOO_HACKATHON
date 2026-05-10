import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { cn } from '../../lib/cn';

const variantStyles = {
  success: 'border-teal-200 bg-white text-text',
  error: 'border-rose-200 bg-white text-text',
  info: 'border-sky-200 bg-white text-text',
};

const accentStyles = {
  success: 'bg-teal-500',
  error: 'bg-rose-500',
  info: 'bg-sky-500',
};

function variantIcon(variant) {
  switch (variant) {
    case 'success':
      return CheckCircle2;
    case 'error':
      return CircleAlert;
    default:
      return Info;
  }
}

export default function ToastHost() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[60] flex w-full max-w-md flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = variantIcon(toast.variant);
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto relative overflow-hidden rounded-[1.5rem] border px-4 py-3.5 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur',
              variantStyles[toast.variant] || variantStyles.info,
            )}
          >
            <div className={cn('absolute inset-y-0 left-0 w-1.5', accentStyles[toast.variant] || accentStyles.info)} />
            <div className="flex items-start gap-3 pl-2">
              <div
                className={cn(
                  'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  toast.variant === 'success'
                    ? 'bg-teal-50 text-teal-700'
                    : toast.variant === 'error'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-sky-50 text-sky-700',
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text">{toast.title}</p>
                {toast.description ? <p className="mt-1 text-sm text-muted">{toast.description}</p> : null}
              </div>
              <button type="button" onClick={() => removeToast(toast.id)} className="focus-ring rounded-full p-1 text-muted transition hover:text-text">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
