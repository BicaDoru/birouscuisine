// services/recipeService.js
const Recipe = require('../models/Recipe');

// Create a new recipe
async function createRecipe(data) {
  const recipe = new Recipe(data);
  return await recipe.save();
}

// Get all recipes
async function getAllRecipes() {
  return await Recipe.find();
}

// Update a recipe by ID
async function updateRecipe(id, data) {
  return await Recipe.findByIdAndUpdate(id, data, { new: true });
}

// Delete a recipe by ID
async function deleteRecipe(id) {
  return await Recipe.findByIdAndDelete(id);
}

module.exports = {
  createRecipe,
  getAllRecipes,
  updateRecipe,
  deleteRecipe
};
