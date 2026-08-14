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
- **Contact** : idpostur@gmail.com / +33 6 58 37 33 03 (JSON-LD) — **⚠ incohérence** : le footer affiche `06 07 16 73 23`, le JSON-LD a `+33658373303`. À vérifier lors d'une prochaine édition.
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

### Pages — [src/pages/](src/pages/) (8 pages)
| URL | Fichier | Rôle | Indexée |
|---|---|---|---|
| `/` | [index.astro](src/pages/index.astro) | Accueil (hero, chiffres, formules, avis, FAQ, bloc SEO) | ✅ |
| `/etudes-posturales` | [etudes-posturales.astro](src/pages/etudes-posturales.astro) | Détail étude posturale | ✅ |
| `/cales` | [cales.astro](src/pages/cales.astro) | Détail réglage des cales | ✅ |
| `/mentions-legales` | [mentions-legales.astro](src/pages/mentions-legales.astro) | Mentions légales / RGPD | ✅ |
| `/etude-posturale-ou-cales` | [etude-posturale-ou-cales.astro](src/pages/etude-posturale-ou-cales.astro) | Choix du service | ❌ noindex |
| `/premiere-ou-nouvelle` | [premiere-ou-nouvelle.astro](src/pages/premiere-ou-nouvelle.astro) | 1re fois vs client existant | ❌ noindex |
| `/etude-posturale` | [etude-posturale.astro](src/pages/etude-posturale.astro) | Flow 1re étude (tarifs) | ❌ noindex |
| `/nouveau-velo-ou-reglage` | [nouveau-velo-ou-reglage.astro](src/pages/nouveau-velo-ou-reglage.astro) | Flow client existant | ❌ noindex |

### Layouts — [src/layouts/](src/layouts/)
- [BaseLayout.astro](src/layouts/BaseLayout.astro) — **Layout unique** (head, SEO, JSON-LD, Header, Footer, Speed Insights).

### Composants — [src/components/](src/components/) (100% `.astro`, aucun JSX)
**Sections de page** : [hero.astro](src/components/hero.astro) (contient le H1 de la home), [chiffres.astro](src/components/chiffres.astro) (reveal via IntersectionObserver), [qui.astro](src/components/qui.astro), [formule.astro](src/components/formule.astro), [faq.astro](src/components/faq.astro) (inclut FAQPage JSON-LD), [confiances.astro](src/components/confiances.astro), [confiance-tabs.astro](src/components/confiance-tabs.astro), [partenaires.astro](src/components/partenaires.astro), [avis.astro](src/components/avis.astro), [seo.astro](src/components/seo.astro).

**UI** : [Header.astro](src/components/Header.astro), [Footer.astro](src/components/Footer.astro), [Button.astro](src/components/Button.astro), [formulecomponent.astro](src/components/formulecomponent.astro), [Textwithimage.astro](src/components/Textwithimage.astro), [Textwithimages.astro](src/components/Textwithimages.astro), [maps.astro](src/components/maps.astro).

### Public — [public/](public/)
- [robots.txt](public/robots.txt)
- Favicon : `id-postur-favicon.png`
- Images dans `public/images/` (majoritairement `.webp`)
- PDF : `id-postur-carte-cadeau.pdf`
- Icônes : `public/icon/` (instagram.svg, facebook.svg)
- **⚠ Manque** : `manifest.json` référencé dans BaseLayout mais fichier absent.

### Config
- [astro.config.mjs](astro.config.mjs) — minimaliste, plugins Tailwind + React.
- [tsconfig.json](tsconfig.json) — strict + JSX React.

---

## 4. SEO — état des lieux & plan d'action ⭐

### 4.1 Ce qui est en place ✅

**Fondations :**
- **BaseLayout paramétrable** ([BaseLayout.astro](src/layouts/BaseLayout.astro)) : props `title`, `description`, `ogImage`, `ogType`, `noindex`. Canonical auto-généré.
- **OG absolue** (URL image complète), Twitter card avec title/desc/image.
- **JSON-LD LocalBusiness complet** : adresse, géo, téléphone (+33607167323), email, priceRange, areaServed (Rennes + Ille-et-Vilaine), openingHoursSpecification (Lun–Ven 9h–19h), sameAs (Instagram + Facebook), @id stable.
- **JSON-LD FAQPage** sur /, /etudes-posturales, /cales (rich snippets Google).
- **Sitemap auto** via `@astrojs/sitemap` → `/sitemap-index.xml`, n'inclut QUE les pages indexables (filter exclut les noindex).
- **robots.txt** corrigé : pointe vers `https://id-postur.fr/sitemap-index.xml`.
- **URLs propres** : slugs français, tirets, minuscules.
- **Vercel Speed Insights** dans BaseLayout (plus de doublon).

**Par page :**
| URL | Indexable | H1 | Title personnalisé |
|---|---|---|---|
| `/` | ✅ | "Étude posturale à Rennes" | ✅ défaut |
| `/prestations` | ✅ | "Nos prestations vélo à Rennes" | ✅ |
| `/etudes-posturales` | ✅ | "Étude posturale vélo à Rennes" | ✅ |
| `/cales` | ✅ | "Réglage des cales vélo à Rennes" | ✅ |
| `/mentions-legales` | ✅ | "Mentions légales – ID Postur" | ✅ |
| `/etude-posturale` | ❌ noindex | H1 ajouté | ✅ |
| `/etude-posturale-ou-cales` | ❌ noindex | H1 ajouté | ✅ |
| `/premiere-ou-nouvelle` | ❌ noindex | H1 ajouté | ✅ |
| `/nouveau-velo-ou-reglage` | ❌ noindex | H1 ajouté | ✅ |
| `/funnel-etude` | ❌ noindex | (React) | ✅ |

