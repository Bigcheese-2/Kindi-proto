"use client";

import React, { useState } from 'react';
import { ReportData, ReportSection } from '@/app/lib/export/reportExport';
import ExportButton from './ExportButton';

interface ReportEditorProps {
  reportData: ReportData;
  onSave: (reportData: ReportData) => void;
  onClose: () => void;
}

const ReportEditor: React.FC<ReportEditorProps> = ({
  reportData,
  onSave,
  onClose
}) => {
  const [report, setReport] = useState<ReportData>(reportData);
  
  // Update report title
  const updateTitle = (title: string) => {
    setReport(prev => ({
      ...prev,
      title
    }));
  };
  
  // Update report description
  const updateDescription = (description: string) => {
    setReport(prev => ({
      ...prev,
      description
    }));
  };
  
  // Update section title
  const updateSectionTitle = (sectionId: string, title: string) => {
    setReport(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, title } 
          : section
      )
    }));
  };
  
  // Update section content
  const updateSectionContent = (sectionId: string, content: string) => {
    setReport(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, content } 
          : section
      )
    }));
  };
  
  // Add a new section
  const addSection = (type: ReportSection['type'] = 'text') => {
    const newSection: ReportSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Section',
      content: '',
      type
    };
    
    setReport(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };
  
  // Remove a section
  const removeSection = (sectionId: string) => {
    setReport(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };
  
  // Move section up
  const moveSectionUp = (sectionId: string) => {
    const sectionIndex = report.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex <= 0) return;
    
    const newSections = [...report.sections];
    const temp = newSections[sectionIndex - 1];
    newSections[sectionIndex - 1] = newSections[sectionIndex];
    newSections[sectionIndex] = temp;
    
    setReport(prev => ({
      ...prev,
      sections: newSections
    }));
  };
  
  // Move section down
  const moveSectionDown = (sectionId: string) => {
    const sectionIndex = report.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1 || sectionIndex >= report.sections.length - 1) return;
    
    const newSections = [...report.sections];
    const temp = newSections[sectionIndex + 1];
    newSections[sectionIndex + 1] = newSections[sectionIndex];
    newSections[sectionIndex] = temp;
    
    setReport(prev => ({
      ...prev,
      sections: newSections
    }));
  };
  
  // Handle save button click
  const handleSave = () => {
    onSave(report);
  };
  
  return (
    <div className="report-editor">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Edit Report</h2>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSave}
          >
            Save
          </button>
          <ExportButton
            exportType="report"
            data={report}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          />
        </div>
      </div>
      
      <div className="report-metadata mb-6 space-y-4">
        <div className="form-group">
          <label htmlFor="report-title" className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            id="report-title"
            value={report.title}
            onChange={e => updateTitle(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="report-description" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="report-description"
            value={report.description}
            onChange={e => updateDescription(e.target.value)}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>
      </div>
      
      <div className="report-sections space-y-6">
        <h3 className="text-xl font-medium">Sections</h3>
        
        {report.sections.map((section, index) => (
          <div key={section.id} className="section-editor border rounded-lg p-4">
            <div className="section-header flex justify-between items-center mb-4">
              <div className="section-title-input flex-grow mr-4">
                <input
                  type="text"
                  value={section.title}
                  onChange={e => updateSectionTitle(section.id, e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="Section title"
                />
              </div>
              
              <div className="section-actions flex space-x-2">
                <button
                  className="p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => moveSectionUp(section.id)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  className="p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => moveSectionDown(section.id)}
                  disabled={index === report.sections.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  className="p-1 text-red-500 hover:text-red-700"
                  onClick={() => removeSection(section.id)}
                  title="Remove section"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="section-type mb-2">
              <span className="inline-block bg-gray-200 rounded px-2 py-1 text-xs">
                {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
              </span>
            </div>
            
            <div className="section-content">
              <textarea
                value={section.content}
                onChange={e => updateSectionContent(section.id, e.target.value)}
                className="w-full border rounded p-2"
                rows={5}
                placeholder="Section content"
              />
            </div>
          </div>
        ))}
        
        <div className="add-section mt-4">
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100"
              onClick={() => addSection('text')}
            >
              Add Text Section
            </button>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100"
              onClick={() => addSection('data')}
            >
              Add Data Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportEditor;
