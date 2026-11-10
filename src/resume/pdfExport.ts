import type { FormDataType } from './types';

export async function exportToPDF(
  formData: FormDataType,
  templateElement?: HTMLElement | null
): Promise<void> {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas-pro'),
    import('jspdf')
  ]);

  const userName = (formData.about.name || 'Candidate').trim().replace(/\s+/g, '_');
  const filename = `${userName}_Resume.pdf`;

  const targetElement = templateElement || document.getElementById('resume-pdf-container');

  if (!targetElement) {
    throw new Error('Unable to find resume template element for PDF generation.');
  }

  // Generate high-resolution canvas capture using html2canvas-pro
  const canvas = await html2canvas(targetElement, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1200,
    onclone: (clonedDoc) => {
      const offscreen = clonedDoc.getElementById('resume-pdf-container');
      if (offscreen) {
        offscreen.style.position = 'fixed';
        offscreen.style.left = '0px';
        offscreen.style.top = '0px';
        offscreen.style.zIndex = '99999';
        offscreen.style.visibility = 'visible';
        offscreen.style.transform = 'none';
      }
    }
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Multi-page handling: add subsequent pages cleanly if content exceeds single page
  while (heightLeft > 8) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(filename);
}