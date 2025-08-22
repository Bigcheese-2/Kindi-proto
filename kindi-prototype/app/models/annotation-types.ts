/**
 * Annotation data types
 */

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

/**
 * Generate a unique ID for an annotation
 * @returns Unique ID string
 */
export const generateAnnotationId = (): string => {
  return `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new annotation
 * @param targetId Target ID
 * @param targetType Target type
 * @param content Annotation content
 * @param format Content format
 * @param tags Optional tags
 * @returns New annotation object
 */
export const createAnnotation = (
  targetId: string,
  targetType: 'entity' | 'event' | 'location',
  content: string,
  format: 'plain' | 'markdown' | 'html' = 'plain',
  tags?: string[]
): Annotation => {
  const now = Date.now();
  
  return {
    id: generateAnnotationId(),
    targetId,
    targetType,
    content,
    format,
    createdAt: now,
    updatedAt: now,
    tags
  };
};

/**
 * Create a rich text block
 * @param type Block type
 * @param text Block text
 * @returns Rich text block
 */
export const createRichTextBlock = (
  type: RichTextBlock['type'] = 'paragraph',
  text: string = ''
): RichTextBlock => {
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    text,
    inlineStyles: []
  };
};
