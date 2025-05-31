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
Nous avons choisi Electron pour l’interface graphique, plutôt qu’un affichage en terminal, afin de rendre l’outil plus visuel et interactif, et faciliter l’intégration HTML/CSS pour styliser les lettres.

Cela a aussi introduit des difficultés en frontend : gestion des événements, rafraîchissement du clavier, synchronisation entre la saisie et les prédictions...

[Source pour le clavier](https://www.geeksforgeeks.org/html/build-a-virtual-keyboard-using-html-css-javascript/)


## ▶️ Lancer le code
Pour lancer le projet et avoir l'affichage, il est nécessaire d'avoir npm installé sur sa machine. Il faut ensuite exécuter les commandes suivantes dans le terminal :

    npm install
	npm install electron --save-dev
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