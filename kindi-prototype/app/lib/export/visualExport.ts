"use client";

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Options for visual exports
 */
export interface VisualExportOptions {
  width?: number;
  height?: number;
  quality?: number;
  scale?: number;
  backgroundColor?: string;
  includeMargin?: boolean;
}

/**
 * Export HTML element as PNG image
 * @param element HTML element to export
 * @param options Export options
 * @returns Promise resolving to Blob
 */
export const exportElementAsPNG = async (
  element: HTMLElement,
  options: VisualExportOptions = {}
): Promise<Blob> => {
  const canvas = await html2canvas(element, {
    backgroundColor: options.backgroundColor || '#ffffff',
    scale: options.scale || window.devicePixelRatio,
    width: options.width,
    height: options.height,
    scrollX: 0,
    scrollY: 0,
    windowWidth: document.documentElement.offsetWidth,
    windowHeight: document.documentElement.offsetHeight
  });
  
  return new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob as Blob),
      'image/png',
      options.quality || 0.92
    );
  });
};

/**
 * Export HTML element as JPEG image
 * @param element HTML element to export
 * @param options Export options
 * @returns Promise resolving to Blob
 */
export const exportElementAsJPEG = async (
  element: HTMLElement,
  options: VisualExportOptions = {}
): Promise<Blob> => {
  const canvas = await html2canvas(element, {
    backgroundColor: options.backgroundColor || '#ffffff',
    scale: options.scale || window.devicePixelRatio,
    width: options.width,
    height: options.height,
    scrollX: 0,
    scrollY: 0,
    windowWidth: document.documentElement.offsetWidth,
    windowHeight: document.documentElement.offsetHeight
  });
  
  return new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob as Blob),
      'image/jpeg',
      options.quality || 0.92
    );
  });
};

/**
 * Export SVG element as SVG string
 * @param svgElement SVG element to export
 * @returns SVG string
 */
export const exportSVGAsString = (svgElement: SVGElement): string => {
  // Clone the SVG to avoid modifying the original
  const svgClone = svgElement.cloneNode(true) as SVGElement;
  
  // Add any necessary attributes
  svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  
  // Convert to string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgClone);
};

/**
 * Export HTML element as PDF
 * @param element HTML element to export
 * @param options Export options
 * @returns Promise resolving to Blob
 */
export const exportElementAsPDF = async (
  element: HTMLElement,
  options: VisualExportOptions & {
    title?: string;
    orientation?: 'portrait' | 'landscape';
    format?: string | [number, number];
  } = {}
): Promise<Blob> => {
  const canvas = await html2canvas(element, {
    backgroundColor: options.backgroundColor || '#ffffff',
    scale: options.scale || window.devicePixelRatio,
    width: options.width,
    height: options.height,
    scrollX: 0,
    scrollY: 0,
    windowWidth: document.documentElement.offsetWidth,
    windowHeight: document.documentElement.offsetHeight
  });
  
  const imgData = canvas.toDataURL('image/png');
  
  // Calculate dimensions
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  
  // Determine PDF orientation and format
  const orientation = options.orientation || 
    (imgWidth > imgHeight ? 'landscape' : 'portrait');
  
  const format = options.format || [imgWidth, imgHeight];
  
  // Create PDF
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format
  });
  
  // Add title if provided
  if (options.title) {
    pdf.setFontSize(16);
    pdf.text(options.title, 20, 20);
    pdf.addImage(imgData, 'PNG', 0, 40, imgWidth, imgHeight);
  } else {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  }
  
  return pdf.output('blob');
};
