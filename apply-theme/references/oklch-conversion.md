# Conversion couleur → OKLCH

**Mode principal : appeler le script utilitaire.** Le LLM ne doit pas calculer OKLCH à la main (gamma sRGB, cubic root, matrices) — la précision dérive et le résultat n'est pas reproductible.

## Usage du script

```sh
node .claude/skills/apply-theme/tools/oklch.mjs "#635bff"
# → oklch(0.578 0.235 278)
```

Batch (recommandé pour convertir une section Color entière en un appel) :

```sh
node .claude/skills/apply-theme/tools/oklch.mjs "#635bff" "#0a2540" "#df1b41" "#ffffff"
# → oklch(0.578 0.235 278)
#   oklch(0.260 0.060 251)
#   oklch(0.580 0.221 19)
#   oklch(1.000 0.000 0)
```

Le script accepte hex (`#RRGGBB`, `#RGB`) et `rgb()` / `rgba()`. Sortie : `oklch(L C H)` avec L (3 décimales), C (3 décimales), H (entier).

## Procédure recommandée pour le workflow

1. Lister TOUS les hex de la section Color du DESIGN.md (light + dark)
2. Un seul appel batch au script avec tous les hex dans l'ordre
3. Mapper la sortie ligne par ligne aux noms de tokens correspondants
4. Émettre les blocs `:root` et `.dark`

## Si l'entrée est déjà en OKLCH

Passthrough : copier la valeur telle quelle. Le script n'est pas nécessaire.

## Si Node est indisponible (fallback uniquement)

Pipeline mathématique en 4 étapes. **À utiliser seulement si `node` est introuvable** — sinon toujours passer par le script.

### 1. hex → sRGB normalisé
```
R = parseInt("RR", 16) / 255
G = parseInt("GG", 16) / 255
B = parseInt("BB", 16) / 255
```

### 2. sRGB → linear (gamma correction)
Pour chaque canal `c` :
```
si c ≤ 0.04045 : c_lin = c / 12.92
sinon            : c_lin = ((c + 0.055) / 1.055) ** 2.4
```

### 3. linear sRGB → OKLab
```
l = 0.4122214708*R + 0.5363325363*G + 0.0514459929*B
m = 0.2119034982*R + 0.6806995451*G + 0.1073969566*B
s = 0.0883024619*R + 0.2817188376*G + 0.6299787005*B

l_ = l^(1/3), m_ = m^(1/3), s_ = s^(1/3)

L =  0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_
a =  1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_
b =  0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_
```

### 4. OKLab → OKLCH
```
C = sqrt(a² + b²)
H = atan2(b, a) × 180 / π   (en degrés, normaliser dans [0, 360])
```

## Exemple worked (référence pour vérifier le script)

`#635bff` (Stripe blue) :
- sRGB : (0.388, 0.357, 1.000)
- linear : (0.124, 0.105, 1.000)
- OKLab : (0.578, 0.035, -0.233)
- OKLCH : (0.578, 0.235, 278°)
- Émission : `oklch(0.578 0.235 278)`

Si le script retourne autre chose, c'est un bug à signaler — pas une approximation à accepter silencieusement.

## Cas particuliers

- **`#000000`** (noir) → `oklch(0.000 0.000 0)`
- **`#ffffff`** (blanc) → `oklch(1.000 0.000 0)`
- **Gris neutres** (R=G=B) → `oklch(L 0.000 0)` (chroma = 0)
- **Couleurs nommées CSS** (ex `red`, `cornflowerblue`) → convertir d'abord en hex via la table CSS standard, puis appeler le script
