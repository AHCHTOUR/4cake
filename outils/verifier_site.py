#!/usr/bin/env python3
"""Contrôle de cohérence du site 4cake.ma (lancé à chaque push par .github/workflows/verifier-site.yml).

Vérifie, selon la façon dont Cloudflare Pages sert les fichiers
(/page -> page.html, /dossier/ -> dossier/index.html, /page.html -> redirection 308) :
  - liens internes (href/src) qui ne mènent à aucun fichier ;
  - liens internes encore écrits avec .html (une redirection à chaque clic) ;
  - og:image et preload d'image qui pointent vers un fichier absent ;
  - sitemap : chaque URL doit exister et être le canonical de sa page ;
  - canonical et hreflang qui pointent vers une page absente ;
  - syntaxe des fichiers .js (si node est disponible).
Signale aussi (sans échec) les meta descriptions en double.

Usage : python3 outils/verifier_site.py   (depuis la racine du dépôt)
Code de sortie 1 s'il y a au moins une erreur.
"""
import collections
import os
import re
import shutil
import subprocess
import sys
import urllib.parse

DOMAINE = re.compile(r'^https://(www\.)?4cake\.ma/')
IGNORER_DOSSIERS = {'.git', 'node_modules', 'outils', '.github'}

erreurs = collections.defaultdict(list)
avertissements = collections.defaultdict(list)


def fichier_servi(chemin):
    """Fichier que Cloudflare Pages sert pour ce chemin d'URL, ou None."""
    p = urllib.parse.unquote(chemin).lstrip('/')
    if p == '' or p.endswith('/'):
        f = p + 'index.html'
        return f if os.path.isfile(f) else None
    if os.path.isfile(p) and not p.endswith('.html'):
        return p
    if os.path.isfile(p + '.html'):
        return p + '.html'
    return None


def url_servie(fichier):
    base = fichier[:-len('index.html')] if fichier.endswith('index.html') else fichier[:-len('.html')]
    return 'https://www.4cake.ma/' + base


def pages_html():
    for racine, dossiers, fichiers in os.walk('.'):
        dossiers[:] = [d for d in dossiers if d not in IGNORER_DOSSIERS]
        for f in fichiers:
            if f.endswith('.html'):
                yield os.path.join(racine, f)[2:]


def lien_interne(url, page):
    """Chemin absolu d'un lien interne, ou None si externe / non vérifiable."""
    if any(c in url for c in ('${', "'", '+', '`')):
        return None  # URL construite en JavaScript
    if url.startswith(('mailto:', 'tel:', 'data:', 'javascript:', '#', 'whatsapp:', 'sms:')):
        return None
    if url.startswith(('http://', 'https://', '//')):
        if not DOMAINE.match(url):
            return None
        url = '/' + DOMAINE.sub('', url)
    chemin = re.split(r'[?#]', url)[0]
    if chemin == '':
        return None
    if not chemin.startswith('/'):
        base = '/' + page[:-len('index.html')] if page.endswith('index.html') else '/' + page[:-len('.html')]
        chemin = urllib.parse.urljoin(base, chemin)
    return chemin


def verifier_pages():
    descriptions = collections.defaultdict(list)
    for page in pages_html():
        s = open(page, encoding='utf-8').read()
        redirection = 'http-equiv="refresh"' in s

        for url in re.findall(r'(?:href|src)="([^"]+)"', s) + re.findall(r'content="(https://[^"]+)"', s):
            chemin = lien_interne(url, page)
            if chemin is None:
                continue
            if chemin.endswith('.html'):
                erreurs['Lien interne en .html (redirection à chaque clic)'].append(f'{page} → {url}')
            elif fichier_servi(chemin) is None:
                erreurs['Lien interne cassé'].append(f'{page} → {url}')

        for url in re.findall(r'<meta property="og:image" content="([^"]+)"', s):
            chemin = lien_interne(url, page)
            if chemin and fichier_servi(chemin) is None:
                erreurs['og:image absente'].append(f'{page} → {url}')
        for url in re.findall(r'<link rel="preload" as="image" href="([^"]+)"', s):
            chemin = lien_interne(url, page)
            if chemin and fichier_servi(chemin) is None:
                erreurs['Preload d\'image absente'].append(f'{page} → {url}')

        canon = re.search(r'<link[^>]*rel="canonical"[^>]*href="([^"]+)"', s) or re.search(r'<link[^>]*href="([^"]+)"[^>]*rel="canonical"', s)
        page_de_reference = not canon or canon.group(1) == url_servie(page)
        if not redirection and 'noindex' not in s and page_de_reference:
            m = re.search(r'<meta name="description" content="([^"]*)"', s)
            if m:
                descriptions[m.group(1)].append(page)

    for texte, pages in descriptions.items():
        if len(pages) > 1:
            avertissements['Meta description en double'].append(' | '.join(pages))


def verifier_sitemap():
    sm = open('sitemap.xml', encoding='utf-8').read()
    urls = re.findall(r'<loc>([^<]+)</loc>', sm)
    if len(urls) != len(set(urls)):
        erreurs['URL en double dans le sitemap'].extend(u for u, n in collections.Counter(urls).items() if n > 1)
    for u in urls:
        if not DOMAINE.match(u):
            erreurs['URL de sitemap hors domaine'].append(u)
            continue
        f = fichier_servi('/' + DOMAINE.sub('', u))
        if f is None:
            erreurs['URL du sitemap sans page'].append(u)
            continue
        s = open(f, encoding='utf-8').read()
        c = re.search(r'<link[^>]*rel="canonical"[^>]*>', s)
        href = re.search(r'href="([^"]+)"', c.group(0)).group(1) if c else None
        if href != u:
            erreurs['URL du sitemap ≠ canonical de la page'].append(f'{u} (canonical : {href})')


def verifier_js():
    if not shutil.which('node'):
        avertissements['node absent : syntaxe JS non vérifiée'].append('-')
        return
    for racine, dossiers, fichiers in os.walk('.'):
        dossiers[:] = [d for d in dossiers if d not in IGNORER_DOSSIERS]
        for f in fichiers:
            if f.endswith('.js'):
                p = os.path.join(racine, f)
                r = subprocess.run(['node', '--check', p], capture_output=True, text=True)
                if r.returncode:
                    lignes = r.stderr.strip().splitlines()
                    detail = next((l for l in lignes if 'Error' in l), lignes[0] if lignes else '')
                    position = next((l for l in lignes if l.startswith(p) or l.startswith(p[2:])), '')
                    erreurs['Erreur de syntaxe JavaScript'].append(f'{position or p} : {detail}')


def rapport(titre, groupes, limite=15):
    for k, v in groupes.items():
        print(f'\n{titre} — {k} ({len(v)})')
        for x in v[:limite]:
            print('   ', x)
        if len(v) > limite:
            print(f'    … et {len(v) - limite} autre(s)')


if __name__ == '__main__':
    verifier_pages()
    verifier_sitemap()
    verifier_js()
    rapport('⚠️  Avertissement', avertissements)
    rapport('❌ Erreur', erreurs)
    total = sum(len(v) for v in erreurs.values())
    print(f'\n{"❌ " + str(total) + " erreur(s)" if total else "✅ Aucune erreur"}')
    sys.exit(1 if total else 0)
