









const MATERIEL = {
  fr:{
    title:'Le matériel du débutant',
    intro:'Pas besoin d\'équiper une cuisine professionnelle pour bien commencer. Voici ce qui compte vraiment.',
    essentiel_label:'L\'essentiel pour commencer',
    essentiel:[['Un fouet et une spatule','Pour mélanger, fouetter, racler — la base de tout.'],['Un ou deux saladiers','Un grand, un moyen : ça suffit pour commencer.'],['Une balance de cuisine','Bien plus précis qu\'un verre doseur pour la pâtisserie — investissement n°1.'],['Un batteur électrique simple','Pour monter blancs et crèmes sans y passer 20 minutes à la main.'],['Un moule à tarte et un moule à cake','Les deux formes qui reviennent dans la majorité des recettes.'],['Une plaque à pâtisserie','Pour les cookies, financiers, et tout ce qui se pose à plat.'],['Un tamis ou une passoire fine','Pour éviter les grumeaux dans la farine ou le sucre glace.']],
    optionnel_label:'Pour plus tard, quand l\'envie de progresser arrive',
    optionnel:[['Une poche à douille','Utile mais pas indispensable au début — une cuillère ou un sac congélation percé dépannent bien.'],['Un thermomètre de cuisson','Pour les caramels et sucres cuits — à ajouter quand vous progressez.'],['Des cercles à pâtisserie','Pour des présentations plus nettes — pas nécessaire pour débuter.'],['Un robot pâtissier','Confortable, mais un batteur électrique simple fait très bien le travail au départ.']],
    outro:'Envie d\'aller plus loin dans la technique et le vocabulaire du métier ? L\'Académie Pro vous attend.'
  },
  ar:{
    title:'عتاد المبتدئ',
    intro:'لست بحاجة لتجهيز مطبخ احترافي للبدء بشكل جيد. إليكم ما يهم فعلًا.',
    essentiel_label:'الأساسي للبدء',
    essentiel:[['مضرب وسباتولا','للخلط والخفق والكشط — أساس كل شيء.'],['وعاء أو وعاءان','واحد كبير وآخر متوسط: يكفيان للبداية.'],['ميزان مطبخ','أدق بكثير من كوب القياس في الحلويات — أول استثمار.'],['خفاقة كهربائية بسيطة','لخفق البياض والكريمات دون قضاء 20 دقيقة باليد.'],['قالب تارت وقالب كيك','الشكلان الأكثر تكرارًا في معظم الوصفات.'],['صينية حلويات','للكوكيز والفينونسييه وكل ما يوضع بشكل مسطح.'],['منخل أو مصفاة رقيقة','لتجنب التكتلات في الدقيق أو السكر الناعم.']],
    optionnel_label:'لوقت لاحق، عندما تأتي الرغبة في التقدم',
    optionnel:[['كيس تزيين','مفيد لكن غير ضروري في البداية — ملعقة أو كيس تجميد مثقوب يفي بالغرض.'],['ميزان حرارة للطهي','للكراميل والسكر المطهو — يُضاف مع التقدم.'],['حلقات حلويات','لتقديم أكثر أناقة — غير ضروري للبدء.'],['عجّانة كهربائية','مريحة، لكن خفاقة كهربائية بسيطة تؤدي المهمة جيدًا في البداية.']],
    outro:'ترغبون بالتعمق أكثر في التقنية ومصطلحات المهنة؟ الأكاديمية الاحترافية بانتظاركم.'
  }
};

// Photos : pointent vers l'Espace Pro, aucune duplication de fichier
const IMG_BASE = '/Academie/public/thumbs/';


// Vitrine Espace Pro (Niveau 3) — aucun contenu dupliqué, uniquement des liens
const PRO_URL = '/ar/academie/pro/index.html';
const PRO_TEASER = [
  {icon:'layer',       fr:'Opéra',                    ar:'أوبيرا'},
  {icon:'parisbrest',  fr:'Saint-Honoré à la chantilly', ar:'سان أونوريه بالشانتيي'},
  {icon:'parisbrest',  fr:'Paris-Brest',              ar:'باري-بريست'},
  {icon:'tartefine',   fr:'Fraisier',                 ar:'فريزيه'},
  {icon:'chocolat',    fr:'Tempérage du chocolat',    ar:'تبلور الشوكولاتة'},
  {icon:'crumble',     fr:'Croissant',                ar:'كرواسان'},
  {icon:'mousse',      fr:'Bonbons de chocolat moulés',ar:'بونبون الشوكولاتة المقولب'},
  {icon:'parisbrest',  fr:'Religieuses café-chocolat',ar:'روليجيوز بالقهوة والشوكولاتة'},
  {icon:'layer',       fr:'Wedding cake à étages',    ar:'كعكة زفاف بطوابق'},
  {icon:'ghriba',      fr:'Kaab El Ghzal',            ar:'كعب الغزال'},
  {icon:'crumble',     fr:'Chebakia',                 ar:'الشباكية'},
  {icon:'parisbrest',  fr:"M'hancha",                 ar:'المحنشة'}
];

