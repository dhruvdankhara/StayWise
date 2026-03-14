import * as XLSX from 'xlsx';

import { buildPdfBuffer } from './pdf.service';

export const buildWorkbookBuffer = (sheetName: string, rows: Record<string, unknown>[]): Buffer => {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

export const buildReportPdf = async (title: string, rows: Record<string, unknown>[]): Promise<Buffer> => {
  const lines = rows.map((row) => JSON.stringify(row));
  return buildPdfBuffer(title, lines);
};
