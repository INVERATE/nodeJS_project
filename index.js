import * as R from "ramda";
import fs from "fs-extra";

// Fonction pour catégoriser un âge
const getAgeCategory = (age) => {
    const n = parseInt(age, 10);
    if (n <= 12) return "enfant";
    if (n <= 18) return "ado";
    if (n <= 26) return "jeune_adulte";
    if (n <= 40) return "adulte";
    if (n <= 60) return "adulte-avancé";
    return "senior";
};

const main = () => {
    const ds = fs.readJsonSync("./datasets/csvjson.json");

    // Ajouter la catégorie d'âge à chaque utilisateur
    const withAgeCategory = R.map(user => ({
        ...user,
        Age_Category: getAgeCategory(user.Age)
    }), ds);

    // Affichage global
    console.log(`Total utilisateurs : ${R.length(withAgeCategory)}`);

    // Répartition par pays
    const usersByCountry = R.countBy(R.prop("Country"), withAgeCategory);
    console.log("\n📊 Répartition par pays :");
    console.table(usersByCountry);

    // Répartition par genre préféré
    const genreStats = R.countBy(R.prop("Favorite_Genre"), withAgeCategory);
    console.log("\n🎬 Répartition des genres préférés :");
    console.table(genreStats);

    // Répartition par catégorie d'âge
    const ageCategoryStats = R.countBy(R.prop("Age_Category"), withAgeCategory);
    console.log("\n Répartition par catégorie d'âge :");
    console.table(ageCategoryStats);

    const genreFavorisAge = R.countBy(R.prop("Favorite_Genre"), withAgeCategory);
    console.log("\n Genre de film par catégorie d'âge :");
    console.table(genreFavorisAge);

    // Répartition des genres de film par catégorie d'âge
    const genreParCategorieAge = R.pipe(
        R.groupBy(R.prop("Age_Category")), // Regroupe par âge
        R.map(R.countBy(R.prop("Favorite_Genre"))) // Pour chaque groupe, compte les genres
    )(withAgeCategory);

    console.log("\n🎞️ Genre de film préféré par catégorie d'âge :");

    for (const [categorie, genres] of Object.entries(genreParCategorieAge)) {
        console.log(`\n📂 Catégorie d'âge : ${categorie}`);
        console.table(genres);
    }

};

main();
