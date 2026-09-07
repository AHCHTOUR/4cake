# 4Cake — Sitemap et indexation Google (Option 1)

## Ce que contiennent les deux fichiers

**`sitemap.xml`** — 29 URLs :
- Les 5 pages principales du site (garanti utile)
- 24 fiches individuelles déjà relayées sur Pinterest (bonus expérimental, sans garantie)

**`robots.txt`** — absent du site jusqu'ici. Autorise l'exploration complète et indique à Google
où trouver le sitemap.

## Étape 1 — Déposer les deux fichiers

Les deux vont à la racine du dépôt, au même niveau que `index.html` :
```
/index.html
/robots.txt        (nouveau)
/sitemap.xml       (nouveau)
/conseils.html
/Academie/...
```

## Étape 2 — Google Search Console

Si tu n'as pas encore de compte lié à www.4cake.ma :

1. Va sur search.google.com/search-console
2. Ajoute une propriété -> "Préfixe d'URL" -> https://www.4cake.ma
3. Vérifie la propriété (Google propose plusieurs méthodes ; la plus simple ici est d'ajouter une
   balise meta dans le head de index.html -- dis-le-moi si tu choisis cette méthode, je l'ajoute
   en 2 minutes)

Une fois vérifié :

4. Dans le menu de gauche -> Sitemaps
5. Colle sitemap.xml dans le champ (juste le nom de fichier, pas l'URL complète) -> Envoyer

## Étape 3 — Patience

Google explore généralement le sitemap dans les jours qui suivent, mais l'indexation réelle et
un classement dans les résultats prennent plusieurs semaines à plusieurs mois. Rien à faire de
plus de ton côté une fois soumis -- Search Console te montrera au fil du temps combien de pages
sont indexées.

## Rappel honnête

Les 5 pages principales ont une vraie chance d'être bien indexées. Les 24 fiches individuelles
sont un pari raisonnable (grâce aux liens Pinterest), pas une garantie -- Google traite
généralement les URLs avec # comme la même page que l'URL de base. Si tu veux vraiment que
chaque recette ait sa propre présence dans les résultats de recherche, c'est l'Option 2
(remplacer # par ?) qui répond à ce besoin -- voir plus tôt dans nos échanges.

## Une fois par lot Pinterest terminé

Chaque fois que tu termines un nouveau lot d'épingles, dis-le-moi -- j'ajouterai les nouvelles
fiches concernées au sitemap et je te livrerai une version mise à jour. Plus il y a de fiches
avec un vrai lien externe (Pinterest, ou ailleurs), plus la liste expérimentale a de chances
d'être utile.
