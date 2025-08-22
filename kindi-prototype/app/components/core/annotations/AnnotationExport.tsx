"use client";

import React, { useState } from 'react';
import { useAnnotations } from '@/app/contexts/AnnotationContext';

interface AnnotationExportProps {
  targetId?: string;
  targetType?: 'entity' | 'event' | 'location';
  onClose: () => void;
}

const AnnotationExport: React.FC<AnnotationExportProps> = ({
  targetId,
  targetType,
  onClose
}) => {
  const { annotations, exportAnnotations } = useAnnotations();
  const [exportType, setExportType] = useState<'selected' | 'all'>('selected');
  const [includeMetadata, setIncludeMetadata] = useState<boolean>(true);
  const [exportFormat, setExportFormat] = useState<'json' | 'html' | 'markdown'>('json');
  
  // Get annotations based on selection
  const getAnnotationsToExport = () => {
    if (exportType === 'selected' && targetId && targetType) {
      return annotations.filter(
        annotation => annotation.targetId === targetId && annotation.targetType === targetType
      );
    }
    
    return annotations;
  };
  
  // Handle export
  const handleExport = () => {
    const annotationsToExport = getAnnotationsToExport();
    
    if (annotationsToExport.length === 0) {
      alert('No annotations to export');
      return;
    }
    
    let exportData;
    let mimeType;
    let fileExtension;
    
    switch (exportFormat) {
      case 'json':
        exportData = JSON.stringify(
          includeMetadata 
            ? {
                exportedAt: new Date().toISOString(),
                count: annotationsToExport.length,
                annotations: annotationsToExport
              }
            : annotationsToExport,
          null, 2
        );
        mimeType = 'application/json';
        fileExtension = 'json';
        break;
      case 'html':
        exportData = generateHtmlExport(annotationsToExport);
        mimeType = 'text/html';
        fileExtension = 'html';
        break;
      case 'markdown':
        exportData = generateMarkdownExport(annotationsToExport);
        mimeType = 'text/markdown';
        fileExtension = 'md';
        break;
      default:
        exportData = '';
        mimeType = 'text/plain';
        fileExtension = 'txt';
    }
    
    // Create a blob and download it
    const blob = new Blob([exportData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `annotations-export-${Date.now()}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onClose();
  };
  
  // Generate HTML export
  const generateHtmlExport = (annotationsToExport: any[]): string => {
    const annotationsHtml = annotationsToExport.map(annotation => `
      <div class="annotation">
        <h3>Annotation for ${annotation.targetType}: ${annotation.targetId}</h3>
        <div class="content">
          ${annotation.format === 'html' 
            ? annotation.content 
            : `<pre>${annotation.content}</pre>`}
        </div>
        <div class="metadata">
          <p>Created: ${new Date(annotation.createdAt).toLocaleString()}</p>
          <p>Updated: ${new Date(annotation.updatedAt).toLocaleString()}</p>
          ${annotation.tags 
            ? `<p>Tags: ${annotation.tags.join(', ')}</p>` 
            : ''}
        </div>
      </div>
    `).join('\n');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Exported Annotations</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .annotation {
            margin-bottom: 30px;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 5px;
          }
          h1, h2, h3 {
            color: #333;
          }
          .metadata {
            font-size: 0.9em;
            color: #666;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #eee;
          }
          pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 3px;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <h1>Exported Annotations</h1>
        ${includeMetadata ? `
          <div class="export-metadata">
            <p>Exported on: ${new Date().toLocaleString()}</p>
            <p>Total annotations: ${annotationsToExport.length}</p>
          </div>
        ` : ''}
        <div class="annotations">
          ${annotationsHtml}
        </div>
      </body>
      </html>
    `;
  };
  
  // Generate Markdown export
  const generateMarkdownExport = (annotationsToExport: any[]): string => {
    const annotationsMd = annotationsToExport.map(annotation => `
### Annotation for ${annotation.targetType}: ${annotation.targetId}

${annotation.content}

**Created:** ${new Date(annotation.createdAt).toLocaleString()}  
**Updated:** ${new Date(annotation.updatedAt).toLocaleString()}  
${annotation.tags ? `**Tags:** ${annotation.tags.join(', ')}` : ''}
    `).join('\n\n---\n\n');
    
    return `# Exported Annotations

${includeMetadata ? `
*Exported on: ${new Date().toLocaleString()}*  
*Total annotations: ${annotationsToExport.length}*

---
` : ''}

${annotationsMd}
    `;
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Export Annotations</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Export Scope</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exportType"
                  value="selected"
                  checked={exportType === 'selected'}
                  onChange={() => setExportType('selected')}
                  className="mr-2"
                  disabled={!targetId || !targetType}
                />
                <span>
                  {targetId && targetType 
                    ? `Export annotations for selected ${targetType}` 
                    : 'No item selected'}
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exportType"
                  value="all"
                  checked={exportType === 'all'}
                  onChange={() => setExportType('all')}
                  className="mr-2"
                />
                <span>Export all annotations</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Export Format</label>
            <select
              value={exportFormat}
              onChange={e => setExportFormat(e.target.value as any)}
              className="w-full border rounded p-2"
            >
              <option value="json">JSON</option>
              <option value="html">HTML</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeMetadata}
                onChange={e => setIncludeMetadata(e.target.checked)}
                className="mr-2"
              />
              <span>Include export metadata</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end mt-6 space-x-2">
          <button
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleExport}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnotationExport;
