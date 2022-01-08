const express = require("express");
const app = express();
const path = require("path");
db = null;
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//GET Movies Method
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `SELECT movie_name FROM movie ORDER BY movie_id`;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});

//POST Movie Method
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postMovieQuery = `INSERT INTO movie (director_id,movie_name,lead_actor) 
    VALUES (
        ${directorId},
        '${movieName}',
        '${leadActor}');`;
  await db.run(postMovieQuery);
  response.send("Movie Successfully Added");
});
//GET Movie Method
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
  SELECT * FROM movie WHERE movie_id = ${movieId};
  `;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
});

//Update Movie Query
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `UPDATE
        MOVIE
     SET
        director_id='${directorId}',
        movie_name='${movieName}',
        lead_actor=${leadActor}
     WHERE
        movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

//DELETE Movie API
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `DELETE FROM movie WHERE movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//GET Directors API
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `SELECT * FROM director ORDER BY director_id`;
  const directorsArray = await db.all(getDirectorsQuery);
  response.send(directorsArray);
});

//GET Movies By Directors API
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMovieQuery = `SELECT movie_name FROM MOVIE
    WHERE director_id = ${directorId}
    ORDER BY movie_id;`;
  const moviesArray = await db.all(getMovieQuery);
  response.send(moviesArray);
});

module.exports = app;
