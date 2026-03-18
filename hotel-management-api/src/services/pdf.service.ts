import PDFDocument from "pdfkit";

export const buildPdfBuffer = async (
  title: string,
  lines: string[],
): Promise<Buffer> =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const document = new PDFDocument({ margin: 48 });

    document.on("data", (chunk) => chunks.push(chunk as Buffer));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    document.fontSize(20).text(title, { underline: true });
    document.moveDown();

    for (const line of lines) {
      document.fontSize(12).text(line);
    }

    document.end();
  });

export interface InvoicePdfLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoicePdfData {
  invoiceId: string;
  issuedAt: Date;
  hotelName: string;
  hotelAddress?: string;
  hotelContactEmail?: string;
  hotelContactPhone?: string;
  guestName: string;
  guestEmail?: string;
  bookingRef?: string;
  checkIn?: Date;
  checkOut?: Date;
  subtotal: number;
  discount: number;
  total: number;
  paidAmount: number;
  currency: string;
  lineItems: InvoicePdfLineItem[];
  footer?: string;
}

const formatDate = (value: Date | undefined): string =>
  value ? value.toISOString().slice(0, 10) : "-";

const formatMoney = (amount: number, currency: string): string => {
  const normalizedCurrency = currency || "INR";
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: normalizedCurrency,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

export const buildInvoicePdfBuffer = async (
  data: InvoicePdfData,
): Promise<Buffer> =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const document = new PDFDocument({ margin: 48 });

    const leftX = 48;
    const rightX = 350;
    const tableStartY = 250;

    document.on("data", (chunk) => chunks.push(chunk as Buffer));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    document
      .fontSize(24)
      .fillColor("#111827")
      .text(data.hotelName || "StayWise Grand Hotel", leftX, 48);
    document.fontSize(10).fillColor("#4B5563");

    if (data.hotelAddress) {
      document.text(data.hotelAddress, leftX, 80);
    }
    if (data.hotelContactEmail) {
      document.text(data.hotelContactEmail, leftX, 94);
    }
    if (data.hotelContactPhone) {
      document.text(data.hotelContactPhone, leftX, 108);
    }

    document
      .fontSize(18)
      .fillColor("#111827")
      .text("INVOICE", rightX, 48, { align: "left" });
    document.fontSize(10).fillColor("#374151");
    document.text(`Invoice #: ${data.invoiceId}`, rightX, 80);
    document.text(`Issued: ${formatDate(data.issuedAt)}`, rightX, 94);
    document.text(`Booking Ref: ${data.bookingRef ?? "-"}`, rightX, 108);
    document.text(`Check-in: ${formatDate(data.checkIn)}`, rightX, 122);
    document.text(`Check-out: ${formatDate(data.checkOut)}`, rightX, 136);

    document
      .moveTo(leftX, 160)
      .lineTo(547, 160)
      .strokeColor("#E5E7EB")
      .stroke();

    document.fontSize(11).fillColor("#111827").text("Bill To", leftX, 176);
    document
      .fontSize(10)
      .fillColor("#374151")
      .text(data.guestName || "Guest", leftX, 192);
    if (data.guestEmail) {
      document.text(data.guestEmail, leftX, 206);
    }

    document.rect(leftX, tableStartY, 499, 22).fill("#F9FAFB");
    document.fillColor("#111827").fontSize(10);
    document.text("Description", leftX + 8, tableStartY + 7);
    document.text("Qty", 360, tableStartY + 7, { width: 40, align: "right" });
    document.text("Unit Price", 405, tableStartY + 7, {
      width: 65,
      align: "right",
    });
    document.text("Total", 475, tableStartY + 7, { width: 64, align: "right" });

    let rowY = tableStartY + 22;
    for (const item of data.lineItems) {
      document
        .moveTo(leftX, rowY)
        .lineTo(547, rowY)
        .strokeColor("#E5E7EB")
        .stroke();
      document.fillColor("#1F2937").fontSize(10);
      document.text(item.description, leftX + 8, rowY + 8, { width: 330 });
      document.text(String(item.quantity), 360, rowY + 8, {
        width: 40,
        align: "right",
      });
      document.text(formatMoney(item.unitPrice, data.currency), 405, rowY + 8, {
        width: 65,
        align: "right",
      });
      document.text(formatMoney(item.total, data.currency), 475, rowY + 8, {
        width: 64,
        align: "right",
      });
      rowY += 28;
    }

    const summaryTop = rowY + 16;
    const summaryLabelX = 390;
    const summaryValueX = 475;

    document.fillColor("#374151").fontSize(10);
    document.text("Subtotal", summaryLabelX, summaryTop, {
      width: 80,
      align: "right",
    });
    document.text(
      formatMoney(data.subtotal, data.currency),
      summaryValueX,
      summaryTop,
      {
        width: 64,
        align: "right",
      },
    );

    document.text("Discount", summaryLabelX, summaryTop + 16, {
      width: 80,
      align: "right",
    });
    document.text(
      formatMoney(data.discount, data.currency),
      summaryValueX,
      summaryTop + 16,
      {
        width: 64,
        align: "right",
      },
    );

    document
      .font("Helvetica-Bold")
      .text("Total", summaryLabelX, summaryTop + 34, {
        width: 80,
        align: "right",
      });
    document.text(
      formatMoney(data.total, data.currency),
      summaryValueX,
      summaryTop + 34,
      {
        width: 64,
        align: "right",
      },
    );

    document
      .font("Helvetica")
      .text("Paid", summaryLabelX, summaryTop + 52, {
        width: 80,
        align: "right",
      });
    document.text(
      formatMoney(data.paidAmount, data.currency),
      summaryValueX,
      summaryTop + 52,
      {
        width: 64,
        align: "right",
      },
    );

    const balance = Math.max(0, data.total - data.paidAmount);
    document
      .font("Helvetica-Bold")
      .fillColor(balance > 0 ? "#B45309" : "#047857");
    document.text(
      balance > 0 ? "Balance Due" : "Paid in Full",
      summaryLabelX,
      summaryTop + 72,
      {
        width: 80,
        align: "right",
      },
    );
    document.text(
      formatMoney(balance, data.currency),
      summaryValueX,
      summaryTop + 72,
      {
        width: 64,
        align: "right",
      },
    );

    document.font("Helvetica").fillColor("#6B7280").fontSize(9);
    document.text(
      data.footer || "Thank you for choosing StayWise.",
      leftX,
      760,
      {
        width: 499,
        align: "center",
      },
    );

    document.end();
  });
