import {
  invoiceGeneratorContent,
  receiptGeneratorContent,
  profitMarginCalculatorContent,
  percentageCalculatorContent,
  salesTaxCalculatorContent
} from './business-content';

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
  content?: string;
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
    title: 'Profit Margin Calculator - Calculate Markup & Profitability | ConvertOcean',
    description: 'Calculate profit margin, markup percentage, and profitability instantly. Free online profit margin calculator with gross margin, net margin, and markup formulas. 100% private.',
    headline: 'Profit Margin Calculator.',
    subtitle: 'Calculate profit margin, markup percentage, gross profit, and net profitability from cost and revenue figures instantly.',
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
    relatedTools: ['percentage-calculator', 'sales-tax-calculator', 'invoice-generator', 'receipt-generator'],
    content: profitMarginCalculatorContent
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    title: 'Percentage Calculator - Calculate Percentage Increase & Decrease | ConvertOcean',
    description: 'Calculate percentages, percentage increase, percentage decrease, and percentage differences online. Free percentage calculator with step-by-step formulas. 100% private.',
    headline: 'Percentage Calculator.',
    subtitle: 'Calculate percentages, percentage change, increase, decrease, and differences with step-by-step formula breakdowns.',
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
    relatedTools: ['profit-margin-calculator', 'sales-tax-calculator', 'invoice-generator', 'receipt-generator'],
    content: percentageCalculatorContent
  },
  {
    slug: 'sales-tax-calculator',
    name: 'Sales Tax Calculator',
    title: 'Sales Tax Calculator - Calculate Tax Amount & Total Price | ConvertOcean',
    description: 'Calculate sales tax, total price including tax, and tax amounts instantly. Free online sales tax calculator with US, UK, Canada, and Australia tax rate presets. 100% private.',
    headline: 'Sales Tax Calculator.',
    subtitle: 'Calculate sales tax amounts, total price including tax, and reverse tax from gross prices. Supports US, UK, Canada, Australia, and custom tax rates.',
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
    relatedTools: ['profit-margin-calculator', 'percentage-calculator', 'invoice-generator', 'receipt-generator'],
    content: salesTaxCalculatorContent
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
    relatedTools: ['ppt-to-pdf', 'word-to-pdf', 'txt-to-pdf']
  },
  {
    slug: 'ppt-to-pdf',
    name: 'PPT to PDF',
    title: 'Convert PPT to PDF Online - 100% Private | ConvertOcean',
    description: 'Convert legacy and modern PowerPoint presentations (.ppt, .pptx) to PDF sheets offline in your browser. 100% secure client-side converter.',
    headline: 'PPT to PDF.',
    subtitle: 'Convert PowerPoint presentations (.ppt, .pptx) to printable PDF documents locally.',
    icon: '📊',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All data parsing, calculations, and rendering occur entirely in your local browser sandbox memory, and files are automatically removed when you close the tab.' },
      { question: 'Can I convert legacy .ppt files?', answer: 'Legacy .ppt files are a closed binary format. For 100% client-side privacy, you can save your presentation as .pptx in PowerPoint and upload the .pptx file, or use our interface which guides you through local conversion.' }
    ],
    relatedTools: ['pptx-to-pdf', 'word-to-pdf', 'txt-to-pdf']
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
  },
  {
    slug: 'merge-excel',
    name: 'Merge Excel & CSV',
    title: 'Merge Excel & CSV Online - 100% Private | ConvertOcean',
    description: 'Merge multiple Excel workbooks (.xlsx, .xls) and CSV sheets into a single spreadsheet document offline in your browser. 100% secure.',
    headline: 'Merge Excel & CSV.',
    subtitle: 'Stitch sheets and combine data rows from multiple Excel or CSV files client-side locally.',
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
    icon: '📝',
    category: 'Document Tools',
    categorySlug: 'document-tools',
    faqs: [
      { question: 'Do files get uploaded to a server?', answer: 'No uploads are performed. All file slicing is completed in browser memory.' },
      { question: 'Can I split by custom markers?', answer: 'Yes, you can split by lines count, maximum file size in KB, or custom text search boundary strings.' }
    ],
    relatedTools: ['merge-txt', 'docx-to-txt', 'pdf-to-txt']
  }
];