/* ============ Suivi GTM / GA4 (dataLayer) ============ */
window.dataLayer = window.dataLayer || [];
function dlPush(event, params){
  try{ window.dataLayer.push(Object.assign({event: event, espace: 'public'}, params || {})); }
  catch(e){ /* le suivi ne doit jamais casser le site */ }
}

let currentLang = 'ar'; // forcé selon la page réelle, indépendant du localStorage
let activeSection = 'recettes';
let activeNiveau = 1;

function r(recipe){ return recipe[currentLang]; }

function cardHTML(rec, idx){
  const d = r(rec);
  const img = RECIPE_IMG[rec.id];
  // Les 4 premières cartes sont visibles dès le chargement initial (au-dessus de la ligne
  // de flottaison, mobile et desktop confondus) : pas de loading="lazy" pour elles, sinon
  // le LCP (souvent la toute première image) est retardé inutilement. La toute première
  // reçoit en plus fetchpriority="high" pour être vraiment priorisée par le navigateur.
  const estAuDessusDeLaLigne = typeof idx === 'number' && idx < 4;
  const attrsChargement = estAuDessusDeLaLigne
    ? (idx === 0 ? 'fetchpriority="high" decoding="async"' : 'decoding="async"')
    : 'loading="lazy" decoding="async"';
  const visual = img
    ? `<img src="${IMG_BASE}${img}" alt="${d.title}" ${attrsChargement}
         onerror="this.parentNode.classList.add('no-img');this.remove();">
       <span class="rcard-fallback">${ICONS[rec.icon]}</span>`
    : ICONS[rec.icon];
  // Une vraie page statique existe uniquement pour les recettes (RECIPES), pas les bases —
  // on ne pose un href crawlable que quand la cible existe réellement, pour ne jamais créer
  // de lien interne cassé.
  const hasStaticPage = RECIPES.some(x => x.id === rec.id);
  const tag = hasStaticPage ? 'a' : 'div';
  const hrefAttr = hasStaticPage ? `href="/fr/academie/public/recette/${rec.id}.html"` : '';
  const clickAttr = `onclick="openRecipe('${rec.id}');return false;"`;
  return `
    <${tag} class="rcard reveal" ${hrefAttr} ${clickAttr}>
      <div class="rcard-visual${img ? ' has-img' : ''}">${visual}</div>
      <div class="rcard-body">
        <div class="rcard-title">${d.title}</div>
        <div class="rcard-meta"><span>⏱ ${d.time}</span><span>${d.level}</span></div>
        <div class="rcard-play">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
          ${UI[currentLang].voir_recette}
        </div>
      </div>
    </${tag}>
  `;
}

/* ============ Recherche ============ */
let searchQuery = '';

// insensible à la casse, aux accents et aux tirets — fonctionne aussi en arabe
function normalize(s){
  return (s || '').toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u0640]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, ' ')
    .trim();
}

let searchTimer = null;
function onSearch(v){
  searchQuery = v;
  clearTimeout(searchTimer);
  if(v.trim().length >= 3){
    searchTimer = setTimeout(() => {
      const q = normalize(v);
      const n = RECIPES.filter(x => matchesSearch(x, q)).length + BASICS.filter(x => matchesSearch(x, q)).length;
      dlPush('recherche', { terme: v.trim().toLowerCase(), resultats: n, langue: currentLang });
    }, 1200); // on attend la fin de la frappe
  }
  document.querySelector('.searchbar').classList.toggle('filled', v.trim().length > 0);
  renderGrid();
}
function clearSearch(){
  searchQuery = '';
  const input = document.getElementById('searchInput');
  if(input) input.value = '';
  document.querySelector('.searchbar').classList.remove('filled');
  renderGrid();
  if(input) input.focus();
}

