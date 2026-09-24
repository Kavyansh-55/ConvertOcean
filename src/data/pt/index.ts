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

export const ptTools: PtTool[] = [...ptToolsSeed, ...ptToolsBatch1];

/**
 * Guides live at `/pt/guias/<slug>/`. Empty until the keyword-led wave: the
 * concurso and Imposto de Renda angles are the point of this locale, and those
 * pages should be written from researched queries rather than translated from
 * the English guides, which target a different audience entirely.
 */
export const ptGuides: PtGuide[] = [];

/** About, privacy and terms. Added once the tool pages are in place. */
export const ptStaticPages: PtStaticPage[] = [];
