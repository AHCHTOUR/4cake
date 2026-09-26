
/* ============ Suivi GTM / GA4 (dataLayer) ============ */
window.dataLayer = window.dataLayer || [];
function dlPush(event, params){
  try{ window.dataLayer.push(Object.assign({event: event, espace: 'pro'}, params || {})); }
  catch(e){ /* le suivi ne doit jamais casser le site */ }
}

let currentLang = 'fr'; // forcé selon la page réelle, indépendant du localStorage
function L(fr, ar){ return (currentLang === 'ar' && ar) ? ar : fr; }
function toggleLang(){
  dlPush('changement_langue', { langue: currentLang === 'ar' ? 'fr' : 'ar' });
  // Chaque langue a sa propre URL : on navigue vers la page correspondante
  // au lieu de recharger la même (le contenu ne changeait pas, seule la mise en page basculait).
  window.location.href = '/ar/academie/pro/';
}

function T(fr){ return (currentLang==='ar' && MAROC_TR[fr]) ? MAROC_TR[fr] : fr; }


const PREPARATIONS = ['Pâte ou appareil à génoise','Biscuit au chocolat','Biscuit aux amandes','Biscuit Joconde','Pâte brisée traditionnelle','Pâte brisée au batteur','Pâte sucrée','Pâte sablée','Pâte sablée amande','Pâte à cigarettes','Pâtes émiettées, sucrées et aromatisées','Pâte feuilletée traditionnelle','Pâte feuilletée rapide (ou record)','Pâte feuilletée inversée','Pâte à brioche','Pâte à savarin','Pâte à choux','Pâte à crêpes','Pâte à cake','Pâte à frire','Appareil à soufflé','Pâte à tuiles aux amandes','Meringue française','Meringue suisse','Meringue italienne','Biscuit dacquoise','Crème anglaise traditionnelle','Crème anglaise cuite sous-vide','Crème anglaise sous-vide au bain-marie','Crème anglaise au wok','Crème pâtissière traditionnelle','Crème pâtissière à base de poudre à crème','Crème frangipane','Crème mousseline','Autres dérivés de la crème pâtissière','Crème prise sucrée','Crème au beurre','Crème Chantilly','Crème d\'amandes','Crème citron','Crémeux','Crèmes bavaroises','Mousses aux fruits','Mousses au chocolat','Ganache chocolat départ à chaud','Ganache chocolat départ à froid','Sauces et coulis','Gelées et confits','Pastillage','Glace royale','Glaçage miroir','Glaçage brillant chocolat','Autres glaçages','Flocages','Nougatine'];












/* Clics sortants : retour vitrine / espace public (délégation globale) */
document.addEventListener('click', function(e){
  const a = e.target.closest('a[href]');
  if(!a) return;
  if(a.id === 'navEspacePublic') return; // géré par le modal de transition
  const href = a.getAttribute('href') || '';
  if(href.indexOf('../public/') === 0)      dlPush('clic_espace_public', { langue: currentLang });
  else if(href.indexOf('../../') === 0 || href.indexOf('4cake.ma') > -1) dlPush('retour_vitrine', { langue: currentLang });
}, true);

/* ============ Transition Pro → Public : un seul point d'entrée ============
   Seul le bouton "Espace Public" du menu déclenche cette fenêtre — le lien
   "Site vitrine" et les futurs liens de l'encart boutique restent des clics directs. */
function ouvrirTransitionPublic(e){
  e.preventDefault();
  document.getElementById('ptTitle').textContent = L("Vous passez dans l'Académie Publique", 'أنتم تنتقلون إلى الأكاديمية العامة');
  document.getElementById('ptText').textContent = L(
    "C'est un espace plus simple, pensé pour le grand public : recettes expliquées pas à pas, sans jargon technique.",
    'هذا فضاء أبسط، مخصص لعموم الجمهور: وصفات مشروحة خطوة بخطوة، دون مصطلحات تقنية.'
  );
  document.getElementById('ptCancel').textContent = L('Rester ici', 'البقاء هنا');
  document.getElementById('ptContinueLabel').textContent = L('Continuer', 'متابعة');
  document.getElementById('ptOverlay').classList.add('open');
  return false;
}
function fermerTransitionPublic(){
  document.getElementById('ptOverlay').classList.remove('open');
}
document.getElementById('ptOverlay').addEventListener('click', function(ev){
  if(ev.target.id === 'ptOverlay') fermerTransitionPublic();
});

// ---------- Pillars ----------
document.querySelectorAll('.pillar').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('.pillar').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.pillar-panel').forEach(x => x.classList.remove('open'));
    p.classList.add('active');
    dlPush('pilier_ouvert', { pilier: p.dataset.pillar, langue: currentLang });
    const panel = document.getElementById('panel-' + p.dataset.pillar);
    panel.classList.add('open');
    panel.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// ---------- Subnav tabs ----------
document.querySelectorAll('.subnav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.subnav button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.subpanel').forEach(p => p.classList.remove('open'));
    btn.classList.add('active');
    dlPush('onglet_ouvert', { onglet: btn.dataset.tab, langue: currentLang });
    document.getElementById('tab-' + btn.dataset.tab).classList.add('open');
    btn.scrollIntoView({behavior:'smooth', block:'center', inline:'nearest'});
  });
});

// ---------- Raccourci direct vers les Recettes ----------
function goToRecettes(){
  dlPush('raccourci_recettes', { langue: currentLang });
  document.querySelectorAll('.pillar').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.pillar-panel').forEach(x => x.classList.remove('open'));
  document.querySelector('.pillar[data-pillar="techniques"]').classList.add('active');
  document.getElementById('panel-techniques').classList.add('open');
  document.querySelectorAll('.subnav button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.subpanel').forEach(p => p.classList.remove('open'));
  document.querySelector('.subnav button[data-tab="recettes"]').classList.add('active');
  document.getElementById('tab-recettes').classList.add('open');
  document.getElementById('panel-techniques').scrollIntoView({behavior:'smooth', block:'start'});
}

// ---------- Render Techniques grid ----------
// ---------- Render Approche technologique grid ----------
const gridApproche = document.getElementById('gridApproche');
gridApproche.innerHTML = APPROCHE.map((a,i) => `
  <div class="card" onclick="openApprocheStory(${i})">
    <h4>${T(a.title)}</h4>
    <span class="tag ready">${L('prêt','جاهز')}</span>
  </div>
`).join('');
function openApprocheStory(i){
  const a = APPROCHE[i];
  curTechCaps = [{type:'title', title:T(a.title), hook:T(a.hook), icon:pickIcon(a.title)}];
  curCap = 0;
  document.getElementById('storyTitle').textContent = L('Approche technologique','المقاربة التقنية');
  document.getElementById('storyBars').innerHTML = `<div class="story-bar"><i></i></div>`;
  const body = document.getElementById('storyBody');
  body.querySelectorAll('.capsule').forEach(c=>c.remove());
  body.insertAdjacentHTML('beforeend', capHTML(curTechCaps[0]));
  document.getElementById('storyOverlay').classList.add('open');
  renderCap();
}

const gridTech = document.getElementById('gridTechniques');

TECH_IMAGES['Fendre une gousse de vanille']='/Academie/pro/images/techniques/fendre-une-gousse-de-vanille.webp';
TECH_IMAGES['Glacer un éclair']='/Academie/pro/images/techniques/glacer-un-eclair.webp';
TECH_IMAGES['Coucher des choux et des éclairs']='/Academie/pro/images/techniques/coucher-des-choux-et-des-eclairs.webp';
TECH_IMAGES['Écrire avec un cornet']='/Academie/pro/images/techniques/ecrire-avec-un-cornet.webp';
TECH_IMAGES['Dessiner un motif avec un cornet']='/Academie/pro/images/techniques/dessiner-un-motif-avec-un-cornet.webp';
TECH_IMAGES['Confectionner un décor en pastillage']='/Academie/pro/images/techniques/confectionner-un-decor-en-pastillage.webp';
TECH_IMAGES['Glacer une religieuse']='/Academie/pro/images/techniques/glacer-une-religieuse.webp';
TECH_IMAGES['Blanchir des jaunes d\'œufs']='/Academie/pro/images/techniques/blanchir-des-jaunes-d-ufs.jpg';
TECH_IMAGES['Cuire un fond de tarte à blanc']='/Academie/pro/images/techniques/cuire-un-fond-de-tarte-a-blanc.webp';
TECH_IMAGES['Mettre au point un nappage blond']='/Academie/pro/images/techniques/mettre-au-point-un-nappage-blond.webp';
TECH_IMAGES['Ramollir de la gélatine']='/Academie/pro/images/techniques/ramollir-de-la-gelatine.webp';
TECH_IMAGES['Confectionner un sirop à puncher']='/Academie/pro/images/techniques/confectionner-un-sirop-a-puncher.webp';
TECH_IMAGES['Puncher un biscuit ou une génoise']='/Academie/pro/images/techniques/puncher-un-biscuit-ou-une-genoise.webp';
TECH_IMAGES['Confectionner un sirop à tremper']='/Academie/pro/images/techniques/confectionner-un-sirop-a-tremper.webp';
TECH_IMAGES['Tremper un baba ou un savarin']='/Academie/pro/images/techniques/tremper-un-baba-ou-un-savarin.webp';
TECH_IMAGES['Tamiser']='/Academie/pro/images/techniques/tamiser.webp';
TECH_IMAGES['Découper un biscuit en étages']='/Academie/pro/images/techniques/decouper-un-biscuit-en-etages.webp';
TECH_IMAGES['Monter un entremets']='/Academie/pro/images/techniques/monter-un-entremets.webp';
TECH_IMAGES['Tailler une julienne d\'orange']='/Academie/pro/images/techniques/tailler-une-julienne-d-orange.jpg';
TECH_IMAGES['Peler à vif un agrume']='/Academie/pro/images/techniques/peler-a-vif-un-agrume.webp';
TECH_IMAGES['Détailler des segments d\'agrumes']='/Academie/pro/images/techniques/detailler-des-segments-d-agrumes.jpg';
TECH_IMAGES['Coucher une meringue ronde']='/Academie/pro/images/techniques/coucher-une-meringue-ronde.webp';
TECH_IMAGES['Tabler du chocolat (méthode classique)']='/Academie/pro/images/techniques/tabler-du-chocolat.webp';
TECH_IMAGES['Réaliser un décor en chocolat']='/Academie/pro/images/techniques/realiser-un-decor-en-chocolat.webp';
TECH_IMAGES['Découper un papier cuisson pour cuire à blanc']='/Academie/pro/images/techniques/decouper-un-papier-cuisson.jpg';
TECH_IMAGES['Garnir une poche à douille']='/Academie/pro/images/techniques/garnir-une-poche-a-douille.webp';
TECH_IMAGES['Mettre au point du fondant']='/Academie/pro/images/techniques/mettre-au-point-du-fondant.webp';
TECH_IMAGES['Confectionner un rond de papier sulfurisé']='/Academie/pro/images/techniques/confectionner-un-rond-de-papier-sulfurise.webp';
TECH_IMAGES['Confectionner une cassolette']='/Academie/pro/images/techniques/confectionner-une-cassolette.webp';
TECH_IMAGES['Coucher une génoise en bande']='/Academie/pro/images/techniques/coucher-une-genoise-en-bande.webp';


gridTech.innerHTML = TECHNIQUES.map((t,i) => `
  <div class="card" onclick="openTechStory(${i})">
    ${TECH_IMAGES[t.title] ? `<img src="${TECH_IMAGES[t.title]}" alt="${t.title}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:8px;" loading="lazy" decoding="async" onerror="this.style.display=\'none\'">` : ''}
    <h4>${L(t.title, t.title_ar)}</h4>
    <span class="tag ready">${L('prêt','جاهز')}</span>
  </div>
`).join('');

let curTechCaps = [], curCap = 0, timer = null;
const DUR = 4200;

const ICON_RULES = [[["laminoir", "abaisser"], "rolling"], [["beurrer", "dorure", "punch", "sirop", "nappage"], "brush"], [["chemiser"], "mold"], [["foncer", "papier cuisson", "cassolette", "rond de papier", "cuire un fond"], "ring"], [["chiqueter"], "zigzag"], [["clarifier", "blanchir des jaunes"], "egg"], [["cornet", "écrire", "dessiner"], "cone"], [["pastillage", "chablon"], "shapes"], [["poche", "coucher"], "pipingbag"], [["fondant", "tabler", "chocolat"], "thermo"], [["glacer", "décor en chocolat"], "dip"], [["tamiser"], "sieve"], [["étages", "entremets"], "layers"], [["agrume", "orange"], "citrus"], [["gélatine"], "droplet"], [["tremper"], "dip"], [["vanille"], "vanilla"]];

function pickIcon(title){
  const tl = title.toLowerCase();
  for(const [keywords, icon] of ICON_RULES){
    for(const kw of keywords){ if(tl.includes(kw)) return icon; }
  }
  return 'hand';
}

function openTechStory(i){
  const t = TECHNIQUES[i];
  if(t) dlPush('fiche_ouverte', { type:'technique', fiche: t.title, langue: currentLang });
  const icon = pickIcon(t.title);
  const caps = [{type:'title', title:L(t.title,t.title_ar), hook:L(t.hook,t.hook_ar), icon:icon}];
  if(t.repere) caps.push({type:'number', value:t.repere, label:L('Repère','مرجع'), progressive: t.repere.includes('→')});
  if(t.warn) caps.push({type:'warn', text:T(t.warn)});
  curTechCaps = caps;
  curCap = 0;
  document.getElementById('storyTitle').textContent = L('Technique de base','تقنية أساسية');
  document.getElementById('storyBars').innerHTML = caps.map(()=>`<div class="story-bar"><i></i></div>`).join('');
  const body = document.getElementById('storyBody');
  body.querySelectorAll('.capsule').forEach(c=>c.remove());
  caps.forEach(c => body.insertAdjacentHTML('beforeend', capHTML(c)));
  document.getElementById('storyOverlay').classList.add('open');
  renderCap();
}
function capHTML(c){
  if(c.type==='title'){
    const visual = TECH_IMAGES[c.title] ? `<img src="${TECH_IMAGES[c.title]}" alt="${c.title}" style="width:120px;height:120px;object-fit:cover;border-radius:12px;">` : `<div class="cap-icon">${ICONS[c.icon]}</div>`;
    return `<div class="capsule">${visual}<div class="cap-title">${c.title}</div><div class="cap-hook">${c.hook}</div></div>`;
  }
  if(c.type==='number'){
    const progress = c.progressive ? `<div class="cap-progress"><span class="cap-icon-mini">${ICONS.thermo}</span><span class="cap-arrow">&#8594;</span><span class="cap-icon-mini cap-icon-mini--full">${ICONS.thermo}</span></div>` : `<div class="cap-icon">${ICONS.thermo}</div>`;
    return `<div class="capsule">${progress}<div class="cap-label">${c.label}</div><div class="cap-number">${c.value}</div></div>`;
  }
  if(c.type==='warn') return `<div class="capsule"><div class="cap-label" style="color:var(--warn)">${L('À éviter','تجنّبي')}</div><div class="cap-warn">${c.text}</div></div>`;
}
function renderCap(){
  const caps = document.querySelectorAll('.capsule');
  const bars = document.querySelectorAll('.story-bar');
  caps.forEach((c,i)=>c.classList.toggle('active', i===curCap));
  bars.forEach((b,i)=>{
    b.classList.toggle('done', i<curCap);
    const bar = b.querySelector('i');
    if(i<curCap){ bar.style.transition='none'; bar.style.width='100%'; }
    else if(i===curCap){ bar.style.transition='none'; bar.style.width='0%'; requestAnimationFrame(()=>{ bar.style.transition=`width ${DUR}ms linear`; bar.style.width='100%'; }); }
    else { bar.style.transition='none'; bar.style.width='0%'; }
  });
  clearTimeout(timer);
  timer = setTimeout(()=>{ if(curCap<curTechCaps.length-1) nextCap(); }, DUR);
}
function nextCap(){ if(curCap<curTechCaps.length-1){ curCap++; renderCap(); } else { closeStory(); } }
function prevCap(){ if(curCap>0){ curCap--; renderCap(); } }
function closeStory(){ clearTimeout(timer); document.getElementById('storyOverlay').classList.remove('open'); }

// ---------- Render Préparations grid ----------
const gridPrepa = document.getElementById('gridPrepa');

















