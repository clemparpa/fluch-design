# Spec — Prochaines étapes pour finaliser le skill `apply-theme`

## Contexte

Le skill est implémenté dans sa version v1 à `/Users/clement/flush/flush-design/.claude/skills/apply-theme/`. Il sera extrait dans un repo Git dédié pour itération et distribution. Avant que ce skill soit fiable en production, plusieurs vérifications de précision restent à faire — c'est l'objet de cette spec.

L'enjeu transverse : **le skill prétend décrire shadcn et le format DESIGN.md d'open-design, mais ces deux conventions ont été reconstituées de mémoire / via deepwiki**. Il faut les aligner sur la source canonique avant de s'y fier.

## Séparation des responsabilités

**Le skill ne touche QUE `src/styles/globals.css`.** Aucun `.tsx`, aucun `tailwind.config`, aucun fichier composant. La page `/showcase` du template (visualisation de la palette + composants) est entièrement gérée côté template `fluch-react-signals-starter` et n'apparaît PAS dans les tâches du skill — c'est juste le miroir visuel que l'user regarde pour valider.

Donc :
- **Tâches du skill (ce doc)** : précision de `globals.css`, format DESIGN.md, conversion couleur, catalogue de seeds
- **Tâches du template (ailleurs)** : showcase, install shadcn, structure Vite/React Router/Signals, etc.

## Tâche 1 — Valider la config shadcn générée

**Objectif.** Vérifier que `references/shadcn-tokens.md` et `references/css-mapping.md` décrivent EXACTEMENT la sortie d'un `shadcn init --base base` sur un projet Tailwind v4.

**Pourquoi c'est critique.** Le skill émet du CSS qui doit s'imbriquer dans la convention shadcn. Si on a un mauvais nom de var (`--popover-bg` au lieu de `--popover`), un radius par défaut différent (0.625rem vs 0.5rem), ou un mapping `@theme inline` syntaxiquement faux, tous les composants shadcn cassent visuellement.