// Cherche dans le titre et les ingrédients, dans les DEUX langues :
// un utilisateur en mode arabe peut ainsi retrouver une recette dont il connaît le nom français, et inversement.
function matchesSearch(item, q){
  for(const lang of ['fr','ar']){
    const d = item[lang];
    if(!d) continue;
    if(normalize(d.title).indexOf(q) > -1) return true;
    if(d.ingredients && d.ingredients.some(([nom]) => normalize(nom).indexOf(q) > -1)) return true;
  }
  return false;
}

function renderSearchResults(){
  const grid = document.getElementById('grid');
  const t = UI[currentLang];
  const q = normalize(searchQuery);

  const recettes = RECIPES.filter(x => matchesSearch(x, q));
  const bases    = BASICS.filter(x => matchesSearch(x, q));
  const total    = recettes.length + bases.length;

  if(total === 0){
    grid.innerHTML = `<div class="search-empty"><strong>${t.search_vide}</strong>${t.search_vide_aide}</div>`;
    return;
  }

  let html = `<div class="search-count">${total} ${total > 1 ? t.search_resultats : t.search_resultat}</div>`;
  const clas = recettes.filter(x => x.cat === 'classique');
  const maro = recettes.filter(x => x.cat === 'marocain');
  if(clas.length) html += `<div class="search-cat">${t.tab_recettes}</div>` + clas.map(cardHTML).join('');
  if(maro.length) html += `<div class="search-cat">${t.tab_marocain}</div>` + maro.map(cardHTML).join('');
  if(bases.length) html += `<div class="search-cat">${t.tab_bases}</div>` + bases.map(cardHTML).join('');
  grid.innerHTML = html;
}

function renderGrid(){
  const grid = document.getElementById('grid');
  const materielBlock = document.getElementById('materielBlock');
  const niveauTabs = document.getElementById('niveauTabs');

  document.querySelectorAll('.section-tab').forEach(b => b.classList.toggle('active', b.dataset.section === activeSection));
  // le libellé étant injecté ici, on renseigne aussi l'étiquette d'accessibilité
  const majTab = (sel, txt) => {
    const el = document.getElementById('sectionTabs').querySelector(sel);
    if(el){ el.textContent = txt; el.setAttribute('aria-label', txt); }
  };
  majTab('[data-section="recettes"]', UI[currentLang].tab_recettes);
  majTab('[data-section="marocain"]', UI[currentLang].tab_marocain);
  majTab('[data-section="bases"]', UI[currentLang].tab_bases);
  majTab('[data-section="materiel"]', UI[currentLang].tab_materiel);
  [1,2,3].forEach(n => {
    const el = niveauTabs.querySelector('[data-niveau="' + n + '"]');
    const txt = UI[currentLang]['niveau' + n];
    if(el){ el.textContent = txt; el.setAttribute('aria-label', txt); }
  });
  document.querySelectorAll('.niveau-tab').forEach(b => b.classList.toggle('active', Number(b.dataset.niveau) === activeNiveau));

  // Une recherche active masque les onglets et affiche les résultats transversaux
  if(searchQuery.trim().length > 0){
    materielBlock.style.display = 'none';
    niveauTabs.style.display = 'none';
    grid.style.display = 'grid';
    renderSearchResults();
    return;
  }

  if(activeSection === 'materiel'){
    grid.style.display = 'none';
    niveauTabs.style.display = 'none';
    materielBlock.style.display = 'block';
    renderMateriel();
    return;
  }
  materielBlock.style.display = 'none';
  grid.style.display = 'grid';

  if(activeSection === 'bases'){
    niveauTabs.style.display = 'none';
    const general = BASICS.filter(b => b.groupe === 'general');
    const marocain = BASICS.filter(b => b.groupe === 'marocain');
    grid.innerHTML = `
      <div class="bases-group-label">${UI[currentLang].bases_general}</div>
      ${general.map(cardHTML).join('')}
      <div class="bases-group-label bases-group-maroc">${UI[currentLang].bases_marocain}</div>
      ${marocain.map(cardHTML).join('')}
    `;
    return;
  }

  niveauTabs.style.display = 'flex';
  const cat = activeSection === 'marocain' ? 'marocain' : 'classique';

  if(activeNiveau === 3){
    const t = UI[currentLang];
    grid.innerHTML = `
      <div class="pro-intro">
        <h3>${t.pro_titre}</h3>
        <p>${t.pro_texte}</p>
        <a class="pro-cta" href="${PRO_URL}">
          ${t.pro_cta}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>
      ${PRO_TEASER.map(p => `
        <a class="rcard rcard-pro" href="${PRO_URL}">
          <span class="pro-badge">${t.pro_badge}</span>
          <div class="rcard-visual">${ICONS[p.icon]}</div>
          <div class="rcard-body">
            <div class="rcard-title">${p[currentLang]}</div>
          </div>
        </a>`).join('')}
      <div class="pro-note">${t.pro_note}</div>
    `;
    return;
  }

  grid.innerHTML = RECIPES.filter(rec => rec.cat === cat && rec.niveau === activeNiveau).map(cardHTML).join('');
}

