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
| Hospedagem         | **GitHub Pages** (já configurado). Repo `ludobegins.github.io`, `base: '/'`.         |
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
| `/escritos` · `/en/...`  | Lista filtrável por `tipo`; `/escritos/:slug`; `/escritos/tipo/:tipo`; `/escritos/tag/:tag`. Corpo dos poemas sempre no original. |
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

Duas camadas, cruzadas pelo capítulo/região:

**1. Traçado real (Strava).** O traçado passa a ser o GPS de verdade, não mais as
linhas retas entre pontos do `por-ai`.

- Fonte: **export completo do Strava** (Configurações → Minha conta → _Baixar ou
  excluir sua conta_ → pedir o arquivo). Chega por e-mail um ZIP com um GPX por
  atividade + `activities.csv` com os resumos. Sem API, sem token. O ZIP está no
  repo como fonte, fora do git: `strava-export/export_38598547.zip`
  (a pasta `strava-export/` já está no `.gitignore`).
- É a **conta inteira** (301 atividades desde 2018). O script filtra:
  - **janela da viagem** — `Data da atividade` entre **2025-09-17 e 2026-05-23**
    (≈163 atividades). Obs.: as colunas do `activities.csv` vêm em português
    (`Tipo de atividade`, `Data da atividade`, `Nome do arquivo`…) e a data no
    formato `8 de set. de 2026, 06:47:55`.
  - **só bike** — manter `Tipo de atividade == Pedalada` (≈150). As 13 `Trilha`/
    `Caminhada` da janela são passeios a pé no destino (Tayrona, Minca, cachoeiras
    da Gran Sabana, Medellín) — fora do traçado; podem virar pontos depois.
- Script local (Node): `scripts/build-viagem.mjs` (`npm run viagem`). Lê
  `strava-export/activities.csv` + `strava-export/activities/*.gpx` (extrair o ZIP
  nessa pasta antes — tudo gitignorado) e gera dois arquivos:
  - `public/viagem/rota.geojson` — o traçado real, simplificado (Douglas–Peucker,
    tolerância no topo do script) pra não pesar (~430 kB, 1 feature `LineString`
    por perna). Props: `date`, `name`, `chapter`, `chapter_slug`, `country`,
    `transport` (bicycle — barco/caminhão entram à mão depois), `distance_km`,
    `elev_gain_m`, `moving_time_s`.
  - `src/data/viagem-stats.json` — os números (abaixo) + um bloco por capítulo,
    calculados uma vez.
- 1 atividade do Strava ≈ 1 perna/dia. As pernas caem em **7 capítulos por data**
  (const `CHAPTERS` no topo do script). Cortes definidos pelo autor (a bater com
  os waypoints):
  - Brasil: **1. Nordeste** (17/09 → 27/10, litoral RN/CE, termina ao entrar no
    Pará) · **2. Amazônia** (28/10 → fronteira 14/01: Belém, a balsa, Santarém, o
    rio, Manaus → BR-174 → Boa Vista → Pacaraima).
  - Venezuela: **3. Gran Sabana e Leste** (14/01 → 21/02: Santa Elena, tepuis,
    quedas → Ciudad Guayana, Maturín, até a costa) · **4. Costa caribenha**
    (→ 22/03: Isla Margarita, Puerto La Cruz, Caracas) · **5. Oeste** (23/03 →
    fronteira 12/04: Morón, Coro).
  - Colômbia: **6. Caribe colombiano** (13/04 → 06/05: Santa Marta, Minca,
    Tayrona) · **7. Eje cafetero** (07/05 → 21/05: a subida pra serra, Medellín e
    a zona cafeeira).
- Sem cortar início/fim dos tracks (privacidade ok segundo o autor).
- Transfers de barco/caminhão: não têm GPS — linha reta tracejada, contados à parte.

**2. Pontos narrativos.** Os ~40 waypoints do `por-ai` seguem como âncoras de
narrativa, por cima do traçado. `public/viagem/pontos.geojson`, completado à mão.

- Propriedades por ponto: `id`, `place_name_pt/en`, `arrival_date`,
  `transport_to_here` (start | bicycle | boat | truck), `km_traveled`,
  `notes_pt/en`, `country`, `state`, `chapter`, `photo?`, `escrito?` (slug de um texto).

**Estatísticas** (lista candidata — enxugar/acrescentar depois):

- distância total de bike (transfers à parte)
- dias na estrada · dias totais · dias de descanso
- países e estados/departamentos atravessados
- subida acumulada · ponto mais alto
- maior dia em km · maior dia de subida
- média de km por dia pedalado · nº de pernas
- tempo total em movimento
- manuais, se houver dado: furos de pneu, noites acampado…

**Fotos.** Agrupar os ~40 pontos nos 7 capítulos (2 Brasil · 3 Venezuela · 2
Colômbia); ~7–10 fotos-herói para o
lançamento. `public/fotos/viagem/<id>.jpg`; script `sharp` gera tamanhos
responsivos + placeholder. Fotos dos demais pontos entram aos poucos.

## Fases

- [x] **Fase 1 — Base.** Scaffold Astro, design tokens (cor/tipografia/espaço),
      dark mode, header/footer, deploy config. Páginas `/`, `/sobre`, `/about`, 404. Stubs de `/escritos` e `/viagem`.
- [x] **Fase 2 — Escritos.** Content collection + schema (`poesia` | `pensamentos`),
      listagem com filtro por tipo, layout de verso (remark-breaks), páginas de
      tipo e de tag, "últimos escritos" na home. 3 poemas reais semeados
      (datas a ajustar). Falta: layout de prosa dedicado se surgir texto longo;
      navegação anterior/próximo entre textos.
- [ ] **Fase 3 — Viagem.** _Primeira versão no ar; falta scrollytelling +
      pontos._ Feito: `scripts/build-viagem.mjs` (Strava → `public/viagem/rota.geojson` + `src/data/viagem-stats.json`, `npm run viagem`); `scripts/build-paises.mjs`
      → `public/viagem/paises.geojson` (contornos Natural Earth 50m, `npm run paises`);
      `/viagem` reconstruída — ilha MapLibre (`src/components/viagem/TripMap.astro`)
      com relevo (hillshade + terreno 3D, DEM terrarium Tilezen/AWS, sem token)
      sobre o kraft, contornos de país, rota colorida por capítulo, legenda que voa
      a câmera pro capítulo, popup por perna, tema claro/escuro; painel de números
      server-side (`StatsPanel.astro`); `<noscript>` + estado de erro com fallback
      pro por-ai. Falta: modo explorar (filtro por transporte, depende dos transfers
      à mão), `pontos.geojson` (os ~40 waypoints), scrollytelling por capítulo
      (precisa dos textos + fotos), fallback como imagem + OG (Fase 4).
      **Pendências do autor:** conferir os limites de capítulo (`CHAPTERS` em
      `scripts/build-viagem.mjs`) com os waypoints; completar os pontos/notas.
- [ ] **Fase 4 — Acabamento.** OG images, SEO/meta, view transitions, passada de
      performance e acessibilidade, favicon próprio, deploy via GitHub Actions.

## Rodando

```bash
npm install
npm run dev      # http://localhost:4321/
npm run build    # -> dist/
npm run preview
```
