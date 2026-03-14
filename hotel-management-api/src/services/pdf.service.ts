import PDFDocument from 'pdfkit';

export const buildPdfBuffer = async (title: string, lines: string[]): Promise<Buffer> =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const document = new PDFDocument({ margin: 48 });

    document.on('data', (chunk) => chunks.push(chunk as Buffer));
    document.on('end', () => resolve(Buffer.concat(chunks)));
    document.on('error', reject);

    document.fontSize(20).text(title, { underline: true });
    document.moveDown();

    for (const line of lines) {
      document.fontSize(12).text(line);
    }

    document.end();
  });
