---
name: apply-theme
description: |
  Génère, raffine ou applique un thème visuel pour le starter fluch-react-signals-starter
  (Vite + Tailwind v4 + shadcn style new-york-v4). N'édite QUE designs/active.md et
  src/styles/globals.css. Déclenche quand l'user demande : créer/changer/raffiner
  un design system, partir d'un seed (.claude/skills/apply-theme/library/), tweaker un token
  ("primary plus chaud", "radius plus grand", "fond plus sombre"), appliquer un
  brief texte, ou exploiter un screenshot joint. Workflow forcé : designs/active.md
  d'abord, src/styles/globals.css dérivé ensuite. Refuse si la palette dark est
  absente du DESIGN.md.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash(ls:*)
  - Bash(find:*)
  - Bash(cat:*)
  - Bash(node:*)
---

# Skill `apply-theme`

Tu es l'agent qui pilote l'application d'un design system sur le starter. Tu suis ce skill à la lettre.

## Invariants (ne jamais violer)

- Exactement **deux fichiers** peuvent être écrits par ce skill : `designs/active.md` et `src/styles/globals.css`. Rien d'autre.
- `designs/active.md` est la **source of truth**. `src/styles/globals.css` est dérivé.
- **Ordre forcé** : `designs/active.md` doit être écrit (ou confirmé existant) ET relu via `Read` avant toute écriture de `globals.css`.
- La palette dark est obligatoire dans `designs/active.md`. Refus si absente (4 hex sous `Dark:` minimum).
- Ne touche **jamais** : `tailwind.config.*`, fichiers `.tsx`, `package.json`, `components.json`, ou tout autre fichier du projet.

## Décision de mode (au début de chaque invocation)

Vérifier dans cet ordre :

1. **Le fichier `designs/active.md` existe-t-il ?**
   ```
   ls designs/active.md
   ```

   - **Non** → mode `create`. Va à la section "Sous-dispatch create".

   - **Oui** → continuer ci-dessous.

2. **L'user demande-t-il un tweak ciblé ?**
   Signaux : "plus", "moins", "rends X Y", "change le Z", "ajuste", "tweake", "softer", "darker", "warmer".

   - **Oui** → mode `refine`. Charger `workflows/refine.md`.

3. **L'user demande-t-il un redesign complet ?**
   Signaux : "redesign", "from scratch", "throw away", "recommence", "tout refaire".

   - **Oui** → confirmer l'overwrite avec l'user :
     ```
     designs/active.md existe déjà. Tu veux vraiment l'écraser totalement ?
     Si tu veux juste ajuster, dis-le moi (mode refine).
     ```
   - Sur confirmation → mode `create`. Va à la section "Sous-dispatch create".

4. **L'user dit juste "applique" / "apply" / "regenerate css" ?**
   - **Oui** → mode `apply-only`. Charger `workflows/apply-to-css.md`.

5. **Ambigu** → poser **une** question de clarification :
   ```
   Tu veux :
   1. Ajuster le thème actuel (refine) — préserve la plupart du design
   2. Repartir de zéro (create) — efface designs/active.md
   3. Juste régénérer le CSS depuis designs/active.md (apply-only)
   ```

## Sous-dispatch `create`

Détecter le type d'input :

| Signal user | Workflow à charger |
|---|---|
| Image jointe (vision) | `workflows/create-from-screenshot.md` |
| "comme X", "inspired by X", "in the style of X" où X = marque/nom connu | `workflows/create-from-seed.md` |
| Brief texte libre sans marque ni image | `workflows/create-from-brief.md` |

Pour seed match, le workflow `create-from-seed.md` fait `ls .claude/skills/apply-theme/library/ | grep -i <terme>`. S'il n'y a aucun match, il fallback vers `create-from-brief.md`.

## Checklist forced-order (résumé, détails dans chaque workflow)

Tous les workflows respectent cette structure :

```
STEP 1 — Read designs/active.md (ou préparer son contenu)
STEP 2 — Write designs/active.md complet (9 sections)
STEP 3 — Read designs/active.md depuis le disque (AUDIT TRAIL obligatoire)
STEP 4 — Dériver globals.css en lisant le DESIGN.md fraîchement relu
STEP 5 — Write src/styles/globals.css + Read pour vérifier
STEP 6 — Reporter à l'user (4 lignes max)
```

**Le STEP 3 (re-read) est non-négociable** : il force une boucle disque entre les deux Write et empêche l'agent de "deviner" globals.css depuis sa mémoire. Si tu te surprends à éditer `globals.css` avant d'avoir relu `designs/active.md` → abort et restart STEP 1.

Le mode `apply-only` skip les STEP 2/3 puisqu'il ne modifie pas `designs/active.md`.

## Refus dark manquant

Avant le STEP 4 dans tous les workflows :

```
Read designs/active.md
Grep "Dark:" dans la section ## Color
Compter les hex/oklch sous Dark:
```

Si moins de 4 valeurs sous `Dark:` → refus net :

```
❌ Pas de palette dark dans designs/active.md (moins de 4 couleurs sous "Dark:").

shadcn impose un bloc .dark dans globals.css. Tu as 3 options :
1. Fournis les hex dark pour primary, background, foreground, destructive
2. (non disponible v1) Auto-derive depuis le light
3. Abandon
```

Attendre la réponse de l'user. **Ne jamais** dériver le dark silencieusement.

## Références à consulter

- `references/design-md-schema.md` — format des 9 sections du DESIGN.md
- `references/css-mapping.md` — règles d'émission CSS et bloc `@theme inline` complet
- `references/shadcn-tokens.md` — 32 tokens canoniques (18 core + 5 chart + 8 sidebar + 1 radius) + règles de dérivation
- `references/oklch-conversion.md` — conversion hex/rgb → OKLCH

Charger uniquement les références utiles au mode courant.

## Rappel : périmètre OKLCH only (v1)

Toutes les couleurs émises dans `globals.css` doivent être en `oklch(L C H)`. Jamais de `hsl()`, jamais de `#...` direct dans `:root` / `.dark`. La conversion se fait via `references/oklch-conversion.md`.

Les mappings `@theme inline` utilisent `var(--token)` direct (pas de wrapper `hsl(...)` puisqu'on est en OKLCH natif).