**Méthode.**
1. Utiliser le MCP shadcn officiel si disponible (vérifier ce qu'il expose côté theming).
2. À défaut, lancer un `shadcn init --base base` dans un dossier temp avec Tailwind v4, et comparer le `globals.css` produit aux deux fichiers de référence.
3. Lire aussi le code source de shadcn-ui/ui via deepwiki pour comprendre comment les vars sont consommées dans les composants Base UI (révèle les noms attendus).

**Points spécifiques à vérifier.**
- Liste exacte des 22 vars (pas 21, pas 23 — vérifier la présence ou absence de `--chart-1` à `--chart-5`, `--sidebar-*`, etc.)
- Noms exacts (`--card-foreground` vs `--card-fg` etc.)
- Valeurs OKLCH par défaut pour `baseColor: neutral`
- Radius par défaut (j'ai mis `0.625rem` — à confirmer)
- Format du bloc `@theme inline` : présence du mot-clé `inline`, ordre des entrées, mappings exacts (`var(--primary)` direct ou wrapper ?)
- Différences entre variant `base` (Base UI) et variant `radix` au niveau des vars CSS, s'il y en a

**Sortie attendue.** Modifs ciblées dans `references/shadcn-tokens.md` et `references/css-mapping.md` pour refléter exactement la sortie canonique. Si écart non-trivial, mettre à jour aussi le worked example dans `css-mapping.md`.

## Tâche 2 — Aligner le format DESIGN.md sur nexu-io/open-design

**Objectif.** Le `references/design-md-schema.md` actuel a été reconstitué à partir d'extraits deepwiki. Vérifier qu'il colle au format exact d'open-design pour pouvoir importer leurs 72 seeds sans transformation.

**Pourquoi.** Les seeds qu'on va importer dans `library/` sont au format open-design original. Toute divergence (ordre des sections, casse des H2, format des listes, blockquote category) va casser soit l'import soit le parsing du skill. Mieux : on calque pour rester compatible avec leur écosystème (si demain ils ajoutent 50 seeds, on peut les ingérer).

**Méthode.**
1. Récupérer via deepwiki sur `nexu-io/open-design` un DESIGN.md complet réel (pas un extrait paraphrasé). Stripe, Linear, Vercel par exemple.
2. Récupérer leur fichier de spec/schéma s'il est public (`docs/design-md-schema.md`, `skills/design-system-from-brief/SKILL.md`, ou similaire).
3. Comparer ligne à ligne avec `references/design-md-schema.md`.

**Points spécifiques à vérifier.**
- Ordre exact des 9 sections (mon ordre : Visual Theme → Color → Typography → Spacing → Layout → Components → Motion → Voice → Anti-patterns ; le leur ?)
- Noms exacts des H2 (j'ai écrit `## Color` mais leur convention pourrait être `## Color Palette & Roles`, ou `## Colors`)
- Convention `> Category:` après H1 — réelle ou inventée ?
- Sous-structure de la section Color : leur format est-il `Light: ... Dark: ...` en listes, ou autre ?
- Présence/absence des sous-sections "Agent Prompt Guide" que j'avais croisée dans le Xiaohongshu example
- Formats acceptés pour les couleurs (hex obligatoire ? OKLCH autorisé ? rgba pour les overlays ?)

**Sortie attendue.** `references/design-md-schema.md` mis à jour pour matcher le format canonique. Si l'écart est large, regénérer aussi l'exemple à la fin du fichier à partir d'un vrai DESIGN.md open-design.

## Tâche 3 — Importer les 72 seeds dans `library/`

**Dépend de Tâche 2.**

**Objectif.** Peupler `.claude/skills/apply-theme/library/` avec les 72 DESIGN.md de la collection open-design.

**Méthode.**
1. Source primaire : `VoltAgent/awesome-design-md` (origine documentée par open-design via `scripts/sync-design-systems.ts`).
2. Source secondaire : `nexu-io/open-design` directement, dans leur dossier `design-systems/`.
3. Script de copie : un petit `node scripts/fetch-seeds.mjs` qui clone le repo source, copie les `.md` dans `library/`, normalise les noms de fichier en slugs lowercase-dash.
4. Vérifier que chaque seed importé passe le sanity check de `workflows/apply-to-css.md` (9 sections présentes, Color avec light + dark). Lister les seeds qui échouent → soit les patcher, soit les exclure.

**Sortie attendue.** `library/<slug>.md` × 72 (ou moins si certains seeds sont éliminés faute de dark mode). Une liste des seeds disponibles, peut-être maintenue dans `library/INDEX.md`.

## Tâche 4 — Bootstrap du template `fluch-react-signals-starter`

**Côté template, mais utile au skill comme environnement de test.** Indépendant des tâches 1-3 (peut démarrer en parallèle). Détaillé dans `SPEC.md` §8 — la showcase, l'installation shadcn et la stack Vite/Signals sont gérées intégralement par le template, hors scope du skill.

**Bonus pour le skill** : capturer la sortie réelle de `shadcn init --base base` pendant ce bootstrap permet de valider la Tâche 1 sans setup séparé.

**Sortie attendue.** Repo `fluch-react-signals-starter` clonable, `pnpm dev` ouvre `/showcase` avec toute la palette visible. Le skill peut ensuite y être déposé pour tests.

## Tâche 5 — Tests end-to-end du skill

**Dépend de Tâches 1, 2, 4 minimum.**

**Objectif.** Valider que les 6 scénarios documentés dans le plan tournent correctement.

**Scénarios à exécuter** (en clonant le template + skill installé) :
1. **Create from brief** : "fais-moi un thème éditorial chaud avec accent terracotta" → DESIGN.md + globals.css produits, showcase rend correctement en light et dark
2. **Create from seed** : "applique le style stripe" → `library/stripe.md` lu, copié dans `active.md`, globals.css régénéré
3. **Create from screenshot** : screenshot d'app collé → analyse vision + DESIGN.md cohérent
4. **Refine** : `active.md` existant, "rends le primary plus chaud" → seule la section Color est modifiée
5. **Apply-only** : user édite `active.md` à la main, dit "applique" → pas de réécriture DESIGN.md
6. **Dark missing** : DESIGN.md créé sans dark → refus net avec message

**Bonus** : audit de l'ordre des tool calls (DESIGN.md écrit AVANT globals.css ; re-Read entre les deux) sur le scénario refine. Si l'agent shortcut, renforcer la checklist forced-order.

**Sortie attendue.** Un rapport `tests-e2e.md` qui liste pour chaque scénario : ce qui a marché, ce qui a foiré, et les correctifs apportés au skill.

## Décisions de design encore ouvertes

À trancher quand la base sera validée :

1. **Distribution du skill** : git submodule, copie manuelle, package npm, ou autre ? Lié à la création du repo dédié.
2. **`library/` voyage avec le skill, ou fetch on-demand ?** Actuellement on l'embarque (committed). Si la collection grossit beaucoup (200+ seeds), peut-être fetch-on-demand.
3. **Versioning du skill vs versioning du template** : le template peut épingler une version du skill ? Comment gérer un breaking change dans le format DESIGN.md ?
4. **Mode "auto-derive dark"** (v2) : option pour générer le dark mode automatiquement quand le DESIGN.md est light-only. Aujourd'hui refus net, voir si l'UX appelle ce raccourci.
5. **Mode "brand from URL"** (v2) : WebFetch pour `comme stripe.com` → fetch + sampler. Aujourd'hui supprimé, à reconsidérer quand le pipeline de base sera robuste.

## Risques connus du skill v1

À considérer comme dette technique connue, pas comme bugs à fixer :

1. **Foreground rule heuristique** (seuil L > 0.65) : pas un vrai calcul de contraste WCAG. Va se planter sur des couleurs hautement saturées à mid-L où la perception réelle diverge de la luminance OKLCH. Solution propre v2 : intégrer un calcul APCA ou WCAG via un script utilitaire.
2. **Dérivations muted/accent depuis les défauts shadcn** : ne s'adapte pas si le primary est très saturé ou si le DS demande un accent custom. Aujourd'hui on prend les défauts neutres, ce qui peut faire incohérent visuel.
3. **Pas de validation des anti-patterns** lors de l'apply : la section Anti-patterns du DESIGN.md n'est exploitée qu'au moment du refine. Si l'user crée un DESIGN.md qui se contredit lui-même (anti-pattern "pas de gradient" + section Components qui dit "boutons en gradient"), le skill ne le détecte pas.
4. **Pas de support multi-thèmes simultanés** : un seul `designs/active.md` à la fois. Si l'user veut tester 3 thèmes en parallèle, il doit gérer ça hors-skill (branches Git, sub-dossiers manuels).
5. **Le script `oklch.mjs` n'a pas de tests** : un changement maladroit dans les matrices peut introduire un biais silencieux. À couvrir avec un mini test snapshot (10 hex de référence + valeurs attendues).

## Ordre recommandé

Priorité de validation :

1. **Tâche 1** (mapping shadcn) — bloque tout le reste, il faut savoir si le squelette CSS qu'on émet est correct
2. **Tâche 2** (format DESIGN.md) — bloque la Tâche 3 ; à faire en parallèle de la 1
3. **Tâche 4** (bootstrap template) — peut démarrer en parallèle des 1 et 2, capture la sortie réelle de shadcn init en bonus pour la Tâche 1
4. **Tâche 3** (import seeds) — après la 2
5. **Tâche 5** (tests e2e) — en dernier, valide l'ensemble

Une fois cette boucle terminée, le skill est prêt pour itération sur les features v2 (auto-derive, brand-from-URL, multi-thèmes, etc.).
