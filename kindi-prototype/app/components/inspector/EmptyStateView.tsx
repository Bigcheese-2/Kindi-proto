"use client";

export default function EmptyStateView() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <svg 
        className="w-16 h-16 text-neutral-medium mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1} 
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <h3 className="text-lg font-medium text-neutral-light mb-2">No Selection</h3>
      <p className="text-neutral-medium">
        Select an entity, event, or location from any visualization to see detailed information.
      </p>
    </div>
  );
}
