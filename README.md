# Recipe Sharing Web Platform

## Core Idea
A web platform that allows users to browse and share recipes. Users can interact with the ChatGPT API to receive personalized recipe suggestions, cooking tips, and nutritional advice, enhancing user engagement by providing tailored content and answers to their cooking-related questions.

---

## Key Features

### Recipe Upload
- Users can submit recipes with fields for:
  - Title
  - Ingredients
  - Instructions
  - Nutritional facts

### Recipe Search
- A robust search functionality that allows users to find recipes based on:
  - Ingredients
  - Dish names

### ChatGPT Integration
- Users can ask cooking-related questions, such as:
  - "What can I make with chicken and broccoli?"
  - "How do I make a vegan version of this recipe?"
  - "What are some tips for baking a cake?"
- The ChatGPT API provides real-time:
  - Suggestions
  - Cooking advice
  - Recipe modifications
 
### User Authentication
- Users can register to be able to add, edit and update a recipe
- If they are not logged in, they can only search for recipes using the search bar, and see the details of a recipe by hovering over it's card 

---

## Tools and Technologies

- **Back-end**: Node.js
- **Front-end**: React
- **Database**: MongoDB

---

## Team Members

| Name              | Role                |
|-------------------|---------------------|
| **Bica Doru**     | Backend, Team Leader |
| **Badea Vlad**    | Backend, Database   |
| **Birou Rares**   | Backend             |
| **Bobes Bianca**  | Frontend, SCRUM Master |
| **Plavosin Vlad** | Frontend, QA        |
| **Bolchis Razvan**| Frontend, QA        |

---

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/BicaDoru/birouscuisine.git
   ```
2. Install dependencies:
   ```bash
   cd client/cd server
   npm install
   ```
3. Start the development server:
   ```bash
   node server.js ### by switching to the "server" directory
   npm run start ### by switching to the "client" directory
   ```

---

## Future Improvements
- Add user roles, such as administrator and basic user.
- Implement recipe ratings and comments.
- Enhance ChatGPT responses with more precise nutritional insights.
- Allow users to save and organize their favorite recipes.
- Ability to add photos and videos of the cooking process.

---
