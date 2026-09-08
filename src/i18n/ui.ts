export const locales = ['pt', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt';

export const localeName: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
};

/** <html lang> value */
export const htmlLang: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en',
};

type Dict = {
  siteDescription: string;
  nav: { aria: string; sobre: string; escritos: string; viagem: string };
  skip: string;
  themeToggle: string;
  langToggleAria: string;
  home: {
    metaDescription: string;
    eyebrow: string;
    heroLine: string;
    doors: { label: string; text: string; path: string }[];
    latestTitle: string;
    latestAll: string;
  };
  sobre: {
    title: string;
    metaDescription: string;
    eyebrow: string;
    bio: string[];
    projectsTitle: string;
    projects: { name: string; text: string; href: string }[];
    contactTitle: string;
    contactHtml: string;
  };
  escritos: {
    title: string;
    metaDescription: string;
    eyebrow: string;
    heading: string;
    lead: string;
    empty: string;
    all: string;
    tipos: { poesia: string; pensamentos: string };
    tipoEmpty: (label: string) => string;
    tagEmpty: string;
  };
  viagem: {
    title: string;
    metaDescription: string;
    eyebrow: string;
    heading: string;
    lead: string;
    stillHtml: string;
  };
  notFound: {
    title: string;
    eyebrow: string;
    heading: string;
    body: string;
    back: string;
  };
};

const pt: Dict = {
  siteDescription:
    'Site pessoal de Ludovic Beghin — engenheiro de software, poemas e uma viagem de bicicleta.',
  nav: {
    aria: 'Navegação principal',
    sobre: 'Sobre',
    escritos: 'Escritos',
    viagem: 'Viagem',
  },
  skip: 'Pular para o conteúdo',
  themeToggle: 'Alternar tema claro/escuro',
  langToggleAria: 'Mudar idioma',
  home: {
    metaDescription:
      'Site pessoal de Ludovic Beghin — engenheiro de software, poemas e uma viagem de bicicleta.',
    eyebrow: 'Site pessoal & caderno',
    heroLine:
      'Engenheiro de software. Escrevo umas coisas. Em 2025 saí de Natal e fui de bicicleta até a Colômbia.',
    doors: [
      {
        label: 'Sobre',
        text: 'Quem sou, o que faço e o tipo de trabalho que procuro.',
        path: 'sobre',
      },
      {
        label: 'Escritos',
        text: 'Poesia em primeiro lugar, mais alguns pensamentos soltos. Filtrável por tipo.',
        path: 'escritos',
      },
      {
        label: 'Viagem',
        text: 'Um mapa em 3D dos oito meses que passei atravessando o Brasil de bicicleta.',
        path: 'viagem',
      },
    ],
    latestTitle: 'Últimos escritos',
    latestAll: 'Ver todos',
  },
  sobre: {
    title: 'Sobre',
    metaDescription: 'Ludovic Beghin — engenheiro de software à procura do próximo desafio.',
    eyebrow: 'Sobre',
    bio: [
      'Engenheiro de formação, resolvedor de problemas por índole. Gosto de achar soluções elegantes para problemas complexos — de caçar bugs a desenhar sistemas escaláveis com Python, Angular e AWS. Meu maior trunfo talvez seja adaptar e aprender rápido.',
      'Depois de uma expedição de bicicleta de oito meses, voltei ao teclado à procura do próximo desafio — de preferência construindo software com impacto ambiental ou social concreto.',
      'Longe da tela: pedalando estradas remotas, jogando futevôlei, lendo, incomodando os vizinhos com a gaita ou tomando uma cerveja com os amigos.',
    ],
    projectsTitle: 'Projetos',
    projects: [
      {
        name: 'por-ai',
        text: 'Mapa 3D interativo da travessia de bicicleta pelo Brasil, com pontos e notas do caminho.',
        href: 'https://github.com/ludobegins/por-ai',
      },
      {
        name: 'Este site',
        text: 'Feito em Astro, sem backend. Código aberto no GitHub.',
        href: 'https://github.com/ludobegins/ludoblog',
      },
    ],
    contactTitle: 'Contato',
    contactHtml:
      'A melhor forma de falar comigo é pelo <a href="https://www.linkedin.com/in/ludovic-beghin" target="_blank" rel="noopener noreferrer">LinkedIn</a>.',
  },
  escritos: {
    title: 'Escritos',
    metaDescription: 'Poemas e pensamentos de Ludovic Beghin.',
    eyebrow: 'Escritos',
    heading: 'Poemas & pensamentos',
    lead: 'A maior parte é poesia — muita dela escrita na estrada. O resto são pensamentos soltos.',
    empty: 'Ainda não publiquei nada aqui.',
    all: 'Todos',
    tipos: { poesia: 'Poesia', pensamentos: 'Pensamentos' },
    tipoEmpty: (label) => `Nenhum texto em ${label.toLowerCase()} ainda.`,
    tagEmpty: 'Nada com essa tag ainda.',
  },
  viagem: {
    title: 'Viagem',
    metaDescription: 'Mapa 3D da travessia de bicicleta de Ludovic Beghin, de Natal à Colômbia.',
    eyebrow: 'Viagem',
    heading: 'De Natal à Colômbia, de bicicleta',
    lead: 'Oito meses, milhares de quilômetros, um caderno de anotações. Estou reconstruindo o mapa em 3D aqui — com voo de câmera pela rota, fotos do caminho e um modo de exploração livre.',
    stillHtml:
      'Enquanto isso, a primeira versão vive em <a href="https://ludobegins.github.io/por-ai/" target="_blank" rel="noopener noreferrer">ludobegins.github.io/por-ai</a>.',
  },
  notFound: {
    title: 'Página não encontrada',
    eyebrow: 'Erro 404',
    heading: 'Esta página não existe',
    body: 'O link pode estar quebrado, ou a página pode ter mudado de lugar.',
    back: 'Voltar para o início',
  },
};

