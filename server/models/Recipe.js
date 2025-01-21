const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  ingredients: {
    type: [String],
    required: [true, 'Ingredients are required'],
  },
  instructions: {
    type: String,
    required: [true, 'Instructions are required'],
  },
  nutritionalFacts: {
    type: String,
    required: [true, 'Nutritional facts are required'],
  },
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
