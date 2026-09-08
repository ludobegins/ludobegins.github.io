# Plano — site pessoal do Ludovic

Documento de planejamento. O código vive na branch `astro-rebuild`; a versão
Angular antiga continua em `main` como referência.

## Objetivo

Site pessoal, **mobile-first** e caprichado no desktop. Estético minimalista —
mas não hiper —, bonito e sem firula. Três frentes: uma seção profissional, uma
seção de escritos (poesia em primeiro lugar) e um mapa 3D da viagem de bicicleta.

## Decisões tomadas

| Tema               | Decisão                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Framework          | **Astro** (recomeço do zero). Conteúdo estático + 1 ilha pesada (mapa).                                                         |
| Idiomas            | **PT + EN em todo o site** (Astro i18n; PT na raiz, EN em `/en/`). Toggle no header. Só o conteúdo dos poemas fica no original. |
| Seção profissional | **Enxuta**: bio + poucos projetos + contato. Sem timeline nem CV em PDF (por ora).                                              |
| Viagem             | **Scrollytelling** (câmera voando pela rota, texto e foto por trecho) **+ modo explorar** livre no fim.                         |
| Mapa               | **MapLibre GL JS** (open source, sem API token — importante em repo público). Terreno 3D nativo.                                |
| Hospedagem         | **GitHub Pages** (já configurado). `base: '/ludoblog'`. Se o repo virar `ludobegins.github.io`, mudar para `base: '/'`.         |
| Cor de acento      | **Laranja queimado / ocre** sobre papel kraft (fundo cor de areia). Dark mode marrom-escuro (sistema + toggle).                 |
| Tipografia         | **Hanken Grotesk** (sans humanista, variável) para tudo — títulos, corpo e verso.                                               |
| Comentários        | Não, por enquanto. (Depois: giscus, se fizer sentido.)                                                                          |

## Arquitetura de conteúdo

Cada rota PT tem um espelho em `/en/` (mesmos slugs). Textos localizados vêm de
`src/i18n/ui.ts`; os corpos das páginas ficam em `src/components/pages/*Page.astro`
e recebem `locale`.

| Rota                     | Conteúdo                                                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/` · `/en/`             | Frase de abertura + 3 "portas" (Sobre / Escritos / Viagem) + links + últimos escritos.                                                                 |
| `/sobre` · `/en/sobre`   | Versão enxuta, PT e EN.                                                                                                                                |
| `/escritos` · `/en/...`  | Lista filtrável por `tipo`; `/escritos/:slug`; `/escritos/tipo/:tipo`; `/escritos/tag/:tag`; `rss.xml` (feed PT). Corpo dos poemas sempre no original. |
| `/viagem` · `/en/viagem` | Scrollytelling por capítulo → modo explorar + painel de números.                                                                                       |

### Modelo dos escritos (Markdown + frontmatter)

```yaml
# title e resumo são opcionais; sem title usa-se o primeiro verso
date: 2026-02-14
tipo: poesia # poesia | pensamentos  (enum fechado, default poesia)
tags: [viagem, saudade] # livres, opcionais
draft: false
# slug: opcional, sobrescreve o nome do arquivo
```

- `tipo: poesia` → layout de verso: quebras de linha preservadas (`remark-breaks`),
  estrofes com respiro, sem "tempo de leitura", sem `<h1>` visível quando não há título.
- Layout de prosa dedicado (medida ~63ch, tempo de leitura) fica para quando
  surgir um texto longo.
- Schema validado por Zod em `src/content.config.ts`.

### Viagem — dados

- Um único `public/viagem/rota.geojson` (unifica `data.geojson` + `data2.geojson`
  do repo `por-ai`), completado aqui.
- Propriedades por ponto: `id`, `place_name_pt/en`, `arrival_date`,
  `transport_to_here` (start | bicycle | boat | truck), `km_traveled`,
  `notes_pt/en`, e novas: `country`, `state`, `photo?`, `escrito?` (slug de um texto).
- Números (km, dias, países, estados, subida) calculados no build a partir do GeoJSON.
- Fotos: agrupar os ~40 pontos em ~7 capítulos por região; ~7–10 fotos-herói
  para o lançamento. Arquivo em `public/fotos/viagem/<id>.jpg`; script `sharp`
  gera tamanhos responsivos + placeholder. Fotos dos demais pontos entram aos poucos.

## Fases

- [x] **Fase 1 — Base.** Scaffold Astro, design tokens (cor/tipografia/espaço),
      dark mode, header/footer, deploy config. Páginas `/`, `/sobre`, `/about`, 404. Stubs de `/escritos` e `/viagem`.
- [x] **Fase 2 — Escritos.** Content collection + schema (`poesia` | `pensamentos`),
      listagem com filtro por tipo, layout de verso (remark-breaks), páginas de
      tipo e de tag, RSS, "últimos escritos" na home. 3 poemas reais semeados
      (datas a ajustar). Falta: layout de prosa dedicado se surgir texto longo;
      navegação anterior/próximo entre textos.
- [ ] **Fase 3 — Viagem.** Portar o GeoJSON, MapLibre + terreno, modo explorar,
      depois camada de scrollytelling e painel de números. Fallback estático + OG.
- [ ] **Fase 4 — Acabamento.** OG images, SEO/meta, view transitions, passada de
      performance e acessibilidade, favicon próprio, deploy via GitHub Actions.

## Rodando

```bash
npm install
npm run dev      # http://localhost:4321/ludoblog/
npm run build    # -> dist/
npm run preview
```
