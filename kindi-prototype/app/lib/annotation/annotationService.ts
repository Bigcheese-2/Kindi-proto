"use client";

import { Annotation } from '@/app/models/annotation-types';

/**
 * Service for managing annotations
 */
export class AnnotationService {
  private annotations: Map<string, Annotation> = new Map();
  
  constructor() {
    this.loadAnnotations();
  }
  
  /**
   * Get all annotations
   * @returns Array of all annotations
   */
  getAllAnnotations(): Annotation[] {
    return Array.from(this.annotations.values());
  }
  
  /**
   * Get annotations for a specific target
   * @param targetId Target ID
   * @param targetType Target type
   * @returns Array of annotations for the target
   */
  getAnnotationsForTarget(
    targetId: string,
    targetType: 'entity' | 'event' | 'location'
  ): Annotation[] {
    return this.getAllAnnotations().filter(
      annotation => 
        annotation.targetId === targetId && 
        annotation.targetType === targetType
    );
  }
  
  /**
   * Get annotation by ID
   * @param id Annotation ID
   * @returns Annotation or undefined if not found
   */
  getAnnotation(id: string): Annotation | undefined {
    return this.annotations.get(id);
  }
  
  /**
   * Create a new annotation
   * @param targetId Target ID
   * @param targetType Target type
   * @param content Annotation content
   * @param format Content format
   * @param tags Optional tags
   * @returns Created annotation
   */
  createAnnotation(
    targetId: string,
    targetType: 'entity' | 'event' | 'location',
    content: string,
    format: 'plain' | 'markdown' | 'html' = 'plain',
    tags?: string[]
  ): Annotation {
    const id = `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const annotation: Annotation = {
      id,
      targetId,
      targetType,
      content,
      format,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags
    };
    
    this.annotations.set(id, annotation);
    this.saveAnnotations();
    
    return annotation;
  }
  
  /**
   * Update an existing annotation
   * @param id Annotation ID
   * @param updates Updates to apply
   * @returns Updated annotation or undefined if not found
   */
  updateAnnotation(
    id: string,
    updates: Partial<Omit<Annotation, 'id' | 'createdAt'>>
  ): Annotation | undefined {
    const annotation = this.getAnnotation(id);
    
    if (!annotation) {
      return undefined;
    }
    
    const updatedAnnotation = {
      ...annotation,
      ...updates,
      updatedAt: Date.now()
    };
    
    this.annotations.set(id, updatedAnnotation);
    this.saveAnnotations();
    
    return updatedAnnotation;
  }
  
  /**
   * Delete an annotation
   * @param id Annotation ID
   * @returns True if deleted, false if not found
   */
  deleteAnnotation(id: string): boolean {
    const result = this.annotations.delete(id);
    
    if (result) {
      this.saveAnnotations();
    }
    
    return result;
  }
  
  /**
   * Delete all annotations for a target
   * @param targetId Target ID
   * @param targetType Target type
   * @returns Number of annotations deleted
   */
  deleteAnnotationsForTarget(
    targetId: string,
    targetType: 'entity' | 'event' | 'location'
  ): number {
    const annotationsToDelete = this.getAnnotationsForTarget(targetId, targetType);
    
    for (const annotation of annotationsToDelete) {
      this.annotations.delete(annotation.id);
    }
    
    this.saveAnnotations();
    
    return annotationsToDelete.length;
  }
  
  /**
   * Export annotations to JSON
   * @param targetIds Optional array of target IDs to export
   * @returns JSON string of annotations
   */
  exportAnnotations(targetIds?: string[]): string {
    let annotationsToExport = this.getAllAnnotations();
    
    if (targetIds && targetIds.length > 0) {
      annotationsToExport = annotationsToExport.filter(
        annotation => targetIds.includes(annotation.targetId)
      );
    }
    
    return JSON.stringify(annotationsToExport, null, 2);
  }
  
  /**
   * Import annotations from JSON
   * @param json JSON string of annotations
   * @returns Number of annotations imported
   */
  importAnnotations(json: string): number {
    try {
      const importedAnnotations = JSON.parse(json) as Annotation[];
      
      if (!Array.isArray(importedAnnotations)) {
        throw new Error('Invalid annotations format');
      }
      
      let importCount = 0;
      
      for (const annotation of importedAnnotations) {
        // Validate annotation
        if (
          !annotation.id ||
          !annotation.targetId ||
          !annotation.targetType ||
          !annotation.content ||
          !annotation.format ||
          !annotation.createdAt ||
          !annotation.updatedAt
        ) {
          continue;
        }
        
        this.annotations.set(annotation.id, annotation);
        importCount++;
      }
      
      if (importCount > 0) {
        this.saveAnnotations();
      }
      
      return importCount;
    } catch (error) {
      console.error('Error importing annotations:', error);
      return 0;
    }
  }
  
  /**
   * Save annotations to local storage
   */
  private saveAnnotations(): void {
    try {
      // Check if we're running in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(
          'annotations',
          JSON.stringify(Array.from(this.annotations.values()))
        );
      }
    } catch (error) {
      console.error('Error saving annotations:', error);
    }
  }
  
  /**
   * Load annotations from local storage
   */
  private loadAnnotations(): void {
    try {
      // Check if we're running in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedAnnotations = localStorage.getItem('annotations');
        
        if (storedAnnotations) {
          const parsedAnnotations = JSON.parse(storedAnnotations) as Annotation[];
          
          this.annotations.clear();
          
          for (const annotation of parsedAnnotations) {
            this.annotations.set(annotation.id, annotation);
          }
        }
      }
    } catch (error) {
      console.error('Error loading annotations:', error);
    }
  }
}