function renderMateriel(){
  const m = MATERIEL[currentLang];
  const rowsHTML = rows => rows.map(([a,b]) => `<li><b>${a}</b><span>${b}</span></li>`).join('');
  document.getElementById('materielBlock').innerHTML = `
    <div class="materiel-title">${m.title}</div>
    <div class="materiel-intro">${m.intro}</div>
    <div class="materiel-label">${m.essentiel_label}</div>
    <ul class="materiel-list">${rowsHTML(m.essentiel)}</ul>
    <div class="materiel-label">${m.optionnel_label}</div>
    <ul class="materiel-list">${rowsHTML(m.optionnel)}</ul>
    <div class="materiel-outro">${m.outro}</div>
  `;
}

function switchSection(section){
  if(section !== activeSection) dlPush('section_vue', { section: section });
  activeSection = section;
  renderGrid();
}
function switchNiveau(n){
  if(n !== activeNiveau){
    dlPush('niveau_change', { niveau: n, section: activeSection });
    if(n === 3) dlPush('vitrine_pro_vue', { section: activeSection });
  }
  activeNiveau = n;
  renderGrid();
}

let curRecipe = null;
const CAP_DURATION = 4500;



/* ============ Données structurées Recipe (SEO) ============
   Injectées à l'ouverture d'une fiche, retirées à la fermeture :
   Google lit ainsi la recette réellement consultée. */
function setRecipeSchema(item){
  const old = document.getElementById('recipeSchema');
  if(old) old.remove();
  if(!item || !RECIPES.some(x => x.id === item.id)) return; // uniquement les recettes

  const d = item[currentLang] || item.fr;
  const etapes = d.capsules
    .filter(cp => cp.type === 'step')
    .map((cp, i) => ({ "@type": "HowToStep", "position": i + 1, "text": cp.text }));

  const data = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": d.title,
    "inLanguage": currentLang === 'ar' ? 'ar' : 'fr',
    "recipeCategory": "Dessert",
    "recipeCuisine": item.cat === 'marocain' ? (currentLang === 'ar' ? 'مغربية' : 'Marocaine') : (currentLang === 'ar' ? 'فرنسية' : 'Française'),
    "author": { "@type": "Organization", "name": "4Cake Académie", "url": "https://www.4cake.ma/" },
    "publisher": { "@type": "Organization", "name": "4Cake", "url": "https://www.4cake.ma/" }
  };

  const hook = (d.capsules.find(cp => cp.type === 'title') || {}).hook;
  if(hook) data.description = hook;
  if(d.time) data.totalTime = d.time;                 // texte lisible, non ISO 8601
  if(d.ingredients) data.recipeIngredient = d.ingredients.map(([n, q]) => (q ? q + ' ' + n : n));
  if(etapes.length) data.recipeInstructions = etapes;
  if(RECIPE_IMG[item.id]) data.image = 'https://www.4cake.ma/Academie/public/' + IMG_BASE + RECIPE_IMG[item.id];

  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = 'recipeSchema';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function nutritionHTML(recipe){
  if(!recipe || !recipe.nutrition) return '';
  const n = recipe.nutrition;
  const isAr = currentLang === 'ar';
  const rows = [
    [isAr ? 'السعرات الحرارية' : 'Calories', n.calories],
    [isAr ? 'الدهون' : 'Lipides', n.fatContent],
    [isAr ? 'الكربوهيدرات' : 'Glucides', n.carbohydrateContent],
    [isAr ? 'منها سكريات' : 'dont sucres', n.sugarContent],
    [isAr ? 'البروتينات' : 'Protéines', n.proteinContent],
    [isAr ? 'الألياف' : 'Fibres', n.fiberContent],
  ].filter(row => row[1]);
  const pieceWord = isAr ? 'قطعة' : 'pièce';
  const label = n.servingSize ? n.calories + '/' + pieceWord : n.calories + '/100g';
  const title = n.servingSize
    ? (isAr ? 'القيم الغذائية — ' : 'Valeurs nutritionnelles — ') + n.servingSize
    : (isAr ? 'القيم الغذائية — لكل 100 غ' : 'Valeurs nutritionnelles — pour 100 g');
  return `
    <button class="nut-toggle" onclick="var p=this.nextElementSibling;var open=p.style.display!=='none';p.style.display=open?'none':'block';this.querySelector('.nut-chevron').textContent=open?'▾':'▴';">
      🍽 ${label} <span class="nut-chevron">▾</span>
    </button>
    <div class="nut-panel">
      <p class="nut-title">${title}</p>
      <div class="nut-grid">${rows.map(row => `<div><span>${row[0]}</span><strong>${row[1]}</strong></div>`).join('')}</div>
      <p class="nut-note">${n.description || ''}</p>
    ${isAr ? '<p class="nut-note"><a href="/ar/academie/pro/calculateur.html" style="color:#8A6A0A;">🍽 احسبوا وصفتكم الخاصة ←</a></p>' : '<p class="nut-note"><a href="/fr/academie/pro/calculateur.html" style="color:#8A6A0A;">🍽 Calculer votre propre recette →</a></p>'}
    </div>`;
}

