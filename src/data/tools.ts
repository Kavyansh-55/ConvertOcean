import {
  invoiceGeneratorContent,
  receiptGeneratorContent,
  profitMarginCalculatorContent,
  percentageCalculatorContent,
  salesTaxCalculatorContent,
  breakEvenCalculatorContent
} from './business-content';
import { seoContentMap, imageResizerContent, jpgToJpegContent, jpegToJpgContent } from './seo-content';

export interface ToolData {
  slug: string;
  name: string;
  title: string;
  description: string;
  headline: string;
  subtitle: string;
  /** 40–60 word self-contained answer rendered near the top of the tool page (AEO extractable block) */
  quickAnswer?: string;
  icon: string;
  category: string;
  categorySlug: string;
  faqs: { question: string; answer: string }[];
  relatedTools: string[];
  content?: string;
}

const rawTools: ToolData[] = [
  {
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    title: 'Convert Excel to PDF Online - 100% Private | ConvertOcean',
    description: 'Convert XLS, XLSX, and CSV spreadsheets to PDF directly in your browser. No server uploads. 100% private, secure, and offline capable.',
    headline: 'Excel to PDF.',
    subtitle: 'Convert Excel spreadsheets (.xlsx, .xls, .csv) into clean, print-ready PDF tables — every sheet, with selectable text.',
    quickAnswer: 'To convert Excel to PDF without uploading your file, drop an .xlsx, .xls, or .csv spreadsheet into the tool above and download the PDF. Each sheet is drawn as a real, bordered table with a shaded header that repeats on every page, and the text stays selectable and searchable (not a flat image). All sheets in the workbook are included by default. The conversion runs entirely in your browser — the spreadsheet never leaves your device, and it keeps working offline once the page has loaded.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' },
      { question: 'Are all sheets converted?', answer: 'Yes. Every sheet in the workbook is converted by default, each starting on its own page with its name as a heading. You can switch it to just the sheet you are previewing if you prefer.' },
      { question: 'Is the text selectable in the PDF?', answer: 'Yes. Tables are drawn as real vector tables, so the text stays selectable, searchable and crisp at any zoom — rather than a rasterised screenshot. Long tables paginate automatically and the header row repeats on each page.' },
      { question: 'Do I need to sign up for an account?', answer: 'No. Every converter is immediately unlocked, 100% free, and completely untracked. No signup is required.' }
    ],
    relatedTools: ['csv-to-json', 'json-to-csv', 'xlsx-to-csv', 'csv-to-xlsx', 'json-to-xlsx']
  },
  {
    slug: 'csv-to-json',
    name: 'CSV to JSON',
    title: 'Convert CSV to JSON Online - 100% Private | ConvertOcean',
    description: 'Instantly convert CSV files to structured JSON arrays offline in your browser. 100% device-level privacy with zero server uploads.',
    headline: 'CSV to JSON.',
    subtitle: 'Select any comma-separated (.csv) spreadsheet file and download its structured JSON equivalent client-side.',
    quickAnswer: 'To convert CSV to JSON, select a .csv file above — each spreadsheet row becomes a JSON object, with the column headers as keys, in one structured array. Parsing runs entirely in your browser, which makes it safe for confidential data exports, API fixtures, and configuration files.',
    icon: '⚙️',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' },
      { question: 'Do I need to sign up for an account?', answer: 'No. Every converter is immediately unlocked, 100% free, and completely untracked. No signup is required.' },
      { question: 'How does it handle nested parameters in CSV?', answer: 'Standard flat CSV headers become key-value pairs in the JSON objects array.' }
    ],
    relatedTools: ['excel-to-pdf', 'json-to-csv', 'xlsx-to-csv', 'csv-to-xlsx', 'json-to-xlsx']
  },
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV',
    title: 'Convert JSON to CSV Online - 100% Private | ConvertOcean',
    description: 'Instantly convert JSON data to CSV spreadsheet format client-side. Complete browser-level privacy and offline support.',
    headline: 'JSON to CSV.',
    subtitle: 'Convert JSON arrays or objects into standard comma-separated spreadsheets (.csv) locally.',
    quickAnswer: 'To convert JSON to CSV, select a JSON array of objects and the tool flattens it into a comma-separated spreadsheet — object keys become column headers and each object becomes a row. Conversion happens client-side in your browser, so API responses and database exports are never sent to a server.',
    icon: '⚙️',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' },
      { question: 'What JSON formats are accepted?', answer: 'We support standard JSON arrays of objects representing rows, or single object inputs.' }
    ],
    relatedTools: ['excel-to-pdf', 'csv-to-json', 'xlsx-to-csv', 'csv-to-xlsx', 'json-to-xlsx']
  },
  {
    slug: 'xlsx-to-csv',
    name: 'XLSX to CSV',
    title: 'Convert XLSX to CSV Online - 100% Private | ConvertOcean',
    description: 'Convert XLSX Excel sheets to CSV formatting client-side in your browser instantly. 100% secure offline file tools.',
    headline: 'XLSX to CSV.',
    subtitle: 'Select Excel workbook spreadsheets (.xlsx, .xls) and download them parsed as clean CSV files client-side.',
    quickAnswer: 'To convert Excel to CSV, select an .xlsx or .xls workbook above and download the first sheet as a clean, comma-separated CSV that any database, script, or tool can read. Values with commas or quotes are properly escaped. It is ideal for data imports and pipelines. Conversion happens entirely in your browser, with nothing uploaded.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' },
      { question: 'Which sheet is exported to CSV?', answer: 'Our online parser converts the first visible sheet in your Excel workbook to CSV.' }
    ],
    relatedTools: ['excel-to-pdf', 'csv-to-json', 'json-to-csv', 'csv-to-xlsx', 'json-to-xlsx']
  },
  {
    slug: 'csv-to-xlsx',
    name: 'CSV to XLSX',
    title: 'Convert CSV to XLSX Online - 100% Private | ConvertOcean',
    description: 'Stitch flat comma-separated CSV spreadsheets into high-fidelity Excel XLSX sheets. Process files 100% client-side.',
    headline: 'CSV to XLSX.',
    subtitle: 'Compile flat CSV documents into fully compatible Microsoft Excel spreadsheets (.xlsx) locally.',
    quickAnswer: 'To convert CSV to Excel, select your .csv above and download a native .xlsx workbook that opens in Excel, Google Sheets, or LibreOffice with the columns already split — no import wizard needed. Quoted fields and commas inside values are handled correctly. The file is parsed and rebuilt in your browser, never uploaded.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['excel-to-pdf', 'csv-to-json', 'json-to-csv', 'xlsx-to-csv', 'json-to-xlsx']
  },
  {
    slug: 'json-to-xlsx',
    name: 'JSON to XLSX',
    title: 'Convert JSON to XLSX Online - 100% Private | ConvertOcean',
    description: 'Transform JSON text arrays into standard Excel (.xlsx) workbooks locally inside your browser tab memory. No server uploads.',
    headline: 'JSON to XLSX.',
    subtitle: 'Select structured JSON data arrays and compile them into formatted Microsoft Excel worksheets (.xlsx).',
    quickAnswer: 'To convert JSON to Excel, select a JSON array of objects above and download a native .xlsx workbook. Object keys become column headers and each object becomes a row, with typed cells rather than plain text, so the file opens ready to sort, filter, and pivot. The conversion runs entirely in your browser, so API responses holding customer data are never transmitted.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['excel-to-pdf', 'csv-to-json', 'json-to-csv', 'xlsx-to-csv', 'csv-to-xlsx']
  },
  {
    slug: 'xml-to-json',
    name: 'XML to JSON',
    title: 'Convert XML to JSON Online - 100% Private | ConvertOcean',
    description: 'Convert XML document syntax trees to clean structured JSON arrays offline in your browser. 100% device-level privacy.',
    headline: 'XML to JSON.',
    subtitle: 'Transform nested XML code structures into easy-to-read JSON datasets instantly.',
    quickAnswer: 'To convert XML to JSON, select your .xml file above and download the equivalent JSON structure, with elements mapped to keys and repeated elements to arrays. Malformed XML is caught by a real DOM parse and reported as an error rather than yielding garbage output, which makes this a fast way to check a feed or SOAP payload too. Nothing is sent to a server.',
    icon: '⚙️',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['excel-to-pdf', 'csv-to-json', 'json-to-csv', 'xlsx-to-csv', 'csv-to-xlsx']
  },
  {
    slug: 'png-to-jpg',
    name: 'PNG to JPG',
    title: 'Convert PNG to JPG Online - 100% Private | ConvertOcean',
    description: 'Convert PNG photos to compressed JPG / JPEG format client-side in your browser. Zero server uploads.',
    headline: 'PNG to JPG.',
    subtitle: 'Select any PNG image file and compile it into a smaller, compressed JPG format client-side.',
    quickAnswer: 'To convert PNG to JPG, select your PNG above and download the JPG. The tool flattens any transparency onto a white background — JPG has no transparent areas — and compresses the image to cut file size. Choose JPG for photos and upload limits; keep PNG for logos or graphics that need transparency. Nothing is uploaded.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['jpg-to-png', 'image-resizer', 'png-to-webp', 'webp-to-png', 'image-to-text']
  },
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG',
    title: 'Convert JPG to PNG Online - 100% Private | ConvertOcean',
    description: 'Convert JPG / JPEG photos to PNG format locally in your browser. 100% secure offline file tools.',
    headline: 'JPG to PNG.',
    subtitle: 'Select a JPG image file (.jpg, .jpeg) and convert it to lossless PNG layout client-side.',
    quickAnswer: 'To convert JPG to PNG, select your JPG above and download a lossless PNG. PNG avoids the generation loss JPG adds on every save, so it suits editing, screenshots, and images with sharp text or lines. Expect a larger file, since PNG stores every pixel exactly. The conversion runs entirely in your browser.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['png-to-jpg', 'image-resizer', 'png-to-webp', 'webp-to-png', 'image-to-text']
  },
  {
    slug: 'png-to-webp',
    name: 'PNG to WebP',
    title: 'Convert PNG to WebP Online - 100% Private | ConvertOcean',
    description: 'Convert PNG images to modern, highly compressed WebP format client-side. Fast, private, and offline capable.',
    headline: 'PNG to WebP.',
    subtitle: 'Convert PNG images into next-generation WebP formats client-side to improve web loading speeds.',
    quickAnswer: 'To convert PNG to WebP, select your PNG above and download a WebP that is typically 25–35% smaller at similar quality, with transparency preserved. WebP is supported by every modern browser and speeds up page loads, making it the better choice for web images. The conversion runs entirely on your device.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['png-to-jpg', 'jpg-to-png', 'webp-to-png', 'image-to-text']
  },
  {
    slug: 'webp-to-png',
    name: 'WebP to PNG',
    title: 'Convert WebP to PNG Online - 100% Private | ConvertOcean',
    description: 'Convert WebP files to compatible lossless PNG image format locally in your browser sandbox. 100% private.',
    headline: 'WebP to PNG.',
    subtitle: 'Stitch modern WebP images back into standard, widely supported PNG layouts client-side.',
    quickAnswer: 'To convert WebP to PNG, select your WebP above and download a standard, lossless PNG that opens everywhere — including older software and editors that do not support WebP. Transparency is preserved. Expect a larger file, since PNG stores every pixel without WebP\'s compression. Everything is processed locally in your browser.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['png-to-jpg', 'jpg-to-png', 'png-to-webp', 'image-to-text', 'avif-to-png']
  },
  {
    slug: 'txt-to-pdf',
    name: 'TXT to PDF',
    title: 'Convert TXT to PDF Online - 100% Private | ConvertOcean',
    description: 'Convert raw text files into formatted PDF documents client-side. Complete browser-level privacy and offline functionality.',
    headline: 'TXT to PDF.',
    subtitle: 'Convert raw text documents (.txt) into cleanly formatted PDF files client-side. Custom layout compiling.',
    quickAnswer: 'To convert a text file to PDF, select your .txt above and download a clean, paginated PDF with selectable text in a monospaced layout. Long lines wrap and content flows across pages automatically, so logs, notes, or code become a shareable document. The file is rendered in your browser and never uploaded.',
    icon: '📝',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['pdf-to-txt', 'merge-pdf', 'split-pdf', 'excel-to-pdf']
  },
  {
    slug: 'pdf-to-txt',
    name: 'PDF to TXT',
    title: 'Extract Text from PDF Online - 100% Private | ConvertOcean',
    description: 'Extract raw text contents from PDF documents locally in your browser. 100% device-level privacy and offline support.',
    headline: 'PDF to TXT.',
    subtitle: 'Extract raw textual content from local PDF files and compile text outputs completely offline in browser memory.',
    quickAnswer: 'To extract text from a PDF, select it above and download a plain .txt file with the reading order and line breaks preserved. This works on digitally created, text-based PDFs; a scanned PDF has no text layer and needs OCR instead. All extraction happens locally, so confidential documents never leave your device.',
    icon: '📄',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['txt-to-pdf', 'merge-pdf', 'split-pdf', 'excel-to-pdf']
  },
  {
    slug: 'image-to-text',
    name: 'Image to Text OCR',
    title: 'Private Image to Text OCR Converter - ConvertOcean',
    description: 'Extract text from screenshots, scans, and receipts inside your browser. 100% private WebAssembly OCR.',
    headline: 'Image to Text OCR.',
    subtitle: 'Select local images, screenshots, or receipts and extract edit-ready plain text client-side.',
    quickAnswer: 'To extract text from an image, select a JPG, PNG, or WebP above — the built-in OCR engine converts printed text into editable, copyable plain text in your browser. Clear, high-resolution images of printed fonts give the best accuracy; handwriting is significantly less reliable. No image ever leaves your device.',
    icon: '🔍',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' },
      { question: 'Is my scanned text uploaded to an AI service?', answer: 'No. All optical recognition is processed entirely inside your local browser memory sandbox via WebAssembly.' }
    ],
    relatedTools: ['png-to-jpg', 'jpg-to-png', 'png-to-webp', 'webp-to-png']
  },
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    title: 'Merge PDF Online - 100% Private PDF Joiner | ConvertOcean',
    description: 'Merge multiple PDF files client-side in your browser. 100% private, secure, and offline capable. No uploads.',
    headline: 'Merge PDF.',
    subtitle: 'Stitch multiple PDF documents together client-side in your browser memory.',
    quickAnswer: 'To merge PDF files into one document, add your PDFs above, arrange them in the order you need, and download the combined file. Merging happens locally in your browser — contracts, statements, and reports are never uploaded to a server, and there are no page or file limits.',
    icon: '🥞',
    category: 'PDF Tools',
    categorySlug: 'pdf-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. Once loaded, the merger runs 100% offline.' },
      { question: 'Is there a file count limit?', answer: 'No. The limits are determined strictly by your device memory allocations.' }
    ],
    relatedTools: ['split-pdf', 'txt-to-pdf', 'pdf-to-txt', 'excel-to-pdf']
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    title: 'Split PDF Online - Extract Pages Client-Side | ConvertOcean',
    description: 'Split PDF files and extract selected ranges offline in your browser. 100% private with no server uploads.',
    headline: 'Split PDF.',
    subtitle: 'Select specific pages and compile subset PDF documents client-side.',
    quickAnswer: 'To split a PDF, select it above and choose the pages or ranges to extract — each selection compiles into its own PDF file. Splitting runs entirely client-side in your browser, so extracting pages from confidential contracts or reports involves no server uploads and works offline once loaded.',
    icon: '🥞',
    category: 'PDF Tools',
    categorySlug: 'pdf-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. The extraction engine processes pages directly in local memory.' }
    ],
    relatedTools: ['merge-pdf', 'txt-to-pdf', 'pdf-to-txt', 'excel-to-pdf']
  },
  {
    slug: 'invoice-generator',
    name: 'Invoice Generator',
    title: 'Freelance Invoice Generator - 100% Private | ConvertOcean',
    description: 'Generate professional A4 PDF invoices client-side with automatic GST/VAT tax calculations. 100% device-level privacy.',
    headline: 'Invoice Generator.',
    subtitle: 'Create professional freelance invoices, calculate taxes, adjust parameters, and compile print-ready PDFs.',
    quickAnswer: 'To create a professional invoice for free, fill in your business details, client information, and line items above — the preview updates live and downloads as a print-ready A4 PDF. Everything is generated locally in your browser: client names, rates, and amounts are never uploaded, stored, or tracked.',
    icon: '🧾',
    category: 'Business Tools',
    categorySlug: 'business-tools',
    faqs: [
      { question: 'Can I create invoices for free?', answer: 'Yes. The Freelance Invoice Generator is 100% free with no limits on the number of invoices you can create, download, or edit.' },
      { question: 'Can I export PDF?', answer: 'Yes. Clicking "Download Invoice PDF" formats the document to standard A4 printing sizes and triggers an instant download of a standard PDF document.' },
      { question: 'Is invoice data uploaded?', answer: 'No. None of your vendor, client, or financial figures are uploaded to our servers. Everything is processed directly inside your browser sandbox and disappears when you exit the page.' }
    ],
    relatedTools: ['receipt-generator', 'profit-margin-calculator', 'sales-tax-calculator', 'percentage-calculator'],
    content: invoiceGeneratorContent
  },
  {
    slug: 'receipt-generator',
    name: 'Receipt Generator',
    title: 'Free Receipt Generator Online - Create Payment Receipts | ConvertOcean',
    description: 'Generate professional payment receipts online for free. Create, customize, and download PDF receipts instantly. 100% private, client-side processing with no server uploads.',
    headline: 'Receipt Generator.',
    subtitle: 'Create professional payment receipts with itemized details, tax calculations, and payment method records. Download as print-ready PDF.',
    quickAnswer: 'To make a payment receipt, enter your business details, payment method, and itemized amounts, then download the receipt as an A4 PDF. Unlike an invoice, which requests payment, a receipt confirms payment received. Generation runs fully in your browser, keeping every transaction detail private.',
    icon: '🧾',
    category: 'Business Tools',
    categorySlug: 'business-tools',
    faqs: [
      { question: 'How do I create a receipt using ConvertOcean?', answer: 'Simply fill in your business details, customer information, payment method, and line items in the editor panel. The receipt preview updates in real time. Click "Download Receipt PDF" to save a professional A4 PDF receipt instantly.' },
      { question: 'Can I customize the receipt with my business branding?', answer: 'Yes. You can enter your business name, address, contact details, and custom notes. The receipt renders with a clean, professional layout suitable for any industry.' },
      { question: 'What payment methods can I include on the receipt?', answer: 'You can select from Cash, Credit Card, Debit Card, Bank Transfer, PayPal, Check, or enter a custom payment method. The selected method appears on the generated receipt.' },
      { question: 'Is my financial data safe when generating receipts?', answer: 'Absolutely. ConvertOcean processes all receipt data 100% locally in your browser sandbox memory. No financial details, customer names, or transaction amounts are ever uploaded to any server.' },
      { question: 'Can I generate receipts for free without limits?', answer: 'Yes. The Receipt Generator is completely free with no limits on the number of receipts you can create, customize, or download as PDF files.' },
      { question: 'What is the difference between an invoice and a receipt?', answer: 'An invoice is a request for payment sent before a transaction is completed. A receipt is a confirmation of payment issued after a transaction has been processed. Use our Invoice Generator for billing and this Receipt Generator for payment confirmations.' },
      { question: 'Can I add tax calculations to my receipts?', answer: 'Yes. You can select from GST (18%), IGST (18%), VAT (15%), or No Tax configurations. Tax amounts are automatically calculated and displayed on the receipt.' }
    ],
    relatedTools: ['invoice-generator', 'profit-margin-calculator', 'sales-tax-calculator', 'percentage-calculator'],
    content: receiptGeneratorContent
  },
  {
    slug: 'profit-margin-calculator',
    name: 'Profit Margin Calculator',
    title: 'Profit Margin & Retail Margin Calculator | ConvertOcean',
    description: 'Work out profit margin, retail margin, and markup from cost and price. Free calculator with every formula shown — and why margin and markup differ.',
    headline: 'Profit Margin Calculator.',
    subtitle: 'Calculate profit margin, markup percentage, gross profit, and net profitability from cost and revenue figures instantly.',
    quickAnswer: 'Profit margin is the percentage of revenue you keep as profit: Margin = ((Revenue − Cost) ÷ Revenue) × 100. Buying at $60 and selling at $100 gives a 40% margin — and a 66.7% markup, which is a different number. This calculator computes margin, markup, and gross profit entirely in your browser.',
    icon: '📈',
    category: 'Business Tools',
    categorySlug: 'business-tools',
    faqs: [
      { question: 'What is the difference between profit margin and markup?', answer: 'Profit margin is the percentage of revenue that is profit (Profit ÷ Revenue × 100). Markup is the percentage added to cost to get the selling price (Profit ÷ Cost × 100). For example, buying at $60 and selling at $100 gives a 40% margin but a 66.7% markup.' },
      { question: 'How do I calculate gross profit margin?', answer: 'Gross Profit Margin = ((Revenue − Cost of Goods Sold) ÷ Revenue) × 100. Enter your revenue and cost values in our calculator to get instant results with a visual breakdown.' },
      { question: 'Can I calculate the selling price from a desired margin?', answer: 'Yes. Switch to "Find Selling Price" mode, enter your cost and desired profit margin percentage, and the calculator will compute the required selling price and expected profit.' },
      { question: 'Is this calculator accurate for business accounting?', answer: 'Yes. Our calculator uses standard financial formulas for profit margin, markup, and gross profit calculations. Results are computed with full decimal precision for professional accuracy.' },
      { question: 'Can I use this for e-commerce product pricing?', answer: 'Absolutely. Enter your product cost (including shipping, manufacturing, etc.) and your desired margin or selling price to determine optimal pricing strategies for your online store.' },
      { question: 'Does this calculator store my financial data?', answer: 'No. All calculations are performed locally in your browser. No financial figures, costs, or revenue data are transmitted to any server or stored anywhere.' },
      { question: 'What formulas does the profit margin calculator use?', answer: 'The calculator uses three core formulas: Profit Margin (%) = (Profit ÷ Revenue) × 100, Markup (%) = (Profit ÷ Cost) × 100, and Gross Profit = Revenue − Cost of Goods Sold.' }
    ],
    relatedTools: ['break-even-calculator', 'percentage-calculator', 'sales-tax-calculator', 'invoice-generator', 'receipt-generator'],
    content: profitMarginCalculatorContent
  },
  {
    slug: 'break-even-calculator',
    name: 'Break-Even Calculator',
    title: 'Break-Even Point Calculator - Units & Revenue | ConvertOcean',
    description: 'Calculate your break-even point in units and revenue instantly. Free calculator with contribution margin, target-profit mode, and clear formulas. 100% private.',
    headline: 'Break-Even Calculator.',
    subtitle: 'Find how many units you need to sell to cover your costs — break-even point in units and revenue, contribution margin, and target-profit volume.',
    quickAnswer: 'Your break-even point is the sales volume where revenue exactly covers costs: Break-Even Units = Fixed Costs ÷ (Price − Variable Cost per Unit). With $5,000 fixed costs, a $39 price, and $14 unit cost, you break even at 200 units. The calculator also finds target-profit volumes and required prices.',
    icon: '⚖️',
    category: 'Business Tools',
    categorySlug: 'business-tools',
    faqs: [
      { question: 'How do I calculate my break-even point?', answer: 'Break-Even Units = Fixed Costs ÷ (Selling Price per Unit − Variable Cost per Unit). For example, with $5,000 in monthly fixed costs, a $39 price, and $14 variable cost per unit: $5,000 ÷ $25 = 200 units per month. Multiply by price to get break-even revenue ($7,800).' },
      { question: 'What is contribution margin?', answer: 'Contribution margin is what each sale contributes toward covering fixed costs: Selling Price − Variable Cost per Unit. If a unit sells for $39 with $14 in variable costs, every sale contributes $25. The contribution margin ratio expresses this as a share of the price — 64.1% in this example.' },
      { question: 'What is the difference between fixed and variable costs?', answer: 'Fixed costs stay the same regardless of sales volume — rent, salaries, insurance, subscriptions. Variable costs scale with each unit sold — materials, packaging, shipping, payment fees, commissions. Break-even analysis requires splitting your costs correctly into these two groups.' },
      { question: 'How many units do I need to sell to reach a target profit?', answer: 'Use the formula: Units = (Fixed Costs + Target Profit) ÷ Contribution Margin per Unit. Our calculator includes a dedicated "Units for Target Profit" mode — enter your profit goal alongside your costs and price to get the required sales volume instantly.' },
      { question: 'What if my selling price is lower than my variable cost per unit?', answer: 'Then no sales volume can ever break even — every additional sale increases your loss, because each unit costs more to deliver than it earns. The calculator flags this case. You must either raise the price or reduce the variable cost per unit.' },
      { question: 'Can freelancers and service businesses use this calculator?', answer: 'Yes. Treat a billable project, client engagement, or billable hour as your "unit." Enter your monthly overheads as fixed costs, per-project delivery costs as variable costs, and your typical project fee as the price to find how many engagements per month cover your costs.' },
      { question: 'Is my financial data stored or uploaded?', answer: 'No. All break-even calculations run 100% locally in your browser sandbox memory. Your fixed costs, unit economics, prices, and profit targets are never transmitted to any server, logged, or stored anywhere.' },
      { question: 'What formulas does the break-even calculator use?', answer: 'Three standard cost-volume-profit formulas: Break-Even Units = Fixed Costs ÷ (Price − Variable Cost), Break-Even Revenue = Break-Even Units × Price, and Target-Profit Units = (Fixed Costs + Target Profit) ÷ Contribution Margin. Each result displays its substituted formula for verification.' }
    ],
    relatedTools: ['profit-margin-calculator', 'percentage-calculator', 'sales-tax-calculator', 'invoice-generator'],
    content: breakEvenCalculatorContent
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    title: 'Percentage Calculator - Calculate Percentage Increase & Decrease | ConvertOcean',
    description: 'Calculate percentages, percentage increase, percentage decrease, and percentage differences online. Free percentage calculator with step-by-step formulas. 100% private.',
    headline: 'Percentage Calculator.',
    subtitle: 'Calculate percentages, percentage change, increase, decrease, and differences with step-by-step formula breakdowns.',
    quickAnswer: 'To calculate a percentage, multiply the base number by the percentage and divide by 100 — 15% of 200 is (200 × 15) ÷ 100 = 30. This calculator also handles percentage increase, decrease, and difference, plus adding or subtracting a percentage, showing the full formula for every result.',
    icon: '🔢',
    category: 'Business Tools',
    categorySlug: 'business-tools',
    faqs: [
      { question: 'How do I calculate a percentage of a number?', answer: 'To find X% of Y, multiply Y by X and divide by 100. For example, 15% of 200 = (200 × 15) ÷ 100 = 30. Enter your values in our calculator for instant results.' },
      { question: 'How do I calculate percentage increase?', answer: 'Percentage Increase = ((New Value − Old Value) ÷ Old Value) × 100. For example, if a price goes from $80 to $100, the increase is ((100 − 80) ÷ 80) × 100 = 25%.' },
      { question: 'How do I calculate percentage decrease?', answer: 'Percentage Decrease = ((Old Value − New Value) ÷ Old Value) × 100. For example, if a price drops from $100 to $75, the decrease is ((100 − 75) ÷ 100) × 100 = 25%.' },
      { question: 'What is the difference between percentage change and percentage difference?', answer: 'Percentage change compares a new value to an original value (has direction: increase or decrease). Percentage difference compares two values without implying which is the original: |A − B| ÷ ((A + B) ÷ 2) × 100.' },
      { question: 'Can I calculate what percentage one number is of another?', answer: 'Yes. To find what percentage X is of Y, use the formula: (X ÷ Y) × 100. Our calculator includes this mode with instant results and formula display.' },
      { question: 'Is this calculator free to use?', answer: 'Yes. The Percentage Calculator is 100% free with no limits, no account required, and no advertisements. All calculations run locally in your browser.' },
      { question: 'Can I add or subtract a percentage from a number?', answer: 'Yes. Our calculator includes modes to add X% to Y (Y + Y×X/100) and subtract X% from Y (Y − Y×X/100), useful for calculating tips, discounts, and tax-inclusive prices.' },
      { question: 'Does the calculator show the formula used?', answer: 'Yes. Every calculation displays the step-by-step formula breakdown so you can understand and verify the math behind each result.' }
    ],
    relatedTools: ['profit-margin-calculator', 'break-even-calculator', 'sales-tax-calculator', 'invoice-generator', 'receipt-generator'],
    content: percentageCalculatorContent
  },
  {
    slug: 'sales-tax-calculator',
    name: 'Sales Tax Calculator',
    title: 'Sales Tax Calculator - Calculate Tax Amount & Total Price | ConvertOcean',
    description: 'Calculate sales tax, total price including tax, and tax amounts instantly. Free online sales tax calculator with US, UK, Canada, and Australia tax rate presets. 100% private.',
    headline: 'Sales Tax Calculator.',
    subtitle: 'Calculate sales tax amounts, total price including tax, and reverse tax from gross prices. Supports US, UK, Canada, Australia, and custom tax rates.',
    quickAnswer: 'To calculate sales tax, multiply the pre-tax price by the tax rate: a $100 purchase at 8.25% adds $8.25 in tax for a $108.25 total. The calculator also reverse-calculates the pre-tax price from a tax-inclusive total, with preset rates for US sales tax, UK VAT, Canadian GST/HST, and Australian and Indian GST.',
    icon: '💰',
    category: 'Business Tools',
    categorySlug: 'business-tools',
    faqs: [
      { question: 'How do I calculate sales tax on a purchase?', answer: 'Sales Tax Amount = Price × (Tax Rate ÷ 100). Total Price = Price + Sales Tax Amount. For example, a $100 item with 8.25% tax: Tax = $8.25, Total = $108.25. Enter your values for instant results.' },
      { question: 'How do I reverse calculate tax from a total price?', answer: 'To find the pre-tax price from a tax-inclusive total: Pre-Tax Price = Total ÷ (1 + Tax Rate ÷ 100). For example, a $108.25 total at 8.25% tax: Pre-tax = $108.25 ÷ 1.0825 = $100.00.' },
      { question: 'What tax rate presets are available?', answer: 'We include presets for US Average (7.12%), UK VAT (20%), Canada GST (5%), Canada HST (13%), Australia GST (10%), Germany VAT (19%), India GST (18%), and Japan Consumption Tax (10%). You can also enter any custom tax rate.' },
      { question: 'Can I calculate tax for multiple items?', answer: 'Yes. Enter the total pre-tax amount for all your items and the applicable tax rate. The calculator will compute the total tax and grand total for the entire purchase.' },
      { question: 'What is the difference between sales tax, VAT, and GST?', answer: 'Sales tax is charged at the point of sale (common in the US). VAT (Value Added Tax) is charged at each production stage (common in Europe/UK). GST (Goods and Services Tax) is similar to VAT and used in countries like Australia, Canada, and India. Our calculator works with all types.' },
      { question: 'Is my purchase data stored or tracked?', answer: 'No. All tax calculations are performed 100% locally in your browser sandbox memory. No prices, tax amounts, or purchase details are ever uploaded to any server.' },
      { question: 'Can I use this calculator for business tax planning?', answer: 'Yes. Use the calculator to estimate tax obligations on sales, verify customer invoices, plan pricing strategies, and calculate tax-inclusive or tax-exclusive prices for your products and services.' },
      { question: 'How accurate are the tax calculations?', answer: 'Calculations use standard mathematical formulas with full decimal precision. Results are rounded to two decimal places for currency display. For official tax filings, always verify with your local tax authority.' }
    ],
    relatedTools: ['profit-margin-calculator', 'break-even-calculator', 'percentage-calculator', 'invoice-generator', 'receipt-generator'],
    content: salesTaxCalculatorContent
  },
  {
    slug: 'ofx-to-csv',
    name: 'OFX to CSV',
    title: 'Convert OFX to CSV & Excel Online - Free | ConvertOcean',
    description: 'Convert OFX bank statements to CSV or Excel right in your browser. Reads both OFX versions, keeps every account, and never uploads your financial data.',
    headline: 'OFX to CSV.',
    subtitle: 'Turn an OFX bank statement into a clean spreadsheet — CSV or Excel, with the columns your accounting software expects.',
    quickAnswer: 'To convert OFX to CSV, drop your .ofx statement above and download a spreadsheet of every transaction: date, type, description, memo, amount, cheque number and transaction ID. You can switch to an Excel workbook or to a 3-column layout for bank-import wizards. The statement is parsed inside your browser and never uploaded, which matters because an OFX file carries your account and routing numbers.',
    icon: '🏦',
    category: 'Business Tools',
    categorySlug: 'business-tools',
    faqs: [
      { question: 'What is an OFX file, and where do I get one?', answer: 'OFX (Open Financial Exchange) is the format banks use to hand transaction data to accounting software. On most online banking sites the download option is labelled "OFX", "Web Connect", "Money" or sometimes just "for accounting software", alongside the PDF and CSV options.' },
      { question: 'Does this read both OFX versions?', answer: 'Yes. OFX 1.x is SGML — its tags are frequently left unclosed, which a strict XML parser rejects outright — and OFX 2.x is true XML. Both are read by the same tolerant parser, along with the unescaped ampersands that real payee names like "AT&T" put into these files.' },
      { question: 'What if my file contains more than one account?', answer: 'Every account is converted, not just the first. When a file holds several, an Account column is added so each row says which one it came from, and the Excel export gains a Summary sheet listing each account with its statement period and closing balance.' },
      { question: 'Are the dates converted to my timezone?', answer: 'No, deliberately. OFX timestamps often carry a zone, such as 20260101120000[-5:EST]. Shifting those into the reader\'s local zone is how a January 1 transaction lands on December 31 and moves between tax periods. The date in your spreadsheet is the date the file states.' },
      { question: 'Is my bank data uploaded anywhere?', answer: 'No. The parser is JavaScript running in your browser, so the statement is read on your own device and no part of it is transmitted. An OFX file typically contains your account number, routing number and full transaction history, which is precisely the data you should not be posting to an unknown server.' },
      { question: 'Can I open the CSV in Excel or Google Sheets?', answer: 'Yes, both open it directly. If you want real date and number cells rather than text that needs converting, pick the Excel (.xlsx) output instead — it writes typed cells, so dates sort chronologically and amounts total correctly straight away.' }
    ],
    relatedTools: ['qfx-to-csv', 'qbo-to-csv', 'csv-to-xlsx', 'xlsx-to-csv', 'profit-margin-calculator']
  },
  {
    slug: 'qfx-to-csv',
    name: 'QFX to CSV',
    title: 'QFX to CSV - Convert Quicken Files Free | ConvertOcean',
    description: 'Convert Quicken QFX files to CSV or Excel without Quicken and without uploading. Reads Web Connect bank statements straight in your browser, completely free.',
    headline: 'QFX to CSV.',
    subtitle: 'Open a Quicken Web Connect statement without Quicken — convert it to CSV or Excel entirely on your own device.',
    quickAnswer: 'To convert QFX to CSV, select your .qfx file above and download the transactions as a spreadsheet. QFX is Quicken\'s licensed variant of OFX, so a file that only Quicken will import becomes a plain CSV or Excel workbook that any software reads. Choose the full detail layout or a 3-column Date, Description, Amount layout. Nothing is uploaded — the file is parsed in your browser.',
    icon: '🏦',
    category: 'Business Tools',
    categorySlug: 'business-tools',
    faqs: [
      { question: 'Do I need Quicken to open a QFX file?', answer: 'Not with this converter. QFX is Quicken\'s branded version of OFX and other software often refuses it, because Intuit\'s format carries a bank identifier that non-Quicken apps will not accept. Converting to CSV or Excel sidesteps that entirely — you get the transactions as data, with no application requirement.' },
      { question: 'What is the difference between QFX and OFX?', answer: 'Structurally, almost nothing. QFX is OFX with an extra Intuit header block, and the transaction records inside are identical. The difference is licensing rather than technology: banks pay to issue QFX, and Quicken checks for those Intuit markers when deciding whether to accept a file.' },
      { question: 'My Quicken subscription lapsed — can I still get my data out?', answer: 'Yes. The QFX file your bank produces is readable on its own; it does not need Quicken to be unlocked. Convert it here and you have your transactions in a spreadsheet you own, independent of any subscription.' },
      { question: 'Which columns can I export?', answer: 'Three layouts. Full detail gives date, type, description, memo, amount, cheque number, currency and transaction ID. The 3-column layout gives Date, Description and Amount — the shape most bank-import wizards ask for. The 4-column layout splits money out and money in into separate Debit and Credit columns.' },
      { question: 'Is my financial data sent to a server?', answer: 'No. The conversion is done by JavaScript in your own browser, so the statement never leaves your device. That is worth caring about here: a QFX file lists your account number and every transaction on the statement.' },
      { question: 'What happens to a brokerage QFX file?', answer: 'Cash activity — dividends swept to cash, transfers, fees — converts normally. Securities trades do not: a trade carries units, unit price and a security identifier, which cannot honestly be flattened into a bank-statement row. Rather than dropping them silently, the tool counts them and tells you how many were left out.' }
    ],
    relatedTools: ['qbo-to-csv', 'ofx-to-csv', 'csv-to-xlsx', 'xlsx-to-csv', 'profit-margin-calculator']
  },
  {
    slug: 'qbo-to-csv',
    name: 'QBO to CSV',
    title: 'QBO to CSV - Convert QuickBooks Files Free | ConvertOcean',
    description: 'Convert QuickBooks QBO Web Connect files to CSV or Excel in your browser. Review and fix transactions before they reach your books — nothing is uploaded.',
    headline: 'QBO to CSV.',
    subtitle: 'Convert a QuickBooks Web Connect file into a spreadsheet you can read, check, and correct before importing.',
    quickAnswer: 'To convert QBO to CSV, select your .qbo Web Connect file above and download the transactions as CSV or Excel. This is the usual fix when QuickBooks refuses a bank\'s QBO file, and it lets you review the rows before they reach your books. A 3-column Date, Description, Amount layout is available for CSV bank import. The file is parsed in your browser and never uploaded.',
    icon: '🏦',
    category: 'Business Tools',
    categorySlug: 'business-tools',
    faqs: [
      { question: 'Why would I convert a QBO file instead of importing it?', answer: 'Because a QBO import goes straight into your books, unreviewed. Converting first lets you see every row in a spreadsheet, check the statement period and totals, and correct or categorise descriptions before anything is committed — which is far easier than unpicking a bad import afterwards.' },
      { question: 'QuickBooks rejected my bank\'s QBO file. Does this help?', answer: 'It gives you a route around it. QBO import failures usually come from the file\'s bank identifier rather than the transactions themselves, so the data is fine even when the import is refused. Converting to CSV produces a file you can bring in through the manual CSV upload instead.' },
      { question: 'Which layout should I choose for a CSV bank import?', answer: 'The 3-column layout produces Date, Description and Amount, with money out as negative numbers. The 4-column layout splits those into separate Debit and Credit columns instead. Import wizards ask you to map columns to their own fields, so check the mapping step and pick whichever your setup expects.' },
      { question: 'What is actually inside a QBO file?', answer: 'The same OFX structure that banks have used since 1997, plus Intuit\'s identifiers. Each transaction record holds a type, a posted date, an amount, a unique transaction ID and a payee name — which is why a QBO file converts to a spreadsheet cleanly, with no information invented along the way.' },
      { question: 'Does my client data leave my computer?', answer: 'No. Everything runs in your browser, so the statement stays on your machine. For anyone handling other people\'s books this is the deciding difference: uploading a client\'s full transaction history to a third-party converter is a disclosure you would have to justify, and here there is nothing to justify.' },
      { question: 'Can I convert several months at once?', answer: 'Yes — one file at a time, but a file covering any date range converts in full, and files containing multiple accounts are converted in full too, with an Account column identifying each row. The on-screen summary reports the statement period and transaction count so you can confirm the range is what you expected.' }
    ],
    relatedTools: ['qfx-to-csv', 'ofx-to-csv', 'csv-to-xlsx', 'invoice-generator', 'profit-margin-calculator']
  },
  {
    slug: 'xls-to-pdf',
    name: 'XLS to PDF',
    title: 'Convert XLS to PDF Online - 100% Private | ConvertOcean',
    description: 'Convert legacy Excel XLS files to high-fidelity PDF documents in your browser. 100% private, offline, and free.',
    headline: 'XLS to PDF.',
    subtitle: 'Convert XLS Excel sheets directly to clean PDF sheets client-side.',
    quickAnswer: 'To convert a legacy .xls workbook to PDF, add the file above and download a PDF where every sheet is drawn as a real bordered table with a repeating shaded header. The text stays selectable and searchable rather than flattened to an image, and column widths are fitted automatically. Nothing is transmitted — the workbook is read and rendered inside your browser.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['excel-to-pdf', 'xls-to-csv', 'xlsx-to-csv', 'csv-to-pdf']
  },
  {
    slug: 'csv-to-pdf',
    name: 'CSV to PDF',
    title: 'Convert CSV to PDF Online - 100% Private | ConvertOcean',
    description: 'Convert CSV spreadsheets to print-ready PDF files directly in your browser. 100% private with no server uploads.',
    headline: 'CSV to PDF.',
    subtitle: 'Compile flat CSV documents into printable PDF formats locally on your device.',
    quickAnswer: 'To convert CSV to PDF, drop your .csv into the tool above and download the PDF. The rows are drawn as a real bordered table with a shaded header that repeats across page breaks, and the text stays selectable and searchable rather than being flattened into an image. Column widths are fitted automatically. Everything runs in your browser, so the data never leaves your device.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['excel-to-pdf', 'csv-to-json', 'json-to-csv', 'csv-to-xlsx']
  },
  {
    slug: 'xlsx-to-json',
    name: 'XLSX to JSON',
    title: 'Convert XLSX to JSON Online - 100% Private | ConvertOcean',
    description: 'Convert XLSX Excel sheets to structured JSON arrays offline in your browser. 100% device-level privacy.',
    headline: 'XLSX to JSON.',
    subtitle: 'Select modern Excel workbooks (.xlsx) and compile them into clean JSON text client-side.',
    quickAnswer: 'To convert Excel to JSON, select an .xlsx workbook above and download its first sheet as an array of objects — the header row becomes the keys and each row becomes one object. It is the direct route from a spreadsheet a colleague maintains into code, a fixture file, or a NoSQL import. Everything is parsed in your browser, so customer lists and financial exports never leave your device.',
    icon: '⚙️',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['csv-to-json', 'xlsx-to-csv', 'json-to-xlsx']
  },
  {
    slug: 'xls-to-json',
    name: 'XLS to JSON',
    title: 'Convert XLS to JSON Online - 100% Private | ConvertOcean',
    description: 'Convert legacy Excel XLS files to JSON format offline in your browser. 100% secure client-side tools.',
    headline: 'XLS to JSON.',
    subtitle: 'Transform legacy Excel sheets (.xls) into standard JSON objects arrays locally.',
    quickAnswer: 'To convert a legacy .xls workbook to JSON, select it above and download its first sheet as an array of objects, with the header row supplying the keys and each row becoming one object. It is the quickest route from an old Excel export into application code, an API fixture, or a document database. The workbook is parsed in your browser and never uploaded.',
    icon: '⚙️',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['csv-to-json', 'xls-to-csv', 'xlsx-to-json']
  },
  {
    slug: 'xls-to-csv',
    name: 'XLS to CSV',
    title: 'Convert XLS to CSV Online - 100% Private | ConvertOcean',
    description: 'Convert legacy Excel XLS files to CSV format client-side instantly. Zero server uploads.',
    headline: 'XLS to CSV.',
    subtitle: 'Compile XLS spreadsheets into standard comma-separated text (.csv) locally.',
    quickAnswer: 'To convert a legacy .xls workbook to CSV, select it above and download its first sheet as comma-separated text that any database, script, or import wizard can read. Values containing commas or quotes are escaped correctly, which is where hand-rolled exports usually break. Use it to get data out of old Excel files without needing Excel. Parsing happens entirely in your browser.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['xlsx-to-csv', 'xls-to-json', 'xls-to-pdf']
  },
  {
    slug: 'xml-to-csv',
    name: 'XML to CSV',
    title: 'Convert XML to CSV Online - 100% Private | ConvertOcean',
    description: 'Convert XML files to CSV spreadsheets offline in your browser. 100% secure client-side data converter.',
    headline: 'XML to CSV.',
    subtitle: 'Transform nested XML data structures into simple comma-separated tables client-side.',
    quickAnswer: 'To convert XML to CSV, select your .xml file above and download a flat comma-separated table, with repeating elements becoming rows and their child fields becoming columns. Malformed XML — an unclosed tag or a stray ampersand — is detected and reported instead of producing silently garbled rows, so the tool doubles as a quick well-formedness check. Parsing is entirely local.',
    icon: '⚙️',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['xml-to-json', 'json-to-csv', 'xlsx-to-csv']
  },
  {
    slug: 'xml-to-xlsx',
    name: 'XML to XLSX',
    title: 'Convert XML to XLSX Online - 100% Private | ConvertOcean',
    description: 'Convert XML data to Microsoft Excel XLSX sheets offline. 100% browser-level privacy.',
    headline: 'XML to XLSX.',
    subtitle: 'Compile nested XML documents into standard Excel spreadsheets (.xlsx) locally.',
    quickAnswer: 'To convert XML to Excel, select your .xml file above and download a native .xlsx workbook with typed cells, ready to sort, filter, and pivot. Repeating elements become rows and their child fields become columns. Malformed XML is detected and reported rather than producing garbled rows. The conversion runs entirely in your browser, so enterprise payloads never touch a server.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['xml-to-json', 'json-to-xlsx', 'csv-to-xlsx']
  },
  {
    slug: 'jpg-to-webp',
    name: 'JPG to WebP',
    title: 'Convert JPG to WebP Online - 100% Private | ConvertOcean',
    description: 'Convert JPG/JPEG images to next-generation WebP format in your browser. 100% private and free.',
    headline: 'JPG to WebP.',
    subtitle: 'Convert JPEG images to highly compressed WebP formats client-side.',
    quickAnswer: 'To convert JPG to WebP, select your .jpg above and download a WebP that is typically 25–35% smaller at comparable quality. Every modern browser supports WebP, so it is usually the better format for web images and faster page loads. Keep the original JPG if you need compatibility with older desktop software. The re-encode happens on your own device.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['png-to-webp', 'webp-to-jpg', 'jpg-to-png']
  },
  {
    slug: 'webp-to-jpg',
    name: 'WebP to JPG',
    title: 'Convert WebP to JPG Online - 100% Private | ConvertOcean',
    description: 'Convert modern WebP images to standard JPG format client-side. Fast, secure, and offline capable.',
    headline: 'WebP to JPG.',
    subtitle: 'Convert modern WebP images back into standard compressed JPG format locally.',
    quickAnswer: 'To convert WebP to JPG, select your .webp above and download a JPG that opens in any software, including older editors that cannot read WebP. Because JPG has no transparency, transparent areas are flattened onto a white background rather than turning black. Expect a modest size increase. The re-encode runs entirely in your browser, so the image is never transmitted.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['webp-to-png', 'jpg-to-webp', 'png-to-jpg', 'avif-to-jpg']
  },
  {
    slug: 'heic-to-jpg',
    name: 'HEIC to JPG',
    title: 'Convert HEIC to JPG Online - Free, No Upload | ConvertOcean',
    description: "Convert iPhone HEIC photos to universal JPG right in your browser — free and private, nothing uploaded. Fix photos that Windows and upload forms can't open.",
    headline: 'HEIC to JPG.',
    subtitle: "Convert iPhone HEIC/HEIF photos into universally supported JPG format — decoded entirely on your device.",
    quickAnswer: 'To convert HEIC to JPG, select your .heic photo above — an open-source decoder converts it to a JPG at 92% quality that opens on Windows, Android, and every upload form. The decoder itself is a one-time ~1MB download on your first file; your photo is never uploaded anywhere. Camera metadata such as GPS location is not carried into the output.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes, after the first conversion — the HEIC decoder is fetched once and cached, and your photos are always processed locally.' }
    ],
    relatedTools: ['heic-to-png', 'avif-to-jpg', 'image-resizer', 'jpg-to-jpeg']
  },
  {
    slug: 'heic-to-png',
    name: 'HEIC to PNG',
    title: 'Convert HEIC to PNG Online - Free, Lossless | ConvertOcean',
    description: "Convert HEIC photos to lossless PNG entirely in your browser. No uploads — ideal for editing, transparency, and software that cannot read Apple's format.",
    headline: 'HEIC to PNG.',
    subtitle: 'Convert Apple HEIC/HEIF images into lossless PNG files, decoded and re-encoded entirely client-side.',
    quickAnswer: 'To convert HEIC to PNG, select your .heic file above and download a lossless PNG that every editor and platform accepts. The open-source decoder loads once (~1MB) on your first file and runs entirely in your browser — the photo itself never leaves your device. Expect the PNG to be larger than the HEIC original, since PNG stores pixels without lossy compression.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes, after the first conversion — the HEIC decoder is fetched once and cached, and your photos are always processed locally.' }
    ],
    relatedTools: ['heic-to-jpg', 'avif-to-png', 'webp-to-png', 'png-to-jpg']
  },
  {
    slug: 'avif-to-jpg',
    name: 'AVIF to JPG',
    title: 'Convert AVIF to JPG Online - Free, No Upload | ConvertOcean',
    description: 'Convert AVIF images to universal JPG right in your browser — free, private, offline-capable. Fix files that email clients and upload forms reject.',
    headline: 'AVIF to JPG.',
    subtitle: 'Convert next-generation AVIF images into universally supported JPG format, decoded and re-encoded locally.',
    quickAnswer: 'To convert AVIF to JPG, select your .avif file above — the browser decodes it with its built-in AVIF engine and re-encodes a JPG at 92% quality that opens in any software, email client, or upload form. Transparent areas are flattened to white, and an animated AVIF exports its first frame. The conversion runs on your device; the image is never uploaded.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['avif-to-png', 'heic-to-jpg', 'webp-to-jpg', 'png-to-jpg', 'image-resizer']
  },
  {
    slug: 'avif-to-png',
    name: 'AVIF to PNG',
    title: 'Convert AVIF to PNG Online - Keep Transparency | ConvertOcean',
    description: 'Convert AVIF to lossless PNG with transparency preserved, entirely in your browser. No uploads — ideal for editing, documents, and picky upload forms.',
    headline: 'AVIF to PNG.',
    subtitle: 'Convert AVIF images into lossless PNG files with transparency preserved, entirely client-side.',
    quickAnswer: 'To convert AVIF to PNG, select your .avif file above and download a lossless PNG with any transparency preserved. PNG opens in every editor and passes upload forms that reject modern formats, though it will be noticeably larger than the AVIF original. Decoding and re-encoding run entirely in your browser, so the image never leaves your device.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['avif-to-jpg', 'heic-to-png', 'webp-to-png', 'png-to-webp', 'jpg-to-png']
  },
  {
    slug: 'svg-to-png',
    name: 'SVG to PNG',
    title: 'Convert SVG to PNG Online - 100% Private | ConvertOcean',
    description: 'Convert vector SVG files to transparent PNG images in your browser. 100% private and free.',
    headline: 'SVG to PNG.',
    subtitle: 'Rasterize vector SVG files into transparent PNG format client-side.',
    quickAnswer: 'To convert SVG to PNG, select your .svg above and download a rasterised PNG with transparency preserved. Since SVG carries no fixed pixel dimensions, the tool chooses a sensible canvas size and upscales small graphics so edges and text stay sharp instead of pixelated. PNG is the right target when a logo or icon needs a transparent background. Everything runs in your browser.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['svg-to-jpg', 'svg-to-webp', 'png-to-jpg']
  },
  {
    slug: 'svg-to-jpg',
    name: 'SVG to JPG',
    title: 'Convert SVG to JPG Online - 100% Private | ConvertOcean',
    description: 'Convert SVG vector graphics to compressed JPG format client-side. 100% browser-level security.',
    headline: 'SVG to JPG.',
    subtitle: 'Convert vector SVG files into high-quality JPG images locally.',
    quickAnswer: 'To convert SVG to JPG, select your .svg above and download a rasterised JPG. Because SVG is a vector format with no fixed pixel size, the tool picks a sensible canvas and upscales small graphics so edges stay crisp rather than blocky. JPG has no transparency, so any transparent background is flattened to white, not black. The rasterising happens on your device.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['svg-to-png', 'svg-to-webp', 'jpg-to-png']
  },
  {
    slug: 'svg-to-webp',
    name: 'SVG to WebP',
    title: 'Convert SVG to WebP Online - 100% Private | ConvertOcean',
    description: 'Convert vector SVG files to highly compressed WebP format in your browser. 100% private and free.',
    headline: 'SVG to WebP.',
    subtitle: 'Compile SVG vector images into modern WebP format client-side.',
    quickAnswer: 'To convert SVG to WebP, select your .svg above and download a rasterised WebP — usually far smaller than the equivalent PNG at similar quality, with transparency preserved. The vector is drawn onto a sensibly sized canvas, and small graphics are upscaled so edges stay crisp. WebP suits web delivery where file size matters. The conversion happens entirely on your own device.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['svg-to-png', 'svg-to-jpg', 'png-to-webp']
  },
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    title: 'Convert Word to PDF Online - 100% Private | ConvertOcean',
    description: 'Convert Word document files (.docx) to print-ready PDF files in your browser. 100% private and offline-capable.',
    headline: 'Word to PDF.',
    subtitle: 'Convert Word documents (.docx) to a clean, selectable-text PDF locally on your device.',
    quickAnswer: 'To convert Word to PDF, drop a .docx file into the tool above and download the PDF. Headings, bold and italic text, lists and tables carry over, and the result is a real vector PDF — the text stays selectable and searchable, and pages break cleanly without slicing through a line. The conversion runs locally in your browser sandbox — no uploads, no account, and no file-size limits.',
    icon: '📝',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. Once the page has loaded, the converter runs entirely in your browser with no further network access.' },
      { question: 'Is the text selectable in the PDF?', answer: 'Yes. The document is rendered as a real vector PDF, so text stays selectable and searchable and headings, bold, italic, lists and tables are preserved — rather than a flat screenshot of the page. Exact Word fonts and complex page layouts (columns, headers/footers) may be simplified.' }
    ],
    relatedTools: ['pdf-to-word', 'docx-to-txt', 'txt-to-pdf']
  },
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    title: 'Convert PDF to Word Online - 100% Private | ConvertOcean',
    description: 'Convert PDF documents to editable Microsoft Word files (.docx) offline in your browser. Keeps headings, bold, tables, diagrams and layout. Zero server uploads.',
    headline: 'PDF to Word.',
    subtitle: 'Rebuild PDF text, formatting, tables and diagrams into an editable Word (.docx) document client-side.',
    quickAnswer: 'To convert a PDF to an editable Word document, select the PDF above and download the converted .docx file. Headings, bold and italic text, font sizes, indentation and detected tables are rebuilt as native Word formatting, and diagrams, figures and logos are embedded as images at their original position. Digitally created, text-based PDFs convert best; scanned PDFs need OCR first. Processing happens 100% client-side in your browser, so confidential documents are never uploaded to any server.',
    icon: '📄',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. Once loaded, the extraction and compiling run 100% offline.' },
      { question: 'Is formatting preserved?', answer: 'Yes. The converter reads the font, size, weight and position of every text fragment in the PDF and rebuilds headings, bold and italic runs, indentation, columns and detected tables as native Word formatting in a real .docx file.' },
      { question: 'Are diagrams and images included?', answer: 'Yes. Diagrams, flowcharts, figures and logos are detected and embedded as pictures at their original position, while the surrounding text and tables stay fully editable. Diagrams come in as images (not editable Word shapes), which matches how other converters handle them.' }
    ],
    relatedTools: ['word-to-pdf', 'pdf-to-txt', 'txt-to-pdf']
  },
  {
    slug: 'docx-to-txt',
    name: 'Word to TXT',
    title: 'Convert Word to TXT Online - 100% Private | ConvertOcean',
    description: 'Extract raw text nodes from Word document files (.docx) client-side. 100% private and offline capable.',
    headline: 'Word to TXT.',
    subtitle: 'Extract text from Word documents and download them as plain text files locally.',
    quickAnswer: 'To convert Word to plain text, select a .docx file above and download a .txt containing just the words. Formatting is deliberately discarded — fonts, colours, tables, and images cannot survive, because plain text has nowhere to store them. It is the right choice for feeding a document into a script, a diff, or a word-count tool. Extraction happens locally in your browser.',
    icon: '📝',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. The extraction engine processes elements directly in local memory.' }
    ],
    relatedTools: ['word-to-pdf', 'pdf-to-txt', 'txt-to-pdf']
  },
  {
    slug: 'pptx-to-pdf',
    name: 'PowerPoint to PDF',
    title: 'Convert PowerPoint to PDF Online - 100% Private | ConvertOcean',
    description: 'Convert modern PowerPoint (.pptx) files to PDF in your browser. Slides render with their real layout, theme and background — nothing is uploaded.',
    headline: 'PowerPoint to PDF.',
    subtitle: 'Render slides with their real layout and theme, then compile them to PDF locally.',
    quickAnswer: 'To convert PowerPoint to PDF, select a .pptx file above and download a PDF that keeps each slide\'s real layout, theme, colours, text, and tables — one slide per page. It is ideal for sharing decks that look identical on any device without PowerPoint. Legacy .ppt must be re-saved as .pptx first. Everything runs in your browser.',
    icon: '📊',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. The PowerPoint zip structure is parsed directly inside the browser memory.' }
    ],
    relatedTools: ['ppt-to-pdf', 'word-to-pdf', 'txt-to-pdf']
  },
  {
    slug: 'ppt-to-pdf',
    name: 'PPT to PDF (Legacy)',
    title: 'Convert PPT to PDF Online - 100% Private | ConvertOcean',
    description: 'Got an old .ppt file? Re-save it as .pptx first (we show you how), then render it to PDF locally — no uploads, no signup, nothing leaves your device.',
    headline: 'PPT to PDF.',
    subtitle: 'Legacy .ppt needs a one-step re-save to .pptx — then slides render to PDF on your device.',
    quickAnswer: 'To convert a PowerPoint to PDF, add your file above and download a PDF with one slide per page, rendered with its theme colours, fonts, backgrounds, and tables intact. Note that the legacy binary .ppt format cannot be read in a browser at all — open it in PowerPoint or LibreOffice and save it as .pptx first, then convert. Rendering happens entirely on your device.',
    icon: '🗄️',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Can I convert legacy .ppt files directly?', answer: 'Not directly — .ppt is a closed binary format that browsers cannot read. The one-step fix: open the file in PowerPoint (or the free LibreOffice Impress), choose File → Save As and pick .pptx, then select that .pptx here. Conversion still happens entirely on your device — nothing is sent to us at any point.' }
    ],
    relatedTools: ['pptx-to-pdf', 'word-to-pdf', 'txt-to-pdf']
  },
  {
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    title: 'Convert PDF to Excel Online - 100% Private | ConvertOcean',
    description: 'Convert PDF files to formatted Excel worksheets (.xlsx) offline in your browser. 100% device-level security with no server uploads.',
    headline: 'PDF to Excel.',
    subtitle: 'Rebuild PDF tables into aligned Excel rows and columns and download them as a workbook locally.',
    quickAnswer: 'To convert a PDF to Excel, select the PDF above and download the .xlsx file. Tables are reconstructed cell by cell: multi-word values are kept whole and every row is aligned to the same columns, instead of scattering each text fragment into its own cell. Digitally created, text-based PDFs convert best; scanned PDFs need OCR first. Everything runs 100% client-side in your browser, so confidential spreadsheets are never uploaded to any server.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. Once loaded, the extraction and Excel compiler run 100% offline.' },
      { question: 'Are table columns preserved?', answer: 'Yes. The converter detects each table’s columns from the shared vertical gaps between values and aligns every row to them, and it merges the split text fragments that make up one cell back into a single value. Very dense tables with merged header cells may need minor cleanup, but rows stay aligned.' }
    ],
    relatedTools: ['excel-to-pdf', 'csv-to-xlsx', 'json-to-xlsx']
  },
  {
    slug: 'merge-excel',
    name: 'Merge Excel & CSV',
    title: 'Merge Excel & CSV Online - 100% Private | ConvertOcean',
    description: 'Merge multiple Excel workbooks (.xlsx, .xls) and CSV sheets into a single spreadsheet document offline in your browser. 100% secure.',
    headline: 'Merge Excel & CSV.',
    subtitle: 'Stitch sheets and combine data rows from multiple Excel or CSV files client-side locally.',
    quickAnswer: 'To merge Excel files, add two or more .xlsx, .xls, or .csv files above and download a single workbook containing every source sheet. Each tab is renamed to sourcefile_sheetname — trimmed to Excel\'s 31-character limit, and numbered if two still collide — so you can always tell which workbook a sheet came from and nothing is silently overwritten. All parsing and rebuilding happens in your browser.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No. All files are merged client-side in your browser sandboxed memory.' },
      { question: 'Does it work offline?', answer: 'Yes. The SheetJS merging engine runs completely offline without internet connection.' }
    ],
    relatedTools: ['split-excel', 'excel-to-pdf', 'xlsx-to-csv']
  },
  {
    slug: 'split-excel',
    name: 'Split Excel & CSV',
    title: 'Split Excel & CSV Online - 100% Private | ConvertOcean',
    description: 'Split multi-sheet Excel files or partition CSV rows into separate downloadable worksheets offline in your browser.',
    headline: 'Split Excel & CSV.',
    subtitle: 'Extract individual worksheets or partition database CSV rows into smaller files locally.',
    quickAnswer: 'To split an Excel file, select your .xlsx or .xls above and choose how to divide it: extract each worksheet into its own file, or partition a single sheet by row count into fixed-size chunks. Output can be .xlsx or .csv, and every sheet starts selected so a straightforward split is one click. The workbook is parsed in your browser and never uploaded.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No. All file extraction and partition computations happen locally on your hardware.' },
      { question: 'Does it work offline?', answer: 'Yes. The SheetJS splitter engine runs 100% client-side.' }
    ],
    relatedTools: ['merge-excel', 'excel-to-pdf', 'xlsx-to-csv']
  },
  {
    slug: 'merge-images',
    name: 'Merge Images',
    title: 'Merge Images Online - 100% Private Image Merger | ConvertOcean',
    description: 'Merge multiple images (PNG, JPG, WebP, SVG) into a single PDF document or stitch them into a single image file offline. 100% secure.',
    headline: 'Merge Images.',
    subtitle: 'Combine multiple images together client-side into a single PDF or stitched image locally.',
    quickAnswer: 'To merge images, add your pictures above and choose the output: a PDF with one image per page, or a single stitched image joined vertically or horizontally. PNG, JPG, WebP, and SVG inputs are accepted, and images of differing widths are aligned rather than stretched. The PDF route offers A4 portrait, A4 landscape, or fit-to-image sizing. Everything is composited locally in your browser.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No files are uploaded. Image combinations are drawn locally on a browser Canvas or structured via jsPDF.' },
      { question: 'What options are available for stitching?', answer: 'You can combine images vertically, horizontally, or compile them as separate pages in a single PDF document.' }
    ],
    relatedTools: ['split-image', 'png-to-jpg', 'jpg-to-png']
  },
  {
    slug: 'split-image',
    name: 'Split Image',
    title: 'Split Image Online - Grid & Tile Cutter | ConvertOcean',
    description: 'Split images (PNG, JPG, WebP) into custom grids, equal rows/columns, or slices client-side in your browser. 100% secure.',
    headline: 'Split Image.',
    subtitle: 'Slice a single image file into grid tiles or parts client-side locally.',
    quickAnswer: 'To split an image, select a PNG, JPG, or WebP above and pick how to cut it: a grid of rows and columns, equal horizontal slices, or equal vertical slices. Each piece downloads as a separate image at full resolution, which suits social carousels, sprite sheets, and large scans. The cutting is done on a canvas in your browser, so the picture never leaves your device.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No. Your image is processed locally using Canvas, and split tiles are zipped in browser memory.' },
      { question: 'Can I download the tiles together?', answer: 'Yes, you can download all split tiles at once as a single ZIP archive, or save individual slices.' }
    ],
    relatedTools: ['merge-images', 'png-to-jpg', 'jpg-to-png']
  },
  {
    slug: 'merge-txt',
    name: 'Merge Text & TXT',
    title: 'Merge Text & TXT Files Online - 100% Private | ConvertOcean',
    description: 'Merge multiple plain text, markdown, CSV, or log files (.txt, .md, .csv, .log) into a single document offline in your browser. 100% secure.',
    headline: 'Merge Text & TXT.',
    subtitle: 'Concatenate multiple text files client-side using custom formatting and separators locally.',
    quickAnswer: 'To merge text files, add your .txt, .md, .csv, or .log files above and download one combined document. You choose what goes between them — a single newline, a blank line, no separator at all, or your own custom text — and can optionally insert each source filename as a header so the joined file stays traceable. Concatenation happens in browser memory, with nothing transmitted.',
    icon: '📝',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No. Text files are parsed as raw strings in browser tab memory and concatenated locally.' },
      { question: 'What separators are supported?', answer: 'You can separate files by single newline, double newline, custom text delimiters, or merge them directly with no separator.' }
    ],
    relatedTools: ['split-txt', 'docx-to-txt', 'txt-to-pdf']
  },
  {
    slug: 'split-txt',
    name: 'Split Text & TXT',
    title: 'Split Text & TXT Files Online - 100% Private | ConvertOcean',
    description: 'Split large text or log files (.txt, .log, .md, .csv) into smaller files by line count, size, or custom delimiter offline in your browser.',
    headline: 'Split Text & TXT.',
    subtitle: 'Partition large text files into separate downloadable segments client-side locally.',
    quickAnswer: 'To split a text file, select your .txt, .md, .csv, or .log above and choose how to divide it: every N lines, every N kilobytes, or at each occurrence of a delimiter you specify. Each part downloads as its own file. It is the practical way to break a large log or export into pieces an editor or importer can actually handle. Processing is entirely local.',
    icon: '📝',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All file slicing is completed in browser memory.' },
      { question: 'Can I split by custom markers?', answer: 'Yes, you can split by lines count, maximum file size in KB, or custom text search boundary strings.' }
    ],
    relatedTools: ['merge-txt', 'docx-to-txt', 'pdf-to-txt']
  },
  {
    slug: 'merge-word',
    name: 'Merge Word',
    title: 'Merge Word Documents Online - 100% Private | ConvertOcean',
    description: 'Merge multiple Word documents (.docx) into a single document client-side. Complete browser-level privacy and offline support. No server uploads.',
    headline: 'Merge Word',
    subtitle: 'Stitch multiple DOCX documents together client-side in your browser memory.',
    quickAnswer: 'To merge Word documents, add two or more .docx files above and download a single combined document. Inline images from every source file are carried across and re-linked correctly, which is where most browser-based mergers fail. One honest limit: style and numbering definitions are not merged across documents, so heading appearance follows the first file. The merge runs entirely in your browser.',
    icon: '🥞',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, merging, and document compiling occur entirely in your local browser sandbox memory.' },
      { question: 'Does it work offline?', answer: 'Yes. Once loaded, the DOCX merger runs 100% offline without requiring any internet connection.' },
      { question: 'Will formatting be preserved?', answer: 'Yes, paragraph styles and properties from the individual files are preserved and concatenated into the output document.' }
    ],
    relatedTools: ['split-word', 'word-to-pdf', 'pdf-to-word', 'docx-to-txt']
  },
  {
    slug: 'split-word',
    name: 'Split Word',
    title: 'Split Word Documents Online - 100% Private | ConvertOcean',
    description: 'Split Word documents (.docx) by heading structures or paragraph count client-side. Safe offline document partitioning with zero uploads.',
    headline: 'Split Word',
    subtitle: 'Partition DOCX documents into separate downloadable files locally in browser memory.',
    quickAnswer: 'To split a Word document, select your .docx above and choose where to break it: at every Heading 1, or after a set number of paragraphs. Heading-based splitting is the useful one for chapters, sections, and reports, because it follows the document\'s own structure rather than an arbitrary count. Each section downloads as its own .docx. The file is processed in your browser.',
    icon: '✂️',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All parsing, partitioning, and zip bundling happen entirely on your local machine.' },
      { question: 'Can I split by custom headings?', answer: 'Yes, you can choose to split the document at every major Heading 1 tag, or by a specified number of paragraphs.' }
    ],
    relatedTools: ['merge-word', 'word-to-pdf', 'pdf-to-word', 'docx-to-txt']
  },
  {
    slug: 'merge-pptx',
    name: 'Merge PowerPoint',
    title: 'Merge PowerPoint Presentations Online - 100% Private | ConvertOcean',
    description: 'Merge multiple PowerPoint presentations (.pptx) into a single file offline in your browser. 100% secure client-side tools with no uploads.',
    headline: 'Merge PowerPoint',
    subtitle: 'Combine slides from multiple PPTX files client-side into a single presentation locally.',
    quickAnswer: 'To merge PowerPoint presentations, add two or more .pptx files above and download one combined deck, with each source presentation\'s slides copied in order along with their layouts. Legacy .ppt files are not supported — open them in PowerPoint or LibreOffice and save as .pptx first. The merge is performed on your own device, so unreleased decks never leave your machine.',
    icon: '🥞',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. The presentations are parsed and slide configurations merged directly inside your browser sandbox.' },
      { question: 'Does it work offline?', answer: 'Yes. Once loaded, the PPTX merger runs 100% offline.' }
    ],
    relatedTools: ['split-pptx', 'pptx-to-pdf', 'ppt-to-pdf']
  },
  {
    slug: 'split-pptx',
    name: 'Split PowerPoint',
    title: 'Split PowerPoint Presentations Online - 100% Private | ConvertOcean',
    description: 'Split PowerPoint slides and extract selected ranges client-side in your browser. 100% private with no server uploads.',
    headline: 'Split PowerPoint',
    subtitle: 'Select specific slide ranges or split every slide into a separate presentation locally.',
    quickAnswer: 'To split a PowerPoint, add your .pptx above and choose either to break every slide into its own presentation, or to extract custom ranges such as 1-5, 8, 11-13. Each extracted slide keeps its layout and embedded media at original quality, because the tool copies from the original file rather than re-rendering anything. Legacy .ppt is not supported — save it as .pptx first. The split runs entirely in your browser.',
    icon: '✂️',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. The slide structures are parsed and split client-side in browser memory.' },
      { question: 'Can I split the file into single slides?', answer: 'Yes. The splitter can output every single slide as its own PPTX file and package them into a single ZIP download.' }
    ],
    relatedTools: ['merge-pptx', 'pptx-to-pdf', 'ppt-to-pdf']
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    title: 'Word Counter & Text Analyzer - Free, Private & Offline | ConvertOcean',
    description: 'Count words, characters, sentences, and paragraphs instantly. Get reading time, speaking time, and keyword density analysis — 100% client-side, no data sent to any server.',
    headline: 'Word Counter.',
    subtitle: 'Analyze your text in real time: word count, character count, reading time, speaking time, and keyword density — all processed locally in your browser.',
    quickAnswer: 'To count words, paste or type your text above and see a live word count, character count (with and without spaces), reading time, speaking time, and keyword density as you write. It is handy for essays, meta descriptions, and social posts with length limits. All analysis happens in your browser — your text is never sent anywhere.',
    icon: '📝',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    faqs: [
      { question: 'Is my text stored or sent anywhere?', answer: 'No. All text analysis happens entirely inside your browser using client-side JavaScript. Your text never leaves your device — it is never uploaded, never stored, and never sent to our analytics or anyone else.' },
      { question: 'How is reading time calculated?', answer: 'Reading time is estimated at an average adult reading speed of 200 words per minute. Speaking time is estimated at 130 words per minute, which is the average conversational speech rate.' },
      { question: 'What are the social media character limit presets?', answer: 'We include presets for Twitter/X (280 characters), Meta Description (160 characters), Instagram captions (2,200 characters), and LinkedIn posts (3,000 characters). Select any to see a real-time fill bar as you type.' },
      { question: 'How does keyword density work?', answer: 'The tool counts all significant words (excluding common stop words like "the", "and", "is") and shows the top 10 most frequent keywords with their occurrence count and a visual frequency bar. This helps identify keyword repetition for SEO.' },
      { question: 'Does it work offline?', answer: 'Yes. Once the page is loaded, the word counter works completely offline. All computation is done in your browser tab — no internet connection is needed.' }
    ],
    relatedTools: ['json-formatter', 'csv-to-json', 'json-to-csv', 'xml-to-json']
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    title: 'JSON Formatter & Validator Online - Free & Private | ConvertOcean',
    description: 'Format, validate, and minify JSON instantly in your browser. Syntax highlighting, real-time error detection with line numbers, key count, nesting depth — 100% client-side with no uploads.',
    headline: 'JSON Formatter.',
    subtitle: 'Paste raw or minified JSON to instantly format it with syntax highlighting, validate it, detect errors with exact line numbers, and toggle minified output — all offline in your browser.',
    quickAnswer: 'To format JSON, paste raw or minified JSON above and it is instantly pretty-printed with indentation and syntax highlighting, or flagged with the exact line number of any syntax error. Toggle minify to compress it back to a single line for production. Everything runs in your browser, so API payloads and config never leave your machine.',
    icon: '⚙️',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    faqs: [
      { question: 'Is my JSON data sent to a server?', answer: 'No. JSON formatting and validation is performed entirely in your browser using client-side JavaScript. Your data never leaves your device — there are no server uploads, no logs, and no data storage.' },
      { question: 'How does the JSON validator work?', answer: 'The tool uses the native browser JSON.parse() function to validate your input in real time. If your JSON is malformed, it reports the exact error message along with the approximate line number and column position where the error occurs.' },
      { question: 'Can I minify JSON with this tool?', answer: 'Yes. Toggle the "Minify" switch in the output panel to convert the pretty-printed JSON into a single-line minified string. Toggle it back to return to indented formatting.' },
      { question: 'What metadata does the tool show?', answer: 'The output panel shows three metrics: total key count (including nested keys), maximum nesting depth, and the size of the formatted JSON in bytes or kilobytes.' },
      { question: 'Does it work offline?', answer: 'Yes. Once the tool page is loaded in your browser, the JSON formatter works completely offline. No network connection is required for formatting, validation, or download.' }
    ],
    relatedTools: ['word-counter', 'csv-to-json', 'json-to-csv', 'xml-to-json', 'xlsx-to-json']
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    title: 'Convert Image to PDF Online - 100% Private | ConvertOcean',
    description: 'Convert JPG, PNG, and WebP images to PDF documents directly in your browser. No server uploads. 100% private, secure, and offline capable.',
    headline: 'Image to PDF.',
    subtitle: 'Convert images to a cleanly formatted PDF document client-side.',
    quickAnswer: 'To turn images into a PDF, add your JPG, PNG, or WebP files above, arrange them in the order you want, and download a single PDF with one image per page. It is ideal for submitting scanned pages, photo sets, or receipts as one file. Every image is embedded locally, so nothing is uploaded.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['pdf-to-txt', 'txt-to-pdf', 'merge-pdf', 'split-pdf', 'image-resizer']
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    title: 'Image Resizer - Exact Pixels or KB Size | ConvertOcean',
    description: 'Resize images to exact pixel dimensions or compress photos to a target size in KB (20 KB, 50 KB) for exam forms and upload limits. 100% private, in-browser.',
    headline: 'Image Resizer.',
    subtitle: 'Resize images to exact pixel dimensions or compress them to a target file size in KB — built for exam forms, job portals, and upload limits.',
    quickAnswer: 'To resize an image for a form upload, either set exact pixel dimensions (for example 200×230 for a photo or 140×60 for a signature) or set a target file size like 20 KB — the resizer re-encodes the image locally in your browser and shows the final size before you download. Nothing is uploaded.',
    icon: '📐',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'How do I resize an image to 20 KB?', answer: 'Switch to "Compress to File Size" mode, enter 20 (or tap the 20 KB preset), and click Resize Image. The tool searches for the highest JPEG quality that fits under 20 KB — reducing dimensions automatically if needed — and shows the exact final size before you download.' },
      { question: 'How do I resize a photo for an exam application form?', answer: 'Most exam portals want a photo around 200×230 pixels under 20–50 KB and a signature around 140×60 pixels under 10–20 KB. Use the matching preset (or enter the exact numbers from your form), pick JPG output, and if a size cap also applies, run the result through the file-size mode.' },
      { question: 'Does resizing reduce image quality?', answer: 'Downscaling dimensions keeps photos looking sharp because pixels are averaged with high-quality smoothing. Compressing to a very small file size (like 10 KB) does visibly soften detail — that is the trade-off the form limit forces, and every tool faces the same physics.' },
      { question: 'Should I choose JPG or PNG for the resized image?', answer: 'JPG for photographs and anything going into a form — it compresses several times smaller than PNG. Choose PNG only for graphics, screenshots with sharp text, or images that need a transparent background. PNG cannot be compressed to a target KB size, so file-size mode uses JPEG encoding.' },
      { question: 'Why did the tool change my dimensions in file-size mode?', answer: 'If even the lowest JPEG quality cannot fit your image under the target at its current dimensions, the resizer steps the width and height down proportionally until the target is reachable. The result summary always shows the final dimensions and size before you download.' },
      { question: 'Why is my result much smaller than the target I entered?', answer: 'The target is an upper limit, not a size to reach. If your image already fits under the limit at maximum quality — common for small or smooth photos — the tool gives you that best-quality version and tells you so. A 22 KB result for a 79 KB limit means full quality with room to spare; upload forms only check that you are under the cap.' },
      { question: 'Is my photo uploaded to a server?', answer: 'No. The image is read, resized, and re-encoded entirely inside your browser using the HTML5 canvas. Personal photos, ID pictures, and signatures never leave your device — and the tool keeps working offline once the page has loaded.' },
      { question: 'What happens to transparent backgrounds when resizing to JPG?', answer: 'JPG has no transparency, so transparent regions are flattened onto a white background automatically — which is what application forms expect. To keep transparency, choose PNG or WebP as the output format instead.' }
    ],
    relatedTools: ['jpg-to-jpeg', 'png-to-jpg', 'image-to-pdf', 'merge-images'],
    content: imageResizerContent
  },
  {
    slug: 'jpg-to-jpeg',
    name: 'JPG to JPEG',
    title: 'Convert JPG to JPEG - Free & Private | ConvertOcean',
    description: 'Convert JPG to JPEG in your browser — same image format, different extension. Get a clean .jpeg file for upload forms that demand it. No uploads, 100% private.',
    headline: 'JPG to JPEG.',
    subtitle: 'Re-encode a .jpg file to a clean, standards-compliant .jpeg — for upload forms and software that insist on the .jpeg extension.',
    quickAnswer: 'JPG and JPEG are the same image format — only the file extension differs. To convert JPG to JPEG, select your .jpg above and download the re-encoded .jpeg file. This satisfies upload forms that strictly whitelist the .jpeg extension, and the re-encoding also strips camera EXIF metadata for privacy.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Is there any difference between JPG and JPEG?', answer: 'No. Both extensions denote the identical JPEG image standard. The .jpg spelling exists because old DOS/Windows systems allowed only three-letter extensions. Quality, compression, and compatibility are exactly the same.' },
      { question: 'Why does an upload form reject my .jpg but ask for .jpeg?', answer: 'Strict upload validators whitelist literal extension strings. If the developer configured "accept .jpeg only", a valid photo named photo.jpg is rejected purely because of its filename. Re-saving it with the .jpeg extension satisfies the check.' },
      { question: 'Can I just rename the file from .jpg to .jpeg?', answer: 'Usually yes — the format is identical, so a rename is technically valid. This tool additionally re-encodes the image, which passes validators that inspect file contents and strips camera metadata (location, device info) as a privacy bonus.' },
      { question: 'Does converting JPG to JPEG lose quality?', answer: 'The re-encode runs at 92% quality, which is visually indistinguishable for photos. If you only need the extension changed with zero re-encoding, renaming the file achieves that — but then metadata is kept and structural quirks are not repaired.' },
      { question: 'Is my photo uploaded anywhere?', answer: 'No. The file is decoded and re-encoded on an HTML5 canvas inside your browser tab. Nothing is transmitted, logged, or stored — and the tool works offline once loaded.' }
    ],
    relatedTools: ['jpeg-to-jpg', 'image-resizer', 'png-to-jpg', 'jpg-to-png'],
    content: jpgToJpegContent
  },
  {
    slug: 'jpeg-to-jpg',
    name: 'JPEG to JPG',
    title: 'Convert JPEG to JPG - Free & Private | ConvertOcean',
    description: 'Convert JPEG to JPG instantly in your browser. Re-encode and rename to the .jpg extension for picky software and upload forms. 100% private, no uploads.',
    headline: 'JPEG to JPG.',
    subtitle: 'Re-encode a .jpeg file to a clean .jpg — for upload whitelists, older software, and asset pipelines standardized on the three-letter extension.',
    quickAnswer: 'JPEG and JPG are one and the same format — .jpg is just the old three-letter DOS spelling of .jpeg. To convert JPEG to JPG, select your .jpeg above and download the re-encoded .jpg file, ready for upload forms and older software that only accept the .jpg extension.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Why do both .jpeg and .jpg exist for the same format?', answer: 'Early MS-DOS and Windows limited extensions to three characters, so .jpeg was truncated to .jpg on PCs while Mac and Unix kept the full spelling. The limit is long gone, but both spellings survived — .jpg is now the more common one.' },
      { question: 'Will converting JPEG to JPG change my image quality or size?', answer: 'Visually no — the re-encode runs at 92% quality, indistinguishable for photographs. File size may shift slightly because the image is re-compressed and camera metadata is removed in the process.' },
      { question: 'When do I actually need a .jpg extension instead of .jpeg?', answer: 'Three common cases: upload forms that whitelist only ".jpg", older Windows software hard-coded for three-letter extensions, and asset pipelines or scripts using *.jpg patterns that silently miss .jpeg files.' },
      { question: 'Does this tool remove metadata from my photo?', answer: 'Yes, as a side effect of re-encoding through the browser canvas: EXIF data such as GPS location and camera model is stripped. For images headed to public uploads, that is usually a privacy improvement.' },
      { question: 'Is the conversion done on my device?', answer: 'Yes — decoding and re-encoding happen entirely in your browser sandbox memory. No image data leaves your machine, no account is needed, and the tool functions offline after the page loads.' }
    ],
    relatedTools: ['jpg-to-jpeg', 'image-resizer', 'webp-to-jpg', 'png-to-jpg'],
    content: jpegToJpgContent
  }
];

export const tools: ToolData[] = rawTools.map(t => {
  const seo = seoContentMap[t.slug];
  return {
    ...t,
    title: seo ? seo.title : t.title,
    description: seo ? seo.description : t.description,
    // Fall back to the tool's own FAQs when the SEO entry supplies none. A bare
    // `seo ? seo.faqs : t.faqs` lets an entry that defines content but no FAQs
    // silently strip the page's FAQPage schema, which is invisible in the build.
    faqs: seo && seo.faqs && seo.faqs.length ? seo.faqs : t.faqs,
    content: t.content || (seo ? seo.content : undefined)
  };
});

