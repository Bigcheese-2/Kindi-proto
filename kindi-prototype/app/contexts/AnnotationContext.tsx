"use client";

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Annotation } from '@/app/models/annotation-types';
import { AnnotationService } from '@/app/lib/annotation/annotationService';

interface AnnotationContextType {
  annotations: Annotation[];
  getAnnotationsForTarget: (
    targetId: string,
    targetType: 'entity' | 'event' | 'location'
  ) => Annotation[];
  createAnnotation: (
    targetId: string,
    targetType: 'entity' | 'event' | 'location',
    content: string,
    format?: 'plain' | 'markdown' | 'html',
    tags?: string[]
  ) => Annotation;
  updateAnnotation: (
    id: string,
    updates: Partial<Omit<Annotation, 'id' | 'createdAt'>>
  ) => Annotation | undefined;
  deleteAnnotation: (id: string) => boolean;
  exportAnnotations: (targetIds?: string[]) => string;
  importAnnotations: (json: string) => number;
}

const AnnotationContext = createContext<AnnotationContextType | undefined>(undefined);

export const AnnotationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const annotationService = useMemo(() => new AnnotationService(), []);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  
  // Load annotations on mount
  useEffect(() => {
    setAnnotations(annotationService.getAllAnnotations());
  }, [annotationService]);
  
  // Create context value
  const contextValue = useMemo<AnnotationContextType>(() => ({
    annotations,
    getAnnotationsForTarget: (targetId, targetType) => 
      annotationService.getAnnotationsForTarget(targetId, targetType),
    createAnnotation: (targetId, targetType, content, format, tags) => {
      const newAnnotation = annotationService.createAnnotation(
        targetId,
        targetType,
        content,
        format,
        tags
      );
      setAnnotations(annotationService.getAllAnnotations());
      return newAnnotation;
    },
    updateAnnotation: (id, updates) => {
      const updatedAnnotation = annotationService.updateAnnotation(id, updates);
      setAnnotations(annotationService.getAllAnnotations());
      return updatedAnnotation;
    },
    deleteAnnotation: (id) => {
      const result = annotationService.deleteAnnotation(id);
      setAnnotations(annotationService.getAllAnnotations());
      return result;
    },
    exportAnnotations: (targetIds) => 
      annotationService.exportAnnotations(targetIds),
    importAnnotations: (json) => {
      const count = annotationService.importAnnotations(json);
      setAnnotations(annotationService.getAllAnnotations());
      return count;
    }
  }), [annotations, annotationService]);
  
  return (
    <AnnotationContext.Provider value={contextValue}>
      {children}
    </AnnotationContext.Provider>
  );
};

// Custom hook for using annotations
export const useAnnotations = (): AnnotationContextType => {
  const context = useContext(AnnotationContext);
  
  if (!context) {
    throw new Error('useAnnotations must be used within an AnnotationProvider');
  }
  
  return context;
};
