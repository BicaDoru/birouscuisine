import React, { useState } from 'react';
import './AddRecipe.css';

function AddRecipe({ onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    nutritionalFacts: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRecipe = {
        ...formData,
        ingredients: formData.ingredients.split(',').map(item => item.trim()) // Convert to array
      };

      await fetch('/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe)
      });
      onAdd(); // Callback to refresh recipes list after addition
      setFormData({ title: '', ingredients: '', instructions: '', nutritionalFacts: '' }); // Reset form
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  return (
    <div className="add-recipe">
      <h2 className="add-title">Add New Recipe</h2>
      <form className="add-form" onSubmit={handleSubmit}>
        <label className="add-label">Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="add-input"
        />

        <label className="add-label">Ingredients (comma-separated):</label>
        <textarea
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          className="add-textarea"
        />

        <label className="add-label">Instructions:</label>
        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          className="add-textarea"
        />

        <label className="add-label">Nutritional Facts:</label>
        <textarea
          name="nutritionalFacts"
          value={formData.nutritionalFacts}
          onChange={handleChange}
          className="add-textarea"
        />

        <button type="submit" className="add-button">Add Recipe</button>
      </form>
    </div>
  );
}

export default AddRecipe;