VOCAB.push({term:'Blanchir',def:'Fouetter des jaunes d\'œufs (ou œufs entiers) avec du sucre jusqu\'à ce que le mélange pâlisse et devienne mousseux — base de nombreuses crèmes.'},{term:'Monter',def:'Faire prendre du volume à une préparation en la fouettant (blancs en neige, crème Chantilly, pâte à bombe).'},{term:'Masquer',def:'Recouvrir entièrement la surface d\'un entremets d\'une couche de crème, de glaçage ou de pâte d\'amande.'},{term:'Piquer',def:'Percer une pâte à la fourchette ou au rouleau pique-vite pour l\'empêcher de gonfler de façon irrégulière à la cuisson.'},{term:'Rayer',def:'Tracer des motifs réguliers sur une pâte dorée (choux, feuilletage) à l\'aide d\'une fourchette ou d\'un couteau, avant cuisson.'},{term:'Dorer',def:'Badigeonner une pâte d\'œuf battu avant cuisson pour obtenir une coloration dorée et brillante.'},{term:'Dresser',def:'Disposer une préparation sur plaque ou en assiette, à la poche à douille ou à la main.'},{term:'Coucher',def:'Dresser une pâte à la poche à douille (choux, biscuits, meringues).'},{term:'Glacer',def:'Recouvrir une pièce d\'une couche de fondant, de glaçage ou de nappage lisse et brillant.'},{term:'Confire',def:'Cuire longuement et doucement un aliment dans un sirop, un corps gras ou un liquide sucré, pour le conserver et l\'attendrir.'},{term:'Décuire',def:'Stopper la cuisson d\'un sucre ou d\'un caramel en ajoutant un liquide froid (eau, crème).'},{term:'Émonder / Monder',def:'Retirer la peau d\'un fruit ou d\'une amande après un bref passage à l\'eau bouillante.'},{term:'Torréfier',def:'Griller à sec ou au four pour développer les arômes (amandes, sésame, café, cacao).'},{term:'Sangler',def:'Refroidir très rapidement une préparation, historiquement au sel et à la glace pilée.'},{term:'Fontaine',def:'Disposer la farine en cercle creux sur le plan de travail, pour incorporer les autres ingrédients en son centre.'},{term:'Panade',def:'Pâte à choux desséchée sur le feu après l\'ajout de la farine, avant l\'incorporation des œufs.'},{term:'Empois',def:'État de l\'amidon une fois gélifié sous l\'effet de la chaleur et de l\'humidité.'},{term:'Bain-marie',def:'Mode de cuisson douce et indirecte : le récipient de préparation trempe dans un second rempli d\'eau chaude, sans bouillir.'},{term:'Petit boulé / Grand boulé',def:'Stades de cuisson du sucre (112-116°C puis 117-120°C) : une goutte plongée dans l\'eau froide forme une boule molle, puis plus ferme.'},{term:'Petit cassé / Grand cassé',def:'Stades de cuisson du sucre (132-143°C puis 146-155°C) : le sucre devient cassant en refroidissant.'},{term:'Cuisson à la nappe',def:'Degré de cuisson d\'une crème anglaise (83-84°C), qui nappe le dos d\'une cuillère sans jamais bouillir.'},{term:'Beurre noisette',def:'Beurre fondu poussé jusqu\'à coloration ambrée, développant un parfum caractéristique de noisette torréfiée.'},{term:'Rompre',def:'Dégazer une pâte levée en la repliant sur elle-même après la première pousse.'},{term:'Pointage',def:'Première fermentation d\'une pâte levée, avant le façonnage.'},{term:'Apprêt',def:'Seconde fermentation d\'une pâte levée, après façonnage, juste avant la cuisson.'},{term:'Façonner',def:'Donner à une pâte sa forme définitive avant cuisson.'},{term:'Ébarber',def:'Retirer l\'excédent de pâte ou de glaçage sur le pourtour d\'une pièce, pour une finition nette.'},{term:'Canneler',def:'Strier la surface d\'un fruit ou d\'une pâte à l\'aide d\'un couteau canneleur, pour un effet décoratif.'},{term:'Historier',def:'Décorer une préparation avec précision, en général au cornet ou au pinceau.'},{term:'Ganacher',def:'Garnir ou masquer une pièce de ganache.'},{term:'Praliner',def:'Parfumer ou enrichir une préparation avec de la pâte de praliné.'},{term:'Vanner',def:'Remuer délicatement et régulièrement une préparation en cours de refroidissement, pour éviter la formation d\'une peau en surface.'},{term:'Émulsionner',def:'Lier intimement deux éléments normalement peu miscibles (eau et matière grasse) pour obtenir un mélange homogène et stable.'},{term:'Turbiner',def:'Passer une préparation liquide en sorbetière ou en turbine, pour la transformer en glace ou en sorbet.'},{term:'Tourage',def:'Action de plier et d\'étaler successivement une pâte feuilletée pour créer ses couches caractéristiques.'},{term:'Beurre manié',def:'Mélange de beurre et de farine à parts égales, utilisé notamment en pâte feuilletée inversée.'},{term:'Densité (°Baumé / °Brix)',def:'Unité de mesure de la concentration en sucre d\'un sirop, évaluée au densimètre (°Baumé) ou au réfractomètre (°Brix).'},{term:'Ziste',def:'Partie blanche et amère située sous le zeste d\'un agrume, à retirer lors du zestage ou du pelage à vif.'},{term:'Suprême (agrume)',def:'Quartier d\'agrume pelé à vif, entièrement dégagé de sa membrane.'},{term:'Écumer',def:'Retirer à l\'écumoire les impuretés ou la mousse qui remontent à la surface d\'une préparation en cuisson.'},{term:'Marbrer',def:'Mélanger partiellement deux préparations de couleurs différentes pour obtenir un effet veiné, sans les fondre complètement.'},{term:'Coller',def:'Ajouter de la gélatine à une préparation pour la faire prendre en la refroidissant.'},{term:'Foncer un moule',def:'Garnir l\'intérieur d\'un moule ou d\'un cercle avec une abaisse de pâte, en la plaquant bien contre les parois.'},{term:'Détendre',def:'Assouplir une préparation trop ferme en y ajoutant un peu de liquide (eau, sirop, lait).'},{term:'Croûter',def:'Laisser sécher légèrement la surface d\'une préparation à l\'air libre, pour former une fine croûte protectrice avant cuisson ou dressage.'});
VOCAB.push({term:'Additifs',def:'Substance habituellement non consommée comme aliment en soi, ajoutée intentionnellement à une denrée dans un but technologique, avec ou sans valeur nutritive.'},{term:'Amaretto',def:'Liqueur d\'origine italienne, au goût d\'amandes amères.'},{term:'Amidon',def:'Macromolécule constituée de milliers de molécules de glucose ; on distingue l\'amylose et l\'amylopectine, aux propriétés spécifiques.'},{term:'Anthocyane',def:'Pigment naturel soluble dans l\'eau, du rouge au bleu, présent dans de nombreux fruits et fleurs.'},{term:'Baba',def:'Gâteau individuel ou multi-portions à base de pâte levée, souvent garni de raisins secs et de crème Chantilly.'},{term:'Birewecke',def:'Spécialité alsacienne à base de pâte à pain, fruits secs, noix et noisettes, se conservant longtemps.'},{term:'Beurrer',def:'a) Enduire de beurre ramolli un cercle ou un moule pour empêcher les mets de coller à la cuisson. b) Ajouter du beurre à une pâte (ex. une détrempe).'},{term:'Brownie',def:'Biscuit au chocolat garni d\'éclats de chocolat.'},{term:'Broyer',def:'Concasser finement.'},{term:'Brûler',def:'Se dit de l\'aspect des jaunes d\'œufs en contact avec du sucre quand le mélange n\'est pas réalisé immédiatement — ils forment des grumeaux.'},{term:'Cellule de refroidissement',def:'Matériel permettant d\'abaisser rapidement la température d\'un produit alimentaire, dans les meilleures conditions d\'hygiène.'},{term:'Cellulose',def:'Glucide polymère du glucose, composant structurel des végétaux.'},{term:'Citrate de sodium',def:'Sel de l\'acide citrique. Régulateur d\'acidité et chélateur de calcium, utilisé notamment pour la sphérification inverse.'},{term:'Cromesquis',def:'Éléments cuits enrobés d\'une fine crêpe puis d\'une pâte à frire.'},{term:'Croquants',def:'Petits biscuits secs, réalisés dans différentes régions françaises.'},{term:'Croquante / Nougatine',def:'Autre nom de la nougatine — pâte de sucre cuit et d\'amandes ou noisettes concassées.'},{term:'Désinfection',def:'Réduction, par agents chimiques ou méthodes physiques, du nombre de micro-organismes dans l\'environnement jusqu\'à un niveau ne compromettant pas la sécurité des aliments.'},{term:'Désir du roi',def:'Chou farci de glace vanille, nappé de sauce chocolat chaude.'},{term:'Dessécher',def:'Travailler sans arrêt une préparation à la spatule, sur le feu, pour en évaporer l\'excès d\'humidité (ex. la panade de la pâte à choux).'},{term:'Épépiner',def:'Enlever les pépins.'},{term:'Éplucher',def:'Enlever la peau des fruits.'},{term:'Équeuter',def:'Enlever la queue d\'un fruit.'},{term:'Escaloper',def:'Détailler en biais des tranches généralement peu épaisses.'},{term:'Escargot (viennoiserie)',def:'Pâte levée feuilletée roulée, garnie de crème pâtissière et de raisins.'},{term:'Flore bactérienne',def:'Ensemble de germes se développant dans un écosystème (flore lactique, intestinale, gastrique...).'},{term:'Huiles essentielles',def:'Liquide concentré et hydrophobe des composés aromatiques volatils d\'une plante, obtenu par distillation ou extraction.'},{term:'Jalousie (dessert)',def:'Entremets à base de deux abaisses de pâte feuilletée, garni entre les deux.'},{term:'Législation',def:'Ensemble des dispositions législatives, réglementaires et administratives régissant les denrées alimentaires et leur sécurité (Règlement CE 178/2002).'},{term:'Lyophilisation',def:'Dessiccation d\'un produit préalablement surgelé par sublimation — le solvant (l\'eau) passe de l\'état solide à l\'état gazeux sans phase liquide.'},{term:'Mandoline',def:'Ustensile permettant de tailler (râper, émincer, en julienne...) fruits et légumes.'},{term:'Manqué',def:'Variété de biscuit, proche du biscuit de Savoie.'},{term:'Mix',def:'Synonyme de mélange ou d\'appareil, terme fréquent dans l\'industrie.'},{term:'Omelette norvégienne (définition)',def:'Entremets rectangulaire composé de glace sur une base de génoise, recouvert de meringue italienne.'},{term:'Pastis (gâteau)',def:'Gâteau feuilleté à pâte étirée à la main, très fine, de forme ronde et chiffonnée.'},{term:'Pathogène',def:'Qui peut provoquer une maladie — du grec « naissance de souffrance ».'},{term:'Pithiviers (définition)',def:'Gâteau composé de deux abaisses de pâte feuilletée, garni de crème frangipane ou de crème d\'amandes.'},{term:'Putréfaction',def:'Transformation de denrées riches en protéines sous l\'action de micro-organismes, une fermentation dite putride.'},{term:'Rioler',def:'Placer de petites bandes de pâte régulières sur la surface d\'un gâteau, en diagonale entrecroisée.'},{term:'Satiner',def:'Étirer et replier plusieurs fois un sucre cuit pour le rendre opaque, avant de façonner fleurs ou feuilles.'},{term:'Saupoudrer',def:'Parsemer une surface d\'une fine couche de poudre (sucre, cacao, farine...).'},{term:'Suspensions',def:'Proche de l\'émulsion, mais la matière grasse liquide y est remplacée par des particules solides.'},{term:'Suzette (Crêpes)',def:'Crêpes au beurre et zestes d\'agrumes, flambées au Grand Marnier ou Cointreau.'},{term:'Test de vieillissement microbiologique',def:'Étude de l\'évolution, dans un aliment, des populations de micro-organismes habituellement présentes.'},{term:'Thermorésistant',def:'Qualité d\'un organisme capable de résister à une température élevée.'},{term:'Turron (Touron)',def:'Confiserie à base de miel, sucre, blancs d\'œufs et amandes.'},{term:'Tutti Frutti',def:'Expression italienne signifiant « tous fruits » — crème glacée contenant de nombreux fruits et arômes.'},{term:'Zooglée',def:'Amas de microbes formant une colonie dans un environnement propice.'},{term:'Zymase',def:'Enzyme de la levure de boulangerie qui transforme le glucose en alcool et CO2 pendant la fermentation panaire.'});
VOCAB.push({term:'Abricoter',def:'Lustrer au pinceau la surface d\'un gâteau (souvent une tarte) avec un nappage blond chaud, une gelée d\'abricots ou un sirop réduit.'},{term:'Baba',def:'Gâteau individuel ou multi-portions à base de pâte levée, agrémenté de raisins secs, souvent garni de crème Chantilly.'},{term:'Bavarois',def:'Appareil aromatisé, collé à la gélatine, auquel on ajoute de la crème fouettée.'},{term:'Belle-Hélène',def:'Entremets à base de glace et de fruit poché, nappé de sauce chocolat chaude, amandes effilées.'},{term:'Blanc-manger',def:'Entremets à base de crème collée à la gélatine, aromatisée à l\'amande.'},{term:'Bourdaloue',def:'Appellation désignant l\'utilisation de crème d\'amandes ou frangipane, notamment dans les tartes aux fruits.'},{term:'Charlotte',def:'Entremets sucré à base de purée de fruits additionnée de crème fouettée et de sirop collé ; désigne aussi le moule nécessaire à sa réalisation.'},{term:'Clafoutis',def:'Gâteau originaire du Limousin, garni de fruits (traditionnellement des cerises).'},{term:'Corne de gazelle',def:'Petite pâtisserie orientale en forme de croissant.'},{term:'Dacquoise',def:'Gâteau originaire du Sud-Ouest : deux ou trois disques de pâte meringuée aux amandes, séparés de crème au beurre parfumée, poudrés de sucre glace.'},{term:'Dame-blanche',def:'Glace vanille, crème Chantilly et sauce chocolat chaude.'},{term:'Dariole',def:'Pâtisserie à base de pâte feuilletée, cuite dans le moule du même nom.'},{term:'Dartois',def:'Pâtisserie à base de pâte feuilletée, à garnitures diverses.'},{term:'Diplomate',def:'Entremets à base de biscuit cuillère ou de morceaux de brioche, cuit avec un appareil à crème prise.'},{term:'Financier',def:'Petit gâteau à base de pâte à biscuit et de poudre d\'amandes.'},{term:'Forêt noire',def:'Génoise chocolat, crème ganache, chantilly, cerises à l\'eau de vie, copeaux de chocolat.'},{term:'Fougasse',def:'Pâte à brioche de grande taille, aromatisée à la fleur d\'oranger.'},{term:'Galette des rois',def:'Pâtisserie à base de pâte feuilletée, garnie de crème d\'amandes ou de frangipane (parfois à base de pâte à brioche).'},{term:'Gaufre',def:'Pâtisserie de forme rectangulaire alvéolée.'},{term:'Gianduja',def:'Mélange de noisettes ou amandes et de couverture de chocolat.'},{term:'Gougère',def:'Pâte à choux agrémentée de fromage.'},{term:'Île flottante',def:'Blancs en neige sur crème anglaise, ou biscuit de Savoie entouré d\'un cordon de crème anglaise.'},{term:'Jalousie',def:'Entremets à base de deux abaisses de pâte feuilletée, garni entre les deux.'},{term:'Kouign-amann',def:'Gâteau breton de pâte poussée feuilletée, dense et caramélisée, garni.'},{term:'Kougelhopf',def:'Gâteau rond à base de pâte levée aux nervures marquées, garni de raisins secs et d\'amandes entières.'},{term:'Marbré',def:'Gâteau obtenu en versant dans un moule deux appareils de même pâte, aromatisés et colorés différemment.'},{term:'Moka',def:'Gâteau à base d\'abaisses de génoise garnies de crème au beurre café, amandes effilées torréfiées en périphérie.'},{term:'Muffin',def:'Petit gâteau épais et rond à base de pâte poussée.'},{term:'Nid d\'abeilles',def:'Gâteau rond à base de pâte à brioche recouvert d\'amandes effilées, beurre, sucre — deux abaisses garnies de crème pâtissière.'},{term:'Nougat glacé',def:'Jaune d\'œuf et sucre montés en sabayon, sucre et miel cuits au petit boulé (117°C), crème fouettée, blanc d\'œuf monté, amandes et fruits secs caramélisés.'},{term:'Opéra',def:'Entremets à base de plusieurs couches de biscuit Joconde, crème au beurre café, ganache chocolat, glaçage chocolat.'},{term:'Palet breton',def:'Biscuit pur beurre breton, rond et friable, à la levure chimique.'},{term:'Panettone',def:'Brioche cylindrique fourrée de raisins secs, fruits confits et zestes d\'agrumes.'},{term:'Parfait',def:'Entremets glacé onctueux.'},{term:'Pet de nonne',def:'Beignet de pâte à choux parfumée, cuit en friture.'},{term:'Pièce montée',def:'Pâtisserie de grande taille, le plus souvent composée de choux garnis collés au caramel, en forme de cône.'},{term:'Poire Belle-Hélène',def:'Poire pochée disposée sur un lit de glace vanille, amandes effilées, sauce chocolat chaude.'},{term:'Profiterole',def:'Chou farci de crème Chantilly, sauce chocolat chaude.'},{term:'Religieuse',def:'Gâteau individuel composé de deux choux farcis superposés, le plus petit au-dessus, décoré de crème Chantilly.'},{term:'Saint-Honoré',def:'Pâtisserie ronde à base de pâte sucrée ou feuilletée et de pâte à choux, garnie de crème Chiboust.'},{term:'Salambo',def:'Préparation en pâte à choux de forme ovale légèrement couchée, garnie de crème.'},{term:'Tropézienne',def:'Dessert à base de pâte briochée, fourré de crème mousseline au rhum, sucre glace.'},{term:'Vacherin',def:'Entremets à base de meringue et de glaces, Chantilly, copeaux de chocolat.'},{term:'Battre',def:'Travailler vigoureusement une préparation pour obtenir une consistance homogène (blancs en neige, crème fouettée, pâtes battues).'},{term:'Blanchir (définition officielle)',def:'En pâtisserie, travailler ensemble jaune d\'œuf et sucre jusqu\'à ce que le mélange devienne mousseux (base de la crème anglaise).'},{term:'Concher',def:'Travailler un chocolat de couverture pour le rendre homogène, uniforme et onctueux.'},{term:'Contiser',def:'Inciser pour insérer ou glisser des éléments décoratifs ou aromatiques.'},{term:'Corser',def:'Donner du corps à une pâte, ou ajouter un produit concentré pour renforcer un arôme.'},{term:'Effiler',def:'Couper les amandes ou autres fruits secs en tranches fines.'},{term:'Émincer',def:'Couper des fruits en tranches, lamelles ou rondelles très fines.'},{term:'Fouler',def:'Presser un appareil, une crème ou un coulis en le passant au chinois ou à l\'étamine.'},{term:'Imbiber',def:'Imprégner une préparation d\'un élément liquide aromatique, par trempage ou au pinceau.'},{term:'Lisser',def:'Rendre lisse, sans aspérités.'},{term:'Lustrer',def:'Recouvrir de gelée pour donner un aspect brillant, ou déposer du beurre fondu ou du sirop sur une préparation chaude.'},{term:'Macérer',def:'Mettre des fruits secs ou confits avec du sucre, une eau-de-vie ou une liqueur, pour qu\'ils s\'imprègnent du parfum.'},{term:'Malaxer',def:'Mélanger énergiquement.'},{term:'Meringuer',def:'Déposer une couche de meringue sur une préparation.'},{term:'Mouiller',def:'Ajouter un liquide (eau, lait, sirop, vin, alcool) à une préparation.'},{term:'Parer',def:'Enlever tous les éléments indésirables sur un aliment.'},{term:'Peler',def:'Éliminer la peau d\'un fruit ou d\'un légume.'},{term:'Pétrir',def:'Mélanger plusieurs éléments pour obtenir une pâte homogène.'},{term:'Pincer',def:'Agrémenter le pourtour d\'une préparation à l\'aide d\'une pince à pâte.'},{term:'Pousser',def:'Faire augmenter de volume une pâte levée, à température adéquate et à l\'abri des courants d\'air.'},{term:'Quadriller',def:'Marquer un quadrillage sur une pièce à l\'aide de la partie non tranchante d\'une lame de couteau.'},{term:'Rafraîchir',def:'Mettre au froid.'},{term:'Réduire',def:'Cuire à découvert pour faire évaporer un liquide sous l\'action d\'une chaleur vive, concentrant ainsi le parfum.'},{term:'Relâcher',def:'Se dit d\'un appareil ou d\'une pâte qui perd de sa tenue après pétrissage, temps d\'attente ou cuisson.'},{term:'Rissoler',def:'Faire colorer vivement des aliments dans un corps gras bien chaud, pour former une croûte qui emprisonne les sucs.'},{term:'Sabayon',def:'Mélange d\'œufs et d\'alcool fouetté sur le feu jusqu\'à prise de consistance.'},{term:'Sabler (définition officielle)',def:'Réaliser un fin mélange d\'ingrédients suggérant la texture du sable.'},{term:'Salpicon',def:'Garniture d\'un ou plusieurs éléments taillés en petits dés, liés avec des sauces ou crèmes, chaudes ou froides.'},{term:'Amidon modifié',def:'Substance obtenue après un ou plusieurs traitements de l\'amidon, aux propriétés fonctionnelles modifiées.'},{term:'Antioxydant',def:'Participe à améliorer la texture et l\'homogénéité d\'une préparation, en évitant l\'altération et le rancissement.'},{term:'Réaction de Maillard',def:'Réaction chimique entre un acide aminé et un sucre sous l\'effet de la chaleur, à l\'origine du goût, de la couleur et de la consistance des aliments frits ou grillés.'},{term:'Synérèse',def:'Séparation d\'une préparation en deux phases (solide et liquide), fréquente avec les amidons traditionnels soumis à des écarts de température.'},{term:'Thixotropie',def:'Propriété d\'un fluide dont la viscosité évolue avec le temps sous contrainte constante.'},{term:'Hydrocolloïdes',def:'Substances susceptibles de former un gel au contact de l\'eau (gommes xanthane, guar, caroube), fréquentes dans l\'industrie alimentaire.'},{term:'Polyols',def:'Sucres-alcools comportant plusieurs groupes hydroxyle, utilisés comme édulcorants.'},{term:'Degré Baumé',def:'Ancienne unité de mesure de la densité des sirops de sucre, aujourd\'hui remplacée par le degré Brix.'},{term:'Inverti (sucre)',def:'Mélange sucré présentant la même quantité de glucose et de fructose.'},{term:'Lécithines',def:'Phospholipides extraits notamment du jaune d\'œuf ou du soja, aux propriétés émulsifiantes — composants des membranes cellulaires.'});


