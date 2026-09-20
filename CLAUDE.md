# ID Postur — Contexte projet

Fiche de référence pour travailler vite et juste sur ce site. **Priorité : SEO** (section dédiée + checklist).

---

## 1. Activité & contexte business

- **Activité** : Étude posturale et bike fitting pour cyclistes (route, VTT, gravel, triathlon).
- **Technologie** : STT Systems Motio — 3DMA (capture optique 3D par marqueurs réfléchissants, précision < 1 mm, mesure cycliste + vélo dans les 3 plans) et 2DMA (analyse vidéo 1080p en vue latérale, 50+ mesures automatiques, mesure le cycliste uniquement). ⚠ IDmatch (BikeLab, Cleat Fit) n'est **plus utilisé** — ne plus le mentionner.
- **Fondateur** : Romain Hardy (ex-cycliste pro), créé en 2023.
- **Chiffres clés** : 800+ études, 25+ pros, 3+ ans d'expérience.
- **Localisation** : 112 Route du Meuble, 35520 La Mézière (près de Rennes), Bretagne, France.
- **Zone** : Rennes + Ille-et-Vilaine.
- **Langue** : Français uniquement (`lang="fr"`, `og:locale=fr_FR`).
- **Contact** : idpostur@gmail.com / 06 07 16 73 23 (`+33607167323`). Affichage et JSON-LD lisent tous deux [entreprise.ts](src/data/entreprise.ts) — plus d'incohérence possible. ⚠ Un ancien numéro `06 58 37 33 03` traînait dans la doc : confirmer auprès de Romain lequel est le bon.
- **Horaires** : Lun–Ven 9h–19h.
- **Réseaux** : Instagram (@idpostur), Facebook.
- **CTA principal** : "Prendre rendez-vous" (Calendly externe).
- **CTA secondaire** : Téléchargement carte cadeau (PDF).

---

## 2. Stack & commandes

- **Astro 5.16** (SSG pur, **aucun JS côté client** hors Speed Insights).
- **Tailwind CSS 4** via `@tailwindcss/vite` (pas de `tailwind.config.js`, tout est dans [global.css](src/styles/global.css)).
- **Animations** : CSS natives (`@keyframes` + `IntersectionObserver` inline pour les reveals — voir [global.css](src/styles/global.css) et [chiffres.astro](src/components/chiffres.astro)). Respect `prefers-reduced-motion`.
- **Fonts** : `@fontsource/poppins` (locale, toutes graisses).
- **Embeds** : `astro-embed` (YouTube).
- **Perf** : `@vercel/speed-insights/astro` intégré dans BaseLayout. Build ~1s, 0 JS généré pour les pages.
- **Hébergement** : Vercel. Domaine : **https://id-postur.fr**.
- ⚠ **Pas de React ni de Motion** : supprimés volontairement pour garder un bundle 100% statique. Ne pas les réintroduire sans raison forte.

**Scripts** (package.json) :
```bash
npm run dev       # astro dev → localhost:4321
npm run build     # build statique → dist/
npm run preview   # preview prod localement
```

**Couleurs de marque** (définies dans global.css) :
- `--color-id-postur: #F80000`
- `--color-id-postur-dark: #c00000`
- Accessibles via classes Tailwind `bg-id-postur`, `text-id-postur`, etc.

---

## 3. Arborescence

### Données — [src/data/](src/data/) ⭐ sources uniques de vérité
| Fichier | Contenu |
|---|---|
| [tarifs.ts](src/data/tarifs.ts) | Prestations : prix, durées, équipement, disciplines, liens Calendly, contenu de la page comparative. |
| [entreprise.ts](src/data/entreprise.ts) | Identité : NAP, géo, horaires, avis Google, fondateur, zone desservie, expertises, libellés du fil d'Ariane, `@id` JSON-LD. |
| [faq.ts](src/data/faq.ts) | Questions de la page d'accueil, partagées entre l'affichage et le balisage FAQPage. |

**Règle** : aucun prix, aucune durée, aucune donnée de contact et aucun nombre d'avis ne s'écrit en dur dans un `.astro`. On importe depuis `src/data/`. C'est ce qui garantit que le contenu visible et le JSON-LD ne peuvent pas diverger — exigence explicite de Google.

