import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';

const items = [
  { to: '', label: 'Overview' },
  { to: 'builder', label: 'Builder' },
  { to: 'view', label: 'View' },
  { to: 'budget', label: 'Budget' },
  { to: 'packing', label: 'Packing' },
  { to: 'notes', label: 'Notes' },
];

export default function TripSubnav({ basePath }) {
  return (
    <div className="overflow-x-auto rounded-full border border-border bg-white p-1 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <div className="flex min-w-max gap-1">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={`${basePath}${item.to ? `/${item.to}` : ''}`}
            end={item.to === ''}
            className={({ isActive }) =>
              cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition duration-200',
                isActive
                  ? 'bg-[linear-gradient(135deg,#2563eb,#1d4ed8)] text-white shadow-[0_12px_25px_rgba(37,99,235,0.22)]'
                  : 'text-muted hover:bg-[#eef4ff] hover:text-[#1d4ed8]',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
