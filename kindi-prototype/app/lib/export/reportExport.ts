"use client";

import jsPDF from 'jspdf';

// Report section types
export interface ReportSection {
  id: string;
  title: string;
  content: string;
  image?: string; // Base64 encoded image data
  type: 'text' | 'graph' | 'timeline' | 'map' | 'data';
}

// Report template
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
}

// Report data
export interface ReportData {
  title: string;
  description: string;
  author?: string;
  createdAt: number;
  sections: ReportSection[];
}

/**
 * Get available report templates
 * @returns Array of report templates
 */
export const getReportTemplates = (): ReportTemplate[] => {
  return [
    {
      id: 'basic',
      name: 'Basic Report',
      description: 'A simple report with title, description, and sections',
      sections: [
        {
          id: 'section-1',
          title: 'Overview',
          content: '',
          type: 'text'
        },
        {
          id: 'section-2',
          title: 'Graph Analysis',
          content: '',
          type: 'graph'
        },
        {
          id: 'section-3',
          title: 'Timeline Analysis',
          content: '',
          type: 'timeline'
        },
        {
          id: 'section-4',
          title: 'Geographic Analysis',
          content: '',
          type: 'map'
        },
        {
          id: 'section-5',
          title: 'Conclusions',
          content: '',
          type: 'text'
        }
      ]
    },
    {
      id: 'detailed',
      name: 'Detailed Analysis',
      description: 'A comprehensive report with detailed sections',
      sections: [
        {
          id: 'section-1',
          title: 'Executive Summary',
          content: '',
          type: 'text'
        },
        {
          id: 'section-2',
          title: 'Background',
          content: '',
          type: 'text'
        },
        {
          id: 'section-3',
          title: 'Network Analysis',
          content: '',
          type: 'graph'
        },
        {
          id: 'section-4',
          title: 'Key Entities',
          content: '',
          type: 'data'
        },
        {
          id: 'section-5',
          title: 'Chronological Analysis',
          content: '',
          type: 'timeline'
        },
        {
          id: 'section-6',
          title: 'Geographic Distribution',
          content: '',
          type: 'map'
        },
        {
          id: 'section-7',
          title: 'Findings',
          content: '',
          type: 'text'
        },
        {
          id: 'section-8',
          title: 'Recommendations',
          content: '',
          type: 'text'
        }
      ]
    }
  ];
};

/**
 * Create a new report from template
 * @param templateId Template ID
 * @param title Report title
 * @param description Report description
 * @returns New report data
 */
export const createReportFromTemplate = (
  templateId: string,
  title: string,
  description: string,
  author?: string
): ReportData => {
  const templates = getReportTemplates();
  const template = templates.find(t => t.id === templateId);
  
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }
  
  return {
    title,
    description,
    author,
    createdAt: Date.now(),
    sections: template.sections.map(section => ({
      ...section,
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }))
  };
};

/**
 * Generate PDF from report data
 * @param reportData Report data
 * @returns PDF blob
 */
export const generateReportPDF = async (reportData: ReportData): Promise<Blob> => {
  const { title, description, author, sections } = reportData;
  
  const pdf = new jsPDF();
  let yPos = 20;
  
  // Add title
  pdf.setFontSize(18);
  pdf.text(title, 20, yPos);
  yPos += 10;
  
  // Add description
  pdf.setFontSize(12);
  const descriptionLines = pdf.splitTextToSize(description, 170);
  pdf.text(descriptionLines, 20, yPos);
  yPos += descriptionLines.length * 7 + 5;
  
  // Add author if available
  if (author) {
    pdf.setFontSize(10);
    pdf.text(`Author: ${author}`, 20, yPos);
    yPos += 10;
  }
  
  // Add date
  pdf.setFontSize(10);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
  yPos += 15;
  
  // Add sections
  for (const section of sections) {
    // Check if we need a page break
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    
    // Add section title
    pdf.setFontSize(14);
    pdf.text(section.title, 20, yPos);
    yPos += 10;
    
    // Add section content
    pdf.setFontSize(12);
    
    // Split long text into lines
    const contentLines = pdf.splitTextToSize(section.content, 170);
    pdf.text(contentLines, 20, yPos);
    yPos += contentLines.length * 7 + 8;
    
    // Add section image if available
    if (section.image) {
      // Check if we need a page break for the image
      if (yPos > 150) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.addImage(section.image, 'PNG', 20, yPos, 170, 100);
      yPos += 110;
    }
  }
  
  return pdf.output('blob');
};

/**
 * Save report to local storage
 * @param report Report data
 */
export const saveReportToStorage = (report: ReportData): void => {
  try {
    // Get existing reports
    const existingReportsJSON = localStorage.getItem('savedReports');
    const existingReports = existingReportsJSON ? JSON.parse(existingReportsJSON) : [];
    
    // Add new report
    existingReports.push(report);
    
    // Save to local storage
    localStorage.setItem('savedReports', JSON.stringify(existingReports));
  } catch (error) {
    console.error('Error saving report to storage:', error);
  }
};

/**
 * Get saved reports from local storage
 * @returns Array of saved reports
 */
export const getSavedReports = (): ReportData[] => {
  try {
    const reportsJSON = localStorage.getItem('savedReports');
    return reportsJSON ? JSON.parse(reportsJSON) : [];
  } catch (error) {
    console.error('Error loading saved reports:', error);
    return [];
  }
};
