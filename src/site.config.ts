export const site = {
  /** Everyday name — <title>, footer, OG, RSS. Matches other platforms. */
  name: 'Ludovic Beghin',
  /** Full name with the Brazilian surname — used only on the Sobre/About page. */
  fullName: 'Ludovic de Souza',
  /** Short label for the header wordmark. */
  wordmark: 'Ludovic Beghin',
  /** Author email — kept out of the markup for now; used only if needed later. */
  email: 'ludo.beghin@gmail.com',
} as const;

export const socials: { label: string; href: string; icon: 'github' | 'linkedin' | 'rss' }[] = [
  { label: 'GitHub', href: 'https://github.com/ludobegins', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ludovic-beghin', icon: 'linkedin' },
];
