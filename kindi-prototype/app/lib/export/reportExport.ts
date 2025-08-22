/**
 * Types and utilities for report generation and export
 */

// Report section types
export interface ReportSection {
  id: string;
  title: string;
  content: string;
  image?: string; // Base64 encoded image data
  type: 'text' | 'graph' | 'timeline' | 'map' | 'data';
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
}

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
  description: string
): ReportData => {
  const templates = getReportTemplates();
  const template = templates.find(t => t.id === templateId);
  
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }
  
  return {
    title,
    description,
    createdAt: Date.now(),
    sections: template.sections.map(section => ({
      ...section,
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }))
  };
};

/**
 * Generate HTML for a report
 * @param report Report data
 * @returns HTML string
 */
export const generateReportHTML = (report: ReportData): string => {
  const { title, description, author, sections } = report;
  
  // Generate HTML for sections
  const sectionsHTML = sections.map(section => {
    let sectionContent = '';
    
    // Handle different section types
    switch (section.type) {
      case 'text':
        sectionContent = `<div class="section-content">${section.content}</div>`;
        break;
      case 'graph':
      case 'timeline':
      case 'map':
        sectionContent = `
          <div class="section-content">${section.content}</div>
          ${section.image ? `<div class="section-image"><img src="${section.image}" alt="${section.title}"></div>` : ''}
        `;
        break;
      case 'data':
        sectionContent = `
          <div class="section-content">${section.content}</div>
          <div class="section-data">
            <pre>${section.content}</pre>
          </div>
        `;
        break;
    }
    
    return `
      <section id="${section.id}" class="report-section">
        <h2>${section.title}</h2>
        ${sectionContent}
      </section>
    `;
  }).join('');
  
  // Generate full HTML
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .report-header {
          margin-bottom: 30px;
        }
        h1 {
          color: #2563eb;
          margin-bottom: 10px;
        }
        .report-description {
          font-size: 1.1em;
          margin-bottom: 20px;
        }
        .report-meta {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 30px;
        }
        .report-section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        h2 {
          color: #1d4ed8;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .section-content {
          margin-bottom: 15px;
        }
        .section-image {
          margin: 15px 0;
          text-align: center;
        }
        .section-image img {
          max-width: 100%;
          height: auto;
        }
        .section-data pre {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          overflow-x: auto;
        }
        @media print {
          body {
            font-size: 12pt;
          }
          h1 {
            font-size: 18pt;
          }
          h2 {
            font-size: 14pt;
          }
        }
      </style>
    </head>
    <body>
      <div class="report-header">
        <h1>${title}</h1>
        <div class="report-description">${description}</div>
        <div class="report-meta">
          ${author ? `<div>Author: ${author}</div>` : ''}
          <div>Generated: ${new Date(report.createdAt).toLocaleString()}</div>
        </div>
      </div>
      
      <div class="report-content">
        ${sectionsHTML}
      </div>
    </body>
    </html>
  `;
};
