# Plano — site pessoal do Ludovic

Documento de planejamento. O código vive na branch `astro-rebuild`; a versão
Angular antiga continua em `main` como referência.

## Objetivo

Site pessoal, **mobile-first** e caprichado no desktop. Estético minimalista —
mas não hiper —, bonito e sem firula. Três frentes: uma seção profissional, uma
seção de escritos (poesia em primeiro lugar) e um mapa 3D da viagem de bicicleta.

## Decisões tomadas

| Tema               | Decisão                                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Framework          | **Astro** (recomeço do zero). Conteúdo estático + 1 ilha pesada (mapa).                                                 |
| Idiomas            | Site em **PT**. Seção profissional também em **EN** (`/sobre` ↔ `/about`). Poemas no original.                          |
| Seção profissional | **Enxuta**: bio + poucos projetos + contato. Sem timeline nem CV em PDF (por ora).                                      |
| Viagem             | **Scrollytelling** (câmera voando pela rota, texto e foto por trecho) **+ modo explorar** livre no fim.                 |
| Mapa               | **MapLibre GL JS** (open source, sem API token — importante em repo público). Terreno 3D nativo.                        |
| Hospedagem         | **GitHub Pages** (já configurado). `base: '/ludoblog'`. Se o repo virar `ludobegins.github.io`, mudar para `base: '/'`. |
| Cor de acento      | **Terracota / ocre** sobre papel off-white quente. Dark mode (sistema + toggle).                                        |
| Tipografia         | **Newsreader** (serifa literária, com eixo óptico) para títulos, poemas e prosa. Sans do sistema para a interface.      |
| Comentários        | Não, por enquanto. (Depois: giscus, se fizer sentido.)                                                                  |

## Arquitetura de conteúdo

| Rota                | Conteúdo                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `/`                 | Frase de abertura + 3 "portas" (Sobre / Escritos / Viagem) + links. Depois: últimos escritos. |
| `/sobre` + `/about` | Versão enxuta, PT e EN, com seletor de idioma discreto.                                       |
| `/escritos`         | Lista filtrável por `tipo`; `/escritos/:slug`; `/escritos/tag/:tag`; `rss.xml`.               |
| `/viagem`           | Scrollytelling por capítulo → modo explorar + painel de números.                              |

### Modelo dos escritos (Markdown + frontmatter)

```yaml
title: '…'
date: 2026-02-14
tipo: poesia # poesia | crônica | ensaio | conto | nota  (enum fechado, obrigatório)
tags: [viagem, saudade] # livres, opcionais
resumo: '…' # opcional — listagem e RSS
draft: false
```

- Layout de **poema** ≠ layout de **prosa**: poema com serifa de display,
  entrelinha ampla, estrofes e quebras preservadas, sem "tempo de leitura";
  prosa com medida de ~63ch e tempo de leitura.
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
- [ ] **Fase 2 — Escritos.** Content collection + schema, listagem, layouts
      poema/prosa, páginas de tag, RSS, sitemap dos posts. Semear com 2–3 textos reais.
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