### Schéma — [src/lib/schema.ts](src/lib/schema.ts)
Constructeurs des nœuds JSON-LD. Le site émet **un seul bloc `application/ld+json` par page**, sous forme de `@graph`. Voir §4.

### Pages — [src/pages/](src/pages/) (8 pages + 1 endpoint)
| URL | Fichier | Rôle | Indexée |
|---|---|---|---|
| `/` | [index.astro](src/pages/index.astro) | Accueil (hero, chiffres, formules, avis, FAQ, bloc SEO) | ✅ |
| `/etudes-posturales` | [etudes-posturales.astro](src/pages/etudes-posturales.astro) | Page principale : formats 3D et 2D, tarifs | ✅ |
| `/etude-posturale-3d-ou-2d` | [etude-posturale-3d-ou-2d.astro](src/pages/etude-posturale-3d-ou-2d.astro) | Comparatif des deux formats | ✅ |
| `/etude-posturale-nantes` | [etude-posturale-nantes.astro](src/pages/etude-posturale-nantes.astro) | Landing locale Nantes (byline + dates) | ✅ |
| `/cales` | [cales.astro](src/pages/cales.astro) | Réglage des cales | ✅ |
| `/choix-nouveau-velo` | [choix-nouveau-velo.astro](src/pages/choix-nouveau-velo.astro) | Conseil avant achat | ✅ |
| `/rendez-vous-divers` | [rendez-vous-divers.astro](src/pages/rendez-vous-divers.astro) | Rendez-vous court | ✅ |
| `/mentions-legales` | [mentions-legales.astro](src/pages/mentions-legales.astro) | Mentions légales / RGPD | ✅ |
| `/reserver` | [reserver/index.astro](src/pages/reserver/index.astro) | Aiguillage réservation | ❌ noindex |
| `/reserver/premiere-etude` | [reserver/premiere-etude.astro](src/pages/reserver/premiere-etude.astro) | Créneaux première étude | ❌ noindex |
| `/reserver/deja-client` | [reserver/deja-client.astro](src/pages/reserver/deja-client.astro) | Créneaux tarif réduit | ❌ noindex |
| `/llms.txt` | [llms.txt.ts](src/pages/llms.txt.ts) | Fiche de synthèse pour les moteurs de réponse IA, **générée** depuis `src/data/` | — |

### Layouts — [src/layouts/](src/layouts/)
- [BaseLayout.astro](src/layouts/BaseLayout.astro) — layout unique. Props : `title`, `description`, `ogImage`, `ogType`, `noindex`, `faq`, `schema`, `datePublished`, `dateModified`. Assemble le `@graph` JSON-LD.

### Composants — [src/components/](src/components/) (100% `.astro`, aucun JSX)
**Sections** : [hero.astro](src/components/hero.astro) (H1 de la home), [chiffres.astro](src/components/chiffres.astro), [qui.astro](src/components/qui.astro), [formule.astro](src/components/formule.astro), [faq.astro](src/components/faq.astro), [confiances.astro](src/components/confiances.astro), [partenaires.astro](src/components/partenaires.astro), [avis.astro](src/components/avis.astro), [seo.astro](src/components/seo.astro), [autres-prestations.astro](src/components/autres-prestations.astro).

**UI** : [Header.astro](src/components/Header.astro), [Footer.astro](src/components/Footer.astro), [Button.astro](src/components/Button.astro), [formulecomponent.astro](src/components/formulecomponent.astro), [Textwithimage.astro](src/components/Textwithimage.astro), [Textwithimages.astro](src/components/Textwithimages.astro), [maps.astro](src/components/maps.astro).

### Public — [public/](public/)
- [robots.txt](public/robots.txt) — autorise explicitement les crawlers IA (voir §4.3)
- Favicon : `id-postur-favicon.png` · Images dans `public/images/` (majoritairement `.webp`) · Icônes dans `public/icon/`

### Config
- [astro.config.mjs](astro.config.mjs) — Tailwind + sitemap (filtre les pages noindex via `NOINDEX_PATHS`).
- [tsconfig.json](tsconfig.json) — strict.

