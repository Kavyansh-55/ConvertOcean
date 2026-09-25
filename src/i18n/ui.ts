/**
 * Interface strings — the chrome around the content.
 *
 * Page copy lives in src/data/pt/. This file covers everything else: the nav,
 * the footer, the "how it works" band on every tool page, and the category
 * furniture. Until now all of it rendered in English on all 75 Portuguese
 * pages, which meant Portuguese copy wrapped in an English frame.
 *
 * THE ENGLISH STRING IS THE KEY. `t('Compress PDF', 'pt')` returns
 * 'Comprimir PDF'. That choice is deliberate:
 *
 *   - a missing translation degrades to readable English rather than to a
 *     raw key like `footer.tools.compressPdf` leaking onto the page;
 *   - the templates stay legible, because the English text is still visible
 *     in the markup instead of being replaced by an identifier;
 *   - nobody has to invent and remember a key naming scheme.
 *
 * The trade-off is that changing English copy silently drops its translation.
 * `scripts/tests/ui-strings.test.mjs` guards that: it fails when a template
 * asks for a string this file has never heard of.
 *
 * Tool NAMES here must match the `name` given to the same tool in
 * src/data/pt/index.ts. The footer hard-codes its list rather than reading the
 * data, so the two can drift; the test checks them against each other.
 */
import type { Locale } from './config';

