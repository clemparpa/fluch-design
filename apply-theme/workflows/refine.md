# Workflow `refine`

Modifier `designs/active.md` existant suite à une demande de tweak ciblé de l'user, puis régénérer `src/styles/globals.css`.

## Pré-requis

`designs/active.md` existe (mode déjà déterminé par SKILL.md).

## Checklist forced-order

```
STEP 1 — Read designs/active.md
STEP 2 — Identifier la modif demandée et écrire le nouveau designs/active.md complet
STEP 3 — Re-Read designs/active.md (audit trail)
STEP 4-6 — Charger workflows/apply-to-css.md à partir de STEP 4
```

**Le STEP 3 (re-read) est obligatoire** : c'est lui qui empêche l'agent d'aller écrire globals.css depuis sa mémoire au lieu du DESIGN.md fraîchement écrit.

## STEP 1 — Read DESIGN.md actuel

```
Read designs/active.md
```

## STEP 2 — Traduire la demande user en modif ciblée

L'agent identifie quelle(s) section(s) du DESIGN.md doi(ven)t changer. Table de référence (non exhaustive) :

| Demande user | Section cible | Action |
|---|---|---|
| « primary plus chaud » | Color → primary (Light + Dark) | Décaler H vers 30–60° en conservant L/C |
| « primary plus saturé » | Color → primary (Light + Dark) | Augmenter C de 0.05–0.10 |
| « primary plus pâle » | Color → primary (Light + Dark) | Augmenter L de 0.05 (light) / réduire C |
| « fond plus sombre » (light) | Color → background (Light) | Baisser L de 0.03–0.05 |
| « fond plus sombre » (dark) | Color → background (Dark) | Baisser L de 0.02–0.03 |
| « plus de contraste » | Color → foreground vs background | Écarter les L des deux |
| « radius plus grand » | Components → Radius | Augmenter d'un cran (+0.125rem ou +0.25rem) |
| « pas de radius » / « carré » | Components → Radius | Mettre à 0 |
| « typographie serif » | Typography → sans | Remplacer stack par serif (Playfair, Lora, etc.) |
| « font plus moderne » | Typography → sans | Stack moderne (Inter, Geist, Söhne...) |
| « anim plus rapide » | Motion → Durations | Réduire base de 50–100ms |
| « pas d'anim » | Motion | Mettre toutes durations à 0ms |

Pour des demandes plus floues (« ça fait pas pro », « ça manque de chaleur »), poser **une** question de clarification : "Tu veux ajuster la palette, la typo ou les radius en priorité ?"

## STEP 2 bis — Anti-pattern check

Avant d'écrire, lire la section 9 (Anti-patterns) du DESIGN.md. Si la modif demandée par l'user contredit un anti-pattern explicite :

```
⚠️ Ta demande contredit un anti-pattern noté dans le design system :
  "<anti-pattern verbatim>"

Confirme que tu veux quand même l'appliquer (ça assouplira le système) ?
```

Attendre la réponse user avant de continuer.

## STEP 2 ter — Écriture du DESIGN.md complet

Écrire le **DESIGN.md complet**, pas juste la section modifiée. Les 8 autres sections sont préservées à l'identique (copie exacte).

```
Write designs/active.md <contenu complet avec modif>
```

Vérifier mentalement les 9 H2 avant d'écrire.

## STEP 3 — Re-read (audit trail)

```
Read designs/active.md
```

**Cette lecture est obligatoire** même si tu "sais" ce que tu viens d'écrire. C'est elle qui force l'ordre DESIGN.md d'abord, globals.css ensuite.

## STEP 4-6 — Apply to CSS

Charger `workflows/apply-to-css.md` et exécuter à partir de son STEP 4 (la lecture STEP 1 a déjà été faite ici en STEP 3). Le report STEP 6 doit mentionner la modif :

```
✓ designs/active.md mis à jour (section <X> modifiée)
✓ src/styles/globals.css régénéré
→ Recharge /showcase pour voir la modif
→ Continue à itérer si nécessaire
```

## Interdits

- Modifier `src/styles/globals.css` avant que `designs/active.md` ait été écrit ET relu
- Modifier des sections du DESIGN.md non concernées par la demande user
- Skip le re-read STEP 3
