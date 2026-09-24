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
        question: 'Como deixar meu PDF abaixo de 2 MB para o concurso?',
        answer: 'Arraste o PDF para a ferramenta e escolha a compressão mais forte. O tamanho final aparece antes de você baixar, então dá para conferir se ficou dentro do limite do edital. Documentos digitalizados costumam cair bastante porque o peso está nas imagens das páginas — um RG ou diploma escaneado de 8 MB normalmente fica entre 500 KB e 1,5 MB. Se ainda passar do limite, digitalize novamente em 200 dpi e em preto e branco antes de comprimir.'
      },
      {
        question: 'O arquivo é copiado para algum servidor?',
        answer: 'Não. A compressão roda inteiramente no seu navegador, no seu próprio dispositivo. O documento não é copiado para nenhum servidor nosso nem de terceiros, e nós não temos como vê-lo. O código do site é aberto e pode ser conferido no repositório público.'
      },
      {
        question: 'A compressão perde qualidade?',
        answer: 'Depende do que existe no arquivo. Páginas digitalizadas passam por uma recompressão das imagens, então há perda visual — quanto mais forte a compressão, mais visível. PDFs gerados por Word ou pela impressão de uma planilha são quase todos texto, e nesses o texto continua nítido e selecionável em qualquer nível. A ferramenta mostra o tamanho final antes do download, então dá para testar um nível mais leve primeiro.'
      },
      {
        question: 'O documento continua legível para a banca?',
        answer: 'Sim, desde que você confira o resultado antes de anexar. Os editais rejeitam arquivos ilegíveis, então abra o PDF comprimido e verifique se dá para ler nome, números de documento e assinaturas. Se a compressão mais forte borrar o texto, volte um nível: normalmente o arquivo ainda fica dentro do limite.'
      },
      {
        question: 'Funciona no celular?',
        answer: 'Sim. A ferramenta funciona no navegador do celular da mesma forma que no computador, e o arquivo continua sem sair do aparelho. Depois que a página carrega, ela também funciona sem internet.'
      }
    ]
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
        question: 'Como juntar RG, CPF e diploma em um único PDF?',
        answer: 'Arraste todos os arquivos de uma vez para a ferramenta e depois reordene-os arrastando cada miniatura. A ordem em que aparecem na tela é a ordem das páginas no arquivo final. Se o edital pedir uma sequência específica, monte-a antes de baixar. Caso os documentos estejam em JPG, converta-os para PDF primeiro e depois junte tudo.'
      },
      {
        question: 'Existe limite de quantos arquivos posso unir?',
        answer: 'Não há limite fixo de quantidade. O que limita é a memória do seu próprio dispositivo, já que o processamento é local — em um computador comum, dezenas de documentos são unidos sem problema. Arquivos muito grandes juntos podem deixar o navegador lento antes de terminar.'
      },
      {
        question: 'A ordem das páginas é mantida?',
        answer: 'Sim. As páginas entram exatamente na ordem em que os arquivos aparecem na tela, e dentro de cada arquivo a ordem original é preservada. Confira a sequência antes de baixar, porque depois de unido o arquivo precisa ser refeito para mudar a ordem.'
      },
      {
        question: 'O conteúdo dos documentos fica visível para vocês?',
        answer: 'Não. A união acontece no seu navegador e os arquivos não são copiados para nenhum servidor. Documentos com dados pessoais — CPF, RG, comprovante de residência — permanecem no seu dispositivo do começo ao fim.'
      },
      {
        question: 'O arquivo final fica muito pesado?',
        answer: 'O PDF unido tem aproximadamente a soma dos originais. Se o edital impõe um limite de tamanho, passe o resultado pelo comprimir PDF depois de juntar — essa é a ordem que costuma funcionar melhor, porque comprimir um arquivo só rende mais do que comprimir vários separados.'
      }
    ]
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

export const ptTools: PtTool[] = [
  ...ptToolsSeed,
  ...ptToolsBatch1,
  ...ptToolsBatch2,
  ...ptToolsBatch3
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
