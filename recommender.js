const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const path = require("path");
//this helps with differemt file paths
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/images', express.static(path.join(__dirname, 'images')));




const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'MovieDB'
});

connection.connect();

app.use(express.static('public'));

app.get('/get_movies', (req, res) => {
    connection.query('SELECT movie_id, title, genre, plot FROM movies', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/get_movie', (req, res) => {
    const movieId = req.query.movie_id;
    connection.query('SELECT * FROM movies WHERE movie_id = ?', [movieId], (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        res.status(404).json({ message: 'Movie not found' });
      } else {
        res.json(results[0]);
      }
    });
  });

app.get('/get_recommendations', (req, res) => {
    const movieId = req.query.movie_id;
    connection.query('SELECT * FROM movies WHERE movie_id = ?', [movieId], (error, results) => {
        if (error) throw error;
        const selectedMovie = results[0];
        connection.query('SELECT * FROM movies', (error, allMovies) => {
            if (error) throw error;
            const recommendations = getRecommendations(selectedMovie, allMovies);
            res.json(recommendations);
        });
    });
});

function getRecommendations(selectedMovie, allMovies) {
    const tfidf = calculateTFIDF(allMovies);
    const selectedMovieIndex = allMovies.findIndex(movie => movie.movie_id == selectedMovie.movie_id);
    const cosineSim = calculateCosineSimilarity(tfidf, selectedMovieIndex);
    return cosineSim
        .map((score, index) => ({ movie: allMovies[index], score }))
        .sort((a, b) => b.score - a.score)
        .slice(1, 6); // Get top 5 recommendations
}

function calculateTFIDF(movies) {
    const tfidf = [];
    const documentCount = movies.length;
    const termFrequency = movies.map(movie => {
        const terms = (movie.genre + ' ' + movie.plot).toLowerCase().split(/\W+/);
        const termCount = {};
        terms.forEach(term => {
            termCount[term] = (termCount[term] || 0) + 1;
        });
        return termCount;
    });

    const documentFrequency = {};
    termFrequency.forEach(termCount => {
        Object.keys(termCount).forEach(term => {
            documentFrequency[term] = (documentFrequency[term] || 0) + 1;
        });
    });

    termFrequency.forEach(termCount => {
        const tfidfVector = {};
        Object.keys(termCount).forEach(term => {
            const tf = termCount[term] / Object.keys(termCount).length;
            const idf = Math.log(documentCount / (1 + documentFrequency[term]));
            tfidfVector[term] = tf * idf;
        });
        tfidf.push(tfidfVector);
    });

    return tfidf;
}

function calculateCosineSimilarity(tfidf, selectedMovieIndex) {
    const selectedVector = tfidf[selectedMovieIndex];
    return tfidf.map(vector => {
        const dotProduct = Object.keys(selectedVector).reduce((sum, term) => {
            return sum + (selectedVector[term] * (vector[term] || 0));
        }, 0);
        const magnitudeA = Math.sqrt(Object.values(selectedVector).reduce((sum, val) => sum + val * val, 0));
        const magnitudeB = Math.sqrt(Object.values(vector).reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    });
}
app.get('/r', (req, res) => {
    res.sendFile(__dirname + '/recom.html');
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/mRecom.html');
  });

  app.get('/t', (req, res) => {
    res.sendFile(__dirname + '/test.html');
  });

  app.get('/recommended-movies.html', (req, res) => {
    res.sendFile(__dirname + '/recommended-movies.html');
  });
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
