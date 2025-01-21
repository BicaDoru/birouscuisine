require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const RecipeService = require('./services/RecipeService');
const authRoutes = require('./authRoutes');
const auth = require('./services/auth');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set token limit for responses
const MAX_TOKENS = 500; // This can be adjusted based on response length needed

// ChatGPT endpoint focused on kitchen-related conversations
app.post('/chatgpt', async (req, res) => {
  try {
    const { message } = req.body;

    // Constructing a kitchen-related prompt for the AI
    const kitchenPrompt = `Provide a kitchen-related answer: ${message}. Answer should be about cooking, recipes, kitchen tips, or ingredients. If text is in romanian, respond in romanian.`;

    // Request to OpenAI API with token limit
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // More cost-effective model
      messages: [{ role: 'user', content: kitchenPrompt }],
      max_tokens: MAX_TOKENS, // Limit token count to control response size
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('Error interacting with OpenAI:', error);
    res.status(500).json({ message: 'Error interacting with ChatGPT' });
  }
});

// GET all recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await RecipeService.getAllRecipes();
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving recipes' });
  }
});

// GET recipe by ID
app.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await RecipeService.getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving recipe' });
  }
});

// POST a new recipe
app.post('/recipes', async (req, res) => {
  try {
    const recipe = await RecipeService.createRecipe(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating recipe' });
  }
});

// PUT update a recipe by ID
app.put('/recipes/:id', async (req, res) => {
  try {
    const updatedRecipe = await RecipeService.updateRecipe(req.params.id, req.body);
    if (!updatedRecipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(updatedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating recipe' });
  }
});

// DELETE a recipe by ID
app.delete('/recipes/:id', async (req, res) => {
  try {
    const deletedRecipe = await RecipeService.deleteRecipe(req.params.id);
    if (!deletedRecipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting recipe' });
  }
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.error('MongoDB connection error:', error));
