export interface ToolData {
  slug: string;
  name: string;
  title: string;
  description: string;
  headline: string;
  subtitle: string;
  icon: string;
  category: string;
  categorySlug: string;
  faqs: { question: string; answer: string }[];
  relatedTools: string[];
}

export const tools: ToolData[] = [
  {
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    title: 'Convert Excel to PDF Online - 100% Private | ConvertOcean',
    description: 'Convert XLS, XLSX, and CSV spreadsheets to PDF directly in your browser. No server uploads. 100% private, secure, and offline capable.',
    headline: 'Excel to PDF.',
    subtitle: 'Convert Excel spreadsheets (.xlsx, .xls, .csv) to print-ready PDF files locally on your device.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' },
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
    subtitle: 'Upload any comma-separated (.csv) spreadsheet file and download its structured JSON equivalent client-side.',
    icon: '⚙️',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
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
    icon: '⚙️',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
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
    subtitle: 'Upload Excel workbook spreadsheets (.xlsx, .xls) and download them parsed as clean CSV files client-side.',
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
    subtitle: 'Upload structured JSON data arrays and compile them into formatted Microsoft Excel worksheets (.xlsx).',
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
    icon: '⚙️',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
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
    subtitle: 'Upload any PNG image file and compile it into a smaller, compressed JPG format client-side.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['jpg-to-png', 'png-to-webp', 'webp-to-png', 'image-to-text']
  },
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG',
    title: 'Convert JPG to PNG Online - 100% Private | ConvertOcean',
    description: 'Convert JPG / JPEG photos to PNG format locally in your browser. 100% secure offline file tools.',
    headline: 'JPG to PNG.',
    subtitle: 'Upload a JPG image file (.jpg, .jpeg) and convert it to lossless PNG layout client-side.',
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['png-to-jpg', 'png-to-webp', 'webp-to-png', 'image-to-text']
  },
  {
    slug: 'png-to-webp',
    name: 'PNG to WebP',
    title: 'Convert PNG to WebP Online - 100% Private | ConvertOcean',
    description: 'Convert PNG images to modern, highly compressed WebP format client-side. Fast, private, and offline capable.',
    headline: 'PNG to WebP.',
    subtitle: 'Convert PNG images into next-generation WebP formats client-side to improve web loading speeds.',
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
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools. The conversion models are loaded directly into browser cache memory.' }
    ],
    relatedTools: ['png-to-jpg', 'jpg-to-png', 'png-to-webp', 'image-to-text']
  },
  {
    slug: 'txt-to-pdf',
    name: 'TXT to PDF',
    title: 'Convert TXT to PDF Online - 100% Private | ConvertOcean',
    description: 'Convert raw text files into formatted PDF documents client-side. Complete browser-level privacy and offline functionality.',
    headline: 'TXT to PDF.',
    subtitle: 'Convert raw text documents (.txt) into cleanly formatted PDF files client-side. Custom layout compiling.',
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
    subtitle: 'Upload local images, screenshots, or receipts and extract edit-ready plain text client-side.',
    icon: '🔍',
    category: 'OCR Tools',
    categorySlug: 'ocr-tools',
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
    icon: '🧾',
    category: 'Business Tools',
    categorySlug: 'business-tools',
    faqs: [
      { question: 'Can I create invoices for free?', answer: 'Yes. The Freelance Invoice Generator is 100% free with no limits on the number of invoices you can create, download, or edit.' },
      { question: 'Can I export PDF?', answer: 'Yes. Clicking "Download Invoice PDF" formats the document to standard A4 printing sizes and triggers an instant download of a standard PDF document.' },
      { question: 'Is invoice data uploaded?', answer: 'No. None of your vendor, client, or financial figures are uploaded to our servers. Everything is processed directly inside your browser sandbox and disappears when you exit the page.' }
    ],
    relatedTools: ['excel-to-pdf', 'csv-to-json', 'json-to-csv', 'xlsx-to-csv']
  },
  {
    slug: 'xls-to-pdf',
    name: 'XLS to PDF',
    title: 'Convert XLS to PDF Online - 100% Private | ConvertOcean',
    description: 'Convert legacy Excel XLS files to high-fidelity PDF documents in your browser. 100% private, offline, and free.',
    headline: 'XLS to PDF.',
    subtitle: 'Convert XLS Excel sheets directly to clean PDF sheets client-side.',
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
    subtitle: 'Upload modern Excel workbooks (.xlsx) and compile them into clean JSON text client-side.',
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
    icon: '🖼️',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. You can completely disconnect from the internet and run these tools.' }
    ],
    relatedTools: ['webp-to-png', 'jpg-to-webp', 'png-to-jpg']
  },
  {
    slug: 'svg-to-png',
    name: 'SVG to PNG',
    title: 'Convert SVG to PNG Online - 100% Private | ConvertOcean',
    description: 'Convert vector SVG files to transparent PNG images in your browser. 100% private and free.',
    headline: 'SVG to PNG.',
    subtitle: 'Rasterize vector SVG files into transparent PNG format client-side.',
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
    subtitle: 'Convert Word documents (.docx) to PDF locally on your device.',
    icon: '📝',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. The converter loads mammoth.js locally into the browser memory sandbox.' }
    ],
    relatedTools: ['pdf-to-word', 'docx-to-txt', 'txt-to-pdf']
  },
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    title: 'Convert PDF to Word Online - 100% Private | ConvertOcean',
    description: 'Convert PDF documents to editable Microsoft Word files (.doc) offline in your browser. Zero server uploads.',
    headline: 'PDF to Word.',
    subtitle: 'Extract PDF text and compile it into an editable Word document format client-side.',
    icon: '📄',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. Once loaded, the extraction and compiling run 100% offline.' }
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
    description: 'Convert PowerPoint slide presentations (.pptx) to PDF sheets offline in your browser. 100% secure client-side converter.',
    headline: 'PowerPoint to PDF.',
    subtitle: 'Extract slides outline text and compile it to printable PDF files locally.',
    icon: '📊',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. The PowerPoint zip structure is parsed directly inside the browser memory.' }
    ],
    relatedTools: ['word-to-pdf', 'txt-to-pdf', 'excel-to-pdf']
  },
  {
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    title: 'Convert PDF to Excel Online - 100% Private | ConvertOcean',
    description: 'Convert PDF files to formatted Excel worksheets (.xlsx) offline in your browser. 100% device-level security with no server uploads.',
    headline: 'PDF to Excel.',
    subtitle: 'Extract tables and aligned cell grids from PDF files and download them as Excel workbooks locally.',
    icon: '📊',
    category: 'Excel Converter',
    categorySlug: 'excel-converter',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Does it work offline?', answer: 'Yes. Once loaded, the extraction and Excel compiler run 100% offline.' }
    ],
    relatedTools: ['excel-to-pdf', 'csv-to-xlsx', 'json-to-xlsx']
  }
];

