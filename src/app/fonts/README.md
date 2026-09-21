# Police de marque

`SchibstedGrotesk-latin-var.woff2` — Schibsted Grotesk (SIL OFL 1.1, voir `OFL.txt`), dérivée de la
version Google Fonts (variable, axe `wght`) :

- sous-ensemble latin français (Latin de base, Latin-1, œ/Œ, ponctuation typographique, €, ×, −) ;
- axe de graisse limité à 400-800 ;
- fonctionnalité `tnum` restreinte aux chiffres (la police d'origine élargit aussi la virgule et le
  point, ce qui donnait « 52 , 0 » dans les grands chiffres).

Régénération : `pyftsubset` puis `fonttools varLib.instancer wght=400:800`, puis retrait de
`period/comma/colon/semicolon` de la table GSUB `tnum` (fontTools).