Object.assign(READY_PREPS, {'Pâte ou appareil à génoise': {title:'Pâte ou appareil à génoise',ratios:[['Œuf entier','200 g'],['Farine','125 g'],['Sucre','125 g'],['Beurre (chemisage)','20 g'],['Farine (chemisage)','20 g']],prep:'1h',cook:'20 à 30 min',steps:['Mélanger le sucre et les œufs entiers.','Fouetter la préparation afin de blanchir celle-ci.','Fouetter au bain-marie à température maîtrisée, ne pas dépasser 48°C.','Fouetter jusqu\'à l\'obtention d\'un ruban, puis incorporer la farine délicatement.']},'Biscuit aux amandes': {title:'Biscuit aux amandes',ratios:[['Jaune d\'œuf','80 g'],['Blanc d\'œuf','120 g'],['Farine','100 g'],['Poudre d\'amandes','35 g'],['Sucre','125 g']],prep:'1h',cook:'15 à 20 min',steps:['Clarifier les œufs et blanchir les jaunes au batteur avec le sucre, jusqu\'à obtention d\'un appareil mousseux.','Mélanger la farine et la poudre d\'amandes, tamiser.','Ajouter délicatement le mélange à la spatule.','Cuire à four chaud 15 à 20 minutes.']},'Pâte sucrée': {title:'Pâte sucrée',ratios:[['Farine','220 g'],['Maïzena','30 g'],['Beurre','125 g'],['Sucre glace','100 g'],['Sel fin','5 g'],['Jaune d\'œuf','45 g'],['Eau','0,002 l']],prep:'30 min',cook:'—',steps:['Verser la farine dans la cuve du cutter, ajouter le sel, la Maïzena et le sucre glace.','Ajouter le beurre en parcelles, mélanger pour sabler la préparation.','Vérifier la finesse du mélange (texture sableuse homogène).','Ajouter les jaunes et l\'eau, fraiser et bouler, réserver au froid.']},'Pâte sablée amande': {title:'Pâte sablée amande',ratios:[['Farine','250 g'],['Beurre','150 g'],['Poudre d\'amandes','30 g'],['Sel fin','2 g'],['Eau','0,02 l'],['Sucre glace','100 g'],['Poudre à lever','5 g'],['Jaune d\'œuf','40 g']],prep:'30 min',cook:'—',steps:['Verser la farine dans la cuve du cutter, ajouter le sucre glace et la poudre à lever.','Ajouter la poudre d\'amandes, faire fondre le sel dans un peu d\'eau.','Ajouter le beurre en parcelles, sabler la préparation.','Ajouter jaune et eau salée, fraiser et bouler, réserver au froid.']},'Appareil à soufflé': {title:'Appareil à soufflé',ratios:[['Lait','0,50 l'],['Sucre semoule','125 g'],['Farine','70 g'],['Jaune d\'œuf','120 g'],['Blanc d\'œuf','240 g'],['Sucre (serrer les blancs)','40 g']],prep:'1h30',cook:'25 à 45 min',steps:['Mettre le lait à chauffer avec un tiers du sucre (pour éviter que ça n\'accroche).','Clarifier les œufs, blanchir les jaunes avec le reste du sucre, incorporer la farine.','Verser le lait bouillant sur l\'appareil, cuire en remuant.','Monter les blancs en neige, les serrer avec le sucre, incorporer délicatement à l\'appareil refroidi.']},'Crème anglaise traditionnelle': {title:'Crème anglaise traditionnelle',ratios:[['Lait entier','1,00 l'],['Jaune d\'œuf','160 g'],['Sucre','250 g'],['Vanille','1 gousse']],prep:'30 min',cook:'cuisson à 84°C',steps:['Mettre le lait à bouillir avec une partie du sucre et la vanille.','Blanchir les jaunes avec le reste du sucre.','Ajouter une partie du lait chaud sur l\'appareil, puis reverser le tout dans la russe.','Cuire en remuant à la spatule jusqu\'à 84°C (cuisson à la nappe), passer au chinois.']},'Crème pâtissière à base de poudre à crème': {title:'Crème pâtissière à base de poudre à crème',ratios:[['Lait','1,00 l'],['Sucre','250 g'],['Poudre à crème','PM (selon emballage)'],['Vanille','1 gousse']],prep:'45 min',cook:'4 à 8 min',steps:['Ajouter un tiers du sucre dans le lait, porter à ébullition avec la vanille.','Mélanger la poudre à crème avec le reste du sucre, ajouter un peu de lait froid pour délayer.','Verser le lait bouillant sur ce mélange, reverser dans la casserole.','Cuire 4 à 8 minutes en fouettant, jusqu\'à épaississement.']},'Crème au beurre': {title:'Crème au beurre',ratios:[['Jaune d\'œuf','120 g'],['Sucre','250 g'],['Eau','0,085 l'],['Beurre','300 g']],prep:'1h',cook:'20 à 30 min',steps:['Émulsionner les jaunes d\'œufs au batteur.','Cuire le sucre avec l\'eau jusqu\'au grand boulé, retirer du feu.','Verser délicatement le sucre cuit sur les jaunes en émulsionnant.','Ajouter le beurre en pommade, débarrasser et lisser au fouet (aromatisation possible à ce stade).']},'Ganache chocolat départ à froid': {title:'Ganache chocolat départ à froid',ratios:[['Chocolat noir','250 g'],['Crème','200 g']],prep:'1h',cook:'15 à 20 min',steps:['Concasser le chocolat, le mettre dans une calotte.','Porter la crème à ébullition dans une russe.','Verser la crème bouillante sur le chocolat.','Fouetter la préparation jusqu\'à obtenir un mélange homogène et brillant.']}});
Object.assign(READY_PREPS, {'Biscuit au chocolat': {title:'Biscuit au chocolat',ratios:[['Jaune d\'œuf','80 g'],['Blanc d\'œuf','120 g'],['Farine','110 g'],['Poudre de cacao','20 g'],['Sucre','125 g']],prep:'1h',cook:'20 à 30 min',steps:['Blanchir les jaunes avec le sucre.','Fouetter jusqu\'à obtention d\'une préparation mousseuse.','Incorporer la farine et le cacao tamisés.','Monter les blancs, les incorporer délicatement, cuire à four chaud.']},'Biscuit Joconde': {title:'Biscuit Joconde',ratios:[['Œuf entier','200 g'],['Poudre d\'amandes','130 g'],['Sucre glace','130 g'],['Farine','40 g'],['Blanc d\'œuf','150 g'],['Sucre','70 g'],['Beurre noisette','30 g']],prep:'40 min',cook:'15 à 20 min',steps:['Fouetter les œufs entiers avec la poudre d\'amandes et le sucre glace jusqu\'à obtention d\'un appareil mousseux.','Incorporer la farine tamisée.','Monter les blancs, serrer avec le sucre, incorporer délicatement.','Ajouter le beurre noisette refroidi, étaler finement, cuire à four chaud.']},'Pâte brisée traditionnelle': {title:'Pâte brisée traditionnelle',ratios:[['Farine','250 g'],['Beurre','125 g'],['Sel fin','3 g'],['Eau','0,05 l'],['Jaune d\'œuf','20 g']],prep:'30 min',cook:'—',steps:['Sabler délicatement la farine et le beurre pour bien incorporer.','Ajouter le jaune d\'œuf, le sel et l\'eau.','Fraiser et bouler sans trop travailler.','Réserver au froid avant utilisation.']},'Pâte brisée au batteur': {title:'Pâte brisée au batteur',ratios:[['Farine','250 g'],['Beurre','125 g'],['Sel fin','3 g'],['Eau','0,05 l'],['Jaune d\'œuf','20 g']],prep:'30 min',cook:'—',steps:['Mélanger dans la cuve la farine et les parcelles de beurre.','Travailler au crochet pour sabler la préparation.','Ajouter le jaune d\'œuf, le sel et l\'eau.','Mélanger juste assez pour lier, réserver au froid.']},'Pâte sablée': {title:'Pâte sablée',ratios:[['Farine','250 g'],['Beurre','125 g'],['Sucre semoule','50 g'],['Sel fin','2 g'],['Eau','0,03 l'],['Jaune d\'œuf','40 g']],prep:'30 min',cook:'—',steps:['Déposer la farine dans la cuve du cutter.','Ajouter le beurre en parcelles, puis le sucre semoule en pluie.','Sabler la préparation.','Ajouter jaune et eau, fraiser et bouler, réserver au froid.']},'Pâte à cigarettes': {title:'Pâte à cigarettes',ratios:[['Beurre','185 g'],['Sucre glace','300 g'],['Blanc d\'œuf','180 g'],['Farine','160 g']],prep:'30 min',cook:'2 à 5 min',steps:['Mettre le beurre en pommade.','Ajouter le sucre glace, mélanger et lisser.','Ajouter les blancs d\'œufs progressivement.','Incorporer la farine et l\'extrait de vanille au fouet.']},'Pâte feuilletée rapide (ou record)': {title:'Pâte feuilletée rapide (ou record)',ratios:[['Farine','250 g'],['Eau','0,125 l'],['Sel fin','5 g'],['Beurre de tourage','200 g']],prep:'1h30',cook:'—',steps:['Verser la farine dans la cuve du batteur.','Mélanger l\'eau et le sel, ajouter dans la cuve.','Mettre à tourner au crochet.','Incorporer le beurre en morceaux, tourer selon la méthode rapide.']},'Pâte feuilletée inversée': {title:'Pâte feuilletée inversée',ratios:[['Farine (beurre manié)','150 g'],['Beurre de tourage (beurre manié)','350 g'],['Farine (détrempe)','350 g'],['Eau','0,15 l'],['Sel fin','15 g'],['Beurre fondu','110 g']],prep:'2h30',cook:'—',steps:['Réaliser le beurre manié (farine + beurre de tourage), l\'abaisser en rectangle.','Confectionner la détrempe (farine, eau, sel, beurre fondu).','Envelopper la détrempe dans le beurre manié (à l\'inverse du feuilletage classique).','Donner les tours, en respectant les temps de repos au froid.']},'Pâte à brioche': {title:'Pâte à brioche',ratios:[['Farine','600 g'],['Eau ou lait','0,05 l'],['Levure','20 g'],['Sel fin','10 g'],['Œuf entier','300 g'],['Sucre','50 g'],['Beurre','250 g']],prep:'1h',cook:'25 à 35 min',steps:['Mélanger la levure avec de l\'eau ou du lait tiède.','Verser dans la cuve du batteur avec la farine, le sel, le sucre et les œufs.','Pétrir jusqu\'à obtenir une pâte lisse, incorporer le beurre progressivement.','Laisser pousser, façonner, laisser lever une seconde fois puis cuire.']},'Pâte à savarin': {title:'Pâte à savarin',ratios:[['Farine','250 g'],['Sel','3 g'],['Levure','12 g'],['Œuf entier','150 g'],['Beurre','90 g'],['Sucre','25 g'],['Lait','0,075 l']],prep:'1h',cook:'25 à 35 min',steps:['Verser un peu de lait tiède sur la levure, mélanger.','Ajouter le sel, la levure diluée et le reste du lait à la farine.','Pétrir en incorporant les œufs et le beurre.','Laisser pousser, mouler, cuire au four.']},'Pâte à crêpes': {title:'Pâte à crêpes',ratios:[['Farine','500 g'],['Lait','1,00 l'],['Sel fin','2 g'],['Œuf entier','300 g'],['Beurre fondu','100 g']],prep:'45 min',cook:'2 à 3 min',steps:['Mettre la farine en fontaine, ajouter le sel.','Ajouter les œufs entiers et le lait progressivement.','Mélanger jusqu\'à l\'obtention d\'une pâte lisse.','Ajouter le beurre fondu, laisser reposer avant cuisson.']},'Pâte à cake': {title:'Pâte à cake',ratios:[['Beurre','250 g'],['Sucre','250 g'],['Œuf entier','250 g'],['Farine','375 g'],['Poudre à lever','7.5 g'],['Fruits confits','150 g'],['Rhum','0,035 l']],prep:'1h',cook:'30 à 45 min',steps:['Tamiser la farine et la poudre à lever.','Mettre le beurre en pommade au batteur.','Ajouter le sucre puis les œufs progressivement.','Incorporer le mélange farine/levure puis les fruits confits macérés au rhum.']},'Pâte à frire': {title:'Pâte à frire',ratios:[['Jaune d\'œuf','40 g'],['Blanc d\'œuf','90 g'],['Bière','0,20 l'],['Lait','0,05 l'],['Huile','0,04 l'],['Farine','200 g'],['Sucre semoule','20 g'],['Sel fin','1 g']],prep:'45 min',cook:'2 à 5 min',steps:['Clarifier les œufs, réserver les blancs.','Mélanger farine, sel, sucre, jaunes, bière, lait et huile.','Laisser reposer la pâte.','Incorporer les blancs montés en neige juste avant utilisation.']},'Pâte à tuiles aux amandes': {title:'Pâte à tuiles aux amandes',ratios:[['Sucre glace','250 g'],['Amandes hachées','150 g'],['Amandes en poudre','100 g'],['Farine tamisée','50 g'],['Zeste de citron','1 pièce'],['Œuf entier','50 g'],['Blanc d\'œuf','125 g'],['Beurre fondu','50 g']],prep:'30 min',cook:'2 à 5 min',steps:['Mélanger le sucre glace, la farine et le zeste de citron.','Ajouter les amandes hachées et en poudre.','Incorporer progressivement œufs et blancs.','Ajouter le beurre fondu, étaler finement et cuire rapidement à four chaud.']},'Meringue suisse': {title:'Meringue suisse',ratios:[['Blanc d\'œuf','250 g'],['Sucre','500 g']],prep:'45 min',cook:'2 à 5 h',steps:['Déposer les blancs d\'œufs et le sucre dans la cuve, sur bain-marie.','Fouetter la préparation sur le bain-marie.','Sortir la cuve du bain-marie à 63°C.','Fouetter hors du feu jusqu\'à complet refroidissement et fermeté.']},'Biscuit dacquoise': {title:'Biscuit dacquoise',ratios:[['Blanc d\'œuf','300 g'],['Sucre','100 g'],['Poudre d\'amandes','250 g'],['Sucre glace','250 g']],prep:'30 min',cook:'20 à 30 min',steps:['Mélanger le sucre glace et la poudre d\'amandes tamisés.','Serrer les blancs d\'œufs montés avec le sucre semoule.','Incorporer délicatement le tant pour tant.','Dresser sur papier saupoudré de sucre glace, cuire à four chaud.']},'Crème anglaise cuite sous-vide': {title:'Crème anglaise cuite sous-vide',ratios:[['Lait entier','1,00 l'],['Jaune d\'œuf','200 g'],['Sucre','150 g'],['Vanille','1 gousse']],prep:'30 min',cook:'40 min à 83°C',steps:['Clarifier les jaunes, ajouter la vanille et le sucre.','Ajouter le lait froid, mélanger.','Passer au chinois, remplir les poches sous-vide.','Cuire au bain-marie thermostaté 40 minutes à 83°C.']},'Crème anglaise sous-vide au bain-marie': {title:'Crème anglaise sous-vide au bain-marie',ratios:[['Lait entier','1,00 l'],['Jaune d\'œuf','200 g'],['Sucre','150 g'],['Vanille','1 gousse']],prep:'30 min',cook:'40 min à 83°C',steps:['Mettre en route le bain-marie thermostaté, régler à 84°C.','Clarifier les jaunes, ajouter le sucre et la vanille.','Ajouter le lait, mélanger, remplir les sacs sous-vide.','Cuire au bain-marie 40 minutes à 83°C.']},'Crème anglaise au wok': {title:'Crème anglaise au wok',ratios:[['Lait entier','1,00 l'],['Jaune d\'œuf','160 g'],['Sucre','250 g'],['Vanille','1 gousse']],prep:'30 min',cook:'83-84°C max',steps:['Déposer un tiers du sucre dans le wok.','Blanchir les jaunes avec le reste du sucre au fouet.','Verser le lait bouillant sur l\'appareil blanchi.','Cuire au wok en remuant sans dépasser 84°C.']},'Crème pâtissière traditionnelle': {title:'Crème pâtissière traditionnelle',ratios:[['Lait','1,00 l'],['Jaune d\'œuf','120 g'],['Sucre','250 g'],['Farine','100 g'],['Vanille','1 gousse']],prep:'45 min',cook:'4 à 8 min',steps:['Ajouter un tiers du sucre dans le lait avec la vanille, porter à ébullition.','Mélanger le reste du sucre avec les jaunes d\'œufs, ajouter la farine.','Verser le lait bouillant sur ce mélange.','Cuire 4 à 8 minutes en fouettant jusqu\'à épaississement.']},'Crème frangipane': {title:'Crème frangipane',ratios:[['Lait (crème pâtissière)','0,50 l'],['Jaune d\'œuf','80 g'],['Sucre','125 g'],['Farine ou Maïzena','55 g'],['Vanille','1/2 gousse'],['Poudre d\'amandes','100 g']],prep:'30 min',cook:'15 à 20 min',steps:['Réaliser une crème pâtissière classique.','Fouetter le mélange jusqu\'à obtenir une texture lisse.','Incorporer la poudre d\'amandes à la crème pâtissière encore tiède.','Utiliser rapidement, la frangipane se conserve peu.']},'Autres dérivés de la crème pâtissière': {title:'Autres dérivés de la crème pâtissière',ratios:[['Crème diplomate — Œuf entier','100 g'],['Crème diplomate — Jaune d\'œuf','40 g'],['Crème diplomate — Sucre semoule','400 g'],['Crème Chiboust — Jaune d\'œuf','100 g'],['Crème Chiboust — Sucre','25 g'],['Crème Chiboust — Poudre à crème','45 g']],prep:'—',cook:'—',steps:['Crème diplomate : crème pâtissière allégée à la gélatine et à la crème fouettée.','Crème Chiboust : crème pâtissière collée, allégée avec une meringue italienne — utilisée notamment dans le Saint-Honoré.','Chacune se prépare à partir d\'une base de crème pâtissière classique, déclinée selon l\'usage souhaité.']},'Crème prise sucrée': {title:'Crème prise sucrée',ratios:[['Lait','1,00 l'],['Œuf entier','300 g'],['Sucre','200 g'],['Vanille','1 gousse']],prep:'30 min',cook:'25 à 45 min',steps:['Casser et fouetter les œufs.','Blanchir l\'appareil avec le sucre.','Ajouter le lait en fouettant la préparation.','Verser dans les moules, cuire au bain-marie à four doux.']},'Crème Chantilly': {title:'Crème Chantilly',ratios:[['Crème fraîche','0,50 l'],['Sucre semoule','50 g'],['Vanille','1 gousse']],prep:'15 min',cook:'—',steps:['Verser la crème bien froide dans la cuve froide.','Ajouter le sucre et la vanille.','Monter au batteur.','Serrer le mélange au fouet jusqu\'à la consistance désirée.']},'Crème d\'amandes': {title:'Crème d\'amandes',ratios:[['Beurre','100 g'],['Sucre semoule','100 g'],['Œuf entier','100 g'],['Poudre d\'amandes','100 g'],['Rhum','0,05 l'],['Vanille','1/2 gousse']],prep:'45 min',cook:'20 à 30 min',steps:['Mettre le beurre en pommade.','Ajouter le sucre, fouetter.','Incorporer les œufs progressivement puis la poudre d\'amandes.','Parfumer au rhum et à la vanille.']},'Crème citron': {title:'Crème citron',ratios:[['Jaune d\'œuf','100 g'],['Beurre','100 g'],['Sucre','200 g'],['Maïzena','40 g'],['Eau','0,35 l'],['Citron','400 g'],['Liqueur de citron','0,002 l']],prep:'1h',cook:'25 à 35 min',steps:['Blanchir les jaunes avec le sucre.','Ajouter la Maïzena à la préparation blanchie.','Ajouter le jus de citron, la liqueur et l\'eau.','Cuire en remuant jusqu\'à épaississement, incorporer le beurre hors du feu.']},'Crémeux': {title:'Crémeux',ratios:[['Crémeux mangue-passion — Purée de mangue','300 g'],['Crémeux mangue-passion — Purée fruit de la passion','100 g'],['Crémeux mangue-passion — Crème','50 g'],['Crémeux pistache — Gélatine (feuilles)','2.5 g'],['Crémeux pistache — Sucre','40 g'],['Crémeux pistache — Jaune d\'œuf','60 g']],prep:'—',cook:'—',steps:['Deux déclinaisons possibles : mangue-passion (base purée de fruits + crème) ou pistache (base anglaise collée à la gélatine).','Chauffer la base, ajouter la gélatine ramollie.','Mixer pour lisser, couler en insert ou en cercle.','Réserver au froid ou surgeler selon l\'usage prévu.']},'Mousses aux fruits': {title:'Mousses aux fruits',ratios:[['Purée de fruits sucrée à 10%','1000 g (référence)'],['Blanc d\'œuf (meringue italienne)','qs'],['Sucre (cuit à 121°C)','qs'],['Gélatine (feuilles)','qs']],prep:'—',cook:'cuisson du sucre à 121°C',steps:['Réaliser une meringue italienne : foisonner les blancs, verser le sucre cuit à 121°C, monter jusqu\'à refroidissement complet.','Préparer la masse gélatine (eau + gélatine), chauffer la purée de fruits à environ 20°C.','Ajouter la masse gélatine fondue à la purée.','Incorporer délicatement la meringue italienne à la purée gélifiée.']},'Ganache chocolat départ à chaud': {title:'Ganache chocolat départ à chaud',ratios:[['Chocolat noir','250 g'],['Crème','200 g']],prep:'1h',cook:'15 à 20 min',steps:['Concasser le chocolat, le mettre au bain-marie.','Laisser fondre le chocolat.','Débarrasser dans une calotte, ajouter la crème froide.','Fouetter la préparation jusqu\'à refroidissement.']},'Gelées et confits': {title:'Gelées et confits',ratios:[['Gelée mangue — Pulpe de mangue','500 g'],['Gelée mangue — Gélatine (feuilles)','10 g'],['Gelée mangue — Citron','1 pièce'],['Gelée fraise basilic — Pulpe de fraise','500 g'],['Gelée fraise basilic — Basilic','1 botte'],['Gelée fraise basilic — Sucre','50 g']],prep:'30 min',cook:'—',steps:['Faire tremper la gélatine à l\'eau froide.','Tiédir légèrement la pulpe de fruit choisie, y dissoudre la gélatine essorée.','Ajouter les arômes (citron, basilic infusé...) selon la version.','Couler en cadre ou en insert, réserver au froid pour la prise.']},'Pastillage': {title:'Pastillage',ratios:[['Sucre glace','500 g'],['Eau','0,05 l'],['Jus de citron ou vinaigre blanc','0,04 l'],['Fécule','40 g'],['Gélatine (feuilles)','10 g']],prep:'1h',cook:'—',steps:['Tamiser le sucre glace, le mélanger avec la fécule dans la cuve du batteur.','Faire tremper la gélatine, la faire fondre avec l\'eau et le jus de citron.','Verser sur le mélange sucre glace/fécule.','Pétrir jusqu\'à obtenir une pâte lisse et non collante, utiliser rapidement (sèche vite à l\'air libre).']},'Glace royale': {title:'Glace royale',ratios:[['Sucre glace','500 g'],['Blanc d\'œuf','80 g'],['Jus de citron ou vinaigre','0,001 l']],prep:'30 min',cook:'séchage 20 à 30 min',steps:['Tamiser le sucre glace.','Ajouter les blancs d\'œufs.','Mélanger délicatement au fouet jusqu\'à homogénéiser.','Utiliser aussitôt en cornet ou à la spatule, sécher à l\'air libre.']},'Glaçage brillant chocolat': {title:'Glaçage brillant chocolat',ratios:[['Gélatine (feuilles)','18 g'],['Crème','0,32 l'],['Eau','0,07 l'],['Sucre','480 g'],['Cacao','160 g']],prep:'45 min',cook:'15 à 20 min',steps:['Faire tremper la gélatine à l\'eau froide.','Verser la crème dans une russe, ajouter l\'eau, le sucre et le cacao.','Porter à ébullition en remuant.','Ajouter la gélatine essorée hors du feu, mixer, utiliser tiède (autour de 35°C).']},'Nougatine': {title:'Nougatine',ratios:[['Sucre','500 g'],['Eau','0,17 l'],['Glucose','100 g'],['Amandes hachées','400 g'],['Jus de citron','1/2 pièce']],prep:'1h',cook:'10 à 15 min',steps:['Porter le sucre, l\'eau et le glucose à ébullition.','Cuire au caramel blond.','Ajouter les amandes hachées, préalablement passées au four chaud.','Étaler immédiatement entre deux feuilles ou sur marbre huilé, détailler avant complet refroidissement.']}});
Object.assign(READY_PREPS, {'Pâtes émiettées, sucrées et aromatisées': {title:'Pâtes émiettées, sucrées et aromatisées',ratios:[['Farine','250 g'],['Beurre','125 g'],['Sucre','100 g'],['Arôme au choix','PM']],prep:'20 min',cook:'—',steps:['Sabler farine et beurre du bout des doigts, sans chercher à lier.','Ajouter le sucre et l\'arôme choisi.','Émietter grossièrement sur plaque.','Cuire à sec, utiliser en croûtage ou en croustillant.']},'Meringue italienne': {title:'Meringue italienne',ratios:[['Blanc d\'œuf','250 g'],['Sucre','500 g'],['Eau','0,05 l']],prep:'45 min',cook:'sucre cuit à 118-121°C',steps:['Monter les blancs en neige.','Cuire le sucre et l\'eau au gros boulé (118-121°C).','Verser le sucre cuit en filet sur les blancs montés, sans cesser de fouetter.','Continuer à monter jusqu\'à complet refroidissement.']},'Crème mousseline': {title:'Crème mousseline',ratios:[['Crème pâtissière','225 g'],['Crème au beurre (ou beurre pommade)','300 g']],prep:'30 min',cook:'—',steps:['Réaliser une crème pâtissière classique, la tamiser pour la lisser.','Réaliser une crème au beurre ou ramollir du beurre en pommade.','Mélanger les deux à même température, émulsionner au fouet.','Corner et utiliser aussitôt à la poche.']},'Crèmes bavaroises': {title:'Crèmes bavaroises',ratios:[['Lait','1,00 l'],['Jaune d\'œuf','160 g'],['Sucre semoule','250 g'],['Vanille','1 gousse'],['Gélatine (feuilles)','12 g'],['Crème fouettée','qs']],prep:'—',cook:'cuisson à la nappe 83-84°C',steps:['Réaliser une crème anglaise, cuire à la nappe (83-84°C).','Ajouter la gélatine ramollie et essorée hors du feu.','Laisser refroidir jusqu\'à ce que le mélange commence à prendre.','Incorporer délicatement la crème fouettée, couler en moule ou en cercle.']},'Mousses au chocolat': {title:'Mousses au chocolat',ratios:[['Crème','0,25 l'],['Blanc d\'œuf','180 g'],['Chocolat noir','250 g'],['Sucre','50 g']],prep:'1h',cook:'—',steps:['Faire fondre le chocolat au bain-marie à 50°C maximum.','Monter la crème fouettée.','Monter les blancs en neige, les sucrer légèrement en fin de montage.','Homogénéiser le chocolat, incorporer la crème puis les blancs délicatement.']},'Sauces et coulis': {title:'Sauces et coulis',ratios:[['Sauce chocolat — Chocolat de couverture noir','130 g'],['Sauce chocolat — Eau','0,25 l'],['Sauce chocolat — Sucre semoule','90 g'],['Sauce chocolat — Crème épaisse','125 g'],['Cœur caramel — Sucre','250 g'],['Cœur caramel — Crème','500 g'],['Cœur caramel — Couverture au lait','150 g']],prep:'30 min',cook:'5 à 15 min',steps:['Sauce chocolat : porter eau et sucre à ébullition, ajouter le chocolat puis la crème, cuire 5 à 8 minutes en lissant.','Cœur caramel : cuire le sucre à sec au caramel, décuire à la crème chaude, ajouter la couverture au lait, lisser.','Passer au chinois pour une texture parfaitement lisse.','Utiliser tiède ou froid selon l\'usage (nappage, cœur coulant, accompagnement).']},'Glaçage miroir': {title:'Glaçage miroir',ratios:[['Eau','75 g'],['Sirop de glucose','150 g'],['Sucre semoule','150 g'],['Gélatine (feuilles)','qs'],['Chocolat ou colorant selon variante','qs']],prep:'45 min',cook:'15 à 20 min',steps:['Porter l\'eau, le glucose et le sucre à ébullition.','Ajouter la gélatine ramollie et essorée hors du feu.','Mixer pour lisser et éliminer les bulles.','Utiliser tiède, autour de 30-35°C, sur un entremets bien surgelé.']},'Autres glaçages': {title:'Autres glaçages',ratios:[['Glaçage gianduja — Gianduja noisette-lait','200 g'],['Glaçage gianduja — Chocolat de couverture noir','88 g'],['Glaçage gianduja — Crème UHT','200 g'],['Glaçage gianduja — Sirop','48 g']],prep:'45 min',cook:'15 à 20 min',steps:['Porter la crème et le sirop à ébullition.','Verser sur le gianduja et le chocolat concassés.','Mixer jusqu\'à obtenir un appareil lisse et brillant.','Utiliser tiède sur entremets surgelé, comme pour un glaçage miroir classique.']},'Flocages': {title:'Flocages',ratios:[['Chocolat de couverture (blanc, lait ou noir)','500 g'],['Beurre de cacao','500 g']],prep:'30 min',cook:'fonte à 45°C, pulvérisation à 60°C env.',steps:['Faire fondre à parts égales chocolat de couverture et beurre de cacao, à environ 45°C.','Mixer pour bien homogénéiser le mélange.','Chauffer légèrement le mélange et le pistolet à pulvériser (environ 60°C).','Pulvériser en fine couche sur l\'entremets bien surgelé pour obtenir un effet velours mat.']}});


const ALL_RECIPES = [].concat(CHOUX_RECIPES, FEUILLETEE_RECIPES, MERINGUE_RECIPES, CREPES_RECIPES, FRIRE_RECIPES, POUSSEE_RECIPES, SOUFFLE_RECIPES, MOUSSE_RECIPES, CREME_RECIPES, PETITS_FOURS_RECIPES, LEVEE_RECIPES, BISCUIT_RECIPES, SECHE_RECIPES, GLACES_RECIPES, SALEES_RECIPES, CONFISERIE_RECIPES);


