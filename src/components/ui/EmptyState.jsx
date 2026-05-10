import React from 'react';
import { Search } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon = Search, 
  title = "No results found", 
  description = "Try adjusting your filters or search terms.", 
  actionLabel, 
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="bg-bg p-6 rounded-full mb-6">
        <Icon className="h-12 w-12 text-muted/40" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted max-w-sm mb-8">{description}</p>
      {actionLabel && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
