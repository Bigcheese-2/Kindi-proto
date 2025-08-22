"use client";

import React, { useState } from 'react';
import { getReportTemplates, ReportTemplate, createReportFromTemplate, ReportData } from '@/app/lib/export/reportExport';

interface ReportTemplateSelectorProps {
  onSelectTemplate: (reportData: ReportData) => void;
  onCancel: () => void;
}

const ReportTemplateSelector: React.FC<ReportTemplateSelectorProps> = ({
  onSelectTemplate,
  onCancel
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  
  const templates = getReportTemplates();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplateId || !title) {
      return;
    }
    
    try {
      const reportData = createReportFromTemplate(
        selectedTemplateId,
        title,
        description
      );
      
      // Add author if provided
      if (author) {
        reportData.author = author;
      }
      
      onSelectTemplate(reportData);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Report</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onCancel}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="template" className="block text-sm font-medium mb-1">Template</label>
            <select
              id="template"
              value={selectedTemplateId}
              onChange={e => setSelectedTemplateId(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select a template...</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            
            {selectedTemplateId && (
              <p className="text-sm text-gray-500 mt-1">
                {templates.find(t => t.id === selectedTemplateId)?.description}
              </p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title*</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Report title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Report description"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="author" className="block text-sm font-medium mb-1">Author</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Your name"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button"
              className="px-4 py-2 border rounded hover:bg-gray-100"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!selectedTemplateId || !title}
            >
              Create Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportTemplateSelector;
