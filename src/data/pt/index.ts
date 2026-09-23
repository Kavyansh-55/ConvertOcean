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

export const ptTools: PtTool[] = [
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
 * Guides live at `/pt/guias/<slug>/`. Empty until the keyword-led wave: the
 * concurso and Imposto de Renda angles are the point of this locale, and those
 * pages should be written from researched queries rather than translated from
 * the English guides, which target a different audience entirely.
 */
export const ptGuides: PtGuide[] = [];

/** About, privacy and terms. Added once the tool pages are in place. */
export const ptStaticPages: PtStaticPage[] = [];
