export const site = {
  /** Full name, used in <title>, footer, structured data. */
  name: 'Ludovic Beghin',
  /** Short label for the header wordmark. */
  wordmark: 'Ludovic Beghin',
  /** Author email — kept out of the markup for now; used only if needed later. */
  email: 'ludo.beghin@gmail.com',
} as const;

export const socials: { label: string; href: string; icon: 'github' | 'linkedin' | 'rss' }[] = [
  { label: 'GitHub', href: 'https://github.com/ludobegins', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ludovic-beghin', icon: 'linkedin' },
];
