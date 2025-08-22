"use client";

import { useState } from 'react';
import { ReportTemplate, getReportTemplates } from '@/app/lib/export/reportExport';

interface ReportTemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

const ReportTemplateSelector: React.FC<ReportTemplateSelectorProps> = ({
  onSelectTemplate
}) => {
  const [templates] = useState<ReportTemplate[]>(getReportTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0]?.id || '');
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    onSelectTemplate(templateId);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select a Report Template</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(template => (
          <div 
            key={template.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedTemplate === template.id 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onClick={() => handleSelectTemplate(template.id)}
          >
            <h4 className="font-medium">{template.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              {template.sections.length} sections
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportTemplateSelector;