gridPrepa.innerHTML = PREPARATIONS.slice().sort((a,b) => {
  const ra = !!READY_PREPS[a], rb = !!READY_PREPS[b];
  return (ra?0:1) - (rb?0:1);
}).map(name => {
  const ready = !!READY_PREPS[name];
  const p = READY_PREPS[name];
  return `<div class="card ${ready?'':'disabled'}" ${ready?`onclick="openPrepFiche('${name.replace(/'/g,"\\'")}')"`:''}>
    ${(ready && p.img) || PREP_IMAGES[name] ? `<img src="${(ready && p.img) || PREP_IMAGES[name]}" alt="${name}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:8px;" loading="lazy" decoding="async" onerror="this.style.display=\'none\'">` : ''}
    <h4>${T(name)}</h4>
    <span class="tag ${ready?'ready':''}">${ready?L('prêt','جاهز'):L('à venir','قريبًا')}</span>
  </div>`;
}).join('');

function openPrepFiche(name){
  const p = READY_PREPS[name];
  if(!p) return;
  dlPush('fiche_ouverte', { type:'preparation', fiche: name, langue: currentLang });
  const rowsHtml = p.ratios.map(r => `<tr><td>${T(r[0])}</td><td class="qty">${T(r[1])}</td></tr>`).join('');
  const stepsHtml = p.steps.map(s => `<li>${T(s)}</li>`).join('');
  document.getElementById('ficheCard').innerHTML = `
    <div class="fiche-top">
      <div><h3>${T(p.title)}</h3></div>
      <button class="fiche-close-btn" onclick="closeFiche()">${L('Fermer','إغلاق')} &#10005;</button>
    </div>
    <div class="fiche-grid">
      <div><table><tr><th>${L('Ingrédient','المكوّن')}</th><th class="qty">${L('Quantité','الكمية')}</th></tr>${rowsHtml}</table>
        <div class="fiche-meta"><span><b>${L('Prépa','التحضير')} :</b> ${T(p.prep)}</span><span><b>${L('Cuisson','الطهي')} :</b> ${T(p.cook)}</span></div>
      </div>
      <div><ol>${stepsHtml}</ol></div>
    </div>`;
  document.getElementById('ficheOverlay').classList.add('open');
}
function closeFiche(silencieux){
  document.getElementById('ficheOverlay').classList.remove('open');
  if(!silencieux && /^#(recette|marocain)=/.test(location.hash)) history.pushState({}, '', location.pathname + location.search);
}

// ---------- Fiche informative générique (Le métier / Matériel) ----------
function openInfoFiche(id, source){
  const item = source.find(x => x.id === id);
  if(!item) return;
  dlPush('fiche_ouverte', { type:'info', fiche: item.title || item.name || id, langue: currentLang });
  const bodyHtml = item.body.map(p => `<p style="margin:0 0 12px; line-height:1.6; font-size:0.9rem;">${T(p)}</p>`).join('');
  const imgHtml = '';
  document.getElementById('ficheCard').innerHTML = `
    <div class="fiche-top">
      <div><h3>${T(item.title)}</h3><p>${T(item.short)}</p></div>
      <button class="fiche-close-btn" onclick="closeFiche()">${L('Fermer','إغلاق')} &#10005;</button>
    </div>
    ${imgHtml}
    <div>${bodyHtml}</div>`;
  document.getElementById('ficheOverlay').classList.add('open');
}

const gridAssiette = document.getElementById('gridAssiette');

gridAssiette.innerHTML = ASSIETTE.map((a,i) => `
  <div class="card" onclick="openAssietteFiche(${i})">
    ${ASSIETTE_IMAGES[a.name] ? `<img src="${ASSIETTE_IMAGES[a.name]}" alt="${a.name}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:8px;" loading="lazy" decoding="async" onerror="this.style.display=\'none\'">` : ''}
    <h4>${a.name}</h4>
    <span class="tag ready">prêt</span>
  </div>
`).join('');
function openAssietteFiche(i){
  const a = ASSIETTE[i];
  if(a) dlPush('fiche_ouverte', { type:'assiette', fiche: a.name || a.title || ('#'+i), langue: currentLang });
  document.getElementById('ficheCard').innerHTML = `
    <div class="fiche-top">
      <div><h3>${a.name}</h3><p>${a.desc}</p></div>
      <button class="fiche-close-btn" onclick="closeFiche()">Fermer &#10005;</button>
    </div>
    <div class="fam-title" style="margin-top:6px;">Composants principaux</div>
    <ul style="margin:8px 0 0; padding-left:18px; font-size:0.86rem; line-height:1.7;">
      ${a.composants.map(c => `<li>${c}</li>`).join('')}
    </ul>`;
  document.getElementById('ficheOverlay').classList.add('open');
}

function thumbHtml(img, title){
  return img ? `<img src="${img}" alt="${title || ''}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:8px;" loading="lazy" decoding="async" onerror="this.style.display=\'none\'">` : '';
}

const gridMetier = document.getElementById('gridMetier');
gridMetier.innerHTML = METIER_ITEMS.map(i => `
  <div class="card" onclick="openInfoFiche('${i.id}', METIER_ITEMS)">
    ${thumbHtml(i.img, i.title)}
    <h4>${T(i.title)}</h4>
    <span class="tag ready">${L('prêt','جاهز')}</span>
  </div>
`).join('');

const gridMateriel = document.getElementById('gridMateriel');
gridMateriel.innerHTML = MATERIEL_ITEMS.map(i => `
  <div class="card" onclick="openInfoFiche('${i.id}', MATERIEL_ITEMS)">
    ${thumbHtml(i.img, i.title)}
    <h4>${T(i.title)}</h4>
    <span class="tag ready">${L('prêt','جاهز')}</span>
  </div>
`).join('');

const gridIngredients = document.getElementById('gridIngredients');
gridIngredients.innerHTML = INGREDIENTS.map(i => {
  const ready = !i.short.includes('venir') && !i.short.includes('compléter') && i.short !== 'À venir';
  return `<div class="card ${ready?'':'disabled'}" ${ready?`onclick="openInfoFiche('${i.id}', INGREDIENTS)"`:''}>
    ${thumbHtml(i.img, i.title)}
    <h4>${T(i.title)}</h4>
    <span class="tag ${ready?'ready':''}">${ready?L('prêt','جاهز'):L('à venir','قريبًا')}</span>
  </div>`;
}).join('');

const vocabTable = document.getElementById('vocabTable');
const vocabSorted = [...VOCAB].sort((a,b) => a.term.localeCompare(b.term, 'fr'));
vocabTable.innerHTML = `<table class="vocab-table">
  <thead><tr><th>${L('Terme','المصطلح')}</th><th>${L('Définition','التعريف')}</th></tr></thead>
  <tbody>
  ${vocabSorted.map(v => `<tr><td>${T(v.term)}</td><td>${T(v.def)}</td></tr>`).join('')}
  </tbody>
</table>`;

// ---------- Render Recettes (fiches de fabrication) by family ----------


function openRecipeFiche(id, silencieux){
  const r = ALL_RECIPES.find(x => x.id === id);
  if(!r) return;
  dlPush('fiche_ouverte', { type:'recette', fiche: r.name, langue: currentLang });
  if(!silencieux) history.pushState({fiche:'recette', id:id}, '', '#recette=' + encodeURIComponent(id));
  let tablesHtml = '';
  r.tables.forEach(t => {
    tablesHtml += `<table><tr><th>${T(t.label)}</th><th class="qty">${L('Qté','الكمية')}</th></tr>${t.rows.map(row=>`<tr><td>${T(row[0])}</td><td class="qty">${T(row[1])}</td></tr>`).join('')}</table>`;
  });
  const stepsHtml = r.steps.map(s => `<li>${T(s)}</li>`).join('');
  document.getElementById('ficheCard').innerHTML = `
    <div class="fiche-top">
      <div><h3>${T(r.name)}</h3><p>${T(r.desc)}</p></div>
      <button class="fiche-close-btn" onclick="closeFiche()">${L('Fermer','إغلاق')} &#10005;</button>
    </div>
    ${encartSciencePro(r)}
    ${encartProduitPro(r)}
    <div class="fiche-grid">
      <div>${tablesHtml}
        <div class="fiche-meta"><span><b>${L('Prépa','التحضير')} :</b> ${T(r.meta.prepa)}</span><span><b>${L('Cuisson','الطهي')} :</b> ${T(r.meta.cuisson)}</span><span><b>${L('Pour','لـ')} :</b> ${T(r.meta.pour)}</span>${nutritionHTML(r)}</div>
      </div>
      <div><ol>${stepsHtml}</ol></div>
    </div>
    ${partageBoutonHTML('recette', id, T(r.name))}
    ${encartCataloguePro(r)}`;
  document.getElementById('ficheOverlay').classList.add('open');
}

// ---------- Pâtisserie marocaine ----------


MAROC_RECIPES.unshift(CHEBAKIA_SOLO);
MAROC_RECIPES.push({id:'tcharek',name:'Tcharek',desc:'Petits croissants de pâte sablée fourrés de pâte d\'amande, badigeonnés au jaune d\'œuf ou trempés dans un sirop et roulés dans le sucre glace selon la version.',tables:[{label:'Pâte',rows:[['Farine','250 g'],['Beurre ramolli','125 g'],['Sucre en poudre','1 c. à soupe'],['Levure chimique','1/2 c. à café'],['Sel','1 pincée'],['Jaune d\'œuf','1'],['Eau de fleur d\'oranger','qs']]},{label:'Farce amande',rows:[['Amandes émondées moulues','1,5 mesure'],['Sucre en poudre','0,5 mesure'],['Beurre fondu','50 g'],['Cannelle','1/2 c. à café'],['Zeste et jus de citron','1/2'],['Eau de fleur d\'oranger','qs']]},{label:'Finition',rows:[['Jaune d\'œuf (dorure) ou sirop','qs'],['Amandes concassées ou sucre glace','qs']]}],meta:{prepa:'1h + repos 30 min',cuisson:'four modéré ~150°C',pour:'20 à 25 pièces'},steps:['Mélanger la farine, le sel et le sucre, sabler avec le beurre ramolli.','Ajouter le jaune d\'œuf et l\'eau de fleur d\'oranger, pétrir jusqu\'à obtenir une pâte homogène, laisser reposer 30 minutes.','Mélanger les amandes moulues, le sucre, le beurre fondu, la cannelle, le zeste et la fleur d\'oranger pour la farce.','Façonner la farce en petits boudins, abaisser la pâte et détailler des rectangles ou triangles.','Déposer un boudin de farce, enrouler pour former un croissant, souder le bord au pouce.','Disposer sur plaque beurrée, badigeonner de jaune d\'œuf et parsemer d\'amandes concassées (ou tremper dans un sirop tiède et rouler dans le sucre glace une fois cuit).','Cuire à four modéré jusqu\'à coloration blonde, laisser bien refroidir avant de déplacer.']});
MAROC_RECIPES.push({id:'msemen-sucre',name:'Msemen sucré',desc:'Galette marocaine feuilletée, pliée en carré, servie chaude nappée de miel et de beurre fondu.',tables:[{label:'Pâte',rows:[['Farine','500 g'],['Semoule fine','150-300 g'],['Sel','1 pincée'],['Sucre (facultatif)','1 c. à soupe'],['Eau tiède','qs']]},{label:'Feuilletage et finition',rows:[['Beurre fondu + huile','qs, à parts égales'],['Semoule fine (façonnage)','qs'],['Miel','pour servir'],['Beurre fondu','pour servir']]}],meta:{prepa:'45 min + repos 20-30 min',cuisson:'4-5 min par face',pour:'8 à 10 pièces'},steps:['Mélanger la farine, la semoule, le sel et le sucre, ajouter l\'eau tiède progressivement en pétrissant 10 minutes jusqu\'à une pâte souple et élastique.','Former une boule, couvrir et laisser reposer environ 30 minutes.','Diviser en boules égales, huiler légèrement les mains et aplatir chaque boule en fine galette sur un plan huilé.','Badigeonner de beurre fondu et huile, saupoudrer de semoule, replier les bords vers le centre pour former un carré (comme une enveloppe).','Cuire à la poêle chaude 4 à 5 minutes de chaque côté jusqu\'à coloration dorée.','Servir chaud, nappé de miel et de beurre fondu.']});

MAROC_RECIPES.push({id:'harcha',name:'Harcha sucrée',desc:'Galette marocaine de semoule sablée, croustillante à l\'extérieur et moelleuse à l\'intérieur — se prépare sans pétrissage, cuite à la poêle sans matière grasse.',tables:[{label:'Pâte',rows:[['Semoule fine','250 g (+ 50 g pour l\'enrobage)'],['Beurre fondu','50-100 g'],['Lait','90-150 ml'],['Sucre','1-2 c. à soupe'],['Levure chimique','1 sachet'],['Sel','1/2 c. à café']]}],meta:{prepa:'10 min + repos 5-20 min',cuisson:'4 min par face',pour:'6 à 8 mini-galettes'},steps:['Mélanger la semoule, le sucre, le sel et la levure chimique.','Ajouter le beurre fondu et sabler du bout des doigts jusqu\'à obtenir une texture de sable mouillé.','Ajouter le lait progressivement, mélanger sans pétrir, laisser reposer 5 à 20 minutes pour que la semoule absorbe le liquide.','Former des boules, les rouler dans la semoule fine réservée, aplatir légèrement à la main ou à l\'emporte-pièce.','Cuire à la poêle chaude sans matière grasse, environ 4 minutes de chaque côté jusqu\'à coloration dorée.','Servir chaud avec du beurre et du miel.']});

MAROC_RECIPES.push({id:'baghrir',name:'Baghrir farci',desc:'Crêpes marocaines « aux mille trous » — semoule et farine, texture aérienne et alvéolée caractéristique, cuites d\'un seul côté.',tables:[{label:'Pâte',rows:[['Semoule fine','250 g'],['Farine','120 g'],['Eau tiède','450 ml'],['Levure boulangère','7-14 g selon type'],['Levure chimique','1 sachet'],['Sel','1/2 c. à café'],['Sucre','1 c. à soupe']]}],meta:{prepa:'15 min + repos 25-30 min',cuisson:'quelques min par crêpe, un seul côté',pour:'environ 15-20 crêpes'},steps:['Mélanger la semoule, la farine, le sel et le sucre.','Ajouter l\'eau tiède progressivement et la levure boulangère diluée, mixer 3 à 5 minutes jusqu\'à formation de bulles.','Ajouter la levure chimique, mixer encore une minute jusqu\'à obtenir un mélange homogène et fluide.','Couvrir et laisser reposer 25 à 30 minutes.','Verser une louche de pâte dans une poêle chaude non graissée, laisser cuire sans retourner jusqu\'à ce que toute la surface soit couverte de petits trous.','Servir tiède avec du beurre fondu et du miel.']});
MAROC_RECIPES.push({id:'msemen',name:'Msemen',desc:'Galette marocaine feuilletée, pliée en carré, croustillante à l\'extérieur et fondante à l\'intérieur — se déguste au miel ou nature.',tables:[{label:'Pâte',rows:[['Farine','500 g'],['Semoule fine','150-300 g'],['Eau tiède','500 ml'],['Sel','1 c. à café'],['Beurre fondu + huile (feuilletage)','qs, à parts égales']]}],meta:{prepa:'45 min + repos 20-30 min',cuisson:'2-3 min par face',pour:'8 à 10 pièces'},steps:['Mélanger la farine, la semoule et le sel, ajouter l\'eau tiède progressivement.','Pétrir environ 10 minutes jusqu\'à obtenir une pâte souple, lisse et non collante.','Diviser en boules égales, badigeonner d\'huile, laisser reposer 20 à 30 minutes.','Étaler chaque boule très finement à la main sur un plan huilé, badigeonner du mélange beurre-huile et saupoudrer de semoule.','Plier la pâte en carré en superposant les couches, en huilant et saupoudrant de semoule à chaque pli.','Cuire à la poêle chaude légèrement huilée, 2 à 3 minutes de chaque côté jusqu\'à coloration dorée.']});
MAROC_RECIPES.push({id:'fekkas',name:'Fekkas',desc:'Biscuit marocain croquant cuit deux fois (comme un biscotti), parfumé à la fleur d\'oranger, à l\'anis et au sésame, garni d\'amandes et de raisins secs.',tables:[{label:'Pâte',rows:[['Farine','500 g'],['Sucre','150 g'],['Huile végétale','120 ml'],['Œufs','3'],['Levure chimique','8 g'],['Amandes concassées','100 g'],['Raisins secs','80 g'],['Graines d\'anis','1 c. à café'],['Graines de sésame','1 c. à café'],['Fleur d\'oranger','2 c. à soupe'],['Sel','1 pincée']]}],meta:{prepa:'20 min',cuisson:'20 min + 10-12 min (deuxième cuisson)',pour:'environ 1000 g de biscuits'},steps:['Mélanger les œufs, le sucre, l\'huile et la fleur d\'oranger.','Ajouter la farine, la levure chimique, le sel, l\'anis et le sésame.','Incorporer les amandes concassées et les raisins secs, former une pâte homogène.','Façonner des boudins d\'environ 3 cm d\'épaisseur, déposer sur plaque.','Cuire 20 minutes à 180°C, laisser tiédir 5 à 10 minutes.','Couper en tranches régulières encore tièdes, puis remettre au four 10 à 12 minutes pour sécher et obtenir un biscuit bien croquant.']});

MAROC_RECIPES.push({id:'makrout',name:'Makrout',desc:'Losanges de semoule fourrés à la pâte de dattes, frits puis trempés dans le miel parfumé à la fleur d\'oranger.',tables:[{label:'Pâte de semoule',rows:[['Semoule moyenne','1000 g'],['Beurre fondu','250 g'],['Sel','1 pincée'],['Sucre glace','4 c. à café'],['Eau tiède','qs']]},{label:'Farce',rows:[['Dattes moulues','450 g'],['Eau de fleur d\'oranger','2 c. à soupe'],['Cannelle','1 c. à café']]},{label:'Finition',rows:[['Miel','1000 g'],['Huile de friture','qs']]}],meta:{prepa:'1h + repos',cuisson:'friture 170-180°C · 4-6 min',pour:'40 pièces environ'},steps:['Mélanger la semoule, le beurre fondu, le sel et le sucre glace, sabler.','Ajouter l\'eau tiède progressivement, pétrir jusqu\'à obtenir une pâte ferme et non collante, laisser reposer.','Mélanger les dattes moulues avec la cannelle et la fleur d\'oranger.','Former un boudin de pâte de semoule, creuser une fente, garnir de pâte de dattes et refermer.','Marquer au tampon à makrout (ou aplatir à la main), découper en losanges.','Frire à 170-180°C, 4 à 6 minutes jusqu\'à coloration dorée.','Tremper immédiatement dans le miel tiède parfumé à la fleur d\'oranger, égoutter avant de servir.']});
MAROC_RECIPES.push({id:'briouates-miel',name:'Briouate au miel',desc:'Triangles de feuille de brick fourrés de pâte d\'amande, frits puis trempés dans le miel chaud.',tables:[{label:'Farce',rows:[['Amandes mondées (frites ou nature)','200-500 g'],['Sucre semoule','100-150 g'],['Beurre fondu','20 g'],['Cannelle','1 c. à café'],['Eau de fleur d\'oranger','2-3 c. à soupe']]},{label:'Montage',rows:[['Feuilles de brick','15-20 feuilles'],['Miel','300-500 g'],['Sésame doré (déco)','qs']]}],meta:{prepa:'1h',cuisson:'friture · quelques min',pour:'25 à 30 pièces'},steps:['Mixer les amandes avec le sucre jusqu\'à obtenir une poudre fine.','Ajouter le beurre fondu, la cannelle et la fleur d\'oranger, mélanger jusqu\'à texture de sable mouillé.','Façonner la farce en petits bâtonnets ou boules.','Couper les feuilles de brick en bandes, badigeonner de beurre fondu, déposer la farce à une extrémité.','Plier en triangle successif jusqu\'au bout de la bande, glisser le reste de feuille dans le dernier pli pour fermer.','Frire dans l\'huile chaude jusqu\'à coloration dorée des deux côtés.','Tremper immédiatement dans le miel chaud, égoutter, saupoudrer de sésame doré avant que le miel ne fige.']});

MAROC_RECIPES.push({id:'kaab-el-ghzal',name:'Kaab El Ghzal',desc:'« Cornes de gazelle » — pâte fine et croustillante enroulée autour d\'une farce de pâte d\'amande parfumée à la fleur d\'oranger, façonnée en croissant.',tables:[{label:'Pâte extérieure',rows:[['Farine','250 g'],['Beurre fondu','50 g'],['Sel','1 pincée'],['Œuf','1'],['Eau de fleur d\'oranger','1/2 verre'],['Eau','qs']]},{label:'Farce (pâte d\'amande)',rows:[['Amandes mondées moulues','250 g'],['Sucre glace ou semoule','250 g'],['Beurre fondu','qs'],['Cannelle','qs'],['Eau de fleur d\'oranger','qs']]}],meta:{prepa:'1h + repos 2h',cuisson:'180°C · 10-15 min',pour:'16 à 20 pièces'},steps:['Mélanger la farine, le sel, le beurre fondu et l\'œuf, ajouter l\'eau de fleur d\'oranger progressivement en pétrissant.','Pétrir jusqu\'à obtenir une pâte lisse et non collante, diviser en pâtons, filmer et laisser reposer au moins 2h.','Mélanger les amandes moulues, le sucre, le beurre fondu, la cannelle et la fleur d\'oranger pour la farce.','Façonner la farce en boudins fins, étaler la pâte très finement au rouleau (presque transparente).','Déposer un boudin de farce sur chaque abaisse, replier et souder les bords en forme de croissant, découper à la roulette dentelée.','Piquer chaque corne à l\'aiguille pour laisser échapper la vapeur, laisser sécher 12h avant cuisson.','Cuire à 180°C pendant 10 à 15 minutes — la corne doit rester pâle, à peine dorée.']});
MAROC_RECIPES.push({id:'mhancha',name:'M\'hancha',desc:'« Serpentin » de feuilles de pastilla (brick) enroulées autour d\'un boudin de pâte d\'amande, cuit au four puis arrosé de miel tiède.',tables:[{label:'Farce (pâte d\'amande)',rows:[['Poudre d\'amande','250 g'],['Sucre','125 g'],['Beurre mou','80 g'],['Cannelle','1 c. à café'],['Fleur d\'oranger','3 c. à café']]},{label:'Montage',rows:[['Feuilles de pastilla (brick)','4 feuilles'],['Jaune d\'œuf (dorure)','1'],['Miel','150 g']]}],meta:{prepa:'45 min',cuisson:'180°C · 10 min',pour:'1 grande spirale ou 4 boudins'},steps:['Mélanger la poudre d\'amande, le sucre, une partie du beurre, la cannelle et la fleur d\'oranger jusqu\'à obtenir une farce homogène.','Façonner la farce en boudins de la largeur d\'une feuille de pastilla.','Badigeonner chaque feuille de beurre fondu, déposer un boudin de farce et enrouler en tassant bien pour éviter les poches d\'air.','Badigeonner chaque boudin de jaune d\'œuf, disposer sur plaque (en spirale pour une grande pièce, ou droits pour des portions individuelles).','Cuire à 180°C environ 10 minutes jusqu\'à coloration dorée.','À la sortie du four, badigeonner de miel tiède et saupoudrer de poudre d\'amande.']});

MAROC_RECIPES.push(
{id:"kaab-el-ghzal-fenned",name:"Kaab El Ghzal M'Fenned",desc:"Cornes de gazelle roulées dans des amandes effilées après cuisson, pour une version croquante et généreuse.",tables:[{label:"Pâte extérieure",rows:[["Farine","500 g"],["Beurre fondu","60 g"],["Eau de fleur d'oranger","1/2 verre"],["Œuf","1"],["Sel","1 pincée"]]},{label:"Farce (pâte d'amande)",rows:[["Amandes mondées moulues","250 g"],["Sucre glace","125 g"],["Beurre fondu","60 g"],["Cannelle","1 c. à café"],["Eau de fleur d'oranger","2 c. à soupe"]]},{label:"Enrobage",rows:[["Amandes effilées grillées","200 g"],["Miel tiède","100 g"]]}],meta:{prepa:"1h + repos 2h",cuisson:"180°C · 10-15 min",pour:"16 à 20 pièces"},steps:["Mélanger la farine, le sel, le beurre fondu et l'œuf, ajouter l'eau de fleur d'oranger progressivement en pétrissant.","Pétrir jusqu'à obtenir une pâte lisse, diviser en pâtons, filmer et laisser reposer au moins 2h.","Façonner la farce en boudins fins, étaler la pâte très finement au rouleau.","Déposer un boudin de farce, replier et souder les bords en forme de croissant, découper à la roulette dentelée.","Piquer chaque corne à l'aiguille, laisser sécher 12h avant cuisson.","Cuire à 180°C pendant 10 à 15 minutes — la corne doit rester pâle.","À la sortie du four, badigeonner de miel tiède et rouler immédiatement dans les amandes effilées grillées."]},
{id:"griwech",name:"Griwech",desc:"Roses de pâte feuilletée frites puis trempées dans le miel chaud et roulées dans le sésame grillé. Pâtisserie phare du Ramadan.",tables:[{label:"Pâte",rows:[["Farine","800 g"],["Sésame grillé et moulu","150 g"],["Poudre d'amandes","60 g"],["Beurre fondu","100 g"],["Huile d'olive","60 g"],["Levure chimique","1 sachet"],["Cannelle moulue","1 c. à café"],["Fleur d'oranger","10 cl"],["Vinaigre","2 c. à soupe"],["Sel","1 pincée"],["Eau","qs"]]},{label:"Finition",rows:[["Miel","800 g"],["Huile de friture","qs"],["Sésame doré","pour décorer"]]}],meta:{prepa:"1h + repos",cuisson:"friture ~15 min",pour:"20 pièces environ"},steps:["Mélanger la farine, le sésame moulu, la poudre d'amandes, la cannelle, le sel et la levure.","Incorporer le beurre fondu et l'huile d'olive, puis la fleur d'oranger et le vinaigre.","Ajouter l'eau progressivement et pétrir jusqu'à obtenir une pâte compacte.","Laisser reposer au frais 1h, abaisser à 2-3 mm, découper des rectangles à la roulette crantée.","Inciser chaque rectangle de 4 à 5 fentes parallèles, en laissant les bords intacts.","Soulever et croiser les bandes pour former la rose caractéristique.","Frire en friture chaude jusqu'à coloration dorée, plonger dans le miel tiède, égoutter et saupoudrer de sésame."]},
{id:"rghayef-miel",name:"Rghayef au miel",desc:"Galette marocaine feuilletée superposée en plusieurs couches, dorée à la poêle et servie nappée de miel.",tables:[{label:"Pâte",rows:[["Farine","500 g"],["Semoule fine","50 g"],["Sel","5 g"],["Eau tiède","300 ml"],["Beurre fondu + huile","qs, pour le feuilletage"]]},{label:"Finition",rows:[["Miel","200 g"],["Beurre fondu","50 g"]]}],meta:{prepa:"45 min + repos 30 min",cuisson:"4-5 min par face",pour:"6 à 8 pièces"},steps:["Mélanger la farine, la semoule, le sel et l'eau tiède, pétrir 10 minutes jusqu'à une pâte souple.","Former des boules, huiler légèrement, laisser reposer 30 minutes.","Étirer chaque boule très finement à la main sur un plan huilé.","Badigeonner de beurre fondu et huile, plier en superposant plusieurs couches pour former un carré.","Cuire à la poêle chaude 4 à 5 minutes de chaque côté jusqu'à coloration dorée.","Servir chaud, nappé de miel tiède et de beurre fondu."]},
{id:"fekkas-miel",name:"Fekkas au miel",desc:"Biscuit marocain croquant cuit deux fois, parfumé au miel, à l'anis et aux amandes.",tables:[{label:"Pâte",rows:[["Farine","500 g"],["Miel","150 g"],["Huile végétale","100 ml"],["Œufs","2"],["Levure chimique","8 g"],["Amandes entières","150 g"],["Graines d'anis","2 c. à soupe"],["Fleur d'oranger","2 c. à soupe"]]}],meta:{prepa:"20 min",cuisson:"20 min + 10-12 min (2ème cuisson)",pour:"environ 800 g de biscuits"},steps:["Mélanger les œufs, le miel, l'huile et la fleur d'oranger.","Ajouter la farine, la levure chimique et l'anis.","Incorporer les amandes entières, former une pâte homogène.","Façonner des boudins d'environ 3 cm d'épaisseur, déposer sur plaque.","Cuire 20 minutes à 180°C, laisser tiédir 5 à 10 minutes.","Couper en tranches régulières encore tièdes, remettre au four 10 à 12 minutes pour sécher."]},
{id:"briouates-amandes",name:"Briouates aux amandes",desc:"Triangles de feuille de brick fourrés de pâte d'amande, frits puis trempés dans le miel chaud.",tables:[{label:"Farce",rows:[["Amandes mondées","300 g"],["Sucre semoule","100 g"],["Beurre fondu","20 g"],["Cannelle","1 c. à café"],["Fleur d'oranger","2 c. à soupe"]]},{label:"Montage",rows:[["Feuilles de brick","15 feuilles"],["Beurre fondu","100 g"],["Miel","300 g"],["Sésame doré","pour décorer"]]}],meta:{prepa:"1h",cuisson:"friture · quelques min",pour:"25 à 30 pièces"},steps:["Mixer les amandes avec le sucre jusqu'à obtenir une poudre fine.","Ajouter le beurre fondu, la cannelle et la fleur d'oranger, mélanger jusqu'à texture de sable mouillé.","Façonner la farce en petits bâtonnets.","Couper les feuilles de brick en bandes, badigeonner de beurre fondu, déposer la farce à une extrémité.","Plier en triangle successif, glisser le reste de la bande dans le dernier pli pour fermer.","Frire dans l'huile chaude jusqu'à coloration dorée des deux côtés.","Tremper immédiatement dans le miel chaud, égoutter, saupoudrer de sésame doré."]},
{id:"mhancha-amandes",name:"M'hancha aux amandes",desc:"« Serpentin » de feuilles de brick enroulées autour d'un boudin de pâte d'amande, cuit au four puis arrosé de miel tiède.",tables:[{label:"Farce",rows:[["Poudre d'amande","400 g"],["Sucre","150 g"],["Beurre mou","100 g"],["Cannelle","1 c. à café"],["Fleur d'oranger","3 c. à café"]]},{label:"Montage",rows:[["Feuilles de brick","4 feuilles"],["Beurre fondu","100 g"],["Jaune d'œuf (dorure)","1"],["Miel","150 g"]]}],meta:{prepa:"45 min",cuisson:"180°C · 10 min",pour:"1 grande spirale"},steps:["Mélanger la poudre d'amande, le sucre, le beurre, la cannelle et la fleur d'oranger jusqu'à obtenir une farce homogène.","Façonner la farce en boudins de la largeur d'une feuille de brick.","Badigeonner chaque feuille de beurre fondu, déposer un boudin de farce et enrouler en tassant bien.","Badigeonner de jaune d'œuf, disposer en spirale sur plaque.","Cuire à 180°C environ 10 minutes jusqu'à coloration dorée.","À la sortie du four, badigeonner de miel tiède et saupoudrer de poudre d'amande."]},
{id:"makrout-amandes",name:"Makrout aux amandes",desc:"Variante du makrout classique, losanges de semoule fourrés d'une farce d'amandes au lieu de dattes.",tables:[{label:"Pâte de semoule",rows:[["Semoule moyenne","1 kg"],["Beurre fondu","200 g"],["Sel","1 pincée"],["Sucre glace","4 c. à café"],["Eau tiède","qs"]]},{label:"Farce",rows:[["Amandes moulues","450 g"],["Sucre","150 g"],["Beurre fondu","50 g"],["Cannelle","1 c. à café"],["Fleur d'oranger","2 c. à soupe"]]},{label:"Finition",rows:[["Miel tiède","300 g"]]}],meta:{prepa:"1h + repos",cuisson:"friture 170-180°C · 4-6 min",pour:"40 pièces environ"},steps:["Mélanger la semoule, le beurre fondu, le sel et le sucre glace, sabler.","Ajouter l'eau tiède progressivement, pétrir jusqu'à obtenir une pâte ferme, laisser reposer.","Mélanger les amandes moulues avec le sucre, le beurre, la cannelle et la fleur d'oranger.","Former un boudin de pâte de semoule, creuser une fente, garnir de farce d'amandes et refermer.","Marquer au tampon à makrout, découper en losanges.","Frire à 170-180°C, 4 à 6 minutes jusqu'à coloration dorée.","Tremper immédiatement dans le miel tiède, égoutter avant de servir."]},
{id:"feqqas-amandes",name:"Feqqas aux amandes",desc:"Biscuit sec marocain cuit deux fois, garni d'amandes entières, croquant et parfumé.",tables:[{label:"Pâte",rows:[["Farine","500 g"],["Sucre","150 g"],["Huile","100 ml"],["Œufs","2"],["Levure chimique","8 g"],["Amandes entières","200 g"],["Zeste de citron","1"]]}],meta:{prepa:"20 min",cuisson:"20 min + 10 min (2ème cuisson)",pour:"environ 800 g"},steps:["Mélanger les œufs, le sucre, l'huile et le zeste de citron.","Ajouter la farine et la levure chimique.","Incorporer les amandes entières, former une pâte homogène.","Façonner des boudins, déposer sur plaque, cuire 20 minutes à 180°C.","Laisser tiédir, couper en tranches régulières.","Remettre au four 10 minutes pour sécher et obtenir un biscuit bien croquant."]},
{id:"mlouza",name:"Mlouza",desc:"Pâtisserie feuilletée fine roulée en spirale serrée, garnie de miel et de pistaches concassées.",tables:[{label:"Pâte",rows:[["Feuilles de brick","10 feuilles"],["Beurre fondu","100 g"],["Miel","200 g"],["Pistaches concassées","80 g"]]}],meta:{prepa:"40 min",cuisson:"four chaud · 15 min",pour:"1 grande spirale"},steps:["Badigeonner chaque feuille de brick de beurre fondu.","Superposer 2 à 3 feuilles, rouler serré en boudin fin.","Enrouler le boudin sur lui-même en spirale serrée.","Cuire au four chaud environ 15 minutes jusqu'à coloration dorée.","Napper de miel tiède dès la sortie du four.","Décorer généreusement de pistaches concassées avant de servir."]},
{id:"jawhara",name:"Jawhara",desc:"Pâtisserie feuilletée en couches croustillantes garnies de crème pâtissière et de pistaches, présentée en petits carrés élégants.",tables:[{label:"Feuilletage",rows:[["Feuilles de brick","8 feuilles"],["Beurre fondu","100 g"],["Sucre glace","pour saupoudrer"]]},{label:"Crème pâtissière",rows:[["Lait","500 ml"],["Jaunes d'œufs","3"],["Sucre","80 g"],["Maïzena","30 g"],["Fleur d'oranger","1 c. à soupe"]]},{label:"Décor",rows:[["Pistaches concassées","50 g"],["Miel","pour napper"]]}],meta:{prepa:"1h",cuisson:"four chaud · 8-10 min",pour:"8 à 10 pièces"},steps:["Réaliser la crème pâtissière classique, parfumer à la fleur d'oranger, laisser refroidir.","Badigeonner chaque feuille de brick de beurre fondu, empiler par 2, cuire à four chaud jusqu'à coloration dorée.","Découper les feuilles cuites en carrés réguliers.","Monter en superposant feuille croustillante, crème pâtissière, feuille, sur 2 à 3 étages.","Napper légèrement de miel, décorer de pistaches concassées.","Servir rapidement pour garder le croustillant."]},
{id:"mkhabez",name:"M'khabez",desc:"Petits pains briochés sucrés, moelleux, souvent parfumés à la fleur d'oranger, à déguster avec du miel.",tables:[{label:"Pâte",rows:[["Farine","500 g"],["Levure boulangère","10 g"],["Sucre","60 g"],["Lait tiède","200 ml"],["Œuf","1"],["Beurre mou","60 g"],["Fleur d'oranger","2 c. à soupe"],["Sel","5 g"]]},{label:"Dorure",rows:[["Jaune d'œuf","1"],["Graines de sésame","pour décorer"]]}],meta:{prepa:"30 min + pousse 1h30",cuisson:"180°C · 15-18 min",pour:"10 à 12 petits pains"},steps:["Diluer la levure dans le lait tiède avec une pincée de sucre.","Mélanger la farine, le sel et le sucre, ajouter l'œuf et le mélange levure-lait.","Pétrir jusqu'à obtenir une pâte souple, incorporer le beurre mou et la fleur d'oranger.","Laisser pousser 1h30 dans un endroit tiède jusqu'à doublement de volume.","Façonner des petits pains ronds, laisser lever une seconde fois 30 minutes.","Dorer au jaune d'œuf, parsemer de sésame, cuire à 180°C 15 à 18 minutes."]},
{id:"gateau-amandes-marocain",name:"Gâteau aux amandes marocain",desc:"Gâteau dense et moelleux à base de poudre d'amandes, sans farine, parfumé à la fleur d'oranger.",tables:[{label:"Appareil",rows:[["Poudre d'amandes","300 g"],["Sucre","200 g"],["Œufs","4"],["Beurre fondu","100 g"],["Levure chimique","5 g"],["Fleur d'oranger","2 c. à soupe"],["Amandes effilées","pour décorer"]]}],meta:{prepa:"20 min",cuisson:"170°C · 30-35 min",pour:"8 à 10 portions"},steps:["Fouetter les œufs et le sucre jusqu'à ce que le mélange blanchisse.","Ajouter la poudre d'amandes, la levure chimique et la fleur d'oranger.","Incorporer le beurre fondu, mélanger jusqu'à obtenir une pâte homogène.","Verser dans un moule beurré, parsemer d'amandes effilées.","Cuire à 170°C pendant 30 à 35 minutes jusqu'à ce qu'un couteau ressorte propre.","Laisser refroidir avant de démouler et servir."]},
{id:"ghriba-bahla",name:"Ghriba Bahla",desc:"Biscuit marocain rustique à base de semoule et d'amandes, à la texture sableuse caractéristique, sans garniture particulière.",tables:[{label:"Pâte",rows:[["Semoule fine","300 g"],["Poudre d'amandes","150 g"],["Sucre glace","150 g"],["Beurre fondu","150 g"],["Levure chimique","5 g"],["Œuf","1"]]}],meta:{prepa:"20 min",cuisson:"170-180°C · 10-12 min",pour:"20 à 25 pièces"},steps:["Mélanger la semoule, la poudre d'amandes, le sucre glace et la levure chimique.","Ajouter le beurre fondu et l'œuf, mélanger jusqu'à obtenir une pâte sableuse homogène.","Former des boules irrégulières, sans trop travailler la pâte.","Déposer sur plaque, sans aplatir.","Cuire à 170-180°C pendant 10 à 12 minutes — la surface doit rester pâle et craquelée.","Laisser refroidir complètement avant de manipuler, très friable à chaud."]}
);

MAROC_RECIPES.push(
{id:"ghriba-coco",name:"Ghriba à la noix de coco",desc:"Ghriba moelleuse au cœur légèrement collant, parfumée à la noix de coco râpée, craquelée en surface comme toutes les ghribas.",tables:[{label:"Pâte",rows:[["Noix de coco râpée","300 g"],["Sucre","200 g"],["Beurre fondu","120 g"],["Œufs","2"],["Farine","80 g"],["Levure chimique","1/2 sachet"],["Sucre glace (enrobage)","50 g"]]}],meta:{prepa:"20 min + repos 30 min",cuisson:"160-170°C · 12-15 min",pour:"20 à 25 pièces"},steps:["Mélanger la noix de coco râpée, le sucre et la farine tamisée avec la levure chimique.","Ajouter les œufs battus et le beurre fondu, mélanger jusqu'à obtenir une pâte collante et homogène.","Réfrigérer la pâte 30 minutes pour faciliter le façonnage.","Former des boules, les rouler généreusement dans le sucre glace.","Déposer sur plaque sans trop aplatir.","Cuire à 160-170°C pendant 12 à 15 minutes — la ghriba doit rester pâle et moelleuse au centre."]},
{id:"ghriba-coco-2",name:"Ghriba coco",desc:"Ghriba moelleuse au cœur légèrement collant, parfumée à la noix de coco râpée, craquelée en surface comme toutes les ghribas.",tables:[{label:"Pâte",rows:[["Noix de coco râpée","300 g"],["Sucre","200 g"],["Beurre fondu","120 g"],["Œufs","2"],["Farine","80 g"],["Levure chimique","1/2 sachet"],["Sucre glace (enrobage)","50 g"]]}],meta:{prepa:"20 min + repos 30 min",cuisson:"160-170°C · 12-15 min",pour:"20 à 25 pièces"},steps:["Mélanger la noix de coco râpée, le sucre et la farine tamisée avec la levure chimique.","Ajouter les œufs battus et le beurre fondu, mélanger jusqu'à obtenir une pâte collante et homogène.","Réfrigérer la pâte 30 minutes pour faciliter le façonnage.","Former des boules, les rouler généreusement dans le sucre glace.","Déposer sur plaque sans trop aplatir.","Cuire à 160-170°C pendant 12 à 15 minutes — la ghriba doit rester pâle et moelleuse au centre."]},
{id:"ghriba-sesame",name:"Ghriba au sésame",desc:"Ghriba sablée à base de graines de sésame grillées et moulues, craquelée en surface, au parfum torréfié caractéristique.",tables:[{label:"Pâte",rows:[["Graines de sésame grillées et moulues","250 g"],["Farine","200 g"],["Sucre","150 g"],["Beurre fondu","150 g"],["Œuf","1"],["Levure chimique","1/2 sachet"],["Sucre glace (enrobage)","50 g"]]}],meta:{prepa:"20 min",cuisson:"170-180°C · 10-12 min",pour:"20 à 25 pièces"},steps:["Mélanger le sésame moulu, la farine, le sucre et la levure chimique.","Ajouter l'œuf et le beurre fondu, mélanger jusqu'à obtenir une pâte homogène.","Former des boules, les rouler dans le sucre glace.","Déposer sur plaque en espaçant bien.","Cuire à 170-180°C pendant 10 à 12 minutes — surveiller la coloration, le sésame brunit vite.","Laisser refroidir avant de manipuler, la craquelure apparaît en refroidissant."]},
{id:"ghriba-beurre",name:"Ghriba au beurre",desc:"La version la plus classique et la plus simple des ghribas, sans fruit sec, tout en beurre et en légèreté sablée.",tables:[{label:"Pâte",rows:[["Farine","400 g"],["Beurre mou","250 g"],["Sucre glace","150 g"],["Œuf","1"],["Levure chimique","1/2 sachet"],["Extrait de vanille","1 c. à café"]]}],meta:{prepa:"15 min + repos 20 min",cuisson:"160-170°C · 12-15 min",pour:"25 à 30 pièces"},steps:["Crémer le beurre mou et le sucre glace jusqu'à obtenir un mélange léger.","Ajouter l'œuf et la vanille, bien incorporer.","Ajouter la farine tamisée avec la levure chimique, mélanger sans trop travailler la pâte.","Filmer et réfrigérer 20 minutes.","Former des boules, aplatir légèrement à la fourchette pour marquer le motif.","Cuire à 160-170°C pendant 12 à 15 minutes, jusqu'à peine dorée sur les bords."]},
{id:"ghriba-noix",name:"Ghriba aux noix",desc:"Ghriba fondante à base de cerneaux de noix moulus, à la saveur plus corsée et légèrement amère que la version amande.",tables:[{label:"Pâte",rows:[["Cerneaux de noix moulus","400 g"],["Sucre","150 g"],["Beurre fondu","150 g"],["Œuf","1"],["Levure chimique","1/2 sachet"],["Cannelle","1/2 c. à café"],["Sucre glace (enrobage)","50 g"],["Cerneaux de noix (déco)","25"]]}],meta:{prepa:"20 min",cuisson:"170-180°C · 10-12 min",pour:"20 à 25 pièces"},steps:["Mélanger les noix moulues, le sucre, la levure chimique et la cannelle.","Ajouter l'œuf et le beurre fondu, mélanger jusqu'à obtenir une pâte homogène.","Former des boules, les rouler dans le sucre glace.","Presser un demi-cerneau de noix sur le dessus de chaque boule.","Cuire à 170-180°C pendant 10 à 12 minutes.","Laisser refroidir avant de démouler, très friable à chaud."]},
{id:"ghriba-chocolat",name:"Ghriba au chocolat",desc:"Version moderne de la ghriba, cacao incorporé à la pâte et pépites de chocolat, cœur fondant façon cookie marocain.",tables:[{label:"Pâte",rows:[["Farine","300 g"],["Cacao en poudre non sucré","50 g"],["Sucre","180 g"],["Beurre fondu","150 g"],["Œuf","1"],["Levure chimique","1/2 sachet"],["Pépites de chocolat","100 g"],["Sucre glace (enrobage)","50 g"]]}],meta:{prepa:"20 min + repos 30 min",cuisson:"160-170°C · 10-12 min",pour:"20 à 25 pièces"},steps:["Mélanger la farine, le cacao, le sucre et la levure chimique.","Ajouter l'œuf et le beurre fondu, mélanger jusqu'à obtenir une pâte homogène.","Incorporer les pépites de chocolat.","Réfrigérer 30 minutes, former des boules et les rouler dans le sucre glace.","Cuire à 160-170°C pendant 10 à 12 minutes — le centre doit rester fondant.","Laisser tiédir avant de manipuler."]},
{id:"fekkas-sesame",name:"Fekkas au sésame",desc:"Biscuit croquant cuit deux fois, sésame torréfié incorporé à la pâte et parsemé en surface, sans fruits secs ni raisins.",tables:[{label:"Pâte",rows:[["Farine","500 g"],["Sucre","150 g"],["Huile végétale","100 ml"],["Œufs","3"],["Levure chimique","8 g"],["Graines de sésame","150 g"],["Fleur d'oranger","2 c. à soupe"],["Sel","1 pincée"]]}],meta:{prepa:"20 min",cuisson:"20 min + 10-12 min (2ème cuisson)",pour:"environ 900 g de biscuits"},steps:["Mélanger les œufs, le sucre, l'huile et la fleur d'oranger.","Ajouter la farine, la levure chimique et le sel.","Incorporer la majeure partie du sésame, former une pâte homogène.","Façonner des boudins, rouler dans le sésame restant, déposer sur plaque.","Cuire 20 minutes à 180°C, laisser tiédir 5 à 10 minutes.","Couper en tranches régulières encore tièdes, remettre au four 10 à 12 minutes pour sécher."]},
{id:"croquets-sesame",name:"Croquets au sésame",desc:"Petit biscuit croquant allongé, pâte sablée entièrement enrobée de sésame avant cuisson.",tables:[{label:"Pâte",rows:[["Farine","400 g"],["Sucre","150 g"],["Beurre","150 g"],["Œuf","1"],["Levure chimique","1/2 sachet"],["Graines de sésame (enrobage)","100 g"]]}],meta:{prepa:"20 min + repos 20 min",cuisson:"170-180°C · 15 min",pour:"environ 30 pièces"},steps:["Sabler la farine et le beurre du bout des doigts, ajouter le sucre et la levure chimique.","Ajouter l'œuf, pétrir jusqu'à obtenir une pâte souple, réfrigérer 20 minutes.","Façonner des boudins fins, les rouler entièrement dans le sésame.","Trancher en biseau en petits croquets réguliers.","Déposer sur plaque, cuire à 170-180°C pendant 15 minutes jusqu'à coloration dorée.","Laisser refroidir sur grille avant de servir."]},
{id:"croquets",name:"Croquets",desc:"Biscuit croquant traditionnel, pâte sablée aux amandes concassées, tranché et recuit pour un croquant façon biscotti.",tables:[{label:"Pâte",rows:[["Farine","500 g"],["Sucre","150 g"],["Huile","100 ml"],["Œufs","2"],["Levure chimique","8 g"],["Amandes concassées","150 g"],["Zeste de citron","1"]]}],meta:{prepa:"20 min",cuisson:"20 min + 10 min (2ème cuisson)",pour:"environ 800 g"},steps:["Mélanger les œufs, le sucre, l'huile et le zeste de citron.","Ajouter la farine et la levure chimique.","Incorporer les amandes concassées, former une pâte homogène.","Façonner des boudins, déposer sur plaque, cuire 20 minutes à 180°C.","Laisser tiédir, couper en tranches régulières en biseau.","Remettre au four 10 minutes pour sécher et obtenir un biscuit bien croquant."]},
{id:"richbond",name:"Richbond",desc:"Petit gâteau moelleux à la noix de coco, garni d'une fine couche de confiture d'abricot et roulé dans la coco râpée, classique des pâtisseries modernes marocaines.",tables:[{label:"Appareil",rows:[["Noix de coco râpée","250 g"],["Sucre","180 g"],["Blancs d'œufs","4"],["Farine","50 g"],["Beurre fondu","50 g"]]},{label:"Finition",rows:[["Confiture d'abricot","100 g"],["Noix de coco râpée (déco)","50 g"]]}],meta:{prepa:"25 min",cuisson:"160-170°C · 15 min",pour:"20 pièces"},steps:["Monter les blancs d'œufs avec le sucre jusqu'à consistance mousseuse.","Incorporer délicatement la noix de coco, la farine tamisée et le beurre fondu.","Dresser en petits tas réguliers sur plaque, ou verser dans des mini-moules.","Cuire à 160-170°C pendant 15 minutes jusqu'à légère coloration.","Badigeonner de confiture d'abricot tiédie dès la sortie du four.","Rouler immédiatement dans la noix de coco râpée avant que la confiture ne fige."]},
{id:"boules-coco",name:"Boules coco",desc:"Petites boules moelleuses de noix de coco liées au lait concentré sucré, sans cuisson, roulées dans la coco râpée — un classique rapide des présentoirs de petits-fours.",tables:[{label:"Appareil",rows:[["Noix de coco râpée","300 g"],["Lait concentré sucré","200 g"],["Beurre fondu","30 g"],["Extrait de vanille","1 c. à café"],["Noix de coco râpée (enrobage)","100 g"]]}],meta:{prepa:"20 min + repos 1h au frais",cuisson:"aucune",pour:"25 pièces environ"},steps:["Mélanger la noix de coco râpée, le lait concentré, le beurre fondu et la vanille jusqu'à obtenir une pâte collante et homogène.","Réfrigérer 1 heure pour que le mélange se raffermisse et devienne façonnable.","Former de petites boules régulières entre les paumes légèrement humides.","Rouler chaque boule dans la noix de coco râpée réservée.","Disposer en caissettes, conserver au frais jusqu'au service."]},
{id:"mchouek-coco",name:"Mchouek coco",desc:"Petits fours croustillants légèrement grillés en surface, pâte sablée à la coco, marqués à la fourchette avant cuisson.",tables:[{label:"Pâte",rows:[["Noix de coco râpée","200 g"],["Farine","250 g"],["Sucre","150 g"],["Beurre mou","150 g"],["Œuf","1"],["Levure chimique","1/2 sachet"]]}],meta:{prepa:"20 min + repos 20 min",cuisson:"170-180°C · 12-15 min",pour:"20 à 25 pièces"},steps:["Crémer le beurre et le sucre, ajouter l'œuf.","Incorporer la noix de coco, la farine et la levure chimique, pétrir jusqu'à homogénéité.","Réfrigérer 20 minutes.","Former des boules, marquer le dessus au dos d'une fourchette pour un léger relief.","Cuire à 170-180°C pendant 12 à 15 minutes jusqu'à ce que les bords et pointes de coco soient légèrement grillés.","Laisser refroidir sur grille avant de servir."]},
{id:"rochers-coco",name:"Rochers coco",desc:"Petits rochers moelleux à l'intérieur et légèrement croustillants en surface, à base de blancs d'œufs montés et de noix de coco, cuits au four.",tables:[{label:"Appareil",rows:[["Noix de coco râpée","300 g"],["Blancs d'œufs","3"],["Sucre","150 g"],["Extrait de vanille","1 c. à café"]]}],meta:{prepa:"15 min",cuisson:"160°C · 15-18 min",pour:"20 pièces environ"},steps:["Monter les blancs en neige ferme, incorporer le sucre en pluie fine pour serrer la meringue.","Ajouter la vanille puis incorporer délicatement la noix de coco râpée à la spatule.","Former de petits tas coniques à la cuillère sur plaque recouverte de papier cuisson.","Cuire à 160°C pendant 15 à 18 minutes jusqu'à ce que la pointe soit dorée.","Laisser refroidir complètement avant de décoller."]},
{id:"gateaux-prestige",name:"Gâteaux Prestige",desc:"Petit four moderne « Prestige » : biscuit génoise imbibé de sirop, garni de crème au beurre et glacé au fondant — la base commune de toute la famille Prestige, déclinée ensuite en plusieurs parfums.",tables:[{label:"Génoise",rows:[["Œufs","4"],["Sucre","120 g"],["Farine","120 g"]]},{label:"Sirop d'imbibage",rows:[["Eau","100 ml"],["Sucre","80 g"],["Fleur d'oranger","1 c. à soupe"]]},{label:"Crème au beurre",rows:[["Beurre mou","200 g"],["Sucre glace","150 g"],["Lait","2 c. à soupe"]]},{label:"Finition",rows:[["Fondant ou glaçage blanc","200 g"],["Amandes effilées","pour décorer"]]}],meta:{prepa:"1h",cuisson:"180°C · 15 min (génoise)",pour:"30 pièces environ"},steps:["Fouetter les œufs et le sucre au bain-marie jusqu'à ce que le mélange triple de volume et forme un ruban.","Incorporer la farine tamisée délicatement à la maryse, hors du bain-marie.","Étaler sur plaque et cuire 15 minutes à 180°C, laisser refroidir.","Découper le biscuit en petits carrés ou rectangles à l'emporte-pièce.","Imbiber légèrement de sirop, garnir d'une couche de crème au beurre.","Glacer au fondant, décorer d'une amande effilée avant que le glaçage ne fige."]},
{id:"prestige-chocolat",name:"Prestige chocolat",desc:"Déclinaison chocolat de la base Prestige : génoise imbibée, ganache au chocolat noir, glaçage chocolat brillant.",tables:[{label:"Génoise cacao",rows:[["Œufs","4"],["Sucre","120 g"],["Farine","100 g"],["Cacao en poudre","20 g"]]},{label:"Ganache",rows:[["Chocolat noir","200 g"],["Crème liquide","200 ml"]]},{label:"Finition",rows:[["Glaçage chocolat","150 g"],["Copeaux de chocolat","pour décorer"]]}],meta:{prepa:"1h",cuisson:"180°C · 15 min",pour:"25 pièces environ"},steps:["Réaliser la génoise en ajoutant le cacao tamisé à la farine, cuire 15 minutes à 180°C.","Porter la crème à ébullition, la verser sur le chocolat haché, mélanger jusqu'à obtenir une ganache lisse.","Laisser tiédir la ganache jusqu'à une texture tartinable.","Découper la génoise en carrés, garnir généreusement de ganache.","Napper de glaçage chocolat, décorer de copeaux avant prise complète.","Réserver au frais 30 minutes avant de démouler et servir."]},
{id:"prestige-cafe",name:"Prestige café",desc:"Déclinaison café de la base Prestige : génoise imbibée de sirop au café, crème au beurre café, glaçage moka.",tables:[{label:"Génoise",rows:[["Œufs","4"],["Sucre","120 g"],["Farine","120 g"]]},{label:"Sirop café",rows:[["Café fort","100 ml"],["Sucre","60 g"]]},{label:"Crème au beurre café",rows:[["Beurre mou","200 g"],["Sucre glace","150 g"],["Extrait de café","1 c. à soupe"]]},{label:"Finition",rows:[["Glaçage moka","150 g"],["Grains de café en chocolat","pour décorer"]]}],meta:{prepa:"1h",cuisson:"180°C · 15 min",pour:"25 pièces environ"},steps:["Cuire la génoise nature 15 minutes à 180°C, laisser refroidir.","Préparer le sirop café en dissolvant le sucre dans le café chaud.","Crémer le beurre et le sucre glace, parfumer à l'extrait de café.","Découper la génoise, imbiber de sirop café, garnir de crème au beurre.","Napper de glaçage moka, décorer d'un grain de café en chocolat.","Réserver au frais avant de servir."]},
{id:"prestige-pistache",name:"Prestige pistache",desc:"Déclinaison pistache de la base Prestige : génoise imbibée, crème à la pâte de pistache, glaçage vert pistache et pistaches concassées.",tables:[{label:"Génoise",rows:[["Œufs","4"],["Sucre","120 g"],["Farine","120 g"]]},{label:"Sirop d'imbibage",rows:[["Eau","100 ml"],["Sucre","80 g"]]},{label:"Crème pistache",rows:[["Beurre mou","200 g"],["Sucre glace","150 g"],["Pâte de pistache","40 g"]]},{label:"Finition",rows:[["Glaçage vert pistache","150 g"],["Pistaches concassées","pour décorer"]]}],meta:{prepa:"1h",cuisson:"180°C · 15 min",pour:"25 pièces environ"},steps:["Cuire la génoise nature 15 minutes à 180°C, laisser refroidir.","Crémer le beurre et le sucre glace, incorporer la pâte de pistache.","Découper la génoise, imbiber légèrement de sirop.","Garnir généreusement de crème pistache.","Napper de glaçage vert, parsemer de pistaches concassées.","Réserver au frais avant de servir."]},
{id:"prestige-noisette",name:"Prestige noisette",desc:"Déclinaison noisette de la base Prestige : génoise imbibée, crème au praliné noisette, glaçage caramel et noisettes concassées.",tables:[{label:"Génoise",rows:[["Œufs","4"],["Sucre","120 g"],["Farine","120 g"]]},{label:"Sirop d'imbibage",rows:[["Eau","100 ml"],["Sucre","80 g"]]},{label:"Crème praliné",rows:[["Beurre mou","200 g"],["Sucre glace","150 g"],["Pâte de praliné noisette","50 g"]]},{label:"Finition",rows:[["Glaçage caramel","150 g"],["Noisettes concassées et torréfiées","pour décorer"]]}],meta:{prepa:"1h",cuisson:"180°C · 15 min",pour:"25 pièces environ"},steps:["Cuire la génoise nature 15 minutes à 180°C, laisser refroidir.","Crémer le beurre et le sucre glace, incorporer la pâte de praliné.","Découper la génoise, imbiber légèrement de sirop.","Garnir de crème praliné.","Napper de glaçage caramel, parsemer de noisettes concassées torréfiées.","Réserver au frais avant de servir."]},
{id:"opera-marocain",name:"Opéra marocain",desc:"Version marocaine du gâteau Opéra en format petit four : couches de biscuit imbibé de café, ganache chocolat et crème au beurre café, glaçage chocolat brillant.",tables:[{label:"Biscuit",rows:[["Œufs","4"],["Sucre","120 g"],["Farine","100 g"],["Poudre d'amandes","20 g"]]},{label:"Sirop café",rows:[["Café fort","100 ml"],["Sucre","50 g"]]},{label:"Crème au beurre café",rows:[["Beurre mou","150 g"],["Sucre glace","100 g"],["Extrait de café","1 c. à soupe"]]},{label:"Ganache",rows:[["Chocolat noir","150 g"],["Crème liquide","150 ml"]]},{label:"Finition",rows:[["Glaçage chocolat brillant","150 g"]]}],meta:{prepa:"1h30",cuisson:"180°C · 12 min par plaque",pour:"20 pièces environ"},steps:["Cuire le biscuit en 3 plaques fines, laisser refroidir.","Imbiber chaque plaque de sirop café.","Monter en couches : biscuit imbibé, crème au beurre café, biscuit imbibé, ganache chocolat, biscuit imbibé.","Napper le dessus de glaçage chocolat brillant, lisser à la spatule.","Réserver au frais 2 heures pour que les couches se figent.","Découper en petits rectangles nets avec un couteau chauffé."]},
{id:"carre-chocolat",name:"Carré chocolat",desc:"Petit four carré, biscuit génoise au chocolat, garni de ganache et entièrement glacé de chocolat noir brillant.",tables:[{label:"Génoise cacao",rows:[["Œufs","4"],["Sucre","120 g"],["Farine","100 g"],["Cacao en poudre","20 g"]]},{label:"Ganache",rows:[["Chocolat noir","200 g"],["Crème liquide","150 ml"]]},{label:"Finition",rows:[["Glaçage chocolat noir","150 g"]]}],meta:{prepa:"50 min",cuisson:"180°C · 15 min",pour:"25 pièces environ"},steps:["Cuire la génoise cacao 15 minutes à 180°C, laisser refroidir.","Préparer la ganache en versant la crème chaude sur le chocolat haché.","Découper la génoise en carrés réguliers, garnir de ganache.","Recouvrir entièrement de glaçage chocolat noir à l'aide d'une spatule.","Lisser les angles pour un rendu net et carré.","Réserver au frais avant de servir."]},
{id:"delice-amande",name:"Délice amande",desc:"Petit four moelleux à la poudre d'amande, cœur fondant, léger glaçage au sucre glace et amande entière en décor.",tables:[{label:"Appareil",rows:[["Poudre d'amandes","200 g"],["Sucre","150 g"],["Œufs","3"],["Beurre fondu","80 g"],["Farine","30 g"],["Levure chimique","3 g"]]},{label:"Finition",rows:[["Glaçage sucre glace","100 g"],["Amandes entières mondées","pour décorer"]]}],meta:{prepa:"20 min",cuisson:"170°C · 15-18 min",pour:"20 pièces environ"},steps:["Fouetter les œufs et le sucre jusqu'à ce que le mélange blanchisse.","Ajouter la poudre d'amandes, la farine et la levure chimique.","Incorporer le beurre fondu, verser dans des mini-moules beurrés.","Cuire à 170°C pendant 15 à 18 minutes.","Laisser refroidir puis napper d'un fin glaçage au sucre glace.","Décorer chaque pièce d'une amande entière."]},
{id:"finger-chocolat",name:"Finger chocolat",desc:"Petit four allongé en forme de doigt, biscuit génoise garni de ganache et entièrement enrobé de chocolat noir.",tables:[{label:"Génoise",rows:[["Œufs","4"],["Sucre","120 g"],["Farine","120 g"]]},{label:"Ganache",rows:[["Chocolat noir","150 g"],["Crème liquide","120 ml"]]},{label:"Finition",rows:[["Chocolat de couverture noir","300 g"],["Amandes effilées","pour décorer"]]}],meta:{prepa:"1h",cuisson:"180°C · 15 min",pour:"20 pièces environ"},steps:["Cuire la génoise nature 15 minutes à 180°C, laisser refroidir.","Découper en bâtonnets allongés réguliers.","Garnir chaque bâtonnet d'une fine couche de ganache.","Faire fondre le chocolat de couverture au bain-marie.","Tremper chaque finger entièrement dans le chocolat fondu à l'aide d'une fourchette à trempage.","Décorer d'une amande effilée avant que le chocolat ne fige, laisser prendre au frais."]},
{id:"mini-entremets",name:"Mini entremets",desc:"Petit gâteau individuel en couches — biscuit, mousse et glaçage miroir — format petit four élégant pour les buffets.",tables:[{label:"Biscuit",rows:[["Œufs","3"],["Sucre","80 g"],["Farine","80 g"]]},{label:"Mousse",rows:[["Chocolat au lait ou fruit au choix","150 g"],["Crème liquide entière","250 ml"],["Feuilles de gélatine","2"]]},{label:"Finition",rows:[["Glaçage miroir","150 g"]]}],meta:{prepa:"1h + 4h de prise au froid",cuisson:"180°C · 10 min (biscuit)",pour:"15 pièces environ"},steps:["Cuire un biscuit fin, laisser refroidir, découper des disques à l'emporte-pièce.","Faire fondre le chocolat (ou la purée de fruit), ramollir la gélatine et l'incorporer tiède.","Monter la crème liquide en chantilly souple, l'incorporer délicatement au mélange précédent.","Couler la mousse dans des moules individuels, insérer un disque de biscuit, lisser.","Réserver au congélateur au moins 4 heures pour un démoulage net.","Démouler, napper de glaçage miroir tiède et laisser décongeler au frais avant de servir."]},
{id:"mini-tartelettes",name:"Mini tartelettes",desc:"Petites tartelettes en pâte sablée garnies de crème pâtissière, format bouchée pour les plateaux de petits-fours.",tables:[{label:"Pâte sablée",rows:[["Farine","250 g"],["Beurre froid","125 g"],["Sucre glace","80 g"],["Œuf","1"],["Sel","1 pincée"]]},{label:"Crème pâtissière",rows:[["Lait","300 ml"],["Jaunes d'œufs","2"],["Sucre","60 g"],["Maïzena","20 g"],["Vanille","1 c. à café"]]}],meta:{prepa:"45 min + repos 30 min",cuisson:"170°C · 12-15 min",pour:"20 pièces environ"},steps:["Sabler la farine et le beurre froid, ajouter le sucre glace, l'œuf et le sel, pétrir rapidement.","Filmer et réfrigérer 30 minutes.","Abaisser finement, foncer des mini-moules à tartelettes, piquer le fond.","Cuire à blanc à 170°C pendant 12 à 15 minutes, laisser refroidir.","Préparer la crème pâtissière classique, laisser refroidir en filmant au contact.","Garnir chaque tartelette de crème pâtissière juste avant de servir."]},
{id:"tartelettes-fruits",name:"Tartelettes aux fruits",desc:"Tartelettes en pâte sablée garnies de crème pâtissière et surmontées de fruits frais de saison, façon pâtisserie de vitrine.",tables:[{label:"Pâte sablée",rows:[["Farine","250 g"],["Beurre froid","125 g"],["Sucre glace","80 g"],["Œuf","1"],["Sel","1 pincée"]]},{label:"Crème pâtissière",rows:[["Lait","300 ml"],["Jaunes d'œufs","2"],["Sucre","60 g"],["Maïzena","20 g"],["Vanille","1 c. à café"]]},{label:"Finition",rows:[["Fruits frais au choix (fraises, kiwis, raisins…)","au choix"],["Nappage neutre","pour lustrer"]]}],meta:{prepa:"1h + repos 30 min",cuisson:"170°C · 12-15 min",pour:"20 pièces environ"},steps:["Préparer et cuire les fonds de tartelettes comme pour la pâte sablée classique.","Préparer la crème pâtissière, laisser refroidir.","Garnir chaque fond de crème pâtissière.","Disposer harmonieusement les fruits frais coupés en fines tranches.","Napper d'un voile de nappage neutre tiède pour lustrer et protéger les fruits.","Réserver au frais et servir le jour même."]},
{id:"cornets-amandes",name:"Cornets aux amandes",desc:"Petit four en forme de corne, biscuit croustillant roulé encore chaud autour d'un cône, garni de crème et trempé dans les amandes.",tables:[{label:"Biscuit",rows:[["Blancs d'œufs","3"],["Sucre","100 g"],["Farine","80 g"],["Beurre fondu","50 g"],["Amandes effilées","100 g"]]},{label:"Garniture",rows:[["Crème chantilly ou crème pâtissière","200 g"]]}],meta:{prepa:"45 min",cuisson:"180°C · 6-8 min",pour:"15 pièces environ"},steps:["Fouetter les blancs d'œufs avec le sucre sans les monter en neige, ajouter la farine tamisée puis le beurre fondu.","Étaler de fines cercles de pâte sur plaque, parsemer d'amandes effilées.","Cuire à 180°C 6 à 8 minutes jusqu'à coloration dorée sur les bords.","Dès la sortie du four, rouler rapidement chaque disque encore souple autour d'un cornet métallique.","Laisser refroidir et durcir sur le moule avant de démouler délicatement.","Garnir de crème chantilly ou pâtissière juste avant de servir pour garder le croustillant."]},
{id:"cigares-amandes",name:"Cigares aux amandes",desc:"Petit four allongé en forme de cigare, feuille de brick croustillante roulée autour d'une farce de pâte d'amande, doré au four.",tables:[{label:"Farce",rows:[["Amandes mondées moulues","250 g"],["Sucre glace","150 g"],["Beurre fondu","30 g"],["Fleur d'oranger","1 c. à soupe"]]},{label:"Montage",rows:[["Feuilles de brick","10 feuilles"],["Beurre fondu","80 g"],["Sucre glace (déco)","pour saupoudrer"]]}],meta:{prepa:"45 min",cuisson:"180°C · 10-12 min",pour:"20 pièces environ"},steps:["Mélanger les amandes moulues, le sucre glace, le beurre fondu et la fleur d'oranger pour la farce.","Façonner la farce en petits bâtonnets fins.","Couper les feuilles de brick en bandes, badigeonner de beurre fondu.","Déposer un bâtonnet de farce à une extrémité et rouler serré en forme de cigare.","Disposer sur plaque, badigeonner à nouveau de beurre fondu.","Cuire à 180°C pendant 10 à 12 minutes jusqu'à coloration dorée, saupoudrer de sucre glace en sortie de four."]},
{id:"eventails",name:"Éventails",desc:"Petit four en pâte feuilletée pliée en accordéon puis évasée en éventail, caramélisée au sucre à la cuisson, façon palmier revisité.",tables:[{label:"Pâte",rows:[["Pâte feuilletée","500 g"],["Sucre semoule","150 g"],["Cannelle","1/2 c. à café (facultatif)"]]}],meta:{prepa:"30 min",cuisson:"200°C · 12-15 min",pour:"20 pièces environ"},steps:["Étaler la pâte feuilletée, saupoudrer généreusement de sucre semoule des deux côtés.","Plier la pâte en accordéon sur toute sa longueur.","Trancher le boudin obtenu en tranches d'environ 1 cm.","Écarter légèrement chaque tranche en éventail, déposer sur plaque.","Cuire à 200°C pendant 12 à 15 minutes en surveillant la caramélisation du sucre.","Retourner à mi-cuisson pour une caramélisation homogène des deux faces."]},
{id:"losanges-amandes",name:"Losanges aux amandes",desc:"Petit four sablé découpé en losanges, garni d'une fine couche de crème d'amande et décoré d'une amande entière.",tables:[{label:"Pâte sablée",rows:[["Farine","250 g"],["Beurre froid","125 g"],["Sucre glace","80 g"],["Œuf","1"]]},{label:"Crème d'amande",rows:[["Poudre d'amandes","150 g"],["Sucre","100 g"],["Beurre mou","100 g"],["Œuf","1"]]},{label:"Finition",rows:[["Amandes entières mondées","pour décorer"],["Sucre glace","pour saupoudrer"]]}],meta:{prepa:"45 min + repos 30 min",cuisson:"170°C · 15-18 min",pour:"25 pièces environ"},steps:["Préparer la pâte sablée, réfrigérer 30 minutes, foncer un moule rectangulaire beurré.","Mélanger la poudre d'amandes, le sucre, le beurre mou et l'œuf pour la crème d'amande.","Étaler la crème d'amande sur le fond de pâte.","Cuire à 170°C pendant 15 à 18 minutes jusqu'à belle coloration dorée.","Laisser refroidir puis découper en losanges réguliers.","Décorer chaque losange d'une amande entière et saupoudrer de sucre glace."]},
{id:"diamants",name:"Diamants",desc:"Petit sablé rond enrobé de sucre cristallisé avant cuisson, qui scintille comme un diamant sous la lumière une fois cuit.",tables:[{label:"Pâte",rows:[["Farine","300 g"],["Beurre froid","200 g"],["Sucre","100 g"],["Jaune d'œuf","1"],["Sel","1 pincée"],["Sucre cristallisé (enrobage)","100 g"]]}],meta:{prepa:"20 min + repos 1h",cuisson:"170°C · 12-15 min",pour:"30 pièces environ"},steps:["Sabler la farine et le beurre froid coupé en dés, ajouter le sucre et le sel.","Incorporer le jaune d'œuf, rassembler rapidement en boudins réguliers.","Filmer et réfrigérer au moins 1 heure jusqu'à ce que les boudins soient bien fermes.","Rouler chaque boudin dans le sucre cristallisé pour l'enrober entièrement.","Trancher en rondelles régulières, déposer sur plaque.","Cuire à 170°C pendant 12 à 15 minutes jusqu'à légère coloration dorée sur les bords."]},
{id:"carres-prestige",name:"Carrés prestige",desc:"Petit four carré de la famille Prestige, biscuit imbibé, garni de crème au beurre et glacé, coupé en carrés nets.",tables:[{label:"Génoise",rows:[["Œufs","4"],["Sucre","120 g"],["Farine","120 g"]]},{label:"Sirop d'imbibage",rows:[["Eau","100 ml"],["Sucre","80 g"]]},{label:"Crème au beurre",rows:[["Beurre mou","200 g"],["Sucre glace","150 g"]]},{label:"Finition",rows:[["Glaçage au choix","150 g"],["Décor au choix","amandes, pistaches ou vermicelles"]]}],meta:{prepa:"1h",cuisson:"180°C · 15 min",pour:"25 pièces environ"},steps:["Cuire la génoise nature 15 minutes à 180°C, laisser refroidir.","Découper en carrés bien réguliers à l'aide d'un couteau chauffé.","Imbiber légèrement de sirop, garnir de crème au beurre.","Napper de glaçage au choix, lisser les angles pour un rendu net.","Décorer selon le parfum choisi.","Réserver au frais avant de servir."]},
{id:"fingers",name:"Fingers",desc:"Petit four allongé et fin, biscuit génoise glacé simplement, décor minimaliste — un classique discret des plateaux mixtes.",tables:[{label:"Génoise",rows:[["Œufs","4"],["Sucre","120 g"],["Farine","120 g"]]},{label:"Sirop d'imbibage",rows:[["Eau","100 ml"],["Sucre","80 g"]]},{label:"Finition",rows:[["Glaçage blanc ou fondant","150 g"],["Vermicelles de sucre ou amandes hachées","pour décorer"]]}],meta:{prepa:"45 min",cuisson:"180°C · 15 min",pour:"25 pièces environ"},steps:["Cuire la génoise nature 15 minutes à 180°C, laisser refroidir.","Découper en bâtonnets fins et réguliers.","Imbiber légèrement de sirop.","Napper le dessus de glaçage à la spatule.","Décorer de vermicelles de sucre ou d'amandes hachées avant prise du glaçage.","Laisser figer avant de dresser sur plateau."]},
{id:"mini-eclairs",name:"Mini éclairs",desc:"Version miniature de l'éclair classique, pâte à choux garnie de crème pâtissière et glacée au fondant.",tables:[{label:"Pâte à choux",rows:[["Eau","125 ml"],["Beurre","50 g"],["Farine","75 g"],["Œufs","2"],["Sel","1 pincée"]]},{label:"Crème pâtissière",rows:[["Lait","300 ml"],["Jaunes d'œufs","2"],["Sucre","60 g"],["Maïzena","20 g"],["Vanille ou café","au choix"]]},{label:"Finition",rows:[["Fondant chocolat ou café","150 g"]]}],meta:{prepa:"1h",cuisson:"200°C · 20-25 min",pour:"25 pièces environ"},steps:["Préparer la pâte à choux classique : porter l'eau, le beurre et le sel à ébullition, ajouter la farine hors du feu, dessécher puis incorporer les œufs un à un.","Pocher de petits bâtonnets sur plaque, cuire à 200°C pendant 20 à 25 minutes sans ouvrir le four.","Laisser refroidir complètement les choux.","Préparer la crème pâtissière, parfumer selon le goût, garnir les éclairs par une petite ouverture.","Faire tiédir le fondant, napper le dessus de chaque éclair.","Laisser figer le glaçage avant de servir."]},
{id:"mini-choux",name:"Mini choux",desc:"Petits choux garnis de crème chantilly, servis natures ou saupoudrés de sucre glace, format bouchée.",tables:[{label:"Pâte à choux",rows:[["Eau","125 ml"],["Beurre","50 g"],["Farine","75 g"],["Œufs","2"],["Sel","1 pincée"]]},{label:"Garniture",rows:[["Crème liquide entière","250 ml"],["Sucre glace","30 g"],["Vanille","1 c. à café"]]}],meta:{prepa:"1h",cuisson:"200°C · 18-20 min",pour:"30 pièces environ"},steps:["Préparer la pâte à choux classique comme pour les éclairs.","Pocher de petites boules régulières sur plaque, espacées.","Cuire à 200°C pendant 18 à 20 minutes jusqu'à bonne coloration, sans ouvrir le four en cours de cuisson.","Laisser refroidir complètement.","Monter la crème liquide bien froide en chantilly ferme avec le sucre glace et la vanille.","Garnir les choux à la poche à douille juste avant de servir, saupoudrer de sucre glace."]},
{id:"barquettes",name:"Barquettes",desc:"Petites tartelettes en forme de barque, garnies de crème pâtissière et décorées de fruits ou d'un glaçage, format allongé.",tables:[{label:"Pâte sablée",rows:[["Farine","250 g"],["Beurre froid","125 g"],["Sucre glace","80 g"],["Œuf","1"]]},{label:"Crème pâtissière",rows:[["Lait","300 ml"],["Jaunes d'œufs","2"],["Sucre","60 g"],["Maïzena","20 g"]]},{label:"Finition",rows:[["Fruits frais ou glaçage","au choix"],["Nappage neutre","pour lustrer"]]}],meta:{prepa:"1h + repos 30 min",cuisson:"170°C · 12-15 min",pour:"20 pièces environ"},steps:["Foncer des moules à barquettes de pâte sablée, piquer le fond, réfrigérer 30 minutes.","Cuire à blanc à 170°C pendant 12 à 15 minutes, laisser refroidir.","Préparer la crème pâtissière, laisser refroidir.","Garnir chaque barquette de crème pâtissière.","Décorer de fruits frais ou d'un trait de glaçage selon l'inspiration.","Napper d'un voile de nappage neutre, réserver au frais jusqu'au service."]},
{id:"cigares-chocolat",name:"Cigares chocolat",desc:"Petit four allongé, biscuit ou feuille de brick roulé autour d'une garniture chocolatée, entièrement enrobé de chocolat.",tables:[{label:"Farce",rows:[["Ganache chocolat épaisse","250 g"]]},{label:"Montage",rows:[["Feuilles de brick","10 feuilles"],["Beurre fondu","80 g"]]},{label:"Finition",rows:[["Chocolat de couverture noir","250 g"]]}],meta:{prepa:"50 min + 1h de prise",cuisson:"180°C · 10 min",pour:"20 pièces environ"},steps:["Préparer une ganache épaisse (davantage de chocolat que de crème), laisser refroidir au frais jusqu'à consistance façonnable.","Façonner la ganache en petits bâtonnets fins.","Couper les feuilles de brick en bandes, badigeonner de beurre fondu.","Rouler chaque bâtonnet de ganache serré dans une bande de brick pour former un cigare.","Cuire à 180°C pendant 10 minutes jusqu'à légère coloration, laisser refroidir.","Tremper chaque cigare dans le chocolat de couverture fondu, laisser figer au frais."]},
{id:"gateaux-marbres",name:"Gâteaux marbrés",desc:"Petit four marbré vanille-chocolat, coupé en cubes ou tranches, glaçage léger en décor contrasté.",tables:[{label:"Appareil vanille",rows:[["Farine","150 g"],["Sucre","150 g"],["Beurre mou","150 g"],["Œufs","3"],["Levure chimique","5 g"],["Vanille","1 c. à café"]]},{label:"Appareil chocolat",rows:[["Cacao en poudre","20 g"],["Lait","2 c. à soupe"]]}],meta:{prepa:"30 min",cuisson:"170°C · 35-40 min",pour:"25 pièces environ (en cubes)"},steps:["Crémer le beurre et le sucre, ajouter les œufs un à un.","Ajouter la farine et la levure chimique, diviser la pâte en deux parts égales.","Parfumer une moitié à la vanille, l'autre au cacao dilué dans le lait.","Verser les deux appareils en alternance dans un moule beurré, marbrer à la pointe d'un couteau.","Cuire à 170°C pendant 35 à 40 minutes jusqu'à ce qu'un couteau ressorte propre.","Laisser refroidir, découper en petits cubes réguliers pour le format petit four."]},
{id:"delices-pistache",name:"Délices pistache",desc:"Petit four moelleux à la pistache, cœur fondant, glaçage vert pâle et pistaches concassées en décor.",tables:[{label:"Appareil",rows:[["Pâte de pistache","60 g"],["Sucre","150 g"],["Œufs","3"],["Beurre fondu","80 g"],["Farine","60 g"],["Levure chimique","3 g"]]},{label:"Finition",rows:[["Glaçage vert pistache","100 g"],["Pistaches concassées","pour décorer"]]}],meta:{prepa:"20 min",cuisson:"170°C · 15-18 min",pour:"20 pièces environ"},steps:["Fouetter les œufs et le sucre jusqu'à ce que le mélange blanchisse.","Incorporer la pâte de pistache, puis la farine et la levure chimique.","Ajouter le beurre fondu, verser dans des mini-moules beurrés.","Cuire à 170°C pendant 15 à 18 minutes.","Laisser refroidir puis napper d'un fin glaçage vert pistache.","Décorer de pistaches concassées avant prise du glaçage."]},
{id:"delices-noisette",name:"Délices noisette",desc:"Petit four moelleux à la noisette, cœur fondant au praliné, glaçage caramel et noisettes concassées en décor.",tables:[{label:"Appareil",rows:[["Poudre de noisettes","150 g"],["Sucre","150 g"],["Œufs","3"],["Beurre fondu","80 g"],["Farine","30 g"],["Levure chimique","3 g"]]},{label:"Finition",rows:[["Glaçage caramel","100 g"],["Noisettes concassées et torréfiées","pour décorer"]]}],meta:{prepa:"20 min",cuisson:"170°C · 15-18 min",pour:"20 pièces environ"},steps:["Fouetter les œufs et le sucre jusqu'à ce que le mélange blanchisse.","Ajouter la poudre de noisettes, la farine et la levure chimique.","Incorporer le beurre fondu, verser dans des mini-moules beurrés.","Cuire à 170°C pendant 15 à 18 minutes.","Laisser refroidir puis napper d'un fin glaçage caramel.","Décorer de noisettes concassées torréfiées avant prise du glaçage."]},
{id:"gateaux-cafe",name:"Gâteaux au café",desc:"Petit four moelleux parfumé au café, imbibé d'un sirop café, glaçage moka.",tables:[{label:"Appareil",rows:[["Farine","150 g"],["Sucre","150 g"],["Beurre mou","150 g"],["Œufs","3"],["Levure chimique","5 g"],["Extrait de café","1 c. à soupe"]]},{label:"Sirop café",rows:[["Café fort","80 ml"],["Sucre","40 g"]]},{label:"Finition",rows:[["Glaçage moka","100 g"]]}],meta:{prepa:"25 min",cuisson:"170°C · 25-30 min",pour:"20 pièces environ"},steps:["Crémer le beurre et le sucre, ajouter les œufs un à un.","Ajouter la farine, la levure chimique et l'extrait de café.","Verser dans des mini-moules ou un moule à découper ensuite, cuire à 170°C pendant 25 à 30 minutes.","Démouler tiède, imbiber de sirop café.","Laisser refroidir complètement.","Napper de glaçage moka avant de servir."]},
{id:"gateaux-chocolat",name:"Gâteaux au chocolat",desc:"Petit four fondant au chocolat, format individuel, glaçage chocolat brillant.",tables:[{label:"Appareil",rows:[["Chocolat noir","150 g"],["Beurre","100 g"],["Sucre","120 g"],["Œufs","3"],["Farine","50 g"]]},{label:"Finition",rows:[["Glaçage chocolat brillant","100 g"]]}],meta:{prepa:"20 min",cuisson:"170°C · 15-18 min",pour:"20 pièces environ"},steps:["Faire fondre le chocolat et le beurre ensemble au bain-marie.","Fouetter les œufs et le sucre jusqu'à ce que le mélange blanchisse.","Incorporer le chocolat fondu puis la farine tamisée.","Verser dans des mini-moules beurrés, cuire à 170°C pendant 15 à 18 minutes — le cœur doit rester fondant.","Laisser refroidir puis démouler délicatement.","Napper de glaçage chocolat brillant avant de servir."]},
{id:"beghrir-sucre",name:"Beghrir sucré",desc:"Crêpes marocaines « aux mille trous » servies bien sucrées, nappées de beurre fondu et d'un mélange miel-beurre chaud.",tables:[{label:"Pâte",rows:[["Semoule fine","250 g"],["Farine","120 g"],["Eau tiède","450 ml"],["Levure boulangère","7 g"],["Levure chimique","1 sachet"],["Sel","1/2 c. à café"],["Sucre","2 c. à soupe"]]},{label:"Finition",rows:[["Miel","150 g"],["Beurre fondu","100 g"]]}],meta:{prepa:"15 min + repos 25-30 min",cuisson:"quelques min par crêpe, un seul côté",pour:"environ 15-20 crêpes"},steps:["Mélanger la semoule, la farine, le sel et le sucre.","Ajouter l'eau tiède progressivement et la levure boulangère diluée, mixer 3 à 5 minutes jusqu'à formation de bulles.","Ajouter la levure chimique, mixer encore une minute jusqu'à obtenir un mélange homogène et fluide.","Couvrir et laisser reposer 25 à 30 minutes.","Verser une louche de pâte dans une poêle chaude non graissée, laisser cuire sans retourner jusqu'à ce que toute la surface soit couverte de petits trous.","Mélanger le miel et le beurre fondu tièdes, napper généreusement les crêpes chaudes avant de servir."]},
{id:"meloui-sucre",name:"Meloui sucré",desc:"Galette marocaine feuilletée roulée en spirale, cuite à la poêle et servie chaude nappée de miel et de beurre fondu.",tables:[{label:"Pâte",rows:[["Farine","500 g"],["Semoule fine","100 g"],["Sel","1 c. à café"],["Eau tiède","300 ml"],["Beurre fondu + huile (feuilletage)","qs, à parts égales"]]},{label:"Finition",rows:[["Miel","pour servir"],["Beurre fondu","pour servir"]]}],meta:{prepa:"45 min + repos 20-30 min",cuisson:"3-4 min par face",pour:"8 à 10 pièces"},steps:["Mélanger la farine, la semoule et le sel, ajouter l'eau tiède progressivement en pétrissant 10 minutes jusqu'à une pâte souple.","Diviser en boules égales, badigeonner d'huile, laisser reposer 20 à 30 minutes.","Étaler chaque boule très finement, badigeonner du mélange beurre-huile et saupoudrer de semoule.","Rouler la pâte en un long boudin, puis enrouler ce boudin sur lui-même en spirale serrée.","Aplatir délicatement la spirale à la main pour former une galette ronde.","Cuire à la poêle chaude légèrement huilée 3 à 4 minutes de chaque côté, servir chaud nappé de miel et de beurre fondu."]},
{id:"maamoul",name:"Maamoul",desc:"Petits gâteaux de semoule moulés, fourrés à la pâte de dattes, marqués du motif traditionnel au moule à maamoul, spécialité des fêtes.",tables:[{label:"Pâte",rows:[["Semoule fine","500 g"],["Beurre fondu","200 g"],["Lait tiède","80 ml"],["Levure boulangère","3 g"],["Eau de fleur d'oranger","2 c. à soupe"],["Sucre glace","pour saupoudrer"]]},{label:"Farce",rows:[["Pâte de dattes","300 g"],["Beurre fondu","20 g"],["Cannelle","1/2 c. à café"]]}],meta:{prepa:"1h + repos 2h",cuisson:"170°C · 15-18 min",pour:"20 à 25 pièces"},steps:["Mélanger la semoule et le beurre fondu, laisser reposer 2 heures à température ambiante pour que la semoule absorbe le gras.","Diluer la levure dans le lait tiède, ajouter à la semoule avec la fleur d'oranger, pétrir jusqu'à obtenir une pâte souple.","Malaxer la pâte de dattes avec le beurre fondu et la cannelle jusqu'à l'assouplir.","Façonner une boule de pâte, creuser un puits, garnir de pâte de dattes et refermer.","Presser dans un moule à maamoul pour marquer le motif, ou façonner à la main.","Cuire à 170°C pendant 15 à 18 minutes sans coloration excessive, laisser refroidir et saupoudrer de sucre glace."]},
{id:"gateaux-dattes",name:"Gâteaux aux dattes",desc:"Petit gâteau moelleux garni de pâte de dattes, parfumé à la cannelle, servi en petites parts ou en bouchées individuelles.",tables:[{label:"Pâte",rows:[["Farine","250 g"],["Beurre mou","150 g"],["Sucre","50 g"],["Levure chimique","5 g"],["Œuf","1"]]},{label:"Farce",rows:[["Pâte de dattes","250 g"],["Beurre fondu","20 g"],["Cannelle","1/2 c. à café"]]}],meta:{prepa:"45 min + repos 30 min",cuisson:"170°C · 20-25 min",pour:"20 pièces environ"},steps:["Mélanger la farine, le beurre mou, le sucre et la levure chimique, ajouter l'œuf, pétrir jusqu'à obtenir une pâte homogène.","Réfrigérer 30 minutes.","Malaxer la pâte de dattes avec le beurre fondu et la cannelle.","Étaler la moitié de la pâte, couvrir de pâte de dattes, recouvrir de l'autre moitié de pâte.","Marquer la surface au couteau pour délimiter les futures parts.","Cuire à 170°C pendant 20 à 25 minutes, laisser tiédir avant de découper en carrés ou losanges."]},
{id:"briouates-dattes",name:"Briouates aux dattes",desc:"Triangles de feuille de brick fourrés de pâte de dattes à la cannelle, frits puis trempés dans le miel chaud.",tables:[{label:"Farce",rows:[["Pâte de dattes","300 g"],["Beurre fondu","30 g"],["Cannelle","1 c. à café"],["Eau de fleur d'oranger","1 c. à soupe"]]},{label:"Montage",rows:[["Feuilles de brick","15 feuilles"],["Beurre fondu","100 g"],["Miel","300 g"],["Sésame doré","pour décorer"]]}],meta:{prepa:"50 min",cuisson:"friture · quelques min",pour:"25 pièces environ"},steps:["Malaxer la pâte de dattes avec le beurre fondu, la cannelle et la fleur d'oranger jusqu'à obtenir une farce souple.","Façonner la farce en petits bâtonnets.","Couper les feuilles de brick en bandes, badigeonner de beurre fondu, déposer la farce à une extrémité.","Plier en triangle successif jusqu'au bout de la bande.","Frire dans l'huile chaude jusqu'à coloration dorée des deux côtés.","Tremper immédiatement dans le miel chaud, égoutter, saupoudrer de sésame doré avant que le miel ne fige."]},
{id:"gateaux-oranges",name:"Gâteaux aux oranges",desc:"Petit gâteau moelleux parfumé à l'orange et à la fleur d'oranger, garni de zestes confits, léger sirop d'imbibage.",tables:[{label:"Appareil",rows:[["Farine","200 g"],["Sucre","150 g"],["Beurre mou","150 g"],["Œufs","3"],["Levure chimique","5 g"],["Zeste d'orange","1"],["Jus d'orange","50 ml"]]},{label:"Sirop",rows:[["Jus d'orange","80 ml"],["Sucre","40 g"],["Fleur d'oranger","1 c. à soupe"]]}],meta:{prepa:"25 min",cuisson:"170°C · 25-30 min",pour:"20 pièces environ (en petits moules)"},steps:["Crémer le beurre et le sucre, ajouter les œufs un à un.","Ajouter le zeste et le jus d'orange, puis la farine et la levure chimique.","Verser dans des mini-moules beurrés, cuire à 170°C pendant 25 à 30 minutes.","Préparer le sirop en chauffant le jus d'orange, le sucre et la fleur d'oranger.","Démouler tiède, imbiber généreusement de sirop.","Laisser refroidir avant de servir, éventuellement décoré de zestes confits."]},
{id:"gateaux-figues",name:"Gâteaux aux figues",desc:"Petit gâteau moelleux garni de figues séchées réhydratées et hachées, parfumé à la cannelle.",tables:[{label:"Appareil",rows:[["Farine","200 g"],["Sucre","120 g"],["Beurre mou","150 g"],["Œufs","3"],["Levure chimique","5 g"],["Figues séchées hachées","150 g"],["Cannelle","1/2 c. à café"]]}],meta:{prepa:"25 min (+ réhydratation des figues 15 min)",cuisson:"170°C · 25-30 min",pour:"20 pièces environ"},steps:["Faire tremper les figues séchées hachées dans un peu d'eau tiède 15 minutes, égoutter.","Crémer le beurre et le sucre, ajouter les œufs un à un.","Ajouter la farine, la levure chimique et la cannelle.","Incorporer les figues égouttées à la pâte.","Verser dans des mini-moules beurrés, cuire à 170°C pendant 25 à 30 minutes.","Laisser refroidir avant de démouler et servir."]},
{id:"gateaux-abricots",name:"Gâteaux aux abricots",desc:"Petit gâteau moelleux aux abricots secs, garni ou surmonté d'un demi-abricot, léger glaçage à l'abricot pour lustrer.",tables:[{label:"Appareil",rows:[["Farine","200 g"],["Sucre","120 g"],["Beurre mou","150 g"],["Œufs","3"],["Levure chimique","5 g"],["Abricots secs hachés","150 g"]]},{label:"Finition",rows:[["Confiture d'abricot","80 g"],["Amandes effilées","pour décorer"]]}],meta:{prepa:"25 min",cuisson:"170°C · 25-30 min",pour:"20 pièces environ"},steps:["Crémer le beurre et le sucre, ajouter les œufs un à un.","Ajouter la farine et la levure chimique.","Incorporer les abricots secs hachés.","Verser dans des mini-moules beurrés, cuire à 170°C pendant 25 à 30 minutes.","Démouler tiède, badigeonner de confiture d'abricot tiédie pour lustrer.","Décorer d'amandes effilées avant de servir."]},
{id:"gateaux-raisins-secs",name:"Gâteaux aux raisins secs",desc:"Petit gâteau moelleux généreusement parsemé de raisins secs macérés à la fleur d'oranger.",tables:[{label:"Appareil",rows:[["Farine","200 g"],["Sucre","130 g"],["Beurre mou","150 g"],["Œufs","3"],["Levure chimique","5 g"],["Raisins secs","150 g"],["Fleur d'oranger","1 c. à soupe"]]}],meta:{prepa:"25 min (+ macération 20 min)",cuisson:"170°C · 25-30 min",pour:"20 pièces environ"},steps:["Faire macérer les raisins secs dans la fleur d'oranger 20 minutes, égoutter en réservant le liquide.","Crémer le beurre et le sucre, ajouter les œufs un à un.","Ajouter la farine et la levure chimique, incorporer le liquide de macération.","Incorporer les raisins secs égouttés, légèrement farinés pour éviter qu'ils ne tombent au fond.","Verser dans des mini-moules beurrés, cuire à 170°C pendant 25 à 30 minutes.","Laisser refroidir avant de démouler et servir."]}
);


/* ================= RUBRIQUE CHOCOLAT ================= */


// Même logique de slug que le générateur de pages statiques (Academie/pro/recette/*.html) —
// à garder synchronisée si l'un des deux change.
function slugifyFiche(s){
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}




/* ================= RUBRIQUE CAKE DESIGN ================= */





/* ===== Rendu des rubriques Chocolat et Cake design ===== */
function cardImgHTML(groupe, name){
  var dict = groupe === 'choco' ? CHOCO_IMAGES : CD_IMAGES;
  var src = dict[name];
  if(!src) return '';
  return '<div class="card-img"><img src="' + src + '" alt="' + name + '" loading="lazy" onerror="this.parentNode.remove();"></div>';
}
function techCardHTML(t, groupe, i){
  return '<div class="card" onclick="openTechFiche(\'' + groupe + '\',' + i + ')">' +
    cardImgHTML(groupe, t.title) +
    '<h4>' + L(t.title, t.title_ar) + '</h4>' +
    '<p>' + L(t.hook, t.hook_ar) + '</p>' +
    (t.repere ? '<span class="pill">' + L(t.repere, t.repere_ar || t.repere) + '</span>' : '') +
    '</div>';
}
function recCardHTML(r, groupe, i){
  var slug = slugifyFiche(r.name) + '-' + groupe;
  return '<a class="card" href="/fr/academie/pro/recette/' + slug + '" onclick="openRecFiche2(\'' + groupe + '\',' + i + ');return false;">' +
    cardImgHTML(groupe, r.name) +
    '<h4>' + T(r.name) + '</h4>' +
    '<p>' + T(r.desc) + '</p>' +
    '<span class="pill">' + T(r.meta.pour) + '</span>' +
    '</a>';
}
function vocabHTML(list){
  return '<table><tr><th>' + L('Terme','المصطلح') + '</th><th>' + L('Définition','التعريف') + '</th></tr>' +
    list.map(function(v){ return '<tr><td><b>' + T(v.term) + '</b></td><td>' + T(v.def) + '</td></tr>'; }).join('') +
    '</table>';
}
function openTechFiche(groupe, i){
  var t = (groupe === 'choco' ? CHOCO_TECH : CD_TECH)[i];
  if(!t) return;
  dlPush('fiche_ouverte', { type: groupe === 'choco' ? 'chocolat' : 'cakedesign', fiche: t.title, langue: currentLang });
  var _dict = groupe === 'choco' ? CHOCO_IMAGES : CD_IMAGES;
  var _img = _dict[t.title] ? '<img class="fiche-img" src="' + _dict[t.title] + '" alt="' + t.title + '" onerror="this.remove();">' : '';
  document.getElementById('ficheCard').innerHTML =
    '<div class="fiche-top"><div><h3>' + L(t.title, t.title_ar) + '</h3></div>' +
    '<button class="fiche-close-btn" onclick="closeFiche()">' + L('Fermer','إغلاق') + ' &#10005;</button></div>' +
    _img +
    '<p>' + L(t.hook, t.hook_ar) + '</p>' +
    '<div class="fiche-meta">' +
      (t.repere ? '<span><b>' + L('Repère','معيار') + ' :</b> ' + L(t.repere, t.repere_ar || t.repere) + '</span>' : '') +
      (t.warn   ? '<span><b>' + L('À retenir','للتذكّر') + ' :</b> ' + L(t.warn, t.warn_ar || t.warn) + '</span>' : '') +
    '</div>';
  document.getElementById('ficheOverlay').classList.add('open');
}
function openRecFiche2(groupe, i){
  var r = (groupe === 'choco' ? CHOCO_RECIPES : CD_RECIPES)[i];
  if(!r) return;
  dlPush('fiche_ouverte', { type: groupe === 'choco' ? 'chocolat' : 'cakedesign', fiche: r.name, langue: currentLang });
  var tablesHtml = r.tables.map(function(tb){
    return '<table><tr><th>' + T(tb.label) + '</th><th class="qty">' + L('Quantité','الكمية') + '</th></tr>' +
      tb.rows.map(function(row){ return '<tr><td>' + T(row[0]) + '</td><td class="qty">' + T(row[1]) + '</td></tr>'; }).join('') +
      '</table>';
  }).join('');
  var stepsHtml = r.steps.map(function(s){ return '<li>' + T(s) + '</li>'; }).join('');
  var _dict2 = groupe === 'choco' ? CHOCO_IMAGES : CD_IMAGES;
  var _img2 = _dict2[r.name] ? '<img class="fiche-img" src="' + _dict2[r.name] + '" alt="' + r.name + '" onerror="this.remove();">' : '';
  document.getElementById('ficheCard').innerHTML =
    '<div class="fiche-top"><div><h3>' + T(r.name) + '</h3></div>' +
    '<button class="fiche-close-btn" onclick="closeFiche()">' + L('Fermer','إغلاق') + ' &#10005;</button></div>' +
    _img2 +
    '<p>' + T(r.desc) + '</p>' +
    encartSciencePro(r) +
    encartProduitPro(r) +
    '<div class="fiche-grid"><div>' + tablesHtml +
      '<div class="fiche-meta"><span><b>' + L('Prépa','التحضير') + ' :</b> ' + T(r.meta.prepa) + '</span>' +
      '<span><b>' + L('Cuisson','الطهي') + ' :</b> ' + T(r.meta.cuisson) + '</span>' +
      '<span><b>' + L('Pour','لـ') + ' :</b> ' + T(r.meta.pour) + '</span></div>' + nutritionHTML(r) +
    '</div><div><ol>' + stepsHtml + '</ol></div></div>';
  document.getElementById('ficheOverlay').classList.add('open');
}
function renderChoco(){
  document.getElementById('gridChocoTech').innerHTML = CHOCO_TECH.map(function(t,i){ return techCardHTML(t,'choco',i); }).join('');
  document.getElementById('gridChocoRec').innerHTML  = CHOCO_RECIPES.map(function(r,i){ return recCardHTML(r,'choco',i); }).join('');
  document.getElementById('chocoVocab').innerHTML    = vocabHTML(CHOCO_VOCAB);
}
function renderCd(){
  document.getElementById('gridCdTech').innerHTML = CD_TECH.map(function(t,i){ return techCardHTML(t,'cd',i); }).join('');
  document.getElementById('gridCdRec').innerHTML  = CD_RECIPES.map(function(r,i){ return recCardHTML(r,'cd',i); }).join('');
  document.getElementById('cdVocab').innerHTML    = vocabHTML(CD_VOCAB);
}
(function(){
  function brancher(navId, attr, ids){
    var nav = document.getElementById(navId);
    if(!nav) return;
    nav.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return;
      nav.querySelectorAll('button').forEach(function(x){ x.classList.remove('active'); });
      b.classList.add('active');
      var k = b.dataset[attr];
      Object.keys(ids).forEach(function(key){
        var el = document.getElementById(ids[key]);
        if(el) el.style.display = (key === k) ? (key === 'voc' ? 'block' : 'grid') : 'none';
      });
      dlPush('onglet_ouvert', { onglet: navId + ':' + k, langue: currentLang });
    });
  }
  brancher('chocoTabs','ctab',{tech:'gridChocoTech',rec:'gridChocoRec',voc:'chocoVocab'});
  brancher('cdTabs','dtab',{tech:'gridCdTech',rec:'gridCdRec',voc:'cdVocab'});
  

renderChoco(); renderCd();
})();


gridRecettes = document.getElementById('gridRecettes');
let recettesHtml = '';
recettesHtml += `<div class="fam-block"><div class="fam-title">${L('Pâtisserie marocaine','الحلويات المغربية')} (${MAROC.length})</div><div class="grid" style="margin-bottom:0;">`;
MAROC.slice().sort((a,b) => {
  const ra = MAROC_RECIPES.some(r => r.name === a.name);
  const rb = MAROC_RECIPES.some(r => r.name === b.name);
  return (ra?0:1) - (rb?0:1);
}).forEach(m => {
  const ready = MAROC_RECIPES.some(r => r.name === m.name);
  const img = MAROC_IMAGES[m.name];
  const tag = ready ? 'a' : 'div';
  const hrefAttr = ready ? `href="/fr/academie/pro/recette/${slugifyFiche(m.name)}-maroc"` : '';
  const clickAttr = ready ? `onclick="openMarocFiche('${m.name.replace(/'/g,"\\'")}');return false;"` : '';
  recettesHtml += `<${tag} class="card ${ready?'':'disabled'}" ${hrefAttr} ${clickAttr}>
    ${img ? `<img src="${img}" alt="${m.name}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:8px;" loading="lazy" decoding="async" onerror="this.style.display=\'none\'">` : ''}
    <h4>${L(m.name, m.name_ar)}</h4><span class="tag ${ready?'ready':''}">${ready?L('prêt','جاهز'):L('à venir','قريبًا')}</span>
  </${tag}>`;
});
recettesHtml += `</div></div>`;
for(const fam in FICHES_FAM){
  recettesHtml += `<div class="fam-block"><div class="fam-title">${T(fam)} (${FICHES_FAM[fam].length})</div><div class="grid" style="margin-bottom:0;">`;
  FICHES_FAM[fam].forEach(name => {
    const rec = ALL_RECIPES.find(r => r.name === name);
    const ready = !!rec;
    const tag = ready ? 'a' : 'div';
    const hrefAttr = ready ? `href="/fr/academie/pro/recette/${rec.id}"` : '';
    const clickAttr = ready ? `onclick="openRecipeFiche('${rec.id}');return false;"` : '';
    recettesHtml += `<${tag} class="card ${ready?'':'disabled'}" ${hrefAttr} ${clickAttr}>
      ${(ready && rec.img) || RECIPE_IMAGES[name] ? `<img src="${(ready && rec.img) || RECIPE_IMAGES[name]}" alt="${name}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:8px;" loading="lazy" decoding="async" onerror="this.style.display=\'none\'">` : ''}
      <h4>${T(name)}</h4><span class="tag ${ready?'ready':''}">${ready?L('prêt','جاهز'):L('à venir','قريبًا')}</span>
    </${tag}>`;
  });
  recettesHtml += `</div></div>`;
}
gridRecettes.innerHTML = recettesHtml;

