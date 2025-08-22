"use client";

import { useKeyboard } from '@/app/contexts/KeyboardContext';

interface KeyboardShortcutsDialogProps {
  onClose: () => void;
}

const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({ onClose }) => {
  const { shortcuts } = useKeyboard();
  
  // Group shortcuts by category
  const shortcutsByCategory = shortcuts.reduce<Record<string, typeof shortcuts>>(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {}
  );
  
  // Format category name
  const formatCategory = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-neutral-light">Keyboard Shortcuts</h2>
          <button 
            onClick={onClose} 
            className="text-neutral-medium hover:text-neutral-light"
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          {Object.keys(shortcutsByCategory).length === 0 ? (
            <p className="text-neutral-medium text-center py-4">No keyboard shortcuts registered</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(shortcutsByCategory).map(([category, categoryShortcuts]) => (
                <div key={category} className="shortcut-category">
                  <h3 className="text-lg font-medium text-neutral-light mb-2">{formatCategory(category)}</h3>
                  
                  <table className="w-full">
                    <tbody>
                      {categoryShortcuts.map(shortcut => (
                        <tr key={shortcut.id} className="border-b border-gray-800">
                          <td className="py-2 pr-4">
                            <div className="flex flex-wrap gap-1">
                              {shortcut.keys.map((key, index) => (
                                <span key={key} className="inline-flex">
                                  <kbd className="px-2 py-1 text-xs font-semibold text-neutral-light bg-secondary rounded border border-gray-700">
                                    {key}
                                  </kbd>
                                  {index < shortcut.keys.length - 1 && (
                                    <span className="mx-1 text-neutral-medium">+</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-2 text-neutral-light">
                            {shortcut.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-700">
            <h3 className="text-lg font-medium text-neutral-light mb-2">Tips</h3>
            <ul className="list-disc list-inside text-neutral-medium space-y-1">
              <li>Press <kbd className="px-2 py-0.5 text-xs font-semibold text-neutral-light bg-secondary rounded border border-gray-700">?</kbd> at any time to show this dialog</li>
              <li>Keyboard shortcuts don't work when focus is in an input field</li>
              <li>You can customize keyboard shortcuts in the settings</li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-accent text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsDialog;
