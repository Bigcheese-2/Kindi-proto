// Annotation types
export interface Annotation {
  id: string;
  targetId: string;
  targetType: 'entity' | 'event' | 'location';
  content: string;
  format: 'plain' | 'markdown' | 'html';
  createdAt: number;
  updatedAt: number;
  createdBy?: string;
  tags?: string[];
}

// Rich text content (for HTML format)
export interface RichTextContent {
  blocks: RichTextBlock[];
}

export interface RichTextBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'list' | 'quote';
  text: string;
  inlineStyles?: InlineStyle[];
}

export interface InlineStyle {
  start: number;
  end: number;
  style: 'bold' | 'italic' | 'underline' | 'code' | 'link';
  data?: Record<string, any>; // For links, etc.
}