const en: Dict = {
  siteDescription:
    "Ludovic Beghin's personal site — software engineer, poems, and a bicycle journey.",
  nav: {
    aria: 'Main navigation',
    sobre: 'About',
    escritos: 'Writing',
    viagem: 'Journey',
  },
  skip: 'Skip to content',
  themeToggle: 'Toggle light/dark theme',
  langToggleAria: 'Change language',
  home: {
    metaDescription:
      "Ludovic Beghin's personal site — software engineer, poems, and a bicycle journey.",
    eyebrow: 'Personal site & notebook',
    heroLine:
      'Software engineer. I write things. In 2025 I left Natal and rode a bicycle to Colombia.',
    doors: [
      {
        label: 'About',
        text: 'Who I am, what I do, and the kind of work I am looking for.',
        path: 'sobre',
      },
      {
        label: 'Writing',
        text: 'Poetry first, with a few loose thoughts. Filterable by type. Written in Portuguese.',
        path: 'escritos',
      },
      {
        label: 'Journey',
        text: 'A 3D map of the eight months I spent crossing Brazil by bicycle.',
        path: 'viagem',
      },
    ],
    latestTitle: 'Latest writing',
    latestAll: 'See all',
  },
  sobre: {
    title: 'About',
    metaDescription: 'Ludovic Beghin — software engineer looking for the next challenge.',
    eyebrow: 'About',
    bio: [
      'Engineer by training, problem-solver at heart. I love finding elegant solutions to complex problems, from hunting down bugs to architecting scalable systems with Python, Angular, and AWS. I think my greatest asset is being able to adapt and learn quickly.',
      "After a recent 8-month bicycle expedition, I'm back at the keyboard and looking for my next challenge — ideally building software that makes a tangible environmental or social impact.",
      "When I'm off-screen: cycling remote roads, playing footvolley, reading, annoying my neighbours with my harmonica, or sharing a beer with friends.",
    ],
    projectsTitle: 'Projects',
    projects: [
      {
        name: 'por-ai',
        text: 'Interactive 3D map of a bicycle crossing of Brazil, with waypoints and notes from the road.',
        href: 'https://github.com/ludobegins/por-ai',
      },
      {
        name: 'This site',
        text: 'Built with Astro, no backend. Open source on GitHub.',
        href: 'https://github.com/ludobegins/ludoblog',
      },
    ],
    contactTitle: 'Contact',
    contactHtml:
      'The best way to reach me is on <a href="https://www.linkedin.com/in/ludovic-beghin" target="_blank" rel="noopener noreferrer">LinkedIn</a>.',
  },
  escritos: {
    title: 'Writing',
    metaDescription: 'Poems and thoughts by Ludovic Beghin.',
    eyebrow: 'Writing',
    heading: 'Poems & thoughts',
    lead: 'Mostly poetry — much of it written on the road. The rest are loose thoughts. Written in Portuguese.',
    empty: "I haven't published anything here yet.",
    all: 'All',
    tipos: { poesia: 'Poetry', pensamentos: 'Thoughts' },
    tipoEmpty: (label) => `No ${label.toLowerCase()} yet.`,
    tagEmpty: 'Nothing with this tag yet.',
  },
  viagem: {
    title: 'Journey',
    metaDescription: "3D map of Ludovic Beghin's bicycle crossing, from Natal to Colombia.",
    eyebrow: 'Journey',
    heading: 'From Natal to Colombia, by bicycle',
    lead: "Eight months, thousands of kilometres, a notebook. I'm rebuilding the map in 3D here — with a camera flying along the route, photos from the road, and a free-explore mode.",
    stillHtml:
      'In the meantime, the first version lives at <a href="https://ludobegins.github.io/por-ai/" target="_blank" rel="noopener noreferrer">ludobegins.github.io/por-ai</a>.',
  },
  notFound: {
    title: 'Page not found',
    eyebrow: 'Error 404',
    heading: "This page doesn't exist",
    body: 'The link may be broken, or the page may have moved.',
    back: 'Back to home',
  },
};

export const ui: Record<Locale, Dict> = { pt, en };
