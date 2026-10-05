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
    title: string;
    heroLine: string;
    doors: { label: string; text: string; path: string }[];
    latestTitle: string;
    latestAll: string;
  };
  sobre: {
    title: string;
    metaDescription: string;
    eyebrow: string;
    /** Paragraphs; trusted HTML (rendered with set:html). */
    bioHtml: string[];
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
    map: {
      hint: string;
      loading: string;
      fallback: string;
      chapters: string;
      whole: string;
      legKm: string;
      legClimb: string;
    };
    statsTitle: string;
    stats: {
      distance: string;
      daysRiding: string;
      daysTotal: string;
      daysRest: string;
      elevGain: string;
      highest: string;
      biggestDay: string;
      biggestClimb: string;
      avgPerDay: string;
      legs: string;
      movingTime: string;
      countries: string;
    };
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
    title: 'Oi! Sou o Ludovic.',
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
    bioHtml: [
      'Engenheiro de formação, gosto de quebrar a cabeça pra resolver problemas difíceis — é o que eu acho mais legal na programação. Tenho ~4 anos de experiência full-stack, principalmente com Python, Angular e AWS.',
      'Agora, como (quase) todos na área, me adaptando à nova era pré-distópica "spec-driven", implorando tokens aos nossos novos lordes tecnofeudais. Mas também curtindo que dá pra fazer um site bonitinho com baixo esforço (sem saudades de mexer em CSS). Na área de programação, sou fã do <a href="https://tiangolo.com/" target="_blank" rel="noopener noreferrer">tiangolo</a>.',
      'Fora do trabalho, gosto de praia, esportes, tocar gaita e passar tempo com as pessoas que amo.',
      'Meus valores: amizade, curiosidade, natureza, humildade, empatia.',
    ],
    projectsTitle: 'Projetos',
    projects: [
      {
        name: 'por-ai',
        text: 'Mapa 3D interativo da travessia de bicicleta pelo Brasil, com pontos e notas do caminho.',
        href: 'https://github.com/ludobegins/por-ai',
      },
      {
        name: 'PPT do Flávio',
        text: 'Mapa de conexões criminosas do candidato à presidência.',
        href: 'https://pptdoflavio.com.br/',
      },
      {
        name: 'Este site',
        text: 'Feito em Astro, sem backend. Código aberto no GitHub.',
        href: 'https://github.com/ludobegins/ludobegins.github.io',
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
    lead: 'Oito meses, milhares de quilômetros, um caderno de anotações. Abaixo, a rota real em 3D — arraste pra girar, aproxime, clique num trecho pra ver o dia. Fotos e narrativa por capítulo vêm depois.',
    stillHtml:
      'A primeira versão da viagem, com as anotações do caminho, vive em <a href="https://ludobegins.github.io/por-ai/" target="_blank" rel="noopener noreferrer">ludobegins.github.io/por-ai</a>.',
    map: {
      hint: 'Clique num trecho pra ver o dia. Arraste pra girar, role pra aproximar.',
      loading: 'Carregando o mapa…',
      fallback: 'O mapa interativo precisa de JavaScript. Os números abaixo continuam valendo.',
      chapters: 'Capítulos',
      whole: 'Rota inteira',
      legKm: 'km',
      legClimb: 'subida',
    },
    statsTitle: 'Os números',
    stats: {
      distance: 'Distância de bike',
      daysRiding: 'Dias pedalando',
      daysTotal: 'Dias de viagem',
      daysRest: 'Dias de descanso',
      elevGain: 'Subida acumulada',
      highest: 'Ponto mais alto',
      biggestDay: 'Maior dia',
      biggestClimb: 'Maior subida num dia',
      avgPerDay: 'Média por dia pedalado',
      legs: 'Pernas',
      movingTime: 'Tempo em movimento',
      countries: 'Países',
    },
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
    title: "Hi! I'm Ludovic.",
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
    bioHtml: [
      "Engineer by training, I like racking my brain over hard problems — that's what I enjoy most about programming. I have ~4 years of full-stack experience, mostly with Python, Angular and AWS.",
      'Right now, like (almost) everyone in the field, adapting to the new pre-dystopian "spec-driven" era, begging our new technofeudal overlords for tokens. But also enjoying that you can build a nice little site with low effort (not missing fiddling with CSS). In the programming world, I\'m a fan of <a href="https://tiangolo.com/" target="_blank" rel="noopener noreferrer">tiangolo</a>.',
      'Outside of work, I like the beach, sports, playing harmonica and spending time with the people I love.',
      'My values: friendship, curiosity, nature, humility, empathy.',
    ],
    projectsTitle: 'Projects',
    projects: [
      {
        name: 'por-ai',
        text: 'Interactive 3D map of a bicycle crossing of Brazil, with waypoints and notes from the road.',
        href: 'https://github.com/ludobegins/por-ai',
      },
      {
        name: 'PPT do Flávio',
        text: 'Map of the criminal connections of the presidential candidate.',
        href: 'https://pptdoflavio.com.br/',
      },
      {
        name: 'This site',
        text: 'Built with Astro, no backend. Open source on GitHub.',
        href: 'https://github.com/ludobegins/ludobegins.github.io',
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
    lead: 'Eight months, thousands of kilometres, a notebook. Below, the real route in 3D — drag to rotate, zoom in, click a leg to see that day. Photos and a chapter-by-chapter story come later.',
    stillHtml:
      'The first version of the trip, with notes from the road, lives at <a href="https://ludobegins.github.io/por-ai/" target="_blank" rel="noopener noreferrer">ludobegins.github.io/por-ai</a>.',
    map: {
      hint: 'Click a leg to see that day. Drag to rotate, scroll to zoom.',
      loading: 'Loading the map…',
      fallback: 'The interactive map needs JavaScript. The numbers below still stand.',
      chapters: 'Chapters',
      whole: 'Whole route',
      legKm: 'km',
      legClimb: 'climb',
    },
    statsTitle: 'The numbers',
    stats: {
      distance: 'Distance by bike',
      daysRiding: 'Days riding',
      daysTotal: 'Days on the trip',
      daysRest: 'Rest days',
      elevGain: 'Total climb',
      highest: 'Highest point',
      biggestDay: 'Biggest day',
      biggestClimb: 'Biggest climb in a day',
      avgPerDay: 'Average per riding day',
      legs: 'Legs',
      movingTime: 'Moving time',
      countries: 'Countries',
    },
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