---

## 4. SEO — état des lieux & plan d'action ⭐

### 4.1 Architecture des données structurées ⭐

**Un seul bloc JSON-LD par page**, en `@graph`, généré par [BaseLayout.astro](src/layouts/BaseLayout.astro) via [src/lib/schema.ts](src/lib/schema.ts).

Nœuds présents sur **toutes** les pages :
| Nœud | `@id` | Rôle |
|---|---|---|
| `LocalBusiness` + `SportsActivityLocation` | `#business` | L'établissement : NAP, géo, horaires, `hasMap`, `areaServed`, `knowsAbout`, `aggregateRating` |
| `WebSite` | `#website` | Rattache chaque page à une publication identifiée |
| `Person` | `#romain-hardy` | Le fondateur — principal actif E-E-A-T, lié par `founder` / `worksFor` / `author` |
| `WebPage` | `<url>#page` | La page : `isPartOf`, `about`, `author`, `publisher`, `primaryImageOfPage`, `breadcrumb` |
| `BreadcrumbList` | `<url>#fil-ariane` | Généré automatiquement depuis `LIBELLES_FIL_ARIANE` (absent sur `/`) |

Nœuds ajoutés par la page via la prop `schema` : `Service` (+ `Offer` construites depuis `tarifs.ts`).
Quand la page passe `faq`, son `WebPage` porte aussi le type `FAQPage` et expose les `Question` en `mainEntity`.

**Ajouter une page** → rien à faire pour le JSON-LD de base. Passer `faq={...}` si elle a une FAQ visible, `schema={[noeudService({...})]}` si elle vend une prestation, et ajouter son libellé dans `LIBELLES_FIL_ARIANE`.

**Ne jamais** ajouter une balise `<script type="application/ld+json">` dans une page : tout passe par la prop `schema`.

### 4.2 Fondations SEO en place ✅

- **BaseLayout paramétrable**, canonical auto-généré, OG absolue, Twitter card.
- **Sitemap auto** (`/sitemap-index.xml`), n'inclut que les pages indexables.
- **URLs canoniques cohérentes** : la forme avec slash final (`/cales/`) est utilisée par la balise canonical, le sitemap ET tous les `@id` JSON-LD — sinon les références du graphe ne se résolvent pas (helper `canonique()` dans `entreprise.ts`).
- **NAP unifié** : adresse, téléphone et email viennent tous de `entreprise.ts`, affichage comme balisage.
- **Avis Google** : une seule constante `AVIS_GOOGLE.nombre` pilote le hero, la page Nantes et l'`aggregateRating`.

### 4.3 Visibilité sur les moteurs de réponse IA

- **[/llms.txt](src/pages/llms.txt.ts)** — généré au build depuis `src/data/`. Résume l'activité, les prestations avec prix et durées, les pages du site, les infos pratiques et une section « à ne pas confondre » (IDmatch abandonné, pas de prestation à distance).
- **[robots.txt](public/robots.txt)** — autorise nommément GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, meta-externalagent, Amazonbot, MistralAI-User, CCBot. ⚠ Ne jamais bloquer les robots de **recherche en direct** (OAI-SearchBot, Claude-SearchBot, PerplexityBot) : ce sont eux qui conditionnent la citation du site dans une réponse.
- **`knowsAbout`** sur l'entreprise et sur le fondateur : dit explicitement sur quoi l'entité fait autorité.

### 4.4 ⚠ Dette SEO restante

1. **`aggregateRating` auto-déclaré** : Google n'affiche pas d'étoiles pour un avis qu'une entreprise publie sur elle-même (règle « self-serving reviews »). Conservé pour Bing et les moteurs IA, mais ne produira pas de rich snippet Google. Les étoiles viennent de la fiche Google Business.
2. **Rich snippet FAQ supprimé par Google** depuis août 2023 (réservé aux sites institutionnels/santé). Le balisage reste utile pour les moteurs de réponse IA — ne pas investir davantage dessus.
3. **`dateModified` absent** sauf sur `/etude-posturale-nantes`. À renseigner page par page lors des prochaines mises à jour de contenu (signal de fraîcheur).
4. **Astro Image non utilisé** : tous les `<img>` sont natifs → pas de srcset, dimensions manquantes → CLS. Migration vers `<Image />` de `astro:assets`.
5. **Compresser** `carte-cadeau` (PNG et PDF, ~1.9 Mo chacun).
6. **Header : HTML invalide** — un `<a>` à l'intérieur d'un `<button>` ([Header.astro](src/components/Header.astro)).
7. **Opportunités long-tail** non exploitées : « bike fitting VTT Rennes », « réglage cales route », « douleur genou vélo »…
8. **Pas de page 404 personnalisée** (`src/pages/404.astro` absent).