const gridMaroc = document.getElementById('gridMaroc');
const MAROC_TAGS_AR = {miel:'عسل', amandes:'لوز', fetes:'مناسبات', sesame:'سمسم', ghriba:'غريبة', coco:'جوز الهند', moderne:'عصري', tous:'الكل', biscuit:'بسكويت', dattes:'تمر', fruits:'فواكه'};
function renderMaroc(filterTag){
  const sortedMaroc = [...MAROC].sort((a,b) => {
    const ra = MAROC_RECIPES.some(r => r.name === a.name);
    const rb = MAROC_RECIPES.some(r => r.name === b.name);
    return (ra?0:1) - (rb?0:1);
  });
  gridMaroc.innerHTML = sortedMaroc.map(m => {
    const hidden = filterTag !== 'tous' && !m.tags.includes(filterTag);
    const ready = MAROC_RECIPES.some(r => r.name === m.name);
    const img = MAROC_IMAGES[m.name];
    const thumb = img ? `<img src="${img}" alt="${m.name}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:8px;" loading="lazy" decoding="async" onerror="this.style.display=\'none\'">` : '';
    const tag = ready ? 'a' : 'div';
    const hrefAttr = ready ? `href="/fr/academie/pro/recette/${slugifyFiche(m.name)}-maroc"` : '';
    const clickAttr = ready ? `onclick="openMarocFiche('${m.name.replace(/'/g,"\\'")}');return false;"` : '';
    return `<${tag} class="card maroc-card ${hidden?'hidden':''} ${ready?'':'disabled'}" ${hrefAttr} ${clickAttr}>
      ${thumb}
      <h4>${L(m.name, m.name_ar)}</h4>
      ${m.tags.map(t=>`<span class="maroc-chip">${L(t, MAROC_TAGS_AR[t])}</span>`).join('')}
      <div style="margin-top:8px;"><span class="tag ${ready?'ready':''}">${ready?L('prêt','جاهز'):L('à venir','قريبًا')}</span></div>
    </${tag}>`;
  }).join('');
}
function nutritionHTML(r){
  if(!r || !r.nutrition) return '';
  const n = r.nutrition;
  const rows = [
    [L('Calories','السعرات الحرارية'), n.calories],
    [L('Lipides','الدهون'), n.fatContent],
    [L('Glucides','الكربوهيدرات'), n.carbohydrateContent],
    [L('dont sucres','منها سكريات'), n.sugarContent],
    [L('Protéines','البروتينات'), n.proteinContent],
    [L('Fibres','الألياف'), n.fiberContent],
  ].filter(row => row[1]);
  const label = n.servingSize ? n.calories + '/' + L('pièce','قطعة') : n.calories + '/100g';
  return `
    <button class="nut-toggle" onclick="var p=this.nextElementSibling;var open=p.style.display!=='none';p.style.display=open?'none':'block';this.querySelector('.nut-chevron').textContent=open?'▾':'▴';">
      🍽 ${label} <span class="nut-chevron">▾</span>
    </button>
    <div class="nut-panel">
      <p class="nut-title">${n.servingSize ? L('Valeurs nutritionnelles — ','القيم الغذائية — ') + n.servingSize : L('Valeurs nutritionnelles — pour 100 g','القيم الغذائية — لكل 100 غ')}</p>
      <div class="nut-grid">${rows.map(row => `<div><span>${row[0]}</span><strong>${row[1]}</strong></div>`).join('')}</div>
      <p class="nut-note">${n.description || ''}</p>
      <p class="nut-note"><a href="/fr/academie/pro/calculateur" style="color:#8A6A0A;">🍽 Calculer votre propre recette →</a></p>
    </div>`;
}