function openFullView(){
  const d = r(curRecipe);
  const t = UI[currentLang];
  let ingHTML = '';
  if(d.ingredients){
    ingHTML = `
      <div class="fv-section-label">${t.ingredients}</div>
      <ul class="fv-ing-list">${d.ingredients.map(([n,q]) => `<li><span>${n}</span><b>${q}</b></li>`).join('')}</ul>`;
  }
  let stepIdx = 0;
  let flowHTML = '';
  let openList = false;
  d.capsules.forEach(c => {
    if(c.type === 'title' || c.type === 'ing') return;
    if(c.type === 'step'){
      if(!openList){ flowHTML += '<ul class="fv-steps">'; openList = true; }
      stepIdx++;
      flowHTML += `<li class="fv-step"><div class="fv-step-num">${stepIdx}</div><div class="fv-step-text">${c.text}</div></li>`;
      return;
    }
    if(openList){ flowHTML += '</ul>'; openList = false; }
    if(c.type === 'number') flowHTML += `<div class="fv-note number"><div class="fv-note-label">${t.repere}</div><b>${c.value}</b>${c.label}</div>`;
    if(c.type === 'tip') flowHTML += `<div class="fv-note tip"><div class="fv-note-label">${t.astuce}</div>${c.text}</div>`;
    if(c.type === 'swap') flowHTML += `<div class="fv-note swap"><div class="fv-note-label">${t.equivalent}</div>${c.text}</div>`;
  });
  if(openList) flowHTML += '</ul>';
  document.getElementById('fullviewBackLabel').textContent = t.retour;
  document.getElementById('fullviewBody').innerHTML = `
    <div class="fv-title">${d.title}</div>
    ${d.time || d.level ? `<div class="fv-meta">${d.time ? `<span>⏱ ${d.time}</span>`:''}${d.level ? `<span>${d.level}</span>`:''}</div>` : ''}
    ${nutritionHTML(curRecipe)}
    ${ingHTML}
    <div class="fv-section-label">${t.methode}</div>
    ${flowHTML}
    <button class="fv-share-btn" onclick="partagerRecette()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M8 7l4-4 4 4"/></svg>
      ${t.partager}
    </button>
    ${encartCatalogue(curRecipe)}
  `;
  setRecipeSchema(curRecipe);
  document.getElementById('fullviewOverlay').classList.add('open');
}
function closeFullView(silencieux){
  setRecipeSchema(null);
  document.getElementById('fullviewOverlay').classList.remove('open');
  if(!silencieux && location.hash) history.pushState({}, '', location.pathname + location.search);
}

