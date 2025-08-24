"use client";

import { useData } from '@/app/contexts/DataContext';
import { Entity, EntityType } from '@/app/models/data-types';
import { useSelection } from '@/app/contexts/SelectionContext';

interface EntityDetailViewProps {
  entityId: string;
}

export default function EntityDetailView({ entityId }: EntityDetailViewProps) {
  const { currentDataset } = useData();
  const { selectEntity } = useSelection();
  
  // Find the entity in the current dataset
  const entity = currentDataset?.entities.find(e => e.id === entityId);
  
  // If entity not found, create a mock entity for demonstration purposes
  const mockEntity = {
    id: 'viktor-petrov',
    name: 'Viktor Petrov',
    type: EntityType.PERSON,
    risk: 0.8,
    attributes: {
      nationality: 'Russian',
      age: '42',
      occupation: 'Businessman'
    }
  };
  
  const displayEntity = entity || mockEntity;
  
  if (!displayEntity) {
    return <div className="text-neutral-medium p-4">Entity not found</div>;
  }

  // Helper function to get entity type label
  const getEntityTypeLabel = (type: EntityType): string => {
    switch(type) {
      case EntityType.PERSON: return 'Person';
      case EntityType.ORGANIZATION: return 'Organization';
      case EntityType.OBJECT: return 'Object';
      case EntityType.LOCATION: return 'Location';
      case EntityType.DIGITAL: return 'Digital';
      case EntityType.CUSTOM: return 'Custom';
      default: return 'Unknown';
    }
  };

  // Find related entities (relationships)
  const findRelatedEntities = (): Entity[] => {
    if (!currentDataset) return [];
    
    // Get relationships where this entity is either source or target
    const relationships = currentDataset.relationships.filter(
      rel => rel.source === entityId || rel.target === entityId
    );
    
    // Get the IDs of the other entities in these relationships
    const relatedEntityIds = relationships.map(rel => 
      rel.source === entityId ? rel.target : rel.source
    );
    
    // Return the actual entity objects
    return currentDataset.entities.filter(entity => 
      relatedEntityIds.includes(entity.id)
    );
  };
  
  const relatedEntities = findRelatedEntities();

  // Get appropriate icon based on entity type
  const getEntityIcon = (type: EntityType) => {
    switch(type) {
      case EntityType.PERSON:
        return (
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case EntityType.ORGANIZATION:
        return (
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
    }
  };

  // Get badge color based on risk level
  const getRiskBadgeColor = (risk: number) => {
    if (risk >= 0.7) return 'bg-red-500';
    if (risk >= 0.4) return 'bg-orange-500';
    return 'bg-green-500';
  };

  // Format risk level text
  const getRiskLevelText = (risk: number) => {
    if (risk >= 0.7) return 'High';
    if (risk >= 0.4) return 'Medium';
    return 'Low';
  };

  return (
    <div className="p-5 space-y-6 w-full max-w-full">
      {/* Header Section with Avatar and Basic Info */}
      <div className="flex items-center max-w-full bg-secondary rounded-xl p-4">
        <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
          {getEntityIcon(displayEntity.type)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center mb-1">
            <h3 className="text-neutral-light font-semibold text-xl truncate">{displayEntity.name}</h3>
            {displayEntity.risk !== undefined && (
              <span className={`ml-2 px-2 py-0.5 text-xs text-white font-medium rounded-full ${getRiskBadgeColor(displayEntity.risk)}`}>
                {getRiskLevelText(displayEntity.risk)}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <div className="text-sm text-neutral-medium">{getEntityTypeLabel(displayEntity.type)}</div>
            <span className="mx-2 text-neutral-medium">•</span>
            <div className="text-sm text-neutral-medium">ID: {displayEntity.id}</div>
          </div>
        </div>
      </div>
      
      {/* Risk Meter */}
      {displayEntity.risk !== undefined && (
        <div className="max-w-full bg-secondary rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-neutral-light">RISK ASSESSMENT</h4>
            <span className={`text-xs ${displayEntity.risk >= 0.7 ? 'text-red-500' : displayEntity.risk >= 0.4 ? 'text-orange-500' : 'text-green-500'} font-medium`}>
              {Math.round(displayEntity.risk * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#374151] rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getRiskBadgeColor(displayEntity.risk)}`}
              style={{ width: `${displayEntity.risk * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Attributes Section */}
      <div className="max-w-full bg-secondary rounded-xl p-4">
        <h4 className="text-sm font-medium text-neutral-light mb-3">ATTRIBUTES</h4>
        <div className="grid grid-cols-2 gap-4">
          {displayEntity.attributes && Object.entries(displayEntity.attributes).map(([key, value]) => (
            <div key={key} className="bg-[#374151] rounded-lg p-3">
              <div className="text-xs text-neutral-medium uppercase">{key}</div>
              <div className="text-neutral-light font-medium mt-1">{value as string}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Activity & Connections */}
      <div className="grid grid-cols-2 gap-4 max-w-full">
        <div className="bg-secondary rounded-xl p-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">LAST ACTIVITY</h4>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
            <div className="text-neutral-light">2 hours ago</div>
          </div>
        </div>
        
        <div className="bg-secondary rounded-xl p-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">CONNECTIONS</h4>
          <div className="text-neutral-light">
            <span className="font-semibold">14</span> direct, 
            <span className="font-semibold ml-1">47</span> indirect
          </div>
        </div>
      </div>
      
      {/* Locations */}
      <div className="max-w-full bg-secondary rounded-xl p-4">
        <h4 className="text-sm font-medium text-neutral-light mb-3">LOCATIONS</h4>
        <div className="flex flex-wrap gap-2">
          <div className="bg-[#374151] rounded-lg px-3 py-1.5 text-neutral-light text-sm flex items-center">
            <svg className="h-4 w-4 mr-1.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Moscow
          </div>
          <div className="bg-[#374151] rounded-lg px-3 py-1.5 text-neutral-light text-sm flex items-center">
            <svg className="h-4 w-4 mr-1.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Berlin
          </div>
          <div className="bg-[#374151] rounded-lg px-3 py-1.5 text-neutral-light text-sm flex items-center">
            <svg className="h-4 w-4 mr-1.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            London
          </div>
        </div>
      </div>
      
      {/* Recent Events Timeline */}
      <div className="max-w-full bg-secondary rounded-xl p-4">
        <h4 className="text-sm font-medium text-neutral-light mb-4">RECENT EVENTS</h4>
        
        <div className="space-y-4">
          <div className="relative pl-6 pb-4 border-l border-[#374151]">
            <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-secondary"></div>
            <div className="text-sm text-neutral-light font-medium">Financial transaction detected</div>
            <div className="text-xs text-neutral-medium mt-1">2 hours ago</div>
          </div>
          
          <div className="relative pl-6 pb-4 border-l border-[#374151]">
            <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-secondary"></div>
            <div className="text-sm text-neutral-light font-medium">Communication intercept</div>
            <div className="text-xs text-neutral-medium mt-1">6 hours ago</div>
          </div>
          
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-secondary"></div>
            <div className="text-sm text-neutral-light font-medium">Location update</div>
            <div className="text-xs text-neutral-medium mt-1">Yesterday, 18:30</div>
          </div>
        </div>
      </div>
    </div>
  );
}