function openMarocFiche(name, silencieux){
  const r = MAROC_RECIPES.find(x => x.name === name);
  if(!r) return;
  dlPush('fiche_ouverte', { type:'marocain', fiche: name, langue: currentLang });
  if(!silencieux) history.pushState({fiche:'marocain', name:name}, '', '#marocain=' + encodeURIComponent(name));
  let tablesHtml = '';
  r.tables.forEach(t => {
    tablesHtml += `<table><tr><th>${T(t.label)}</th><th class="qty">${L('Qté','الكمية')}</th></tr>${t.rows.map(row=>`<tr><td>${T(row[0])}</td><td class="qty">${T(row[1])}</td></tr>`).join('')}</table>`;
  });
  const stepsHtml = r.steps.map(s => `<li>${T(s)}</li>`).join('');
  const nameAr = (MAROC.find(m=>m.name===r.name)||{}).name_ar;
  document.getElementById('ficheCard').innerHTML = `
    <div class="fiche-top">
      <div><h3>${L(r.name, nameAr)}</h3><p>${T(r.desc)}</p></div>
      <button class="fiche-close-btn" onclick="closeFiche()">${L('Fermer','إغلاق')} &#10005;</button>
    </div>
    ${encartSciencePro(r)}
    ${encartProduitPro(r)}
    <div class="fiche-grid">
      <div>${tablesHtml}
        <div class="fiche-meta"><span><b>${L('Prépa','التحضير')} :</b> ${T(r.meta.prepa)}</span><span><b>${L('Cuisson','الطهي')} :</b> ${T(r.meta.cuisson)}</span><span><b>${L('Pour','لـ')} :</b> ${T(r.meta.pour)}</span>${nutritionHTML(r)}</div>
      </div>
      <div><ol>${stepsHtml}</ol></div>
    </div>
    ${partageBoutonHTML('marocain', name, L(r.name, nameAr))}
    ${encartCataloguePro(r)}`;
  document.getElementById('ficheOverlay').classList.add('open');
}
renderMaroc('tous');
document.getElementById('tagFilters').addEventListener('click', e => {
  if(e.target.tagName !== 'BUTTON') return;
  document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  renderMaroc(e.target.dataset.tag);
});