// Entrée par défaut : la fiche figée
// silencieux = true lors d'une ouverture déclenchée par l'URL (pas de nouvelle entrée d'historique)
function openRecipe(id, silencieux){
  const isRecipe = RECIPES.some(rec => rec.id === id);
  curRecipe = RECIPES.find(rec => rec.id === id) || BASICS.find(rec => rec.id === id);
  if(!curRecipe) return;
  if(!silencieux){
    // une adresse propre, partageable et rechargeable
    history.pushState({ fiche: id }, '', '#' + (isRecipe ? 'recette' : 'fiche') + '=' + id);
  }
  if(isRecipe){
    dlPush('recette_ouverte', {
      recette: curRecipe.fr.title,
      niveau: curRecipe.niveau,
      categorie: curRecipe.cat,
      langue: currentLang
    });
  } else {
    dlPush('fiche_base_ouverte', { fiche: curRecipe.fr.title, groupe: curRecipe.groupe, langue: currentLang });
  }
  openFullView();
}



/* ============ Passerelle Académie → Catalogue ============
   Analyse les ingrédients de la recette pour proposer la catégorie 4Cake pertinente. */
const CATALOGUE_URL = '/ar/index.html';

const MOTS_CATEGORIE = [
  { cat:'chocolat',    mots:['chocolat','cacao','ganache','couverture','praliné','gianduja','شوكولاتة','كاكاو'] },
  { cat:'feuilletine', mots:['feuilletine','crêpe dentelle','croustillant','فوييتين'] },
  { cat:'topping',     mots:['amande','noisette','pistache','noix','sésame','coco','fruits secs','pécan','لوز','بندق','فستق','جوز','سمسم','جوز الهند'] },
  { cat:'decors',      mots:['colorant','décor','vermicelle','perles','paillettes','nappage','ملون','زينة'] },
  { cat:'pate',        mots:['pâte à sucre','fondant','glaçage','pastillage','عجينة السكر','فوندان'] }
];

function categoriePertinente(item){
  const d = item.fr; // on analyse toujours le français, plus riche en mots-clés
  if(!d || !d.ingredients) return null;
  const texte = d.ingredients.map(([n]) => n.toLowerCase()).join(' ');
  const scores = MOTS_CATEGORIE.map(g => ({
    cat: g.cat,
    score: g.mots.filter(m => texte.indexOf(m) > -1).length
  })).filter(x => x.score > 0).sort((a,b) => b.score - a.score);
  return scores.length ? scores[0].cat : null;
}

function encartCatalogue(item){
  if(!RECIPES.some(x => x.id === item.id)) return ''; // pas sur les fiches techniques
  const t = UI[currentLang];
  const cat = categoriePertinente(item);
  const url = CATALOGUE_URL + (cat ? '?cat=' + cat : '') + '#catalogue';
  return `
    <div class="fv-shop">
      <div class="fv-shop-txt">
        <strong>${t.shop_titre}</strong>
        <span>${t.shop_texte}</span>
      </div>
      <a class="fv-shop-btn" href="${url}" data-cat="${cat || 'tous'}" onclick="dlPush('clic_catalogue_depuis_fiche_public',{fiche:${JSON.stringify((item.fr && item.fr.title) || item.id)},categorie:${JSON.stringify(cat||'tous')}})">
        ${t.shop_cta}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </div>`;
}

/* Partage : API native du téléphone si disponible (WhatsApp, SMS…), sinon copie du lien */
/* Transition explicite vers l'Espace Pro : rend visible le changement de niveau,
   au lieu d'une redirection silencieuse. */
let _ptSource = null;
function openProTransition(url, source){
  _ptSource = source;
  const t = UI[currentLang];
  document.getElementById('ptTitle').textContent = t.pt_titre;
  document.getElementById('ptText').textContent = t.pt_texte;
  document.getElementById('ptCancel').textContent = t.pt_annuler;
  document.getElementById('ptContinueLabel').textContent = t.pt_continuer;
  document.getElementById('ptContinue').setAttribute('href', url);
  document.getElementById('proTransitionOverlay').classList.add('open');
  dlPush('vue_transition_pro', { depuis: source, section: activeSection, langue: currentLang });
}
function closeProTransition(){
  document.getElementById('proTransitionOverlay').classList.remove('open');
}
document.getElementById('proTransitionOverlay').addEventListener('click', function(e){
  if(e.target.id === 'proTransitionOverlay') closeProTransition();
});
document.getElementById('ptContinue').addEventListener('click', function(){
  dlPush('clic_espace_pro', { depuis: _ptSource, section: activeSection, langue: currentLang });
});