### 4.5 Ciblage mots-clés
- **Principaux** : `étude posturale`, `Rennes`, `cycliste`, `vélo`, `réglage cales`, `bike fitting`.
- **Secondaires** : `route`, `VTT`, `gravel`, `triathlon`, `confort`, `performance`, `STT`, `capture de mouvement 3D`, `douleurs vélo`, `position cycliste`.

### 4.6 Checklist rapide avant chaque nouvelle page
- [ ] H1 unique, ciblé mot-clé
- [ ] `title` (<60 car.) + `description` (<160 car.) propres à la page
- [ ] Libellé ajouté dans `LIBELLES_FIL_ARIANE` ([entreprise.ts](src/data/entreprise.ts))
- [ ] `faq={...}` si la page a une FAQ visible, `schema={[noeudService({...})]}` si elle vend une prestation
- [ ] Aucune balise `ld+json` écrite à la main, aucun prix ni contact en dur
- [ ] Hiérarchie H1→H2→H3 cohérente
- [ ] `alt` descriptif sur chaque image
- [ ] Liens internes entrants + sortants
- [ ] Slug FR, avec tirets, mot-clé inclus

---

## 5. Conventions de code

- **Astro** : fichiers `.astro` avec frontmatter `---`, import en haut.
- **Pas de Tailwind config file** : Tailwind 4 utilise CSS-first via `@theme` dans [global.css](src/styles/global.css).
- **Couleurs perso** : utiliser `id-postur` (rouge) et `id-postur-dark`.
- **Pas de React ni de Motion** : le site est 100% statique, 0 JS généré. Animations en CSS natif.
- **Images** : préférer `.webp`, toujours avec `alt` et `loading="lazy"`.
- **CTA Calendly** : lien externe, ajouter `rel="nofollow noopener"` + `target="_blank"`.

---

## 6. Tâches fréquentes — raccourcis

- **Ajouter une page** : créer `src/pages/ma-page.astro`, wrapper avec `<BaseLayout>`, définir H1 unique et meta propres (quand le layout supportera les props).
- **Ajouter / modifier une prestation** : [tarifs.ts](src/data/tarifs.ts) uniquement. Les pages, les FAQ et les `Offer` JSON-LD suivent.
- **Modifier un prix, une durée, un horaire, le téléphone, le nombre d'avis** : [tarifs.ts](src/data/tarifs.ts) ou [entreprise.ts](src/data/entreprise.ts). Jamais dans un `.astro`.
- **Modifier SEO global** : [BaseLayout.astro](src/layouts/BaseLayout.astro).
- **Modifier le JSON-LD** : [entreprise.ts](src/data/entreprise.ts) pour les valeurs, [schema.ts](src/lib/schema.ts) pour la structure des nœuds.
- **Modifier le header/nav** : [Header.astro](src/components/Header.astro).
- **Modifier le footer** (tel, email, horaires) : [Footer.astro](src/components/Footer.astro).
- **Modifier la FAQ d'accueil** : [faq.ts](src/data/faq.ts) — le FAQPage suit automatiquement.
- **Modifier le parcours de réservation** : [src/pages/reserver/](src/pages/reserver/).

---

## 7. Dette technique connue

- Pas de gestion d'erreur 404 personnalisée (`src/pages/404.astro` absent).
- HTML invalide dans [Header.astro](src/components/Header.astro) (`<a>` dans `<button>`).
- Dossier `src/assets/` contient des SVG potentiellement orphelins (`astro.svg`, `background.svg`, `svg-test.svg`) — à vérifier avant suppression.
