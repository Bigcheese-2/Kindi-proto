"use client";

import { useState, useEffect } from 'react';
import { useFilters } from '@/app/contexts/FilterContext';

export default function TimeRangeFilter() {
  const { filters, addFilter } = useFilters();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  
  // Find existing time range filter
  const existingFilter = filters.find(
    filter => filter.type === 'timeRange'
  ) as any;
  
  // Initialize dates from existing filter
  useEffect(() => {
    if (existingFilter) {
      setStartDate(existingFilter.startTime);
      setEndDate(existingFilter.endTime);
    }
  }, [existingFilter]);
  
  // Apply filter when dates change
  const applyFilter = () => {
    if (startDate || endDate) {
      addFilter({
        type: 'timeRange',
        startTime: startDate,
        endTime: endDate
      });
    }
  };

  // Create relative time range helper
  const createRelativeTimeRange = (unit: 'day' | 'week' | 'month' | 'year', amount: number) => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch(unit) {
      case 'day':
        startDate.setDate(startDate.getDate() - amount);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - (amount * 7));
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - amount);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - amount);
        break;
    }
    
    return {
      startTime: startDate.toISOString().split('T')[0],
      endTime: endDate.toISOString().split('T')[0]
    };
  };
  
  return (
    <div className="time-range-filter mb-4">
      <h3 className="text-sm font-medium text-neutral-light mb-3">Time Range</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div>
            <label htmlFor="start-date" className="text-xs text-neutral-medium">
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              className="w-full mt-1 p-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-neutral-light"
              value={startDate || ''}
              onChange={e => {
                setStartDate(e.target.value || null);
                applyFilter();
              }}
            />
          </div>
          
          <div>
            <label htmlFor="end-date" className="text-xs text-neutral-medium">
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              className="w-full mt-1 p-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-neutral-light"
              value={endDate || ''}
              onChange={e => {
                setEndDate(e.target.value || null);
                applyFilter();
              }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button 
            className="bg-gray-700 text-neutral-light rounded p-1.5 hover:bg-gray-600"
            onClick={() => {
              const range = createRelativeTimeRange('day', 7);
              setStartDate(range.startTime);
              setEndDate(range.endTime);
              applyFilter();
            }}
          >
            Last 7 Days
          </button>
          
          <button 
            className="bg-gray-700 text-neutral-light rounded p-1.5 hover:bg-gray-600"
            onClick={() => {
              const range = createRelativeTimeRange('month', 1);
              setStartDate(range.startTime);
              setEndDate(range.endTime);
              applyFilter();
            }}
          >
            Last Month
          </button>
          
          <button 
            className="bg-gray-700 text-neutral-light rounded p-1.5 hover:bg-gray-600"
            onClick={() => {
              const range = createRelativeTimeRange('month', 3);
              setStartDate(range.startTime);
              setEndDate(range.endTime);
              applyFilter();
            }}
          >
            Last 3 Months
          </button>
          
          <button 
            className="bg-gray-700 text-neutral-light rounded p-1.5 hover:bg-gray-600"
            onClick={() => {
              const range = createRelativeTimeRange('year', 1);
              setStartDate(range.startTime);
              setEndDate(range.endTime);
              applyFilter();
            }}
          >
            Last Year
          </button>
        </div>
      </div>
    </div>
  );
}
