"use client";

import { useState } from 'react';
import { ReportData, ReportSection, createReportFromTemplate, generateReportPDF, saveReportToStorage } from '@/app/lib/export/reportExport';
import ReportTemplateSelector from './ReportTemplateSelector';
import { saveAs } from 'file-saver';

interface ReportCreatorProps {
  onClose: () => void;
  captureVisualizations?: () => Promise<{
    graph?: string;
    timeline?: string;
    map?: string;
  }>;
}

const ReportCreator: React.FC<ReportCreatorProps> = ({
  onClose,
  captureVisualizations
}) => {
  const [step, setStep] = useState<'template' | 'details' | 'sections'>('template');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setStep('details');
    
    // Create initial report data
    const initialReport = createReportFromTemplate(
      templateId,
      'Analysis Report',
      'Description of the analysis findings',
      ''
    );
    
    setReportData(initialReport);
  };
  
  // Handle report details update
  const handleDetailsChange = (field: keyof Pick<ReportData, 'title' | 'description' | 'author'>, value: string) => {
    if (!reportData) return;
    
    setReportData({
      ...reportData,
      [field]: value
    });
  };
  
  // Handle section content update
  const handleSectionChange = (sectionId: string, field: keyof Pick<ReportSection, 'title' | 'content'>, value: string) => {
    if (!reportData) return;
    
    setReportData({
      ...reportData,
      sections: reportData.sections.map(section => 
        section.id === sectionId
          ? { ...section, [field]: value }
          : section
      )
    });
  };
  
  // Generate and export report
  const handleGenerateReport = async () => {
    if (!reportData) return;
    
    setIsGenerating(true);
    
    try {
      // If we have a function to capture visualizations, use it
      if (captureVisualizations) {
        const visualizations = await captureVisualizations();
        
        // Update sections with captured visualizations
        const updatedSections = reportData.sections.map(section => {
          if (section.type === 'graph' && visualizations.graph) {
            return { ...section, image: visualizations.graph };
          }
          if (section.type === 'timeline' && visualizations.timeline) {
            return { ...section, image: visualizations.timeline };
          }
          if (section.type === 'map' && visualizations.map) {
            return { ...section, image: visualizations.map };
          }
          return section;
        });
        
        setReportData({
          ...reportData,
          sections: updatedSections
        });
      }
      
      // Generate PDF
      const pdfBlob = await generateReportPDF(reportData);
      
      // Save to local storage
      saveReportToStorage(reportData);
      
      // Download the file
      saveAs(pdfBlob, `${reportData.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Render template selection step
  const renderTemplateStep = () => (
    <div className="space-y-6">
      <ReportTemplateSelector onSelectTemplate={handleSelectTemplate} />
      
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
  
  // Render report details step
  const renderDetailsStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Report Details</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="report-title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="report-title"
            type="text"
            value={reportData?.title || ''}
            onChange={e => handleDetailsChange('title', e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div>
          <label htmlFor="report-description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="report-description"
            value={reportData?.description || ''}
            onChange={e => handleDetailsChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div>
          <label htmlFor="report-author" className="block text-sm font-medium mb-1">
            Author (optional)
          </label>
          <input
            id="report-author"
            type="text"
            value={reportData?.author || ''}
            onChange={e => handleDetailsChange('author', e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => setStep('template')}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Back
        </button>
        <button
          onClick={() => setStep('sections')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={!reportData?.title}
        >
          Next
        </button>
      </div>
    </div>
  );
  
  // Render report sections step
  const renderSectionsStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Report Sections</h3>
      
      <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
        {reportData?.sections.map((section, index) => (
          <div key={section.id} className="border rounded-md p-4 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                {section.type}
              </span>
              <h4 className="text-md font-medium">{index + 1}. {section.title}</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <label htmlFor={`section-title-${section.id}`} className="block text-sm font-medium mb-1">
                  Section Title
                </label>
                <input
                  id={`section-title-${section.id}`}
                  type="text"
                  value={section.title}
                  onChange={e => handleSectionChange(section.id, 'title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label htmlFor={`section-content-${section.id}`} className="block text-sm font-medium mb-1">
                  Content
                </label>
                <textarea
                  id={`section-content-${section.id}`}
                  value={section.content}
                  onChange={e => handleSectionChange(section.id, 'content', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              {section.type !== 'text' && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {section.type === 'graph' && 'The current network graph will be included in this section.'}
                  {section.type === 'timeline' && 'The current timeline will be included in this section.'}
                  {section.type === 'map' && 'The current map will be included in this section.'}
                  {section.type === 'data' && 'Selected data will be included in this section.'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => setStep('details')}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Back
        </button>
        <button
          onClick={handleGenerateReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Create Report</h2>
        <button 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      
      {step === 'template' && renderTemplateStep()}
      {step === 'details' && renderDetailsStep()}
      {step === 'sections' && renderSectionsStep()}
    </div>
  );
};

export default ReportCreator;