function partagerRecette(){
  if(!curRecipe) return;
  const d = r(curRecipe);
  const isRecipe = RECIPES.some(x => x.id === curRecipe.id);
  const url = location.origin + location.pathname + '#' + (isRecipe ? 'recette' : 'fiche') + '=' + curRecipe.id;
  dlPush('partage_recette', { recette: d.title, langue: currentLang });

  if(navigator.share){
    navigator.share({ title: d.title, text: d.title + ' — 4Cake Académie', url: url }).catch(() => {});
    return;
  }
  const fini = () => {
    const b = document.querySelector('.fv-share-btn');
    if(!b) return;
    const avant = b.innerHTML;
    b.innerHTML = UI[currentLang].lien_copie;
    setTimeout(() => { b.innerHTML = avant; }, 2000);
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(fini).catch(() => window.prompt(UI[currentLang].partager, url));
  } else {
    window.prompt(UI[currentLang].partager, url);
  }
}

function applyStaticTranslations(lang){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(UI[lang][key] !== undefined){
      if(el.children.length === 0){
        el.textContent = UI[lang][key];
      } else {
        for(const node of el.childNodes){
          if(node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0){
            node.textContent = UI[lang][key];
            break;
          }
        }
      }
    }
  });
}

function setLang(lang){
  if(window.__langReady && lang !== currentLang) dlPush('changement_langue', { langue: lang });
  currentLang = lang;
  localStorage.setItem('4cake_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('lang-fr').classList.toggle('active', lang === 'fr');
  document.getElementById('lang-ar').classList.toggle('active', lang === 'ar');
  applyStaticTranslations(lang);
  const si = document.getElementById('searchInput');
  if(si) si.placeholder = UI[lang].search_placeholder;
  renderGrid();
}

// Bande défilante : sélection limitée (performance mobile), dupliquée pour une boucle sans couture
const MARQUEE_PER_ROW = 14;
function buildMarquee(){
  const uniq = [...new Set(Object.values(RECIPE_IMG))];
  for(let i = uniq.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [uniq[i], uniq[j]] = [uniq[j], uniq[i]];
  }
  const rows = [uniq.slice(0, MARQUEE_PER_ROW), uniq.slice(MARQUEE_PER_ROW, MARQUEE_PER_ROW * 2)];
  ['marqueeRow1','marqueeRow2'].forEach((id, k) => {
    const list = rows[k].length ? rows[k] : rows[0];
    const html = list.map(src =>
      `<img src="${IMG_BASE}${src}" alt="" loading="lazy" decoding="async" onerror="this.remove();">`
    ).join('');
    document.getElementById(id).innerHTML = html + html; // doublé => boucle continue
  });
}
buildMarquee();

/* Clics sortants : Espace Pro (avec transition explicite) et retour vitrine */
document.addEventListener('click', function(e){
  const a = e.target.closest('a[href]');
  if(!a) return;
  const href = a.getAttribute('href') || '';
  if(href.indexOf('../pro/') === 0 || href.indexOf('/pro/') > -1){
    if(a.id === 'ptContinue') return; // clic de confirmation dans le modal : on laisse naviguer
    e.preventDefault();
    openProTransition(href, a.classList.contains('pro-cta') ? 'bouton_cta' : a.classList.contains('rcard-pro') ? 'carte_teaser' : 'lien');
  } else if(href === '../../' || href === '../../index.html' || href.indexOf('4cake.ma') > -1){
    dlPush('retour_vitrine', { langue: currentLang });
  }
}, true);

setLang(currentLang); // applique aussi le placeholder de recherche

/* ============ Routage par ancre ============
   Permet de partager une recette précise : .../public/#recette=chebakia
   et gère le bouton Retour du navigateur. */
function idDepuisHash(){
  const h = decodeURIComponent(location.hash || '').replace(/^#/, '');
  const m = h.match(/^(?:recette|fiche)=(.+)$/);
  return m ? m[1] : null;
}

function appliquerHash(){
  const id = idDepuisHash();
  if(id){
    const existe = RECIPES.some(x => x.id === id) || BASICS.some(x => x.id === id);
    if(existe){ openRecipe(id, true); return; }
    // ancre inconnue (recette renommée, lien erroné) : on nettoie sans bloquer l'utilisateur
    history.replaceState({}, '', location.pathname + location.search);
  }
  closeFullView(true);
}

window.addEventListener('popstate', appliquerHash);
appliquerHash(); // au chargement : ouvre directement la fiche si l'URL en désigne une


window.__langReady = true;
