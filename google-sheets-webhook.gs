/**
 * 4CAKE — Réception des demandes de devis dans Google Sheets
 * =============================================================
 *
 * CE QUE FAIT CE SCRIPT :
 * Chaque fois qu'un client envoie une demande de devis depuis www.4cake.ma,
 * une nouvelle ligne est ajoutée en bas de l'onglet "Demandes" — jamais
 * d'écrasement des lignes précédentes.
 *
 * INSTALLATION (à faire une seule fois) :
 * 1. Allez sur https://sheets.google.com et créez un nouveau classeur,
 *    par exemple nommé "4Cake - Demandes de devis".
 * 2. Renommez le premier onglet en "Demandes" (exactement ce nom).
 * 3. Dans la ligne 1, ajoutez ces en-têtes de colonnes (A à L) :
 *    ID | Date | Société | Contact | Téléphone | Ville | Fréquence |
 *    Produits | Montant estimé (MAD) | Message | Statut | Notes
 * 4. Menu "Extensions" → "Apps Script".
 * 5. Supprimez le code par défaut, collez TOUT le contenu de ce fichier.
 * 6. Cliquez sur l'icône de sauvegarde (💾).
 * 7. Cliquez sur "Déployer" → "Nouveau déploiement".
 *    - Type : "Application Web"
 *    - Exécuter en tant que : Moi (votre compte)
 *    - Qui a accès : "Tout le monde"
 * 8. Cliquez "Déployer", autorisez l'accès (c'est votre propre script,
 *    Google demande une confirmation de sécurité), puis copiez l'URL
 *    donnée (elle ressemble à https://script.google.com/macros/s/XXXX/exec).
 * 9. Collez cette URL dans index.html à la ligne :
 *    const GOOGLE_SHEET_WEBHOOK = 'REMPLACER_PAR_VOTRE_URL_APPS_SCRIPT';
 *
 * PARTAGE DU FICHIER :
 * Dans Google Sheets, bouton "Partager" en haut à droite → ajoutez les
 * adresses email des personnes qui doivent voir les demandes (accès
 * "Lecteur" pour consultation seule, ou "Éditeur" si elles doivent
 * mettre à jour la colonne Statut).
 *
 * IMPORTANT :
 * - Si vous modifiez à nouveau le script plus tard, il faut créer un
 *   NOUVEAU déploiement (ou gérer les déploiements existants) pour que
 *   les changements soient pris en compte par l'URL déjà utilisée.
 * - Ce script n'écrase jamais de données : il utilise appendRow(), qui
 *   ajoute toujours une nouvelle ligne à la fin.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Demandes");
    var data = JSON.parse(e.postData.contents);

    // Calcule un ID simple basé sur le nombre de lignes déjà présentes
    var lastRow = sheet.getLastRow();
    var newId = lastRow; // ligne 1 = en-têtes, donc l'ID suit naturellement

    sheet.appendRow([
      newId,
      data.date || "",
      data.company || "",
      data.name || "",
      data.phone || "",
      data.city || "",
      data.freq || "",
      data.products || "",
      data.total || 0,
      data.message || "",
      "Nouveau",   // Statut par défaut — à modifier manuellement ensuite
      ""           // Notes internes — à remplir manuellement
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Fonction de test — exécutez-la manuellement dans l'éditeur Apps Script
 * (bouton ▶ Exécuter) pour vérifier qu'une ligne de test s'ajoute bien
 * à votre feuille, avant de brancher le vrai site.
 */
function testAppend() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        date: "29 juillet 2026 à 15:42",
        company: "Test Société",
        name: "Test Contact",
        phone: "0600000000",
        city: "Casablanca",
        freq: "Ponctuelle",
        products: "Topping Caramel x2 | Feuilletine nature x1",
        total: 350,
        message: "Ceci est un test"
      })
    }
  };
  doPost(fakeEvent);
}
