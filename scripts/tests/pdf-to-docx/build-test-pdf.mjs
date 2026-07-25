// Hand-assemble a small two-page PDF exercising: bold 18pt title, wrapped
// paragraph, second paragraph, a 3-column table with a bold header row, and
// a second page. Standard Type1 fonts so pdf.js has metrics built in.
import fs from 'node:fs';

const page1 = `BT
/F2 18 Tf
72 720 Td
(Quarterly Sales Report) Tj
ET
BT
/F1 11 Tf
72 684 Td
(This is the first line of an introductory paragraph that wraps) Tj
0 -14 Td
(onto a second line and then continues with additional words.) Tj
ET
BT
/F1 11 Tf
72 642 Td
(A second paragraph sits below after a wider vertical gap and) Tj
0 -14 Td
(should not merge into the first one.) Tj
ET
BT
/F2 11 Tf
72 580 Td
(Item) Tj
ET
BT
/F2 11 Tf
250 580 Td
(Quantity) Tj
ET
BT
/F2 11 Tf
420 580 Td
(Unit Price) Tj
ET
BT
/F1 11 Tf
72 560 Td
(Widget Alpha) Tj
ET
BT
/F1 11 Tf
250 560 Td
(1,240) Tj
ET
BT
/F1 11 Tf
420 560 Td
(4.50) Tj
ET
BT
/F1 11 Tf
72 540 Td
(Widget Beta) Tj
ET
BT
/F1 11 Tf
250 540 Td
(880) Tj
ET
BT
/F1 11 Tf
420 540 Td
(6.25) Tj
ET
BT
/F1 11 Tf
72 520 Td
(Widget Gamma) Tj
ET
BT
/F1 11 Tf
250 520 Td
(310) Tj
ET
BT
/F1 11 Tf
420 520 Td
(12.00) Tj
ET`;

const page2 = `BT
/F1 11 Tf
72 720 Td
(Appendix content follows on page two of the document.) Tj
ET`;

function pdf(objBodies) {
  let out = '%PDF-1.4\n';
  const offsets = [0];
  objBodies.forEach((body, i) => {
    offsets.push(Buffer.byteLength(out, 'latin1'));
    out += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefPos = Buffer.byteLength(out, 'latin1');
  out += `xref\n0 ${objBodies.length + 1}\n`;
  out += '0000000000 65535 f \n';
  for (let i = 1; i <= objBodies.length; i++) {
    out += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  out += `trailer\n<< /Size ${objBodies.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;
  return Buffer.from(out, 'latin1');
}

const stream = (s) => `<< /Length ${Buffer.byteLength(s, 'latin1')} >>\nstream\n${s}\nendstream`;
const pageObj = (contentsRef) =>
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents ${contentsRef} 0 R >>`;

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>',
  pageObj(7),
  pageObj(8),
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  stream(page1),
  stream(page2),
];

const out = new URL('test.pdf', import.meta.url);
fs.writeFileSync(out, pdf(objects));
console.log('wrote test.pdf', fs.statSync(out).size, 'bytes');
