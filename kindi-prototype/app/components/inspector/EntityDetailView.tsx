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

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-accent rounded-md flex items-center justify-center mr-3">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-neutral-light font-medium text-lg">{displayEntity.name}</h3>
          <div className="text-sm text-neutral-medium">Person of Interest</div>
        </div>
      </div>
      
      {displayEntity.risk !== undefined && (
        <div>
          <h4 className="text-xs font-medium text-neutral-light mb-2">RISK LEVEL</h4>
          <div className="w-full h-2 bg-secondary rounded-full">
            <div 
              className="h-full bg-orange-500 rounded-full" 
              style={{ width: `${displayEntity.risk * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-xs text-orange-500 font-medium">
              High
            </span>
          </div>
        </div>
      )}
      
      <div>
        <h4 className="text-xs font-medium text-neutral-light mb-2">LAST ACTIVITY</h4>
        <div className="text-xs text-neutral-medium">2 hours ago</div>
      </div>
      
      <div>
        <h4 className="text-xs font-medium text-neutral-light mb-2">CONNECTIONS</h4>
        <div className="text-neutral-light text-base font-medium">14 direct, 47 indirect</div>
      </div>
      
      <div>
        <h4 className="text-xs font-medium text-neutral-light mb-2">LOCATIONS</h4>
        <div className="flex flex-wrap gap-2">
          <div className="bg-secondary rounded-md px-4 py-2 text-neutral-light text-sm">
            Moscow
          </div>
          <div className="bg-secondary rounded-md px-4 py-2 text-neutral-light text-sm">
            Berlin
          </div>
          <div className="bg-secondary rounded-md px-4 py-2 text-neutral-light text-sm">
            London
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-xl font-medium text-neutral-light mb-4">Recent Events</h4>
        
        <div className="space-y-8">
          <div className="relative pl-6">
            <div className="absolute left-0 top-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="text-base text-neutral-light font-medium">Financial transaction detected</div>
            <div className="text-sm text-neutral-medium mt-1">2 hours ago</div>
          </div>
          
          <div className="relative pl-6">
            <div className="absolute left-0 top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="text-base text-neutral-light font-medium">Communication intercept</div>
            <div className="text-sm text-neutral-medium mt-1">6 hours ago</div>
          </div>
          
          <div className="relative pl-6">
            <div className="absolute left-0 top-1.5 w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="text-base text-neutral-light font-medium">Location update</div>
            <div className="text-sm text-neutral-medium mt-1">Yesterday, 18:30</div>
          </div>
        </div>
      </div>
    </div>
  );
}
