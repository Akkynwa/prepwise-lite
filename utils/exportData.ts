import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Define a flexible interface for the data you want to export
interface ExportPayload {
  title: string;
  content: string;
  // If you have structured rows (e.g., table data)
  headers?: string[];
  rows?: string[][]; 
}

export const exportToPDF = ({ title, content, headers, rows }: ExportPayload) => {
  const doc = new jsPDF();

  // Add Title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Add Main Content
  doc.setFontSize(12);
  doc.text(content, 14, 35);

  // Optional: Add Table data if provided
  if (headers && rows) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable({
      startY: 45,
      head: [headers],
      body: rows,
      theme: 'striped',
    });
  }

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
};

export const exportToDocx = async ({ title, content }: ExportPayload) => {
  // Create paragraphs from content split by newlines
  const contentParagraphs = content.split('\n').map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line, size: 24 })], // 24 size = 12pt
        spacing: { after: 200 },
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 36 })], // 18pt
            spacing: { after: 400 },
          }),
          ...contentParagraphs,
          // Note: For advanced tables in DOCX, you can use the Table class from 'docx'
        ],
      },
    ],
  });

  // Generate blob and trigger download via file-saver
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.toLowerCase().replace(/\s+/g, '_')}.docx`);
};