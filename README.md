![keyboard](https://github.com/INVERATE/nodeJS_project/blob/master/pictures/img.png?raw=true)

# Clavier virtuel avec prédictions 🟥🟨🟦⌨️
***Néo COLPIN / Fanny BADOULES / Thibault MORETTI***

Ce clavier virtuel met en évidence les lettres les plus probables à taper en fonction :

 - des mots précédents
 - des lettres déjà saisies dans le mot en cours
 - des mots existants dans un dictionnaire

 Il permet d'avoir un aperçu rapide des lettres qui vont avoir le plus de chance d'être utilisées pour le mot qui est actuellement écrit par l'utilisateur.

## ✨ Fonctionnalités
Les fonctionnalités principales sont :

 - Mise en valeur dynamique des lettres en fonction du contexte
 - Différents niveaux de surbrillance selon la probabilité :
	 - Lettre neutre : pas de surbrillance
	 - Probabilité entre 10–20 % : jaune
	 - Probabilité > 20 % : rouge



## 📚 Corpus
L'algorithme se base sur un corpus des **livres de Harry Potter**. Nous avons décidé de choisir ce corpus de par sa longueur et sa bonne complexité en terme d'enchainement de mots. Les phrases sont en effet bien construites, sans non plus être trop littéraire, ce qui aurait pu en limiter l'usage dans un contexte de rédaction de texte pour le grand public. C'est pourquoi nous avons évité d'utiliser des textes plus anciens comme la Comédie humaine de Balzac.

**⚠️ Limite actuelle :** L'univers de Harry Potter contient des mots spécifiques (moldu, Voldemort, etc.), ce qui peut biaiser certaines prédictions.


> C’est un début, dit Voldemort. Mais Thicknesse n’est qu’un individu isolé. Pour que je puisse agir, il faut que Scrimgeour soit entouré de gens qui nous sont acquis.

**🔧 Amélioration possible :** Il serait tout à fait possible de perfectionner ce corpus en ajoutant plutôt des textes extraits de Wikipédia ou de site de journal grâce à du Web scraping.


## 🔗 Modèle utilisé : chaîne de Markov


![markov_word](https://miro.medium.com/v2/resize:fit:519/1*3HSQl6UoNmnS1BgD5do_qg.png)

Une chaîne de Markov est un modèle probabiliste dans lequel la probabilité d’un événement dépend uniquement de l’état précédent.
Dans notre cas, la probabilité qu’une lettre apparaisse dépend :
 - *transition des lettres :* des lettres du mot en cours
 - *transition des mots :* des mots précédemment saisis (jusqu'à 2 pour notre implémentation)



## 🖥️ Interface graphique avec Electron
![enter image description here](https://miro.medium.com/v2/resize:fit:1400/1*pZSdLbXSCEDZRFjTuapE5Q.png)
Nous avons choisi Electron comme solution d'interface graphique plutôt qu’un affichage en terminal afin de rendre l’outil plus visuel, interactif et intuitif. Electron permet de créer des applications de bureau à l’aide de technologies web (HTML, CSS, JavaScript) tout en s'appuyant sur Node.js pour accéder aux fonctionnalités système.

**📎 Architecture de l'application Electron :** 

Pour mettre en place notre application Electron, nous avons utilisé les fichiers suivants :
 - package.json, pour les dépendances 
 - main.js, point d’entrée de l’application, il configure et lance la fenêtre Electron
 - preload.js, passerelle sécurisée entre le code Node.js (backend) et le navigateur (frontend)
 - keyboard.html, affichage de l'interface utilisateur
 - keyboard.js, qui contient le code du clavier (positionnement des touches, etc)
 - keyboard.css, définit le style visuel du clavier

Pour l'intégration du clavier en HTML/CSS/JS, nous avons utilisé [cette source](https://www.geeksforgeeks.org/html/build-a-virtual-keyboard-using-html-css-javascript/).

Dans un premier temps, nous avons fait le lien manuellement, en passant par la conversion de CommonJS (avec require) en ES Module (avec import et export). Nous utilisions par exemple des fichiers .mjs et .js qui spécifiaient si celui-ci devait être utilisé en tant qu’ES Module ou CommonJS.
Cette approche fonctionnait jusqu'à ce que nous commencions à intégrer Ramda. Nous avons alors rencontré de nombreux problèmes d'importation. En effet, Ramda ne s’intégrait pas bien en CommonJS, contrairement au reste de notre code.
Nous avons tenté différentes solutions :
 - Import direct via preload.js
 - Utilisation de versions minifiées de Ramda via CDN
...mais sans succès.

C'est alors que nous avons fait le choix d'un Bundle ESBuild. 

**👓 Mise en place d’un bundler avec esbuild :**

Un bundle est un fichier JavaScript généré automatiquement, qui regroupe et transforme tous les modules nécessaires (imports, exports, librairies...), afin de les rendre compatibles dans un seul fichier.
Pour mettre en place notre Bundle ESBuild, nous avons utilisé le fichier suivant :
 - build.js, ce fichier va rendre compatible ensemble les fichiers et créer un fichier final à exécuter (ici renderer.bundle.js)

Ainsi quand nous modifions le code, nous devons lancer npm run build pour mettre à jour le Bundle.
Ce fichier final, compatible avec Electron, est ensuite référencé dans le HTML pour être exécuté.

## ▶️ Lancer le code
Pour lancer le projet et avoir l'affichage, il est nécessaire d'avoir npm installé sur sa machine. Il faut ensuite exécuter les commandes suivantes dans le terminal :

    npm install
	npm install electron --save-dev
	npm install --save-dev esbuild
    cd keyboard
    npm run build
    npm start

Vous pouvez aussi lancer un serveur en local avec `node server.js`, puis ouvrez votre navigateur et allez à l'adresse :  [http://localhost:3000](http://localhost:3000/)
## 🧪 Tester la prédiction dans le terminal
Il est aussi possible de tester la prédiction directement dans le terminal via le fichier test_prediction.js.
C’est une méthode simple et efficace pour le debug, plus rapide que d'utiliser les outils développeur du navigateur ou d’Electron.


    // Exemple de test de prédiction
    const context = ["vous", "etes"];
    const currentWord = "be"; // MODIFIER ICI POUR TESTER UNE AUTRE PREDICTION
    const nextLetterProbs = predictNextLetters(context, currentWord);
    console.log("Probabilités :", nextLetterProbs);

📌 **Limite du contexte :**
Nous utilisons un maximum de 2 mots précédents.
Au-delà, les combinaisons deviennent trop rares dans le corpus, et les fichiers de probabilités deviennent très volumineux (plusieurs centaines de Mo pour 4 ou 5 mots de contexte).