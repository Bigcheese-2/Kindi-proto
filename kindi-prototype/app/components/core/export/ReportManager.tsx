"use client";

import React, { useState, useEffect } from 'react';
import { ReportData } from '@/app/lib/export/reportExport';
import ReportTemplateSelector from './ReportTemplateSelector';
import ReportEditor from './ReportEditor';
import ExportButton from './ExportButton';

interface ReportManagerProps {
  onClose: () => void;
}

const ReportManager: React.FC<ReportManagerProps> = ({ onClose }) => {
  const [step, setStep] = useState<'template' | 'editor'>('template');
  const [report, setReport] = useState<ReportData | null>(null);
  const [savedReports, setSavedReports] = useState<ReportData[]>([]);
  
  // Load saved reports from local storage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedReportsJson = localStorage.getItem('savedReports');
        if (savedReportsJson) {
          setSavedReports(JSON.parse(savedReportsJson));
        }
      }
    } catch (error) {
      console.error('Error loading saved reports:', error);
    }
  }, []);
  
  // Save reports to local storage
  const saveReports = (reports: ReportData[]) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('savedReports', JSON.stringify(reports));
      }
      setSavedReports(reports);
    } catch (error) {
      console.error('Error saving reports:', error);
    }
  };
  
  // Handle template selection
  const handleSelectTemplate = (reportData: ReportData) => {
    setReport(reportData);
    setStep('editor');
  };
  
  // Handle report save
  const handleSaveReport = (reportData: ReportData) => {
    // Check if report already exists
    const existingIndex = savedReports.findIndex(r => 
      r.title === reportData.title && r.createdAt === reportData.createdAt
    );
    
    if (existingIndex >= 0) {
      // Update existing report
      const updatedReports = [...savedReports];
      updatedReports[existingIndex] = reportData;
      saveReports(updatedReports);
    } else {
      // Add new report
      saveReports([...savedReports, reportData]);
    }
    
    setReport(reportData);
  };
  
  // Handle report delete
  const handleDeleteReport = (reportToDelete: ReportData) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      const updatedReports = savedReports.filter(r => 
        !(r.title === reportToDelete.title && r.createdAt === reportToDelete.createdAt)
      );
      saveReports(updatedReports);
      
      if (report && report.title === reportToDelete.title && report.createdAt === reportToDelete.createdAt) {
        setReport(null);
        setStep('template');
      }
    }
  };
  
  // Handle report load
  const handleLoadReport = (reportToLoad: ReportData) => {
    setReport(reportToLoad);
    setStep('editor');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Report Manager</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        {step === 'template' ? (
          <>
            {savedReports.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Saved Reports</h3>
                <div className="border rounded-md p-4 overflow-y-auto max-h-60">
                  {savedReports.map((savedReport, index) => (
                    <div 
                      key={`${savedReport.title}-${savedReport.createdAt}`}
                      className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                    >
                      <div>
                        <h4 className="font-medium">{savedReport.title}</h4>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(savedReport.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          onClick={() => handleLoadReport(savedReport)}
                        >
                          Edit
                        </button>
                        <ExportButton
                          exportType="report"
                          data={savedReport}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                          buttonText="Export"
                        />
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                          onClick={() => handleDeleteReport(savedReport)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Create New Report</h3>
              <ReportTemplateSelector
                onSelectTemplate={handleSelectTemplate}
                onCancel={onClose}
              />
            </div>
          </>
        ) : (
          report && (
            <ReportEditor
              reportData={report}
              onSave={handleSaveReport}
              onClose={() => setStep('template')}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ReportManager;