// ---------- i18n: apply static data-fr/data-ar translations + toggle button label ----------
document.querySelectorAll('[data-fr]').forEach(el => {
  const ar = el.getAttribute('data-ar');
  if (currentLang === 'ar' && ar) { el.innerHTML = ar; }
});
const psInput = document.getElementById('proSearch');
if (psInput) { psInput.placeholder = currentLang === 'ar' ? 'ابحثوا في 692 عنصرًا…' : 'Rechercher parmi 692 fiches…'; }
const langBtn = document.getElementById('navLangBtn');
if (langBtn) { langBtn.innerHTML = currentLang === 'ar' ? 'FR / Français' : 'AR / عربي'; }

/* ============ Recherche transversale (319+ fiches) ============
   Placée en fin de script : toutes les sources (dont VOCAB, alimenté par
   plusieurs .push()) sont déclarées à ce stade. Voir règle BUG B du projet. */
let proQuery = '';

function proNorm(s){
  return (s || '').toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u0640]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, ' ')
    .trim();
}

// Index construit une seule fois, à la première recherche
let PRO_INDEX = null;
function buildProIndex(){
  const idx = [];
  const add = (label, type, fr, ar, action) => idx.push({label, type, k: proNorm(fr) + ' ' + proNorm(ar || ''), action});

  TECHNIQUES.forEach((t, i) => add(L(t.title, t.title_ar), 'technique', t.title, t.title_ar, () => openTechStory(i)));
  APPROCHE.forEach((a, i) => add(L(a.title, a.title_ar), 'approche', a.title, a.title_ar, () => openApprocheStory(i)));
  Object.keys(READY_PREPS).forEach(name => add(T(name), 'preparation', name, MAROC_TR[name], () => openPrepFiche(name)));
  ALL_RECIPES.forEach(r => add(T(r.name), 'recette', r.name, MAROC_TR[r.name], () => openRecipeFiche(r.id)));
  MAROC.forEach(m => add(L(m.name, m.name_ar), 'marocain', m.name, m.name_ar, () => openMarocFiche(m.name)));
  ASSIETTE.forEach((a, i) => add(T(a.name), 'assiette', a.name, MAROC_TR[a.name], () => openAssietteFiche(i)));
  VOCAB.forEach(v => add(T(v.term), 'vocabulaire', v.term, MAROC_TR[v.term], null));

  // Rubriques Chocolat et Cake design
  CHOCO_TECH.forEach((t, i) => add(L(t.title, t.title_ar), 'chocolat', t.title, t.title_ar, () => openTechFiche('choco', i)));
  CHOCO_RECIPES.forEach((r, i) => add(T(r.name), 'chocolat', r.name, MAROC_TR[r.name], () => openRecFiche2('choco', i)));
  CHOCO_VOCAB.forEach(v => add(T(v.term), 'chocolat', v.term, MAROC_TR[v.term], null));
  CD_TECH.forEach((t, i) => add(L(t.title, t.title_ar), 'cakedesign', t.title, t.title_ar, () => openTechFiche('cd', i)));
  CD_RECIPES.forEach((r, i) => add(T(r.name), 'cakedesign', r.name, MAROC_TR[r.name], () => openRecFiche2('cd', i)));
  CD_VOCAB.forEach(v => add(T(v.term), 'cakedesign', v.term, MAROC_TR[v.term], null));

  PRO_INDEX = idx;
  return idx;
}

