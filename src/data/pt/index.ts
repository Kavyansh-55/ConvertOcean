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
    subtitle: 'Comprima, junte, divida e converta PDF sem que o arquivo saia do seu computador.'
  },
  {
    en: 'image-tools',
    slug: 'ferramentas-de-imagem',
    name: 'Ferramentas de Imagem',
    title: 'Ferramentas de Imagem Online — Redimensionar e Converter | ConvertOcean',
    description: 'Redimensione, converta e comprima imagens JPG, PNG, WebP e HEIC direto no navegador, sem que nada saia do seu dispositivo.',
    headline: 'Ferramentas de imagem.',
    subtitle: 'Redimensione, converta e comprima fotos sem que elas saiam do seu dispositivo.'
  },
  {
    en: 'document-tools',
    slug: 'ferramentas-de-documentos',
    name: 'Ferramentas de Documentos',
    title: 'Ferramentas para Word, PowerPoint e TXT | ConvertOcean',
    description: 'Converta, junte e divida documentos do Word, PowerPoint e arquivos de texto direto no navegador.',
    headline: 'Ferramentas de documentos.',
    subtitle: 'Word, PowerPoint e arquivos de texto — tudo processado no seu próprio navegador.'
  },
  {
    en: 'excel-converter',
    slug: 'conversor-excel',
    name: 'Conversor de Excel',
    title: 'Conversor de Excel Online — XLSX, CSV e PDF | ConvertOcean',
    description: 'Converta planilhas Excel para PDF, CSV e JSON direto no navegador, sem que a planilha saia do seu computador.',
    headline: 'Conversor de Excel.',
    subtitle: 'Planilhas para PDF, CSV e JSON — processadas no seu navegador, não em um servidor.'
  },
  {
    en: 'business-tools',
    slug: 'ferramentas-empresariais',
    name: 'Ferramentas Empresariais',
    title: 'Gerador de Nota, Recibo e Calculadoras | ConvertOcean',
    description: 'Gere notas e recibos e calcule margem de lucro, ponto de equilíbrio e percentuais direto no navegador.',
    headline: 'Ferramentas empresariais.',
    subtitle: 'Notas, recibos e calculadoras — seus números não saem do seu dispositivo.'
  },
  {
    en: 'developer-tools',
    slug: 'ferramentas-para-desenvolvedores',
    name: 'Ferramentas para Desenvolvedores',
    title: 'Formatador de JSON e Contador de Palavras | ConvertOcean',
    description: 'Formate e valide JSON, conte palavras e converta dados direto no navegador, sem enviar nada para servidores.',
    headline: 'Ferramentas para desenvolvedores.',
    subtitle: 'JSON, CSV e texto — processados localmente, nunca em um servidor.'
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
    quickAnswer: 'Para juntar vários PDF em um só, arraste os arquivos para a ferramenta acima, arraste-os para a ordem desejada e baixe o documento único. Tudo é montado dentro do seu navegador, sem que os arquivos saiam do seu computador. É o caminho normal para reunir RG, CPF, diploma e comprovantes em um único anexo quando o edital pede um arquivo só.',
    category: 'Ferramentas PDF',
    faqs: [
      {
        question: 'como juntar varios pdf em um só',
        answer: 'Arraste todos os arquivos de uma vez para a ferramenta no topo da página e depois reordene-os arrastando cada miniatura. A ordem em que aparecem na tela é a ordem das páginas no arquivo final. Quando a sequência estiver certa, baixe o PDF único. Não há cadastro, marca d’água nem limite de quantos arquivos você pode reunir.'
      },
      {
        question: 'como juntar dois pdf',
        answer: 'O procedimento é o mesmo de qualquer quantidade: arraste os dois arquivos juntos e confirme qual vem primeiro antes de baixar. Se estiverem na ordem errada, basta arrastar uma das miniaturas para trocar de posição — é mais rápido do que refazer a união depois.'
      },
      {
        question: 'como juntar arquivos pdf',
        answer: 'A ferramenta aceita arquivos PDF. Não há limite fixo de quantidade nem de páginas: o que limita é a memória do seu próprio dispositivo, já que o processamento é local. Em um computador comum, dezenas de documentos são reunidos sem problema; arquivos muito grandes somados podem deixar o navegador lento antes de terminar.'
      },
      {
        question: 'como juntar fotos em pdf',
        answer: 'Fotos não são PDFs, então há um passo antes: converta as imagens usando <a href="/pt/jpg-para-pdf/">JPG para PDF</a>, o que gera um PDF com uma foto por página, e depois junte esse arquivo aos demais aqui. Se todas as fotos forem do mesmo conjunto, a conversão já pode reuni-las em um único PDF de uma vez.'
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
        answer: 'Adicione todos de uma vez em vez de um a um: a ferramenta aceita múltiplos arquivos na mesma seleção e os organiza em uma lista que você pode reordenar. Para documentos de concurso, monte a sequência exatamente como o edital pede antes de baixar, porque conferir depois custa refazer.'
      },
      {
        question: 'como mesclar pdf',
        answer: 'Arraste os arquivos, ordene e baixe. Vale lembrar que mesclar não reduz tamanho: o PDF final tem aproximadamente a soma dos originais. Se houver limite de tamanho no destino, passe o resultado pelo <a href="/pt/comprimir-pdf/">comprimir PDF</a> depois de mesclar — comprimir um arquivo só rende mais do que comprimir vários separados.'
      },
      {
        question: 'o que é mesclar pdf',
        answer: 'Mesclar um PDF é combinar vários documentos em um único arquivo, mantendo todas as páginas na ordem escolhida. Não altera o conteúdo das páginas, não reduz o tamanho e não recomprime nada — apenas coloca tudo dentro de um arquivo só. É o que se pede quando um sistema aceita apenas um anexo.'
      },
      {
        question: 'Como juntar RG, CPF e diploma em um único PDF?',
        answer: 'Adicione todos os documentos de uma vez e arraste as miniaturas até que a ordem corresponda à exigida pelo edital. Se os documentos estiverem em JPG, converta-os antes com <a href="/pt/jpg-para-pdf/">JPG para PDF</a>. Depois de unido, confira se o arquivo está dentro do limite de tamanho — quase sempre 2 MB — e comprima se necessário.'
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
      <p>Uma busca frequente é <strong>juntar pdf e jpg</strong>, e a resposta é que imagens não são PDFs. Converta-as primeiro em <a href="/pt/jpg-para-pdf/">JPG para PDF</a> — uma foto por página — e junte o resultado aos outros documentos aqui.</p>

      <h2>Unir não comprime</h2>
      <p>O arquivo final tem aproximadamente a soma dos originais. Se o destino impõe limite de tamanho, o caminho é unir primeiro e depois passar pelo <a href="/pt/comprimir-pdf/">comprimir PDF</a>: comprimir um arquivo único rende mais do que comprimir vários separadamente.</p>

      <h2>Os documentos não saem do seu dispositivo</h2>
      <p>A união é feita pelo próprio navegador. Contratos, extratos e documentos pessoais não são copiados para nenhum servidor — e o código do site é aberto, então a afirmação pode ser verificada em vez de aceita.</p>
    `
  },
  {
    en: 'image-to-pdf',
    slug: 'jpg-para-pdf',
    name: 'JPG para PDF',
    title: 'Converter JPG para PDF Online Grátis | ConvertOcean',
    description: 'Transforme fotos e documentos digitalizados em JPG ou PNG em um arquivo PDF direto no navegador, sem que as imagens saiam do seu dispositivo.',
    headline: 'JPG para PDF.',
    subtitle: 'Transforme fotos de documentos em um PDF organizado — sem que as imagens saiam do seu dispositivo.',
    quickAnswer: 'Para converter JPG em PDF, arraste as imagens para a ferramenta acima, coloque-as na ordem desejada e baixe o PDF. Cada foto vira uma página. A conversão acontece dentro do seu navegador e as imagens não saem do seu dispositivo. É o caminho usual para transformar fotos de documentos em um anexo aceito por editais e sistemas que só recebem PDF.',
    category: 'Ferramentas PDF',
    faqs: [
      {
        question: 'Como transformar a foto de um documento em PDF?',
        answer: 'Arraste a foto para a ferramenta e baixe o PDF. Para um documento com frente e verso, coloque as duas imagens na ordem certa antes de baixar — cada uma vira uma página. Fotos tiradas com o celular funcionam, mas alinhe o documento na tela e evite sombras: editais rejeitam imagens ilegíveis.'
      },
      {
        question: 'Posso juntar várias fotos em um único PDF?',
        answer: 'Sim. Arraste todas as imagens de uma vez e reordene-as arrastando cada miniatura. Todas entram no mesmo PDF, uma por página, na ordem que aparecer na tela.'
      },
      {
        question: 'Quais formatos de imagem são aceitos?',
        answer: 'JPG, JPEG, PNG e WebP. Fotos de celular em HEIC precisam ser convertidas para JPG antes — existe uma ferramenta específica para isso no site.'
      },
      {
        question: 'As fotos são copiadas para algum servidor?',
        answer: 'Não. A montagem do PDF é feita pelo seu navegador, no seu aparelho. Fotos de documentos pessoais não são copiadas para lugar nenhum e nós não temos acesso a elas.'
      },
      {
        question: 'O PDF gerado fica muito grande?',
        answer: 'Fotos de celular são pesadas, então um PDF com várias páginas pode passar de 10 MB. Se houver limite de tamanho, passe o resultado pelo comprimir PDF depois de gerar — documentos digitalizados costumam reduzir bastante sem comprometer a leitura.'
      }
    ]
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
        answer: 'Títulos, negrito, itálico, listas numeradas e com marcadores e tabelas são preservados. As quebras de página são calculadas para não cortar uma linha de texto ao meio. Fontes muito incomuns, instaladas só no seu computador, podem ser substituídas por uma equivalente — vale conferir a primeira página antes de enviar o documento.'
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
        question: 'A área de impressão definida no Excel é respeitada?',
        answer: 'Não. O conversor lê o intervalo utilizado da planilha — da primeira à última célula com conteúdo — e não a área de impressão configurada no Excel. Colunas ocultas também são impressas. Para controlar exatamente o que aparece no PDF, apague as linhas e colunas que não devem sair antes de converter, em vez de escondê-las.'
      },
      {
        question: 'O que acontece com planilhas muito largas?',
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
    description: 'Extrair texto de imagem com OCR direto no navegador: fotos, capturas de tela e documentos digitalizados viram texto editável. A imagem não sai do seu dispositivo.',
    headline: 'Imagem para Texto.',
    subtitle: 'Extraia o texto de fotos, capturas de tela e documentos digitalizados — o reconhecimento acontece no seu próprio aparelho.',
    quickAnswer: 'Para converter imagem em texto, selecione um JPG, PNG ou WebP na ferramenta acima: o mecanismo de OCR reconhece o texto impresso e devolve texto editável e copiável, dentro do seu navegador. Imagens nítidas e em boa resolução, com texto impresso, dão a melhor precisão; texto manuscrito é bem menos confiável. Nenhuma imagem sai do seu dispositivo.',
    category: 'Ferramentas de Imagem',
    faqs: [
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
        answer: 'Não é preciso instalar aplicativo nenhum. A ferramenta funciona no navegador do celular exatamente como no computador, inclusive com fotos tiradas na hora, e a imagem continua sem sair do aparelho. Depois que a página carrega uma vez, ela também funciona sem internet.'
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
      <p>Um <strong>conversor de imagem para texto</strong> usa reconhecimento óptico de caracteres: o programa examina os pixels, identifica as formas das letras e devolve os caracteres correspondentes. É o que permite <strong>extrair texto de imagem</strong> sem redigitar nada.</p>
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

export const ptTools: PtTool[] = [
  ...ptToolsSeed,
  ...ptToolsBatch1,
  ...ptToolsBatch2,
  ...ptToolsBatch3,
  ...ptToolsBatch4,
  ...ptToolsBatch5,
  ...ptToolsBatch6,
  ...ptToolsBatch7
];

/**
 * Guides live at `/pt/guias/<slug>/`. Empty until the keyword-led wave: the
 * concurso and Imposto de Renda angles are the point of this locale, and those
 * pages should be written from researched queries rather than translated from
 * the English guides, which target a different audience entirely.
 */
export const ptGuides: PtGuide[] = [];

/** About, privacy and terms. Added once the tool pages are in place. */
export const ptStaticPages: PtStaticPage[] = [];
