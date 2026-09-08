export const site = {
  /** Full name, used in <title>, footer, structured data. */
  name: 'Ludovic Beghin',
  /** Short label for the header wordmark. */
  wordmark: 'Ludovic Beghin',
  /** Default meta description (pt-BR). */
  description:
    'Engenheiro de software. Escreve poemas e outros textos. Pedalou de Natal à Venezuela.',
  lang: 'pt-BR',
  /** Author email — kept out of the markup for now; used only for structured data if needed. */
  email: 'ludo.beghin@gmail.com',
} as const;

export const nav: { label: string; href: string }[] = [
  { label: 'Sobre', href: '/sobre' },
  { label: 'Escritos', href: '/escritos' },
  { label: 'Viagem', href: '/viagem' },
];

export const socials: { label: string; href: string; icon: 'github' | 'linkedin' | 'rss' }[] = [
  { label: 'GitHub', href: 'https://github.com/ludobegins', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ludovic-beghin', icon: 'linkedin' },
];