const pt: Record<string, string> = {
  // ---- Navigation ------------------------------------------------------
  'Home': 'Início',
  'File Converter': 'Conversor de Arquivos',
  'PDF & Merge': 'PDF e Juntar',
  'Image Tools': 'Ferramentas de Imagem',
  'Spreadsheets': 'Planilhas',
  'More': 'Mais',
  'Developer Tools': 'Ferramentas para Desenvolvedores',
  'JSON formatter, word counter & more': 'Formatador de JSON, contador de palavras e mais',
  'Document Tools': 'Ferramentas de Documentos',
  'Word, PowerPoint, TXT utilities': 'Utilitários para Word, PowerPoint e TXT',
  'Business Tools': 'Ferramentas Empresariais',
  'Invoices, receipts & calculators': 'Faturas, recibos e calculadoras',
  'All Tools Sitemap': 'Mapa de todas as ferramentas',
  'Skip to main content': 'Ir para o conteúdo principal',
  'Toggle dark mode': 'Alternar modo escuro',
  'Open navigation menu': 'Abrir menu de navegação',

  // ---- Tool page furniture --------------------------------------------
  'Quick Answer': 'Resposta rápida',
  'How It Works': 'Como funciona',
  'Four simple steps to process your files securely client-side:':
    'Quatro passos simples para processar seus arquivos com segurança, no seu próprio dispositivo:',
  'Choose File': 'Escolha o arquivo',
  'Drag and drop or browse files directly from your storage. Files reside only in temporary browser memory.':
    'Arraste e solte, ou escolha o arquivo no seu dispositivo. Ele fica apenas na memória temporária do navegador.',
  'Select Output': 'Escolha a saída',
  'Pick your target conversion configuration or adjust quality/compression sliders according to your needs.':
    'Defina o formato de destino ou ajuste a qualidade e a compressão conforme a sua necessidade.',
  'Convert Locally': 'Converta localmente',
  'Download Instantly': 'Baixe na hora',
  'Instantly download your output file. Memory cache is purged automatically when you close the tab.':
    'Baixe o arquivo final na hora. A memória do navegador é limpa automaticamente quando você fecha a aba.',
  'All compilers and processors compile files locally in browser sandbox memory. No servers are used.':
    'Todo o processamento acontece na memória do navegador, no seu dispositivo. Nenhum servidor é usado.',
  'Traditional sites upload files to external servers. ConvertOcean processes your data 100% locally.':
    'Sites tradicionais copiam os arquivos para servidores externos. O ConvertOcean processa os seus dados 100% localmente.',
  'Why Choose ConvertOcean?': 'Por que usar o ConvertOcean?',
  'Files Stay On Your Device': 'Os arquivos ficam no seu dispositivo',
  'Browser-Powered Processing': 'Processamento no navegador',
  'Free & No Accounts': 'Gratuito e sem cadastro',
  'Related File Utilities': 'Ferramentas relacionadas',
  'Related Guides & Resources.': 'Guias e materiais relacionados.',
  'Guide': 'Guia',
  'Frequently Asked Questions': 'Perguntas frequentes',

  // ---- Category page ---------------------------------------------------
  'No tools are currently active in this category.':
    'Nenhuma ferramenta está ativa nesta categoria no momento.',
  'Back to Homepage': 'Voltar para a página inicial',

  // ---- Footer ----------------------------------------------------------
  'Privacy-first browser-based file utilities. Convert, merge, split and extract file data 100% locally in your browser sandbox.':
    'Ferramentas de arquivo que rodam no navegador, com a privacidade em primeiro lugar. Converta, junte, divida e extraia dados 100% localmente, no seu próprio dispositivo.',
  'Compare': 'Comparações',
  'Resources & Company': 'Recursos e empresa',
  'Guides & Resources': 'Guias e materiais',
  'About Us': 'Sobre nós',
  'Contact Us': 'Fale conosco',
  'Privacy Policy': 'Política de privacidade',
  'Terms & Conditions': 'Termos e condições',
  'Sitemap': 'Mapa do site',
  '100% Local Sandboxed Processing:': 'Processamento 100% local:',
  'Disconnect your device from the internet and test any tool. It operates entirely on-device.':
    'Desconecte o aparelho da internet e teste qualquer ferramenta. Tudo funciona no próprio dispositivo.',
  '2026 ConvertOcean. All rights reserved.': '2026 ConvertOcean. Todos os direitos reservados.',

  // ---- Footer: tool names ----------------------------------------------
  // These must match the `name` of the same tool in src/data/pt/index.ts.
  'Excel to PDF': 'Excel para PDF',
  'Word to PDF': 'Word para PDF',
  'PDF to Word': 'PDF para Word',
  'TXT to PDF': 'TXT para PDF',
  'PDF to TXT': 'PDF para TXT',
  'CSV to JSON': 'CSV para JSON',
  'JSON to CSV': 'JSON para CSV',
  'XLSX to CSV': 'XLSX para CSV',
  'CSV to XLSX': 'CSV para XLSX',
  'JSON to XLSX': 'JSON para XLSX',
  'XML to JSON': 'XML para JSON',
  'PDF, Split & Merge': 'PDF, dividir e juntar',
  'Compress PDF': 'Comprimir PDF',
  'Compress PowerPoint': 'Comprimir PowerPoint',
  'Compress Word': 'Comprimir Word',
  'Compress Excel': 'Comprimir Excel',
  'Merge PDF': 'Juntar PDF',
  'Split PDF': 'Dividir PDF',
  'Merge Word': 'Juntar Documentos Word',
  'Split Word': 'Dividir Arquivo Word',
  'Merge PowerPoint': 'Juntar PowerPoint',
  'Split PowerPoint': 'Dividir PowerPoint',
  'Merge Excel & CSV': 'Unir Arquivos Excel',
  'Split Excel & CSV': 'Dividir Arquivo Excel',
  'Merge Images': 'Juntar Fotos',
  'Split Image': 'Dividir Imagem',
  'Merge Text & TXT': 'Unir Arquivos TXT',
  'Split Text & TXT': 'Dividir Arquivo TXT',
  'Image & OCR': 'Imagem e OCR',
  'Image Resizer': 'Redimensionar Imagem',
  'PNG to JPG': 'PNG para JPG',
  'JPG to PNG': 'JPG para PNG',
  'PNG to WebP': 'PNG para WebP',
  'WebP to PNG': 'WebP para PNG',
  'EXIF Viewer': 'Ver Dados EXIF',
  'Remove EXIF Data': 'Remover EXIF',
  'HEIC to JPG': 'HEIC para JPG',
  'HEIC to PNG': 'HEIC para PNG',
  'AVIF to JPG': 'AVIF para JPG',
  'AVIF to PNG': 'AVIF para PNG',
  'Image to Text OCR': 'Imagem para Texto',
  'Image to PDF': 'Imagem para PDF',
  'Invoice Generator': 'Modelo de Fatura',
  'Receipt Generator': 'Modelo de Recibo',
  'Profit Margin Calculator': 'Calculadora de Margem de Lucro',
  'Break-Even Calculator': 'Ponto de Equilíbrio',
  'Percentage Calculator': 'Calculadora de Porcentagem',
  'Sales Tax Calculator': 'Calculadora de Imposto',
  'OFX to CSV': 'OFX para CSV',
  'QFX to CSV': 'QFX para CSV',
  'QBO to CSV': 'QBO para CSV',
  'Word Counter': 'Contador de Palavras',
  'JSON Formatter': 'Formatar JSON',

  // ---- Converter UI ----------------------------------------------------
  // The controls inside the tools themselves. Scoped to the 30 converter
  // components, which are what the high-volume Portuguese pages render. The
  // business-tool forms (invoice fields, currency lists, tax presets) are
  // deliberately not here — see the note at the foot of this file.
  'Choose file': 'Escolher arquivo',
  'Choose File': 'Escolher arquivo',
  'Clear': 'Limpar',
  'Clear All': 'Limpar tudo',
  'Clear all': 'Limpar tudo',
  'Clear File': 'Limpar arquivo',
  'Clear Queue': 'Limpar fila',
  'Clear selection': 'Limpar seleção',
  'Copy': 'Copiar',
  'Paste': 'Colar',
  'Download': 'Baixar',
  'Download TXT': 'Baixar TXT',
  'Download CSV': 'Baixar CSV',
  'Download XLSX': 'Baixar XLSX',
  'Download DOCX': 'Baixar DOCX',
  'Download PDF': 'Baixar PDF',
  'Download JSON': 'Baixar JSON',
  'Download JPG': 'Baixar JPG',
  'Download PNG': 'Baixar PNG',
  'Download WEBP': 'Baixar WEBP',
  'Download as': 'Baixar como',
  'Download cleaned photo': 'Baixar foto limpa',
  'Start over': 'Começar de novo',
  'Convert Another': 'Converter outro',
  'Processing file…': 'Processando arquivo…',
  'Processing files…': 'Processando arquivos…',
  'Processing image…': 'Processando imagem…',
  'Processing…': 'Processando…',
  'Merging files…': 'Juntando arquivos…',
  'Reading the document…': 'Lendo o documento…',
  'Reading photo…': 'Lendo a foto…',
  'Result': 'Resultado',
  'Results': 'Resultados',
  'Action': 'Ação',
  'Size': 'Tamanho',
  'Image': 'Imagem',
  'Why': 'Por quê',
  'Format': 'Formato',
  'Original': 'Original',
  'Compressed': 'Comprimido',
  'Stored': 'Armazenada',
  'Shown at': 'Exibida em',
  'Drawn at': 'Desenhada em',
  'Select all': 'Selecionar tudo',
  'No': 'Não',

  // Drop zones
  'Drag and drop file here, or click to browse': 'Arraste o arquivo aqui, ou clique para escolher',
  'Drag and drop files here, or click to browse': 'Arraste os arquivos aqui, ou clique para escolher',
  'Drag and drop a PDF here, or click to browse': 'Arraste um PDF aqui, ou clique para escolher',
  'Drag and drop a photo here, or click to browse': 'Arraste uma foto aqui, ou clique para escolher',
  'Drag and drop an image here, or click to browse': 'Arraste uma imagem aqui, ou clique para escolher',
  'Drag and drop image here, or click to browse': 'Arraste a imagem aqui, ou clique para escolher',
  'Drag and drop images here, or click to browse': 'Arraste as imagens aqui, ou clique para escolher',
  'Drag and drop images, or click to browse': 'Arraste as imagens, ou clique para escolher',
  'Drag and drop text file here, or click to browse': 'Arraste o arquivo de texto aqui, ou clique para escolher',
  'Drag and drop text files here, or click to browse': 'Arraste os arquivos de texto aqui, ou clique para escolher',
  'Drag and drop Word file here, or click to browse': 'Arraste o arquivo Word aqui, ou clique para escolher',
  'Drag and drop Word files here, or click to browse': 'Arraste os arquivos Word aqui, ou clique para escolher',
  'Drag and drop PowerPoint here, or click to browse': 'Arraste o PowerPoint aqui, ou clique para escolher',
  'Drag and drop PowerPoint presentations here, or click to browse': 'Arraste as apresentações aqui, ou clique para escolher',
  'Drag and drop a spreadsheet file here, or click to browse': 'Arraste a planilha aqui, ou clique para escolher',
  'Drag and drop spreadsheet files here, or click to browse': 'Arraste as planilhas aqui, ou clique para escolher',
  'Drag and drop your statement here, or click to browse': 'Arraste o extrato aqui, ou clique para escolher',
  'Choose an image to begin.': 'Escolha uma imagem para começar.',
  'Drag a spreadsheet or text document above to inspect and convert.': 'Arraste uma planilha ou um documento de texto acima para inspecionar e converter.',

  // File-type hints
  'PDF (Max 25MB)': 'PDF (máx. 25 MB)',
  'A single PDF (Max 25MB)': 'Um único PDF (máx. 25 MB)',
  'PDF (Max 25MB each, multiple allowed)': 'PDF (máx. 25 MB cada, vários permitidos)',
  'Image file (Max 15MB)': 'Arquivo de imagem (máx. 15 MB)',
  'Scan or image (Max 15MB)': 'Digitalização ou imagem (máx. 15 MB)',
  'JPG, PNG or WebP (Max 25MB)': 'JPG, PNG ou WebP (máx. 25 MB)',
  'JPG, JPEG, PNG, or WebP (Max 15MB)': 'JPG, JPEG, PNG ou WebP (máx. 15 MB)',
  'JPG, PNG, or WebP (multiple allowed)': 'JPG, PNG ou WebP (vários permitidos)',
  'PNG, JPG, WebP (Max 20MB)': 'PNG, JPG, WebP (máx. 20 MB)',
  'PNG, JPG, WebP, SVG (Max 15MB each, multiple allowed)': 'PNG, JPG, WebP, SVG (máx. 15 MB cada, vários permitidos)',
  'HEIC / HEIF photo (Max 15MB)': 'Foto HEIC / HEIF (máx. 15 MB)',
  'XLS, XLSX, or CSV (Max 25MB)': 'XLS, XLSX ou CSV (máx. 25 MB)',
  'XLS, XLSX, or CSV (Max 25MB each, multiple allowed)': 'XLS, XLSX ou CSV (máx. 25 MB cada, vários permitidos)',
  'XLS, XLSX, or CSV workbook (Max 25MB)': 'Pasta XLS, XLSX ou CSV (máx. 25 MB)',
  'A single .docx Word file (Max 15MB)': 'Um único arquivo .docx (máx. 15 MB)',
  '.docx Word files (Max 15MB each, multiple allowed)': 'Arquivos .docx (máx. 15 MB cada, vários permitidos)',
  '.pptx PowerPoint file (Max 25MB)': 'Arquivo .pptx (máx. 25 MB)',
  'A single .pptx PowerPoint file (Max 25MB)': 'Um único arquivo .pptx (máx. 25 MB)',
  '.pptx presentations (Max 25MB each, multiple allowed)': 'Apresentações .pptx (máx. 25 MB cada, várias permitidas)',
  'TXT, MD, LOG, CSV, XML (Max 5MB each, multiple allowed)': 'TXT, MD, LOG, CSV, XML (máx. 5 MB cada, vários permitidos)',

  // Compression
  'How hard to compress': 'Nível de compressão',
  'Light': 'Leve',
  'Safe for printing': 'Seguro para impressão',
  'Recommended': 'Recomendado',
  'Best for screen and email': 'Melhor para tela e e-mail',
  'Strong': 'Forte',
  'Smallest, visibly softer': 'Menor arquivo, com perda visível',
  'Fit to this size': 'Caber neste tamanho',
  'Fit a size': 'Definir um tamanho',
  'Or fit a size': 'Ou definir um tamanho',
  'Meet an upload limit': 'Atender a um limite de envio',
  'Target size (KB)': 'Tamanho desejado (KB)',
  'Target File Size (KB)': 'Tamanho desejado do arquivo (KB)',
  'What changed in your file': 'O que mudou no seu arquivo',
  'Could not compress this file.': 'Não foi possível comprimir este arquivo.',
  'Trim the empty formatted cells': 'Remover as células vazias formatadas',
  'Check the result — compare the pages before and after': 'Confira o resultado — compare as páginas antes e depois',
  'Drag the slider to compare': 'Arraste o controle para comparar',
  'Page 1 of 1': 'Página 1 de 1',
  'Finds the gentlest setting that still comes in under your limit, and tells you plainly if the size is not reachable.':
    'Procura o ajuste mais suave que ainda fique abaixo do seu limite, e avisa com clareza se o tamanho não for alcançável.',
  'The tool finds the gentlest setting that still fits under your limit, and tells you if the size is not reachable.':
    'A ferramenta procura o ajuste mais suave que ainda caiba no seu limite, e avisa se o tamanho não for alcançável.',

  // Merge / split
  'Merge Configuration': 'Configuração da união',
  'Merge & Download': 'Juntar e baixar',
  'Output Filename': 'Nome do arquivo final',
  'Output Format': 'Formato de saída',
  'Split Method': 'Método de divisão',
  'Split Mode': 'Modo de divisão',
  'Split Mode:': 'Modo de divisão:',
  'Split Configuration': 'Configuração da divisão',
  'Split & Download': 'Dividir e baixar',
  'Split & Download ZIP': 'Dividir e baixar ZIP',
  'Generate & Download': 'Gerar e baixar',
  'Convert & Download PDF': 'Converter e baixar PDF',
  'Add & Arrange PDFs': 'Adicionar e ordenar PDFs',
  'Add & Arrange Images': 'Adicionar e ordenar imagens',
  'Add & Arrange Spreadsheets': 'Adicionar e ordenar planilhas',
  'Add & Arrange Texts': 'Adicionar e ordenar textos',
  'Add & Arrange Word Documents': 'Adicionar e ordenar documentos Word',
  'Add & Arrange PowerPoint Presentations': 'Adicionar e ordenar apresentações',
  'File Separator': 'Separador entre arquivos',
  'No Separator': 'Sem separador',
  'Custom Text Separator': 'Separador de texto personalizado',
  'Custom Separator Text': 'Texto do separador',
  'Prefix file content with filename?': 'Incluir o nome do arquivo antes do conteúdo?',
  'By Line Count (e.g. every 1000 lines)': 'Por número de linhas (ex.: a cada 1000 linhas)',
  'By File Size (e.g. every 500 KB)': 'Por tamanho do arquivo (ex.: a cada 500 KB)',
  'By Text Delimiter': 'Por delimitador de texto',
  'Delimiter text boundary': 'Texto que marca a divisão',
  'Grid (Rows & Columns)': 'Grade (linhas e colunas)',
  'Equal Horizontal Cuts': 'Fatias horizontais iguais',
  'Equal Vertical Cuts': 'Fatias verticais iguais',
  'Rows': 'Linhas',
  'Columns': 'Colunas',
  'Number of Parts': 'Número de partes',
  'What should come out': 'O que deve sair',
  'One PDF': 'Um único PDF',
  'containing the pages I pick': 'com as páginas que eu escolher',
  'A separate PDF for every page': 'Um PDF separado para cada página',
  'I pick, in a ZIP': 'que eu escolher, em um ZIP',
  'The whole PDF in': 'O PDF inteiro em',
  'equal parts': 'partes iguais',
  'The whole PDF in parts under': 'O PDF inteiro em partes abaixo de',
  'MB each': 'MB cada',
  'Pages to extract': 'Páginas a extrair',
  'Type page numbers or ranges — or click the pages below.': 'Digite números ou intervalos de páginas — ou clique nas páginas abaixo.',
  'Extract Selected Pages': 'Extrair páginas selecionadas',
  'Extract Selected Sheets': 'Extrair abas selecionadas',
  'Extract Worksheets (Split by Sheets)': 'Extrair abas (dividir por aba)',
  'Split Worksheet Rows (Partition by Row Count)': 'Dividir linhas da aba (por número de linhas)',
  'Worksheets to extract': 'Abas a extrair',
  'Select Worksheet to Split': 'Selecione a aba a dividir',
  'Rows per File': 'Linhas por arquivo',
  'First row is header (keep header in all split files)': 'A primeira linha é cabeçalho (repetir em todos os arquivos)',
  'First row is a header': 'A primeira linha é cabeçalho',
  'Export Format:': 'Formato de exportação:',
  'Each selected worksheet becomes its own file, delivered together in a ZIP. Click a card to include or exclude it.':
    'Cada aba selecionada vira um arquivo próprio, entregues juntos em um ZIP. Clique em um cartão para incluir ou excluir.',
  ', in a ZIP': ', em um ZIP',

  // Image tools
  'Resize Settings': 'Configurações de redimensionamento',
  'Resize by Dimensions': 'Redimensionar por medidas',
  'Compress to File Size': 'Comprimir para um tamanho de arquivo',
  'Resize Image': 'Redimensionar imagem',
  'Preview & Result': 'Prévia e resultado',
  'Common Form Presets': 'Tamanhos comuns de formulário',
  'Common Upload Limits': 'Limites de envio comuns',
  'Width (px)': 'Largura (px)',
  'Height (px)': 'Altura (px)',
  'Lock ratio': 'Manter proporção',
  'Quality:': 'Qualidade:',
  'PDF Page Layout': 'Layout da página do PDF',
  'Fit Image Dimensions': 'Ajustar às medidas da imagem',
  'A4 Portrait (with Margins)': 'A4 retrato (com margens)',
  'A4 Landscape (with Margins)': 'A4 paisagem (com margens)',
  'PDF (Separate Pages)': 'PDF (páginas separadas)',
  'Stitch Image (Vertically)': 'Imagem unida (na vertical)',
  'Stitch Image (Horizontally)': 'Imagem unida (na horizontal)',
  'Landscape orientation': 'Orientação paisagem',
  'Include all sheets': 'Incluir todas as abas',
  'Select & Preview': 'Selecionar e visualizar',

  // JSON / text
  'RAW JSON INPUT': 'JSON DE ENTRADA',
  'FORMATTED OUTPUT': 'SAÍDA FORMATADA',
  'Paste JSON to validate and format.': 'Cole um JSON para validar e formatar.',
  'Formatted JSON will appear here with syntax highlighting…': 'O JSON formatado aparecerá aqui, com destaque de sintaxe…',

  // ---- Business tools --------------------------------------------------
  // Labels only. Currency names ("US Dollar (USD)") and the sample addresses
  // are left in English on purpose: the codes are international, and the
  // samples are placeholder values the reader overwrites immediately.
  'Open Tool': 'Abrir ferramenta',
  'Calculate': 'Calcular',
  'Calculation Mode': 'Modo de cálculo',
  'Enter Values': 'Informe os valores',
  'Currency': 'Moeda',
  'Currency & Values': 'Moeda e valores',
  'Amount': 'Valor',
  'Amount Paid': 'Valor pago',
  'Description': 'Descrição',
  'Line Description': 'Descrição do item',
  'Notes': 'Observações',
  'Subtotal': 'Subtotal',
  'Grand Total': 'Total geral',
  'Unit Rate': 'Valor unitário',
  'Qty': 'Qtd.',
  'Rate ($)': 'Valor unitário',
  'Base Price': 'Preço base',
  'Cost': 'Custo',
  'Clear Form': 'Limpar formulário',
  'Formula Used': 'Fórmula utilizada',
  'Detailed Breakdown': 'Detalhamento',
  'Results': 'Resultados',
  'From': 'De',
  'Add': 'Adicionar',
  '+ Add Line Item': '+ Adicionar item',
  'Itemized Line Items': 'Itens discriminados',
  'Date:': 'Data:',
  'Due Date': 'Vencimento',
  'Due Date:': 'Vencimento:',
  'No:': 'Nº:',
  'Tax ID:': 'CNPJ/CPF:',
  'Country / Region': 'País / região',
  'Custom Rate': 'Alíquota personalizada',
  'Custom Tax Rate': 'Alíquota personalizada',
  'Tax Rate (%)': 'Alíquota (%)',
  'Tax Label': 'Nome do imposto',
  'Tax Configuration': 'Configuração do imposto',
  'No Tax': 'Sem imposto',
  'Add Sales Tax': 'Acrescentar imposto',
  'Calculate Tax': 'Calcular imposto',
  'Payment Receipt': 'Recibo de pagamento',
  'Payment Terms & Instructions': 'Condições e instruções de pagamento',
  'Terms & Bank Notes': 'Condições e dados bancários',
  'Terms & Notes': 'Condições e observações',
  'Thank you for your business.': 'Obrigado pela preferência.',
  'Thank you for your payment. This receipt confirms payment has been received in full.':
    'Obrigado pelo pagamento. Este recibo confirma que o valor foi recebido integralmente.',
  'Download Invoice PDF': 'Baixar fatura em PDF',
  'Download Receipt PDF': 'Baixar recibo em PDF',
  'Invoice Settings': 'Dados da fatura',
  'Invoice Number': 'Número da fatura',
  'Invoice Date': 'Data da fatura',
  'Tax Invoice': 'Fatura',
  'Vendor Billing Profile': 'Dados do emitente',
  'Billing Entity (From)': 'Emitente (de)',
  'Billed Client (To)': 'Cliente (para)',
  'Billing Entity Name': 'Nome do emitente',
  'Client Entity Name': 'Nome do cliente',
  'Customer Name': 'Nome do cliente',
  'Business Name': 'Nome da empresa',
  'From (Vendor / Company)': 'De (emitente / empresa)',
  'To (Client Recipient)': 'Para (cliente)',
  'Address & Contact': 'Endereço e contato',
  'Address & Contact Info': 'Endereço e contato',
  'Address & Details': 'Endereço e detalhes',
  'Business GSTIN / VAT ID / Tax ID (Optional)': 'CNPJ ou inscrição estadual (opcional)',
  'Customer GSTIN / VAT ID / Tax ID (Optional)': 'CNPJ ou CPF do cliente (opcional)',
  'Cash': 'Dinheiro',
  'Credit Card': 'Cartão de crédito',
  'Debit Card': 'Cartão de débito',
  'Bank Transfer': 'Transferência bancária',
  '(optional)': '(opcional)',

  // Margin / break-even
  'Cost Price ($)': 'Preço de custo',
  'Selling Price per Unit ($)': 'Preço de venda por unidade',
  'Desired Profit Margin (%)': 'Margem de lucro desejada (%)',
  'Total Fixed Costs ($)': 'Custos fixos totais',
  'Variable Cost per Unit ($)': 'Custo variável por unidade',
  'Target Profit ($)': 'Lucro desejado',
  'Expected Units Sold': 'Unidades esperadas de venda',
  'Break-Even Point': 'Ponto de equilíbrio',
  'Break-Even Revenue': 'Receita de equilíbrio',
  'Units for Target Profit': 'Unidades para o lucro desejado',
  'Required Price': 'Preço necessário',
  'Contribution Margin / Unit': 'Margem de contribuição / unidade',
  'Contribution Margin Ratio': 'Índice de margem de contribuição',
  'Where Each Sales Dollar Goes': 'Para onde vai cada real vendido',
  'Cost & Margin → Price': 'Custo e margem → preço',
  'Cost & Revenue → Margin': 'Custo e receita → margem',
  'Cost vs Profit Ratio': 'Proporção entre custo e lucro',

  // Percentage
  'Find X% of Y': 'Achar X% de Y',
  'What is X percent of Y?': 'Quanto é X por cento de Y?',
  'What is': 'Quanto é',
  '% of': '% de',
  '% to/from': '% de/para',
  'Add or Subtract %': 'Somar ou subtrair %',
  'Add or subtract a percentage from a number.': 'Some ou subtraia uma porcentagem de um número.',
  'Calculate % increase or decrease from X to Y.': 'Calcule o aumento ou a redução percentual de X para Y.',
  'Find what percentage X is of Y.': 'Descubra quanto por cento X é de Y.',
  'Characters': 'Caracteres',

  // Bank statement tools
  'Reading statement…': 'Lendo o extrato…',
  'Full detail': 'Detalhe completo',
  'Date format': 'Formato de data',
  'Date, Description, Amount': 'Data, descrição, valor',
  'Date, Description, Debit, Credit': 'Data, descrição, débito, crédito',
  'Excel (.xlsx)': 'Excel (.xlsx)',
  'CSV (.csv)': 'CSV (.csv)',
  'Export to CSV': 'Exportar para CSV',
  'Export to JSON': 'Exportar para JSON',
  'Export to PDF': 'Exportar para PDF',
  'Export to XLSX': 'Exportar para XLSX',
  'Download': 'Baixar',
  'Receipt Settings': 'Dados do recibo',
  'Received From': 'Recebido de',
  'Select & Parts Preview': 'Seleção e prévia das partes',
  'TEXT INPUT': 'TEXTO DE ENTRADA',
  'Split every slide into its own presentation': 'Separar cada slide em uma apresentação própria',
  'Extract custom range(s)': 'Extrair intervalos personalizados',
  'Drop your': 'Arraste o',
  'here, or click to choose one': 'aqui, ou clique para escolher',
  'Drop your Excel workbook here, or click to choose one': 'Arraste a pasta do Excel aqui, ou clique para escolher',
  'Drop your PowerPoint file here, or click to choose one': 'Arraste o arquivo do PowerPoint aqui, ou clique para escolher',
  'Drop your Word file here, or click to choose one': 'Arraste o arquivo do Word aqui, ou clique para escolher',
  'Drop your PDF here, or click to choose one': 'Arraste o PDF aqui, ou clique para escolher',
};