const PRO_TYPE_LABEL = {
  technique:   {fr:'Techniques',        ar:'التقنيات'},
  approche:    {fr:'Approche',          ar:'المقاربة'},
  preparation: {fr:'Préparations',      ar:'التحضيرات'},
  recette:     {fr:'Recettes',          ar:'الوصفات'},
  marocain:    {fr:'Pâtisserie marocaine', ar:'الحلويات المغربية'},
  assiette:    {fr:'Desserts à l\'assiette', ar:'حلويات الطبق'},
  vocabulaire: {fr:'Vocabulaire',       ar:'المفردات'},
  chocolat:    {fr:'Chocolat',          ar:'الشوكولاتة'},
  cakedesign:  {fr:'Cake design',       ar:'تصميم الكعك'}
};

function onProSearch(v){
  proQuery = v;
  document.querySelector('.prosearch').classList.toggle('filled', v.trim().length > 0);
  renderProResults();
}
function clearProSearch(){
  proQuery = '';
  const i = document.getElementById('proSearch');
  if(i) i.value = '';
  document.querySelector('.prosearch').classList.remove('filled');
  renderProResults();
  if(i) i.focus();
}

function renderProResults(){
  const box = document.getElementById('proResults');
  const q = proNorm(proQuery);
  if(!q){ box.classList.remove('open'); box.innerHTML = ''; return; }

  const idx = PRO_INDEX || buildProIndex();
  const hits = idx.filter(x => x.k.indexOf(q) > -1).slice(0, 60);
  box.classList.add('open');

  if(!hits.length){
    box.innerHTML = '<div class="pr-empty">' + L('Aucun résultat', 'لا توجد نتائج') + '</div>';
    return;
  }

  let html = '<div class="pr-count">' + hits.length + ' ' +
    L(hits.length > 1 ? 'résultats' : 'résultat', 'نتيجة') + '</div>';

  Object.keys(PRO_TYPE_LABEL).forEach(type => {
    const grp = hits.filter(h => h.type === type);
    if(!grp.length) return;
    html += '<div class="pr-group">' + L(PRO_TYPE_LABEL[type].fr, PRO_TYPE_LABEL[type].ar) + '</div>';
    grp.forEach(h => {
      const i = idx.indexOf(h);
      html += '<div class="pr-item" onclick="proOpen(' + i + ')"><b>' + h.label + '</b>' +
              (h.action ? '' : ' <small>' + L('(glossaire)', '(معجم)') + '</small>') + '</div>';
    });
  });
  box.innerHTML = html;
}

function proOpen(i){
  const item = (PRO_INDEX || buildProIndex())[i];
  if(!item) return;
  dlPush('recherche_resultat_ouvert', { terme: proQuery.trim().toLowerCase(), type: item.type, fiche: item.label, langue: currentLang });
  if(item.action) item.action();
}

// Suivi : une mesure par recherche aboutie, pas à chaque frappe
let proSearchTimer = null;
const _onProSearchBase = onProSearch;
onProSearch = function(v){
  _onProSearchBase(v);
  clearTimeout(proSearchTimer);
  if(v.trim().length >= 3){
    proSearchTimer = setTimeout(() => {
      const q = proNorm(v);
      const n = (PRO_INDEX || buildProIndex()).filter(x => x.k.indexOf(q) > -1).length;
      dlPush('recherche', { terme: v.trim().toLowerCase(), resultats: n, langue: currentLang });
    }, 1200);
  }
};

/* ============ Passerelle Académie Pro → Catalogue ============
   Même logique que l'Espace Public, adaptée à la structure « tables » du Pro. */
const CATALOGUE_URL_PRO = '/fr/';
const MOTS_CATEGORIE_PRO = [
  { cat:'chocolat',    mots:['chocolat','cacao','ganache','couverture','praliné','gianduja'] },
  { cat:'feuilletine', mots:['feuilletine','crêpe dentelle','croustillant'] },
  { cat:'topping',     mots:['amande','noisette','pistache','noix','sésame','coco','fruits secs','pécan'] },
  { cat:'decors',      mots:['colorant','décor','vermicelle','perles','paillettes','nappage'] },
  { cat:'pate',        mots:['pâte à sucre','fondant','glaçage','pastillage'] }
];
function categoriePertinentePro(r){
  if(!r.tables) return null;
  const texte = r.tables.flatMap(t => t.rows.map(row => (row[0]||'').toLowerCase())).join(' ');
  const scores = MOTS_CATEGORIE_PRO.map(g => ({
    cat: g.cat,
    score: g.mots.filter(m => texte.indexOf(m) > -1).length
  })).filter(x => x.score > 0).sort((a,b) => b.score - a.score);
  return scores.length ? scores[0].cat : null;
}
function encartCataloguePro(r){
  const cat = categoriePertinentePro(r);
  const url = CATALOGUE_URL_PRO + (cat ? '?cat=' + cat : '') + '#catalogue';
  const titre = r && r.name ? T(r.name) : '';
  return `
    <div class="fiche-shop">
      <div class="fiche-shop-txt">
        <strong>${L("Vous produisez en volume ?","تنتجون بكميات كبيرة؟")}</strong>
        <span>${L("4Cake fournit les professionnels de la pâtisserie au Maroc en gros : chocolat, fruits secs, décors et matériel, avec tarifs et conditionnements grossiste.","4Cake تزوّد محترفي الحلويات في المغرب بالجملة: شوكولاتة، فواكه جافة، زينة وعتاد، بأسعار وتغليف بالجملة.")}</span>
      </div>
      <a class="fiche-shop-btn" href="${url}" onclick="dlPush('clic_catalogue_depuis_fiche_pro',{fiche:${JSON.stringify(titre)},categorie:${JSON.stringify(cat||'tous')}})">
        ${L("Voir les tarifs grossiste","اطّلعوا على أسعار الجملة")}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </div>`;
}

/* ---------- Prototype : Science pâtissière ----------
   SCIENCE_LIEE_PRO relie un id de recette (r.id, présent dans MAROC_RECIPES
   comme dans les 16 tableaux d'ALL_RECIPES/CHOCO_RECIPES/CD_RECIPES) aux
   fiches Science. Titres arabes non traduits ici — placeholder = titre FR,
   à corriger avant mise en ligne réelle. */
const SCIENCE_LIEE_PRO = {
  'chebakia': ['brix', 'activite-eau'],
  'flan-patissier': ['gelatinisation'],
  'macarons-chocolat': ['ph'],
  'tarte-chocolat-pro': ['emulsion'],
  'allumettes-fromage': ['gelatinisation'],
  'bavarois': ['coagulation-proteines'],
  'beignets-acacia': ['absorption-huile', 'gelatinisation'],
  'beignets-nature': ['absorption-huile', 'gelatinisation'],
  'beignets-pommes': ['absorption-huile', 'gelatinisation'],
  'bonbon-moule': ['emulsion'],
  'brioche-feuilletee': ['fermentation'],
  'buche-traditionnelle': ['brix', 'emulsion'],
  'bugnes': ['absorption-huile'],
  'cake-pops': ['emulsion'],
  'canneles': ['gelatinisation'],
  'charlotte-fraises': ['brix'],
  'choux-creme': ['gelatinisation'],
  'creme-beurre-suisse': ['emulsion'],
  'creme-brulee': ['coagulation-proteines'],
  'creme-caramel': ['coagulation-proteines'],
  'creme-viennoise': ['coagulation-proteines'],
  'crepes': ['gelatinisation'],
  'crepes-normandes': ['gelatinisation'],
  'croissant': ['fermentation'],
  'croquembouche': ['gelatinisation'],
  'dacquoise-cafe': ['emulsion'],
  'dacquoise-ganache': ['emulsion'],
  'eclairs-cafe': ['gelatinisation'],
  'entremets-marrons': ['emulsion'],
  'entremets-trois-chocolats': ['emulsion'],
  'escargot': ['fermentation'],
  'far-breton': ['gelatinisation'],
  'fraisier': ['brix'],
  'fruits-deguises': ['brix'],
  'ganache-encadrer': ['emulsion'],
  'ganache-lait-caramel': ['emulsion'],
  'ganache-masquage': ['emulsion'],
  'ganache-montee-vanille': ['emulsion'],
  'genoise-anglaise': ['coagulation-proteines'],
  'glace-vanille-chocolat': ['coagulation-proteines'],
  'gougeres': ['gelatinisation'],
  'gratin-fraises': ['coagulation-proteines'],
  'jalousie': ['gelatinisation'],
  'kugelhopf': ['fermentation'],
  'millefeuille': ['gelatinisation'],
  'moka-cafe': ['emulsion'],
  'mousse-chocolat': ['emulsion'],
  'mousse-chocolat-bombe': ['brix', 'coagulation-proteines', 'emulsion'],
  'namelaka-chocolat': ['emulsion'],
  'nougat-glace': ['brix'],
  'nougat-montelimar': ['brix'],
  'oeufs-neige': ['coagulation-proteines'],
  'oranges-givrees': ['brix'],
  'orangettes': ['brix'],
  'pain-chocolat': ['fermentation'],
  'parisbrest': ['emulsion', 'gelatinisation'],
  'petits-choux-saumon': ['gelatinisation'],
  'petits-fours-choux': ['brix', 'gelatinisation'],
  'poire-belle-helene': ['coagulation-proteines'],
  'pot-de-creme': ['coagulation-proteines'],
  'religieuses': ['emulsion', 'gelatinisation'],
  'sainthonore': ['gelatinisation'],
  'saucisson-brioche': ['fermentation'],
  'savarin': ['fermentation'],
  'sorbet-fraises': ['brix'],
  'souffle-chocolat': ['gelatinisation'],
  'souffle-fromage': ['gelatinisation'],
  'souffle-liqueur': ['gelatinisation', 'coagulation-proteines'],
  'tarte-citron': ['coagulation-proteines'],
  'tarte-pommes-alsacienne': ['coagulation-proteines'],
  'tartelettes-citron-meringuees': ['coagulation-proteines'],
  'truffes-vanille': ['emulsion'],
  'vacherin-glace': ['coagulation-proteines'],
};
const SCIENCE_TITRES_PRO = {
  'brix': { fr: 'Brix', ar: 'Brix' /* à traduire */ },
  'activite-eau': { fr: "Activité de l'eau", ar: "Activité de l'eau" /* à traduire */ },
  'ph': { fr: 'pH', ar: 'pH' },
  'gelatinisation': { fr: 'Gélatinisation', ar: 'Gélatinisation' /* à traduire */ },
  'emulsion': { fr: 'Émulsion', ar: 'Émulsion' /* à traduire */ },
  'absorption-huile': { fr: "Absorption d'huile", ar: "Absorption d'huile" /* à traduire */ },
  'fermentation': { fr: 'Fermentation', ar: 'Fermentation' /* à traduire */ },
  'coagulation-proteines': { fr: 'Coagulation des protéines', ar: 'Coagulation des protéines' /* à traduire */ },
};
const SCIENCE_ICONS_PRO = {
  'brix': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13z"/></svg>`,
  'activite-eau': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13z"/><line x1="6" y1="15" x2="18" y2="15"/></svg>`,
  'ph': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M9 2h6M10 2v6l-5 10a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V2"/></svg>`,
  'gelatinisation': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 4a8 8 0 1 0 8 8 6 6 0 1 0-6-6 4 4 0 1 0 4 4"/></svg>`,
  'emulsion': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="16" height="16"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/></svg>`,
  'fermentation': `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="16" height="16"><circle cx="12" cy="18" r="2.2"/><circle cx="8.5" cy="11.5" r="1.6"/><circle cx="14.5" cy="6.5" r="1.1"/></svg>`,
  'absorption-huile': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 2c2 4-3 5-3 9a3 3 0 0 0 6 0c0-2-1-3-1-3s2 1 2 4a5 5 0 0 1-10 0c0-5 4-6 6-10z"/></svg>`,
  'coagulation-proteines': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="16" height="16"><circle cx="6" cy="7" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="7" r="1.4" fill="currentColor" stroke="none"/><circle cx="6" cy="17" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="17" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><line x1="6" y1="7" x2="12" y2="12"/><line x1="18" y1="7" x2="12" y2="12"/><line x1="6" y1="17" x2="12" y2="12"/><line x1="18" y1="17" x2="12" y2="12"/></svg>`,
};

/* ---------- Renvoi commercial : recette -> produits 4Cake associés ---------- */
const PRODUIT_LIE_PRO = {
  'bonbon-moule': ["chocolat"],
  'bonbon-praline-feuillete': ["chocolat", "feuilletine"],
  'buche-traditionnelle': ["chocolat"],
  'cake-pops': ["chocolat"],
  'carre-chocolat': ["chocolat"],
  'cigares-chocolat': ["chocolat"],
  'croustillant-praline': ["chocolat", "feuilletine"],
  'dacquoise-ganache': ["chocolat"],
  'entremets-trois-chocolats': ["chocolat"],
  'finger-chocolat': ["chocolat"],
  'fingers': ["decors"],
  'ganache-encadrer': ["chocolat"],
  'ganache-framboise': ["chocolat"],
  'ganache-lait-caramel': ["chocolat"],
  'ganache-masquage': ["chocolat"],
  'ganache-montee-vanille': ["chocolat"],
  'gateaux-chocolat': ["chocolat"],
  'ghriba-chocolat': ["chocolat"],
  'glacage-miroir': ["chocolat"],
  'glacage-rocher': ["chocolat"],
  'glace-vanille-chocolat': ["chocolat"],
  'macarons-chocolat': ["chocolat"],
  'millefeuille': ["chocolat"],
  'mini-eclairs': ["chocolat"],
  'mini-entremets': ["chocolat"],
  'montage-etages': ["pate"],
  'mousse-chocolat': ["chocolat"],
  'mousse-chocolat-bombe': ["chocolat"],
  'namelaka-chocolat': ["chocolat"],
  'opera-marocain': ["chocolat"],
  'orangettes': ["chocolat"],
  'pain-chocolat': ["chocolat"],
  'pate-a-fleurs': ["pate"],
  'pot-de-creme': ["chocolat"],
  'prestige-cafe': ["chocolat"],
  'prestige-chocolat': ["chocolat"],
  'tablette-garnie': ["chocolat"],
  'tarte-chocolat-pro': ["chocolat", "feuilletine"],
};
const PRODUITS_INFOS_PRO = {
  'chocolat': { url: '/fr/?cat=chocolat#catalogue', fr: 'Voir nos chocolats de couverture', ar: 'شاهدوا شوكولاتة التغطية لدينا' },
  'pate': { url: '/fr/?cat=pate#catalogue', fr: 'Voir notre pâte à sucre', ar: 'شاهدوا عجينة السكر لدينا' },
  'feuilletine': { url: '/fr/?cat=feuilletine#catalogue', fr: 'Voir notre feuilletine', ar: 'شاهدوا الفوييتين' },
  'decors': { url: '/fr/?cat=decors#catalogue', fr: 'Voir nos décors & colorants', ar: 'شاهدوا الزينة والملوّنات لدينا' },
};
function encartProduitPro(r){
  const liste = r && r.id ? PRODUIT_LIE_PRO[r.id] : null;
  if(!liste || !liste.length) return '';
  const titre = r && r.name ? T(r.name) : '';
  const liens = liste.map(m => {
    const info = PRODUITS_INFOS_PRO[m];
    if(!info) return '';
    return `<a href="${info.url}" onclick="dlPush('academy_to_product_click',{recette:${JSON.stringify(titre)},produit:'${m}'})">${L(info.fr, info.ar)} →</a>`;
  }).join('');
  if(!liens) return '';
  return `<div class="fiche-produit-lien">🛒 ${L('Vous préparez cette recette professionnellement ?','هل تحضّرون هذه الوصفة باحترافية؟')} ${liens}</div>`;
}

function encartSciencePro(r){
  const liste = r && r.id ? SCIENCE_LIEE_PRO[r.id] : null;
  if(!liste || !liste.length) return '';
  const titre = r && r.name ? T(r.name) : '';
  const tags = liste.map(id => {
    const t = SCIENCE_TITRES_PRO[id];
    if(!t) return '';
    const icone = SCIENCE_ICONS_PRO[id] || '';
    return `<a href="/fr/academie/pro/science/${id}" onclick="dlPush('clic_science_depuis_fiche_pro',{fiche:${JSON.stringify(titre)},notion:'${id}'})">${icone}${L(t.fr, t.ar)}</a>`;
  }).join('');
  if(!tags) return '';
  return `
    <div class="fiche-science">
      <strong>${L("La science derrière cette recette","العلم وراء هذه الوصفة")}</strong>
      <div class="fiche-science-tags">${tags}</div>
    </div>`;
}


/* ============ Partage : Recettes et Pâtisserie marocaine uniquement ============ */
let curFicheShare = null;
function partageBoutonHTML(type, idOrName, titre){
  curFicheShare = { type, idOrName, titre };
  return `<button class="fiche-share-btn" onclick="partagerFichePro()">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M8 7l4-4 4 4"/></svg>
    ${L('Partager cette fiche','شاركوا هذه البطاقة')}
  </button>`;
}
function partagerFichePro(){
  if(!curFicheShare) return;
  const { type, idOrName, titre } = curFicheShare;
  const url = location.origin + location.pathname + '#' + type + '=' + encodeURIComponent(idOrName);
  dlPush('partage_recette', { recette: titre, langue: currentLang, espace: 'pro' });
  if(navigator.share){
    navigator.share({ title: titre, text: titre + ' — 4Cake Académie Pro', url: url }).catch(() => {});
    return;
  }
  const fini = () => {
    const b = document.querySelector('.fiche-share-btn');
    if(!b) return;
    const avant = b.innerHTML;
    b.innerHTML = L('Lien copié ✓','تم نسخ الرابط ✓');
    setTimeout(() => { b.innerHTML = avant; }, 2000);
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(fini).catch(() => window.prompt(L('Partager','مشاركة'), url));
  } else {
    window.prompt(L('Partager','مشاركة'), url);
  }
}

/* ============ Routage par ancre : #recette=id ou #marocain=nom ============
   Limité à ces deux types, sur demande. Ouvre le pilier « Techniques & recettes »
   et le bon sous-onglet avant d'afficher la fiche, pour que le contexte reste cohérent. */
function ouvrirPilierRecettes(tab){
  document.querySelectorAll('.pillar').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.pillar-panel').forEach(x => x.classList.remove('open'));
  const pillar = document.querySelector('.pillar[data-pillar="techniques"]');
  if(pillar) pillar.classList.add('active');
  const panel = document.getElementById('panel-techniques');
  if(panel) panel.classList.add('open');
  document.querySelectorAll('.subnav button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.subpanel').forEach(p => p.classList.remove('open'));
  const btn = document.querySelector('.subnav button[data-tab="' + tab + '"]');
  if(btn) btn.classList.add('active');
  const sub = document.getElementById('tab-' + tab);
  if(sub) sub.classList.add('open');
}
function ouvrirPilier(nomPilier){
  document.querySelectorAll('.pillar').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.pillar-panel').forEach(x => x.classList.remove('open'));
  const pillar = document.querySelector('.pillar[data-pillar="' + nomPilier + '"]');
  if(pillar) pillar.classList.add('active');
  const panel = document.getElementById('panel-' + nomPilier);
  if(panel) panel.classList.add('open');
}
function appliquerHashPro(){
  const h = decodeURIComponent(location.hash || '').replace(/^#/, '');
  const mRec = h.match(/^recette=(.+)$/);
  const mMar = h.match(/^marocain=(.+)$/);
  const mCho = h.match(/^chocolat=(.+)$/);
  const mCD  = h.match(/^cakedesign=(.+)$/);
  if(mRec && ALL_RECIPES.some(r => r.id === mRec[1])){
    ouvrirPilierRecettes('recettes');
    openRecipeFiche(mRec[1], true);
    return;
  }
  if(mMar && MAROC_RECIPES.some(r => r.name === mMar[1])){
    ouvrirPilierRecettes('maroc');
    openMarocFiche(mMar[1], true);
    return;
  }
  if(mCho){
    const nom = mCho[1];
    let idx = CHOCO_TECH.findIndex(t => t.title === nom);
    if(idx !== -1){ ouvrirPilier('chocolat'); openTechFiche('choco', idx); return; }
    idx = CHOCO_RECIPES.findIndex(r => r.name === nom);
    if(idx !== -1){ ouvrirPilier('chocolat'); openRecFiche2('choco', idx); return; }
  }
  if(mCD){
    const nom = mCD[1];
    let idx = CD_TECH.findIndex(t => t.title === nom);
    if(idx !== -1){ ouvrirPilier('cakedesign'); openTechFiche('cd', idx); return; }
    idx = CD_RECIPES.findIndex(r => r.name === nom);
    if(idx !== -1){ ouvrirPilier('cakedesign'); openRecFiche2('cd', idx); return; }
  }
  if(mRec || mMar || mCho || mCD) history.replaceState({}, '', location.pathname + location.search); // ancre inconnue : on nettoie
  closeFiche(true);
}
window.addEventListener('popstate', appliquerHashPro);
appliquerHashPro();
