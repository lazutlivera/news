# Northcoders News API

You can access this project at: [Hosted Link](https://nc-news-dgn.onrender.com/api)

## Project Summary

This API allows users to create, modify, update and delete articles, topics, users, and comments and supprts sorting and filtering to manage news content.

## Requierments

Make sure you have the following installed:

- **Node.js**: v14.x.x or higher
- **PostgreSQL**: v12.x.x or higher

### Installation

1. **Clone the repository:**

   git clone https://github.com/lazutlivera/news.git

2. **Install Dependencies:**

   npm install

3. **Setup Environment Variables:**

   Please create two .env files in the root directory: one named .env.test with `**PGDATABASE=nc_news_test**`, and another named .env.development with `**PGDATABASE=nc_news**`.

4. **Set up and seed the database:**

   npm run setup-dbs
   npm run seed

5. **Run the app:**

   npm start

6. **Run tests:**

   npm test

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