**Noindex** : pages de navigation/tunnel et doublons — évite le duplicate content avec `/prestations` et `/etudes-posturales`.

### 4.2 ⚠ Dette SEO restante

1. **Duplicate content** : `/prestations`, `/etudes-posturales` et `/etude-posturale` (noindex) ont beaucoup de contenu identique (mêmes formules). Décider une hiérarchie claire (ex: `/prestations` = hub, `/etudes-posturales` = page longue focus keyword, supprimer `/etude-posturale`).
2. **Incohérences de données** entre pages :
   - Ajustement nouveau vélo : 100€ (prestations) vs 80€ (nouveau-velo-ou-reglage)
   - Deux vélos deux disciplines : 2h (prestations) vs 3h (etude-posturale)
   - Offert pendant "4 mois" (prestations) vs "6 mois" (nouveau-velo-ou-reglage / etudes-posturales)
3. **Astro Image non utilisé** : tous les `<img>` sont natifs → pas de srcset, dimensions manquantes → CLS. Migration vers `<Image />` de `astro:assets`.
4. **Compresser** `carte-cadeau.png` (1.9 Mo) et PDF carte cadeau (1.9 Mo).
5. **Service / Offer JSON-LD** pour chaque prestation (prix, durée) → rich results.
6. **BreadcrumbList JSON-LD** — pas urgent (pas de navigation hiérarchique profonde).
7. **Téléphone JSON-LD** : aligné sur `+33607167323` (numéro du footer) — à vérifier si c'est bien le numéro actuel.
8. **Opportunités long-tail** non exploitées : pages "étude posturale triathlon Rennes", "bike fitting VTT Rennes", "réglage cales route", etc.
9. **Header a du HTML invalide** : un `<a>` à l'intérieur d'un `<button>` ([Header.astro:13-21](src/components/Header.astro#L13-L21)).
10. **Footer.astro:45-46** : attribut `width` dupliqué sur icône Facebook (devrait être `height`).

### 4.4 Ciblage mots-clés (état actuel)
- **Principaux** : `étude posturale`, `Rennes`, `cycliste`, `vélo`, `réglage cales`, `bike fitting`.
- **Secondaires** : `route`, `VTT`, `gravel`, `triathlon`, `confort`, `performance`, `STT`, `capture de mouvement 3D`, `douleurs vélo`, `position cycliste`.

### 4.5 Checklist rapide avant chaque nouvelle page
- [ ] H1 unique, ciblé mot-clé
- [ ] `title` (<60 car.) + `description` (<160 car.) propres à la page
- [ ] Canonical
- [ ] OG image (URL absolue)
- [ ] JSON-LD approprié (Service, FAQPage, etc.)
- [ ] Hiérarchie H1→H2→H3 cohérente
- [ ] `alt` descriptif sur chaque image
- [ ] Liens internes entrants + sortants
- [ ] Slug FR, avec tirets, mot-clé inclus

---

## 5. Conventions de code

- **Astro** : fichiers `.astro` avec frontmatter `---`, import en haut.
- **Pas de Tailwind config file** : Tailwind 4 utilise CSS-first via `@theme` dans [global.css](src/styles/global.css).
- **Couleurs perso** : utiliser `id-postur` (rouge) et `id-postur-dark`.
- **React** : uniquement quand interactivité nécessaire (Funnel), sinon Astro natif.
- **Animations** : `motion` avec `client:visible` pour ne pas hydrater à l'entrée.
- **Images** : préférer `.webp`, toujours avec `alt` et `loading="lazy"`.
- **CTA Calendly** : lien externe, ajouter `rel="nofollow noopener"` + `target="_blank"`.

---

## 6. Tâches fréquentes — raccourcis

- **Ajouter une page** : créer `src/pages/ma-page.astro`, wrapper avec `<BaseLayout>`, définir H1 unique et meta propres (quand le layout supportera les props).
- **Ajouter une prestation** : modifier [formule.astro](src/components/formule.astro) + [prestations.astro](src/pages/prestations.astro) + (idéalement) ajouter un JSON-LD `Service`.
- **Modifier SEO global** : [BaseLayout.astro](src/layouts/BaseLayout.astro).
- **Modifier le JSON-LD LocalBusiness** : [BaseLayout.astro:62-88](src/layouts/BaseLayout.astro#L62-L88).
- **Modifier le header/nav** : [Header.astro](src/components/Header.astro).
- **Modifier le footer** (tel, email, horaires) : [Footer.astro](src/components/Footer.astro).
- **Modifier la FAQ** : [faq.astro](src/components/faq.astro) (⚠ ajouter le JSON-LD FAQPage en même temps).
- **Modifier le funnel** : [Funnel.jsx](src/components/Funnel.jsx).

---

## 7. Dette technique connue

- Pas de gestion d'erreur 404 personnalisée (`src/pages/404.astro` absent).
- Incohérences de prix/durées entre `/etudes-posturales`, `/etude-posturale` et `/nouveau-velo-ou-reglage` (voir section SEO §4.2).
- HTML invalide dans [Header.astro](src/components/Header.astro) (`<a>` dans `<button>`).
- Aucune carte Google Maps intégrée (piste d'amélioration SEO local à étudier).
- Dossier `src/assets/` contient des SVG potentiellement orphelins (`astro.svg`, `background.svg`, `svg-test.svg`) — à vérifier avant suppression.
