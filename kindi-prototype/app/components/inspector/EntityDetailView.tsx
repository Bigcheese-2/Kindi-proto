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
  
  if (!entity) {
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
    <div className="p-4">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center mr-3">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-neutral-light font-medium">{entity.name}</h3>
          <div className="text-xs text-neutral-medium">{getEntityTypeLabel(entity.type)}</div>
        </div>
      </div>
      
      {entity.risk !== undefined && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">RISK LEVEL</h4>
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-warning rounded-full" 
              style={{ width: `${entity.risk * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-xs text-warning font-medium">
              {entity.risk < 0.3 ? 'Low' : entity.risk < 0.7 ? 'Medium' : 'High'}
            </span>
          </div>
        </div>
      )}
      
      {entity.attributes && Object.keys(entity.attributes).length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">ATTRIBUTES</h4>
          <div className="bg-primary rounded-md p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(entity.attributes).map(([key, value]) => (
                <React.Fragment key={key}>
                  <div className="text-neutral-medium">{key}:</div>
                  <div className="text-neutral-light">{value.toString()}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {relatedEntities.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">CONNECTIONS</h4>
          <div className="space-y-2">
            {relatedEntities.map(relatedEntity => {
              // Find the relationship between entities
              const relationship = currentDataset?.relationships.find(
                rel => (rel.source === entityId && rel.target === relatedEntity.id) || 
                      (rel.source === relatedEntity.id && rel.target === entityId)
              );
              
              return (
                <div 
                  key={relatedEntity.id} 
                  className="bg-primary rounded-md p-2 flex justify-between items-center cursor-pointer hover:bg-gray-700"
                  onClick={() => selectEntity(relatedEntity.id)}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center mr-2">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-neutral-light">{relatedEntity.name}</span>
                  </div>
                  {relationship && (
                    <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">
                      {relationship.type}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
