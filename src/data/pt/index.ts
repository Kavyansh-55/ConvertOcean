/**
 * Brazilian Portuguese content.
 *
 * This is localisation, not translation. A page here is built around the query
 * a Brazilian actually types, which is often not the English page's keyword
 * rendered word for word — so slugs, headlines and FAQs are written from the
 * Portuguese SERP, not carried across from `tools.ts`.
 *
 * Two hard rules when adding to this file:
 *
 * 1. **Never say the user uploads anything.** In pt-BR both `enviar` and
 *    `carregar` read as "upload", and the whole promise of the site is that
 *    nothing leaves the machine. Describe what does *not* happen
 *    ("o arquivo não sai do seu computador") or what the browser does locally.
 *    `scripts/tests/pt-no-upload-claim.test.mjs` fails the build on a breach.
 *
 * 2. **A tool appears under /pt/ only when it is fully localised.** Half a page
 *    in Portuguese is the thin-content pattern that got the previous 28 locale
 *    folders removed. `getTools('pt')` filters to what is in this file, so an
 *    incomplete entry should simply not be added yet.
 *
 * `content` (the long-form SEO body) is deliberately absent on the seed entries
 * below. It is written in the keyword-led wave, from researched Portuguese
 * queries — writing it before the research is what produces translated filler.
 */

import type { PtTool, PtGuide, PtCategory, PtStaticPage } from '../../i18n/content';

export const ptCategories: PtCategory[] = [
  {
    en: 'pdf-tools',
    slug: 'ferramentas-pdf',
    name: 'Ferramentas PDF',
    title: 'Ferramentas de PDF Online e Gratuitas — 100% Privadas | ConvertOcean',
    description: 'Comprimir, juntar, dividir e converter PDF direto no navegador. Nenhum arquivo sai do seu computador.',
    headline: 'Ferramentas de PDF.',
    subtitle: 'Comprima, junte, divida e converta PDF sem que o arquivo saia do seu computador.',
    /* Written 2026-09-27 from what the tools verifiably do, not translated
       from the English FAQs (several of which overclaim). Not keyword-led. */
    intro: `
    <h2>Todas as ferramentas de PDF, sem que o documento saia do computador.</h2>
    <p>O trabalho com PDF costuma ser uma sequência de tarefas pequenas em volta do mesmo documento: <a href="/pt/juntar-pdf/">juntar</a> vários arquivos em um só, <a href="/pt/dividir-pdf/">dividir</a> por páginas, em partes iguais ou em partes abaixo de um tamanho, <a href="/pt/comprimir-pdf/">comprimir</a> até caber no limite de um edital e converter para <a href="/pt/pdf-para-word/">Word</a>, <a href="/pt/pdf-para-excel/">Excel</a> ou <a href="/pt/pdf-para-txt/">texto</a>. Todas essas operações rodam no seu navegador, então contratos, extratos e documentos pessoais não passam por nenhum servidor.</p>
    <p>Para montar um PDF a partir de fotos, comece pelo <a href="/pt/imagem-para-pdf/">imagem para PDF</a>. E se você vai juntar vários documentos para uma inscrição, o guia <a href="/pt/guias/juntar-varios-pdf/">como juntar vários PDF em um só</a> mostra a ordem que dá menos retrabalho.</p>
    `,
    faqs: [
      { q: 'Posso juntar PDF com fotos ou arquivos do Word?', a: 'Não diretamente: o juntar PDF une arquivos que já são PDF. Converta antes as fotos com o imagem para PDF e os documentos com o Word para PDF, e depois junte tudo na ordem que precisar.' },
      { q: 'Existe limite de tamanho ou de páginas?', a: 'Cada ferramenta aceita arquivos de até 25 MB, e não há limite de quantidade de uso. Como o processamento acontece no seu aparelho, a velocidade depende da memória e do processador dele, não de uma fila em servidor.' },
      { q: 'Comprimir o PDF deixa o texto ilegível?', a: 'O compressor reduz principalmente as imagens guardadas em resolução maior do que a página exibe; texto, links e campos de formulário continuam como estavam. Você também pode definir um tamanho-alvo em KB para chegar ao limite de um edital.' }
    ]
  },
  {
    en: 'image-tools',
    slug: 'ferramentas-de-imagem',
    name: 'Ferramentas de Imagem',
    title: 'Ferramentas de Imagem Online — Redimensionar e Converter | ConvertOcean',
    description: 'Redimensione, converta e comprima imagens JPG, PNG, WebP e HEIC direto no navegador, sem que nada saia do seu dispositivo.',
    headline: 'Ferramentas de imagem.',
    subtitle: 'Redimensione, converta e comprima fotos sem que elas saiam do seu dispositivo.',
    /* Written 2026-09-27 from what the tools verifiably do, not translated
       from the English FAQs (several of which overclaim). Not keyword-led. */
    intro: `
    <h2>Converta, redimensione e junte imagens sem enviar um único pixel.</h2>
    <p>Cada formato tem seu lugar: JPG comprime bem fotografias, PNG preserva capturas de tela e logotipos com transparência, e WebP deixa imagens para sites bem menores. Estas ferramentas convertem entre eles — incluindo as fotos <a href="/pt/heic-para-jpg/">HEIC do iPhone</a> —, <a href="/pt/redimensionar-imagem/">redimensionam</a> em pixels ou até um tamanho em KB, <a href="/pt/juntar-fotos/">juntam fotos</a> em uma imagem só e transformam imagens em <a href="/pt/imagem-para-pdf/">PDF</a> ou em <a href="/pt/imagem-para-texto/">texto editável</a>.</p>
    <p>Nada é enviado — o que importa mais do que parece, porque fotos carregam metadados como a localização. O <a href="/pt/ver-exif/">ver dados EXIF</a> mostra o que uma foto revela, e o <a href="/pt/remover-exif/">remover EXIF</a> apaga esses dados sem recomprimir a imagem.</p>
    `,
    faqs: [
      { q: 'Qual formato de imagem é melhor para sites?', a: 'WebP, na maioria dos casos: aceita transparência e costuma ficar bem menor que o JPG equivalente. Para fotografias que vão ser impressas ou enviadas a sistemas antigos, JPG continua sendo o mais compatível.' },
      { q: 'Converter um JPG para PNG melhora a qualidade?', a: 'Não. O PNG não perde qualidade em salvamentos futuros, mas não recupera o detalhe que a compressão do JPG já descartou. A imagem fica igual, só que em um arquivo maior.' },
      { q: 'Como deixar uma foto abaixo de um limite em KB?', a: 'Use o modo de tamanho-alvo do redimensionar imagem: informe o limite, como 50 KB ou 200 KB, e a ferramenta procura a maior qualidade que cabe nele, mostrando o tamanho final antes do download.' }
    ]
  },
  {
    en: 'document-tools',
    slug: 'ferramentas-de-documentos',
    name: 'Ferramentas de Documentos',
    title: 'Ferramentas para Word, PowerPoint e TXT | ConvertOcean',
    description: 'Converta, junte e divida documentos do Word, PowerPoint e arquivos de texto direto no navegador.',
    headline: 'Ferramentas de documentos.',
    subtitle: 'Word, PowerPoint e arquivos de texto — tudo processado no seu próprio navegador.',
    /* Written 2026-09-27 from what the tools verifiably do, not translated
       from the English FAQs (several of which overclaim). Not keyword-led. */
    intro: `
    <h2>Word, PowerPoint e texto — convertidos no seu próprio aparelho.</h2>
    <p>Documentos mudam de formato o tempo todo: um Word vira PDF para enviar com o <a href="/pt/word-para-pdf/">Word para PDF</a>, um PDF recebido volta a ser editável com o <a href="/pt/pdf-para-word/">PDF para Word</a>, apresentações viram PDF com o <a href="/pt/powerpoint-para-pdf/">PowerPoint para PDF</a>. Também dá para <a href="/pt/juntar-documentos-word/">juntar documentos Word</a>, <a href="/pt/dividir-arquivo-word/">dividir um Word</a> a cada Título 1 e juntar ou dividir apresentações e arquivos de texto.</p>
    <p>Tudo é lido e montado dentro do navegador. Contratos, relatórios internos e trabalhos ainda não entregues não são copiados para nenhum servidor.</p>
    `,
    faqs: [
      { q: 'Dá para extrair o texto de um Word escaneado?', a: 'Não pelo conversor de Word: um documento escaneado guarda imagens das páginas, não texto. Transforme as páginas em imagem e passe pelo imagem para texto, que faz o reconhecimento (OCR) no próprio aparelho.' },
      { q: 'A formatação é mantida ao juntar documentos Word?', a: 'O conteúdo, as tabelas e as imagens de cada arquivo entram inteiros, e cada documento começa em uma página nova. Os estilos podem variar quando os arquivos definem o mesmo estilo de formas diferentes — uma revisão rápida dos títulos resolve.' },
      { q: 'Posso reduzir o tamanho de um Word ou PowerPoint?', a: 'Sim. O comprimir Word e o comprimir PowerPoint reduzem principalmente as imagens embutidas, que são quase sempre a maior parte do arquivo, e devolvem um documento que continua editável.' }
    ]
  },
  {
    en: 'excel-converter',
    slug: 'conversor-excel',
    name: 'Conversor de Excel',
    title: 'Conversor de Excel Online — XLSX, CSV e PDF | ConvertOcean',
    description: 'Converta planilhas Excel para PDF, CSV e JSON direto no navegador, sem que a planilha saia do seu computador.',
    headline: 'Conversor de Excel.',
    subtitle: 'Planilhas para PDF, CSV e JSON — processadas no seu navegador, não em um servidor.',
    /* Written 2026-09-27 from what the tools verifiably do, not translated
       from the English FAQs (several of which overclaim). Not keyword-led. */
    intro: `
    <h2>Planilhas convertidas sem que os números saiam do seu computador.</h2>
    <p>Planilhas guardam o que uma empresa tem de mais sensível — folha de pagamento, tabela de preços, lista de clientes. Estas ferramentas convertem entre XLSX, XLS, CSV, JSON e XML nos dois sentidos, geram PDF para impressão com o <a href="/pt/excel-para-pdf/">Excel para PDF</a>, <a href="/pt/unir-arquivos-excel/">juntam</a> e <a href="/pt/dividir-arquivo-excel/">dividem</a> pastas de trabalho e <a href="/pt/comprimir-excel/">comprimem</a> arquivos inchados. Extratos bancários em OFX, QFX ou QBO viram planilha com o <a href="/pt/ofx-para-csv/">OFX para CSV</a>.</p>
    <p>Só o resultado que o Excel salvou para cada fórmula é exportado — nunca a fórmula em si —, então a lógica da sua planilha fica com você.</p>
    `,
    faqs: [
      { q: 'As fórmulas aparecem no arquivo convertido?', a: 'Não. O conversor exporta o resultado que o Excel salvou para cada fórmula; as fórmulas não são recalculadas. Macros (.xlsm) e consultas a bases externas não são executadas.' },
      { q: 'A área de impressão do Excel é respeitada ao gerar PDF?', a: 'Não. O Excel para PDF usa o intervalo utilizado de cada aba — da primeira à última célula com conteúdo — e colunas ocultas também saem no PDF. Para controlar o que aparece, apague as linhas e colunas desnecessárias antes de converter.' },
      { q: 'Por que a minha planilha é tão grande sem ter quase nada?', a: 'Quase sempre é o intervalo utilizado: uma formatação aplicada a milhares de linhas vazias faz o Excel guardar todas elas. O comprimir Excel remove esse excesso e mostra o tamanho antes e depois.' }
    ]
  },
  {
    en: 'business-tools',
    slug: 'ferramentas-empresariais',
    name: 'Ferramentas Empresariais',
    title: 'Gerador de Nota, Recibo e Calculadoras | ConvertOcean',
    description: 'Gere notas e recibos e calcule margem de lucro, ponto de equilíbrio e percentuais direto no navegador.',
    headline: 'Ferramentas empresariais.',
    subtitle: 'Notas, recibos e calculadoras — seus números não saem do seu dispositivo.',
    /* Written 2026-09-27 from what the tools verifiably do, not translated
       from the English FAQs (several of which overclaim). Not keyword-led. */
    intro: `
    <h2>Contas e documentos do dia a dia do negócio, calculados com privacidade.</h2>
    <p>Seis ferramentas cobrem os números mais comuns de quem trabalha por conta própria ou tem uma pequena empresa: a <a href="/pt/calculadora-de-margem-de-lucro/">calculadora de margem de lucro</a> e o <a href="/pt/ponto-de-equilibrio/">ponto de equilíbrio</a> respondem perguntas de preço e de volume mínimo, a <a href="/pt/calculadora-de-porcentagem/">calculadora de porcentagem</a> e a <a href="/pt/calculadora-de-imposto/">calculadora de imposto</a> resolvem as contas do dia a dia, e o <a href="/pt/modelo-de-recibo/">modelo de recibo</a> e o <a href="/pt/modelo-de-fatura/">modelo de fatura</a> geram documentos em PDF, em reais e com PIX.</p>
    <p>Cada calculadora mostra a fórmula ao lado do resultado, para você conferir a conta. Custos, margens e dados de clientes ficam no seu navegador.</p>
    `,
    faqs: [
      { q: 'O modelo de fatura emite nota fiscal?', a: 'Não. Nota fiscal só pode ser emitida pelo sistema da SEFAZ ou da prefeitura. O modelo de fatura gera um documento de cobrança em PDF — útil para detalhar serviços e condições de pagamento, mas sem valor fiscal.' },
      { q: 'Qual a diferença entre margem de lucro e markup?', a: 'A margem é a parte do preço de venda que é lucro; o markup é quanto se soma ao custo para chegar ao preço. Um produto que custa R$ 60 e é vendido por R$ 100 tem margem de 40% e markup de 66,7%. A margem nunca passa de 100%; o markup pode passar.' },
      { q: 'Dá para calcular o imposto a partir de um valor que já inclui o imposto?', a: 'Sim. A calculadora de imposto tem o cálculo reverso: informe o valor total com imposto e a alíquota, e ela mostra o preço sem imposto e o valor exato do imposto.' }
    ]
  },
  {
    en: 'developer-tools',
    slug: 'ferramentas-para-desenvolvedores',
    name: 'Ferramentas para Desenvolvedores',
    title: 'Formatador de JSON e Contador de Palavras | ConvertOcean',
    description: 'Formate e valide JSON, conte palavras e converta dados direto no navegador, sem enviar nada para servidores.',
    headline: 'Ferramentas para desenvolvedores.',
    subtitle: 'JSON, CSV e texto — processados localmente, nunca em um servidor.',
    /* Written 2026-09-27 from what the tools verifiably do, not translated
       from the English FAQs (several of which overclaim). Not keyword-led. */
    intro: `
    <h2>Utilitários de dados que não mandam seus dados para lugar nenhum.</h2>
    <p>Dados de desenvolvimento estão cheios do que nunca deveria passar por um servidor de terceiros — chaves de API em arquivos de configuração, registros de clientes em exportações, tokens em payloads. Estas ferramentas convertem entre <a href="/pt/csv-para-json/">CSV e JSON</a>, transformam <a href="/pt/xml-para-json/">XML em JSON</a>, validam e formatam com o <a href="/pt/formatar-json/">formatador de JSON</a> e analisam textos com o <a href="/pt/contador-de-palavras/">contador de palavras</a>.</p>
    <p>Como tudo roda no navegador, também funciona sem internet e na velocidade do seu próprio processador.</p>
    `,
    faqs: [
      { q: 'O formatador de JSON mostra onde está o erro?', a: 'Sim. Quando o JSON é inválido, o formatador indica a linha e a coluna do problema, mostra o trecho com um marcador no ponto exato e descreve o erro — vírgula sobrando, aspas faltando, chave sem fechar.' },
      { q: 'Arquivos CSV grandes funcionam?', a: 'Funcionam até 25 MB por arquivo. A leitura acontece na memória da aba, então a velocidade depende do seu aparelho, não de uma fila em servidor.' }
    ]
  }
];

/**
 * The first three pages, written before the keyword research arrived. They
 * target the concurso-público document workflow rather than a head term.
 */
const ptToolsSeed: PtTool[] = [
  {
    en: 'compress-pdf',
    slug: 'comprimir-pdf',
    name: 'Comprimir PDF',
    title: 'Comprimir PDF Online Grátis — Reduzir para 2 MB | ConvertOcean',
    description: 'Reduza o tamanho de um PDF direto no navegador, sem que o arquivo saia do seu computador. Ideal para deixar documentos dentro do limite de 2 MB dos editais de concurso.',
    headline: 'Comprimir PDF.',
    subtitle: 'Reduza o tamanho do seu PDF sem que ele saia do seu computador — e sem marca d’água, cadastro ou limite diário.',
    quickAnswer: 'Para comprimir um PDF, arraste o documento para a ferramenta acima e escolha o nível de compressão. Tudo acontece dentro do seu navegador: o arquivo não sai do seu computador e não é copiado para nenhum servidor. É a forma mais rápida de deixar documentos digitalizados abaixo do limite de 2 MB exigido pela maioria dos editais de concurso público.',
    category: 'Ferramentas PDF',
    faqs: [
      {
        question: 'como comprimir pdf',
        answer: 'Arraste o documento para a ferramenta no topo da página e escolha o nível de compressão. O tamanho final aparece antes de você baixar, então dá para testar um nível mais leve se o resultado ficar aquém do esperado. Não há cadastro, marca d’água nem limite diário.'
      },
      {
        question: 'o que é comprimir pdf',
        answer: 'É reduzir o tamanho do arquivo sem mudar o que está escrito nele. Comprimir, compactar e diminuir são a mesma operação — nomes diferentes para ela, e esta página faz as três. Na prática, a redução vem de recomprimir as imagens dentro do documento e de descartar dados que não afetam a leitura.'
      },
      {
        question: 'como diminuir o tamanho de um arquivo pdf',
        answer: 'O primeiro passo é saber onde está o peso. Abra o PDF e tente selecionar uma frase: se o texto é destacado, o documento é majoritariamente texto e já é pequeno — a compressão renderá pouco porque não há muito a tirar. Se o cursor só desenha um retângulo, cada página é uma imagem digitalizada, e é aí que a compressão faz diferença real.'
      },
      {
        question: 'como diminuir mb de pdf',
        answer: 'A redução depende do tipo de documento. Um PDF digitalizado de 8 MB costuma cair para algo entre 500 KB e 1,5 MB na compressão mais forte. Um PDF gerado pelo Word, que já é quase todo texto, pode cair apenas 10 ou 20%. Se um arquivo de texto já está pequeno e ainda assim precisa encolher, o caminho normalmente é remover páginas, não comprimir mais.'
      },
      {
        question: 'como comprimir pdf sem perder qualidade',
        answer: 'Em PDFs de texto, sim: o texto é vetorial e continua nítido e selecionável em qualquer nível de compressão. Em páginas digitalizadas, não existe compressão realmente sem perdas — as imagens são recomprimidas e há degradação visual, tanto maior quanto mais forte o nível. O caminho prático é escolher o nível mais leve que ainda caiba no limite exigido e conferir o resultado antes de enviar.'
      },
      {
        question: 'como compactar arquivos em pdf',
        answer: 'A compressão trabalha um documento por vez. Se você precisa reduzir vários, pode ser mais eficiente juntá-los primeiro em <a href="/pt/juntar-pdf/">juntar PDF</a> e comprimir o arquivo único: comprimir um documento só costuma render mais do que comprimir vários separadamente, porque elementos repetidos entre eles são aproveitados uma vez.'
      },
      {
        question: 'como compactar arquivos pdf',
        answer: 'Nem todo PDF encolhe. Documentos que já foram comprimidos antes, ou que são quase todo texto, chegam perto do mínimo possível e não têm muito a ceder — se o resultado mal mudou, é esse o motivo, e insistir em um nível mais forte só degrada o que já estava bom. O ganho grande está sempre nos digitalizados.'
      },
      {
        question: 'como diminuir arquivo pdf',
        answer: 'Quando a compressão não basta, existem dois caminhos antes de desistir. Remova as páginas desnecessárias em <a href="/pt/dividir-pdf/">dividir PDF</a> — muitos anexos carregam páginas em branco ou instruções que ninguém precisa enviar. E, se o documento for digitalizado, refazer a digitalização costuma render mais do que qualquer compressão sobre um arquivo já ruim.'
      },
      {
        question: 'como diminuir o tamanho de um arquivo em pdf',
        answer: 'Se o documento ainda vai ser digitalizado, o ajuste mais eficiente acontece antes: digitalize em 200 dpi em vez de 600, e em preto e branco ou escala de cinza quando o documento não tiver cor relevante. Um RG digitalizado assim sai pequeno de origem e pode nem precisar de compressão. É bem mais eficaz do que comprimir ao máximo um arquivo que nasceu grande demais.'
      },
      {
        question: 'como comprimir um arquivo pdf muito grande',
        answer: 'Arquivos muito grandes funcionam, mas o limite é a memória do seu próprio dispositivo, já que o processamento é local. Um PDF de centenas de megabytes pode deixar o navegador lento ou travar em um aparelho modesto. Nesse caso, divida o documento antes em <a href="/pt/dividir-pdf/">dividir PDF</a>, comprima cada parte e junte de novo se necessário.'
      },
      {
        question: 'como compactar pdf no iphone',
        answer: 'Funciona no Safari do iPhone como em qualquer navegador: abra a página, selecione o PDF pelo app Arquivos e baixe o resultado. Não é preciso instalar aplicativo, e o documento continua sem sair do aparelho. O que limita em celulares mais antigos é a memória disponível para arquivos grandes.'
      },
      {
        question: 'Como deixar meu PDF abaixo de 2 MB para o concurso?',
        answer: 'Escolha a compressão mais forte e confira o tamanho final antes de baixar. Documentos digitalizados costumam cair bastante — um RG ou diploma escaneado de 8 MB normalmente fica entre 500 KB e 1,5 MB. Se ainda passar do limite, digitalize novamente em 200 dpi e em preto e branco antes de comprimir.'
      },
      {
        question: 'O documento continua legível para a banca?',
        answer: 'Sim, desde que você confira o resultado antes de anexar. Os editais rejeitam arquivos ilegíveis, então abra o PDF comprimido e verifique se dá para ler nome, números de documento e assinaturas. Se a compressão mais forte borrar o texto, volte um nível: normalmente o arquivo ainda fica dentro do limite.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. A compressão roda inteiramente no seu navegador, no seu próprio dispositivo. O documento não é copiado para nenhum servidor nosso nem de terceiros, e nós não temos como vê-lo. O código do site é aberto e pode ser conferido no repositório público.'
      }
    ],
    content: `
      <h2>Comprimir, compactar ou diminuir: a mesma coisa</h2>
      <p>As três palavras descrevem a mesma operação, e esta página faz todas. Quem procura <strong>compactar pdf</strong>, <strong>diminuir pdf</strong> ou <strong>comprimir pdf gratuito</strong> está atrás do mesmo resultado: um arquivo menor, com o conteúdo intacto.</p>
      <p>É gratuito, sem cadastro e sem marca d’água — <strong>compactar pdf gratis</strong> aqui significa a ferramenta inteira, não uma amostra.</p>

      <h2>Onde está o peso do seu arquivo</h2>
      <p>Esta é a parte que decide quanto você vai conseguir reduzir, e quase ninguém verifica antes. Abra o PDF e tente selecionar uma frase. Se o texto é destacado, o documento é essencialmente texto: ele já é pequeno, e a compressão vai render pouco porque não há muito a remover. Se o cursor apenas desenha um retângulo, cada página é uma fotografia — e é nesse caso que <strong>diminuir pdf tamanho</strong> produz quedas de 80% ou mais.</p>

      <h2>Sem perder qualidade: depende do documento</h2>
      <p>Em PDFs de texto, o texto é vetorial e permanece nítido e selecionável em qualquer nível. Em páginas digitalizadas não existe compressão sem perdas: as imagens são recomprimidas e há degradação, proporcional ao nível escolhido. Dizemos isso abertamente porque descobrir depois que a banca recusou um documento ilegível é bem pior do que escolher um nível mais leve agora.</p>

      <h2>Arquivos muito grandes</h2>
      <p>O processamento é local, então o limite é a memória do seu aparelho e não uma regra nossa. Para documentos de centenas de megabytes, divida antes em <a href="/pt/dividir-pdf/">dividir PDF</a>, comprima cada parte e junte novamente se preciso.</p>

      <h2>O documento não sai do seu computador</h2>
      <p>Contratos, holerites, laudos e documentos de concurso são exatamente o que as pessoas mais precisam comprimir — e o que menos deveria circular. Aqui a compressão acontece dentro do navegador e o arquivo não é copiado para nenhum servidor.</p>
    `
  },
  {
    en: 'merge-pdf',
    slug: 'juntar-pdf',
    name: 'Juntar PDF',
    title: 'Juntar PDF Online Grátis — Unir Vários Arquivos | ConvertOcean',
    description: 'Una vários PDF em um único arquivo direto no navegador, na ordem que você quiser. Nenhum documento sai do seu computador.',
    headline: 'Juntar PDF.',
    subtitle: 'Una vários documentos em um único PDF, na ordem que você escolher — sem que nada saia do seu computador.',
    quickAnswer: 'Para juntar vários PDF em um só, adicione os arquivos na ferramenta acima na ordem em que devem aparecer e baixe o documento único. Tudo é montado dentro do seu navegador, sem que os arquivos saiam do seu computador. É o caminho normal para reunir RG, CPF, diploma e comprovantes em um único anexo quando o edital pede um arquivo só.',
    category: 'Ferramentas PDF',
    faqs: [
      {
        question: 'como juntar varios pdf em um só',
        answer: 'Adicione os arquivos na ferramenta no topo da página, na sequência em que devem aparecer. A ordem da lista na tela é a ordem das páginas no arquivo final; se um entrar fora do lugar, remova-o no ✕ e adicione de novo — ele vai para o fim da lista. Quando a sequência estiver certa, baixe o PDF único. Não há cadastro, marca d’água nem limite de quantos arquivos você pode reunir.'
      },
      {
        question: 'como juntar dois pdf',
        answer: 'O procedimento é o mesmo de qualquer quantidade: adicione os dois arquivos na ordem em que devem aparecer e confira a lista antes de baixar. A lista não é reordenável: se um arquivo ficou fora de lugar, remova-o com ✕ e adicione de novo, e ele vai para o fim.'
      },
      {
        question: 'como juntar arquivos pdf',
        answer: 'A ferramenta aceita arquivos PDF. Não há limite fixo de quantidade nem de páginas: o que limita é a memória do seu próprio dispositivo, já que o processamento é local. Em um computador comum, dezenas de documentos são reunidos sem problema; arquivos muito grandes somados podem deixar o navegador lento antes de terminar.'
      },
      {
        question: 'como juntar fotos em pdf',
        answer: 'Fotos não são PDFs, então há um passo antes: converta as imagens usando <a href="/pt/imagem-para-pdf/">JPG para PDF</a>, o que gera um PDF com uma foto por página, e depois junte esse arquivo aos demais aqui. Se todas as fotos forem do mesmo conjunto, a conversão já pode reuni-las em um único PDF de uma vez.'
      },
      {
        question: 'como juntar pdf em um só',
        answer: 'O resultado é um arquivo único, com as páginas na ordem definida na tela e a numeração corrida do começo ao fim. O conteúdo de cada documento original é preservado — texto continua selecionável, e não há recompressão. O que não sobrevive são marcadores e campos de formulário dos arquivos de origem.'
      },
      {
        question: 'como unir pdf',
        answer: 'Juntar, unir e mesclar são a mesma operação, apenas nomes diferentes para ela — esta página faz as três. Você adiciona os arquivos, define a ordem e baixa um PDF único, sem instalar programa e sem que os documentos saiam do seu dispositivo.'
      },
      {
        question: 'como unir varios pdf em um só',
        answer: 'Adicione todos de uma vez em vez de um a um: a ferramenta aceita múltiplos arquivos na mesma seleção e os mantém na ordem da lista. Se a ordem importar, adicione um arquivo por vez: cada novo entra no fim da lista. Para documentos de concurso, monte a sequência exatamente como o edital pede antes de baixar, porque conferir depois custa refazer.'
      },
      {
        question: 'como mesclar pdf',
        answer: 'Adicione os arquivos na ordem certa e baixe. Vale lembrar que mesclar não reduz tamanho: o PDF final tem aproximadamente a soma dos originais. Se houver limite de tamanho no destino, passe o resultado pelo <a href="/pt/comprimir-pdf/">comprimir PDF</a> depois de mesclar — comprimir um arquivo só rende mais do que comprimir vários separados.'
      },
      {
        question: 'o que é mesclar pdf',
        answer: 'Mesclar um PDF é combinar vários documentos em um único arquivo, mantendo todas as páginas na ordem escolhida. Não altera o conteúdo das páginas, não reduz o tamanho e não recomprime nada — apenas coloca tudo dentro de um arquivo só. É o que se pede quando um sistema aceita apenas um anexo.'
      },
      {
        question: 'Como juntar RG, CPF e diploma em um único PDF?',
        answer: 'Adicione os documentos na ordem exigida pelo edital — um por vez, se preciso, já que cada arquivo novo entra no fim da lista. Se os documentos estiverem em JPG, converta-os antes com <a href="/pt/imagem-para-pdf/">JPG para PDF</a>. Depois de unido, confira se o arquivo está dentro do limite de tamanho — quase sempre 2 MB — e comprima se necessário.'
      },
      {
        question: 'O conteúdo dos documentos fica visível para vocês?',
        answer: 'Não. A união acontece no seu navegador e os arquivos não são copiados para nenhum servidor. Documentos com dados pessoais — CPF, RG, comprovante de residência, contracheque — permanecem no seu dispositivo do começo ao fim.'
      }
    ],
    content: `
      <h2>Juntar, unir ou mesclar: a mesma coisa</h2>
      <p>As três palavras descrevem a mesma operação, e esta página faz todas: reunir vários documentos em um arquivo único. Se você procurou por <strong>unir pdf</strong>, <strong>mesclar pdf</strong> ou <strong>juntar pdf em um só</strong>, chegou ao lugar certo — a diferença está apenas no termo que cada pessoa usa.</p>
      <p>Não há cadastro, marca d’água nem limite diário, e a ferramenta é gratuita: quem busca <strong>juntar pdf gratis</strong> ou <strong>mesclar pdf gratuito</strong> não encontra aqui uma versão paga escondendo recursos.</p>

      <h2>A ordem é definida antes, não depois</h2>
      <p>As páginas entram exatamente na sequência em que os arquivos aparecem na tela, e dentro de cada arquivo a ordem original é mantida. Confira antes de baixar: depois de unido, mudar a ordem significa refazer a operação. Para documentos de concurso, monte a sequência que o edital exige.</p>

      <h2>Fotos precisam de um passo a mais</h2>
      <p>Uma busca frequente é <strong>juntar pdf e jpg</strong>, e a resposta é que imagens não são PDFs. Converta-as primeiro em <a href="/pt/imagem-para-pdf/">JPG para PDF</a> — uma foto por página — e junte o resultado aos outros documentos aqui.</p>

      <h2>Unir não comprime</h2>
      <p>O arquivo final tem aproximadamente a soma dos originais. Se o destino impõe limite de tamanho, o caminho é unir primeiro e depois passar pelo <a href="/pt/comprimir-pdf/">comprimir PDF</a>: comprimir um arquivo único rende mais do que comprimir vários separadamente.</p>

      <h2>Os documentos não saem do seu dispositivo</h2>
      <p>A união é feita pelo próprio navegador. Contratos, extratos e documentos pessoais não são copiados para nenhum servidor — e o código do site é aberto, então a afirmação pode ser verificada em vez de aceita.</p>
    `
  },
  {
    en: 'image-to-pdf',
    /* Re-slugged in batch 12. `jpg-para-pdf` was chosen in this seed batch,
       before any keyword research existed, and the research later showed the
       term does not appear in the Brazilian data at all — while `imagem para
       pdf` and `converter imagem em pdf` are each Medium at >10,000. */
    slug: 'imagem-para-pdf',
    /* Batch 13, 2026-09-27: batch 12 changed the slug but not the page — the
       title still said "JPG para PDF", a term absent from the Brazilian data,
       and none of the seven researched questions had been added. The old copy
       also promised a drag-to-reorder control the tool does not have; pages
       follow the order the images are chosen, which verify-order.mjs now
       guarantees. */
    name: 'Imagem para PDF',
    title: 'Imagem para PDF — Converter Imagem em PDF Online Grátis | ConvertOcean',
    description: 'Converter imagem em PDF direto no navegador: JPG, PNG e WebP viram um PDF com uma imagem por página, no computador ou no celular. As imagens não saem do seu dispositivo.',
    headline: 'Imagem para PDF.',
    subtitle: 'Converta fotos e documentos fotografados em um PDF — uma imagem por página, sem que nada saia do seu dispositivo.',
    quickAnswer: 'Para converter imagem em PDF, selecione um ou mais arquivos JPG, PNG ou WebP na ferramenta acima e baixe o PDF. Cada imagem vira uma página A4, ajustada para caber sem ser esticada, na ordem em que você escolheu os arquivos. A conversão acontece dentro do seu navegador e as imagens não saem do seu dispositivo — o caminho usual para transformar fotos de documentos em um anexo aceito por editais e sistemas que só recebem PDF.',
    category: 'Ferramentas PDF',
    faqs: [
      {
        question: 'como converter imagem em pdf',
        answer: 'Selecione a imagem na ferramenta no topo da página e clique para baixar o PDF. Não há cadastro, marca d’água nem instalação. Cada imagem ocupa uma página A4 em pé, centralizada e reduzida até caber nas margens; uma imagem menor que a página não é ampliada, para não perder nitidez.'
      },
      {
        question: 'como converter imagem para pdf',
        answer: 'Os formatos aceitos são JPG, JPEG, PNG e WebP. Fotos do iPhone em HEIC precisam virar JPG antes — use o <a href="/pt/heic-para-jpg/">HEIC para JPG</a> e depois volte aqui. Capturas de tela em PNG funcionam direto e mantêm o texto nítido.'
      },
      {
        question: 'como passar uma imagem para pdf',
        answer: 'Quando o sistema de destino só aceita PDF — inscrição em concurso, portal de faculdade, envio para o RH — passar a imagem para PDF é o passo que falta. O conteúdo não muda: a imagem é colocada dentro de uma página de PDF, com a mesma resolução que tinha. Se a foto estava ilegível, o PDF também vai estar; vale conferir a foto antes.'
      },
      {
        question: 'como converter uma imagem em pdf',
        answer: 'Para uma imagem só, o resultado é um PDF de uma página. Se a imagem estiver deitada (paisagem), ela é reduzida para caber na largura da página em pé; para um documento fotografado de lado, gire a foto no celular antes de converter, e ela vai ocupar a página inteira.'
      },
      {
        question: 'como juntar imagens em pdf',
        answer: 'Selecione várias imagens de uma vez: todas entram no mesmo PDF, uma por página, na ordem em que foram escolhidas. A lista não é reordenável — se uma entrar fora do lugar, remova-a no ✕ e adicione de novo, que ela vai para o fim. Quando a ordem importa, o mais seguro é adicionar uma imagem por vez.'
      },
      {
        question: 'como converter imagem em pdf no celular',
        answer: 'A ferramenta funciona no navegador do celular, sem aplicativo: toque na área de envio, escolha as fotos da galeria e baixe o PDF. Para documentos, fotografe de frente, com boa luz e sem sombra sobre o papel — editais rejeitam imagens ilegíveis, e nenhuma conversão recupera o que a foto não captou.'
      },
      {
        question: 'como juntar duas imagens em um pdf',
        answer: 'O caso mais comum é frente e verso de um documento, como RG ou CNH. Adicione primeiro a foto da frente e depois a do verso: o PDF sai com duas páginas, nessa ordem. Se o edital pedir frente e verso na mesma página, o caminho é outro — use o <a href="/pt/juntar-fotos/">juntar fotos</a> para montar uma imagem única e converta essa imagem aqui.'
      },
      {
        question: 'O PDF gerado fica muito grande?',
        answer: 'Pode ficar, porque fotos de celular são pesadas e a imagem entra no PDF com a resolução original. Se o destino impõe limite — quase sempre 2 MB em concursos —, passe o resultado pelo <a href="/pt/comprimir-pdf/">comprimir PDF</a> depois de gerar, ou reduza as fotos antes com o <a href="/pt/redimensionar-imagem/">redimensionar imagem</a>.'
      },
      {
        question: 'As fotos são copiadas para algum servidor?',
        answer: 'Não. A montagem do PDF é feita pelo seu navegador, no seu aparelho. Fotos de documentos pessoais não são copiadas para lugar nenhum e nós não temos acesso a elas.'
      }
    ],
    content: `
      <h2>Imagem para PDF, uma página por imagem</h2>
      <p>Cada arquivo escolhido vira uma página A4 em pé, com margem, e a imagem é reduzida até caber — nunca ampliada, porque ampliar só deixa a imagem borrada. É o formato que editais e portais esperam quando pedem um documento “em PDF”.</p>

      <h2>A ordem é a ordem em que você escolhe</h2>
      <p>As páginas seguem a sequência em que os arquivos foram adicionados, mesmo quando uma foto grande e uma pequena são escolhidas juntas. Não existe arrastar para reordenar: para corrigir a posição de uma imagem, remova-a e adicione de novo, e ela vai para o fim da lista.</p>

      <h2>Depois de converter: tamanho e junção</h2>
      <p>Se o PDF passar do limite do sistema de destino, <a href="/pt/comprimir-pdf/">comprima o PDF</a>. Se precisar reunir o resultado com outros documentos que já estão em PDF, use o <a href="/pt/juntar-pdf/">juntar PDF</a>. Nenhum dos dois passos envia os arquivos para lugar nenhum.</p>
    `
  }
];

/**
 * ---------------------------------------------------------------------------
 * Keyword-led batch 1 — supplied by Kavya 2026-09-24. See ./keywords.ts.
 * ---------------------------------------------------------------------------
 *
 * Every `question` string below is quoted EXACTLY as it was researched:
 * lowercase, no added punctuation, no tidied wording. That is not sloppiness,
 * it is the point — altering the phrasing is what breaks exact match, and the
 * English pages carry their reader-supplied questions the same way.
 *
 * The synonym queries (`converter` / `passar` / `mudar` / `transformar`) are
 * separate searches with separate volume, so all of them are answered — but
 * each ANSWER covers different ground (scanned files, tables, images, cost,
 * privacy). Eight restatements of one answer would be near-duplicate content
 * on a page that already has to survive a duplicate audit.
 */
export const ptToolsBatch1: PtTool[] = [
  {
    en: 'pdf-to-word',
    slug: 'pdf-para-word',
    name: 'PDF para Word',
    title: 'Converter PDF para Word Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter PDF para Word (.docx) editável direto no navegador, sem cadastro e sem marca d’água. O arquivo não sai do seu computador.',
    headline: 'PDF para Word.',
    subtitle: 'Transforme um PDF em um documento Word editável — títulos, tabelas e imagens reconstruídos, sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter PDF para Word, selecione o arquivo na ferramenta acima e baixe o documento .docx editável. Títulos, negrito, itálico, tamanhos de fonte, recuos e tabelas detectadas são reconstruídos como formatação nativa do Word, e figuras e logotipos entram como imagens. Tudo acontece dentro do seu navegador: o arquivo não sai do seu computador e não é copiado para nenhum servidor.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'como converter pdf para word',
        answer: 'Arraste o PDF para a ferramenta no topo desta página, espere a conversão terminar e baixe o arquivo .docx. Não há cadastro, fila de espera nem limite diário. O documento abre normalmente no Word, no LibreOffice e no Google Docs, já editável.'
      },
      {
        question: 'como passar pdf para word',
        answer: 'Antes de converter, faça um teste de dez segundos: abra o PDF e tente selecionar uma frase com o cursor. Se o texto for destacado, o PDF é digital e o conversor consegue reconstruir o conteúdo. Se o cursor apenas desenhar um retângulo, a página é uma imagem digitalizada — nesse caso use primeiro a ferramenta de imagem para texto (OCR) e depois cole o resultado no Word.'
      },
      {
        question: 'como converter de pdf para word',
        answer: 'O que é reconstruído como formatação real do Word: títulos, negrito, itálico, tamanhos de fonte, recuos de parágrafo e tabelas detectadas. O que muda: o PDF guarda coordenadas fixas e o Word usa texto que flui, então margens e quebras de linha podem se deslocar um pouco em layouts de várias colunas. Documentos de texto corrido saem praticamente idênticos.'
      },
      {
        question: 'como passar de pdf para word',
        answer: 'Tabelas com bordas visíveis costumam ser reconhecidas e viram tabelas de verdade no Word, com linhas e colunas editáveis. Tabelas sem bordas, alinhadas apenas por espaçamento, são mais difíceis de detectar e podem sair como parágrafos separados. Confira as tabelas antes de enviar o documento para alguém.'
      },
      {
        question: 'como mudar pdf para word',
        answer: 'Figuras, gráficos e logotipos são incorporados como imagens, no tamanho e na posição em que aparecem no PDF. Eles continuam sendo imagens no Word: dá para mover e redimensionar, mas não para editar o conteúdo do gráfico. Um gráfico que precise ser editável tem de ser refeito a partir dos dados originais.'
      },
      {
        question: 'como mudar de pdf para word',
        answer: 'A ferramenta funciona no navegador do celular igual ao computador, e o arquivo continua sem sair do aparelho. Depois que a página carrega uma vez, ela também funciona sem internet — útil para converter documentos em trânsito ou com conexão instável.'
      },
      {
        question: 'como converter pdf para word gratuito',
        answer: 'A conversão é gratuita e sem contrapartidas: nenhum cadastro, nenhuma marca d’água no documento, nenhum limite de quantos arquivos por dia e nenhuma versão paga escondendo recursos. O site é de código aberto e o repositório público mostra exatamente o que o navegador executa.'
      },
      {
        question: 'como transformar de pdf para word',
        answer: 'A conversão roda inteiramente no seu dispositivo, dentro da memória do navegador. O PDF não é copiado para nenhum servidor nosso nem de terceiros, e nós não temos como lê-lo — o que importa quando o documento é um contrato, um holerite ou um laudo médico.'
      }
    ],
    content: `
      <h2>Converter PDF para Word sem perder a formatação</h2>
      <p>O motivo de tanta gente procurar um <strong>conversor de pdf para word</strong> que não estrague o layout é simples: os dois formatos descrevem uma página de maneiras opostas. O PDF posiciona cada caractere em uma coordenada fixa, como um desenho. O Word usa um texto que flui e se reorganiza conforme margens, espaçamento e tamanho de página. Passar <strong>de pdf para word</strong> é traduzir entre esses dois modelos, e é aí que aparecem margens duplicadas, quebras de linha estranhas e tabelas desmontadas.</p>
      <p>Esta ferramenta reconstrói títulos, negrito, itálico, tamanhos de fonte, recuos e tabelas detectadas como formatação nativa do Word, em vez de jogar o texto em uma única caixa. Figuras e logotipos entram como imagens na posição original.</p>

      <h2>PDF digital e PDF digitalizado não são a mesma coisa</h2>
      <p>Esta é a checagem que evita a maior parte das frustrações ao <strong>transformar pdf para word</strong>. Abra o arquivo e tente selecionar uma frase. Se o texto é destacado, os caracteres existem de verdade e a conversão funciona. Se o cursor só desenha um retângulo, a página é uma fotografia: para o arquivo, aquele "texto" é um conjunto de pixels, e qualquer conversor direto devolverá uma página vazia ou uma imagem colada. Documentos digitalizados precisam de OCR antes, e o resultado recupera as <em>palavras</em>, não o design.</p>

      <h2>Por que a conversão acontece no seu navegador</h2>
      <p>A maioria dos conversores online copia o seu documento para um servidor, converte lá e devolve o resultado. Aqui não existe essa etapa: o processamento acontece na memória do seu próprio navegador, e o arquivo não sai do seu computador. Para contratos, documentos pessoais e material interno de empresa, essa diferença é a razão de existir do site — e o código aberto é a evidência de que a promessa é verdadeira.</p>
    `
  },
  {
    en: 'word-to-pdf',
    slug: 'word-para-pdf',
    name: 'Word para PDF',
    title: 'Converter Word para PDF Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter Word (.docx) para PDF direto no navegador, com texto selecionável e sem marca d’água. O arquivo não sai do seu computador.',
    headline: 'Word para PDF.',
    subtitle: 'Converta documentos .docx em PDF com texto selecionável e quebras de página limpas, sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter Word para PDF, arraste um arquivo .docx para a ferramenta acima e baixe o PDF. Títulos, negrito, itálico, listas e tabelas são mantidos, e o resultado é um PDF vetorial de verdade: o texto continua selecionável e pesquisável, e as páginas quebram sem cortar linhas ao meio. A conversão roda no seu navegador e o arquivo não sai do seu computador.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'como converter word para pdf',
        answer: 'Arraste o arquivo .docx para a ferramenta no topo da página e baixe o PDF. Não é preciso instalar nada nem criar conta, e o PDF sai sem marca d’água. O resultado abre em qualquer leitor de PDF, inclusive no celular.'
      },
      {
        question: 'como converter de word para pdf',
        answer: 'O PDF gerado é vetorial, não uma imagem da página: o texto continua selecionável, pesquisável e nítido em qualquer nível de zoom. Isso importa quando o documento vai ser lido em tela, indexado por um sistema ou anexado a um processo que exija texto pesquisável.'
      },
      {
        question: 'como passar word para pdf',
        answer: 'Títulos, negrito, itálico, listas numeradas e com marcadores e tabelas são preservados. As quebras de página são calculadas para não cortar uma linha de texto ao meio. O texto é desenhado com fontes substitutas embutidas no PDF — Roboto para fontes sem serifa, Noto Serif para fontes com serifa e Noto Mono para texto monoespaçado —, então as quebras de linha podem diferir um pouco das do Word. Vale conferir a primeira página antes de enviar o documento.'
      },
      {
        question: 'Qual a diferença entre .doc e .docx nesta ferramenta?',
        answer: 'A ferramenta trabalha com .docx, o formato usado pelo Word desde 2007. Arquivos .doc antigos precisam ser abertos no Word ou no LibreOffice e salvos novamente como .docx antes da conversão. É uma limitação do formato antigo, que é binário e fechado, não da ferramenta.'
      },
      {
        question: 'O documento é copiado para algum servidor?',
        answer: 'Não. A conversão acontece dentro do navegador, no seu dispositivo, e o arquivo não é copiado para nenhum servidor. Currículos, contratos e documentos com dados pessoais permanecem com você do começo ao fim.'
      }
    ],
    content: `
      <h2>Converter Word para PDF mantendo o texto selecionável</h2>
      <p>Quem procura um <strong>conversor de word para pdf</strong> geralmente quer garantir duas coisas: que o documento seja exibido igual em qualquer computador e que ninguém o altere por engano. O PDF resolve as duas — mas só se a conversão gerar um PDF de verdade, e não uma imagem de cada página.</p>
      <p>É a diferença entre um arquivo que pode ser pesquisado, copiado e lido por leitores de tela e um que é apenas uma fotografia do seu texto. Aqui a saída é sempre vetorial: passar <strong>de word para pdf</strong> mantém títulos, negrito, itálico, listas e tabelas como elementos reais, com o texto selecionável.</p>

      <h2>Quando as fontes mudam — e como evitar</h2>
      <p>Ao <strong>transformar de word para pdf</strong>, uma fonte instalada apenas no seu computador pode ser substituída por uma equivalente, o que desloca levemente o espaçamento. Documentos que usam as fontes comuns do Office não têm esse problema. Se o alinhamento for crítico — um currículo de uma página, por exemplo — confira o resultado antes de enviar.</p>

      <h2>Sem cadastro, sem marca d’água, sem servidor</h2>
      <p>A ferramenta é gratuita, não pede conta e não escreve marca d’água no resultado. E, diferentemente dos conversores online mais conhecidos, ela não copia o seu documento para um servidor: o processamento é feito pelo próprio navegador. Um currículo ou um contrato não precisa passar pela infraestrutura de ninguém para virar PDF.</p>
    `
  },
  {
    en: 'excel-to-pdf',
    slug: 'excel-para-pdf',
    name: 'Excel para PDF',
    title: 'Converter Excel para PDF Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter planilhas Excel (.xlsx, .xls, .csv) para PDF direto no navegador, com tabelas reais e texto selecionável. A planilha não sai do seu computador.',
    headline: 'Excel para PDF.',
    subtitle: 'Converta planilhas em PDF com tabelas de verdade e cabeçalho repetido em cada página, sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter Excel para PDF, arraste uma planilha .xlsx, .xls ou .csv para a ferramenta acima e baixe o PDF. Cada aba é desenhada como uma tabela real, com bordas e um cabeçalho sombreado que se repete em todas as páginas, e o texto continua selecionável e pesquisável. Todas as abas da pasta de trabalho entram por padrão. A conversão roda no seu navegador e a planilha não sai do seu computador.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'como converter excel para pdf',
        answer: 'Arraste a planilha para a ferramenta no topo da página e baixe o PDF. Cada aba vira uma tabela com bordas, começando em uma página própria com o nome da aba como título. Por padrão todas as abas são incluídas, mas dá para converter apenas a que você está visualizando.'
      },
      {
        question: 'como transformar excel em pdf',
        answer: 'Dá para fazer pelo próprio Excel, em Arquivo › Salvar como › PDF, mas o resultado depende da configuração de página de cada aba, e é aí que colunas somem na margem. Aqui a planilha é desenhada como tabela de verdade, em paisagem, com o cabeçalho repetido em cada página — e funciona sem ter o Excel instalado.'
      },
      {
        question: 'como transformar excel em pdf no celular',
        answer: 'Abra esta página no navegador do celular, toque na área de envio e escolha a planilha no gerenciador de arquivos ou em um anexo baixado. O PDF é gerado no próprio aparelho, sem instalar aplicativo nem ter o Excel no celular. Planilhas muito largas ficam mais legíveis se você der zoom no PDF resultante, que mantém o texto nítido.'
      },
      {
        question: 'A área de impressão definida no Excel é respeitada?',
        answer: 'Não. O conversor lê o intervalo utilizado da planilha — da primeira à última célula com conteúdo — e não a área de impressão configurada no Excel. Colunas ocultas também são impressas. Para controlar exatamente o que aparece no PDF, apague as linhas e colunas que não devem sair antes de converter, em vez de escondê-las.'
      },
      {
        question: 'como transformar excel em pdf sem cortar',
        answer: 'As colunas são redimensionadas em conjunto para caber na página, em vez de serem cortadas na margem direita, e o texto quebra em várias linhas dentro da célula. A orientação paisagem é o padrão justamente por isso. Tabelas longas são paginadas automaticamente e o cabeçalho se repete no topo de cada página.'
      },
      {
        question: 'As fórmulas aparecem no PDF?',
        answer: 'Não — o PDF mostra os valores calculados, não as fórmulas que os produziram. Para uma planilha de preços ou de custos isso costuma ser desejável: o destinatário vê os números sem ver a lógica por trás deles.'
      },
      {
        question: 'A planilha é copiada para algum servidor?',
        answer: 'Não. A leitura da planilha e a geração do PDF acontecem no seu navegador, no seu dispositivo. Planilhas costumam guardar o que uma empresa tem de mais sensível — folha de pagamento, tabela de preços, lista de clientes — e nada disso é copiado para nenhum servidor.'
      }
    ],
    content: `
      <h2>Converter Excel para PDF com tabelas de verdade</h2>
      <p>A maior parte dos problemas ao usar um <strong>conversor de excel para pdf</strong> aparece na hora de imprimir: colunas cortadas na margem, cabeçalho que some a partir da segunda página, texto virando imagem. Aqui cada aba é desenhada como uma tabela vetorial, com bordas e um cabeçalho sombreado que se repete em todas as páginas — e o texto continua selecionável e pesquisável, não é uma captura de tela.</p>
      <p>Passar <strong>de excel para pdf</strong> inclui, por padrão, todas as abas da pasta de trabalho, cada uma começando em uma página nova com o nome da aba como título. Se você precisa de uma aba só, há a opção de converter apenas a que está sendo visualizada.</p>

      <h2>O que o conversor lê — e o que ele ignora</h2>
      <p>Vale saber antes de converter: a ferramenta lê o <strong>intervalo utilizado</strong> da planilha, ou seja, tudo entre a primeira e a última célula com conteúdo. Ela não usa a área de impressão que você configurou no Excel, e colunas ocultas continuam aparecendo no PDF. Para excluir algo do resultado, apague as linhas e colunas em vez de ocultá-las. Dizemos isso abertamente porque descobrir esse comportamento depois de enviar um relatório é bem pior.</p>

      <h2>Seus números não saem do seu computador</h2>
      <p>Planilhas concentram o que há de mais sensível em uma operação: salários, margens, listas de clientes. Um conversor que copia o arquivo para um servidor transforma isso em um problema de confiança. Esta ferramenta processa a planilha dentro do navegador, no seu próprio dispositivo — e o código é aberto, então a afirmação pode ser verificada em vez de aceita.</p>
    `
  }
];

/**
 * ---------------------------------------------------------------------------
 * Keyword-led batch 2 — supplied by Kavya 2026-09-24. See ./keywords.ts.
 * ---------------------------------------------------------------------------
 *
 * Same verbatim rule as batch 1. Two things shaped this batch specifically:
 *
 * - `/pt/ppt-para-pdf/` fronts the LEGACY tool, which cannot read a binary .ppt
 *   in a browser at all. The term has >1000 volume, so people will arrive
 *   expecting a conversion. The page says so in the first answer and sends them
 *   to /pt/powerpoint-para-pdf/ — a page that ranks and then fails silently is
 *   worse than one that ranks and redirects honestly.
 *
 * - Eight PDF→PowerPoint questions were researched and are NOT answered here,
 *   because no such tool exists. They live in `noToolYet` in ./keywords.ts.
 */
const ptToolsBatch2: PtTool[] = [
  {
    en: 'pdf-to-excel',
    slug: 'pdf-para-excel',
    name: 'PDF para Excel',
    title: 'Converter PDF para Excel Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter tabelas de PDF para planilha Excel (.xlsx) direto no navegador, com linhas e colunas alinhadas. O arquivo não sai do seu computador.',
    headline: 'PDF para Excel.',
    subtitle: 'Extraia tabelas de um PDF para uma planilha com linhas e colunas alinhadas, sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter PDF para Excel, selecione o arquivo na ferramenta acima e baixe a planilha .xlsx. As tabelas são reconstruídas célula a célula: valores com mais de uma palavra ficam inteiros e todas as linhas são alinhadas às mesmas colunas, em vez de espalhar cada pedaço de texto em uma célula própria. PDFs digitais convertem melhor; PDFs digitalizados precisam de OCR antes. Tudo roda no seu navegador e o arquivo não sai do seu computador.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'como converter pdf para excel',
        answer: 'Arraste o PDF para a ferramenta no topo da página e baixe o arquivo .xlsx. Cada tabela detectada vira uma faixa de linhas e colunas na planilha, pronta para ordenar, filtrar e usar em fórmulas. Não é preciso cadastro nem instalação.'
      },
      {
        question: 'como exportar pdf para excel',
        answer: 'A exportação preserva a estrutura da tabela, não a aparência. Bordas, cores de fundo e fontes do PDF não são transportadas — o que volta são os valores, nas posições certas de linha e coluna. É isso que permite usar os números em cálculos em vez de apenas olhar para eles.'
      },
      {
        question: 'como passar pdf para excel',
        answer: 'Antes de converter, verifique se o PDF é digital: abra o arquivo e tente selecionar uma frase. Se o texto é destacado, a conversão funciona. Se o cursor só desenha um retângulo, a página é uma imagem digitalizada e não há texto para extrair — use primeiro a ferramenta de imagem para texto (OCR).'
      },
      {
        question: 'como importar pdf para excel',
        answer: 'Depois de baixar o .xlsx, abra-o diretamente no Excel, no LibreOffice ou no Google Sheets — é uma pasta de trabalho normal, não um arquivo importado com assistente. Se você precisa dos dados dentro de uma planilha já existente, copie as linhas e cole na aba de destino.'
      },
      {
        question: 'como converter de pdf para excel',
        answer: 'Tabelas com bordas visíveis e colunas bem separadas são as que saem melhor. Tabelas cujas colunas são alinhadas apenas por espaços, relatórios com várias tabelas na mesma página e células mescladas são mais difíceis de interpretar e podem exigir um ajuste manual depois. Confira os totais antes de usar os dados.'
      },
      {
        question: 'como transferir pdf para excel',
        answer: 'Valores com mais de uma palavra permanecem inteiros em uma única célula — "Receita bruta acumulada" não é quebrado em três células. Esse é o erro mais comum de conversores que tratam cada fragmento de texto como um campo separado, e é o que costuma inviabilizar a planilha resultante.'
      },
      {
        question: 'como copiar uma tabela do pdf para o excel',
        answer: 'Copiar e colar direto do leitor de PDF quase sempre resulta em tudo empilhado em uma coluna só, porque a área de transferência carrega apenas texto sem estrutura. A conversão reconstrói o alinhamento das colunas antes de gerar o arquivo, que é a diferença entre uma planilha utilizável e uma para refazer à mão.'
      },
      {
        question: 'como alterar pdf para excel',
        answer: 'O PDF original não é modificado em nenhum momento: a ferramenta lê o conteúdo e gera um arquivo .xlsx novo. Você fica com os dois arquivos, e o PDF permanece exatamente como estava.'
      },
      {
        question: 'como copiar pdf para excel',
        answer: 'A conversão acontece inteiramente no seu navegador e o PDF não é copiado para nenhum servidor. Isso importa aqui mais do que na maioria dos conversores: extratos bancários, relatórios financeiros e listas de clientes são justamente os PDFs que as pessoas mais querem transformar em planilha.'
      }
    ],
    content: `
      <h2>Converter PDF para Excel sem perder o alinhamento das colunas</h2>
      <p>O problema de quase todo <strong>conversor de pdf para excel</strong> é que o PDF não guarda tabelas. Ele guarda caracteres em coordenadas. A grade que você enxerga é uma impressão visual: para o arquivo, não existem linhas nem colunas. Converter <strong>de pdf para excel</strong> significa deduzir essa estrutura a partir das posições do texto.</p>
      <p>É por isso que tantas conversões devolvem tudo em uma coluna só, ou quebram "Receita bruta acumulada" em três células. Aqui a reconstrução é feita célula a célula: valores com várias palavras ficam inteiros e todas as linhas são alinhadas às mesmas colunas.</p>

      <h2>Quais PDFs funcionam</h2>
      <p>PDFs gerados digitalmente — exportados do Excel, do sistema da empresa, de um internet banking — são os que melhor se prestam a <strong>exportar pdf para excel</strong>, porque os caracteres existem de verdade. Um PDF digitalizado é uma fotografia da página: não há texto a extrair, e o caminho é passar antes por OCR. O teste leva dez segundos: tente selecionar uma frase no arquivo.</p>

      <h2>Extratos e relatórios não precisam sair do seu computador</h2>
      <p>Os PDFs que as pessoas mais querem virar planilha são exatamente os que menos deveriam circular: extratos bancários, folhas de pagamento, relatórios de vendas, listas de clientes. Esta ferramenta processa o arquivo dentro do navegador, no seu próprio dispositivo, e o documento não é copiado para nenhum servidor. O código é aberto, então a afirmação pode ser conferida.</p>
    `
  },
  {
    en: 'pdf-to-txt',
    slug: 'pdf-para-txt',
    name: 'PDF para TXT',
    title: 'Converter PDF para TXT Online Grátis — 100% Privado | ConvertOcean',
    description: 'Extraia o texto de um PDF para um arquivo .txt direto no navegador, com a ordem de leitura preservada. O arquivo não sai do seu computador.',
    headline: 'PDF para TXT.',
    subtitle: 'Extraia o texto puro de um PDF, com a ordem de leitura e as quebras de linha preservadas, sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter PDF para TXT, selecione o arquivo na ferramenta acima e baixe um .txt com o texto puro, mantendo a ordem de leitura e as quebras de linha. Funciona com PDFs digitais, criados por computador; um PDF digitalizado não tem camada de texto e precisa de OCR antes. A extração acontece no seu navegador, então documentos confidenciais não saem do seu dispositivo.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'Como converter um PDF para TXT?',
        answer: 'Arraste o PDF para a ferramenta no topo da página e baixe o arquivo .txt. O texto sai na ordem em que é lido, com as quebras de linha preservadas, pronto para abrir em qualquer editor — Bloco de Notas, VS Code, Word ou um script.'
      },
      {
        question: 'A formatação é mantida no arquivo .txt?',
        answer: 'Não, e isso é intencional. Texto puro não tem onde guardar fontes, tamanhos, cores, tabelas ou imagens — o formato só armazena caracteres. O que é preservado é o conteúdo e a ordem: parágrafos e quebras de linha continuam onde estavam.'
      },
      {
        question: 'Funciona com PDF digitalizado?',
        answer: 'Não. Um PDF digitalizado é uma imagem da página, sem camada de texto, então não há nada para extrair — o resultado viria vazio. Nesses casos use antes a ferramenta de imagem para texto, que faz o reconhecimento óptico dos caracteres.'
      },
      {
        question: 'Para que serve converter PDF em texto puro?',
        answer: 'Para tudo que precisa do conteúdo sem a embalagem: contar palavras, comparar duas versões de um contrato linha a linha, alimentar um script, indexar documentos em uma busca, ou colar um trecho longo sem arrastar formatação junto.'
      },
      {
        question: 'O PDF é copiado para algum servidor?',
        answer: 'Não. A leitura do PDF e a geração do .txt acontecem na memória do seu navegador, no seu dispositivo. O arquivo não é copiado para lugar nenhum, o que importa quando o documento é um contrato ou um laudo.'
      }
    ],
    content: `
      <h2>Extrair o texto de um PDF sem instalar nada</h2>
      <p>Um <strong>conversor de pdf para txt</strong> resolve um problema específico: você quer o conteúdo, não a página. Texto puro é o formato mais portátil que existe — abre em qualquer editor, em qualquer sistema, hoje e daqui a vinte anos, e ocupa uma fração do tamanho do PDF original.</p>
      <p>Esta ferramenta permite <strong>converter pdf para txt grátis</strong>, sem cadastro e sem limite diário, mantendo a ordem de leitura e as quebras de linha do documento original.</p>

      <h2>O que o texto puro não consegue guardar</h2>
      <p>Fontes, tamanhos, cores, tabelas, imagens e posicionamento não sobrevivem — não porque a conversão seja limitada, mas porque o formato .txt armazena apenas caracteres. Se você precisa manter a aparência do documento, o caminho é PDF para Word. Se precisa apenas das palavras, o .txt é o formato certo e o mais fácil de processar depois.</p>

      <h2>Digital ou digitalizado: confira antes</h2>
      <p>A extração só funciona em PDFs criados digitalmente. Abra o arquivo e tente selecionar uma frase: se o texto é destacado, há uma camada de texto e a conversão funciona. Se o cursor apenas desenha um retângulo, a página é uma imagem e o resultado sairia em branco — nesse caso o caminho é o OCR.</p>
    `
  },
  {
    en: 'docx-to-txt',
    slug: 'word-para-txt',
    name: 'Word para TXT',
    title: 'Converter Word para TXT Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter documentos Word (.docx) em texto puro .txt direto no navegador, sem cadastro. O arquivo não sai do seu computador.',
    headline: 'Word para TXT.',
    subtitle: 'Extraia apenas as palavras de um documento .docx, sem formatação, sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter Word para TXT, selecione um arquivo .docx na ferramenta acima e baixe um .txt contendo apenas as palavras. A formatação é descartada de propósito: fontes, cores, tabelas e imagens não têm como sobreviver, porque o texto puro não tem onde guardá-las. É o formato certo para alimentar um script, comparar versões ou contar palavras. Tudo roda no seu navegador.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'como converter arquivo word para txt',
        answer: 'Arraste o arquivo .docx para a ferramenta no topo da página e baixe o .txt. O resultado contém apenas o texto do documento, na ordem original, pronto para abrir em qualquer editor ou processar em um script.'
      },
      {
        question: 'como converter documento word para txt',
        answer: 'Documentos .doc antigos precisam ser abertos no Word ou no LibreOffice e salvos novamente como .docx antes. O formato .doc é binário e fechado, e não pode ser lido dentro do navegador — é uma limitação do formato, não da ferramenta.'
      },
      {
        question: 'Por que a formatação some?',
        answer: 'Porque o .txt guarda apenas caracteres. Não existe lugar no formato para negrito, tabelas, cores ou imagens. A perda é deliberada e costuma ser o motivo da conversão: quem quer só o conteúdo geralmente quer justamente se livrar da formatação.'
      },
      {
        question: 'Quando vale a pena converter Word para texto puro?',
        answer: 'Para comparar duas versões de um documento linha a linha, alimentar um script ou uma ferramenta de análise, colar um texto longo em outro lugar sem arrastar estilos junto, ou reduzir o tamanho de um arquivo que só precisa das palavras.'
      },
      {
        question: 'O documento é copiado para algum servidor?',
        answer: 'Não. A extração acontece no seu navegador, no seu dispositivo, e o arquivo não é copiado para nenhum servidor. Depois que a página carrega, a ferramenta também funciona sem internet.'
      }
    ],
    content: `
      <h2>Quando um documento precisa virar apenas texto</h2>
      <p>Um <strong>conversor word para txt</strong> existe para o caso em que a formatação é o problema, não o valor. Ao <strong>converter texto word para txt</strong>, você fica com o conteúdo puro: sem estilos herdados, sem tabelas, sem imagens, sem os metadados que um .docx carrega junto.</p>
      <p>É o formato certo quando o texto vai ser processado por outra coisa — um script, um comparador de versões, um contador de palavras, um sistema de busca — em vez de ser lido como documento.</p>

      <h2>.docx sim, .doc não</h2>
      <p>A ferramenta trabalha com .docx, o formato usado pelo Word desde 2007. Arquivos .doc antigos são binários e fechados, e não podem ser abertos dentro do navegador: basta abri-los no Word ou no LibreOffice e salvar como .docx antes de converter.</p>

      <h2>Processamento local</h2>
      <p>A conversão acontece na memória do navegador, no seu próprio dispositivo, e o documento não é copiado para nenhum servidor. Para minutas, contratos e textos não publicados, essa é a diferença entre usar uma ferramenta online e enviar o material para a infraestrutura de terceiros.</p>
    `
  },
  {
    en: 'pptx-to-pdf',
    slug: 'powerpoint-para-pdf',
    name: 'PowerPoint para PDF',
    title: 'Converter PowerPoint para PDF Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter apresentações PowerPoint (.pptx) para PDF direto no navegador, um slide por página, com tema e layout preservados.',
    headline: 'PowerPoint para PDF.',
    subtitle: 'Converta apresentações .pptx em PDF com o layout e o tema reais, um slide por página, sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter PowerPoint para PDF, selecione um arquivo .pptx na ferramenta acima e baixe um PDF que mantém o layout, o tema, as cores, o texto e as tabelas de cada slide — um slide por página. É a forma de compartilhar uma apresentação que fica idêntica em qualquer dispositivo, mesmo sem o PowerPoint instalado. Arquivos .ppt antigos precisam ser salvos como .pptx antes. Tudo roda no seu navegador.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'como converter powerpoint para pdf',
        answer: 'Arraste o arquivo .pptx para a ferramenta no topo da página e baixe o PDF. Cada slide vira uma página, com as cores do tema, as fontes, o plano de fundo e as tabelas preservados. Não é preciso ter o PowerPoint instalado.'
      },
      {
        question: 'O PDF fica igual à apresentação original?',
        answer: 'O layout, o tema, as cores, o texto e as tabelas são mantidos, um slide por página. O que não sobrevive são os elementos que dependem de tempo: animações, transições e vídeos incorporados viram o estado final do slide, porque um PDF é um documento estático.'
      },
      {
        question: 'As anotações do apresentador entram no PDF?',
        answer: 'As anotações são levadas para uma camada de texto invisível do PDF — elas não aparecem impressas sobre o slide, mas podem ser encontradas em uma busca dentro do arquivo. Se a apresentação vai ser distribuída, vale saber que esse conteúdo acompanha o documento.'
      },
      {
        question: 'Por que converter uma apresentação em PDF?',
        answer: 'Porque um .pptx muda de aparência conforme a versão do PowerPoint e as fontes instaladas em cada computador, e pode ser editado por engano. O PDF fica idêntico em qualquer dispositivo, abre sem software específico e é o formato esperado quando uma apresentação é anexada a um e-mail ou a um processo.'
      },
      {
        question: 'A apresentação é copiada para algum servidor?',
        answer: 'Não. Os slides são interpretados e desenhados pelo próprio navegador, no seu dispositivo, e o arquivo não é copiado para nenhum servidor. Apresentações internas, propostas comerciais e material não divulgado permanecem com você.'
      }
    ],
    content: `
      <h2>Converter PowerPoint para PDF mantendo o tema</h2>
      <p>Quem procura um <strong>conversor de powerpoint para pdf</strong> geralmente quer resolver um problema conhecido: a apresentação abre diferente no computador de quem recebe. Fontes ausentes, versões diferentes do PowerPoint e telas de outro tamanho mudam o resultado. Passar <strong>de powerpoint para pdf</strong> congela a aparência: cada slide vira uma página, e essa página é a mesma em qualquer lugar.</p>
      <p>Aqui os slides são desenhados com o layout e o tema reais — cores, fontes, plano de fundo e tabelas —, e não como capturas de tela.</p>

      <h2>O que não atravessa a conversão</h2>
      <p>Animações, transições e vídeos incorporados não sobrevivem, porque o PDF é estático: o que fica é o estado final de cada slide. Se a apresentação depende de elementos que aparecem em sequência, vale separá-los em slides diferentes antes de converter.</p>

      <h2>Arquivos .ppt antigos</h2>
      <p>O formato binário .ppt não pode ser lido dentro de um navegador. Abra o arquivo no PowerPoint ou no LibreOffice, salve como .pptx e converta em seguida — é um passo só, e depois dele tudo funciona normalmente.</p>
    `
  },
  {
    en: 'ppt-to-pdf',
    slug: 'ppt-para-pdf',
    name: 'PPT para PDF',
    title: 'Converter PPT para PDF Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter apresentações PPT para PDF direto no navegador. Arquivos .ppt antigos precisam de um passo extra — a página explica qual.',
    headline: 'PPT para PDF.',
    subtitle: 'O formato .ppt antigo precisa de um passo a mais antes de virar PDF — e depois dele os slides são convertidos no seu próprio dispositivo.',
    quickAnswer: 'Para converter PPT para PDF, adicione o arquivo na ferramenta acima e baixe um PDF com um slide por página, com as cores do tema, as fontes, o plano de fundo e as tabelas preservados. Atenção ao formato: o .ppt binário antigo não pode ser lido dentro de um navegador — abra-o no PowerPoint ou no LibreOffice, salve como .pptx e converta em seguida. Tudo roda no seu dispositivo.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'como converter ppt para pdf',
        answer: 'Se o seu arquivo é .pptx, arraste-o para a ferramenta e baixe o PDF. Se é um .ppt antigo, é preciso um passo a mais: abra no PowerPoint ou no LibreOffice e salve como .pptx primeiro. O formato .ppt é binário e fechado, e nenhum navegador consegue lê-lo — nem aqui, nem em qualquer outro conversor que funcione no seu dispositivo.'
      },
      {
        question: 'Como sei se meu arquivo é .ppt ou .pptx?',
        answer: 'Veja a extensão no nome do arquivo. Terminando em .pptx, ele foi salvo pelo PowerPoint 2007 ou posterior e funciona direto. Terminando em .ppt, é o formato antigo e precisa ser salvo novamente. No Windows, se as extensões estiverem ocultas, ative "Extensões de nomes de arquivos" na aba Exibir do Explorador.'
      },
      {
        question: 'Como salvar um .ppt como .pptx?',
        answer: 'Abra a apresentação no PowerPoint, vá em Arquivo, Salvar como, e escolha "Apresentação do PowerPoint (*.pptx)" na lista de formatos. No LibreOffice Impress, use Arquivo, Salvar como, e selecione "PowerPoint 2007-365 (.pptx)". Depois disso a conversão para PDF funciona normalmente.'
      },
      {
        question: 'O resultado é igual ao da conversão de .pptx?',
        answer: 'Sim — depois do re-salvamento é exatamente o mesmo motor de conversão: um slide por página, com o layout, o tema, as cores e as tabelas preservados. O passo extra serve apenas para traduzir o arquivo antigo para um formato que o navegador consegue abrir.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. A conversão acontece no seu navegador, no seu dispositivo, e nada é copiado para nenhum servidor — inclusive o passo de re-salvar, que você faz no seu próprio computador, sem que o arquivo passe por nós em momento algum.'
      }
    ],
    content: `
      <h2>PPT e PPTX não são o mesmo formato</h2>
      <p>É a distinção que decide se um <strong>conversor de ppt para pdf</strong> vai funcionar. O .pptx, usado pelo PowerPoint desde 2007, é um pacote aberto que um navegador consegue abrir e interpretar. O .ppt é o formato binário anterior, fechado e sem especificação pública utilizável no navegador — nenhuma ferramenta que rode no seu próprio dispositivo consegue lê-lo diretamente.</p>
      <p>Dizemos isso de forma direta porque a alternativa seria aceitar o arquivo e falhar depois, ou copiá-lo para um servidor para converter lá — que é exatamente o que este site não faz.</p>

      <h2>O passo a mais, uma vez só</h2>
      <p>Abra a apresentação no PowerPoint ou no LibreOffice Impress e salve como .pptx. Leva alguns segundos, acontece no seu computador e não envolve nenhum serviço externo. A partir daí, <strong>passar ppt para pdf</strong> funciona como qualquer outra conversão daqui: um slide por página, com o tema e o layout reais.</p>

      <h2>Depois do re-salvamento</h2>
      <p>O motor é o mesmo da página de <a href="/pt/powerpoint-para-pdf/">PowerPoint para PDF</a>: cores do tema, fontes, plano de fundo e tabelas preservados, um slide por página, tudo processado dentro do navegador. Animações e transições não sobrevivem, porque o PDF é estático.</p>
    `
  }
];

/**
 * ---------------------------------------------------------------------------
 * Keyword-led batch 3 — data and developer converters, 2026-09-24.
 * ---------------------------------------------------------------------------
 *
 * Built for completeness, not for ranking. csv↔json comes back HARD at <100
 * volume against SERPs made of Stack Overflow and dev tooling; xml↔json and
 * json→xlsx have effectively no demand at all. Only the xlsx↔csv pair is
 * winnable. These pages exist because someone who arrives still needs the tool
 * to work and to read in their own language — the honest framing is in
 * ./keywords.ts, so nobody later reads a thin page here as a failure.
 *
 * Language-modifier queries (`converter json para csv python`) are NOT answered
 * here. Someone typing a language name wants a snippet, not a web tool; they
 * belong to a guide. See `codeIntent` in ./keywords.ts.
 */
const ptToolsBatch3: PtTool[] = [
  {
    en: 'xlsx-to-csv',
    slug: 'xlsx-para-csv',
    name: 'XLSX para CSV',
    title: 'Converter XLSX para CSV Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter planilhas Excel (.xlsx, .xls) em arquivos CSV limpos direto no navegador, com aspas e vírgulas tratadas corretamente.',
    headline: 'XLSX para CSV.',
    subtitle: 'Transforme uma planilha Excel em um CSV limpo, pronto para scripts e bancos de dados, sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter XLSX para CSV, selecione uma planilha .xlsx ou .xls na ferramenta acima e baixe a primeira aba como um CSV limpo, separado por vírgulas, que qualquer banco de dados, script ou ferramenta consegue ler. Valores que contêm vírgulas ou aspas são escapados corretamente. A conversão acontece no seu navegador e o arquivo não sai do seu computador.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'como converter xlsx para csv',
        answer: 'Arraste a planilha para a ferramenta no topo da página e baixe o arquivo .csv. A primeira aba é exportada, com os valores separados por vírgula e a codificação UTF-8, pronta para importar em um banco de dados ou processar em um script.'
      },
      {
        question: 'O que acontece com as outras abas da planilha?',
        answer: 'O formato CSV guarda uma única tabela — não existe conceito de abas dentro de um .csv. Por isso a primeira aba é exportada. Se você precisa de outra, mova-a para a primeira posição no Excel antes de converter, ou converta uma vez por aba.'
      },
      {
        question: 'Valores com vírgula dentro estragam o arquivo?',
        answer: 'Não. Campos que contêm vírgulas, aspas ou quebras de linha são colocados entre aspas e escapados segundo a convenção padrão de CSV, então continuam sendo um campo só ao serem lidos. É justamente onde exportações mal feitas costumam quebrar uma importação.'
      },
      {
        question: 'As fórmulas são exportadas?',
        answer: 'O CSV recebe os valores calculados, não as fórmulas. O formato só armazena texto, então não haveria onde guardar uma fórmula — e para alimentar um banco de dados ou um script é o resultado que interessa.'
      },
      {
        question: 'A planilha é copiada para algum servidor?',
        answer: 'Não. A leitura da planilha e a geração do CSV acontecem no seu navegador, no seu dispositivo, e o arquivo não é copiado para nenhum servidor.'
      }
    ],
    content: `
      <h2>De planilha para um CSV que não quebra na importação</h2>
      <p>Um <strong>conversor de xlsx para csv</strong> parece trivial até a primeira importação falhar. O problema quase nunca é a conversão em si: é um campo com vírgula dentro, um valor com aspas, uma quebra de linha no meio de uma célula de observações. Sem escapamento correto, a linha se parte e o banco de dados recusa o arquivo.</p>
      <p>Aqui o escapamento segue a convenção padrão de CSV, então <strong>converter arquivo xlsx para csv</strong> devolve algo que scripts, bancos e ferramentas de BI leem sem ajuste manual.</p>

      <h2>Uma tabela por arquivo</h2>
      <p>O CSV não tem abas: é uma tabela e ponto. Ao passar <strong>de xlsx para csv</strong>, a primeira aba é a exportada. Se a que você precisa está em outra posição, mova-a para o início no Excel antes de converter — é mais rápido do que qualquer alternativa.</p>

      <h2>Dados sensíveis não precisam sair da máquina</h2>
      <p>Exportações para CSV costumam ser o passo anterior a uma importação em sistema: cadastro de clientes, base de produtos, folha de pagamento. A conversão acontece dentro do navegador, no seu dispositivo, e nada é copiado para nenhum servidor.</p>
    `
  },
  {
    en: 'csv-to-xlsx',
    slug: 'csv-para-xlsx',
    name: 'CSV para XLSX',
    title: 'Converter CSV para XLSX Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter arquivos CSV em planilhas Excel (.xlsx) direto no navegador, com as colunas já separadas e sem assistente de importação.',
    headline: 'CSV para XLSX.',
    subtitle: 'Transforme um CSV em uma planilha Excel de verdade, com as colunas já separadas, sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter CSV para XLSX, selecione o arquivo .csv na ferramenta acima e baixe uma planilha .xlsx nativa, que abre no Excel, no Google Sheets ou no LibreOffice com as colunas já separadas — sem assistente de importação. Campos entre aspas e vírgulas dentro dos valores são tratados corretamente. Tudo é processado no seu navegador.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'como converter csv para xlsx',
        answer: 'Arraste o arquivo .csv para a ferramenta no topo da página e baixe a planilha .xlsx. Ela abre já com as colunas separadas, sem precisar passar pelo assistente "Texto para colunas" do Excel.'
      },
      {
        question: 'Por que o Excel às vezes abre meu CSV tudo em uma coluna?',
        answer: 'Porque o Excel usa o separador de listas do sistema operacional. Em configurações em português do Brasil esse separador costuma ser o ponto e vírgula, então um CSV separado por vírgula é lido como uma coluna só. Converter para .xlsx antes resolve o problema de uma vez, porque o arquivo já chega com as colunas definidas.'
      },
      {
        question: 'Acentos e caracteres especiais são preservados?',
        answer: 'Sim, desde que o CSV esteja em UTF-8, que é o padrão atual. A planilha gerada guarda o texto na própria estrutura do arquivo, então nomes com acento, cedilha e til deixam de depender de o Excel adivinhar a codificação — que é a causa mais comum de "Ã§" no lugar de "ç".'
      },
      {
        question: 'Números e datas viram texto na planilha?',
        answer: 'Os valores são gravados em células com o tipo apropriado sempre que possível, e não como texto puro, então dá para somar, ordenar e filtrar sem converter nada depois. Vale conferir colunas de datas, cujo formato de origem no CSV pode ser ambíguo.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. A leitura do CSV e a montagem da planilha acontecem no seu navegador, no seu dispositivo, e nada é copiado para nenhum servidor.'
      }
    ],
    content: `
      <h2>O CSV que abre torto no Excel</h2>
      <p>O motivo mais comum para procurar um <strong>conversor de csv para xlsx</strong> não é o formato — é o Excel abrindo tudo empilhado em uma coluna só. Isso acontece porque o Excel usa o separador de listas do sistema, que em configurações brasileiras costuma ser o ponto e vírgula, enquanto o arquivo está separado por vírgula.</p>
      <p>Converter antes resolve de forma definitiva: o .xlsx já carrega a estrutura das colunas dentro dele, então não há o que o Excel adivinhar.</p>

      <h2>Acentuação que não vira símbolo estranho</h2>
      <p>O segundo problema clássico é a codificação. Um CSV é só texto, e cabe ao programa deduzir se está em UTF-8 ou em outra tabela — quando erra, "ç" vira "Ã§". Ao usar um <strong>conversor csv para xlsx</strong>, o texto passa a ser armazenado na estrutura da planilha, e a adivinhação deixa de existir.</p>

      <h2>Células com tipo, não texto</h2>
      <p><strong>Converter csv para xlsx</strong> aqui grava números como números e não como texto, então somar, ordenar e filtrar funciona imediatamente. Vale conferir colunas de data, cujo formato de origem pode ser ambíguo no CSV. E, como todo o resto do site, a conversão acontece no seu navegador — a base de clientes não precisa passar por servidor nenhum.</p>
    `
  },
  {
    en: 'csv-to-json',
    slug: 'csv-para-json',
    name: 'CSV para JSON',
    title: 'Converter CSV para JSON Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter arquivos CSV em JSON estruturado direto no navegador: cada linha vira um objeto e os cabeçalhos viram chaves.',
    headline: 'CSV para JSON.',
    subtitle: 'Cada linha da planilha vira um objeto JSON, com os cabeçalhos como chaves — processado no seu próprio navegador.',
    quickAnswer: 'Para converter CSV para JSON, selecione um arquivo .csv na ferramenta acima: cada linha da planilha vira um objeto JSON, com os cabeçalhos das colunas como chaves, reunidos em um único array estruturado. A leitura acontece inteiramente no seu navegador, o que torna a ferramenta segura para exportações confidenciais, fixtures de API e arquivos de configuração.',
    category: 'Ferramentas para Desenvolvedores',
    faqs: [
      {
        question: 'Como o CSV é mapeado para JSON?',
        answer: 'A primeira linha é tratada como cabeçalho e cada uma das suas células vira uma chave. Cada linha seguinte vira um objeto com essas chaves, e todos os objetos são reunidos em um array. É o formato que a maioria das APIs e bibliotecas espera receber.'
      },
      {
        question: 'Campos com vírgula dentro são tratados corretamente?',
        answer: 'Sim. Valores entre aspas contendo vírgulas, aspas escapadas ou quebras de linha são interpretados como um campo único, segundo a convenção padrão de CSV — e não partidos em vários campos, que é onde conversões improvisadas costumam falhar.'
      },
      {
        question: 'Os números viram number ou string no JSON?',
        answer: 'O CSV não carrega informação de tipo: para o arquivo, tudo é texto. Se o seu consumidor exige tipos específicos, converta-os depois de carregar o JSON, ou valide o resultado antes de usar em produção.'
      },
      {
        question: 'Dá para usar com dados confidenciais?',
        answer: 'Sim, e é o motivo de a ferramenta rodar como roda. A leitura e a conversão acontecem na memória do seu navegador, e o arquivo não é copiado para nenhum servidor — exportações de banco de dados e listas de clientes não passam por infraestrutura de terceiros.'
      },
      {
        question: 'Funciona sem internet?',
        answer: 'Sim. Depois que a página carrega uma vez, a conversão continua funcionando offline, porque tudo o que ela precisa já está no navegador.'
      }
    ],
    content: `
      <h2>De planilha para um array de objetos</h2>
      <p>Um <strong>conversor de csv para json</strong> resolve a ponte mais comum entre o mundo das planilhas e o do código. O CSV é uma tabela plana; o JSON é o formato que quase toda API, biblioteca e banco de dados moderno espera. <strong>Converter arquivo csv para json</strong> transforma a primeira linha em chaves e cada linha seguinte em um objeto dentro de um array.</p>

      <h2>Onde a conversão costuma dar errado</h2>
      <p>Quase sempre no escapamento. Um campo de endereço com vírgula, uma observação com aspas, um texto com quebra de linha no meio — sem tratamento correto, cada um deles parte a linha e produz um JSON silenciosamente errado. Aqui o tratamento segue a convenção padrão de CSV, então o campo chega inteiro.</p>
      <p>Vale lembrar que o CSV não guarda tipos: tudo chega como texto. Se o destino exige números ou booleanos, a conversão de tipo é um passo seu, depois de carregar o JSON.</p>

      <h2>Exportações confidenciais</h2>
      <p>Os CSVs que viram JSON costumam ser exportações de banco de dados, fixtures de teste e arquivos de configuração — material que não deveria circular. Tudo aqui é processado dentro do navegador, no seu dispositivo, e o código aberto permite conferir a afirmação em vez de confiar nela.</p>
    `
  },
  {
    en: 'json-to-csv',
    slug: 'json-para-csv',
    name: 'JSON para CSV',
    title: 'Converter JSON para CSV Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter arrays JSON em planilhas CSV direto no navegador: as chaves viram cabeçalhos e cada objeto vira uma linha.',
    headline: 'JSON para CSV.',
    subtitle: 'Achate um array de objetos JSON em uma planilha CSV, sem que os dados saiam do seu computador.',
    quickAnswer: 'Para converter JSON para CSV, selecione um array de objetos JSON e a ferramenta o achata em uma planilha separada por vírgulas: as chaves dos objetos viram cabeçalhos de coluna e cada objeto vira uma linha. A conversão acontece no seu navegador, então respostas de API e exportações de banco de dados não são copiadas para nenhum servidor.',
    category: 'Ferramentas para Desenvolvedores',
    faqs: [
      {
        question: 'como converter json para csv',
        answer: 'Cole ou selecione um array de objetos JSON na ferramenta acima e baixe o .csv. As chaves viram os cabeçalhos das colunas, cada objeto vira uma linha, e o arquivo abre direto em Excel, Google Sheets ou qualquer script.'
      },
      {
        question: 'O que acontece com objetos aninhados?',
        answer: 'O CSV é plano por natureza — não existe hierarquia dentro de uma célula. Estruturas aninhadas precisam ser achatadas para caber em colunas, o que significa que um JSON profundamente aninhado nem sempre tem uma representação tabular fiel. Arrays de objetos simples, o formato típico de uma resposta de API, convertem sem perda.'
      },
      {
        question: 'E se os objetos tiverem chaves diferentes entre si?',
        answer: 'As colunas do CSV são a união das chaves encontradas, e os objetos que não possuem determinada chave ficam com a célula vazia. Vale conferir o cabeçalho do resultado quando a origem é uma API que omite campos nulos.'
      },
      {
        question: 'Valores com vírgula quebram o arquivo?',
        answer: 'Não. Textos contendo vírgulas, aspas ou quebras de linha são escapados conforme a convenção padrão de CSV, de modo que continuam sendo um campo único quando o arquivo for lido.'
      },
      {
        question: 'Respostas de API são copiadas para algum servidor?',
        answer: 'Não. A conversão acontece na memória do seu navegador, no seu dispositivo. Respostas de API e exportações de banco de dados frequentemente contêm dados pessoais, e nenhum deles é copiado para lugar nenhum.'
      }
    ],
    content: `
      <h2>Do array de objetos para a planilha</h2>
      <p>Um <strong>conversor de json para csv</strong> costuma ser usado no fim de um caminho: você recebeu uma resposta de API ou exportou uma coleção do banco, e agora alguém precisa olhar aquilo em uma planilha. <strong>Converter json para csv</strong> achata o array — as chaves viram cabeçalhos, cada objeto vira uma linha.</p>

      <h2>O limite: hierarquia não cabe em uma tabela</h2>
      <p>Vale dizer isto de forma direta, porque é a frustração mais comum. JSON representa estruturas aninhadas; CSV representa uma grade. Um objeto dentro de outro objeto não tem tradução natural para uma célula. Arrays de objetos simples — o formato típico de uma listagem de API — convertem sem perda; documentos profundamente aninhados exigem decidir antes o que vira coluna.</p>

      <h2>Chaves que variam entre os objetos</h2>
      <p>Quando alguns objetos trazem campos que outros não têm, as colunas resultantes são a união de todas as chaves, e as células ausentes ficam vazias. APIs que omitem campos nulos produzem exatamente esse cenário, então confira o cabeçalho do arquivo gerado.</p>
      <p>Como em todo o site, nada disso passa por um servidor: a conversão acontece dentro do seu navegador.</p>
    `
  },
  {
    en: 'xml-to-json',
    slug: 'xml-para-json',
    name: 'XML para JSON',
    title: 'Converter XML para JSON Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter estruturas XML aninhadas em JSON legível direto no navegador, com XML malformado reportado como erro em vez de saída inválida.',
    headline: 'XML para JSON.',
    subtitle: 'Transforme estruturas XML aninhadas em JSON legível, com erros de sintaxe apontados em vez de ignorados.',
    quickAnswer: 'Para converter XML para JSON, selecione o arquivo .xml na ferramenta acima e baixe a estrutura JSON equivalente, com os elementos mapeados para chaves e os elementos repetidos para arrays. XML malformado é detectado por uma análise real de DOM e reportado como erro, em vez de produzir uma saída inválida — o que torna a ferramenta também uma forma rápida de validar o arquivo. Tudo roda no seu navegador.',
    category: 'Ferramentas para Desenvolvedores',
    faqs: [
      {
        question: 'Como os elementos XML viram JSON?',
        answer: 'Cada elemento vira uma chave. Elementos repetidos com o mesmo nome dentro do mesmo pai viram um array, que é a tradução natural de uma lista em XML. A hierarquia do documento é preservada como objetos aninhados.'
      },
      {
        question: 'O que acontece se o XML estiver malformado?',
        answer: 'O erro é apontado, não ignorado. A leitura usa uma análise real de DOM, então uma tag não fechada ou um caractere inválido interrompe a conversão com uma mensagem, em vez de gerar um JSON silenciosamente incompleto. Na prática, isso faz da ferramenta um validador rápido de XML.'
      },
      {
        question: 'Os atributos XML são preservados?',
        answer: 'Sim. Atributos e conteúdo de texto são ambos representados na estrutura JSON resultante — uma distinção que existe em XML e não em JSON, e que por isso precisa de uma convenção explícita para não se perder.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. A análise do XML e a geração do JSON acontecem no navegador, no seu dispositivo. Arquivos de configuração, respostas SOAP e notas fiscais eletrônicas não são copiados para lugar nenhum.'
      }
    ],
    content: `
      <h2>Dois modelos de dados diferentes</h2>
      <p>Usar um <strong>conversor xml para json</strong> não é uma troca de sintaxe: são modelos distintos. XML separa atributos de conteúdo de texto e permite elementos repetidos com o mesmo nome; JSON tem objetos, arrays e valores, sem noção de atributo. <strong>Converter xml para json</strong> exige, portanto, uma convenção clara — elementos viram chaves, repetições viram arrays, atributos são preservados de forma explícita.</p>

      <h2>Um validador disfarçado de conversor</h2>
      <p>A leitura é feita por uma análise real de DOM, não por manipulação de texto, então um XML malformado falha de forma visível em vez de produzir um resultado parcial. Se o objetivo é apenas descobrir por que um arquivo está sendo recusado por outro sistema, colá-lo aqui costuma responder em segundos.</p>

      <h2>Processamento local</h2>
      <p>Arquivos XML no Brasil frequentemente são notas fiscais eletrônicas, integrações e configurações de sistema — conteúdo que não deveria ser enviado a um serviço qualquer para uma conversão trivial. Aqui tudo acontece dentro do navegador, no seu dispositivo.</p>
    `
  },
  {
    en: 'json-to-xlsx',
    slug: 'json-para-xlsx',
    name: 'JSON para XLSX',
    title: 'Converter JSON para XLSX Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter arrays JSON em planilhas Excel (.xlsx) direto no navegador, com células tipadas prontas para ordenar e filtrar.',
    headline: 'JSON para XLSX.',
    subtitle: 'Transforme um array de objetos JSON em uma planilha Excel pronta para ordenar e filtrar, sem que os dados saiam do seu computador.',
    quickAnswer: 'Para converter JSON para XLSX, selecione um array de objetos JSON na ferramenta acima e baixe uma planilha .xlsx nativa. As chaves dos objetos viram cabeçalhos de coluna e cada objeto vira uma linha, com células tipadas em vez de texto puro, então o arquivo abre pronto para ordenar, filtrar e usar em tabelas dinâmicas. A conversão roda inteiramente no seu navegador.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'Como o JSON vira uma planilha?',
        answer: 'As chaves dos objetos viram os cabeçalhos das colunas e cada objeto do array vira uma linha. O resultado é um .xlsx nativo, que abre no Excel, no Google Sheets e no LibreOffice sem assistente de importação.'
      },
      {
        question: 'As células saem tipadas ou como texto?',
        answer: 'Números são gravados como números e não como texto, então somar, ordenar e criar tabelas dinâmicas funciona imediatamente, sem precisar reconverter coluna por coluna depois de abrir o arquivo.'
      },
      {
        question: 'E se o JSON tiver objetos aninhados?',
        answer: 'Uma planilha é uma grade plana, sem hierarquia dentro da célula. Arrays de objetos simples — o formato típico de uma resposta de API — convertem diretamente. Estruturas profundamente aninhadas precisam ser achatadas antes, porque não existe representação tabular fiel para elas.'
      },
      {
        question: 'Os dados são copiados para algum servidor?',
        answer: 'Não. A leitura do JSON e a montagem da planilha acontecem no seu navegador, no seu dispositivo, e nada é copiado para nenhum servidor.'
      }
    ],
    content: `
      <h2>Quando os dados precisam sair do código e virar planilha</h2>
      <p>Um <strong>conversor json para xlsx</strong> costuma ser necessário no momento em que alguém fora da equipe técnica precisa olhar os dados. <strong>Converter json para xlsx</strong> entrega uma planilha nativa, com cabeçalhos e células tipadas, em vez de um CSV que ainda precisará ser interpretado pelo Excel.</p>

      <h2>Por que .xlsx e não .csv</h2>
      <p>O CSV é texto puro: o Excel precisa adivinhar o separador e a codificação, e é aí que colunas se juntam e acentos viram símbolos. O .xlsx carrega a estrutura e os tipos dentro do próprio arquivo, então abre certo na primeira tentativa — inclusive com acentuação preservada.</p>

      <h2>O limite da tabela</h2>
      <p>Arrays de objetos simples convertem sem perda. Estruturas aninhadas não têm tradução direta para linhas e colunas e precisam ser achatadas antes. E, como em todo o site, os dados são processados dentro do navegador e não são copiados para nenhum servidor.</p>
    `
  }
];

/**
 * ---------------------------------------------------------------------------
 * Keyword-led batch 4 — image formats, 2026-09-24. The strongest set so far.
 * ---------------------------------------------------------------------------
 *
 * `jpg para png`, `webp para png` and `converter webp para png` are Easy at
 * >10,000. Consumer queries rather than office ones, which suits a heavily
 * mobile Brazilian audience.
 *
 * One thing handled carefully: `jpg para png sem fundo` (>100) is NOT targeted,
 * because converting to PNG does not remove a background — a JPG has no alpha
 * channel, so the result is an opaque PNG. Ranking for it would guarantee a
 * bounce. The misconception is common enough to be worth correcting, so
 * jpg-para-png answers it in its own words instead of quoting the query. See
 * `intentMismatch` in ./keywords.ts.
 */
const ptToolsBatch4: PtTool[] = [
  {
    en: 'jpg-to-png',
    slug: 'jpg-para-png',
    name: 'JPG para PNG',
    title: 'Converter JPG para PNG Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter imagens JPG em PNG sem perdas direto no navegador, ideal para edição, capturas de tela e imagens com texto nítido.',
    headline: 'JPG para PNG.',
    subtitle: 'Converta JPG em PNG sem perdas, para editar sem degradar a imagem a cada salvamento — sem que o arquivo saia do seu dispositivo.',
    quickAnswer: 'Para converter JPG para PNG, selecione a imagem na ferramenta acima e baixe um PNG sem perdas. O PNG evita a degradação que o JPG acumula a cada novo salvamento, então é a escolha certa para editar, para capturas de tela e para imagens com texto ou linhas nítidas. Espere um arquivo maior, porque o PNG guarda cada pixel exatamente. A conversão roda inteiramente no seu navegador.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como converter jpg para png',
        answer: 'Arraste a imagem .jpg ou .jpeg para a ferramenta no topo da página e baixe o arquivo .png. Não há cadastro, marca d’água nem limite diário, e a imagem não sai do seu dispositivo.'
      },
      {
        question: 'qual a diferença de jpg para png',
        answer: 'O JPG usa compressão com perdas: ele descarta informação para ficar pequeno, e perde um pouco mais a cada vez que o arquivo é salvo novamente. O PNG é sem perdas — guarda cada pixel exatamente como está — e suporta transparência, que o JPG não tem. Na prática: JPG para fotografias e para reduzir tamanho, PNG para capturas de tela, logotipos, textos e qualquer imagem que ainda será editada.'
      },
      {
        question: 'como mudar a extensão de um arquivo jpg para png',
        answer: 'Renomear o arquivo de .jpg para .png não funciona: a extensão é só o nome, e o conteúdo continua codificado como JPG. Muitos programas recusam o arquivo ou mostram erro. É preciso recodificar a imagem de verdade, que é o que esta ferramenta faz.'
      },
      {
        question: 'Converter para PNG deixa o fundo transparente?',
        answer: 'Não. Essa é a confusão mais comum sobre o formato. O PNG *aceita* transparência, mas um JPG não tem canal de transparência — não existe fundo transparente no arquivo original para ser preservado. O resultado é um PNG com o mesmo fundo opaco de antes. Remover o fundo exige identificar o objeto na imagem, o que é outro tipo de ferramenta.'
      },
      {
        question: 'O arquivo PNG fica maior que o JPG?',
        answer: 'Quase sempre sim, e às vezes várias vezes maior. É o preço de ser sem perdas: o PNG guarda cada pixel em vez de aproximar. Para fotografias a diferença é grande; para capturas de tela e gráficos com poucas cores é bem menor, e o PNG pode até ficar menor que o JPG.'
      },
      {
        question: 'A imagem é copiada para algum servidor?',
        answer: 'Não. A decodificação e a recodificação acontecem no seu navegador, no seu dispositivo. Fotos e capturas de tela não são copiadas para nenhum servidor — o que importa porque imagens carregam metadados como localização e modelo do aparelho.'
      }
    ],
    content: `
      <h2>Por que converter JPG para PNG</h2>
      <p>A razão principal é a degradação acumulada. O JPG é um formato com perdas: cada vez que você abre, edita e salva de novo, um pouco de informação some — e o efeito se acumula, ficando visível como manchas ao redor de textos e bordas. Usar um <strong>conversor de jpg para png</strong> antes de começar a editar congela a imagem no estado atual e evita que ela continue piorando.</p>
      <p><strong>Converter imagem jpg para png</strong> também é o caminho certo quando o arquivo tem texto, linhas finas ou áreas de cor chapada: são exatamente os padrões que a compressão do JPG trata pior.</p>

      <h2>Renomear a extensão não converte nada</h2>
      <p>Trocar o final do nome do arquivo de .jpg para .png não transforma o formato. A extensão é apenas um rótulo; o conteúdo continua codificado como JPG, e programas mais exigentes recusam o arquivo ou acusam erro. <strong>Transformar jpg para png</strong> exige recodificar a imagem de verdade.</p>

      <h2>PNG não significa fundo transparente</h2>
      <p>Vale dizer com clareza, porque é a expectativa mais frustrada: o PNG *aceita* transparência, mas isso não significa que converter para PNG remova o fundo. Um JPG não possui canal de transparência — não há o que preservar. O resultado tem o mesmo fundo de antes, apenas em outro formato. Apagar o fundo é um trabalho de identificação do objeto na imagem, não de conversão.</p>

      <h2>Tudo acontece no seu dispositivo</h2>
      <p>A imagem é decodificada e recodificada dentro do navegador e não é copiada para nenhum servidor. Além da privacidade, isso significa que a ferramenta continua funcionando sem internet depois que a página carrega uma vez.</p>
    `
  },
  {
    en: 'png-to-jpg',
    slug: 'png-para-jpg',
    name: 'PNG para JPG',
    title: 'Converter PNG para JPG Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter imagens PNG em JPG menores direto no navegador, com a transparência achatada sobre fundo branco.',
    headline: 'PNG para JPG.',
    subtitle: 'Reduza o tamanho de uma imagem convertendo PNG em JPG — sem que o arquivo saia do seu dispositivo.',
    quickAnswer: 'Para converter PNG para JPG, selecione a imagem na ferramenta acima e baixe o JPG. As áreas transparentes são achatadas sobre um fundo branco, porque o JPG não tem transparência, e a imagem é comprimida para reduzir o tamanho do arquivo. Escolha JPG para fotografias e para caber em limites de tamanho; mantenha PNG para logotipos e gráficos que precisam de transparência. Nada sai do seu dispositivo.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como converter png para jpg',
        answer: 'Arraste a imagem .png para a ferramenta no topo da página e baixe o .jpg. O arquivo costuma ficar bem menor, o que resolve a maior parte dos casos de formulário ou sistema que recusa uma imagem por tamanho.'
      },
      {
        question: 'qual a diferença de png para jpg',
        answer: 'O PNG é sem perdas e suporta transparência: guarda cada pixel exatamente, e por isso gera arquivos maiores. O JPG usa compressão com perdas e não tem transparência, ficando muito menor em fotografias. Para uma foto, o JPG é quase sempre a escolha certa; para um logotipo com fundo transparente ou uma captura de tela com texto, o PNG é melhor.'
      },
      {
        question: 'como mudar de png para jpg',
        answer: 'Renomear o arquivo não resolve — a extensão é só o nome, e o conteúdo continua sendo um PNG. É necessário recodificar a imagem, que é o que a ferramenta faz. Também não é preciso instalar programa nenhum nem criar conta.'
      },
      {
        question: 'onde converter png para jpg com eficiência',
        answer: 'O critério prático é onde a imagem é processada. Aqui a conversão acontece dentro do seu navegador, então não há fila, nem limite diário, nem espera por rede — a velocidade é a do seu próprio aparelho, e a imagem não é copiada para nenhum servidor. Depois que a página carrega, funciona até sem internet.'
      },
      {
        question: 'qual é melhor para imprimir jpg ou png',
        answer: 'Para fotografias destinadas à impressão, o JPG em alta qualidade é suficiente e é o que a maioria das gráficas aceita sem objeção. Para material com texto, linhas finas, logotipos ou cores chapadas — um cartaz, um convite, um certificado — o PNG imprime mais limpo, porque não introduz os artefatos que a compressão do JPG cria ao redor das bordas. O que importa mais que o formato é a resolução: para impressão, trabalhe em 300 dpi.'
      },
      {
        question: 'para postar no instagram é melhor png ou jpg',
        answer: 'Para fotografias, JPG. O Instagram recomprime tudo o que recebe, então enviar um PNG grande não melhora o resultado final — apenas gasta mais dados no envio. A exceção é conteúdo com texto nítido ou gráficos de cor chapada, como um card ou um infográfico, onde o PNG chega mais limpo e sobrevive melhor à recompressão.'
      },
      {
        question: 'O que acontece com o fundo transparente?',
        answer: 'Ele é achatado sobre branco, porque o JPG não tem como representar transparência. Se a imagem é um logotipo que será usado sobre um fundo colorido, converter para JPG vai deixar um retângulo branco em volta — nesse caso mantenha o PNG, ou converta para WebP, que preserva a transparência e ainda reduz o tamanho.'
      }
    ],
    content: `
      <h2>Quando faz sentido passar de PNG para JPG</h2>
      <p>O motivo mais comum para procurar um <strong>conversor de png para jpg</strong> é tamanho. Capturas de tela e imagens exportadas de programas de design saem em PNG por padrão, e um PNG de fotografia pode ser várias vezes maior que o JPG equivalente. Formulários, sistemas e anexos de e-mail impõem limites, e <strong>converter imagem png para jpg</strong> resolve isso sem que a diferença visual seja perceptível em uma foto.</p>

      <h2>O que você perde: a transparência</h2>
      <p>É a única perda que importa, e ela é definitiva. O JPG não tem canal de transparência, então qualquer área transparente é achatada sobre branco. Para uma fotografia isso não muda nada — não há transparência para perder. Para um logotipo pensado para ficar sobre um fundo colorido, o resultado é um retângulo branco visível em volta. Nesses casos, mantenha o PNG ou considere o WebP, que combina transparência com arquivos pequenos.</p>

      <h2>Renomear não converte</h2>
      <p>Trocar o final do nome do arquivo de .png para .jpg não altera o conteúdo — a imagem continua codificada como PNG e muitos sistemas recusam o arquivo. <strong>Mudar png para jpg</strong> exige recodificação real.</p>

      <h2>Processamento local</h2>
      <p>A conversão acontece no seu navegador, sem fila e sem limite diário, e a imagem não é copiada para nenhum servidor. Isso importa especialmente em imagens: fotos carregam metadados como localização e modelo do aparelho, e capturas de tela carregam o que estava na sua tela.</p>
    `
  },
  {
    en: 'webp-to-png',
    slug: 'webp-para-png',
    name: 'WebP para PNG',
    title: 'Converter WebP para PNG Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter imagens WebP em PNG padrão direto no navegador, com a transparência preservada, para abrir em qualquer programa.',
    headline: 'WebP para PNG.',
    subtitle: 'Transforme imagens WebP em PNG padrão, que abrem em qualquer programa — sem que o arquivo saia do seu dispositivo.',
    quickAnswer: 'Para converter WebP para PNG, selecione a imagem na ferramenta acima e baixe um PNG padrão e sem perdas, que abre em qualquer lugar — inclusive em programas antigos e editores que não reconhecem WebP. A transparência é preservada. Espere um arquivo maior, porque o PNG guarda cada pixel sem a compressão do WebP. Tudo é processado localmente no seu navegador.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como converter imagem webp para png',
        answer: 'Arraste o arquivo .webp para a ferramenta no topo da página e baixe o .png. O resultado é um PNG padrão, sem perdas, que abre no Word, no PowerPoint, em editores antigos e em qualquer sistema que recuse WebP.'
      },
      {
        question: 'Por que tantos programas não abrem WebP?',
        answer: 'O WebP é um formato relativamente recente, criado para a web. Navegadores modernos o exibem sem problema, mas muitos programas de escritório, editores de imagem antigos e sistemas internos de empresas ainda não o reconhecem — motivo pelo qual imagens salvas de sites frequentemente precisam ser convertidas antes de serem usadas.'
      },
      {
        question: 'A transparência é preservada?',
        answer: 'Sim. Tanto o WebP quanto o PNG suportam transparência, então áreas transparentes atravessam a conversão intactas. É uma das vantagens de converter para PNG em vez de JPG, que achataria tudo sobre branco.'
      },
      {
        question: 'A qualidade da imagem piora?',
        answer: 'Não há perda adicional: o PNG é sem perdas e guarda exatamente os pixels que o WebP produziu. Se o WebP de origem já era comprimido com perdas, essa compressão original permanece visível — a conversão não recupera detalhes que já não estavam ali, mas também não degrada nada.'
      },
      {
        question: 'Por que o arquivo PNG fica maior?',
        answer: 'Porque o WebP comprime melhor. O PNG armazena cada pixel sem aproximações, e por isso costuma ficar consideravelmente maior que o WebP equivalente. É o custo de um formato que abre em qualquer lugar.'
      },
      {
        question: 'A imagem é copiada para algum servidor?',
        answer: 'Não. A conversão acontece no seu navegador, no seu dispositivo, e a imagem não é copiada para nenhum servidor.'
      }
    ],
    content: `
      <h2>O formato que o seu programa não abre</h2>
      <p>A busca por um <strong>conversor de webp para png</strong> quase sempre começa do mesmo jeito: você salvou uma imagem de um site, tentou inserir no Word ou em um editor, e o arquivo foi recusado. O WebP é um formato criado para a web e exibido por qualquer navegador moderno, mas muitos programas de escritório e sistemas internos ainda não o reconhecem.</p>
      <p><strong>Converter arquivo webp para png</strong> devolve um formato universal, que qualquer software abre.</p>

      <h2>Nada se perde na conversão</h2>
      <p>O PNG é sem perdas, então a imagem chega exatamente como estava — inclusive a transparência, que ambos os formatos suportam. Se o WebP de origem já era comprimido com perdas, aquela compressão continua visível: a conversão não inventa detalhes que já não existiam, mas também não acrescenta nenhuma degradação nova.</p>

      <h2>O arquivo vai ficar maior</h2>
      <p>É a contrapartida. O WebP existe justamente porque comprime melhor; o PNG guarda cada pixel. Ao passar <strong>de webp para png</strong>, espere um arquivo consideravelmente maior — em troca de abrir em qualquer lugar. Se o destino for a web novamente, o caminho inverso costuma fazer mais sentido.</p>
    `
  },
  {
    en: 'png-to-webp',
    slug: 'png-para-webp',
    name: 'PNG para WebP',
    title: 'Converter PNG para WebP Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter imagens PNG em WebP direto no navegador: 25–35% menores com qualidade equivalente e transparência preservada.',
    headline: 'PNG para WebP.',
    subtitle: 'Reduza o peso das imagens do seu site mantendo a transparência — processado no seu próprio dispositivo.',
    quickAnswer: 'Para converter PNG para WebP, selecione a imagem na ferramenta acima e baixe um WebP normalmente 25–35% menor com qualidade equivalente, com a transparência preservada. O WebP é suportado por todos os navegadores modernos e acelera o carregamento das páginas, o que faz dele a melhor escolha para imagens na web. A conversão roda inteiramente no seu dispositivo.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'Quanto menor fica o arquivo?',
        answer: 'Normalmente entre 25% e 35% menor com qualidade equivalente, embora o ganho varie com o conteúdo da imagem. Fotografias e gráficos complexos costumam render mais; imagens muito simples, com poucas cores, já eram bem comprimidas em PNG e ganham menos.'
      },
      {
        question: 'A transparência é mantida?',
        answer: 'Sim. O WebP suporta canal alfa, então logotipos e imagens com fundo transparente atravessam a conversão intactos — diferentemente do JPG, que achataria tudo sobre branco. É por isso que o WebP costuma substituir o PNG na web sem exigir mudança de layout.'
      },
      {
        question: 'Todos os navegadores exibem WebP?',
        answer: 'Sim, todos os navegadores modernos — Chrome, Firefox, Safari, Edge e seus equivalentes em celular. A ressalva não é o navegador, e sim programas de escritório e editores antigos, que ainda podem recusar o formato. Para imagens destinadas à web isso não é um problema; para um arquivo que será aberto no Word, prefira PNG.'
      },
      {
        question: 'A conversão perde qualidade?',
        answer: 'A redução de tamanho vem de uma compressão mais eficiente, e em uso normal a diferença não é perceptível a olho nu. Ainda assim, é uma recompressão: se a imagem for ser editada repetidamente depois, guarde o PNG original como cópia de trabalho e use o WebP apenas para publicar.'
      },
      {
        question: 'A imagem é copiada para algum servidor?',
        answer: 'Não. A conversão acontece no seu navegador, no seu dispositivo, e a imagem não é copiada para nenhum servidor.'
      }
    ],
    content: `
      <h2>Imagens mais leves sem mudar o visual do site</h2>
      <p>Um <strong>conversor png para webp</strong> costuma entrar em cena quando alguém descobre que as imagens são o que está deixando a página lenta. Em um site comum, imagens representam a maior parte do peso de cada página — e o PNG, por ser sem perdas, é o formato mais pesado de todos.</p>
      <p><strong>Converter imagem png para webp</strong> costuma reduzir de 25% a 35% do tamanho com qualidade equivalente, o que se traduz diretamente em carregamento mais rápido, especialmente em conexões móveis.</p>

      <h2>Transparência preservada</h2>
      <p>É o que diferencia o WebP do JPG nesse papel. Logotipos, ícones e imagens recortadas mantêm o fundo transparente depois da conversão, então nada no layout precisa mudar. Foi essa combinação — arquivos pequenos com canal alfa — que fez o WebP substituir o PNG na web.</p>

      <h2>Onde o WebP ainda não serve</h2>
      <p>Todos os navegadores modernos exibem WebP, mas programas de escritório e editores antigos nem sempre. Se a imagem vai ser inserida em um documento do Word ou enviada a alguém que a abrirá em um editor antigo, o PNG continua sendo a escolha segura. E guarde o PNG original se a imagem ainda for editada: o WebP é excelente para publicar, não para ser reprocessado muitas vezes.</p>
    `
  }
];

/**
 * ---------------------------------------------------------------------------
 * Keyword-led batch 5 — OCR and txt→pdf, 2026-09-24.
 * ---------------------------------------------------------------------------
 *
 * The merge cluster from this batch is NOT here: `juntar pdf`, `unir pdf` and
 * `mesclar pdf` are three words for one tool, so they strengthened the existing
 * /pt/juntar-pdf/ above rather than becoming three competing pages. Same
 * reasoning applies here — `imagem para texto`, `extrair texto de imagem` and
 * `converter imagem em texto` are one tool and get one page.
 *
 * `traduzir imagem para texto` (>100) is deliberately not a heading: "traduzir"
 * can mean translate between languages, which OCR does not do. See
 * `ambiguousIntent` in ./keywords.ts.
 */
const ptToolsBatch5: PtTool[] = [
  {
    en: 'image-to-text',
    slug: 'imagem-para-texto',
    name: 'Imagem para Texto',
    title: 'Converter Imagem em Texto Online Grátis — OCR 100% Privado | ConvertOcean',
    description: 'Transformar imagem em texto com OCR direto no navegador: fotos, capturas de tela e documentos digitalizados viram texto editável. A imagem não sai do seu dispositivo.',
    headline: 'Imagem para Texto.',
    subtitle: 'Extraia o texto de fotos, capturas de tela e documentos digitalizados — o reconhecimento acontece no seu próprio aparelho.',
    quickAnswer: 'Para converter ou transformar imagem em texto, selecione um JPG, PNG ou WebP na ferramenta acima: o mecanismo de OCR reconhece o texto impresso e devolve texto editável e copiável, dentro do seu navegador. Imagens nítidas e em boa resolução, com texto impresso, dão a melhor precisão; texto manuscrito é bem menos confiável. Nenhuma imagem sai do seu dispositivo.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como transformar imagem em texto',
        answer: 'Selecione a foto ou captura de tela na ferramenta acima e espere o reconhecimento terminar — o texto aparece pronto para copiar, editar ou baixar como .txt. “Transformar” e “converter” descrevem a mesma coisa aqui: o OCR lê as letras da imagem e devolve os caracteres, sem aplicativo e sem enviar a imagem para lugar nenhum.'
      },
      {
        question: 'como transformar imagem em texto no word',
        answer: 'O Word não faz isso sozinho com uma imagem colada: ela continua sendo imagem. O caminho é extrair o texto aqui, copiar e colar no Word — de preferência com “Manter Somente Texto”, porque a formatação da imagem não é reconstruída. Depois aplique os estilos no próprio Word.'
      },
      {
        question: 'como converter imagem em texto',
        answer: 'Arraste a imagem para a ferramenta no topo da página e aguarde o reconhecimento. O texto aparece em uma caixa, pronto para copiar ou baixar. Funciona com JPG, PNG e WebP, e não exige cadastro nem instalação.'
      },
      {
        question: 'como extrair texto de uma imagem',
        answer: 'A precisão depende quase inteiramente da imagem de origem. Texto impresso, nítido, alinhado e com bom contraste é reconhecido com alta fidelidade. O que atrapalha: foto tremida, iluminação irregular, sombra sobre a página, texto muito pequeno ou fotografado em ângulo. Se o resultado vier ruim, refotografe a página de frente, com boa luz, antes de tentar de novo.'
      },
      {
        question: 'como converter imagem em texto editável',
        answer: 'O resultado já é texto editável, não uma imagem: dá para copiar, corrigir, colar em qualquer editor e pesquisar dentro dele. O que não é recuperado é a formatação visual — negrito, fontes, colunas e tabelas não atravessam o reconhecimento. O OCR devolve as palavras, não o design da página.'
      },
      {
        question: 'como converter texto de imagem para word',
        answer: 'Extraia o texto aqui, copie o resultado e cole em um documento do Word. Como a formatação original não é preservada, o mais prático é colar como texto sem formatação e aplicar os estilos depois. Se o material de origem for um PDF digitalizado inteiro, extraia página por página.'
      },
      {
        question: 'como transcrever uma imagem para texto',
        answer: 'A transcrição funciona bem com texto impresso — livros, documentos, placas, capturas de tela, notas fiscais. Texto manuscrito é significativamente menos confiável: letra cursiva, em especial, costuma sair com muitos erros. Para manuscritos, conte com uma revisão manual do resultado.'
      },
      {
        question: 'aplicativo que converte imagem para texto',
        answer: 'Não é preciso instalar aplicativo nenhum. A ferramenta funciona no navegador do celular exatamente como no computador, inclusive com fotos tiradas na hora, e a imagem continua sem sair do aparelho. Depois do primeiro reconhecimento, que baixa o modelo de idioma, ela também funciona sem internet.'
      },
      {
        question: 'programa que converte imagem para texto',
        answer: 'Também não é preciso instalar programa no computador. Todo o reconhecimento roda dentro do navegador, o que significa nenhuma instalação, nenhuma licença e nenhum envio do arquivo para um servidor — a velocidade é a do seu próprio processador.'
      },
      {
        question: 'A imagem é copiada para algum servidor?',
        answer: 'Não. O reconhecimento acontece na memória do seu navegador, no seu dispositivo. Isso importa particularmente aqui: as imagens que as pessoas passam por OCR costumam ser documentos, notas fiscais, contratos e recibos — e elas ainda carregam metadados como localização e modelo do aparelho.'
      }
    ],
    content: `
      <h2>O que o OCR faz — e o que ele não faz</h2>
      <p>Para <strong>transformar imagem em texto</strong>, a ferramenta precisa ler as letras que estão desenhadas nos pixels. Um <strong>conversor de imagem para texto</strong> usa reconhecimento óptico de caracteres: o programa examina os pixels, identifica as formas das letras e devolve os caracteres correspondentes. É o que permite <strong>extrair texto de imagem</strong> sem redigitar nada.</p>
      <p>O que ele devolve são as palavras. A <strong>transcrição de imagem para texto</strong> não recupera negrito, fontes, colunas ou tabelas — essa informação visual não é reconstruída, e o resultado é texto corrido pronto para editar.</p>

      <h2>A qualidade da foto decide o resultado</h2>
      <p>É o fator que mais pesa, muito acima de qualquer configuração. Texto impresso, nítido, de frente e com bom contraste é reconhecido com alta precisão. Foto tremida, sombra atravessando a página, texto pequeno ou fotografado em ângulo derrubam a taxa de acerto rapidamente. Se o resultado vier ruim, quase sempre vale mais refotografar do que corrigir o texto.</p>
      <p>Texto manuscrito é o limite conhecido: letra de forma sai razoável, cursiva costuma sair com muitos erros. Conte com revisão.</p>

      <h2>Sem aplicativo, sem instalação, sem servidor</h2>
      <p>Um <strong>leitor de imagem para texto</strong> que funciona no navegador dispensa instalar aplicativo no celular ou programa no computador. E, principalmente, dispensa mandar a imagem para algum lugar: o reconhecimento acontece no seu aparelho. Notas fiscais, contratos e documentos digitalizados não são copiados para nenhum servidor.</p>
    `
  },
  {
    en: 'txt-to-pdf',
    slug: 'txt-para-pdf',
    name: 'TXT para PDF',
    title: 'Converter TXT para PDF Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converter arquivos de texto (.txt) em PDF paginado direto no navegador, com texto selecionável e layout monoespaçado.',
    headline: 'TXT para PDF.',
    subtitle: 'Transforme anotações, logs e código em um PDF paginado e compartilhável — sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter TXT para PDF, selecione o arquivo .txt na ferramenta acima e baixe um PDF limpo e paginado, com texto selecionável em layout monoespaçado. Linhas longas quebram automaticamente e o conteúdo flui entre as páginas, então anotações, logs e código viram um documento fácil de compartilhar. O arquivo é gerado no seu navegador e não sai do seu computador.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'como converter txt para pdf',
        answer: 'Arraste o arquivo .txt para a ferramenta no topo da página e baixe o PDF. A paginação é automática e o texto continua selecionável no resultado, então dá para copiar trechos e pesquisar dentro do documento.'
      },
      {
        question: 'Por que o texto sai em fonte monoespaçada?',
        answer: 'Porque arquivos .txt costumam depender do alinhamento por espaços: logs, saídas de terminal, tabelas improvisadas e código só ficam legíveis se cada caractere ocupar a mesma largura. Uma fonte proporcional desalinharia tudo. Para texto corrido comum, a diferença é apenas estética.'
      },
      {
        question: 'O que acontece com linhas muito longas?',
        answer: 'Elas quebram automaticamente para caber na largura da página, em vez de serem cortadas na margem. Nenhum conteúdo é perdido — uma linha de log de 300 caracteres aparece inteira, distribuída em várias linhas visuais.'
      },
      {
        question: 'Acentos e caracteres especiais aparecem corretamente?',
        answer: 'Sim, para arquivos em UTF-8, que é o padrão atual. Arquivos antigos salvos em outra codificação podem exibir caracteres trocados — nesse caso, reabra o .txt em um editor, salve como UTF-8 e converta de novo.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. O PDF é montado dentro do seu navegador, no seu dispositivo, e o arquivo não é copiado para nenhum servidor. Logs de sistema e anotações internas não saem da sua máquina.'
      }
    ],
    content: `
      <h2>Quando um arquivo de texto precisa virar documento</h2>
      <p>Procurar um <strong>conversor de txt para pdf</strong> costuma significar que o conteúdo precisa ser enviado, anexado ou impresso, e o .txt não serve para isso: ele não tem páginas, não tem margens e abre diferente em cada programa. <strong>Converter arquivo txt para pdf</strong> dá ao texto uma forma fixa, que chega igual a quem receber.</p>

      <h2>Layout monoespaçado, de propósito</h2>
      <p>Arquivos de texto frequentemente dependem do alinhamento por espaços — logs, saídas de terminal, código, tabelas montadas com espaçamento manual. Uma fonte proporcional destruiria esse alinhamento. Por isso o PDF usa uma fonte monoespaçada, em que cada caractere ocupa a mesma largura e as colunas continuam alinhadas.</p>

      <h2>Nada é cortado</h2>
      <p>Linhas longas quebram para caber na largura da página em vez de desaparecerem na margem, e o conteúdo flui automaticamente entre as páginas. O texto do PDF permanece selecionável e pesquisável, então o documento continua sendo útil como fonte, não apenas como imagem do arquivo original.</p>
      <p>Tudo isso acontece dentro do navegador: <strong>passar de txt para pdf</strong> não envolve copiar o arquivo para servidor nenhum.</p>
    `
  }
];

/**
 * ---------------------------------------------------------------------------
 * Keyword-led batch 6 — split, 2026-09-24.
 * ---------------------------------------------------------------------------
 *
 * The compress half of this batch is not here: `compactar`, `comprimir` and
 * `diminuir` are one tool, so they strengthened /pt/comprimir-pdf/ above.
 * Split has FOUR synonyms — dividir, separar, quebrar, extrair páginas — and
 * gets one page, slugged on `dividir pdf`.
 *
 * `dividir pdf` and `separar pdf` are both Easy at >100K: the softest
 * high-volume SERP found anywhere in this programme, and a striking contrast
 * with merge, where every head term came back Hard.
 *
 * "Quebrar" is shared with password cracking (`como quebrar senha de pdf`).
 * The split sense is targeted; the password sense is not, and the page says
 * plainly that it does not remove protection. See `passwordIntent`.
 */
const ptToolsBatch6: PtTool[] = [
  {
    en: 'split-pdf',
    slug: 'dividir-pdf',
    name: 'Dividir PDF',
    title: 'Dividir PDF Online Grátis — Separar Páginas | ConvertOcean',
    description: 'Dividir PDF em partes, separar páginas ou extrair apenas as que você precisa, direto no navegador. O arquivo não sai do seu computador.',
    headline: 'Dividir PDF.',
    subtitle: 'Separe páginas, corte o documento em partes iguais ou limite cada parte por tamanho — sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para dividir um PDF, selecione o arquivo na ferramenta acima e escolha o que deve sair: um PDF com as páginas que você marcar, um arquivo separado para cada página (entregue em ZIP), o documento inteiro cortado em um número de partes iguais, ou partes que fiquem abaixo de um tamanho definido em MB. As miniaturas permitem escolher as páginas clicando. Tudo acontece no seu navegador e o arquivo não sai do seu computador.',
    category: 'Ferramentas PDF',
    faqs: [
      {
        question: 'como separar paginas pdf',
        answer: 'Arraste o PDF para a ferramenta e clique nas miniaturas das páginas que você quer. O resultado é um PDF contendo apenas as páginas marcadas, na ordem original. É o caminho para tirar uma procuração de dentro de um contrato ou uma página de assinatura de um documento longo.'
      },
      {
        question: 'como dividir pdf',
        answer: 'Há quatro saídas possíveis, e você escolhe antes de baixar: um PDF só com as páginas selecionadas; um arquivo separado para cada página, entregue em ZIP; o documento cortado em um número de partes iguais; ou partes que respeitem um limite de tamanho em MB que você define.'
      },
      {
        question: 'como dividir um pdf',
        answer: 'Selecione o arquivo e as miniaturas de todas as páginas aparecem na tela. A partir daí é uma questão de clicar: marque as que devem sair juntas, ou escolha uma das divisões automáticas. Nada é alterado no arquivo original — a ferramenta gera documentos novos.'
      },
      {
        question: 'como separar paginas de um pdf',
        answer: 'Clique nas miniaturas das páginas desejadas. Elas podem ser não consecutivas: marcar as páginas 1, 4 e 9 gera um único PDF com essas três, na ordem do documento original. Para separar cada página em um arquivo próprio, use a opção que entrega tudo em ZIP.'
      },
      {
        question: 'como dividir pdf em partes',
        answer: 'Escolha em quantas partes iguais o documento deve ser cortado e a divisão é feita automaticamente, respeitando os limites de página. Se o critério for tamanho em vez de quantidade, há a opção de definir um limite em MB e deixar a ferramenta calcular onde cortar — útil quando cada anexo precisa caber em um limite de envio.'
      },
      {
        question: 'como dividir um pdf em dois',
        answer: 'Use a divisão em partes iguais com duas partes, ou selecione manualmente as páginas de cada metade e baixe duas vezes. A segunda opção é a certa quando o corte não fica exatamente no meio — por exemplo, separar um contrato dos seus anexos.'
      },
      {
        question: 'como separar documentos em pdf',
        answer: 'Quando vários documentos foram digitalizados em um arquivo só — RG, comprovante e diploma em sequência —, marque as páginas de cada um e baixe separadamente, ou use a opção de um arquivo por página e depois recomponha o que precisar em <a href="/pt/juntar-pdf/">juntar PDF</a>.'
      },
      {
        question: 'como quebrar pdf',
        answer: 'Dividir, separar e quebrar são a mesma operação, e esta página faz as três. Vale um esclarecimento: "quebrar" às vezes é usado no sentido de remover a senha de um PDF protegido, e isso a ferramenta não faz. Aqui se trata de dividir um documento em partes ou páginas.'
      },
      {
        question: 'onde dividir documentos pdf facilmente',
        answer: 'O critério prático é onde o documento é processado. Aqui a divisão acontece dentro do seu navegador: não há fila, cadastro, limite diário nem espera de rede, e o arquivo não é copiado para nenhum servidor. Contratos e documentos pessoais permanecem no seu dispositivo, e depois que a página carrega a ferramenta funciona até sem internet.'
      }
    ],
    content: `
      <h2>Dividir, separar ou quebrar: a mesma operação</h2>
      <p>Os três termos descrevem a mesma coisa, e esta página atende às três buscas. Se você procurou <strong>separar pdf</strong>, <strong>quebrar pdf</strong> ou <strong>extrair paginas de pdf</strong>, chegou ao lugar certo — muda apenas a palavra que cada pessoa usa.</p>

      <h2>Quatro formas de dividir, escolhidas por você</h2>
      <p>A ferramenta não impõe um único comportamento. Você pode extrair apenas as páginas que marcar nas miniaturas; gerar um arquivo por página, entregue em ZIP; cortar o documento em um número de partes iguais; ou — o caso que costuma ser mais difícil de encontrar — pedir <strong>dividir pdf por tamanho</strong>, definindo um limite em MB para que cada parte caiba no envio.</p>

      <h2>Páginas não precisam ser consecutivas</h2>
      <p>Ao <strong>separar pdf por paginas</strong>, marcar 1, 4 e 9 devolve um único PDF com essas três, na ordem original. É o que resolve casos como tirar a procuração de dentro de um processo ou isolar as páginas assinadas de um contrato.</p>

      <h2>O que esta ferramenta não faz</h2>
      <p>"Quebrar" também é usado no sentido de remover a senha de um documento protegido. Isso não é feito aqui. A proteção de um PDF existe por um motivo, e um site cuja premissa é a privacidade dos seus documentos não faria sentido oferecendo o contrário.</p>

      <h2>Documentos que não saem do seu computador</h2>
      <p>A divisão é feita pelo navegador, no seu dispositivo. Processos, contratos e documentos pessoais — exatamente o material que mais se precisa dividir — não são copiados para nenhum servidor.</p>
    `
  }
];

/**
 * ---------------------------------------------------------------------------
 * Keyword-led batch 7 — the Office compressors, 2026-09-24.
 * ---------------------------------------------------------------------------
 *
 * Completion pages: `comprimir word` at >1000 is the only term here above a few
 * hundred. Built because the locale should be whole, not because these will
 * drive traffic.
 *
 * The batch mattered for what it ruled OUT. `diminuir` means compress for a PDF
 * and SUBTRACT in a spreadsheet, so the `diminuir excel` cluster is spreadsheet
 * maths and is not targeted — see `wrongTool` in ./keywords.ts. One query was
 * rescued from it, `planilha excel muito pesada como diminuir`, because it
 * states the file-size intent outright.
 *
 * Each page describes what its own engine actually does, and they differ: Word
 * and PowerPoint re-encode oversized pictures, while Excel mostly strips empty
 * formatted cells. Writing one shared "we compress your file" answer across the
 * three would be wrong on Excel, which is where the biggest reductions come
 * from something most people have never heard of.
 */
const ptToolsBatch7: PtTool[] = [
  {
    en: 'compress-word',
    slug: 'comprimir-word',
    name: 'Comprimir Word',
    title: 'Comprimir Word Online Grátis — Reduzir DOCX | ConvertOcean',
    description: 'Reduza o tamanho de um documento Word (.docx) direto no navegador, recomprimindo apenas as imagens grandes demais. Texto e formatação ficam intactos.',
    headline: 'Comprimir Word.',
    subtitle: 'Reduza um .docx recomprimindo apenas as imagens guardadas maiores do que a página mostra — texto, estilos e tabelas continuam idênticos.',
    quickAnswer: 'Para comprimir um documento Word, solte o .docx na ferramenta acima e ele é reduzido na hora. Um .docx é um arquivo ZIP, e quando fica grande demais quase sempre a causa são as imagens: uma captura de tela de um monitor de alta resolução pode ter 3.840 pixels de largura e vários megabytes, exibida em quinze centímetros na página. Texto, estilos, tabelas e alterações controladas permanecem exatamente como estavam.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'como comprimir arquivo word',
        answer: 'Solte o .docx na ferramenta no topo da página e a redução acontece imediatamente. Se você precisa chegar a um tamanho específico, use a opção de definir um limite e informe o valor — a ferramenta procura o ajuste mais suave que ainda fique abaixo dele.'
      },
      {
        question: 'como compactar arquivo word',
        answer: 'Comprimir e compactar são a mesma coisa aqui. Vale saber que um .docx já é internamente um arquivo ZIP: colocá-lo dentro de outro ZIP não reduz praticamente nada, porque o conteúdo já está comprimido. O ganho real vem de tratar as imagens guardadas dentro do documento.'
      },
      {
        question: 'como compactar imagens no word',
        answer: 'O Word tem um recurso próprio para isso — selecione a imagem, vá em Formato da Imagem e use Compactar Imagens. O problema é que ele precisa ser acionado manualmente e é fácil esquecer de aplicar a todas. Esta ferramenta faz o mesmo automaticamente em todo o documento: procura imagens guardadas em resolução maior do que a página exibe e as reencoda no tamanho útil.'
      },
      {
        question: 'o que é compactar imagem no word',
        answer: 'É reduzir a resolução em que a imagem fica armazenada dentro do documento, para a resolução em que ela é de fato exibida. Uma foto de celular de 4.000 pixels colocada em uma caixa de dez centímetros continua guardada inteira no arquivo — o Word não descarta o excesso sozinho. Compactar é descartar essa diferença invisível, e é de onde vem quase toda a redução.'
      },
      {
        question: 'O texto ou a formatação mudam?',
        answer: 'Não. Texto, estilos, tabelas, cabeçalhos e alterações controladas permanecem exatamente como estavam — apenas as imagens são reencodadas. O documento continua editável no Word normalmente, e não há conversão de formato envolvida.'
      },
      {
        question: 'O documento é copiado para algum servidor?',
        answer: 'Não. A compressão acontece dentro do seu navegador, no seu dispositivo, e o arquivo não é copiado para nenhum servidor. Contratos, minutas e documentos internos permanecem com você.'
      }
    ],
    content: `
      <h2>Por que um .docx fica gigante</h2>
      <p>Quem procura <strong>compactar word</strong> quase sempre tem o mesmo problema: um documento de poucas páginas que pesa dezenas de megabytes e não passa no anexo de e-mail. A causa raramente é o texto — texto é minúsculo. São as imagens.</p>
      <p>Uma captura de tela de um monitor moderno tem quase 4.000 pixels de largura. Colada em um documento e reduzida visualmente a quinze centímetros, ela continua armazenada inteira: o Word guarda a imagem original e apenas a exibe menor. Multiplique por uma dezena de prints e o arquivo estoura.</p>

      <h2>O que a ferramenta faz</h2>
      <p>Ela procura exatamente essas imagens — as guardadas em resolução maior do que a página jamais mostra — e as reencoda no tamanho útil. Texto, estilos, tabelas e alterações controladas não são tocados. Para <strong>compactar word para 10mb</strong> ou qualquer outro limite, há a opção de informar o alvo e deixar a ferramenta encontrar o ajuste mais suave que cabe nele.</p>

      <h2>Colocar em ZIP não resolve</h2>
      <p>Um .docx já é um arquivo ZIP por dentro. Compactá-lo de novo em outro ZIP reduz quase nada, porque o conteúdo já está comprimido — é uma tentativa comum e frustrante. A redução só vem de mexer no que está dentro.</p>

      <h2>Processamento local</h2>
      <p>Tudo acontece no navegador, no seu dispositivo, e o documento não é copiado para nenhum servidor.</p>
    `
  },
  {
    en: 'compress-powerpoint',
    slug: 'comprimir-powerpoint',
    name: 'Comprimir PowerPoint',
    title: 'Comprimir PowerPoint Online Grátis — Reduzir PPTX | ConvertOcean',
    description: 'Reduza apresentações PowerPoint (.pptx) em 40–80% direto no navegador, recomprimindo apenas as imagens. Texto, layouts e animações ficam intactos.',
    headline: 'Comprimir PowerPoint.',
    subtitle: 'Reduza um .pptx recomprimindo apenas as imagens guardadas maiores do que o slide mostra — texto, layouts, anotações e animações continuam iguais.',
    quickAnswer: 'Para comprimir uma apresentação, solte o .pptx na ferramenta acima e a redução acontece na hora — normalmente de 40% a 80% em apresentações com muitas fotos, porque imagens coladas ficam guardadas na resolução original da câmera e são exibidas em uma caixa de poucos centímetros. Para chegar a um limite específico, use a opção de definir o tamanho. Texto, layouts, anotações e animações permanecem exatamente como estavam.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'como comprimir powerpoint',
        answer: 'Solte o .pptx na ferramenta no topo da página e a redução é imediata. Em apresentações com muitas fotos a queda costuma ficar entre 40% e 80%. Para um limite específico, informe o tamanho desejado e a ferramenta procura o ajuste mais suave que ainda caiba nele.'
      },
      {
        question: 'como comprimir ppt',
        answer: 'A ferramenta trabalha com .pptx. Arquivos .ppt antigos, do formato binário anterior a 2007, precisam ser abertos no PowerPoint ou no LibreOffice e salvos como .pptx primeiro — o formato antigo não pode ser lido dentro de um navegador.'
      },
      {
        question: 'Os slides mudam de aparência?',
        answer: 'Não. Texto, layouts, cores do tema, anotações do apresentador e animações permanecem exatamente como estavam — apenas as imagens são reencodadas, e só aquelas guardadas em resolução maior do que o slide exibe. A apresentação continua totalmente editável.'
      },
      {
        question: 'Por que a apresentação ficou tão pesada?',
        answer: 'Quase sempre por fotos coladas direto da câmera ou do celular. Uma imagem de 4.000 pixels colocada em uma caixa de dez centímetros continua guardada inteira dentro do arquivo: o PowerPoint apenas a exibe menor, sem descartar o excesso. Vinte fotos assim transformam uma apresentação simples em dezenas de megabytes.'
      },
      {
        question: 'A apresentação é copiada para algum servidor?',
        answer: 'Não. A compressão acontece no seu navegador, no seu dispositivo. Propostas comerciais e apresentações internas não são copiadas para nenhum servidor.'
      }
    ],
    content: `
      <h2>O peso está nas fotos, não nos slides</h2>
      <p>Uma apresentação que não cabe no e-mail quase nunca é longa demais — ela tem fotos grandes demais. Ao usar um <strong>conversor de comprimir powerpoint</strong>, o ganho vem de um detalhe pouco conhecido: o PowerPoint guarda cada imagem na resolução original em que ela foi colada, mesmo que o slide a exiba em uma caixa de poucos centímetros.</p>
      <p>Uma foto de celular de 4.000 pixels exibida em dez centímetros carrega muitas vezes mais dados do que a tela jamais mostra. É por isso que a redução em apresentações cheias de imagens costuma ficar entre 40% e 80%.</p>

      <h2>Nada além das imagens é alterado</h2>
      <p>Texto, layouts, cores do tema, anotações do apresentador e animações ficam exatamente como estavam. O arquivo continua sendo um .pptx editável — não há conversão de formato nem achatamento de slides.</p>

      <h2>Para um limite específico</h2>
      <p>Se o destino exige um tamanho máximo, informe o valor e a ferramenta procura o ajuste mais suave que ainda fique abaixo dele, em vez de comprimir ao máximo e degradar mais do que o necessário.</p>

      <h2>.ppt antigo precisa de um passo antes</h2>
      <p>O formato binário .ppt não é legível dentro de um navegador. Abra no PowerPoint ou no LibreOffice, salve como .pptx e comprima em seguida.</p>
    `
  },
  {
    en: 'compress-excel',
    slug: 'comprimir-excel',
    name: 'Comprimir Excel',
    title: 'Comprimir Excel Online Grátis — Reduzir Planilha XLSX | ConvertOcean',
    description: 'Reduza planilhas Excel pesadas direto no navegador. A maior parte do peso são células vazias formatadas, não imagens — e é isso que a ferramenta remove.',
    headline: 'Comprimir Excel.',
    subtitle: 'Planilhas gigantes quase nunca estão cheias de dados — estão cheias de células vazias com formatação. É isso que a ferramenta remove.',
    quickAnswer: 'Para comprimir uma planilha, solte o .xlsx na ferramenta acima e a redução acontece na hora. O excesso de tamanho em planilhas normalmente não vem de imagens: vem de linhas e colunas depois do fim dos seus dados que carregam um preenchimento ou uma borda e mais nada — o que acontece quando se seleciona colunas inteiras e se aplica formatação. O Excel guarda cada uma dessas células vazias, e uma pasta com 200 linhas de dados pode ocupar 15 MB.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'planilha excel muito pesada como diminuir',
        answer: 'Solte o arquivo na ferramenta e a redução é imediata. O motivo de a planilha estar pesada quase sempre é o mesmo: em algum momento alguém selecionou colunas ou linhas inteiras e aplicou uma cor, uma borda ou um formato. O Excel passa a guardar cada célula vazia atingida, e o intervalo utilizado do arquivo se estende a milhares de linhas sem nenhum dado. É isso que é removido.'
      },
      {
        question: 'como compactar excel',
        answer: 'Comprimir e compactar são a mesma operação aqui. Vale notar que um .xlsx já é internamente um arquivo ZIP — colocá-lo dentro de outro ZIP não reduz praticamente nada. A redução real vem de limpar o intervalo utilizado e de reencodar imagens guardadas maiores do que a planilha exibe.'
      },
      {
        question: 'Meus dados ou fórmulas são alterados?',
        answer: 'As células com conteúdo — valores, fórmulas e a formatação delas — são preservadas. O que sai são células vazias que carregavam apenas formatação, fora do intervalo dos seus dados. Ainda assim, confira o resultado antes de substituir o original: a redução não é uma operação sem perdas, e a página oferece a escolha de quanto remover.'
      },
      {
        question: 'Por que uma planilha pequena ocupa 15 MB?',
        answer: 'Porque o tamanho do arquivo não acompanha a quantidade de dados, e sim o intervalo utilizado. Selecionar a coluna A inteira e pintá-la de amarelo marca mais de um milhão de células como formatadas. O Excel grava todas, embora estejam vazias. É a causa mais comum de planilhas absurdamente grandes, e quase ninguém a conhece.'
      },
      {
        question: 'A planilha é copiada para algum servidor?',
        answer: 'Não. Toda a leitura e a reescrita acontecem no seu navegador, no seu dispositivo. Folhas de pagamento, tabelas de preços e listas de clientes não são copiadas para nenhum servidor.'
      }
    ],
    content: `
      <h2>Planilhas pesadas raramente estão cheias de dados</h2>
      <p>Esta é a diferença entre <strong>comprimir excel</strong> e comprimir qualquer outro arquivo do Office. Em um Word ou num PowerPoint, o peso está nas imagens. Em uma planilha, quase sempre está em células vazias.</p>
      <p>O mecanismo é simples e pouco conhecido: quando alguém seleciona uma coluna inteira e aplica uma cor, uma borda ou um formato de número, o Excel passa a considerar formatadas todas as células daquela coluna — mais de um milhão delas — e grava cada uma no arquivo. Uma pasta de trabalho com 200 linhas de dados reais pode chegar a 15 MB desse jeito.</p>

      <h2>O que é removido</h2>
      <p>A limpeza corta o intervalo utilizado de volta ao ponto onde os seus dados realmente terminam, e reencoda imagens guardadas maiores do que a planilha exibe. Valores, fórmulas e a formatação das células que contêm conteúdo são preservados.</p>
      <p>A operação não é sem perdas, e a página deixa essa escolha explícita em vez de escondê-la. Confira o resultado antes de substituir o arquivo original.</p>

      <h2>Colocar em ZIP não adianta</h2>
      <p>Um .xlsx já é um ZIP internamente. Compactá-lo novamente rende quase nada — a redução precisa vir de dentro do arquivo.</p>

      <h2>Seus números não saem do computador</h2>
      <p>Planilhas concentram o que uma operação tem de mais sensível. Aqui a leitura e a reescrita acontecem dentro do navegador, e nada é copiado para nenhum servidor.</p>
    `
  }
];

/**
 * ---------------------------------------------------------------------------
 * Keyword-led batch 8 — the business tools, 2026-09-24.
 * ---------------------------------------------------------------------------
 *
 * The batch that changed how the remaining tools should be named. `gerador de
 * recibos` is <100. `modelo de recibo` is EASY at >10,000. Same tool, same job,
 * a hundred times the demand — because Brazilians search for a MODEL, not a
 * GENERATOR. The slugs here follow the job, not the English tool name.
 *
 * Nothing on these pages claims to produce a nota fiscal. That is a regulated
 * electronic document issued through SEFAZ; a generated PDF is not one and
 * never becomes one. /pt/modelo-de-fatura/ says so plainly, because a MEI who
 * thinks a website issued their nota fiscal has a tax problem. See
 * `regulatedDocument` and `fraudIntent` in ./keywords.ts.
 */
const ptToolsBatch8: PtTool[] = [
  {
    en: 'receipt-generator',
    slug: 'modelo-de-recibo',
    name: 'Modelo de Recibo',
    title: 'Modelo de Recibo Online Grátis — Preencher e Baixar em PDF | ConvertOcean',
    description: 'Preencha um modelo de recibo de pagamento, prestação de serviço, aluguel ou compra e venda e baixe em PDF. Seus dados não saem do seu computador.',
    headline: 'Modelo de Recibo.',
    subtitle: 'Preencha os dados, veja o recibo pronto na hora e baixe em PDF — sem cadastro e sem que nada saia do seu computador.',
    quickAnswer: 'Para fazer um recibo, preencha na ferramenta acima os dados de quem recebe, de quem paga, o valor, a forma de pagamento e a descrição do que foi pago, e baixe o recibo em PDF no tamanho A4. Diferente da fatura, que pede o pagamento, o recibo confirma que ele já foi feito. Tudo é gerado dentro do seu navegador: valores, nomes e dados de clientes não saem do seu dispositivo.',
    category: 'Ferramentas Empresariais',
    faqs: [
      {
        question: 'como emitir recibo',
        answer: 'Preencha os campos na ferramenta acima — quem recebeu, quem pagou, valor, data, forma de pagamento e a que se refere — e baixe o PDF. O recibo aparece pronto na tela enquanto você digita, então dá para conferir antes de gerar. Não é preciso cadastro nem instalar nada.'
      },
      {
        question: 'como emitir um recibo de pagamento',
        answer: 'Um recibo de pagamento precisa de cinco coisas para ter validade prática: identificação de quem recebeu (nome e CPF ou CNPJ), identificação de quem pagou, o valor em números e por extenso, a descrição do que foi pago e a data. A ferramenta pede todos esses campos. Guarde uma cópia: o recibo é a prova de quem pagou, e a segunda via costuma ser cobrada justamente por quem pagou.'
      },
      {
        question: 'como emitir um recibo',
        answer: 'Recibo simples, de aluguel, de prestação de serviço ou de compra e venda seguem a mesma estrutura — o que muda é a descrição do que foi pago. Descreva com precisão: "aluguel referente a setembro de 2026" vale mais do que "pagamento". Uma descrição vaga é o que torna um recibo inútil em uma discussão posterior.'
      },
      {
        question: 'como emitir recibo de compra e venda',
        answer: 'Em uma compra e venda, o recibo deve identificar o bem com clareza — modelo, número de série, placa, o que for aplicável — além do valor e das partes. É esse detalhe que liga o pagamento ao objeto específico. Para bens com registro, como veículos, o recibo não substitui a transferência oficial: ele comprova o pagamento, não a propriedade.'
      },
      {
        question: 'como emitir recibo mei',
        answer: 'O MEI pode emitir recibo normalmente, mas atenção à diferença: recibo não substitui nota fiscal. Para vendas a pessoa jurídica, o MEI é obrigado a emitir nota fiscal, que sai pelo sistema da prefeitura ou pelo portal do Simples Nacional. O recibo serve para registrar pagamentos em situações que não exigem nota, e como comprovante complementar.'
      },
      {
        question: 'como emitir recibo de pagamento autônomo',
        answer: 'O profissional autônomo usa o recibo para comprovar o pagamento recebido, com a descrição do serviço e o período. Quando o pagador é pessoa jurídica, geralmente há retenções na fonte — vale registrar o valor bruto, as retenções e o líquido na descrição, para que o documento bata com o que foi efetivamente pago.'
      },
      {
        question: 'como criar recibo online',
        answer: 'A ferramenta funciona inteiramente no navegador, no computador ou no celular, e não exige conta. O ponto que costuma passar despercebido: valores, nomes e CPFs digitados aqui não são copiados para nenhum servidor. Para um documento que reúne dados de duas pessoas e uma quantia, essa diferença importa.'
      },
      {
        question: 'Posso baixar o modelo em Word?',
        answer: 'Não — a saída é PDF em A4, pronto para imprimir ou enviar. A diferença é que aqui você não baixa um modelo em branco para preencher depois: preenche na tela e baixa o recibo já completo, com o valor por extenso calculado. Se o que você precisa é um arquivo editável para reutilizar, um modelo em Word é o caminho; se precisa do recibo pronto agora, este é mais rápido.'
      }
    ],
    content: `
      <h2>Recibo de pagamento, aluguel, serviço ou compra e venda</h2>
      <p>Todos seguem a mesma estrutura — muda apenas a descrição. Um <strong>modelo de recibo simples</strong> serve para a maioria dos casos; um <strong>modelo de recibo de aluguel</strong> acrescenta o mês de referência e o imóvel; um <strong>modelo de recibo de prestação de serviço</strong> descreve o serviço e o período; um <strong>modelo de recibo de compra e venda</strong> identifica o bem.</p>
      <p>O que todos precisam ter: quem recebeu, quem pagou, valor em números e por extenso, descrição e data.</p>

      <h2>Recibo não é nota fiscal</h2>
      <p>É a confusão mais cara nesse assunto. A nota fiscal é um documento fiscal eletrônico, emitido pelo sistema da prefeitura ou pela SEFAZ, com CNPJ e certificado digital. O recibo é um comprovante particular de pagamento. Um não substitui o outro: se a operação exige nota fiscal, emitir apenas recibo deixa a obrigação em aberto. Esta ferramenta gera recibos — não emite, e não pode emitir, nota fiscal.</p>

      <h2>Descreva com precisão</h2>
      <p>A parte que decide se o recibo vai servir depois é a descrição. "Pagamento" não identifica nada. "Aluguel referente a setembro de 2026, imóvel da Rua X, nº 10" identifica. Um recibo existe para ser usado em uma discussão futura, e vagueza é exatamente o que o inutiliza nesse momento.</p>

      <h2>Os dados não saem do seu computador</h2>
      <p>Um recibo reúne nome, CPF e valor de duas pessoas. Aqui tudo é montado dentro do navegador e nada é copiado para nenhum servidor — nem armazenado, nem rastreado.</p>
    `
  },
  {
    en: 'invoice-generator',
    slug: 'modelo-de-fatura',
    name: 'Modelo de Fatura',
    title: 'Modelo de Fatura Online Grátis — Criar e Baixar em PDF | ConvertOcean',
    description: 'Preencha um modelo de fatura de serviços, locação ou comercial e baixe em PDF. Não emite nota fiscal — e a página explica a diferença.',
    headline: 'Modelo de Fatura.',
    subtitle: 'Monte uma fatura com itens, valores e impostos e baixe em PDF — sem cadastro e sem que os dados saiam do seu computador.',
    quickAnswer: 'Para criar uma fatura, preencha na ferramenta acima os seus dados, os do cliente e os itens cobrados: o documento é atualizado na tela enquanto você digita e baixa como PDF A4 pronto para imprimir. Uma fatura pede o pagamento; o recibo confirma que ele foi feito. Este documento não é uma nota fiscal e não a substitui. Tudo é gerado no seu navegador, sem que nomes, valores e dados de clientes saiam do seu dispositivo.',
    category: 'Ferramentas Empresariais',
    faqs: [
      {
        question: 'qual é o melhor software gerador de faturas',
        answer: 'Depende do que você precisa que o documento faça. Se o objetivo é cobrar um cliente com um documento claro e profissional, uma ferramenta que monta e baixa o PDF na hora resolve, sem mensalidade e sem cadastro. Se o objetivo é cumprir obrigação fiscal, nenhuma ferramenta desse tipo serve: é preciso um emissor de nota fiscal integrado à prefeitura ou à SEFAZ.'
      },
      {
        question: 'Esta fatura serve como nota fiscal?',
        answer: 'Não, e a distinção é importante. A nota fiscal é um documento fiscal eletrônico, emitido por sistema oficial, com CNPJ e certificado digital, e é o que cumpre a obrigação tributária. A fatura gerada aqui é um documento de cobrança: identifica o serviço, os valores e o prazo. Muitos negócios usam os dois — a fatura para combinar e cobrar, a nota fiscal para formalizar.'
      },
      {
        question: 'Qual a diferença entre fatura, recibo e nota fiscal?',
        answer: 'A fatura pede o pagamento, antes de ele acontecer. O <a href="/pt/modelo-de-recibo/">recibo</a> confirma o pagamento, depois. A nota fiscal registra a operação perante o fisco e é obrigatória em boa parte das vendas e serviços. São três documentos com funções distintas, e é comum precisar de mais de um na mesma transação.'
      },
      {
        question: 'Posso incluir impostos e descontos?',
        answer: 'Sim. Os itens aceitam quantidade e valor unitário, e o total é calculado automaticamente com os acréscimos e abatimentos que você informar. Confira os percentuais antes de enviar — a ferramenta faz a conta que você pedir, mas não sabe qual regime tributário se aplica ao seu caso.'
      },
      {
        question: 'Os dados do cliente ficam guardados?',
        answer: 'Não. Nada é copiado para servidor nenhum, armazenado ou rastreado: a fatura é montada dentro do seu navegador e existe apenas no PDF que você baixa. Isso significa também que os dados não ficam salvos para a próxima fatura — a contrapartida de não manter uma base de clientes em lugar nenhum.'
      }
    ],
    content: `
      <h2>Fatura, recibo e nota fiscal são três coisas diferentes</h2>
      <p>Vale começar por aqui, porque é onde quase toda confusão nasce no Brasil. A <strong>fatura</strong> é um documento de cobrança: descreve o que está sendo cobrado e pede o pagamento. O <a href="/pt/modelo-de-recibo/">recibo</a> comprova que o pagamento foi feito. A <strong>nota fiscal</strong> registra a operação perante o fisco — é emitida por sistema oficial, com CNPJ e certificado digital, e é ela que cumpre a obrigação tributária.</p>
      <p>Esta ferramenta gera faturas. Ela não emite nota fiscal, e nenhum PDF gerado em um site pode fazê-lo.</p>

      <h2>Para que serve uma fatura, então</h2>
      <p>Para cobrar com clareza. Um <strong>modelo de fatura de serviços</strong> lista o que foi feito, quando e por quanto; um <strong>modelo de fatura de locação</strong> registra período e imóvel; um <strong>modelo de fatura comercial</strong> descreve os produtos, quantidades e valores. É o documento que evita a discussão sobre o que foi combinado — e, para trabalho com o exterior, frequentemente é o único documento pedido.</p>

      <h2>Sem mensalidade, sem cadastro, sem base de dados</h2>
      <p>A fatura é montada no seu navegador e existe apenas no PDF que você baixa. Nomes de clientes, valores e margens não são copiados para nenhum servidor. A contrapartida honesta: como nada é guardado, os dados não ficam salvos para a próxima fatura.</p>
    `
  },
  {
    en: 'profit-margin-calculator',
    slug: 'calculadora-de-margem-de-lucro',
    name: 'Calculadora de Margem de Lucro',
    title: 'Calculadora de Margem de Lucro — Como Calcular | ConvertOcean',
    description: 'Calcule margem de lucro, markup e lucro bruto a partir do custo e do preço de venda, com a fórmula à vista. Nada sai do seu computador.',
    headline: 'Calculadora de Margem de Lucro.',
    subtitle: 'Informe custo e preço de venda e veja margem, markup e lucro — com a fórmula ao lado do resultado.',
    quickAnswer: 'Para calcular a margem de lucro, informe o custo e o preço de venda na ferramenta acima: a margem sai da divisão do lucro pelo preço de venda, multiplicada por 100. Um produto que custa R$ 60 e é vendido por R$ 100 tem lucro de R$ 40 e margem de 40%. A ferramenta mostra também o markup, que usa o mesmo lucro dividido pelo custo e dá 66,7% — são números diferentes para a mesma operação, e confundi-los é o erro mais comum.',
    category: 'Ferramentas Empresariais',
    faqs: [
      {
        question: 'como calcular margem de lucro',
        answer: 'Margem = (preço de venda − custo) ÷ preço de venda × 100. Um item que custa R$ 60 e vende por R$ 100 dá lucro de R$ 40 sobre um preço de R$ 100, ou seja, 40% de margem. O ponto que decide tudo é o denominador: margem divide pelo PREÇO DE VENDA. Dividir pelo custo dá outra coisa — o markup.'
      },
      {
        question: 'margem de lucro como calcular',
        answer: 'Antes da fórmula, defina o que entra no custo. Margem bruta considera apenas o custo do produto ou do serviço. Margem líquida desconta também aluguel, salários, impostos e taxas de cartão. Muita gente calcula a margem bruta, acha o número confortável e descobre no fim do mês que a operação não fecha — porque o resto dos custos nunca entrou na conta.'
      },
      {
        question: 'como calcular margem de lucro de um produto',
        answer: 'Some tudo o que aquele produto específico custa até estar disponível para venda: valor de compra, frete, embalagem, impostos na entrada e comissão. Esse é o custo. A margem é a diferença entre o preço de venda e esse total, dividida pelo preço de venda. Deixar o frete de fora é o descuido mais frequente, e ele costuma comer vários pontos percentuais.'
      },
      {
        question: 'como calcular margem de lucro em porcentagem',
        answer: 'O resultado já é uma porcentagem: a divisão do lucro pelo preço de venda dá um número entre 0 e 1, e multiplicar por 100 converte. R$ 40 de lucro sobre R$ 100 de venda dá 0,4, ou 40%. A margem nunca pode passar de 100%, porque o lucro nunca é maior que o preço — se o seu cálculo passou disso, provavelmente você calculou markup.'
      },
      {
        question: 'como calcular minha margem de lucro',
        answer: 'Para o negócio inteiro em vez de um produto, use o faturamento total do período como preço de venda e a soma de todos os custos e despesas como custo. O resultado é a margem líquida do período. Fazer isso mês a mês mostra a tendência, que costuma ser mais útil do que o número isolado de um mês.'
      },
      {
        question: 'como calcular margem de lucro no excel',
        answer: 'Com o custo em A2 e o preço de venda em B2, a fórmula é =(B2-A2)/B2 e a célula deve ser formatada como porcentagem. Para markup, =(B2-A2)/A2. Se preferir não montar a planilha, a ferramenta acima faz os dois cálculos ao mesmo tempo e mostra a fórmula ao lado, para conferência.'
      },
      {
        question: 'Qual a diferença entre margem e markup?',
        answer: 'Ambos partem do mesmo lucro, mas dividem por bases diferentes: margem divide pelo preço de venda, markup divide pelo custo. Custo R$ 60, venda R$ 100: margem 40%, markup 66,7%. Quem define preço aplicando "40% de markup" achando que terá 40% de margem fica com 28,6% — e é assim que um negócio aparentemente lucrativo não fecha as contas.'
      }
    ],
    content: `
      <h2>A fórmula, e a armadilha dentro dela</h2>
      <p><strong>Margem = (preço de venda − custo) ÷ preço de venda × 100.</strong> Simples — e é justamente por parecer simples que o erro passa despercebido.</p>
      <p>O denominador é tudo. Margem divide pelo preço de venda; markup divide pelo custo. Um produto de custo R$ 60 vendido por R$ 100 tem margem de 40% e markup de 66,7%. São o mesmo R$ 40 de lucro descrito de duas maneiras, e trocar um pelo outro na hora de precificar derruba a margem real para 28,6%.</p>

      <h2>Margem bruta e margem líquida</h2>
      <p>A bruta considera só o custo do produto. A líquida desconta aluguel, folha, impostos, taxas de cartão e tudo o mais. Quem calcula apenas a bruta costuma achar o número confortável e descobrir no fechamento que a operação não se paga.</p>

      <h2>Calcular a margem de um produto</h2>
      <p>Para <strong>como calcular margem de lucro de um produto</strong>, o custo precisa incluir tudo até a prateleira: compra, frete, embalagem, impostos de entrada, comissão. O frete é o esquecido clássico e vale vários pontos percentuais.</p>

      <h2>Seus números não saem do computador</h2>
      <p>Custos e preços são informação sensível de qualquer negócio. O cálculo acontece dentro do navegador e nada é copiado para nenhum servidor.</p>
    `
  }
];

/**
 * ---------------------------------------------------------------------------
 * Keyword-led batch 9 — calculators and bank statements, 2026-09-24.
 * ---------------------------------------------------------------------------
 *
 * Batch 8's lesson repeats twice here. `calculadora de ponto de equilibrio` is
 * <100 while `ponto de equilíbrio` is Easy at >1000 across a 12,052-keyword
 * cluster; `calculadora de porcentagem` is HARD while `como calcular
 * porcentagem` is >10,000 with a dozen Easy variants above 1000. The concept
 * and the question beat the translated tool name both times.
 *
 * /pt/calculadora-de-imposto/ is deliberately narrow. The tool applies a rate
 * you type; it has no ICMS logic, and ICMS is not a flat percentage —
 * substituição tributária, interstate rates and base reduction all change the
 * answer. The page says so rather than competing for `calculadora de icms`,
 * because handing someone a confidently wrong tax figure is worse than having
 * no page at all. See `wrongTool` in ./keywords.ts.
 */
const ptToolsBatch9: PtTool[] = [
  {
    en: 'percentage-calculator',
    slug: 'calculadora-de-porcentagem',
    name: 'Calculadora de Porcentagem',
    title: 'Como Calcular Porcentagem — Calculadora Online Grátis | ConvertOcean',
    description: 'Calcule porcentagem de um valor, aumento, desconto e diferença entre dois valores, com a fórmula ao lado de cada resultado.',
    headline: 'Calculadora de Porcentagem.',
    subtitle: 'Porcentagem de um valor, aumento, desconto e diferença — com a fórmula mostrada ao lado de cada resultado.',
    quickAnswer: 'Para calcular a porcentagem de um valor, multiplique o valor pela porcentagem e divida por 100: 15% de 200 é (200 × 15) ÷ 100 = 30. A calculadora acima também faz aumento, desconto, diferença percentual entre dois valores e acréscimo ou abatimento de uma porcentagem, mostrando a fórmula completa em cada resultado para você conferir a conta.',
    category: 'Ferramentas Empresariais',
    faqs: [
      {
        question: 'como calcular porcentagem de um valor',
        answer: 'Multiplique o valor pela porcentagem e divida por 100. Para 15% de 200: (200 × 15) ÷ 100 = 30. O atalho mental é mover a vírgula — 10% de 200 é 20, então 15% é 20 mais metade de 20, ou seja, 30.'
      },
      {
        question: 'como calcular porcentagem de aumento',
        answer: 'Divida a diferença pelo valor inicial e multiplique por 100: de R$ 80 para R$ 100, o aumento é (100 − 80) ÷ 80 × 100 = 25%. O erro comum é dividir pelo valor final, que daria 20%. A base é sempre de onde você partiu.'
      },
      {
        question: 'como calcular porcentagem de desconto',
        answer: 'Para saber quanto vai pagar, multiplique o preço por (100 − desconto) ÷ 100: R$ 250 com 30% de desconto ficam 250 × 0,70 = R$ 175. Para descobrir qual desconto foi dado, divida a diferença pelo preço original: de R$ 250 para R$ 175, são 75 ÷ 250 = 30%.'
      },
      {
        question: 'como calcular porcentagem de um valor para outro',
        answer: 'Divida um pelo outro e multiplique por 100 — mas atenção ao que você quer saber. Se 40 é quanto por cento de 200, são 40 ÷ 200 = 20%. Se a pergunta é quanto 200 aumentou para chegar a 240, a base muda: (240 − 200) ÷ 200 = 20%. O denominador define a resposta.'
      },
      {
        question: 'como calcular porcentagem na calculadora',
        answer: 'Em uma calculadora comum, a tecla % já divide por 100. Para 15% de 200, digite 200 × 15 %. Para acrescentar 15%, digite 200 + 15 % e o resultado sai 230. Para descontar, 200 − 15 % dá 170. Modelos variam na ordem, então vale testar com uma conta cujo resultado você já conhece.'
      },
      {
        question: 'como fazer conta de porcentagem na calculadora',
        answer: 'A sequência que funciona na maioria dos modelos é valor, ×, número da porcentagem, %. O ponto que confunde: a tecla % não é um número que você soma — ela transforma o que veio antes. É por isso que 200 + 15 % devolve 230 e não 215: a calculadora entende "acrescente 15% de 200".'
      },
      {
        question: 'como calcular porcentagem no celular',
        answer: 'A calculadora do celular funciona igual, com uma diferença: em vários aparelhos a tecla % só aparece ao girar a tela para o modo horizontal ou ao abrir as funções científicas. Se você não encontra a tecla, dá para fazer sem ela — multiplique pelo decimal: 15% é × 0,15.'
      },
      {
        question: 'como calcular porcentagem no excel',
        answer: 'Com o valor em A1, use =A1*15% ou =A1*0,15 — as duas formas dão o mesmo resultado. Para variação percentual entre B1 e A1, use =(B1-A1)/A1 e formate a célula como porcentagem. Se o resultado aparecer como 0,25 em vez de 25%, é só formatação: aplique o formato de porcentagem à célula.'
      }
    ],
    content: `
      <h2>A conta, e o erro que quase todo mundo comete</h2>
      <p>Calcular a porcentagem de um valor é direto: valor × porcentagem ÷ 100. O que engana é a <strong>variação</strong> percentual, porque ela depende de qual número entra no denominador.</p>
      <p>De R$ 80 para R$ 100 há um aumento de 25% — a diferença de 20 sobre a base de 80. Mas de R$ 100 para R$ 80 a queda é de 20%, não de 25%, porque agora a base é 100. Subir 25% e cair 20% levam ao mesmo lugar, e é por isso que descontos sucessivos nunca somam: 20% e depois mais 10% não são 30%, são 28%.</p>

      <h2>Porcentagem de lucro e de desconto</h2>
      <p>Uma <strong>calculadora de porcentagem de desconto</strong> responde duas perguntas diferentes: quanto vou pagar, e qual desconto foi dado. Para o preço final, multiplique por (100 − desconto) ÷ 100. Para descobrir o desconto, divida a diferença pelo preço original.</p>
      <p>Para <strong>calculadora de porcentagem de lucro</strong>, o denominador volta a importar: margem divide pelo preço de venda, markup divide pelo custo. A <a href="/pt/calculadora-de-margem-de-lucro/">calculadora de margem de lucro</a> trata esse caso em detalhe.</p>

      <h2>A tecla % não é um número</h2>
      <p>É a origem da confusão com a calculadora. A tecla % transforma o que veio antes dela, em vez de somar um valor. Por isso 200 + 15 % devolve 230: a calculadora lê "acrescente 15% de 200", e não "some 15".</p>

      <h2>A fórmula fica à vista</h2>
      <p>Cada resultado aparece com a conta que o produziu, para você conferir em vez de confiar. E, como em todo o site, o cálculo acontece dentro do navegador — nenhum número é copiado para servidor nenhum.</p>
    `
  },
  {
    en: 'break-even-calculator',
    slug: 'ponto-de-equilibrio',
    name: 'Ponto de Equilíbrio',
    title: 'Ponto de Equilíbrio — Como Calcular | Calculadora Grátis | ConvertOcean',
    description: 'Calcule o ponto de equilíbrio contábil, financeiro e econômico: quantas unidades vender para cobrir os custos, com margem de contribuição.',
    headline: 'Ponto de Equilíbrio.',
    subtitle: 'Descubra quantas unidades precisa vender para cobrir os custos — com margem de contribuição e meta de lucro.',
    quickAnswer: 'O ponto de equilíbrio é o volume de vendas em que a receita cobre exatamente os custos: Ponto de Equilíbrio em unidades = Custos Fixos ÷ (Preço − Custo Variável por unidade). Com R$ 5.000 de custos fixos, preço de R$ 39 e custo variável de R$ 14, o equilíbrio está em 200 unidades. A calculadora também encontra o volume necessário para uma meta de lucro e o preço que a viabiliza.',
    category: 'Ferramentas Empresariais',
    faqs: [
      {
        question: 'o que é ponto de equilíbrio',
        answer: 'É o volume de vendas em que a empresa não tem lucro nem prejuízo: a receita cobre exatamente todos os custos. Abaixo dele a operação consome caixa; acima, cada venda adicional contribui para o lucro. É o primeiro número que um negócio precisa conhecer, porque define a meta mínima de sobrevivência.'
      },
      {
        question: 'como calcular ponto de equilibrio',
        answer: 'Custos Fixos ÷ (Preço de venda − Custo variável por unidade). Com R$ 5.000 de custos fixos por mês, preço de R$ 39 e custo variável de R$ 14 por unidade, a margem de contribuição é R$ 25 e o ponto de equilíbrio são 200 unidades por mês. Em receita: 200 × R$ 39 = R$ 7.800.'
      },
      {
        question: 'como calcular o ponto de equilíbrio',
        answer: 'A parte difícil não é a fórmula, é separar os custos. Fixos são os que existem mesmo sem vender nada: aluguel, salários, software, contador. Variáveis mudam com cada venda: matéria-prima, embalagem, comissão, taxa de cartão, frete. Classificar errado desloca o resultado inteiro, e a taxa de cartão é a que mais costuma acabar do lado errado.'
      },
      {
        question: 'ponto de equilíbrio como calcular',
        answer: 'Comece pela margem de contribuição, que é preço menos custo variável unitário — o quanto cada venda deixa para pagar os custos fixos. Depois divida os custos fixos por ela. Se a margem de contribuição for negativa, não existe ponto de equilíbrio: vender mais aumenta o prejuízo, e o problema é o preço, não o volume.'
      },
      {
        question: 'como calcular ponto de equilibrio contabil',
        answer: 'O ponto de equilíbrio contábil considera todos os custos fixos, inclusive os que não saem do caixa, como a depreciação. É o cálculo padrão: custos fixos totais divididos pela margem de contribuição. Dá o volume em que o resultado contábil fica em zero.'
      },
      {
        question: 'o que é ponto de equilibrio financeiro',
        answer: 'O financeiro desconta dos custos fixos as despesas que não representam saída de caixa, como a depreciação. Por isso ele é sempre menor que o contábil: mostra o volume mínimo para o caixa não ficar negativo, ainda que contabilmente a empresa registre prejuízo. É o número útil em momentos de aperto de caixa.'
      },
      {
        question: 'o que é ponto de equilibrio de uma empresa',
        answer: 'Para a empresa inteira, em vez de um produto, use o faturamento total e a margem de contribuição média. O resultado é a receita mensal mínima. Se a empresa vende itens com margens muito diferentes, a média esconde o que cada linha contribui — nesse caso, calcular por produto revela mais.'
      },
      {
        question: 'o que é analise de ponto de equilibrio',
        answer: 'É usar o ponto de equilíbrio para testar decisões antes de tomá-las: quanto o volume precisa subir para bancar uma contratação, o que um aumento de aluguel faz com a meta mínima, se um desconto se paga em volume. O valor do cálculo não está no número em si, e sim em comparar cenários.'
      }
    ],
    content: `
      <h2>A fórmula, e onde ela costuma dar errado</h2>
      <p><strong>Ponto de equilíbrio = Custos Fixos ÷ (Preço − Custo Variável unitário).</strong> O denominador é a margem de contribuição: o quanto cada venda deixa para pagar as contas fixas.</p>
      <p>A fórmula é simples e o erro raramente está nela. Está na separação dos custos. Fixos existem mesmo com zero vendas — aluguel, folha, contador, software. Variáveis nascem com cada venda — matéria-prima, embalagem, comissão, frete e a taxa de cartão. Essa última é a mais frequentemente classificada errado, e ela sozinha desloca o resultado.</p>

      <h2>Contábil, financeiro e econômico</h2>
      <p>O <strong>ponto de equilíbrio contábil</strong> usa todos os custos fixos e mostra onde o resultado contábil zera. O <strong>ponto de equilíbrio financeiro</strong> desconta o que não sai do caixa, como depreciação, e por isso é sempre menor — é o número que importa quando a preocupação é caixa. O <strong>ponto de equilíbrio econômico</strong> acrescenta o retorno mínimo esperado pelo capital investido, respondendo não "quando paro de perder" mas "quando vale a pena ter feito".</p>

      <h2>Margem de contribuição negativa</h2>
      <p>Se o custo variável por unidade é maior que o preço, não existe ponto de equilíbrio: cada venda aumenta o prejuízo e nenhum volume resolve. É um diagnóstico de preço, não de vendas — e vale conferir isso antes de montar qualquer meta.</p>

      <h2>Os números não saem do seu computador</h2>
      <p>Custos, preços e margens são a informação mais sensível de um negócio. O cálculo acontece dentro do navegador e nada é copiado para nenhum servidor.</p>
    `
  },
  {
    en: 'sales-tax-calculator',
    slug: 'calculadora-de-imposto',
    name: 'Calculadora de Imposto',
    title: 'Como Calcular Imposto sobre Produto — Calculadora | ConvertOcean',
    description: 'Calcule o imposto sobre um produto a partir de uma alíquota que você informa, incluindo o cálculo inverso a partir do preço final.',
    headline: 'Calculadora de Imposto.',
    subtitle: 'Aplique uma alíquota sobre o preço, ou descubra o valor sem imposto a partir do preço final.',
    quickAnswer: 'Para calcular o imposto sobre um produto, multiplique o preço sem imposto pela alíquota: R$ 100 a 8,25% adicionam R$ 8,25, totalizando R$ 108,25. A calculadora também faz o caminho inverso, encontrando o preço sem imposto a partir de um total que já o inclui. A alíquota é informada por você — a ferramenta não calcula ICMS, que depende de substituição tributária e de regras interestaduais.',
    category: 'Ferramentas Empresariais',
    faqs: [
      {
        question: 'como calcular imposto sobre produto',
        answer: 'Multiplique o preço sem imposto pela alíquota em decimal: R$ 100 com alíquota de 18% dão R$ 18 de imposto e R$ 118 de total. Para o caminho inverso — descobrir o preço sem imposto a partir de um total que já o embute — divida o total por (1 + alíquota): R$ 118 ÷ 1,18 = R$ 100.'
      },
      {
        question: 'como calcular imposto sobre produto formula',
        answer: 'Imposto = preço × alíquota ÷ 100. Total = preço × (1 + alíquota ÷ 100). Preço sem imposto = total ÷ (1 + alíquota ÷ 100). A terceira é a que mais gera erro: subtrair 18% de um total que já inclui 18% não devolve o preço original, porque a base das duas contas é diferente.'
      },
      {
        question: 'como calcular imposto sobre produto importado',
        answer: 'Produto importado tem várias incidências em cadeia — imposto de importação, IPI, PIS/COFINS e ICMS —, e cada uma pode ter base de cálculo própria, inclusive com um tributo entrando na base do seguinte. Esta calculadora aplica uma alíquota por vez sobre a base que você informar; ela não monta essa cadeia. Para importação, confirme a sequência correta antes de precificar.'
      },
      {
        question: 'Esta calculadora faz ICMS?',
        answer: 'Não. O ICMS não é uma alíquota simples sobre o preço: há substituição tributária, diferença entre operações internas e interestaduais, redução de base de cálculo e regimes específicos por estado e por produto. Uma calculadora de percentual aplicaria um número e daria uma resposta confiante e errada. Aqui você informa a alíquota que já apurou, e a ferramenta faz a aritmética.'
      },
      {
        question: 'Os valores são copiados para algum servidor?',
        answer: 'Não. O cálculo acontece no seu navegador, no seu dispositivo, e nada é copiado para nenhum servidor.'
      }
    ],
    content: `
      <h2>O que esta calculadora faz</h2>
      <p>Ela aplica uma alíquota que você informa sobre um valor, nos dois sentidos: do preço sem imposto para o total, e do total de volta ao preço sem imposto. É aritmética de tributo, feita com a fórmula à vista.</p>

      <h2>O que ela não faz, e por quê</h2>
      <p>Ela não calcula ICMS. O ICMS não é uma porcentagem aplicada ao preço: depende de substituição tributária, da diferença entre operação interna e interestadual, de redução de base de cálculo e de regras que mudam por estado e por produto. Uma ferramenta que aplicasse um número e chamasse o resultado de ICMS entregaria uma resposta errada com aparência de certa — e imposto errado custa mais caro do que não ter a ferramenta.</p>

      <h2>O cálculo inverso</h2>
      <p>É onde mais se erra. Um total de R$ 118 que já embute 18% não volta a R$ 100 se você subtrair 18% — isso daria R$ 96,76. A conta certa é dividir por 1,18, porque a base dos 18% é o preço original e não o total.</p>
    `
  },
  {
    en: 'ofx-to-csv',
    slug: 'ofx-para-csv',
    name: 'OFX para CSV',
    title: 'Converter OFX para CSV Online Grátis — Extrato Bancário | ConvertOcean',
    description: 'Converta um extrato bancário .ofx em planilha CSV ou Excel direto no navegador. O extrato não sai do seu computador.',
    headline: 'OFX para CSV.',
    subtitle: 'Transforme um extrato bancário .ofx em planilha, com as colunas que o seu sistema espera — sem que o extrato saia do seu computador.',
    quickAnswer: 'Para converter OFX para CSV, selecione o extrato .ofx na ferramenta acima e baixe uma planilha com todas as transações: data, tipo, descrição, memorando, valor, número do documento e identificador da transação. Dá para trocar para uma pasta do Excel ou para um layout de três colunas, aceito pelos assistentes de importação dos bancos. O extrato é lido dentro do seu navegador e não sai do seu computador.',
    category: 'Ferramentas Empresariais',
    faqs: [
      {
        question: 'O que é um arquivo OFX?',
        answer: 'É o formato padrão de extrato bancário eletrônico, oferecido para download pela maioria dos bancos e aceito por programas de finanças e contabilidade. Ele guarda cada transação com data, valor, descrição e identificador — mas não abre em planilha, que é o motivo de quase toda conversão.'
      },
      {
        question: 'Quais colunas saem na planilha?',
        answer: 'Data, tipo, descrição, memorando, valor, número do documento e identificador único da transação. Há também um layout reduzido de três colunas — data, descrição e valor — que é o formato que os assistentes de importação de muitos sistemas esperam receber.'
      },
      {
        question: 'Posso baixar em Excel em vez de CSV?',
        answer: 'Sim, é possível gerar uma pasta .xlsx no lugar do CSV. O .xlsx evita o problema clássico de o Excel abrir um CSV com tudo em uma coluna só, porque já carrega a estrutura das colunas dentro do arquivo.'
      },
      {
        question: 'O extrato é copiado para algum servidor?',
        answer: 'Não. A leitura do extrato e a geração da planilha acontecem no seu navegador, no seu dispositivo. Um extrato bancário lista cada transação de uma conta: é exatamente o tipo de arquivo que não deveria ser enviado a um serviço qualquer, e aqui ele não é copiado para lugar nenhum.'
      }
    ],
    content: `
      <h2>Do extrato do banco para a planilha</h2>
      <p>O OFX é o formato padrão de extrato eletrônico e quase todo banco o oferece para download — mas ele não abre em planilha. Um <strong>conversor de ofx para csv</strong> resolve exatamente essa distância: transforma o extrato em linhas e colunas que o Excel, o Google Sheets ou o sistema contábil conseguem ler.</p>

      <h2>O layout de três colunas</h2>
      <p>Muitos assistentes de importação esperam apenas data, descrição e valor, e recusam arquivos com colunas a mais. Por isso existe essa saída reduzida além da completa — <strong>converter arquivo ofx para csv</strong> raramente é sobre os dados, e quase sempre sobre o formato que o outro sistema aceita.</p>

      <h2>Um extrato não deveria circular</h2>
      <p>Ele lista cada transação de uma conta: onde a pessoa comprou, quanto recebeu, para quem transferiu. A conversão acontece dentro do navegador, no seu dispositivo, e o arquivo não é copiado para nenhum servidor.</p>
    `
  }
];

/**
 * ---------------------------------------------------------------------------
 * Keyword-led batch 10 — the long tail, 2026-09-24. Fourteen tools, two tiers.
 * ---------------------------------------------------------------------------
 *
 * The image formats carry the last large Easy volume in the programme:
 * `heic para jpg` and `converter heic para jpg` are both Easy at >10,000, and
 * `converter webp para jpg` is Easy at >10,000. HEIC is a pure consumer
 * problem — an iPhone photo that Windows and upload forms refuse — which fits
 * a mobile-heavy Brazilian audience exactly.
 *
 * The spreadsheet and XML converters are the other tier: everything <100,
 * several with no KD at all. Completion pages, no ranking expectation.
 *
 * Accuracy note carried into the copy: HEIC needs a one-time ~1MB decoder
 * download, while AVIF uses the browser's own built-in engine. Those are
 * genuinely different experiences and the pages say so rather than sharing a
 * vague "runs in your browser" line.
 */
const ptToolsBatch10: PtTool[] = [
  {
    en: 'heic-to-jpg',
    slug: 'heic-para-jpg',
    name: 'HEIC para JPG',
    title: 'Converter HEIC para JPG Online Grátis — Foto do iPhone | ConvertOcean',
    description: 'Converta fotos HEIC do iPhone para JPG direto no navegador, para abrir no Windows, no Android e em formulários que recusam o formato.',
    headline: 'HEIC para JPG.',
    subtitle: 'Transforme fotos do iPhone em JPG que abre em qualquer lugar — sem que a imagem saia do seu aparelho.',
    quickAnswer: 'Para converter HEIC para JPG, selecione a foto .heic na ferramenta acima: um decodificador de código aberto a converte em um JPG com 92% de qualidade, que abre no Windows, no Android e em qualquer formulário de envio. O decodificador é baixado uma única vez (cerca de 1 MB) no primeiro arquivo e depois fica em cache. A foto não sai do seu aparelho.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como converter heic para jpg',
        answer: 'Arraste a foto .heic para a ferramenta no topo da página e baixe o JPG. Na primeira conversão há um download único do decodificador, de cerca de 1 MB; a partir daí as conversões são imediatas. Não é preciso cadastro nem instalar aplicativo.'
      },
      {
        question: 'como converter arquivo heic para jpg',
        answer: 'O HEIC é o formato que o iPhone usa por padrão desde 2017. Ele economiza espaço, mas o Windows, muitos Androids e boa parte dos sites de envio não o reconhecem — é por isso que a foto simplesmente não abre ou é recusada no upload. A conversão para JPG resolve porque o JPG é aceito em todo lugar.'
      },
      {
        question: 'como converter fotos heic para jpg',
        answer: 'Dá para converter várias fotos na mesma sessão, uma após a outra, e o decodificador só é carregado na primeira. Como tudo roda no seu aparelho, a velocidade depende do seu processador e não de uma fila de servidor — e um lote grande de fotos não esbarra em limite diário.'
      },
      {
        question: 'como converter heic para jpg no iphone',
        answer: 'Dá para fazer aqui mesmo, pelo Safari, sem instalar nada. Mas há um caminho ainda mais direto se o problema for recorrente: em Ajustes, Câmera, Formatos, escolha "Mais Compatível" e o iPhone passa a fotografar direto em JPG. Isso não converte as fotos antigas — para essas, use a ferramenta.'
      },
      {
        question: 'como mudar formato de foto heic para jpg',
        answer: 'Renomear o arquivo de .heic para .jpg não funciona: a extensão é só o nome, e o conteúdo continua codificado em HEIC. O programa que abrir vai recusar ou mostrar erro. É preciso decodificar e recodificar a imagem de verdade, que é o que a ferramenta faz.'
      },
      {
        question: 'A qualidade da foto piora?',
        answer: 'Há uma recodificação, então tecnicamente sim, mas o JPG é gerado com 92% de qualidade — na prática indistinguível a olho nu para uma fotografia. O arquivo tende a ficar maior que o HEIC original, porque o HEIC comprime melhor. É o preço de um formato que abre em qualquer lugar.'
      },
      {
        question: 'A foto é copiada para algum servidor?',
        answer: 'Não. A decodificação acontece no seu aparelho, dentro do navegador. Fotos carregam metadados como localização e modelo do celular, e nada disso é copiado para nenhum servidor.'
      }
    ],
    content: `
      <h2>Por que o iPhone gera um arquivo que ninguém abre</h2>
      <p>Desde 2017 o iPhone fotografa em HEIC por padrão. O formato é tecnicamente melhor que o JPG — mesma qualidade em cerca de metade do tamanho — mas o Windows, muitos aparelhos Android e boa parte dos formulários de envio não o reconhecem. O resultado é a situação conhecida: a foto está no computador e simplesmente não abre.</p>
      <p>Um <strong>conversor de heic para jpg</strong> resolve isso trocando o formato pelo que todo mundo aceita.</p>

      <h2>Renomear não resolve</h2>
      <p>Trocar o final do nome de .heic para .jpg não converte nada. A extensão é apenas um rótulo; o conteúdo continua codificado em HEIC e o programa que tentar abrir vai recusar. <strong>Converter imagem heic para jpg</strong> exige decodificar e recodificar de verdade.</p>

      <h2>Evitar o problema na origem</h2>
      <p>Se isso acontece com frequência, vale ajustar o iPhone: Ajustes, Câmera, Formatos, "Mais Compatível". A partir daí as fotos novas já saem em JPG. As antigas continuam em HEIC e precisam da conversão.</p>

      <h2>O decodificador roda no seu aparelho</h2>
      <p>O HEIC não é suportado nativamente pelos navegadores, então a ferramenta carrega um decodificador de código aberto de cerca de 1 MB na primeira foto. Depois disso ele fica em cache e as conversões são imediatas. O importante: ele roda no seu dispositivo — a foto, e os metadados de localização que ela carrega, não são copiados para nenhum servidor.</p>
    `
  },
  {
    en: 'webp-to-jpg',
    slug: 'webp-para-jpg',
    name: 'WebP para JPG',
    title: 'Converter WebP para JPG Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta imagens WebP em JPG direto no navegador, para abrir em programas antigos e formulários que recusam o formato.',
    headline: 'WebP para JPG.',
    subtitle: 'Transforme imagens WebP em JPG que abre em qualquer programa — sem que o arquivo saia do seu dispositivo.',
    quickAnswer: 'Para converter WebP para JPG, selecione a imagem .webp na ferramenta acima e baixe um JPG que abre em qualquer software, inclusive editores antigos que não reconhecem WebP. Como o JPG não tem transparência, áreas transparentes são achatadas sobre um fundo branco. A conversão acontece inteiramente no seu navegador.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como converter imagem webp para jpg',
        answer: 'Arraste o arquivo .webp para a ferramenta no topo da página e baixe o .jpg. O resultado abre no Word, no PowerPoint, em editores antigos e em qualquer formulário que recuse o formato WebP.'
      },
      {
        question: 'como converter webp para jpg',
        answer: 'O caso mais comum é uma imagem salva de um site: o navegador entrega em WebP, e o programa de destino não aceita. A conversão para JPG resolve porque o JPG é universalmente reconhecido — a contrapartida é que o arquivo costuma ficar maior, já que o WebP comprime melhor.'
      },
      {
        question: 'O que acontece com o fundo transparente?',
        answer: 'É achatado sobre branco, porque o JPG não tem canal de transparência. Para uma fotografia isso não muda nada. Para um logotipo recortado, o resultado terá um retângulo branco em volta — nesse caso converta para <a href="/pt/webp-para-png/">PNG</a>, que preserva a transparência.'
      },
      {
        question: 'A qualidade piora?',
        answer: 'Há uma recodificação, e o JPG é gerado em alta qualidade — a diferença não é perceptível a olho nu em fotografias. Em imagens com texto nítido ou áreas de cor chapada, o JPG introduz artefatos ao redor das bordas; para esses casos o PNG é a escolha melhor.'
      },
      {
        question: 'A imagem é copiada para algum servidor?',
        answer: 'Não. A conversão acontece no seu navegador, no seu dispositivo, e a imagem não é copiada para nenhum servidor.'
      }
    ],
    content: `
      <h2>A imagem que você salvou e não consegue usar</h2>
      <p>É a origem quase universal dessa busca: você salvou uma imagem de um site, tentou inserir em um documento ou enviar em um formulário, e o arquivo foi recusado. O WebP é o formato que a web moderna usa, mas muitos programas de escritório e sistemas mais antigos ainda não o abrem.</p>
      <p><strong>Converter imagem webp para jpg</strong> devolve um formato que qualquer software aceita.</p>

      <h2>JPG ou PNG?</h2>
      <p>Depende do que a imagem contém. Para fotografias, JPG: menor e sem diferença visível. Para logotipos, capturas de tela e gráficos com texto — ou qualquer imagem com fundo transparente — <a href="/pt/webp-para-png/">WebP para PNG</a> é a escolha certa, porque o JPG achata a transparência sobre branco e borra as bordas do texto.</p>

      <h2>O arquivo vai ficar maior</h2>
      <p>O WebP existe porque comprime melhor. Ao passar <strong>de webp para jpg</strong>, espere um arquivo maior em troca da compatibilidade universal. Tudo processado dentro do navegador, sem cópia para servidor nenhum.</p>
    `
  },
  {
    en: 'heic-to-png',
    slug: 'heic-para-png',
    name: 'HEIC para PNG',
    title: 'Converter HEIC para PNG Online Grátis — Sem Perdas | ConvertOcean',
    description: 'Converta fotos HEIC do iPhone em PNG sem perdas direto no navegador, para editar em qualquer programa.',
    headline: 'HEIC para PNG.',
    subtitle: 'Converta fotos do iPhone em PNG sem perdas, aceito por qualquer editor — sem que a imagem saia do seu aparelho.',
    quickAnswer: 'Para converter HEIC para PNG, selecione o arquivo .heic na ferramenta acima e baixe um PNG sem perdas, aceito por qualquer editor e plataforma. O decodificador de código aberto é carregado uma única vez (cerca de 1 MB) no primeiro arquivo e roda inteiramente no seu navegador. Espere um arquivo maior que o HEIC original, porque o PNG guarda cada pixel exatamente.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'Quando escolher PNG em vez de JPG?',
        answer: 'Escolha PNG quando a imagem ainda vai ser editada, ou quando contém texto, capturas de tela ou gráficos com bordas nítidas — o PNG é sem perdas e não introduz os artefatos que o JPG cria. Para uma fotografia que vai apenas ser enviada ou impressa, <a href="/pt/heic-para-jpg/">HEIC para JPG</a> gera um arquivo bem menor.'
      },
      {
        question: 'O arquivo PNG fica maior que a foto original?',
        answer: 'Sim, normalmente bastante maior. O HEIC é um formato de compressão muito eficiente e o PNG guarda cada pixel sem aproximações. É a contrapartida de não perder nenhuma informação na conversão.'
      },
      {
        question: 'Por que preciso baixar um decodificador?',
        answer: 'Porque os navegadores não abrem HEIC nativamente — é um formato da Apple. A ferramenta carrega um decodificador de código aberto de cerca de 1 MB na primeira conversão, que depois fica em cache. Ele roda no seu aparelho, e é o que permite converter sem enviar a foto para lugar nenhum.'
      },
      {
        question: 'A foto é copiada para algum servidor?',
        answer: 'Não. A decodificação e a geração do PNG acontecem no seu dispositivo. Fotos carregam metadados como localização e modelo do aparelho, e nada é copiado para nenhum servidor.'
      }
    ],
    content: `
      <h2>HEIC para um formato que editores aceitam</h2>
      <p>O HEIC é o padrão de fotos do iPhone desde 2017 e quase nenhum editor de imagem o abre diretamente. Um <strong>conversor de heic para png</strong> resolve isso sem perdas: o PNG guarda cada pixel exatamente como estava, o que o torna a escolha certa quando a imagem ainda vai ser trabalhada.</p>

      <h2>PNG ou JPG, para uma foto do celular</h2>
      <p>Se a foto vai apenas ser enviada, impressa ou anexada, o <a href="/pt/heic-para-jpg/">JPG</a> gera um arquivo muito menor sem diferença visível. O PNG faz sentido quando a imagem será editada, recortada ou contém texto — casos em que a compressão com perdas do JPG se acumularia a cada salvamento.</p>

      <h2>O decodificador, e por que ele existe</h2>
      <p>Nenhum navegador lê HEIC nativamente. A ferramenta carrega um decodificador de código aberto de cerca de 1 MB na primeira conversão e o mantém em cache. Ele roda no seu aparelho — é justamente o que permite converter a foto sem copiá-la para nenhum servidor.</p>
    `
  },
  {
    en: 'avif-to-jpg',
    slug: 'avif-para-jpg',
    name: 'AVIF para JPG',
    title: 'Converter AVIF para JPG Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta imagens AVIF em JPG direto no navegador, para abrir em qualquer programa ou formulário que recuse o formato.',
    headline: 'AVIF para JPG.',
    subtitle: 'Transforme imagens AVIF em JPG aceito em qualquer lugar — usando o próprio decodificador do navegador.',
    quickAnswer: 'Para converter AVIF para JPG, selecione o arquivo .avif na ferramenta acima: o navegador o decodifica com o mecanismo AVIF que já traz embutido e gera um JPG com 92% de qualidade, que abre em qualquer software, cliente de e-mail ou formulário de envio. Áreas transparentes são achatadas sobre branco, porque o JPG não tem transparência. Nada sai do seu dispositivo.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'O que é um arquivo AVIF?',
        answer: 'É um formato de imagem moderno, derivado do codec de vídeo AV1, que comprime ainda melhor que o WebP. Sites o usam para carregar mais rápido — e é justamente por ser recente que programas de escritório, editores antigos e muitos formulários ainda não o aceitam.'
      },
      {
        question: 'Precisa baixar algum decodificador?',
        answer: 'Não. Diferente do HEIC, o AVIF é suportado nativamente pelos navegadores modernos, então a conversão usa o mecanismo que o próprio navegador já tem. Não há download adicional e a conversão é imediata.'
      },
      {
        question: 'O que acontece com a transparência?',
        answer: 'É achatada sobre branco, porque o JPG não tem canal de transparência. Se a imagem tem fundo transparente e isso importa, use <a href="/pt/avif-para-png/">AVIF para PNG</a>, que a preserva.'
      },
      {
        question: 'A imagem é copiada para algum servidor?',
        answer: 'Não. A decodificação e a recodificação acontecem no seu navegador, no seu dispositivo, e a imagem não é copiada para nenhum servidor.'
      }
    ],
    content: `
      <h2>Um formato novo demais para o resto do software</h2>
      <p>O AVIF nasceu do codec de vídeo AV1 e comprime melhor que qualquer formato de imagem anterior — motivo pelo qual sites o adotaram rapidamente. O problema aparece depois: você salva a imagem e o editor, o Word ou o formulário de envio simplesmente não a reconhecem.</p>
      <p>Um <strong>conversor avif para jpg</strong> resolve trocando por um formato que existe há trinta anos e que todo software aceita.</p>

      <h2>Sem downloads extras</h2>
      <p>Diferente do HEIC, que exige um decodificador próprio, o AVIF já é lido nativamente pelos navegadores modernos. <strong>Converter imagem avif para jpg</strong> usa o mecanismo que o seu navegador traz embutido, então não há espera nem download adicional.</p>

      <h2>Transparência</h2>
      <p>O AVIF suporta transparência; o JPG não. Áreas transparentes são achatadas sobre branco na conversão. Quando isso importa — um logotipo, uma imagem recortada — o caminho é <a href="/pt/avif-para-png/">AVIF para PNG</a>.</p>
    `
  },
  {
    en: 'avif-to-png',
    slug: 'avif-para-png',
    name: 'AVIF para PNG',
    title: 'Converter AVIF para PNG Online Grátis — Sem Perdas | ConvertOcean',
    description: 'Converta imagens AVIF em PNG sem perdas direto no navegador, com a transparência preservada.',
    headline: 'AVIF para PNG.',
    subtitle: 'Converta AVIF em PNG sem perdas, com a transparência preservada — processado no seu próprio dispositivo.',
    quickAnswer: 'Para converter AVIF para PNG, selecione o arquivo .avif na ferramenta acima e baixe um PNG sem perdas, com qualquer transparência preservada. O PNG abre em todos os editores e passa em formulários que recusam formatos modernos, embora fique bem maior que o AVIF original. A conversão usa o decodificador do próprio navegador e nada sai do seu dispositivo.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'A transparência é preservada?',
        answer: 'Sim. Tanto o AVIF quanto o PNG suportam canal alfa, então áreas transparentes atravessam a conversão intactas — diferente do <a href="/pt/avif-para-jpg/">AVIF para JPG</a>, que as achata sobre branco.'
      },
      {
        question: 'Por que o PNG fica tão maior?',
        answer: 'Porque o AVIF é um dos formatos mais eficientes que existem e o PNG guarda cada pixel sem aproximação. Uma imagem de 200 KB em AVIF pode facilmente passar de 1 MB em PNG. É o custo de um formato sem perdas que abre em qualquer lugar.'
      },
      {
        question: 'A qualidade da imagem muda?',
        answer: 'Não há perda adicional: o PNG guarda exatamente os pixels que o AVIF produziu. Se o AVIF de origem já era comprimido com perdas, essa compressão continua visível — a conversão não recupera detalhe que já não existia, mas também não degrada nada.'
      },
      {
        question: 'A imagem é copiada para algum servidor?',
        answer: 'Não. Tudo acontece no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>Do formato mais moderno para o mais compatível</h2>
      <p>O AVIF comprime melhor que WebP, JPG ou PNG — e é exatamente por ser recente que tantos programas o recusam. Um <strong>conversor de avif para png</strong> troca eficiência por compatibilidade universal, mantendo a imagem intacta.</p>

      <h2>Sem perdas, com transparência</h2>
      <p>O PNG guarda cada pixel exatamente e preserva o canal alfa, então logotipos e imagens recortadas continuam com o fundo transparente. Nada é recomprimido: o que o AVIF já tinha é o que o PNG recebe.</p>

      <h2>Espere um arquivo bem maior</h2>
      <p>É a contrapartida inevitável. Ao <strong>converter arquivo avif para png</strong>, um arquivo de algumas centenas de kilobytes pode passar de um megabyte. Se o destino for a web, o AVIF original continua sendo a escolha melhor; o PNG faz sentido para edição e para sistemas que não aceitam o formato novo.</p>
    `
  },
  {
    en: 'jpg-to-webp',
    slug: 'jpg-para-webp',
    name: 'JPG para WebP',
    title: 'Converter JPG para WebP Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta imagens JPG em WebP direto no navegador: 25–35% menores com qualidade equivalente, para acelerar o carregamento do site.',
    headline: 'JPG para WebP.',
    subtitle: 'Reduza o peso das imagens do seu site mantendo a qualidade — processado no seu próprio dispositivo.',
    quickAnswer: 'Para converter JPG para WebP, selecione a imagem .jpg na ferramenta acima e baixe um WebP normalmente 25–35% menor com qualidade equivalente. Todos os navegadores modernos exibem WebP, o que faz dele a escolha melhor para imagens na web e para páginas que carregam mais rápido. A conversão acontece inteiramente no seu dispositivo.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'Quanto menor fica a imagem?',
        answer: 'Normalmente entre 25% e 35% menor com qualidade equivalente, variando com o conteúdo da foto. Fotografias detalhadas rendem mais; imagens simples, com poucas cores, ganham menos porque o JPG já as comprimia bem.'
      },
      {
        question: 'Vale a pena converter fotos que já estão em JPG?',
        answer: 'Para uso na web, sim: menos peso significa carregamento mais rápido, especialmente no celular. Para arquivamento, não há vantagem — e vale lembrar que converter um JPG para WebP é uma segunda compressão com perdas sobre uma imagem que já perdeu informação uma vez. Guarde o original se ele ainda for editado.'
      },
      {
        question: 'Todos os navegadores exibem WebP?',
        answer: 'Sim, todos os modernos — Chrome, Firefox, Safari, Edge e equivalentes em celular. A ressalva é fora do navegador: programas de escritório e editores antigos ainda recusam o formato. Para uma imagem que vai ser inserida no Word, mantenha o JPG.'
      },
      {
        question: 'A imagem é copiada para algum servidor?',
        answer: 'Não. A conversão acontece no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>Imagens mais leves, site mais rápido</h2>
      <p>Em um site comum, as imagens respondem pela maior parte do peso de cada página. Usar um <strong>conversor de jpg para webp</strong> costuma reduzir de 25% a 35% do tamanho com qualidade equivalente — um ganho direto no tempo de carregamento, sobretudo em conexões móveis.</p>

      <h2>Cuidado com a segunda compressão</h2>
      <p>Uma coisa que raramente se diz: o JPG já é um formato com perdas, então <strong>converter imagem jpg para webp</strong> é comprimir de novo algo que já foi comprimido. O resultado é visualmente bom, mas guarde o original se a imagem ainda for editada — repetir esse ciclo várias vezes acumula degradação.</p>

      <h2>Onde o WebP ainda não serve</h2>
      <p>Navegadores exibem WebP sem problema. Programas de escritório e editores antigos, nem sempre. Para uma imagem destinada a um documento em vez de a uma página, o JPG continua sendo a escolha segura.</p>
    `
  },
  {
    en: 'xls-to-pdf',
    slug: 'xls-para-pdf',
    name: 'XLS para PDF',
    title: 'Converter XLS para PDF Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta planilhas antigas .xls em PDF com tabelas reais e texto selecionável, direto no navegador.',
    headline: 'XLS para PDF.',
    subtitle: 'Converta planilhas no formato antigo .xls em PDF com tabelas de verdade — sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter uma planilha .xls antiga em PDF, adicione o arquivo na ferramenta acima e baixe um PDF em que cada aba é desenhada como uma tabela real, com bordas e cabeçalho sombreado que se repete nas quebras de página. O texto continua selecionável e pesquisável, em vez de virar uma imagem. Tudo acontece no seu navegador.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'Qual a diferença entre .xls e .xlsx aqui?',
        answer: 'O .xls é o formato binário do Excel anterior a 2007 e o .xlsx é o atual. Esta página trata do antigo; para planilhas modernas use <a href="/pt/excel-para-pdf/">Excel para PDF</a>. O resultado é o mesmo — a diferença está apenas em como o arquivo de origem é lido.'
      },
      {
        question: 'O texto do PDF fica selecionável?',
        answer: 'Sim. As tabelas são desenhadas como elementos vetoriais reais, então o texto pode ser copiado, pesquisado e continua nítido em qualquer zoom — não é uma captura de tela da planilha.'
      },
      {
        question: 'Todas as abas são incluídas?',
        answer: 'Sim, cada aba começa em uma página própria com o nome dela como título. O conversor lê o intervalo utilizado da planilha, não a área de impressão configurada no Excel, e colunas ocultas continuam aparecendo. Para excluir algo, apague as linhas e colunas antes de converter.'
      },
      {
        question: 'A planilha é copiada para algum servidor?',
        answer: 'Não. A leitura e a geração do PDF acontecem no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>Planilhas antigas que ainda circulam</h2>
      <p>O formato .xls foi substituído em 2007, mas continua aparecendo em sistemas legados, exportações de ERP e arquivos guardados há anos. Um <strong>conversor de xls para pdf</strong> resolve o caso em que o destinatário não precisa da planilha — precisa de um documento que abra em qualquer lugar e não possa ser alterado por engano.</p>

      <h2>Tabelas de verdade, não imagens</h2>
      <p>Cada aba vira uma tabela vetorial com bordas e cabeçalho repetido nas quebras de página, e o texto permanece selecionável. Isso importa quando o PDF será lido em tela, indexado ou usado como fonte para copiar valores.</p>

      <h2>O que o conversor lê</h2>
      <p>Ele usa o intervalo utilizado da planilha, e não a área de impressão. Colunas ocultas continuam saindo no PDF. Para controlar exatamente o que aparece, apague as linhas e colunas indesejadas antes de converter — ocultá-las não basta.</p>
    `
  },
  {
    en: 'csv-to-pdf',
    slug: 'csv-para-pdf',
    name: 'CSV para PDF',
    title: 'Converter CSV para PDF Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta arquivos CSV em PDF com tabela formatada e cabeçalho repetido, direto no navegador.',
    headline: 'CSV para PDF.',
    subtitle: 'Transforme um CSV em uma tabela apresentável em PDF — sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter CSV para PDF, solte o arquivo .csv na ferramenta acima e baixe o PDF. As linhas são desenhadas como uma tabela real, com bordas e um cabeçalho sombreado que se repete a cada quebra de página, e o texto continua selecionável e pesquisável. A conversão acontece inteiramente no seu navegador.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'Por que converter um CSV em PDF?',
        answer: 'Porque um CSV é texto cru: abre diferente em cada programa, não tem formatação e frequentemente aparece desalinhado para quem recebe. O PDF fixa a apresentação — a tabela chega igual para todo mundo e não pode ser alterada por engano.'
      },
      {
        question: 'O cabeçalho se repete nas páginas seguintes?',
        answer: 'Sim. Em tabelas longas, o cabeçalho é redesenhado no topo de cada página, o que é a diferença entre um relatório legível e uma sequência de números sem contexto a partir da segunda folha.'
      },
      {
        question: 'Acentos aparecem corretamente?',
        answer: 'Sim, para arquivos em UTF-8, que é o padrão atual. Um CSV antigo salvo em outra codificação pode exibir caracteres trocados — nesse caso reabra o arquivo em um editor, salve como UTF-8 e converta novamente.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. A leitura do CSV e a geração do PDF acontecem no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>De texto cru para um documento apresentável</h2>
      <p>Um CSV não tem formatação, largura de coluna nem cabeçalho fixo — é texto separado por vírgulas, e cada programa o exibe de um jeito. Ao <strong>converter arquivo csv para pdf</strong>, você fixa a apresentação: a tabela chega idêntica a quem receber.</p>

      <h2>Tabelas longas continuam legíveis</h2>
      <p>O cabeçalho se repete a cada quebra de página, e as bordas separam as colunas visualmente. É o que distingue um relatório utilizável de páginas de números sem referência.</p>

      <h2>Codificação</h2>
      <p>Arquivos em UTF-8 preservam acentuação normalmente. Se o CSV vier de um sistema antigo em outra codificação, os acentos podem sair trocados — reabrir e salvar como UTF-8 antes resolve.</p>
    `
  },
  {
    en: 'xls-to-csv',
    slug: 'xls-para-csv',
    name: 'XLS para CSV',
    title: 'Converter XLS para CSV Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta planilhas antigas .xls em CSV limpo direto no navegador, com vírgulas e aspas escapadas corretamente.',
    headline: 'XLS para CSV.',
    subtitle: 'Transforme uma planilha .xls antiga em CSV limpo, pronto para importar — sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter uma planilha .xls antiga em CSV, selecione o arquivo na ferramenta acima e baixe a primeira aba como texto separado por vírgulas, que qualquer banco de dados, script ou assistente de importação consegue ler. Valores que contêm vírgulas ou aspas são escapados corretamente. Tudo acontece no seu navegador.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'como converter xls para csv',
        answer: 'Arraste o arquivo .xls para a ferramenta no topo da página e baixe o .csv. A primeira aba é exportada, com escapamento correto de vírgulas e aspas, em UTF-8 — pronto para importar em um sistema ou processar em um script.'
      },
      {
        question: 'converter xls para csv no excel',
        answer: 'No Excel, o caminho é Arquivo, Salvar como, e escolher "CSV (separado por vírgulas)". Funciona, mas tem duas armadilhas: o Excel usa o separador do sistema, que em configurações brasileiras costuma ser o ponto e vírgula em vez da vírgula, e a codificação padrão nem sempre é UTF-8 — o que faz acentos virarem símbolos estranhos no sistema de destino. A ferramenta aqui usa vírgula e UTF-8 sempre.'
      },
      {
        question: 'qual a diferença de csv para xls',
        answer: 'O .xls é um formato binário do Excel: guarda várias abas, fórmulas, formatação, larguras de coluna e gráficos. O CSV é texto puro, uma tabela só, sem fórmulas nem formatação — apenas os valores separados por vírgula. Por isso o CSV é universal e leve, e por isso ele perde tudo o que não for valor.'
      },
      {
        question: 'E as outras abas da planilha?',
        answer: 'O CSV guarda uma única tabela, então apenas a primeira aba é exportada. Se você precisa de outra, mova-a para a primeira posição no Excel antes de converter, ou converta uma vez por aba.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. A leitura da planilha e a geração do CSV acontecem no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>O formato antigo do Excel</h2>
      <p>O .xls foi substituído pelo .xlsx em 2007, mas continua saindo de sistemas legados e exportações de ERP. Um <strong>conversor xls para csv</strong> é normalmente o passo anterior a uma importação: o sistema de destino aceita CSV, e a planilha antiga precisa virar texto.</p>

      <h2>Por que não apenas salvar como CSV no Excel</h2>
      <p>Funciona, com duas ressalvas conhecidas. O Excel usa o separador de listas do sistema operacional — em configurações brasileiras, geralmente o ponto e vírgula —, o que gera um arquivo que o destino recusa quando ele espera vírgula. E a codificação padrão nem sempre é UTF-8, o que transforma acentos em símbolos estranhos do outro lado. Aqui a saída é sempre vírgula e UTF-8.</p>

      <h2>Uma tabela por arquivo</h2>
      <p>CSV não tem abas. A primeira é exportada; se você precisa de outra, mova-a para o início antes de converter.</p>
    `
  },
  {
    en: 'xml-to-csv',
    slug: 'xml-para-csv',
    name: 'XML para CSV',
    title: 'Converter XML para CSV Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta arquivos XML em tabela CSV direto no navegador, com elementos repetidos virando linhas e XML malformado reportado como erro.',
    headline: 'XML para CSV.',
    subtitle: 'Achate um XML em uma tabela CSV — com erros de sintaxe apontados em vez de ignorados.',
    quickAnswer: 'Para converter XML para CSV, selecione o arquivo .xml na ferramenta acima e baixe uma tabela separada por vírgulas: elementos repetidos viram linhas e seus campos filhos viram colunas. XML malformado — uma tag não fechada, um caractere inválido — é reportado como erro em vez de gerar uma saída incompleta. Tudo acontece no seu navegador.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'como converter xml para csv',
        answer: 'Arraste o arquivo .xml para a ferramenta e baixe o .csv. Os elementos que se repetem no documento viram as linhas da tabela, e os campos dentro de cada um viram as colunas — que é a estrutura que quase todo XML de exportação segue.'
      },
      {
        question: 'E se o XML tiver muitos níveis aninhados?',
        answer: 'Uma tabela é plana e o XML é hierárquico, então estruturas profundamente aninhadas não têm tradução direta: só o nível repetido principal e seus campos filhos entram como linhas e colunas. XMLs de exportação de sistemas costumam ter exatamente essa forma e convertem bem; documentos muito hierárquicos precisam de um tratamento anterior.'
      },
      {
        question: 'O que acontece se o XML estiver quebrado?',
        answer: 'A conversão para com uma mensagem, em vez de devolver uma tabela silenciosamente incompleta. A leitura é feita por uma análise real de DOM, o que também faz da ferramenta um jeito rápido de descobrir por que outro sistema está recusando o arquivo.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. A análise e a geração do CSV acontecem no seu navegador, no seu dispositivo — o que importa porque XMLs no Brasil costumam ser notas fiscais eletrônicas.'
      }
    ],
    content: `
      <h2>De hierarquia para tabela</h2>
      <p>Um <strong>conversor de xml para csv</strong> resolve um descompasso estrutural: o XML representa hierarquia, o CSV representa uma grade. A conversão funciona bem quando o documento tem um elemento que se repete — cada repetição vira uma linha e seus campos viram colunas. É exatamente a forma de quase toda exportação de sistema.</p>

      <h2>Erros apontados, não ignorados</h2>
      <p>A leitura usa uma análise real de DOM. Um XML malformado interrompe a conversão com uma mensagem em vez de produzir uma tabela parcial — e isso costuma responder em segundos por que outro sistema está recusando o arquivo.</p>

      <h2>Notas fiscais não precisam sair da máquina</h2>
      <p>No Brasil, XML quase sempre significa nota fiscal eletrônica. Aqui a conversão acontece dentro do navegador e nada é copiado para nenhum servidor.</p>
    `
  },
  {
    en: 'xml-to-xlsx',
    slug: 'xml-para-xlsx',
    name: 'XML para XLSX',
    title: 'Converter XML para Excel Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta arquivos XML em planilha Excel (.xlsx) com células tipadas, direto no navegador.',
    headline: 'XML para XLSX.',
    subtitle: 'Transforme um XML em planilha Excel pronta para ordenar e filtrar — sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter XML para Excel, selecione o arquivo .xml na ferramenta acima e baixe uma pasta .xlsx nativa com células tipadas, pronta para ordenar, filtrar e usar em tabelas dinâmicas. Elementos repetidos viram linhas e seus campos filhos viram colunas. XML malformado é reportado como erro em vez de gerar uma planilha incompleta.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'Por que .xlsx e não CSV?',
        answer: 'O .xlsx carrega a estrutura e os tipos dentro do próprio arquivo, então abre certo na primeira tentativa — sem o Excel adivinhar separador e codificação, que é a origem de colunas coladas e acentos trocados. Se o destino é um sistema que espera texto, <a href="/pt/xml-para-csv/">XML para CSV</a> é a escolha.'
      },
      {
        question: 'As células saem com tipo?',
        answer: 'Números são gravados como números, não como texto, então somar, ordenar e criar tabelas dinâmicas funciona imediatamente. Vale conferir colunas de data, cujo formato de origem no XML pode ser ambíguo.'
      },
      {
        question: 'E se o XML for muito aninhado?',
        answer: 'Uma planilha é plana. O nível que se repete vira as linhas e seus campos filhos viram as colunas; hierarquias mais profundas não têm representação direta e precisam ser achatadas antes.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. A análise e a montagem da planilha acontecem no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>XML direto em planilha, sem passar por CSV</h2>
      <p>O caminho usual — XML para CSV e depois abrir no Excel — esbarra nos dois problemas clássicos do CSV: o separador que o Excel adivinha errado e a codificação que transforma acentos em símbolos. Um <strong>conversor de xml para xlsx</strong> pula essa etapa e entrega uma planilha nativa, que abre certo na primeira tentativa.</p>

      <h2>Células com tipo</h2>
      <p>Números entram como números, prontos para somar e filtrar. Datas merecem conferência, porque o formato no XML de origem nem sempre é inequívoco.</p>

      <h2>O limite da tabela</h2>
      <p>Elementos repetidos viram linhas; seus campos, colunas. Estruturas profundamente aninhadas não cabem em uma grade e precisam ser preparadas antes. E, como em todo o site, o arquivo não é copiado para nenhum servidor.</p>
    `
  },
  {
    en: 'xlsx-to-json',
    slug: 'xlsx-para-json',
    name: 'XLSX para JSON',
    title: 'Converter XLSX para JSON Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta uma planilha Excel em JSON estruturado direto no navegador: cabeçalhos viram chaves e cada linha vira um objeto.',
    headline: 'XLSX para JSON.',
    subtitle: 'Transforme uma planilha Excel em um array de objetos JSON — processado no seu próprio navegador.',
    quickAnswer: 'Para converter Excel para JSON, selecione uma pasta .xlsx na ferramenta acima e baixe a primeira aba como um array de objetos: a linha de cabeçalho vira as chaves e cada linha vira um objeto. É o caminho direto de uma planilha para código, sem passar por CSV. Tudo é processado no seu navegador.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'como fica a estrutura do JSON?',
        answer: 'A primeira linha da planilha é tratada como cabeçalho e cada célula dela vira uma chave. As linhas seguintes viram objetos com essas chaves, reunidos em um único array — o formato que a maioria das APIs e bibliotecas espera receber.'
      },
      {
        question: 'Por que não converter para CSV e depois para JSON?',
        answer: 'Porque o CSV perde a informação de tipo e introduz os problemas de separador e codificação no meio do caminho. Ir direto da planilha para JSON elimina uma etapa em que as coisas costumam quebrar.'
      },
      {
        question: 'E as outras abas?',
        answer: 'A primeira aba é convertida. Se você precisa de outra, mova-a para a primeira posição no Excel antes de converter.'
      },
      {
        question: 'A planilha é copiada para algum servidor?',
        answer: 'Não. A leitura e a conversão acontecem no seu navegador — o que importa porque planilhas convertidas para JSON costumam ser bases de clientes e exportações internas.'
      }
    ],
    content: `
      <h2>Da planilha direto para o código</h2>
      <p>Um <strong>conversor xlsx para json</strong> encurta o caminho mais comum entre quem trabalha com planilhas e quem trabalha com código. A linha de cabeçalho vira as chaves, cada linha vira um objeto, e o resultado é um array pronto para consumir.</p>

      <h2>Sem escala no CSV</h2>
      <p>Passar pelo CSV no meio do caminho acrescenta dois pontos de falha — o separador que o Excel escolhe e a codificação do arquivo. Ir direto evita ambos.</p>

      <h2>Processamento local</h2>
      <p>Planilhas que viram JSON costumam ser bases de clientes, catálogos e exportações internas. Aqui tudo acontece dentro do navegador e nada é copiado para nenhum servidor.</p>
    `
  },
  {
    en: 'xls-to-json',
    slug: 'xls-para-json',
    name: 'XLS para JSON',
    title: 'Converter XLS para JSON Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta uma planilha antiga .xls em JSON estruturado direto no navegador, sem etapas intermediárias.',
    headline: 'XLS para JSON.',
    subtitle: 'Transforme uma planilha .xls antiga em array de objetos JSON — processado no seu próprio navegador.',
    quickAnswer: 'Para converter uma planilha .xls antiga em JSON, selecione o arquivo na ferramenta acima e baixe a primeira aba como um array de objetos, com a linha de cabeçalho fornecendo as chaves e cada linha virando um objeto. É o caminho mais curto de uma planilha legada para código. Tudo é processado no seu navegador.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'Qual a diferença para o XLSX para JSON?',
        answer: 'Apenas o formato de entrada. O .xls é o binário do Excel anterior a 2007; o <a href="/pt/xlsx-para-json/">.xlsx</a> é o atual. A saída JSON é idêntica — cabeçalho como chaves, uma linha por objeto.'
      },
      {
        question: 'Preciso converter o .xls para .xlsx antes?',
        answer: 'Não. A ferramenta lê o formato antigo diretamente, o que evita uma etapa intermediária no Excel. É justamente o caso em que arquivos vindos de sistemas legados costumam travar.'
      },
      {
        question: 'Os tipos são preservados?',
        answer: 'Números vêm como números sempre que a planilha os armazena assim. Datas merecem conferência: em planilhas antigas o formato de data é frequentemente ambíguo, e vale validar o resultado antes de usar em produção.'
      },
      {
        question: 'A planilha é copiada para algum servidor?',
        answer: 'Não. A leitura e a conversão acontecem no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>Planilhas legadas, direto para JSON</h2>
      <p>Arquivos .xls ainda saem de sistemas antigos e exportações de ERP. Um <strong>conversor xls para json</strong> lê o formato binário diretamente, sem exigir que você abra a planilha no Excel e a salve novamente como .xlsx só para poder converter.</p>

      <h2>A estrutura</h2>
      <p>Cabeçalho vira chaves, cada linha vira um objeto, tudo dentro de um array. O formato que APIs e bibliotecas esperam.</p>

      <h2>Confira as datas</h2>
      <p>Planilhas antigas guardam datas de maneiras inconsistentes. Números e texto atravessam bem; colunas de data merecem uma validação antes de irem para produção.</p>
    `
  },
  {
    en: 'qbo-to-csv',
    slug: 'qbo-para-csv',
    name: 'QBO para CSV',
    title: 'Converter QBO para CSV Online Grátis — Extrato Bancário | ConvertOcean',
    description: 'Converta arquivos .qbo do Web Connect em CSV ou Excel direto no navegador, quando o QuickBooks recusa o arquivo do banco.',
    headline: 'QBO para CSV.',
    subtitle: 'Transforme um arquivo .qbo em planilha para revisar as transações antes de importar — sem que o extrato saia do seu computador.',
    quickAnswer: 'Para converter QBO para CSV, selecione o arquivo .qbo do Web Connect na ferramenta acima e baixe as transações em CSV ou Excel. É a saída usual quando o QuickBooks recusa o arquivo QBO de um banco, e permite revisar as linhas antes de importar. O extrato é lido dentro do seu navegador e não sai do seu computador.',
    category: 'Ferramentas Empresariais',
    faqs: [
      {
        question: 'O que é um arquivo QBO?',
        answer: 'É o formato Web Connect que bancos disponibilizam para importação direta no QuickBooks. Ele é uma variante do OFX, com campos específicos exigidos pelo QuickBooks — e é justamente essa rigidez que faz o programa recusar arquivos de alguns bancos.'
      },
      {
        question: 'Por que o QuickBooks recusa o arquivo do meu banco?',
        answer: 'Normalmente por um detalhe de formato: um identificador de instituição que o programa não reconhece, uma data fora do padrão esperado ou um campo ausente. Converter para CSV contorna a importação direta e ainda permite revisar as transações antes de levá-las para o sistema.'
      },
      {
        question: 'Posso baixar em Excel em vez de CSV?',
        answer: 'Sim, há a opção de gerar uma pasta .xlsx. Ela evita o problema de o Excel abrir um CSV com tudo em uma coluna só, já que a estrutura das colunas viaja dentro do próprio arquivo.'
      },
      {
        question: 'O extrato é copiado para algum servidor?',
        answer: 'Não. A leitura acontece no seu navegador, no seu dispositivo. Um extrato lista cada transação de uma conta — é exatamente o arquivo que não deveria ser enviado a um serviço qualquer.'
      }
    ],
    content: `
      <h2>Quando o QuickBooks recusa o arquivo do banco</h2>
      <p>O .qbo é o formato Web Connect, feito para importação direta no QuickBooks. Ele é rígido quanto a identificadores e formatos de data, e é comum um banco gerar um arquivo que o programa simplesmente não aceita.</p>
      <p>Converter para CSV contorna a importação direta e dá algo que a importação automática não oferece: a chance de revisar as transações antes que elas entrem na contabilidade.</p>

      <h2>CSV ou Excel</h2>
      <p>A saída pode ser um CSV ou uma pasta .xlsx. O .xlsx evita o problema clássico de o Excel abrir um CSV com tudo empilhado em uma coluna, porque já carrega a estrutura das colunas dentro do arquivo.</p>

      <h2>Um extrato não deveria circular</h2>
      <p>Ele registra cada movimentação de uma conta. A leitura acontece dentro do navegador, no seu dispositivo, e o arquivo não é copiado para nenhum servidor.</p>
    `
  }
];

/**
 * ---------------------------------------------------------------------------
 * Keyword-led batch 11 — SVG, image merge/split, spreadsheet merge/split, EXIF.
 * ---------------------------------------------------------------------------
 *
 * `svg para png` and `converter svg para png` are both Easy at >1000. The image
 * split cluster is the surprise: Brazilians attach two specific jobs to it that
 * the English keywords never showed — printing a poster across A4 sheets, and
 * cutting an Instagram carousel. The tool's own description already names
 * social carousels, so that is an exact match; the A4 case is handled honestly
 * on the page, because the tool cuts equal tiles and does not know about paper
 * sizes, margins or overlap.
 *
 * /pt/juntar-fotos/ deliberately targets the STITCHED IMAGE job rather than the
 * PDF one. merge-images can output PDF, but so can /pt/imagem-para-pdf/, and
 * `juntar fotos em pdf` is >1000 — pointing both pages at it would have them
 * competing. This page owns "duas fotos em uma só", which the other cannot do,
 * and links across for the PDF route.
 */
const ptToolsBatch11: PtTool[] = [
  {
    en: 'svg-to-png',
    slug: 'svg-para-png',
    name: 'SVG para PNG',
    title: 'Converter SVG para PNG Online Grátis — Com Transparência | ConvertOcean',
    description: 'Converta SVG em PNG com transparência preservada direto no navegador, com as bordas nítidas em vez de serrilhadas.',
    headline: 'SVG para PNG.',
    subtitle: 'Transforme um vetor SVG em PNG com transparência e bordas nítidas — sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter SVG para PNG, selecione o arquivo .svg na ferramenta acima e baixe um PNG rasterizado com a transparência preservada. Como o SVG não tem dimensão fixa em pixels, a ferramenta escolhe um tamanho de tela adequado e amplia gráficos pequenos, para que bordas e textos saiam nítidos em vez de serrilhados. O PNG é a escolha certa quando a transparência importa.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como converter svg para png',
        answer: 'Arraste o arquivo .svg para a ferramenta no topo da página e baixe o PNG. A transparência do vetor é mantida, então logotipos continuam funcionando sobre qualquer fundo. Não é preciso cadastro nem instalar nada.'
      },
      {
        question: 'Que tamanho tem o PNG gerado?',
        answer: 'Um SVG é vetorial e não tem tamanho fixo em pixels — ele pode ser desenhado em qualquer dimensão. A ferramenta escolhe uma tela adequada e amplia gráficos pequenos, justamente para que o resultado não saia minúsculo ou com bordas serrilhadas. É a diferença entre um ícone utilizável e um borrão de 24 pixels.'
      },
      {
        question: 'Por que converter um vetor em imagem?',
        answer: 'Porque o SVG, apesar de melhor tecnicamente, não é aceito em todo lugar: muitos formulários de envio, editores e plataformas o recusam por ser um formato baseado em código. O PNG é aceito universalmente. A contrapartida é que o resultado deixa de ser redimensionável sem perda.'
      },
      {
        question: 'PNG, JPG ou WebP?',
        answer: 'PNG quando houver transparência ou texto nítido — o caso mais comum com logotipos. <a href="/pt/svg-para-jpg/">JPG</a> quando o destino recusa PNG e não há transparência a preservar. <a href="/pt/svg-para-webp/">WebP</a> para uso na web, porque mantém a transparência com arquivo bem menor.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. A rasterização acontece no seu navegador, no seu dispositivo, e o arquivo não é copiado para nenhum servidor.'
      }
    ],
    content: `
      <h2>De vetor para imagem</h2>
      <p>Um SVG é código que descreve formas, não uma grade de pixels — por isso ele escala infinitamente sem perder qualidade. Um <strong>conversor de svg para png</strong> desenha esse código uma vez, em uma resolução fixa, e entrega uma imagem comum.</p>
      <p>Você faz isso quando o destino não aceita SVG, o que é frequente: formulários de envio, editores de imagem e várias plataformas recusam o formato por ele ser, tecnicamente, um arquivo de texto com marcação.</p>

      <h2>O tamanho importa mais do que parece</h2>
      <p>Como o SVG não traz dimensão em pixels, a rasterização precisa escolher uma. Ferramentas que escolhem mal entregam um ícone de 24 pixels borrado. Aqui gráficos pequenos são ampliados para uma tela adequada, de modo que <strong>converter imagem svg para png</strong> produza bordas e texto nítidos.</p>

      <h2>A transparência sobrevive</h2>
      <p>Logotipos em SVG quase sempre têm fundo transparente, e o PNG preserva isso — motivo pelo qual ele é a escolha padrão aqui. Se o destino não aceitar PNG e não houver transparência em jogo, o <a href="/pt/svg-para-jpg/">JPG</a> resolve com arquivo menor.</p>
    `
  },
  {
    en: 'svg-to-jpg',
    slug: 'svg-para-jpg',
    name: 'SVG para JPG',
    title: 'Converter SVG para JPG Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta arquivos SVG em JPG direto no navegador, com bordas nítidas e fundo branco no lugar da transparência.',
    headline: 'SVG para JPG.',
    subtitle: 'Transforme um vetor SVG em JPG aceito em qualquer lugar — sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para converter SVG para JPG, selecione o arquivo .svg na ferramenta acima e baixe um JPG rasterizado. Como o SVG é vetorial e não tem tamanho fixo em pixels, a ferramenta escolhe uma tela adequada e amplia gráficos pequenos para que as bordas saiam nítidas. O JPG não tem transparência, então qualquer fundo transparente é achatado sobre branco.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como converter svg para jpg',
        answer: 'Arraste o .svg para a ferramenta e baixe o .jpg. O resultado abre em qualquer programa e passa em formulários que recusam tanto SVG quanto PNG.'
      },
      {
        question: 'O que acontece com o fundo transparente?',
        answer: 'É achatado sobre branco, porque o JPG não tem canal de transparência. Para um logotipo que será usado sobre fundo colorido, isso deixa um retângulo branco visível — nesse caso use <a href="/pt/svg-para-png/">SVG para PNG</a>, que preserva a transparência.'
      },
      {
        question: 'Quando o JPG é a escolha certa?',
        answer: 'Quando o SVG tem áreas de imagem fotográfica ou gradientes complexos, e o destino aceita apenas JPG. Para gráficos com cor chapada, linhas finas e texto — o conteúdo típico de um SVG — o PNG sai visivelmente mais limpo, porque o JPG cria artefatos ao redor das bordas.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. Tudo acontece no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>Quando o destino só aceita JPG</h2>
      <p>É a única razão real para escolher este caminho em vez do PNG. O conteúdo típico de um SVG — linhas finas, texto, cor chapada — é exatamente o que a compressão do JPG trata pior, criando pequenos artefatos nas bordas. Ainda assim, há formulários e sistemas que aceitam apenas JPG, e aí o <strong>conversor svg para jpg</strong> resolve.</p>

      <h2>A transparência não sobrevive</h2>
      <p>O JPG não tem canal alfa: o fundo transparente vira branco. Para um logotipo que vai sobre outra cor, isso é visível e definitivo — <a href="/pt/svg-para-png/">SVG para PNG</a> é o caminho nesse caso.</p>

      <h2>Bordas nítidas</h2>
      <p>Como o SVG não tem tamanho em pixels, gráficos pequenos são ampliados antes de serem desenhados, para que o resultado não saia serrilhado.</p>
    `
  },
  {
    en: 'svg-to-webp',
    slug: 'svg-para-webp',
    name: 'SVG para WebP',
    title: 'Converter SVG para WebP Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta SVG em WebP direto no navegador: bem menor que o PNG equivalente, com a transparência preservada.',
    headline: 'SVG para WebP.',
    subtitle: 'Rasterize um vetor em WebP — transparência preservada e arquivo bem menor que o PNG.',
    quickAnswer: 'Para converter SVG para WebP, selecione o arquivo .svg na ferramenta acima e baixe um WebP rasterizado, normalmente bem menor que o PNG equivalente com qualidade parecida e com a transparência preservada. O vetor é desenhado em uma tela de tamanho adequado, e gráficos pequenos são ampliados para que as bordas fiquem nítidas. O WebP é a escolha certa para imagens na web.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'Por que WebP em vez de PNG?',
        answer: 'Porque entrega o mesmo — inclusive a transparência — em um arquivo bem menor, o que acelera o carregamento das páginas. Para uso na web é quase sempre a escolha melhor. Fora do navegador, porém, muitos programas ainda recusam WebP: para um documento do Word, prefira <a href="/pt/svg-para-png/">PNG</a>.'
      },
      {
        question: 'A transparência é mantida?',
        answer: 'Sim. O WebP suporta canal alfa, então logotipos e ícones continuam funcionando sobre qualquer fundo.'
      },
      {
        question: 'Se o SVG já é leve, por que rasterizar?',
        answer: 'Um SVG costuma ser menor ainda e escala sem perda — quando o destino o aceita, mantê-lo é melhor. A conversão faz sentido quando a plataforma recusa SVG por segurança (é um formato que pode conter script) ou quando a imagem precisa ser tratada como bitmap pelo sistema de destino.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. A rasterização acontece no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>O melhor dos dois, para a web</h2>
      <p>O WebP combina o que o PNG e o JPG oferecem separadamente: transparência e arquivos pequenos. Ao usar um <strong>conversor svg para webp</strong>, você troca um vetor por um bitmap leve que qualquer navegador moderno exibe.</p>

      <h2>Quando não converter</h2>
      <p>Se a plataforma aceita SVG, mantê-lo é melhor: ele é menor ainda e escala sem perda. A conversão faz sentido quando o SVG é recusado — por política de segurança, já que um SVG pode conter script, ou porque o sistema de destino trabalha apenas com bitmaps.</p>

      <h2>Fora do navegador, prefira PNG</h2>
      <p>Programas de escritório e editores antigos ainda recusam WebP. Para um arquivo destinado a um documento em vez de a uma página, <a href="/pt/svg-para-png/">SVG para PNG</a> é a escolha segura.</p>
    `
  },
  {
    en: 'split-image',
    slug: 'dividir-imagem',
    name: 'Dividir Imagem',
    title: 'Dividir Imagem em Partes Online Grátis — Carrossel e A4 | ConvertOcean',
    description: 'Divida uma imagem em partes iguais, grade, tiras ou colunas direto no navegador — para carrossel do Instagram ou para imprimir em várias folhas.',
    headline: 'Dividir Imagem.',
    subtitle: 'Corte uma imagem em grade, tiras ou colunas — cada parte baixa em resolução total, sem que a foto saia do seu dispositivo.',
    quickAnswer: 'Para dividir uma imagem, selecione um PNG, JPG ou WebP na ferramenta acima e escolha o corte: uma grade de linhas e colunas, fatias horizontais iguais ou fatias verticais iguais. Cada pedaço é baixado como uma imagem separada, em resolução total — o que atende carrosséis de redes sociais, folhas de sprites e digitalizações grandes. O corte acontece no seu dispositivo.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como dividir uma imagem em 4 partes',
        answer: 'Escolha a grade de 2 linhas por 2 colunas e baixe. Cada uma das quatro partes sai como um arquivo separado, em resolução total — sem redução de qualidade em relação ao original.'
      },
      {
        question: 'como dividir imagem em 4 partes',
        answer: 'Além da grade, há a opção de fatias horizontais ou verticais: quatro tiras deitadas ou quatro colunas em pé, conforme o formato da imagem. Para uma imagem panorâmica, as colunas costumam fazer mais sentido que a grade.'
      },
      {
        question: 'como dividir uma imagem em 4 partes para imprimir',
        answer: 'Escolha a grade correspondente ao número de folhas — 2×2 para quatro folhas — e imprima cada parte em uma página, ajustando para preencher a folha na caixa de impressão. Vale saber o limite: a ferramenta corta em partes iguais e não conhece tamanhos de papel, então ela não acrescenta margem de sobreposição nem compensa a área não imprimível da impressora. Para um cartaz, deixe uma pequena borda de segurança na imagem original antes de cortar.'
      },
      {
        question: 'como dividir imagem para imprimir',
        answer: 'O procedimento é o mesmo, e a decisão importante é a resolução de origem. Uma imagem ampliada para várias folhas fica com a resolução dividida entre elas: uma foto de 2.000 pixels de largura espalhada por quatro folhas A4 imprime com cerca de metade da nitidez que teria em uma folha só. Comece com a maior resolução que tiver.'
      },
      {
        question: 'como dividir uma imagem em várias folhas a4',
        answer: 'Defina a grade pelo número de folhas desejado — 2×2 para quatro, 3×3 para nove — e imprima cada arquivo em uma folha. A proporção da A4 não é idêntica à da maioria das fotos, então haverá alguma sobra: escolher "ajustar à página" na impressão resolve, ao custo de uma margem branca desigual.'
      },
      {
        question: 'como dividir uma imagem em 6 partes para imprimir',
        answer: 'Use uma grade de 2×3 ou 3×2, conforme a imagem seja mais alta ou mais larga. Escolher a orientação errada é o erro mais comum: uma imagem deitada cortada em 3 linhas por 2 colunas distorce a proporção de cada folha.'
      },
      {
        question: 'Serve para carrossel do Instagram?',
        answer: 'Sim, é um dos usos principais. Para um carrossel, use fatias verticais: uma imagem larga dividida em colunas iguais gera os quadros na ordem, prontos para publicar em sequência. Cada parte sai em resolução total, então não há perda ao subir.'
      },
      {
        question: 'A imagem é copiada para algum servidor?',
        answer: 'Não. O corte acontece no seu navegador, no seu dispositivo, e nem a imagem original nem as partes são copiadas para nenhum servidor.'
      }
    ],
    content: `
      <h2>Três formas de cortar</h2>
      <p>Grade de linhas e colunas, fatias horizontais ou fatias verticais. Cada pedaço é baixado como arquivo próprio, em resolução total — nada é reduzido no processo.</p>

      <h2>Carrossel: use fatias verticais</h2>
      <p><strong>Dividir imagem carrossel</strong> é o caso mais direto: uma imagem larga cortada em colunas iguais vira a sequência de quadros, na ordem. Como as partes saem em resolução total, não há perda ao publicar.</p>

      <h2>Imprimir em várias folhas A4: o que a ferramenta faz e o que não faz</h2>
      <p>Para <strong>dividir imagem em folhas a4 para imprimir</strong>, escolha a grade correspondente ao número de folhas e imprima cada arquivo em uma página. Dito com clareza: a ferramenta corta em partes iguais e <em>não</em> conhece tamanhos de papel — ela não acrescenta margem de sobreposição para colagem nem compensa a área que a impressora não alcança. Deixe uma borda de segurança na imagem antes de cortar, e conte com um pequeno ajuste ao montar.</p>
      <p>O outro ponto é resolução. Uma imagem espalhada por quatro folhas imprime com metade da nitidez por folha: comece com o maior arquivo que tiver.</p>

      <h2>Nada sai do seu dispositivo</h2>
      <p>O corte é feito pelo navegador. Nem a imagem original nem as partes são copiadas para nenhum servidor.</p>
    `
  },
  {
    en: 'merge-images',
    slug: 'juntar-fotos',
    name: 'Juntar Fotos',
    title: 'Juntar Fotos em Uma Só Online Grátis — 100% Privado | ConvertOcean',
    description: 'Junte duas ou mais fotos em uma única imagem, na vertical ou na horizontal, direto no navegador. As fotos não saem do seu dispositivo.',
    headline: 'Juntar Fotos.',
    subtitle: 'Combine várias fotos em uma imagem só — na vertical ou na horizontal, sem que elas saiam do seu dispositivo.',
    quickAnswer: 'Para juntar fotos, adicione as imagens na ferramenta acima e escolha a saída: uma única imagem costurada na vertical ou na horizontal, ou um PDF com uma imagem por página. São aceitos PNG, JPG, WebP e SVG, e imagens de larguras diferentes são alinhadas em vez de esticadas. Tudo é montado no seu navegador e as fotos não saem do seu dispositivo.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como juntar duas fotos em uma só',
        answer: 'Adicione as duas imagens e escolha a junção vertical, para empilhar uma sobre a outra, ou horizontal, para colocá-las lado a lado. O resultado é uma única imagem. Se as fotos tiverem larguras diferentes, elas são alinhadas em vez de esticadas — nada fica deformado.'
      },
      {
        question: 'como juntar duas fotos',
        answer: 'A escolha entre vertical e horizontal depende do formato: fotos em pé costumam ficar melhor lado a lado, fotos deitadas empilhadas. Vale testar as duas — a montagem é instantânea e não há limite de tentativas.'
      },
      {
        question: 'como juntar 2 fotos em 1',
        answer: 'Adicione as duas, escolha a direção e baixe. A ordem em que aparecem na tela é a ordem na imagem final, e ela segue a sequência em que as fotos foram escolhidas — adicione primeiro a que deve vir primeiro.'
      },
      {
        question: 'como juntar varias fotos em uma só',
        answer: 'O procedimento é idêntico com qualquer quantidade. Para muitas fotos, considere a direção com cuidado: dez imagens empilhadas na vertical geram uma tira muito longa e estreita, difícil de visualizar. Nesses casos, um <a href="/pt/imagem-para-pdf/">PDF com uma foto por página</a> costuma ser mais prático.'
      },
      {
        question: 'como juntar fotos em uma só',
        answer: 'A saída padrão é uma imagem costurada. Se o que você precisa é um único arquivo para anexar, e não uma imagem composta, o caminho é <a href="/pt/imagem-para-pdf/">JPG para PDF</a>, que gera um PDF com uma foto por página e é o formato que a maioria dos sistemas espera.'
      },
      {
        question: 'como unir duas imagens',
        answer: 'São aceitos PNG, JPG, WebP e SVG, inclusive misturados na mesma montagem. A imagem final sai no formato adequado ao conteúdo, preservando transparência quando as origens a tinham.'
      },
      {
        question: 'As fotos são copiadas para algum servidor?',
        answer: 'Não. A montagem acontece no seu navegador, no seu dispositivo. Fotos carregam metadados como localização e modelo do aparelho, e nada é copiado para nenhum servidor.'
      }
    ],
    content: `
      <h2>Uma imagem, não um álbum</h2>
      <p>Esta página resolve o caso de <strong>juntar fotos em uma só</strong>: duas ou mais imagens costuradas em um único arquivo, lado a lado ou empilhadas. É o que se quer para um antes e depois, uma comparação ou uma montagem simples.</p>
      <p>Se o objetivo é outro — reunir várias fotos em um único anexo para enviar — o caminho é <a href="/pt/imagem-para-pdf/">JPG para PDF</a>, que coloca uma foto por página. São jobs diferentes e vale escolher o certo.</p>

      <h2>Larguras diferentes não deformam</h2>
      <p>Ao <strong>unir imagens</strong> de tamanhos distintos, elas são alinhadas em vez de esticadas até coincidirem. É a diferença entre uma montagem e duas fotos distorcidas.</p>

      <h2>Vertical ou horizontal</h2>
      <p>Fotos em pé costumam funcionar lado a lado; fotos deitadas, empilhadas. Com muitas imagens, a junção vira uma tira longa e o PDF passa a ser mais prático.</p>

      <h2>Sem aplicativo, sem servidor</h2>
      <p>Quem procura <strong>aplicativo para juntar fotos</strong> normalmente não precisa instalar nada: isto funciona no navegador do celular igual ao do computador, e as fotos não são copiadas para lugar nenhum.</p>
    `
  },
  {
    en: 'merge-excel',
    slug: 'unir-arquivos-excel',
    name: 'Unir Arquivos Excel',
    title: 'Unir Arquivos Excel e CSV Online Grátis | ConvertOcean',
    description: 'Combine várias planilhas Excel ou CSV em uma única pasta de trabalho direto no navegador, com cada aba identificada pela origem.',
    headline: 'Unir Arquivos Excel.',
    subtitle: 'Reúna várias planilhas em uma só pasta de trabalho, com cada aba identificada pelo arquivo de origem.',
    quickAnswer: 'Para unir arquivos Excel, adicione dois ou mais arquivos .xlsx, .xls ou .csv na ferramenta acima e baixe uma única pasta de trabalho com todas as abas de origem. Cada aba é renomeada para arquivo_aba — cortada no limite de 31 caracteres do Excel e numerada se ainda houver colisão —, então sempre dá para saber de onde cada uma veio. Tudo acontece no seu navegador.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'como unir varios arquivos excel em um só',
        answer: 'Adicione todos os arquivos de uma vez e baixe a pasta de trabalho combinada. Cada aba de cada arquivo entra como uma aba própria, nomeada com a origem — o que evita o problema clássico de terminar com cinco abas chamadas "Planilha1".'
      },
      {
        question: 'como mesclar planilhas no excel',
        answer: 'Dentro do Excel, o caminho é copiar e colar aba por aba, ou usar o Power Query para consolidar dados. Funciona, mas é trabalhoso com muitos arquivos e o Power Query exige configuração. Esta ferramenta resolve o caso simples — reunir tudo em uma pasta só — em um passo, sem instalar nem configurar nada.'
      },
      {
        question: 'como mesclar duas planilhas no excel',
        answer: 'Com dois arquivos, adicione os dois e baixe. Vale a distinção: aqui as abas são reunidas lado a lado na mesma pasta, não fundidas linha a linha em uma tabela única. Se o objetivo é empilhar os dados de duas planilhas em uma só tabela, isso é consolidação e precisa do Power Query ou de uma cópia manual.'
      },
      {
        question: 'como unir arquivos csv',
        answer: 'Arquivos .csv também são aceitos e entram como abas da pasta resultante. Como cada CSV é uma tabela única, cada um vira uma aba com o nome do arquivo.'
      },
      {
        question: 'Os arquivos são copiados para algum servidor?',
        answer: 'Não. A leitura e a montagem acontecem no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>Abas reunidas, origem preservada</h2>
      <p>O problema de juntar planilhas manualmente não é o esforço — é perder o rastro. Cinco arquivos copiados para um só deixam cinco abas chamadas "Planilha1", "Planilha1 (2)" e assim por diante. Aqui cada aba é renomeada para <em>arquivo_aba</em>, cortada no limite de 31 caracteres do Excel e numerada se ainda houver colisão.</p>

      <h2>Reunir não é consolidar</h2>
      <p>Vale a distinção, porque as buscas misturam as duas. <strong>Unir arquivos excel</strong> aqui significa colocar todas as abas na mesma pasta de trabalho. Empilhar os dados de várias planilhas em uma única tabela é consolidação — outro trabalho, que no Excel se faz com Power Query.</p>

      <h2>CSV também entra</h2>
      <p>Arquivos .csv são aceitos junto com .xlsx e .xls, cada um virando uma aba nomeada pela origem. Tudo processado dentro do navegador, sem cópia para servidor nenhum.</p>
    `
  },
  {
    en: 'split-excel',
    slug: 'dividir-arquivo-excel',
    name: 'Dividir Arquivo Excel',
    title: 'Dividir Arquivo Excel e CSV Online Grátis | ConvertOcean',
    description: 'Separe cada aba de uma planilha em arquivos próprios ou divida uma tabela grande por número de linhas, direto no navegador.',
    headline: 'Dividir Arquivo Excel.',
    subtitle: 'Separe cada aba em um arquivo próprio ou parta uma tabela grande em blocos por número de linhas.',
    quickAnswer: 'Para dividir uma planilha, selecione o arquivo .xlsx ou .xls na ferramenta acima e escolha como separá-lo: extrair cada aba em um arquivo próprio, ou partir uma única aba por número de linhas em blocos de tamanho fixo. A saída pode ser .xlsx ou .csv, e todas as abas já vêm selecionadas, de modo que uma divisão simples é um clique.',
    category: 'Conversor de Excel',
    faqs: [
      {
        question: 'como separar planilha excel',
        answer: 'Selecione o arquivo e escolha extrair cada aba em um arquivo próprio. Todas vêm marcadas por padrão, então basta desmarcar as que não interessam. Cada arquivo gerado leva o nome da aba de origem.'
      },
      {
        question: 'como dividir arquivo csv',
        answer: 'Um CSV é uma tabela única, então a divisão é por número de linhas: defina o tamanho do bloco e a ferramenta gera vários arquivos com o cabeçalho repetido em cada um. É o caminho para importações que impõem limite de linhas, ou para partir uma exportação grande demais para abrir.'
      },
      {
        question: 'O cabeçalho se repete em cada parte?',
        answer: 'Sim, ao partir por linhas o cabeçalho é copiado no topo de cada bloco. Sem isso, o segundo arquivo em diante chegaria sem nomes de coluna e o sistema de destino recusaria a importação.'
      },
      {
        question: 'Posso escolher entre .xlsx e .csv na saída?',
        answer: 'Sim. O .xlsx mantém tipos e formatação; o .csv é o que a maioria dos sistemas de importação espera. A escolha depende de para onde os arquivos vão.'
      },
      {
        question: 'A planilha é copiada para algum servidor?',
        answer: 'Não. A leitura e a divisão acontecem no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>Duas formas de dividir</h2>
      <p>Por aba, quando uma pasta de trabalho reúne coisas que deveriam ser arquivos separados. Ou por número de linhas, quando uma tabela única é grande demais para o destino aceitar.</p>

      <h2>Partir por linhas, com cabeçalho</h2>
      <p>Ao <strong>dividir arquivo csv em partes</strong>, o cabeçalho é repetido no topo de cada bloco. É o detalhe que decide se a importação funciona: sem ele, todos os arquivos depois do primeiro chegam sem nomes de coluna.</p>

      <h2>Processamento local</h2>
      <p>Planilhas grandes costumam ser exportações de sistema com dados reais de clientes ou de folha. A divisão acontece dentro do navegador e nada é copiado para nenhum servidor.</p>
    `
  },
  {
    en: 'exif-viewer',
    slug: 'ver-exif',
    name: 'Ver Dados EXIF',
    title: 'Ver Dados EXIF da Foto Online — O Que Sua Imagem Revela | ConvertOcean',
    description: 'Veja todos os metadados de uma foto — localização, aparelho, data e configurações — lidos no seu próprio dispositivo.',
    headline: 'Ver Dados EXIF.',
    subtitle: 'Descubra exatamente o que sua foto registra sobre você — localização, aparelho e horário —, lido na sua própria máquina.',
    quickAnswer: 'Para ver os dados EXIF, selecione uma foto JPG, PNG ou WebP na ferramenta acima e ela lista todas as etiquetas de metadados que o arquivo contém: marca e modelo da câmera, data em que foi tirada, lente, configurações de exposição e eventuais coordenadas de GPS. As etiquetas que identificam uma pessoa, um aparelho ou um lugar são destacadas. A foto é lida no seu dispositivo.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como ver dados da foto',
        answer: 'Arraste a foto para a ferramenta no topo da página e a lista de metadados aparece na tela. Marca e modelo do aparelho, data e hora, configurações de exposição e, quando existirem, as coordenadas de onde a foto foi tirada.'
      },
      {
        question: 'Toda foto tem localização?',
        answer: 'Não. Depende de o GPS estar ativo para a câmera no momento da foto. Muitas redes sociais também removem os metadados ao publicar — mas uma foto enviada por mensagem, e-mail ou como arquivo original geralmente chega com tudo preservado.'
      },
      {
        question: 'Como remover esses dados?',
        answer: 'Use o <a href="/pt/remover-exif/">removedor de EXIF</a>, que apaga localização, número de série e horário sem tocar em um único pixel da imagem. Ver primeiro e remover depois é a ordem sensata: dá para saber exatamente o que havia ali.'
      },
      {
        question: 'A foto é copiada para algum servidor?',
        answer: 'Não, e aqui isso importa mais do que em qualquer outra ferramenta do site. Um visualizador de EXIF que enviasse a foto para um servidor entregaria justamente os dados que você está tentando inspecionar. A leitura acontece inteiramente no seu dispositivo.'
      }
    ],
    content: `
      <h2>O que uma foto guarda além da imagem</h2>
      <p>Cada fotografia carrega um bloco de metadados: o modelo do aparelho, o número de série em alguns casos, a data e a hora exatas, as configurações de exposição e, se o GPS estava ativo, as coordenadas do lugar. <strong>Ver dados da foto</strong> é abrir esse bloco e ler o que está lá.</p>

      <h2>Onde isso costuma surpreender</h2>
      <p>Uma foto enviada como arquivo original — por e-mail, por mensagem, em um anúncio de venda — normalmente leva tudo junto. Redes sociais em geral limpam os metadados ao publicar, o que cria a falsa impressão de que eles nunca estiveram lá.</p>

      <h2>Ler antes de limpar</h2>
      <p>A ordem sensata é inspecionar primeiro e depois usar o <a href="/pt/remover-exif/">removedor de EXIF</a>, para saber exatamente o que foi retirado.</p>

      <h2>A leitura acontece no seu aparelho</h2>
      <p>É a parte que não pode ser diferente: uma ferramenta que enviasse a foto para um servidor para mostrar os seus metadados entregaria exatamente aquilo que você quer verificar. Aqui nada é copiado para lugar nenhum.</p>
    `
  },
  {
    en: 'exif-remover',
    slug: 'remover-exif',
    name: 'Remover EXIF',
    title: 'Remover Dados EXIF da Foto Online — Sem Perder Qualidade | ConvertOcean',
    description: 'Remova localização, dados da câmera e horário de uma foto sem alterar um único pixel da imagem, direto no navegador.',
    headline: 'Remover EXIF.',
    subtitle: 'Apague localização e dados do aparelho sem tocar em um único pixel da imagem.',
    quickAnswer: 'Para remover os dados EXIF, selecione uma foto JPG, PNG ou WebP na ferramenta acima e baixe a cópia limpa. Coordenadas de GPS, marca, modelo e número de série do aparelho, horários, XMP e comentários são apagados, enquanto os dados comprimidos da imagem são copiados byte a byte — então não há nenhuma perda de qualidade, diferente do que acontece ao reencodar a foto.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como remover exif',
        answer: 'Arraste a foto para a ferramenta e baixe a versão limpa. GPS, identificação do aparelho, horários e comentários saem; a imagem em si fica intacta.'
      },
      {
        question: 'A qualidade da foto piora?',
        answer: 'Não, e essa é a diferença em relação aos métodos improvisados. Os dados comprimidos da imagem são copiados byte a byte, sem reencodar — apenas o bloco de metadados é descartado. Tirar print da foto ou salvá-la de novo em outro programa também remove o EXIF, mas recomprime a imagem e degrada a qualidade.'
      },
      {
        question: 'O que exatamente é apagado?',
        answer: 'Coordenadas de GPS, marca, modelo e número de série do aparelho, data e hora, configurações de lente e exposição, blocos XMP e comentários embutidos. Se quiser conferir antes, o <a href="/pt/ver-exif/">visualizador de EXIF</a> lista tudo o que a foto contém.'
      },
      {
        question: 'Quando vale a pena remover?',
        answer: 'Antes de publicar um anúncio de venda com foto tirada em casa, ao enviar imagens para desconhecidos, ao compartilhar fotos de crianças, e em qualquer situação em que o arquivo original — e não uma versão já processada por uma rede social — chegue a outra pessoa.'
      },
      {
        question: 'A foto é copiada para algum servidor?',
        answer: 'Não. A limpeza acontece no seu navegador, no seu dispositivo. Enviar uma foto a um servidor para remover os dados de localização dela entregaria a localização no caminho.'
      }
    ],
    content: `
      <h2>Sem recomprimir a imagem</h2>
      <p>É o que separa esta ferramenta dos métodos improvisados. Tirar uma captura de tela da foto, ou reabri-la e salvar de novo em outro programa, também elimina o EXIF — mas recomprime a imagem e perde qualidade no processo. Aqui os dados comprimidos são copiados byte a byte e apenas o bloco de metadados é descartado.</p>

      <h2>O que sai</h2>
      <p>Coordenadas de GPS, marca, modelo e número de série do aparelho, data e hora, configurações de lente e exposição, blocos XMP e comentários. Se quiser ver o que havia antes, o <a href="/pt/ver-exif/">visualizador</a> lista tudo.</p>

      <h2>Quando isso importa</h2>
      <p>Anúncios de venda com foto tirada dentro de casa, imagens enviadas a desconhecidos, fotos de crianças. Redes sociais costumam limpar os metadados ao publicar — mas o arquivo original enviado por mensagem ou e-mail chega inteiro.</p>

      <h2>A limpeza acontece no seu aparelho</h2>
      <p>Enviar uma foto para um servidor a fim de remover a localização dela entregaria a localização no caminho. Aqui nada é copiado para lugar nenhum.</p>
    `
  }
];

/**
 * ---------------------------------------------------------------------------
 * Keyword-led batch 12 — the last twelve tools. The locale is complete.
 * ---------------------------------------------------------------------------
 *
 * `redimensionar imagem` is Easy at >10,000 — the best volume-to-difficulty
 * ratio found anywhere in the programme, and it was the last tool researched.
 * `contador de palavras` is Medium at >10,000, and its entire question set asks
 * where the counter lives inside Microsoft Word rather than for a web tool, so
 * the page answers that honestly instead of pretending it was a search for us.
 *
 * merge-pptx, split-pptx and qfx-to-csv returned no keywords at all and are
 * built from the tools' own behaviour.
 */
const ptToolsBatch12: PtTool[] = [
  {
    en: 'image-resizer',
    slug: 'redimensionar-imagem',
    name: 'Redimensionar Imagem',
    title: 'Redimensionar Imagem Online Grátis — Sem Perder Qualidade | ConvertOcean',
    description: 'Redimensione uma imagem por pixels, centímetros ou tamanho de arquivo em KB, direto no navegador. A foto não sai do seu dispositivo.',
    headline: 'Redimensionar Imagem.',
    subtitle: 'Defina as medidas exatas em pixels, ou um tamanho-alvo em KB — e veja o resultado antes de baixar.',
    quickAnswer: 'Para redimensionar uma imagem, defina as dimensões exatas em pixels — por exemplo 200×230 para uma foto ou 140×60 para uma assinatura — ou informe um tamanho-alvo de arquivo, como 20 KB. A ferramenta reencoda a imagem no seu próprio navegador e mostra o tamanho final antes do download, então dá para conferir se ficou dentro do limite exigido. A foto não sai do seu dispositivo.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como redimensionar uma imagem',
        answer: 'Arraste a imagem para a ferramenta e informe a largura e a altura desejadas em pixels. A proporção é mantida por padrão, para que nada fique esticado. Se o que você precisa é caber em um limite de tamanho de arquivo, use a outra aba e informe o alvo em KB — a ferramenta procura a qualidade que chega mais perto sem ultrapassar.'
      },
      {
        question: 'como redimensionar imagem',
        answer: 'Há dois caminhos, e eles resolvem problemas diferentes. Por dimensões, quando o destino exige medidas exatas — uma foto 3×4, um banner, uma assinatura digitalizada. Por tamanho de arquivo, quando o formulário recusa qualquer coisa acima de um número de KB. Confundir os dois é a causa mais comum de tentar várias vezes sem sucesso.'
      },
      {
        question: 'como ajustar o tamanho da imagem para imprimir',
        answer: 'Para impressão o que conta não é só o pixel, é a densidade. A regra prática é 300 dpi: uma foto 10×15 cm impressa bem precisa de cerca de 1.181×1.772 pixels. Reduzir uma imagem para as medidas em centímetros não basta se a resolução original já era baixa — ampliar depois não recupera detalhe que nunca existiu.'
      },
      {
        question: 'Como manter a qualidade ao redimensionar?',
        answer: 'Reduzir uma imagem preserva bem a qualidade; ampliar não. Ao diminuir, os pixels são combinados e o resultado costuma ficar nítido. Ao aumentar, o programa precisa inventar pixels que não existem, e o resultado fica borrado — por isso comece sempre do maior arquivo disponível em vez de ampliar um pequeno.'
      },
      {
        question: 'Como deixar a imagem abaixo de 20 KB?',
        answer: 'Use o modo de tamanho-alvo e informe 20 KB. A ferramenta faz uma busca pela qualidade que chega mais perto do limite sem ultrapassar, e mostra o tamanho final antes de você baixar. É o modo certo para formulários de concurso e inscrições, que costumam exigir foto e assinatura dentro de faixas específicas.'
      },
      {
        question: 'A imagem é copiada para algum servidor?',
        answer: 'Não. O redimensionamento acontece no seu navegador, no seu dispositivo, e a imagem não é copiada para nenhum servidor. Depois que a página carrega uma vez, funciona até sem internet.'
      }
    ],
    content: `
      <h2>Por medidas ou por tamanho de arquivo</h2>
      <p>São dois problemas diferentes e confundi-los é o motivo mais comum de tentar várias vezes sem acertar. <strong>Redimensionar imagem em cm</strong> ou em pixels resolve quando o destino exige medidas exatas. Informar um alvo em KB resolve quando o formulário recusa arquivos acima de um certo peso, independentemente das dimensões.</p>
      <p>A ferramenta faz os dois, e mostra o resultado antes do download em ambos os casos.</p>

      <h2>Reduzir preserva, ampliar não</h2>
      <p>Quem procura <strong>redimensionar imagem sem perder qualidade</strong> geralmente quer diminuir — e aí a notícia é boa: reduzir combina pixels e costuma manter a imagem nítida. Ampliar é o contrário: o programa precisa inventar informação que não existe no arquivo, e o resultado fica borrado. Comece sempre do maior original que tiver.</p>

      <h2>Para impressão, pense em dpi</h2>
      <p>Medidas em centímetros só significam alguma coisa junto com a densidade. A 300 dpi, uma foto de 10×15 cm precisa de aproximadamente 1.181×1.772 pixels. Definir o tamanho em centímetros numa imagem de baixa resolução não a torna imprimível.</p>

      <h2>Redes sociais e formulários</h2>
      <p><strong>Redimensionar imagem para instagram</strong> pede proporções específicas — 1080×1080 para o quadrado, 1080×1350 para o retrato. Formulários de concurso costumam exigir foto e assinatura dentro de faixas de KB. Os dois casos são atendidos pelos dois modos da ferramenta, e nada disso sai do seu aparelho.</p>
    `
  },
  {
    en: 'word-counter',
    slug: 'contador-de-palavras',
    name: 'Contador de Palavras',
    title: 'Contador de Palavras Online Grátis — Caracteres e Tempo | ConvertOcean',
    description: 'Conte palavras, caracteres com e sem espaços, tempo de leitura e densidade de palavras enquanto digita. Nada sai do seu navegador.',
    headline: 'Contador de Palavras.',
    subtitle: 'Palavras, caracteres, tempo de leitura e densidade — atualizados enquanto você escreve.',
    quickAnswer: 'Para contar palavras, cole ou digite o texto na ferramenta acima e veja, ao vivo, a contagem de palavras, o número de caracteres com e sem espaços, o tempo estimado de leitura, o tempo de fala e a densidade de cada palavra. É útil para trabalhos acadêmicos, meta descriptions e publicações com limite de caracteres. O texto não sai do seu navegador.',
    category: 'Ferramentas para Desenvolvedores',
    faqs: [
      {
        question: 'onde fica o contador de palavras no word',
        answer: 'No Microsoft Word, a contagem aparece na barra de status, no canto inferior esquerdo da janela — se não estiver visível, clique com o botão direito na barra e marque "Contagem de Palavras". Para o detalhamento completo, com caracteres e parágrafos, vá na aba Revisão e clique em Contar Palavras. Aqui na página você obtém o mesmo e mais: caracteres sem espaços, tempo de leitura e densidade, sem abrir o Word.'
      },
      {
        question: 'Conta caracteres com e sem espaços?',
        answer: 'Sim, os dois números aparecem separadamente — e a distinção importa. Limites de redação de vestibular e concurso costumam contar com espaços; campos de sistema e meta descriptions frequentemente não. Usar o número errado é o que faz um texto ser recusado por poucos caracteres.'
      },
      {
        question: 'O texto que eu colo fica salvo?',
        answer: 'Não. A contagem acontece no seu navegador enquanto você digita, e nada é copiado para nenhum servidor nem armazenado. Isso importa mais do que parece para uma ferramenta de texto: redações, trabalhos não publicados e minutas de contrato passam por aqui.'
      },
      {
        question: 'Como é calculado o tempo de leitura?',
        answer: 'Por uma velocidade média de leitura aplicada à contagem de palavras. É uma estimativa útil para planejar um artigo ou uma apresentação, não uma medida exata — a velocidade real varia muito com a densidade do texto e com o leitor.'
      },
      {
        question: 'Serve para limite de caracteres de rede social?',
        answer: 'Sim, e o contador de caracteres é o número a observar nesse caso. Vale lembrar que algumas plataformas contam links e emojis de forma própria, então deixe uma pequena folga em relação ao limite oficial.'
      }
    ],
    content: `
      <h2>Mais do que o número de palavras</h2>
      <p>Um <strong>contador de palavras</strong> útil precisa separar caracteres com e sem espaços, porque os limites do mundo real usam os dois critérios. Redações de vestibular e concurso normalmente contam com espaços; campos de sistema e meta descriptions, não. É essa diferença que faz um texto aparentemente dentro do limite ser recusado.</p>

      <h2>Densidade de palavras</h2>
      <p>A contagem por palavra mostra quais termos se repetem e com que frequência. Para quem escreve para a web isso substitui a leitura em voz alta na hora de notar uma repetição involuntária — e é o que se procura em <strong>contador de palavras repetidas</strong>.</p>

      <h2>O contador do Word</h2>
      <p>No Word, o número fica na barra de status, no canto inferior esquerdo, e o detalhamento completo está na aba Revisão, em Contar Palavras. Se a barra não mostrar, clique nela com o botão direito e marque a opção. Aqui a contagem é ao vivo e traz caracteres sem espaços, tempo de leitura e densidade, sem precisar abrir o documento.</p>

      <h2>O texto não sai do navegador</h2>
      <p>Redações, trabalhos não publicados e minutas passam por um contador de palavras. Aqui nada é copiado para nenhum servidor nem armazenado.</p>
    `
  },
  {
    en: 'json-formatter',
    slug: 'formatar-json',
    name: 'Formatar JSON',
    title: 'Formatar e Validar JSON Online Grátis — 100% Privado | ConvertOcean',
    description: 'Formate, valide e minifique JSON direto no navegador, com o número da linha exata de qualquer erro de sintaxe.',
    headline: 'Formatar JSON.',
    subtitle: 'Formate, valide e minifique JSON — com o erro apontado na linha exata, sem que os dados saiam do navegador.',
    quickAnswer: 'Para formatar JSON, cole o conteúdo bruto ou minificado na ferramenta acima: ele é indentado e colorido na hora, ou sinalizado com o número exato da linha em que há erro de sintaxe. Há também a opção de minificar, comprimindo tudo de volta para uma única linha. Nada é copiado para nenhum servidor, o que importa quando o JSON contém chaves de API ou dados de clientes.',
    category: 'Ferramentas para Desenvolvedores',
    faqs: [
      {
        question: 'Como descobrir o erro no meu JSON?',
        answer: 'Cole o conteúdo e o erro de sintaxe é apontado com o número da linha. As causas mais comuns são vírgula sobrando antes de um fecha-chaves, aspas simples no lugar de duplas, e chaves sem aspas — três coisas que JavaScript aceita e JSON não.'
      },
      {
        question: 'Valida contra um JSON Schema?',
        answer: 'Não. A validação aqui é de sintaxe: se o documento é JSON bem formado. Verificar se ele obedece a um schema — campos obrigatórios, tipos esperados, formatos — é outra coisa e exige uma ferramenta de JSON Schema.'
      },
      {
        question: 'Para que serve minificar?',
        answer: 'Para produção: remover espaços e quebras de linha reduz o tamanho transmitido. O JSON minificado é ilegível para humanos e idêntico para máquinas — formate para trabalhar, minifique para enviar.'
      },
      {
        question: 'É seguro colar JSON com dados sensíveis?',
        answer: 'Aqui sim, e é o motivo de a ferramenta funcionar como funciona. A formatação acontece dentro do navegador e nada é copiado para nenhum servidor. Respostas de API frequentemente carregam tokens, chaves e dados pessoais — colá-las em um formatador hospedado é entregar exatamente isso.'
      }
    ],
    content: `
      <h2>Formatar e validar são a mesma ação</h2>
      <p>Ao colar um JSON para indentar, ou ele é formatado ou o erro aparece — não há meio termo. Por isso um <strong>validador de json</strong> e um formatador são, na prática, a mesma ferramenta: o resultado bonito é a prova de que o documento está correto.</p>

      <h2>Os três erros de sempre</h2>
      <p>Vírgula sobrando antes de fechar um objeto ou array, aspas simples no lugar de duplas, e chaves sem aspas. Os três são válidos em JavaScript e inválidos em JSON, o que explica por que aparecem tanto em arquivos escritos à mão.</p>

      <h2>Sintaxe, não schema</h2>
      <p>A validação aqui responde "isto é JSON bem formado?". Responder "isto obedece ao contrato esperado?" é validação de schema, um problema diferente que precisa de outra ferramenta.</p>

      <h2>Chaves de API não deveriam ser coladas em servidores</h2>
      <p>É o argumento central desta página. Respostas de API carregam tokens e dados pessoais com frequência; colá-las em um formatador hospedado envia tudo isso junto. Aqui a formatação acontece no navegador e nada sai do seu dispositivo.</p>
    `
  },
  {
    en: 'jpeg-to-jpg',
    slug: 'jpeg-para-jpg',
    name: 'JPEG para JPG',
    title: 'Converter JPEG para JPG Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta arquivos .jpeg em .jpg direto no navegador, para formulários e programas que só aceitam a extensão de três letras.',
    headline: 'JPEG para JPG.',
    subtitle: 'Mesma imagem, extensão que os formulários aceitam — reencodada no seu próprio navegador.',
    quickAnswer: 'JPEG e JPG são exatamente o mesmo formato — .jpg é apenas a grafia antiga de três letras herdada do DOS. Para converter JPEG para JPG, selecione o arquivo .jpeg na ferramenta acima e baixe o .jpg reencodado, pronto para formulários de envio e programas antigos que só aceitam a extensão de três letras. Tudo acontece no seu navegador.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'como converter jpeg para jpg',
        answer: 'Arraste o arquivo .jpeg para a ferramenta e baixe o .jpg. É uma reencodagem real, não uma renomeação — o que importa porque vários sistemas verificam o conteúdo do arquivo e não apenas o nome.'
      },
      {
        question: 'qual a diferença de jpeg para jpg',
        answer: 'Nenhuma no conteúdo: é o mesmo formato, a mesma compressão, a mesma qualidade. A diferença é histórica — o MS-DOS e o Windows antigo limitavam extensões a três caracteres, então .jpeg virou .jpg nos PCs enquanto Mac e Unix mantiveram a grafia completa. As duas sobreviveram.'
      },
      {
        question: 'como mudar de jpeg para jpg',
        answer: 'Renomear o arquivo funciona em muitos casos, já que o conteúdo é idêntico — mas não em todos. Alguns formulários e sistemas verificam a assinatura interna ou recusam arquivos cuja origem não bate, e aí a renomeação falha. A reencodagem resolve de forma definitiva.'
      },
      {
        question: 'A qualidade muda?',
        answer: 'Há uma reencodagem, feita em qualidade alta — a diferença não é perceptível a olho nu em fotografias. Como efeito colateral, os metadados EXIF são removidos, incluindo localização e modelo da câmera, o que costuma ser bom antes de um envio público.'
      },
      {
        question: 'A imagem é copiada para algum servidor?',
        answer: 'Não. A conversão acontece no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>Dois nomes, um formato</h2>
      <p>JPEG e JPG são o mesmo formato de imagem. A duplicidade vem do MS-DOS, que limitava extensões a três caracteres: <em>.jpeg</em> virou <em>.jpg</em> nos PCs, enquanto Mac e Unix mantiveram a grafia completa. O limite acabou há décadas; as duas grafias ficaram.</p>

      <h2>Por que a conversão ainda é necessária</h2>
      <p>Porque sistemas verificam a extensão. Um formulário programado para aceitar apenas <em>.jpg</em> recusa um <em>.jpeg</em> idêntico, e programas antigos fazem o mesmo. <strong>Converter jpeg para jpg</strong> resolve o que é, no fundo, um problema de nome — mas um problema real.</p>

      <h2>Renomear às vezes basta, às vezes não</h2>
      <p>Como o conteúdo é o mesmo, trocar a extensão manualmente costuma funcionar. Costuma. Sistemas que verificam a assinatura interna do arquivo, ou que recusam arquivos com histórico inconsistente, continuam recusando. A reencodagem elimina a dúvida — e, de quebra, remove os metadados EXIF, o que é desejável antes de um envio público.</p>
    `
  },
  {
    en: 'jpg-to-jpeg',
    slug: 'jpg-para-jpeg',
    name: 'JPG para JPEG',
    title: 'Converter JPG para JPEG Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta arquivos .jpg em .jpeg direto no navegador, para formulários que exigem estritamente a extensão de quatro letras.',
    headline: 'JPG para JPEG.',
    subtitle: 'Mesma imagem, a extensão de quatro letras que alguns formulários exigem.',
    quickAnswer: 'JPG e JPEG são o mesmo formato de imagem — apenas a extensão difere. Para converter JPG para JPEG, selecione o arquivo .jpg na ferramenta acima e baixe o .jpeg reencodado. Isso atende formulários de envio que aceitam estritamente a extensão .jpeg, e a reencodagem também remove os metadados EXIF da foto. Tudo acontece no seu navegador.',
    category: 'Ferramentas de Imagem',
    faqs: [
      {
        question: 'qual a diferença de jpg para jpeg',
        answer: 'Nenhuma diferença de conteúdo, compressão ou qualidade — é o mesmo formato com dois nomes. A grafia curta nasceu do limite de três caracteres do MS-DOS. Quando um sistema aceita um e recusa o outro, é uma regra de validação de nome, não uma diferença técnica entre os arquivos.'
      },
      {
        question: 'como converter jpg para jpeg',
        answer: 'Arraste o .jpg para a ferramenta e baixe o .jpeg. A reencodagem é real, o que importa para os sistemas que conferem mais do que o nome do arquivo.'
      },
      {
        question: 'Por que um formulário exigiria .jpeg?',
        answer: 'Porque alguém escreveu a lista de extensões aceitas e incluiu apenas essa grafia. É arbitrário, e é justamente por isso que existe a conversão nos dois sentidos — o oposto está em <a href="/pt/jpeg-para-jpg/">JPEG para JPG</a>.'
      },
      {
        question: 'A conversão remove os dados da foto?',
        answer: 'Sim, como efeito da reencodagem os metadados EXIF são descartados, incluindo coordenadas de GPS e modelo do aparelho. Se o objetivo é especificamente limpar esses dados sem reencodar, o <a href="/pt/remover-exif/">removedor de EXIF</a> faz isso sem perda alguma de qualidade.'
      },
      {
        question: 'A imagem é copiada para algum servidor?',
        answer: 'Não. A conversão acontece no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>Um problema de nome, não de formato</h2>
      <p>JPG e JPEG são idênticos por dentro. Quando um formulário aceita um e recusa o outro, está aplicando uma lista de extensões escrita por alguém — não detectando qualquer diferença real na imagem.</p>

      <h2>A conversão existe nos dois sentidos</h2>
      <p>Porque as listas arbitrárias vão nas duas direções. Esta página resolve quem precisa de <em>.jpeg</em>; <a href="/pt/jpeg-para-jpg/">JPEG para JPG</a> resolve o contrário.</p>

      <h2>O efeito colateral útil</h2>
      <p>A reencodagem descarta os metadados EXIF — localização, modelo do aparelho, data. Para uma foto que vai a um envio público isso costuma ser desejável. Se a limpeza for o objetivo principal e você não quiser reencodar, o <a href="/pt/remover-exif/">removedor de EXIF</a> faz o trabalho sem tocar nos pixels.</p>
    `
  },
  {
    en: 'merge-word',
    slug: 'juntar-documentos-word',
    name: 'Juntar Documentos Word',
    title: 'Juntar Documentos Word Online Grátis — Unir DOCX | ConvertOcean',
    description: 'Juntar arquivos Word em um só direto no navegador: vários .docx viram um documento único, com as imagens de todos os arquivos preservadas.',
    headline: 'Juntar Documentos Word.',
    subtitle: 'Una vários .docx em um único documento — com as imagens de cada arquivo preservadas.',
    quickAnswer: 'Para juntar documentos Word, adicione dois ou mais arquivos .docx na ferramenta acima e baixe um documento único combinado. As imagens embutidas em cada arquivo de origem são transportadas e religadas corretamente, que é justamente onde a maioria dos unificadores em navegador falha. Um limite declarado: estilos e formatação podem variar quando os documentos usam definições diferentes.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'como juntar arquivos word em um só',
        answer: 'Selecione todos os .docx na ferramenta acima e baixe o documento único. Cada arquivo começa em uma página nova, na ordem em que foi escolhido — a lista não é reordenável, então adicione um por vez se a sequência importar. Tabelas, imagens e o texto de cada arquivo entram inteiros.'
      },
      {
        question: 'como juntar documentos no word',
        answer: 'Dentro do Word, o caminho é a aba Inserir, seta ao lado de Objeto, e Texto de Arquivo — que insere o conteúdo de outro documento no ponto do cursor. Funciona, mas é um arquivo por vez e é fácil perder a posição. Aqui você adiciona todos de uma vez e baixa o resultado combinado.'
      },
      {
        question: 'como juntar dois documentos word',
        answer: 'Adicione os dois arquivos e confirme a ordem antes de baixar; o documento final segue a sequência mostrada na tela. O conteúdo de cada um entra completo, incluindo as imagens.'
      },
      {
        question: 'como juntar varios documentos word em um só',
        answer: 'O procedimento é o mesmo com qualquer quantidade. Adicione os arquivos na ordem certa antes de gerar: a lista não é reordenável, e mudar a sequência depois significa refazer a união. Para relatórios montados por várias pessoas, conferir a sequência costuma ser mais importante que a união em si.'
      },
      {
        question: 'A formatação é preservada?',
        answer: 'O conteúdo e as imagens sim. Estilos podem variar quando os documentos de origem definem o mesmo nome de estilo de maneiras diferentes — dois arquivos com um "Título 1" configurado de formas distintas vão brigar por essa definição no documento final. Vale uma passada de revisão nos títulos depois de unir.'
      },
      {
        question: 'Os documentos são copiados para algum servidor?',
        answer: 'Não. A união acontece no seu navegador, no seu dispositivo, e os arquivos não são copiados para nenhum servidor.'
      }
    ],
    content: `
      <h2>As imagens são a parte difícil</h2>
      <p>Unir texto é simples; unir documentos com imagens não é. Dentro de um .docx cada imagem é um arquivo separado, referenciado por um identificador, e dois documentos costumam usar os mesmos identificadores para imagens diferentes. Unificadores que ignoram isso produzem um arquivo com fotos trocadas ou ausentes. Aqui as referências são reescritas para que cada imagem continue apontando para a certa.</p>

      <h2>O limite honesto: estilos</h2>
      <p>Ao <strong>unir arquivos word sem perder formatação</strong>, o conteúdo atravessa intacto, mas os estilos podem divergir. Se dois documentos definem "Título 1" de formas diferentes, um dos dois prevalece no resultado. Uma revisão rápida dos títulos depois da união resolve.</p>

      <h2>Dentro do Word, dá mais trabalho</h2>
      <p>O caminho nativo é Inserir, Objeto, Texto de Arquivo — um arquivo por vez, no ponto do cursor. Para dois documentos é aceitável; para oito, não.</p>

      <h2>Juntar arquivos Word em PDF</h2>
      <p>O resultado aqui é um .docx, que continua editável. Se o destino pede PDF, junte primeiro e depois passe o documento único pelo <a href="/pt/word-para-pdf/">Word para PDF</a> — assim a numeração e as quebras de página já saem na ordem certa.</p>
    `
  },
  {
    en: 'split-word',
    slug: 'dividir-arquivo-word',
    name: 'Dividir Arquivo Word',
    title: 'Dividir Arquivo Word Online Grátis — Separar DOCX | ConvertOcean',
    description: 'Divida um documento .docx em vários arquivos, quebrando a cada Título 1 ou a cada número de parágrafos.',
    headline: 'Dividir Arquivo Word.',
    subtitle: 'Quebre um .docx a cada Título 1 ou a cada número de parágrafos — sem que o arquivo saia do seu computador.',
    quickAnswer: 'Para dividir um documento Word, selecione o arquivo .docx na ferramenta acima e escolha onde quebrar: a cada Título 1, ou a cada número definido de parágrafos. A divisão por título é a mais útil para capítulos, seções e relatórios, porque segue a estrutura que o próprio documento já declara. Tudo acontece no seu navegador.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'como separar documentos word',
        answer: 'Selecione o .docx e escolha o critério de quebra. Por Título 1, cada seção vira um arquivo próprio, nomeado pelo título — ideal para transformar um relatório longo em capítulos separados. Por número de parágrafos, quando o documento não tem estrutura de títulos.'
      },
      {
        question: 'Por que dividir por Título 1 funciona melhor?',
        answer: 'Porque usa a estrutura que o autor já criou, em vez de adivinhar. Um documento bem formatado marca cada seção com um Título 1, e a divisão segue exatamente esses pontos. Se o documento foi formatado à mão, com texto em negrito no lugar de estilos de título, esse critério não encontra as quebras — e aí a divisão por parágrafos é a alternativa.'
      },
      {
        question: 'E se o documento não tiver títulos?',
        answer: 'Use a divisão por número de parágrafos. É menos elegante, mas funciona em qualquer documento e resolve o caso prático de partir um arquivo grande demais para enviar ou revisar.'
      },
      {
        question: 'As imagens e a formatação vão junto?',
        answer: 'Cada parte mantém o conteúdo e a formatação da seção correspondente, inclusive imagens. Confira o primeiro arquivo gerado antes de distribuir os demais.'
      },
      {
        question: 'O documento é copiado para algum servidor?',
        answer: 'Não. A divisão acontece no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>Dividir pela estrutura, não pelo palpite</h2>
      <p>A divisão por Título 1 aproveita a marcação que o próprio documento carrega: cada seção declarada vira um arquivo, nomeado pelo título. É o que torna prático transformar um relatório de cem páginas em capítulos, ou separar um manual por assunto.</p>

      <h2>Quando os títulos não existem</h2>
      <p>Documentos formatados à mão — negrito e tamanho maior em vez de estilos de título — não têm marcação para seguir. Aí a divisão por número de parágrafos é a saída: menos elegante, mas funciona em qualquer arquivo.</p>

      <h2>Processamento local</h2>
      <p>Relatórios, contratos e trabalhos acadêmicos são o que normalmente se divide. Nada é copiado para nenhum servidor.</p>
    `
  },
  {
    en: 'merge-txt',
    slug: 'unir-arquivos-txt',
    name: 'Unir Arquivos TXT',
    title: 'Unir Arquivos TXT Online Grátis — Juntar Textos | ConvertOcean',
    description: 'Una vários arquivos de texto em um só direto no navegador, escolhendo o separador entre eles.',
    headline: 'Unir Arquivos TXT.',
    subtitle: 'Junte vários arquivos de texto em um só, escolhendo o que vai entre eles.',
    quickAnswer: 'Para unir arquivos de texto, adicione seus arquivos .txt, .md, .csv ou .log na ferramenta acima e baixe um documento combinado. Você escolhe o que vai entre eles — uma quebra de linha, uma linha em branco, nenhum separador ou um texto próprio — e pode inserir o nome de cada arquivo de origem antes do seu conteúdo. Tudo acontece no seu navegador.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'Que tipos de arquivo posso unir?',
        answer: 'Arquivos .txt, .md, .csv e .log. Como todos são texto puro, podem ser combinados entre si — vários logs em um arquivo único para análise, ou várias anotações em um documento só.'
      },
      {
        question: 'Posso escolher o que separa os arquivos?',
        answer: 'Sim, e essa é a parte que decide se o resultado é utilizável. Uma quebra de linha simples, uma linha em branco, nenhum separador, ou um texto próprio — um traço, uma marca, o que fizer sentido para o que você vai fazer com o arquivo depois.'
      },
      {
        question: 'Dá para saber de onde veio cada trecho?',
        answer: 'Sim, há a opção de inserir o nome de cada arquivo de origem antes do respectivo conteúdo. Para juntar logs de vários dias ou anotações de várias fontes, é o que evita perder o rastro.'
      },
      {
        question: 'Serve para juntar CSVs?',
        answer: 'Funciona, com uma ressalva: o cabeçalho de cada arquivo entra como uma linha de dados no meio do resultado. Se os CSVs compartilham a mesma estrutura e você quer uma tabela única, <a href="/pt/unir-arquivos-excel/">unir arquivos Excel e CSV</a> trata isso melhor.'
      },
      {
        question: 'Os arquivos são copiados para algum servidor?',
        answer: 'Não. A união acontece no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>O separador é a decisão importante</h2>
      <p>Unir arquivos de texto é trivial; o que determina se o resultado serve é o que fica entre eles. Logs concatenados sem separação viram uma parede ilegível. Anotações coladas sem linha em branco se confundem. A ferramenta deixa isso explícito, incluindo a opção de um texto próprio.</p>

      <h2>Manter o rastro da origem</h2>
      <p>Ao <strong>unir arquivos txt em um só</strong> vindos de fontes diferentes, marcar o nome de cada arquivo antes do seu conteúdo evita o problema clássico: um arquivo grande em que não se sabe mais onde um começa e o outro termina.</p>

      <h2>CSV tem um caso melhor</h2>
      <p>Arquivos .csv são aceitos, mas os cabeçalhos viram linhas de dados no meio do resultado. Para tabelas, <a href="/pt/unir-arquivos-excel/">unir arquivos Excel e CSV</a> é o caminho.</p>
    `
  },
  {
    en: 'split-txt',
    slug: 'dividir-arquivo-txt',
    name: 'Dividir Arquivo TXT',
    title: 'Dividir Arquivo TXT Online Grátis — Separar Texto | ConvertOcean',
    description: 'Divida um arquivo de texto por número de linhas, por tamanho em KB ou a cada delimitador, direto no navegador.',
    headline: 'Dividir Arquivo TXT.',
    subtitle: 'Parta um arquivo de texto por linhas, por tamanho ou a cada delimitador que você definir.',
    quickAnswer: 'Para dividir um arquivo de texto, selecione seu .txt, .md, .csv ou .log na ferramenta acima e escolha como parti-lo: a cada N linhas, a cada N kilobytes, ou em cada ocorrência de um delimitador que você definir. Cada parte é baixada como arquivo próprio. É a forma prática de quebrar um arquivo grande demais para abrir ou para enviar.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'como dividir arquivo txt',
        answer: 'Selecione o arquivo e escolha o critério: por número de linhas, por tamanho em KB, ou a cada ocorrência de um delimitador. Cada parte sai como um arquivo separado, e o critério certo depende do que você vai fazer com os pedaços.'
      },
      {
        question: 'Qual critério escolher?',
        answer: 'Por linhas, quando o destino impõe um limite de registros — importações costumam ser assim. Por tamanho, quando o limite é de megabytes, como em anexos de e-mail. Por delimitador, quando o arquivo tem uma marca natural de separação, como uma data ou um cabeçalho repetido em cada bloco.'
      },
      {
        question: 'Serve para arquivos de log grandes?',
        answer: 'Sim, é um dos usos principais. Um log de várias centenas de megabytes trava a maioria dos editores; partido em blocos, cada parte abre normalmente. Como o processamento é local, o limite prático é a memória do seu aparelho.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. A divisão acontece no seu navegador, no seu dispositivo — o que importa com logs de sistema, que frequentemente contêm dados internos.'
      }
    ],
    content: `
      <h2>Três critérios, três problemas diferentes</h2>
      <p>Por número de linhas, quando o sistema de destino aceita um máximo de registros por importação. Por tamanho em kilobytes, quando o limite é de anexo. Por delimitador, quando o próprio arquivo já tem uma marca natural de separação.</p>

      <h2>Arquivos grandes demais para abrir</h2>
      <p>É o caso mais comum. Um log de centenas de megabytes derruba a maioria dos editores de texto; dividido em partes, cada uma abre sem esforço. Como tudo roda no navegador, o limite é a memória do seu próprio aparelho, não uma regra nossa.</p>

      <h2>Logs não deveriam circular</h2>
      <p>Arquivos de log carregam caminhos internos, nomes de usuário e às vezes dados de clientes. A divisão acontece no seu dispositivo e nada é copiado para nenhum servidor.</p>
    `
  },
  {
    en: 'merge-pptx',
    slug: 'juntar-powerpoint',
    name: 'Juntar PowerPoint',
    title: 'Juntar Apresentações PowerPoint Online Grátis | ConvertOcean',
    description: 'Una várias apresentações .pptx em um único arquivo direto no navegador, com os slides na ordem e seus layouts preservados.',
    headline: 'Juntar PowerPoint.',
    subtitle: 'Combine várias apresentações .pptx em uma só, com os layouts de cada uma preservados.',
    quickAnswer: 'Para juntar apresentações PowerPoint, adicione dois ou mais arquivos .pptx na ferramenta acima e baixe uma apresentação única combinada, com os slides de cada origem copiados na ordem, junto com seus layouts. Arquivos .ppt antigos não são aceitos — abra-os no PowerPoint ou no LibreOffice e salve como .pptx primeiro. Tudo acontece no seu navegador.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'Os layouts e temas são preservados?',
        answer: 'Os slides são copiados junto com os layouts de origem, então cada um mantém sua estrutura. Quando as apresentações usam temas diferentes, o resultado fica visivelmente misto — o que é fiel ao conteúdo, mas pode exigir uma padronização depois se o objetivo for um deck uniforme.'
      },
      {
        question: 'Posso definir a ordem dos slides?',
        answer: 'Os slides entram na ordem dos arquivos adicionados, e dentro de cada arquivo na ordem original. Adicione os arquivos na sequência certa antes de gerar; reordenar slides individualmente é trabalho para o PowerPoint depois.'
      },
      {
        question: 'Arquivos .ppt antigos funcionam?',
        answer: 'Não. O formato binário .ppt não pode ser lido dentro de um navegador. Abra no PowerPoint ou no LibreOffice, salve como .pptx e junte em seguida.'
      },
      {
        question: 'As apresentações são copiadas para algum servidor?',
        answer: 'Não. A união acontece no seu navegador, no seu dispositivo. Propostas comerciais e material interno não saem da sua máquina.'
      }
    ],
    content: `
      <h2>Slides com os layouts de origem</h2>
      <p>Cada slide é copiado junto com o layout que o define, de modo que a estrutura de cada apresentação sobrevive à união. Isso preserva o conteúdo fielmente — e significa que apresentações com temas diferentes produzem um deck visivelmente misto.</p>

      <h2>A ordem é a dos arquivos</h2>
      <p>Adicione os arquivos na sequência certa antes de gerar. Reordenar slides individualmente depois é trabalho para o PowerPoint.</p>

      <h2>.ppt precisa de um passo antes</h2>
      <p>O formato binário antigo não é legível no navegador: salve como .pptx primeiro. É o mesmo passo descrito em <a href="/pt/ppt-para-pdf/">PPT para PDF</a>.</p>
    `
  },
  {
    en: 'split-pptx',
    slug: 'dividir-powerpoint',
    name: 'Dividir PowerPoint',
    title: 'Dividir Apresentação PowerPoint Online Grátis | ConvertOcean',
    description: 'Separe cada slide em um arquivo próprio ou extraia intervalos como 1-5, 8, 11-13, direto no navegador.',
    headline: 'Dividir PowerPoint.',
    subtitle: 'Separe cada slide em um arquivo, ou extraia apenas os intervalos que você precisa.',
    quickAnswer: 'Para dividir uma apresentação, adicione o arquivo .pptx na ferramenta acima e escolha entre separar cada slide em uma apresentação própria ou extrair intervalos personalizados, como 1-5, 8, 11-13. Cada slide extraído mantém seu layout e a mídia incorporada na qualidade original, porque o conteúdo é copiado em vez de reprocessado.',
    category: 'Ferramentas de Documentos',
    faqs: [
      {
        question: 'Como extrair só alguns slides?',
        answer: 'Informe os intervalos no formato 1-5, 8, 11-13 — números soltos e faixas podem ser misturados. O resultado é uma apresentação contendo apenas esses slides, na ordem indicada.'
      },
      {
        question: 'A qualidade das imagens e vídeos cai?',
        answer: 'Não. A mídia incorporada é copiada em vez de reprocessada, então imagens e vídeos mantêm exatamente a qualidade original. É a diferença em relação a métodos que reconstroem os slides.'
      },
      {
        question: 'Cada slide pode virar um arquivo?',
        answer: 'Sim, essa é a outra opção: cada slide vira uma apresentação própria. Útil para distribuir partes de um deck a pessoas diferentes, ou para isolar um slide que será reaproveitado em outro material.'
      },
      {
        question: 'A apresentação é copiada para algum servidor?',
        answer: 'Não. A divisão acontece no seu navegador, no seu dispositivo.'
      }
    ],
    content: `
      <h2>Por slide ou por intervalo</h2>
      <p>Separar cada slide em um arquivo próprio serve para distribuir partes de um deck. Extrair intervalos — 1-5, 8, 11-13 — serve para montar uma versão reduzida a partir de uma apresentação longa, que é o caso mais frequente.</p>

      <h2>A mídia não é reprocessada</h2>
      <p>Imagens e vídeos incorporados são copiados como estão, mantendo a qualidade original. Ferramentas que reconstroem os slides costumam recomprimir esse conteúdo e degradá-lo sem avisar.</p>

      <h2>Processamento local</h2>
      <p>Nada é copiado para nenhum servidor.</p>
    `
  },
  {
    en: 'qfx-to-csv',
    slug: 'qfx-para-csv',
    name: 'QFX para CSV',
    title: 'Converter QFX para CSV Online Grátis — Extrato Quicken | ConvertOcean',
    description: 'Converta arquivos .qfx do Quicken em planilha CSV ou Excel direto no navegador. O extrato não sai do seu computador.',
    headline: 'QFX para CSV.',
    subtitle: 'Transforme um extrato .qfx do Quicken em planilha que qualquer programa lê.',
    quickAnswer: 'Para converter QFX para CSV, selecione o arquivo .qfx na ferramenta acima e baixe as transações como planilha. O QFX é a variante licenciada do OFX usada pelo Quicken, então um arquivo que só o Quicken importa vira um CSV ou uma pasta do Excel que qualquer programa lê. O extrato é processado no seu navegador e não sai do seu computador.',
    category: 'Ferramentas Empresariais',
    faqs: [
      {
        question: 'Qual a diferença entre QFX e OFX?',
        answer: 'O QFX é a versão licenciada do OFX usada pelo Quicken: mesma estrutura, com identificadores adicionais que o programa exige. Por isso um .qfx costuma ser aceito apenas pelo Quicken, enquanto um <a href="/pt/ofx-para-csv/">.ofx</a> é lido por mais programas.'
      },
      {
        question: 'Posso baixar em Excel?',
        answer: 'Sim, além do CSV há a opção de gerar uma pasta .xlsx — que evita o problema de o Excel abrir um CSV com tudo em uma coluna só.'
      },
      {
        question: 'Quais dados saem na planilha?',
        answer: 'As transações do extrato, com data, tipo, descrição, valor e identificador. É o suficiente para conciliação manual ou para importar em outro sistema financeiro.'
      },
      {
        question: 'O extrato é copiado para algum servidor?',
        answer: 'Não. A leitura acontece no seu navegador, no seu dispositivo. Um extrato lista cada movimentação de uma conta — não é um arquivo para enviar a um serviço qualquer.'
      }
    ],
    content: `
      <h2>Um formato preso a um programa</h2>
      <p>O QFX é o OFX com identificadores licenciados pelo Quicken. Na prática, isso significa que o arquivo que o seu banco fornece só serve dentro daquele programa — e se você não o usa, ou migrou para outro sistema, o extrato fica inacessível.</p>
      <p>Converter para CSV devolve os dados a um formato que qualquer planilha ou sistema contábil lê.</p>

      <h2>CSV ou Excel</h2>
      <p>O .xlsx evita o problema clássico de o Excel abrir um CSV com tudo empilhado em uma coluna, porque leva a estrutura das colunas dentro do arquivo.</p>

      <h2>Extratos não deveriam circular</h2>
      <p>A leitura acontece dentro do navegador, no seu dispositivo, e nada é copiado para nenhum servidor.</p>
    `
  }
];

export const ptTools: PtTool[] = [
  ...ptToolsSeed,
  ...ptToolsBatch1,
  ...ptToolsBatch2,
  ...ptToolsBatch3,
  ...ptToolsBatch4,
  ...ptToolsBatch5,
  ...ptToolsBatch6,
  ...ptToolsBatch7,
  ...ptToolsBatch8,
  ...ptToolsBatch9,
  ...ptToolsBatch10,
  ...ptToolsBatch11,
  ...ptToolsBatch12
];

/**
 * Guides live at `/pt/guias/<slug>/`. Empty until the keyword-led wave: the
 * concurso and Imposto de Renda angles are the point of this locale, and those
 * pages should be written from researched queries rather than translated from
 * the English guides, which target a different audience entirely.
 */
/**
 * Guides live at `/pt/guias/<slug>/`.
 *
 * Three to start, chosen because the keyword research pointed at them
 * explicitly rather than because they were next in the English list:
 *
 *   - png-vs-jpg   batch 4 found four comparison questions (`qual a diferença
 *                  de png para jpg`, `qual é melhor para imprimir jpg ou png`,
 *                  `para postar no instagram é melhor png ou jpg`) that belong
 *                  in a guide, not on a converter page.
 *   - redimensionar-foto-assinatura  `redimensionar imagem` is EASY at >10,000,
 *                  and the concurso upload limits are the strategic reason this
 *                  locale exists.
 *   - juntar-varios-pdf  `como juntar varios pdf em um só` is EASY at >1000 —
 *                  the best question keyword in any batch.
 *
 * Written from the Portuguese queries, not translated from the English guides,
 * which target a different audience.
 */
export const ptGuides: PtGuide[] = [
  {
    en: 'png-vs-jpg',
    slug: 'png-ou-jpg',
    title: 'PNG ou JPG: Qual a Diferença e Quando Usar Cada Um | ConvertOcean',
    description: 'A diferença real entre PNG e JPG, qual escolher para imprimir, para o Instagram e para logotipos — com o teste que decide em dois segundos.',
    h1: 'PNG ou JPG: qual a diferença, e qual usar.',
    readTime: '6 min de leitura',
    publishDate: '24 de setembro de 2026',
    intro: 'PNG e JPG resolvem problemas diferentes, e escolher errado custa qualidade ou megabytes. Este guia explica a diferença em termos práticos e responde às três perguntas que realmente aparecem: qual imprime melhor, qual usar no Instagram e o que fazer com fundo transparente.',
    contentHtml: `
      <h2>A diferença em uma frase</h2>
      <p>O <strong>JPG</strong> usa compressão com perdas: ele descarta informação para ficar pequeno, e perde um pouco mais a cada vez que o arquivo é salvo de novo. O <strong>PNG</strong> é sem perdas — guarda cada pixel exatamente — e suporta transparência, que o JPG não tem.</p>
      <p>Na prática: JPG para fotografias, PNG para tudo que tenha texto, linhas finas, cor chapada ou fundo transparente.</p>

      <h2>O teste dos dois segundos</h2>
      <p>Olhe a imagem e pergunte: <em>isto é uma fotografia?</em></p>
      <ul>
        <li><strong>Sim</strong> — uma paisagem, um retrato, um produto fotografado. Use JPG. A compressão dele foi desenhada exatamente para variação suave de cor, e a diferença visual é imperceptível em um arquivo várias vezes menor.</li>
        <li><strong>Não</strong> — uma captura de tela, um logotipo, um gráfico, um cartaz com texto. Use PNG. O JPG cria pequenos borrões ao redor de bordas nítidas, e em texto isso aparece.</li>
      </ul>

      <h2>Qual é melhor para imprimir</h2>
      <p>Para fotografias destinadas à impressão, o JPG em alta qualidade basta e é o que a maioria das gráficas aceita sem objeção. Para material com texto, linhas finas ou cores chapadas — um convite, um certificado, um cartaz — o PNG imprime mais limpo, porque não introduz os artefatos que a compressão do JPG cria nas bordas.</p>
      <p>Mas o formato importa menos do que a <strong>resolução</strong>. Para impressão, trabalhe em 300 dpi: uma foto de 10×15 cm precisa de aproximadamente 1.181×1.772 pixels. Um PNG de baixa resolução imprime pior que um JPG de alta. Se a dúvida é tamanho e não formato, o guia certo é o de <a href="/pt/guias/redimensionar-foto-assinatura/">redimensionar fotos e assinaturas</a>.</p>

      <h2>Instagram: PNG ou JPG?</h2>
      <p>Para fotografias, JPG. O Instagram recomprime tudo o que recebe, então enviar um PNG grande não melhora o resultado final — apenas gasta mais dados no envio e chega ao mesmo lugar.</p>
      <p>A exceção é conteúdo com texto nítido ou gráficos de cor chapada: um card, um infográfico, um slide de carrossel. Nesses casos o PNG chega mais limpo e sobrevive melhor à recompressão da plataforma. Se o carrossel vem de uma imagem larga cortada em partes, <a href="/pt/dividir-imagem/">dividir imagem</a> gera os quadros em resolução total.</p>

      <h2>Transparência: só o PNG tem</h2>
      <p>É a diferença que não tem meio-termo. O JPG não possui canal de transparência: converter um logotipo com fundo transparente para JPG achata tudo sobre branco, e o resultado tem um retângulo branco visível quando colocado sobre qualquer outra cor.</p>
      <p>Vale desfazer a confusão inversa também: converter um JPG para PNG <em>não</em> remove o fundo. O PNG aceita transparência, mas o JPG não tem nenhuma para preservar — o resultado é um PNG com o mesmo fundo opaco. Apagar o fundo é identificar o objeto na imagem, que é outro tipo de ferramenta.</p>

      <h2>E o WebP?</h2>
      <p>O WebP faz as duas coisas: comprime melhor que o JPG e mantém transparência como o PNG. Para imagens de site é quase sempre a escolha melhor. Fora do navegador, porém, muitos programas de escritório ainda o recusam — para um arquivo que vai ao Word ou a um formulário, PNG ou JPG continuam sendo o caminho seguro.</p>

      <h2>Em resumo</h2>
      <ul>
        <li><strong>Fotografia</strong> → JPG</li>
        <li><strong>Texto, logotipo, captura de tela</strong> → PNG</li>
        <li><strong>Fundo transparente</strong> → PNG (ou WebP)</li>
        <li><strong>Imagem para o seu site</strong> → WebP</li>
        <li><strong>Impressão</strong> → o formato importa menos que os 300 dpi</li>
      </ul>
    `,
    faqs: [
      {
        question: 'qual a diferença de png para jpg',
        answer: 'O JPG comprime com perdas e não tem transparência; o PNG é sem perdas e tem. Isso torna o JPG muito menor em fotografias e o PNG melhor em texto, logotipos e capturas de tela. Um JPG também perde um pouco de qualidade a cada novo salvamento, o que o PNG não faz.'
      },
      {
        question: 'qual é melhor para imprimir jpg ou png',
        answer: 'Para fotografias, JPG em alta qualidade resolve e é o que gráficas esperam. Para texto, linhas finas e cores chapadas, o PNG imprime mais limpo. Em ambos os casos o fator decisivo é a resolução: trabalhe em 300 dpi, porque nenhum formato recupera detalhe que a imagem não tem.'
      },
      {
        question: 'para postar no instagram é melhor png ou jpg',
        answer: 'JPG para fotos — o Instagram recomprime tudo, então um PNG grande não melhora o resultado e só consome mais dados no envio. PNG para cards, infográficos e qualquer coisa com texto nítido, que sobrevive melhor à recompressão da plataforma.'
      },
      {
        question: 'Converter JPG para PNG melhora a qualidade?',
        answer: 'Não. A conversão preserva exatamente o que já existe, mas não recupera o que a compressão do JPG descartou. Converter para PNG é útil antes de começar a editar, porque impede que novas perdas se acumulem a cada salvamento — não para consertar uma imagem já degradada.'
      },
      {
        question: 'Converter para PNG deixa o fundo transparente?',
        answer: 'Não. O PNG aceita transparência, mas um JPG não tem canal de transparência — não existe fundo transparente no original para preservar. O resultado é um PNG com o mesmo fundo opaco. Remover o fundo exige identificar o objeto na imagem, o que é outra ferramenta.'
      }
    ]
  },
  {
    en: 'resize-photo-signature-for-online-forms',
    slug: 'redimensionar-foto-assinatura',
    title: 'Redimensionar Foto e Assinatura para Formulários e Concursos | ConvertOcean',
    description: 'Como deixar foto e assinatura nas medidas e no tamanho de arquivo que o edital exige, sem perder legibilidade — e sem que os documentos saiam do seu computador.',
    h1: 'Redimensionar foto e assinatura para formulários online.',
    readTime: '7 min de leitura',
    publishDate: '24 de setembro de 2026',
    intro: 'Inscrições de concurso, vestibular e processos seletivos quase sempre exigem duas coisas ao mesmo tempo: medidas exatas em pixels e um limite de tamanho em KB. São exigências diferentes, e tentar resolver as duas com o mesmo ajuste é o motivo mais comum de o envio ser recusado várias vezes seguidas.',
    contentHtml: `
      <h2>Dois requisitos, dois ajustes</h2>
      <p>Leia o edital com atenção, porque ele costuma pedir os dois:</p>
      <ul>
        <li><strong>Dimensões</strong> — algo como 200×230 pixels para a foto, 140×60 para a assinatura. É a forma do arquivo.</li>
        <li><strong>Tamanho do arquivo</strong> — algo como "no máximo 20 KB" ou "até 2 MB". É o peso do arquivo.</li>
      </ul>
      <p>Uma imagem pode ter as dimensões corretas e ainda pesar demais, ou pesar pouco e estar no formato errado. O <a href="/pt/redimensionar-imagem/">redimensionador</a> trata os dois separadamente, e é assim que devem ser tratados.</p>

      <h2>Comece com a melhor imagem que tiver</h2>
      <p>Reduzir preserva qualidade; ampliar não. Ao diminuir, os pixels são combinados e o resultado costuma ficar nítido. Ao aumentar, o programa precisa inventar informação que não existe, e o resultado fica borrado — irrecuperavelmente.</p>
      <p>Por isso: fotografe ou digitalize na maior resolução disponível e reduza a partir dali. Nunca parta de uma miniatura.</p>

      <h2>A foto</h2>
      <p>Enquadre o rosto de frente, com fundo claro e uniforme, sem sombra atravessando o rosto. Depois defina as dimensões exatas que o edital pede. Se a proporção do edital não bate com a da sua foto, corte antes em vez de deixar a imagem esticar — um rosto distorcido é motivo de recusa em várias bancas.</p>

      <h2>A assinatura</h2>
      <p>Assine com caneta preta em papel branco, sem pauta. Fotografe ou digitalize de frente, com boa luz e sem sombra. Recorte deixando pouca margem em volta do traço — uma assinatura pequena no meio de muito branco fica ilegível depois da redução.</p>
      <p>Se o edital pedir fundo branco e a foto ficar acinzentada, digitalizar em preto e branco costuma resolver e ainda reduz bastante o tamanho do arquivo.</p>

      <h2>Chegar ao limite de KB</h2>
      <p>Com as dimensões já corretas, use o modo de tamanho-alvo e informe o limite — 20 KB, 50 KB, o que o edital disser. A ferramenta procura a qualidade que chega mais perto sem ultrapassar, e mostra o tamanho final antes do download.</p>
      <p>Se mesmo no limite a imagem ficar ilegível, o problema é anterior: ou as dimensões pedidas são pequenas demais para a quantidade de detalhe, ou a origem já era ruim. Refazer a foto rende mais do que insistir na compressão.</p>

      <h2>Documentos digitalizados e o limite de 2 MB</h2>
      <p>Para os documentos em si — RG, CPF, diploma, comprovantes — o caminho é outro. Digitalize em 200 dpi (não 600) e em preto e branco quando não houver cor relevante: isso sozinho costuma resolver o tamanho. Depois:</p>
      <ol>
        <li>Transforme as fotos em PDF com <a href="/pt/imagem-para-pdf/">imagem para PDF</a>, uma por página.</li>
        <li>Reúna tudo na ordem do edital com <a href="/pt/juntar-pdf/">juntar PDF</a>.</li>
        <li>Se ainda passar do limite, use <a href="/pt/comprimir-pdf/">comprimir PDF</a> — comprimir um arquivo único rende mais do que comprimir vários separados.</li>
      </ol>

      <h2>Confira antes de anexar</h2>
      <p>Abra o arquivo final e leia. Nome, números de documento e assinatura precisam estar legíveis — editais rejeitam imagens ilegíveis, e a recusa costuma vir depois do prazo. Se a compressão mais forte borrou o texto, volte um nível: normalmente o arquivo ainda cabe.</p>

      <h2>Seus documentos não saem do computador</h2>
      <p>Foto, assinatura, RG e comprovante de residência são exatamente o tipo de arquivo que não deveria circular. Todas as ferramentas citadas aqui processam a imagem dentro do navegador, no seu próprio aparelho — nada é copiado para nenhum servidor.</p>
    `,
    faqs: [
      {
        question: 'Como deixar a foto abaixo de 20 KB?',
        answer: 'Ajuste primeiro as dimensões que o edital pede, depois use o modo de tamanho-alvo e informe 20 KB. A ferramenta procura a qualidade que chega mais perto do limite sem ultrapassar e mostra o tamanho final antes de você baixar. Se o resultado ficar ilegível, o problema está na imagem de origem, não na compressão.'
      },
      {
        question: 'Qual a diferença entre pixels e KB no edital?',
        answer: 'Pixels descrevem a forma da imagem — 200×230 é largura por altura. KB descreve o peso do arquivo. São exigências independentes: uma imagem pode ter as medidas certas e pesar demais. Ajuste as dimensões primeiro e o tamanho depois.'
      },
      {
        question: 'Posso ampliar uma foto pequena para as medidas pedidas?',
        answer: 'Tecnicamente sim, mas o resultado fica borrado. Ampliar obriga o programa a inventar pixels que não existem no arquivo. Se a foto original é menor que o exigido, refazer a foto é a única solução que realmente funciona.'
      },
      {
        question: 'A assinatura precisa de fundo branco?',
        answer: 'Muitos editais exigem. Assine com caneta preta em papel branco sem pauta e digitalize de frente, com boa luz. Se o fundo sair acinzentado, digitalizar em preto e branco costuma resolver e ainda reduz o tamanho do arquivo.'
      },
      {
        question: 'Os meus documentos ficam guardados em algum lugar?',
        answer: 'Não. Todas as ferramentas citadas processam a imagem dentro do navegador, no seu próprio dispositivo. Foto, assinatura e documentos não são copiados para nenhum servidor, e o código do site é aberto para conferência.'
      }
    ]
  },
  {
    en: 'merge-multiple-pdf-files',
    slug: 'juntar-varios-pdf',
    title: 'Como Juntar Vários PDF em Um Só Arquivo | ConvertOcean',
    description: 'Como reunir vários PDF em um único arquivo, na ordem certa, incluindo fotos e documentos digitalizados — sem que nada saia do seu computador.',
    h1: 'Como juntar vários PDF em um só.',
    readTime: '5 min de leitura',
    publishDate: '24 de setembro de 2026',
    intro: 'Reunir vários documentos em um único PDF é a exigência mais comum de sistemas que aceitam um anexo só — editais, processos, envios a clientes. O procedimento é simples; o que costuma dar errado é a ordem, o tamanho final e o que fazer quando alguns dos arquivos são fotos.',
    contentHtml: `
      <h2>O procedimento</h2>
      <p>Adicione todos os arquivos de uma vez em <a href="/pt/juntar-pdf/">juntar PDF</a>, na ordem em que devem aparecer, e baixe o arquivo único. Não há cadastro, marca d’água nem limite de quantos documentos podem ser reunidos.</p>
      <p>A ordem em que os arquivos aparecem na tela é a ordem das páginas no resultado. Confira antes de baixar: depois de unido, mudar a sequência significa refazer a operação.</p>

      <h2>Quando alguns arquivos são fotos</h2>
      <p>Imagens não são PDFs, então há um passo antes. Converta-as em <a href="/pt/imagem-para-pdf/">imagem para PDF</a> — cada foto vira uma página — e depois junte esse arquivo aos demais. Se todas as fotos pertencem ao mesmo conjunto, a conversão já pode reuni-las de uma vez.</p>

      <h2>O arquivo final vai ficar grande</h2>
      <p>Unir não comprime: o resultado tem aproximadamente a soma dos originais. Se o destino impõe um limite de tamanho, a ordem que funciona é unir primeiro e comprimir depois, em <a href="/pt/comprimir-pdf/">comprimir PDF</a>. Comprimir um arquivo único rende mais do que comprimir vários separadamente, porque elementos repetidos entre eles são aproveitados uma vez só.</p>

      <h2>O que sobrevive à união</h2>
      <p>O conteúdo de cada documento entra completo: o texto continua selecionável e nada é recomprimido. O que não atravessa são marcadores e campos de formulário dos arquivos de origem — se algum deles era um formulário preenchível, o resultado deixa de sê-lo.</p>

      <h2>Para documentos de concurso</h2>
      <p>Monte a sequência exatamente como o edital descreve, e não como os arquivos estavam nomeados. Depois de unir, confira duas coisas: se o arquivo está dentro do limite de tamanho — quase sempre 2 MB — e se cada documento continua legível. Bancas recusam anexos ilegíveis, e a recusa costuma chegar depois do prazo.</p>

      <h2>Juntar, unir ou mesclar</h2>
      <p>São três nomes para a mesma operação. Mesclar um PDF não altera o conteúdo das páginas, não reduz o tamanho e não recomprime nada — apenas coloca tudo dentro de um arquivo só. É o que se pede quando um sistema aceita apenas um anexo.</p>

      <h2>Nada sai do seu computador</h2>
      <p>A união acontece dentro do navegador, no seu dispositivo. Contratos, extratos e documentos pessoais — justamente os que mais se precisa reunir — não são copiados para nenhum servidor.</p>
    `,
    faqs: [
      {
        question: 'como juntar varios pdf em um só',
        answer: 'Adicione os arquivos na ferramenta na ordem em que devem aparecer e baixe o PDF único. Não há limite de quantidade: o que limita é a memória do seu próprio dispositivo, já que o processamento é local.'
      },
      {
        question: 'como juntar fotos em pdf',
        answer: 'Fotos não são PDFs, então converta-as primeiro em imagem para PDF — uma foto por página — e depois junte esse arquivo aos outros documentos. Se as fotos pertencem ao mesmo conjunto, a conversão pode reuni-las de uma vez.'
      },
      {
        question: 'O arquivo final fica muito pesado?',
        answer: 'Sim, o PDF unido tem aproximadamente a soma dos originais, porque unir não comprime. Se houver limite de tamanho, una primeiro e comprima depois — comprimir um arquivo único rende mais do que comprimir vários separados.'
      },
      {
        question: 'A ordem das páginas é mantida?',
        answer: 'Sim. As páginas entram exatamente na ordem em que os arquivos aparecem na tela, e dentro de cada arquivo a ordem original é preservada. Confira a sequência antes de baixar, porque depois é preciso refazer a união para alterá-la.'
      },
      {
        question: 'Os documentos ficam visíveis para vocês?',
        answer: 'Não. A união acontece no seu navegador, no seu dispositivo, e os arquivos não são copiados para nenhum servidor. Documentos com dados pessoais permanecem com você do começo ao fim.'
      }
    ]
  },
  {
    en: 'photos-to-pdf-scanning',
    /* 2026-09-27. The only guide seed with real volume: `escanear documento`
       came back with 782 phrase keywords and 148 questions, a cluster of Easy
       >1000 terms (pelo celular, no iphone, na impressora). Built around what
       a concurso applicant actually hits — a PDF, a size limit, front and
       back of an ID — which the ranking tutorials (TechTudo, Tecnoblog) do
       not cover. Phone and WhatsApp steps were checked against Apple's and
       Google's help pages and TechTudo's walkthrough, not written from
       memory; labels drift between versions, so the text names where an
       option lives rather than promising exact menus. */
    slug: 'escanear-documento',
    title: 'Como Escanear Documento pelo Celular: iPhone, Android e WhatsApp | ConvertOcean',
    description: 'Como escanear documento pelo celular sem instalar nada — no iPhone, no Android e pelo WhatsApp — e como deixar o PDF pronto para concurso: legível, na ordem certa e abaixo de 2 MB.',
    h1: 'Como escanear documento pelo celular — e deixar o PDF pronto para enviar.',
    readTime: '8 min de leitura',
    publishDate: '27 de setembro de 2026',
    intro: 'O celular já substituiu o scanner, e na maioria dos aparelhos não é preciso instalar nada: o iPhone escaneia pelo app Notas, o Android pelo Google Drive e os dois pelo WhatsApp. O que costuma dar errado vem depois — o PDF que passa de 2 MB, o RG com frente e verso em arquivos separados, a página fora de ordem. Este guia cobre as duas partes.',
    contentHtml: `
      <h2>O que muda entre escanear e tirar uma foto</h2>
      <p>Escanear um documento é registrar a página de modo que ela fique plana, reta e legível — como uma cópia, não como uma foto do papel em cima da mesa. Os scanners do celular fazem isso sozinhos: detectam as bordas da folha, corrigem a inclinação, cortam o fundo e clareiam o papel. Uma foto comum mantém a mesa, a sombra da sua mão e a perspectiva torta.</p>
      <p>Por isso, quando o edital pede o documento “digitalizado”, use a função de escanear em vez da câmera comum sempre que puder.</p>

      <h2>Como escanear documento no iPhone, sem aplicativo</h2>
      <p>O iPhone escaneia pelo app <strong>Notas</strong>, que já vem instalado:</p>
      <ol>
        <li>Abra o Notas e crie uma nota nova.</li>
        <li>Toque no botão de anexo e escolha <strong>Escanear Documentos</strong>.</li>
        <li>Aponte a câmera para a folha. No modo automático, o iPhone captura sozinho quando reconhece as bordas; no manual, toque no obturador, ajuste os cantos e toque em <strong>Manter Escaneamento</strong>.</li>
        <li>Escaneie as páginas seguintes e toque em <strong>Salvar</strong>.</li>
      </ol>
      <p>Se o destino é um arquivo PDF, o app <strong>Arquivos</strong> é ainda mais direto: toque no botão de mais opções, escolha <strong>Escanear Documentos</strong>, faça o mesmo processo e escolha a pasta onde salvar — o escaneamento vira um PDF pronto para anexar.</p>

      <h2>Como escanear documento no Android</h2>
      <p>O caminho que funciona em quase todo Android — Samsung, Motorola, Xiaomi — é o <strong>Google Drive</strong>:</p>
      <ol>
        <li>No app do Drive, toque no botão da câmera.</li>
        <li>Fotografe a página; a área de corte aparece destacada.</li>
        <li>Use <strong>Cortar e girar</strong> para acertar as bordas, <strong>Filtrar</strong> para deixar em preto e branco e <strong>Adicionar</strong> para as próximas páginas.</li>
        <li>Toque em <strong>Concluído</strong>, escolha o formato <strong>.pdf</strong> e toque em <strong>Salvar</strong>.</li>
      </ol>
      <p>Nos Galaxy, a própria câmera da Samsung também digitaliza: com a opção de digitalização de documentos ativada nas configurações da câmera, ela reconhece a folha e oferece um botão para escanear. O nome e o lugar da opção mudam entre versões da One UI, então o Drive é o caminho mais previsível.</p>

      <h2>Como escanear pelo WhatsApp</h2>
      <p>Nas versões recentes, o WhatsApp tem um scanner embutido. Em uma conversa, toque no botão de anexar, escolha <strong>Documento</strong> e depois <strong>Escanear documento</strong>. Ajuste as bordas, toque em <strong>Manter Escaneamento</strong> e envie — o documento vai como PDF.</p>
      <p>É o mais rápido quando o destino é o próprio WhatsApp. Se a opção não aparecer, atualize o aplicativo; se ainda assim não aparecer, escaneie pelo Notas ou pelo Drive e anexe o PDF.</p>

      <h2>Na impressora multifuncional</h2>
      <p>Cada fabricante tem o seu programa, e é ele que dá mais controle: o Epson ScanSmart e o Epson Smart Panel, o HP Smart, o Canon IJ Scan Utility. No Windows, o <strong>Fax e Scanner do Windows</strong> também digitaliza de qualquer impressora instalada. Três ajustes resolvem a maior parte dos problemas:</p>
      <ul>
        <li><strong>Formato PDF</strong>, não JPG, quando o destino pede documento.</li>
        <li><strong>200 dpi</strong> para documentos. Texto continua nítido, e o arquivo fica muito menor que em 600 dpi.</li>
        <li><strong>Preto e branco ou tons de cinza</strong> quando a cor não importa — é a maior economia de tamanho que existe.</li>
      </ul>

      <h2>Para concurso e inscrição: o que costuma dar errado</h2>
      <p>Editais e portais de inscrição quase sempre pedem as mesmas coisas: arquivo em PDF, limite de tamanho — muitas vezes 2 MB — e documento legível. A recusa por ilegibilidade costuma chegar depois do prazo, então confira antes de enviar: abra o arquivo final, dê zoom e leia nome, número do documento e assinatura.</p>

      <h3>RG ou CNH com frente e verso</h3>
      <p>Se o edital aceita duas páginas, basta escanear a frente e depois o verso no mesmo documento. Se pede <strong>frente e verso na mesma folha</strong>, monte as duas fotos em uma imagem só com o <a href="/pt/juntar-fotos/">juntar fotos</a>, na vertical, e converta essa imagem em PDF.</p>

      <h3>Já tem as fotos? Transforme em PDF sem aplicativo</h3>
      <p>Se você fotografou com a câmera comum, o <a href="/pt/imagem-para-pdf/">imagem para PDF</a> converte as fotos direto no navegador do celular: uma foto por página, em A4, na ordem em que você as escolher. Fotos tiradas em pé entram em pé — a orientação que o celular registra na foto é respeitada. Adicione as páginas na sequência certa; se uma entrar fora do lugar, remova-a e adicione de novo.</p>

      <h3>O PDF ficou grande demais</h3>
      <p>Passe o arquivo pelo <a href="/pt/comprimir-pdf/">comprimir PDF</a>. Se o problema são muitas fotos pesadas, reduza-as antes com o <a href="/pt/redimensionar-imagem/">redimensionar imagem</a>: 1.500 a 2.000 pixels no lado maior mantêm o texto legível com uma fração do tamanho. E, para reunir vários documentos na ordem que o edital pede, use o <a href="/pt/juntar-pdf/">juntar PDF</a> — o guia de <a href="/pt/guias/juntar-varios-pdf/">como juntar vários PDF em um só</a> mostra o passo a passo.</p>
      <p>Se o edital também pede foto e assinatura em medidas exatas, isso é outro ajuste — veja <a href="/pt/guias/redimensionar-foto-assinatura/">como redimensionar foto e assinatura</a>.</p>

      <h2>Escaneou, mas precisa do texto?</h2>
      <p>Um documento escaneado é uma imagem do texto: dá para ler, mas não para copiar ou editar. Para recuperar as palavras, passe a imagem pelo <a href="/pt/imagem-para-texto/">imagem para texto</a>, que faz o reconhecimento (OCR) no próprio aparelho.</p>

      <h2>Seus documentos ficam com você</h2>
      <p>RG, CPF, comprovante de residência e contracheque são exatamente os arquivos que não deveriam circular. Muitos aplicativos de scanner gratuitos guardam os escaneamentos na nuvem deles; os scanners que já vêm no celular dispensam essa instalação, e as ferramentas do ConvertOcean processam tudo no navegador, no seu aparelho — nada é copiado para nenhum servidor.</p>
    `,
    faqs: [
      {
        question: 'como escanear um documento',
        answer: 'Há três caminhos, todos sem custo: o celular (app Notas no iPhone, Google Drive no Android), o WhatsApp (Anexar › Documento › Escanear documento) e a impressora multifuncional, pelo programa do fabricante. Para documentos que vão para inscrições e portais, salve em PDF e confira se ficou legível antes de enviar.'
      },
      {
        question: 'como escanear um documento pelo celular',
        answer: 'Use o scanner que já vem no sistema, que corrige a inclinação e recorta o fundo sozinho. Coloque a folha sobre uma superfície escura e lisa, com luz uniforme e sem sombra da sua mão, e deixe a folha ocupar quase toda a tela. Evite o flash: ele cria um reflexo que apaga parte do texto.'
      },
      {
        question: 'como escanear documento no iphone',
        answer: 'Abra o app Notas, toque no botão de anexo e escolha Escanear Documentos. O iPhone captura sozinho quando reconhece as bordas da página; depois toque em Salvar. Para obter um PDF direto em uma pasta, use o app Arquivos, que tem a mesma opção Escanear Documentos.'
      },
      {
        question: 'como escanear um documento na impressora',
        answer: 'Coloque a folha virada para baixo no vidro, abra o programa do fabricante no computador (Epson ScanSmart, HP Smart, Canon IJ Scan Utility) ou o Fax e Scanner do Windows e escolha PDF como formato. Para documentos, 200 dpi em preto e branco dão um arquivo nítido e leve.'
      },
      {
        question: 'como escanear documento pelo whatsapp',
        answer: 'Em uma conversa, toque em anexar, escolha Documento e depois Escanear documento. Ajuste as bordas, toque em Manter Escaneamento e envie: o documento vai como PDF. Se a opção não aparecer, atualize o WhatsApp.'
      },
      {
        question: 'o que é escanear um documento',
        answer: 'É transformar uma folha de papel em um arquivo digital que reproduz a página plana e legível, como uma cópia. Diferente de uma foto comum, o escaneamento corrige a perspectiva, recorta o fundo e clareia o papel, e o resultado costuma ser salvo em PDF.'
      },
      {
        question: 'Qual o tamanho máximo do PDF para concurso?',
        answer: 'Depende do edital, mas 2 MB por arquivo é um limite comum. Se o seu PDF passar disso, escaneie em 200 dpi e em preto e branco, e passe o resultado pelo comprimir PDF. Confira sempre o limite no próprio edital, porque ele varia entre concursos e entre documentos do mesmo concurso.'
      }
    ]
  }
];

/**
 * The non-tool pages, so the nav and footer resolve to Portuguese instead of
 * falling back to English. Each `slug` must match a file in src/pages/pt/.
 *
 * `/guides/` is absent on purpose: ptGuides is still empty, and a guides index
 * listing nothing is worse than the English one it currently falls back to.
 * The `/vs/` comparison pages are absent for the same reason — they are long
 * competitor write-ups that have not been localised.
 */
export const ptStaticPages: PtStaticPage[] = [
  {
    en: 'file-converter',
    slug: 'conversor-de-arquivos',
    title: 'Conversor de Arquivos Online Grátis — 100% Privado | ConvertOcean',
    description: 'Converta PDF, Word, Excel, PowerPoint, imagens e dados direto no navegador.'
  },
  {
    en: 'sitemap',
    slug: 'mapa-do-site',
    title: 'Mapa do Site — Todas as Ferramentas | ConvertOcean',
    description: 'Todas as ferramentas em português, organizadas por categoria.'
  },
  {
    en: 'about',
    slug: 'sobre',
    title: 'Sobre o ConvertOcean | Conversor de Arquivos Privado',
    description: 'Por que tudo é processado no navegador, e o que isso custa.'
  },
  {
    en: 'privacy',
    slug: 'privacidade',
    title: 'Política de Privacidade | ConvertOcean',
    description: 'Os seus arquivos não saem do seu dispositivo.'
  },
  {
    en: 'terms',
    slug: 'termos',
    title: 'Termos e Condições | ConvertOcean',
    description: 'Condições de uso das ferramentas do ConvertOcean.'
  },
  {
    en: 'contact',
    slug: 'contato',
    title: 'Fale Conosco | ConvertOcean',
    description: 'Como entrar em contato: dúvidas, erros de tradução ou solicitações sobre dados.'
  }
];
