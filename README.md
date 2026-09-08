# ludoblog

Site pessoal do Ludovic Beghin — seção profissional, escritos (poesia e prosa) e
um mapa 3D de uma viagem de bicicleta. Feito com [Astro](https://astro.build),
sem backend, publicado no GitHub Pages.

O planejamento e o roteiro de fases estão em [`PLAN.md`](./PLAN.md).

## Desenvolvimento

```bash
npm install
npm run dev       # http://localhost:4321/ludoblog/
npm run build     # gera dist/
npm run preview   # serve o build
npm run format    # prettier
```

## Estrutura

```
src/
  layouts/Base.astro        # shell HTML, <head>, header + footer
  components/                # Header, Footer, ThemeToggle, SocialLinks, Icon, LangSwitch
  pages/                     # rotas (index, sobre, about, escritos, viagem, 404)
  styles/tokens.css          # design tokens (cor, tipografia, espaço)
  styles/base.css            # reset + defaults + helpers de layout
  site.config.ts             # nome, navegação, links sociais
  lib/href.ts                # helper de URL que respeita o `base` do Astro
public/                      # imagens e assets estáticos
```

## Deploy

Configurado para GitHub Pages como _project site_
(`https://ludobegins.github.io/ludoblog/`). Se o repositório for renomeado para
`ludobegins.github.io`, ajustar `base` em `astro.config.mjs` para `'/'`.