const dictionaries: Record<string, Record<string, string>> = { pt };

/**
 * Translate an interface string. Returns the English original when the locale
 * is English, or when no translation has been written yet — which is a visible
 * but harmless degradation, unlike an exposed key.
 */
export function t(english: string, lang: Locale): string {
  if (lang === 'en') return english;
  return dictionaries[lang]?.[english] ?? english;
}

/** Every English string this file can translate. Used by the guard test. */
export function knownStrings(): string[] {
  return Object.keys(pt);
}

/**
 * The whole dictionary for a locale, for handing to client-side scripts.
 *
 * Tool components set some labels at RUNTIME — `btn.textContent = 'Download
 * CSV'` after the output format changes, `'Copy'` after the copied-confirmation
 * times out. Those literals live inside `is:inline` scripts, which cannot call
 * `t()` because it does not exist in the browser. Left alone, a Portuguese page
 * would render in Portuguese and then flip individual labels back to English
 * the moment the reader interacted with it.
 *
 * Layout publishes this as `window.__t`, and those scripts call it. English
 * returns null so the English build ships no dictionary at all.
 */
export function dictionaryFor(lang: Locale): Record<string, string> | null {
  if (lang === 'en') return null;
  const dict = dictionaries[lang];
  if (!dict) return null;
  /* Only the strings a browser script actually asks for. Shipping the whole
     dictionary put 20 KB of mostly-unused JSON into every page — real weight
     for a mobile-heavy audience, to serve about thirty labels. */
  const out: Record<string, string> = {};
  for (const k of RUNTIME_KEYS) if (dict[k]) out[k] = dict[k];
  return out;
}

/**
 * Strings that inline scripts set after the page has loaded, and therefore the
 * only ones the browser needs. Kept as an explicit list rather than derived,
 * because `scripts/tests/ui-strings.test.mjs` cross-checks it against the
 * actual `__t(…)` calls — a label added to a script without being added here
 * would silently fall back to English at runtime.
 */
const RUNTIME_KEYS = [
  'Reading the document…', 'Reading statement…', 'Reading photo…',
  'Copy', 'Download', 'Download CSV', 'Download Excel',
  'Description', 'Currency', 'Format', 'Resize Image',
  'Choose an image to begin.', 'Select all', 'Clear all',
  'Extract Selected Sheets', 'Extract Selected Pages', 'Extract custom range(s)',
  'Type page numbers or ranges — or click the pages below.',
  'Paste JSON to validate and format.',
  'Formatted JSON will appear here with syntax highlighting…',
  'Units for Target Profit', 'Break-Even Point', 'Break-Even Revenue',
  'Credit Card', 'Business Name', 'Base Price',
];
