import React, { useState, useEffect } from 'react';
import './UpdateRecipe.css';

function UpdateRecipe({ recipe, onUpdate }) {
  const [formData, setFormData] = useState({
    title: recipe.title || '',
    ingredients: recipe.ingredients ? recipe.ingredients.join(', ') : '',
    instructions: recipe.instructions || '',
    nutritionalFacts: recipe.nutritionalFacts || ''
  });

  useEffect(() => {
    // Update form state when recipe prop changes
    setFormData({
      title: recipe.title || '',
      ingredients: recipe.ingredients ? recipe.ingredients.join(', ') : '',
      instructions: recipe.instructions || '',
      nutritionalFacts: recipe.nutritionalFacts || ''
    });
  }, [recipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedRecipe = {
        ...formData,
        ingredients: formData.ingredients.split(',').map(item => item.trim())
      };

      await fetch(`/recipes/${recipe._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecipe)
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  return (
    <div className="update-recipe">
      <h2 className="update-title">Update Recipe</h2>
      <form className="update-form" onSubmit={handleSubmit}>
        <label className="update-label">Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="update-input"
        />

        <label className="update-label">Ingredients (comma-separated):</label>
        <textarea
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          className="update-textarea"
        />

        <label className="update-label">Instructions:</label>
        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          className="update-textarea"
        />

        <label className="update-label">Nutritional Facts:</label>
        <textarea
          name="nutritionalFacts"
          value={formData.nutritionalFacts}
          onChange={handleChange}
          className="update-textarea"
        />

        <button type="submit" className="update-button">Save Changes</button>
      </form>
    </div>
  );
}

export default UpdateRecipe;
