import { ExportOptions } from './exportService';

/**
 * Utility functions for exporting visual elements
 */

/**
 * Convert an HTML element to a canvas
 * @param element HTML element to convert
 * @param options Export options
 * @returns Promise resolving to a canvas element
 */
export const elementToCanvas = async (
  element: HTMLElement,
  options: ExportOptions
): Promise<HTMLCanvasElement> => {
  // This would use html2canvas or a similar library
  // For now, we'll just throw an error
  throw new Error('Not implemented - requires html2canvas library');
  
  /* Implementation would look like this:
  const canvas = await html2canvas(element, {
    scale: 2, // Higher resolution
    useCORS: true, // Allow cross-origin images
    allowTaint: true,
    width: options.width || element.offsetWidth,
    height: options.height || element.offsetHeight,
    backgroundColor: null // Transparent background
  });
  
  return canvas;
  */
};

/**
 * Convert a canvas to a Blob
 * @param canvas Canvas element
 * @param format Image format
 * @param quality Image quality (0-1)
 * @returns Promise resolving to a Blob
 */
export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpg',
  quality: number = 0.92
): Promise<Blob> => {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      `image/${format}`,
      quality
    );
  });
};

/**
 * Extract SVG from an element
 * @param element Element containing SVG
 * @returns SVG string
 */
export const extractSVG = (element: HTMLElement): string => {
  const svgElement = element.querySelector('svg');
  if (!svgElement) {
    throw new Error('SVG element not found');
  }
  
  // Clone the SVG to avoid modifying the original
  const svgClone = svgElement.cloneNode(true) as SVGElement;
  
  // Add any necessary attributes
  svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgClone.setAttribute('version', '1.1');
  
  // Make sure all styles are included
  const styles = window.getComputedStyle(svgElement);
  svgClone.style.width = styles.width;
  svgClone.style.height = styles.height;
  
  // Convert to string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgClone);
};

/**
 * Create a downloadable URL for a blob or string
 * @param content Blob or string content
 * @param mimeType MIME type
 * @returns Object URL
 */
export const createDownloadURL = (
  content: Blob | string,
  mimeType: string
): string => {
  if (typeof content === 'string') {
    const blob = new Blob([content], { type: mimeType });
    return URL.createObjectURL(blob);
  } else {
    return URL.createObjectURL(content);
  }
};

/**
 * Trigger a download of content
 * @param content Blob or string content
 * @param filename Filename
 * @param mimeType MIME type
 */
export const downloadContent = (
  content: Blob | string,
  filename: string,
  mimeType: string
): void => {
  const url = createDownloadURL(content, mimeType);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Get MIME type for export format
 * @param format Export format
 * @returns MIME type
 */
export const getMimeType = (format: string): string => {
  switch (format) {
    case 'png':
      return 'image/png';
    case 'jpg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    case 'pdf':
      return 'application/pdf';
    case 'csv':
      return 'text/csv';
    case 'json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
};
