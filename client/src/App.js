import React, { useState, useEffect } from 'react';
import './App.css';
import headerImage from './assets/header.png';
import UpdateRecipe from './UpdateRecipe';
import AddRecipe from './AddRecipe';
import Fuse from 'fuse.js'; // Import Fuse.js for fuzzy search

function getRandomColor() {
  const colors = ['#D6D46D', '#F4DFB6', '#DE8F5F', '#9A4444'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function App() {
  const [recipes, setRecipes] = useState([]);
  const [recipeColors, setRecipeColors] = useState([]); // New state to store colors
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]); // State to store filtered recipes
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showRegisterPage, setShowRegisterPage] = useState(false);
  const [loggedinusername, setLoggedinUsername] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/recipes');
      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data); // Initially, show all recipes
      setRecipeColors(data.map(() => getRandomColor()));
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    // Fuzzy search logic using Fuse.js
    if (searchTerm.trim() === '') {
      setFilteredRecipes(recipes); // Show all recipes if search is empty
    } else {
      const fuse = new Fuse(recipes, {
        keys: ['title'], // Fields to search in
        threshold: 0.1, // Sensitivity of the fuzzy search (lower value = more sensitive)
      });

      const result = fuse.search(searchTerm);
      setFilteredRecipes(result.map(({ item }) => item)); // Set filtered recipes
    }
  };

  const handleCardClick = (index) => {
    if (!loggedinusername) {
      alert("You must be logged in to edit or delete a recipe.");
      return;
    }
    setActiveIndex(index === activeIndex ? null : index);
  };

  const handleEditClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleDeleteClick = async (recipeId) => {
    try {
      await fetch(`/recipes/${recipeId}`, {
        method: 'DELETE',
      });
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleAddRecipeClick = () => {
    setShowAddForm(true);
  };

  const handleAddComplete = () => {
    setShowAddForm(false);
    fetchRecipes();
  };

  const handleUpdateComplete = () => {
    setSelectedRecipe(null);
    fetchRecipes();
  };

  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setChatMessages([...chatMessages, { sender: 'user', text: userMessage }]);

    try {
      const response = await fetch('/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: data.reply }
      ]);
      setUserMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLoginClick = () => {
    setShowLoginPage(true);
  };

  const handleRegisterClick = () => {
    setShowRegisterPage(true);
  };

  const handleReturnToMain = () => {
    setShowLoginPage(false);
    setShowRegisterPage(false);
  };

  const handleLogout = () => {
    setLoggedinUsername('');
    localStorage.removeItem('authToken');
    alert('You have been logged out.');
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const username = document.querySelector('.login-page .form input[placeholder="Username"]').value;
    const password = document.querySelector('.login-page .form input[placeholder="Password"]').value;

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        console.log('Token:', data.token);
        localStorage.setItem('authToken', data.token);
        setLoggedinUsername(username);
        handleReturnToMain();
      } else {
        alert(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred while logging in. Please try again.');
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const username = document.querySelector('.register-page .form input[placeholder="Username"]').value;
    const password = document.querySelector('.register-page .form input[placeholder="Password"]').value;

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Displays "User registered successfully"
        handleReturnToMain();
      } else {
        alert(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('An error occurred while registering. Please try again.');
    }
  };

  return (
    <div className="App">
      {/* Render the header and authentication buttons */}
      <header className="header" style={{ backgroundImage: `url(${headerImage})` }}>
        <h1 className="header-title">Welcome to Birou's Cuisine</h1>
        {!showLoginPage && !showRegisterPage && (
          <div className="auth-buttons">
            {loggedinusername ? (
              <>
                <p className="header-title">Welcome, {loggedinusername}!</p>
                <button className="add-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="add-button" onClick={handleLoginClick}>
                  Login
                </button>
                <button className="add-button" onClick={handleRegisterClick}>
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Render login and register pages or recipe cards */}
      {showLoginPage ? (
        <div className="login-page">
          <form className="form">
            <h2>Login</h2>
            <input type="text" placeholder="Username" className="form-input" />
            <input type="password" placeholder="Password" className="form-input" />
            <button type="button" className="add-button" onClick={handleLoginSubmit}>Login</button>
            <button className="add-button" onClick={handleReturnToMain}>Return to Main Page</button>
          </form>
        </div>
      ) : showRegisterPage ? (
        <div className="register-page">
          <form className="form">
            <h2>Register</h2>
            <input type="text" placeholder="Username" className="form-input" />
            <input type="email" placeholder="Email" className="form-input" />
            <input type="password" placeholder="Password" className="form-input" />
            <button type="button" className="add-button" onClick={handleRegisterSubmit}>Register</button>
            <button className="add-button" onClick={handleReturnToMain}>Return to Main Page</button>
          </form>
        </div>
      ) : showAddForm ? (
        <AddRecipe onAdd={handleAddComplete} />
      ) : selectedRecipe ? (
        <UpdateRecipe recipe={selectedRecipe} onUpdate={handleUpdateComplete} />
      ) : (
        <div>
          <div className="navbar">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            {loggedinusername && ( // Only show the button if the user is logged in
              <button className="add-button" onClick={handleAddRecipeClick}>Add Recipe</button>
            )}
          </div>
          <div className="recipes">
  {filteredRecipes.map((recipe, index) => (
    <div
      key={recipe._id}
      className="recipe-card"
      style={{ backgroundColor: recipeColors[index] }}
      onClick={() => handleCardClick(index)} // Updated function
    >
      <h2>{recipe.title}</h2>

      {activeIndex === index ? (
        <div className="card-buttons">
          {loggedinusername ? (
            <>
              <button onClick={() => handleEditClick(recipe)}>Edit</button>
              <button onClick={() => handleDeleteClick(recipe._id)}>Delete</button>
            </>
          ) : (
            <p>You must be logged in to perform actions.</p>
          )}
        </div>
      ) : (
        <div className="recipe-info">
          <p><strong>Ingredients: </strong>{Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients}</p>
          <p><strong>Instructions: </strong>{recipe.instructions}</p>
          <p><strong>Nutritional facts: </strong>{recipe.nutritionalFacts}</p>
        </div>
      )}
    </div>
  ))}
</div>
        </div>
      )}

      {/* ChatGPT popup */}
      <div className="chatgpt-popup" onClick={toggleChat}>
        💬
      </div>

      {chatVisible && (
        <div className="chatgpt-container">
          <div className="chatgpt-header">Chat with ChefGPT</div>
          <div className="chatgpt-messages">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === 'user' ? 'chatgpt-user' : 'chatgpt-ai'}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatgpt-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask something about cooking..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
