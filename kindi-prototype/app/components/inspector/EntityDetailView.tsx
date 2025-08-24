'use client';

import React from 'react';
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
      occupation: 'Businessman',
    },
  };

  const displayEntity = entity || mockEntity;

  if (!displayEntity) {
    return <div className="text-neutral-medium p-4">Entity not found</div>;
  }

  // Helper function to get entity type label
  const getEntityTypeLabel = (type: EntityType): string => {
    switch (type) {
      case EntityType.PERSON:
        return 'Person';
      case EntityType.ORGANIZATION:
        return 'Organization';
      case EntityType.OBJECT:
        return 'Object';
      case EntityType.LOCATION:
        return 'Location';
      case EntityType.DIGITAL:
        return 'Digital';
      case EntityType.CUSTOM:
        return 'Custom';
      default:
        return 'Unknown';
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
    return currentDataset.entities.filter(entity => relatedEntityIds.includes(entity.id));
  };

  const relatedEntities = findRelatedEntities();

  // Get risk level display
  const getRiskLevel = (risk: number): { level: string; color: string; bgColor: string } => {
    if (risk >= 0.8) return { level: 'Critical', color: 'text-red-400', bgColor: 'bg-red-500' };
    if (risk >= 0.6) return { level: 'High', color: 'text-orange-400', bgColor: 'bg-orange-500' };
    if (risk >= 0.4) return { level: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-500' };
    return { level: 'Low', color: 'text-green-400', bgColor: 'bg-green-500' };
  };

  const riskInfo = getRiskLevel(displayEntity.risk || 0);

  return (
    <div className="h-full overflow-y-auto">
      {/* Header Section */}
      <div className="p-6 border-b border-secondary">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="h-9 w-9 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-neutral-light mb-1 truncate">
              {displayEntity.name}
            </h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-neutral-medium bg-secondary px-2 py-1 rounded">
                {getEntityTypeLabel(displayEntity.type)}
              </span>
              {displayEntity.risk !== undefined && (
                <span
                  className={`text-sm font-medium px-2 py-1 rounded ${riskInfo.color} bg-opacity-20`}
                >
                  {riskInfo.level} Risk
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Risk Assessment */}
        {displayEntity.risk !== undefined && (
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-neutral-light">Risk Assessment</h4>
              <span className={`text-sm font-semibold ${riskInfo.color}`}>
                {Math.round(displayEntity.risk * 100)}%
              </span>
            </div>
            <div className="w-full h-3 bg-primary rounded-full overflow-hidden">
              <div
                className={`h-full ${riskInfo.bgColor} transition-all duration-300 ease-out`}
                style={{ width: `${displayEntity.risk * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-medium mt-2">
              <span>Low</span>
              <span>Critical</span>
            </div>
          </div>
        )}

        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary rounded-lg p-4">
            <h4 className="text-xs font-medium text-neutral-medium uppercase tracking-wide mb-2">
              Last Activity
            </h4>
            <div className="text-sm text-neutral-light font-medium">2 hours ago</div>
            <div className="text-xs text-neutral-medium mt-1">Financial transaction</div>
          </div>

          <div className="bg-secondary rounded-lg p-4">
            <h4 className="text-xs font-medium text-neutral-medium uppercase tracking-wide mb-2">
              Connections
            </h4>
            <div className="text-sm text-neutral-light font-medium">14 direct</div>
            <div className="text-xs text-neutral-medium mt-1">47 indirect</div>
          </div>
        </div>

        {/* Attributes */}
        {displayEntity.attributes && (
          <div>
            <h4 className="text-sm font-medium text-neutral-light mb-3">Profile Information</h4>
            <div className="space-y-3">
              {Object.entries(displayEntity.attributes).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2 border-b border-secondary border-opacity-50"
                >
                  <span className="text-sm text-neutral-medium capitalize">
                    {key.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-neutral-light font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Associated Locations */}
        <div>
          <h4 className="text-sm font-medium text-neutral-light mb-3">Associated Locations</h4>
          <div className="flex flex-wrap gap-2">
            {['Moscow', 'Berlin', 'London'].map(location => (
              <span
                key={location}
                className="inline-flex items-center px-3 py-1.5 rounded-md bg-secondary text-sm text-neutral-light hover:bg-opacity-80 transition-colors cursor-pointer"
              >
                <svg
                  className="w-3 h-3 mr-1.5 text-neutral-medium"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {location}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div>
          <h4 className="text-sm font-medium text-neutral-light mb-4">Recent Activity</h4>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-light font-medium">
                    Financial transaction detected
                  </p>
                  <span className="text-xs text-neutral-medium">2h ago</span>
                </div>
                <p className="text-xs text-neutral-medium mt-1">
                  $50,000 transfer to offshore account
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-light font-medium">Communication intercept</p>
                  <span className="text-xs text-neutral-medium">6h ago</span>
                </div>
                <p className="text-xs text-neutral-medium mt-1">
                  Encrypted messaging with known associate
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-light font-medium">Location update</p>
                  <span className="text-xs text-neutral-medium">1d ago</span>
                </div>
                <p className="text-xs text-neutral-medium mt-1">
                  Arrived at Hotel Metropol, Moscow
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Entities */}
        {relatedEntities.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-neutral-light mb-3">Related Entities</h4>
            <div className="space-y-2">
              {relatedEntities.slice(0, 3).map(entity => (
                <button
                  key={entity.id}
                  onClick={() => selectEntity(entity.id)}
                  className="w-full flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-opacity-80 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent rounded flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-light font-medium">{entity.name}</div>
                      <div className="text-xs text-neutral-medium">
                        {getEntityTypeLabel(entity.type)}
                      </div>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-neutral-medium"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
