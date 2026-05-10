import Button from './Button';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#d7e1ef] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,251,0.92))] px-6 py-10 text-center shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
      {Icon ? (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.12))] text-accent">
          <Icon className="h-7 w-7" />
        </div>
      ) : null}
      <h3 className="mt-5 text-2xl font-semibold text-text">{title}</h3>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted">{description}</p>
      {actionLabel ? (
        <Button className="mt-6" onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
