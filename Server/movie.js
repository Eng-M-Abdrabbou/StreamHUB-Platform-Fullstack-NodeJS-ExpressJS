const express = require("express");
const app = express();
const fs = require("fs");
const axios = require('axios');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const multer = require('multer');
// for file uploading

const session = require('express-session');
// to help with user sessions to keep them while moving from one page to the other

const path = require("path");
//this helps with differemt file paths

const cors = require("cors");
// this helps prevent malicious requests and enhance security

const dotenv = require("dotenv").config();
//helps with config management and security

const router = express.Router();


const PORT = process.env.PORT || 8000;

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionSecret = process.env.SESSION_SECRET || 'default-secret-key';
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


// app.listen(process.env.PORT, () => {
//   console.log(`App is running on port ${process.env.PORT}`);
// });

//REQUIRE THE DB SERVICE
const dbService = require('./dbService.js'); 
const db = dbService.getDbServiceInstance();


app.use('/assets', express.static(path.join(__dirname, '..', 'Client', 'assets')));
app.use('/images', express.static(path.join(__dirname, '..', 'Client', 'images')));
app.use('/Client', express.static(path.join(__dirname, '..', 'Client')));


//delete
app.use((err, req, res, next) => {
  if (err.code === 'ENOENT') {
    console.error('File not found:', req.path);
    res.status(404).json({ error: 'File not found' });
  } else {
    next(err);
  }
});










app.post('/api/find-user', async (req, res) => {
    try {
        const user = await db.findUserByEmail(req.body.email);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/messages/:userId1/:userId2', async (req, res) => {
    try {
        const messages = await db.getMessages(req.params.userId1, req.params.userId2);
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    socket.on('join', (userId) => {
        socket.join(userId);
    });

    socket.on('private message', async (data) => {
        try {
            await db.saveMessage(data.senderId, data.receiverId, data.message);
            io.to(data.receiverId.toString()).emit('private message', {
                senderId: data.senderId,
                senderName: data.senderName,
                message: data.message
            });
        } catch (error) {
            console.error('Error handling private message:', error);
        }
    });
});




app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: 'http://localhost:8000', // replace with your frontend URL
  credentials: true
}));







// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      let uploadDir;
      if (file.fieldname === 'movie') {
          uploadDir = 'uploads/movies';
      } else if (file.fieldname === 'poster') {
          uploadDir = 'uploads/posters';
      } else if (file.fieldname === 'image') {
          uploadDir = 'uploads/forum-images';
      } else {
          return cb(new Error('Invalid field name'));
      }
      cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter to check file types
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'movie' && !file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files are allowed for movies'));
  }
  if (file.fieldname === 'poster' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed for posters'));
  }
  if (file.fieldname === 'image' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed for forum images'));
  }
  cb(null, true);
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // 1000 MB limit
  fileFilter: fileFilter
});

// Ensure upload directories exist
const uploadDirs = ['uploads/movies', 'uploads/posters', 'uploads/forum-images'];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
  }
});


















// Get all movies
app.get('/getAllMovies', (req, res) => {
  const query = 'SELECT * FROM movies';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Error fetching movies', error: err });
    } else {
      res.json({ success: true, data: results });
    }
  });
});


app.get('/getMovie/:id', async (req, res) => {
  try {
      const movieId = req.params.id;
      const result = await db.getMovieById(movieId);
      
      if (result) {
          res.json({ success: true, data: result });
      } else {
          res.status(404).json({ success: false, message: 'Movie not found' });
      }
  } catch (error) {
      console.error('Error fetching movie:', error);
      res.status(500).json({ success: false, message: 'Error fetching movie', error: error.message });
  }
});


app.post('/insertMovie', (req, res) => {
  upload.fields([
      { name: 'movie', maxCount: 1 },
      { name: 'poster', maxCount: 1 }
  ])(req, res, (err) => {
      console.log('Received upload request');

      if (err) {
          console.error('Upload error:', err);
          return res.status(400).json({ success: false, message: 'Upload failed', error: err.message });
      }

      console.log('Received request for /insertMovie');
      console.log('Body:', req.body);
      console.log('Files:', req.files);

      if (!req.files || !req.files['movie'] || !req.files['poster']) {
          console.error('File upload failed: Files are missing');
          return res.status(400).json({ success: false, message: 'File upload failed. Movie and poster files are required.' });
      }

      const { title, genre, rdate, runtime, description, trailer_url } = req.body;
      const movieFile = req.files['movie'][0];
      const posterFile = req.files['poster'][0];

      if (!title || !genre || !rdate || !runtime || !description) {
          console.error('Missing required fields:', { title, genre, rdate, runtime, description });
          return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const moviePath = movieFile.path;
      const posterPath = posterFile.path;

      console.log('Attempting to insert into database');
      
      // Send an initial response to prevent timeout
      res.writeHead(200, { 'Content-Type': 'application/json' });

      const query = 'INSERT INTO movies (title, genre, rdate, runtime, description, trailer_url, filepath, imgpath) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [title, genre, rdate, runtime, description, trailer_url, moviePath, posterPath], (dbErr, result) => {
          if (dbErr) {
              console.error('Database error:', dbErr);
              res.write(JSON.stringify({ success: false, message: 'Error inserting movie', error: dbErr.message }));
          } else {
              console.log('Movie inserted successfully');
              res.write(JSON.stringify({ success: true, message: 'Movie inserted successfully', id: result.insertId }));
          }
          res.end();
      });
  });
});


app.patch('/updateMovie/:id', async (req, res) => {
  const { title, genre, rdate, runtime, description, trailer_url } = req.body;

  // Ensure all fields are provided
  if (!title || !genre || !rdate || !runtime || !description) {
    console.error('Missing required fields:', { title, genre, rdate, runtime, description });
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const updateFields = {
    title,
    genre,
    rdate,
    runtime,
    description,
    trailer_url
  };

  try {
    const success = await db.updateMovie(req.params.id, updateFields);

    if (success) {
      res.json({ success: true, message: 'Movie updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Movie not found' });
    }
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ success: false, message: 'Error updating movie', error: error.message });
  }
});



// Delete a movie
app.delete('/deleteMovie/:id', async (req, res) => {
  console.log(`Received delete request for movie ID: ${req.params.id}`);
  
  try {
    // Fetch the movie
    const movie = await db.fetchMovie(req.params.id);
    if (!movie) {
      console.log('Movie not found');
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    console.log('Movie found:', movie);

    // Delete the movie from the database
    const deleted = await db.deleteMovie(req.params.id);
    if (!deleted) {
      return res.status(500).json({ success: false, message: 'Failed to delete movie from database' });
    }
    console.log('Movie deleted from database');

    // Delete associated files
    const fileErrors = [];
    
    const deleteFile = (path) => {
      return new Promise((resolve) => {
        fs.unlink(path, (err) => {
          if (err) {
            console.error(`Error deleting file ${path}:`, err);
            fileErrors.push(`Failed to delete file ${path}: ${err.message}`);
          } else {
            console.log(`File ${path} deleted successfully`);
          }
          resolve();
        });
      });
    };

    if (movie.filepath) {
      await deleteFile(movie.filepath);
    }

    if (movie.imgpath) {
      await deleteFile(movie.imgpath);
    }

    res.json({ 
      success: true, 
      message: 'Movie deleted successfully', 
      fileErrors: fileErrors.length > 0 ? fileErrors : undefined 
    });
  } catch (error) {
    console.error('Error in delete operation:', error);
    res.status(500).json({ success: false, message: 'Error deleting movie', error: error.message });
  }
});



// Search movies
app.get('/searchMovies', async (req, res) => {
  const { title, genre } = req.query;
  let query = 'SELECT * FROM movies WHERE 1=1';
  const params = [];

  if (title) {
    query += ' AND title LIKE ?';
    params.push(`%${title}%`);
  }
  if (genre) {
    query += ' AND genre LIKE ?';
    params.push(`%${genre}%`);
  }

  try {
    const results = await db.query(query, params);
    res.json({ success: true, data: results });
  } catch (err) {
    console.error('Error searching movies:', err);
    res.status(500).json({ success: false, message: 'Error searching movies', error: err.message });
  }
});




// changes this route so it redirects to index.html
 app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'Client', 'index.html'));
});




// new create
app.post('/insert', async (request, response) => {
  try {
      const db = dbService.getDbServiceInstance();
      const { fName, lName, email, password } = request.body;

      // Check if the email already exists in the database
      const existingUser = await db.getUserByEmail(email);

      if (existingUser) {
          // Email already exists
          return response.status(400).json({ success: false, message: 'Email already used' });
      }

      // Insert the new user into the database
      const result = await db.insertNewName(fName, lName, email, password);

      response.json({ success: true, data: result });
  } catch (err) {
      console.log(err);
      response.status(500).json({ success: false, message: err.message });
  }
});

// login


const bodyParser = require('body-parser');
const { get } = require("http");
app.use(bodyParser.json());

app.get('/api/admin-email', (req, res) => {
  res.json({ email: process.env.ADMIN_EMAIL });
});


app.post('/login', async (request, response) => {
  const db = dbService.getDbServiceInstance();
  const { email, password } = request.body;

  try {
    const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
    const results = await db.query(query, [email, password]);
    console.log(results);

    if (results.length > 0) {
      const user = results[0];
      request.session.userId = user.id;
      console.log("the session done");

      try {
        const recommendationsResponse = await axios.post('http://localhost:5000/recommend', {
          user_id: user.id
        });
        console.log("called flask");
        console.log(recommendationsResponse.data);
        
        const sessionData = {
          userId: user.id,
          fName: user.fName, // Assuming you have these fields
          lName: user.lName,  // Adjust based on your actual column names
          recommendations: recommendationsResponse.data
        };
      //  localStorage.setItem('sessionData', JSON.stringify(sessionData));
    
        response.status(200).json({
          success: true,
          userId: user.id,
          fName: user.fName, // Assuming you have these fields
          lName: user.lName,  // Adjust based on your actual column names
          recommendations: recommendationsResponse.data
        });

      
        // response.status(200).json({
        //   success: true,
        //   recommendations: recommendationsResponse.data
        // });
      } catch (flaskError) {
        console.error("Error calling Flask API:", flaskError);
        response.status(200).json({
          success: true,
          recommendations: []
        });
      }
    } else {
      response.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ success: false, message: 'An error occurred, please try again.' });
  }
});


function checkAuth(req, res, next) {
  if (req.session.userId) {
    next(); // User is authenticated, allow them to access the route
  } else {
    res.status(401).json({ success: false, message: 'You are not authenticated' });
  }
}

app.get('/profile', checkAuth, async(req, res) => {
  const userId = req.session.userId;
  console.log("the session id from profile", userId);
  try {
    const query = 'SELECT * FROM user WHERE id = ?';
    const results = await db.query(query, [userId]);

    if (results.length > 0) {
      const user = results[0];
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'An error occurred, please try again.' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).json({ success: false, message: 'Logout failed' });
      }
      res.status(200).json({ success: true });
  });
});



//read
app.get('/getAll', async (request, response) => {
  try {
      const result = await db.getAllData();
      response.json({ data: result });
  } catch (err) {
      console.log(err);
      response.status(500).json({ success: false, message: err.message });
  }
});

app.get('/get/:id', (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();
  
  const result = db.getDataById(id);
  
  result
  .then(data => response.json({success: true, data: data}))
  .catch(err => console.log(err));
})

// update
app.patch('/update', async (request, response) => {
  try {
      const { id, fName, lName, email, password } = request.body;
      const result = await db.updateNameById(id, fName, lName, email, password);
      response.json({ success: result });
  } catch (err) {
      console.log(err);
      response.status(500).json({ success: false, message: err.message });
  }
});


// delete
app.delete('/delete/:id', async (request, response) => {
  try {
      const { id } = request.params;
      const result = await db.deleteRowById(id);
      response.json({ success: result });
  } catch (err) {
      console.log(err);
      response.status(500).json({ success: false, message: err.message });
  }
});


app.get('/search/:fName/:lName', async (request, response) => {
  try {
      const { fName, lName } = request.params;
      const result = await db.searchByName(fName, lName);
      response.json({ data: result });
  } catch (err) {
      console.log(err);
      response.status(500).json({ success: false, message: err.message });
  }
});




app.post("/prepare-movie", async (req, res) => {
  const { movieId, userId } = req.body;
  
  console.log("Received request to prepare movie:", { movieId, userId });
  
  try {
    // Fetch movie info from the database
    const movieInfo = await db.fetchMovieInfoById(movieId);
    
    console.log("Fetched movie info:", movieInfo);
    
    if (!movieInfo) {
      console.log("No movie info found for id:", movieId);
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    
    // Store movie info and user info in the session
    req.session.movieInfo = movieInfo;
    req.session.userId = userId;
    
    console.log('Movie info set in session:', req.session.movieInfo);
    
    // Save the session explicitly
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ success: false, message: "Error saving session" });
      }
      console.log('Session saved successfully. Session data:', req.session);
      res.json({ success: true, message: "Movie prepared successfully" });
    });
  } catch (err) {
    console.error("Error in /prepare-movie:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});






/*
app.get("/movie", function (req, res) {
  console.log("Session in /movie:", req.session);
  if (!req.session.movieInfo) {
      console.log("No movie info found in session");
      return res.status(400).send("No movie info in session. Please select a movie first.");
  }
  
  console.log("Movie info found:", req.session.movieInfo);
  res.sendFile(path.join(__dirname, '..', 'Client', 'UPmovie.html'));
});
*/








app.get("/movie", function (req, res) {
  console.log("Session in /movie:", req.session);
  
  // Get movie ID from query parameters
  const movieId = req.query.id;
  
  // if (!req.session.movieInfo || req.session.movieInfo.id !== movieId) {
  //     console.log("No matching movie info found in session");
  //     return res.redirect('/'); // Redirect to home page or movie selection page
  // }
  
  console.log("Movie info found:", req.session.movieInfo);
  res.sendFile(path.join(__dirname, '..', 'Client', 'UPmovie.html'));
});















app.get("/movie-info", (req, res) => {
  console.log("Session in /movie-info:", req.session);
  if (!req.session.movieInfo) {
      console.log("No movie info found in /movie-info");
      return res.status(400).json({ success: false, message: "No movie info in session" });
  }
  
  console.log("Sending movie info:", req.session.movieInfo);
  res.json({
      success: true,
      movieInfo: req.session.movieInfo,
      userId: req.session.userId
  });
});





app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session Data:', req.session);
  next();
});









app.post('/submit-rating', async (req, res) => {
  const { userId, movieId, rating } = req.body;

  // Check if the rating is valid
  if (rating < 0 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating has to be between 0 and 5!' });
  }

  // Check if the user ID and movie ID are valid
  if (!userId || !movieId) {
    return res.status(400).json({ success: false, message: 'User ID and movie ID are required' });
  }

  try {
    const oldRating = await db.getRatingByUserIdAndMovieId(userId, movieId);

    if (oldRating) {
      // Update the old rating
      const result = await db.updateRating(oldRating.interaction_id, rating);

      if (result.success) {
        res.json({ success: true, message: 'Rating updated successfully' });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } else {
      // Insert the new rating
      const result = await db.insertRating(userId, movieId, rating);

      if (result.success) {

        res.json({ success: true, message: 'Rating submitted successfully' });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    }
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ success: false, message: 'An error occurred while submitting the rating' });
  }
});










app.get('/get_movies1', (req, res) => {
  db.query('SELECT mid, title, genre, description FROM movies', (error, results) => {
      if (error) throw error;
      res.json(results);
  });
});

// This is not working because the query is not asynchronous, so the callback function is not being executed
// The logs are not showing because the query is not being executed
app.get('/get_movie2', async (req, res) => {
  const movieId = req.query.mid;
  try {
    const results = await db.query('SELECT * FROM movies WHERE movie_id = ?', [movieId]);
    console.log("The results of get_movie2",results);
    if (results.length === 0) {
      res.status(404).json({ message: 'Movie not found' });
    } else {
      res.json(results[0]);
    }
  } catch (error) {
    console.error('Error getting movie:', error);
    res.status(500).json({ message: 'An error occurred while getting the movie' });
  }
});


/*
app.get('/get_recommendations2', async (req, res) => {
  const movieId = req.query.mid;
  console.log("The movie id in get_recommendations2", movieId);

  try {
    console.log("Executing query to get movie info in get_recommendations2");
    const results = await db.query('SELECT * FROM movies WHERE movie_id = ?', [movieId]);
    console.log("Query executed. The results of get_recommendations2:", results);

    if (results.length === 0) {
      console.log("Movie not found in get_recommendations2", movieId);
      return res.status(404).json({ message: 'Movie not found' });
    }

    // The result of the query is an array of objects, so we need to get the first element of the array
    // to get the selected movie object
    const selectedMovie = results[0];
    console.log("Fetching all movies in get_recommendations2", JSON.stringify(selectedMovie));
    const [allMovies] = await db.query('SELECT * FROM movies');
    console.log("All movies fetched. Calling getRecommendations function in get_recommendations2", JSON.stringify(selectedMovie), JSON.stringify(allMovies));	
    const recommendations = getRecommendations(selectedMovie, allMovies);
    console.log("Recommendations fetched. Sending response in get_recommendations2");
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'An error occurred while getting recommendations' });
  }
});
*/


app.get('/get_recommendations2', async (req, res) => {
  const movieId = req.query.mid;
  console.log("The movie id in get_recommendations2", movieId);

  try {
    console.log("Executing query to get movie info in get_recommendations2");
    const results = await db.query('SELECT * FROM movies WHERE movie_id = ?', [movieId]);
    console.log("Query executed. The results of get_recommendations2:", results);

    if (results.length === 0) {
      console.log("Movie not found in get_recommendations2", movieId);
      return res.status(404).json({ message: 'Movie not found' });
    }

    const selectedMovie = results[0];
    console.log("Fetching all movies in get_recommendations2", JSON.stringify(selectedMovie));
    const allMovies = await db.query('SELECT * FROM movies');
    console.log("All movies fetched. Calling getRecommendations function in get_recommendations2", JSON.stringify(selectedMovie), JSON.stringify(allMovies));
    const recommendations = getRecommendations(selectedMovie, allMovies);
    console.log("Recommendations fetched. Sending response in get_recommendations2");
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'An error occurred while getting recommendations' });
  }
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
  console.log("Calculating TFIDF in calculateTFIDF function in get_recommendations2", movies);
  const tfidf = [];
  const documentCount = movies.length;
  const termFrequency = movies.map(movie => {
      const terms = (movie.genre + ' ' + movie.description).toLowerCase().split(/\W+/);
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







router.post('/forums', async (req, res) => {
  try {
      const { forumName } = req.body;
      const userId = req.session.userId;
      
      if (!userId) {
          return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const forumId = await db.createForum(forumName, userId);
      res.json({ success: true, forumId });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});

// Search forums
// router.get('/forums/search', async (req, res) => {
//   try {
//       const { q } = req.query;
//       const forums = await db.searchForums(q);
//       res.json({ success: true, forums });
//   } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//   }
// });

router.get('/forums/search', async (req, res) => {
  try {
      const { q } = req.query;
      const forums = await db.searchForums(q);
      res.json({ success: true, forums });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});


// Get forum details and posts
router.get('/forums/:forumId', async (req, res) => {
  try {
      const { forumId } = req.params;
      const forum = await db.getForum(forumId);
      const posts = await db.getForumPosts(forumId);
      res.json({ success: true, forum, posts });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});

// Delete forum
router.delete('/forums/:forumId', async (req, res) => {
  try {
      const { forumId } = req.params;
      const userId = req.session.userId;
      
      if (!userId) {
          return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const deleted = await db.deleteForum(forumId, userId);
      if (!deleted) {
          return res.status(403).json({ success: false, message: 'Not authorized to delete this forum' });
      }
      res.json({ success: true });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new post in a forum
router.post('/forums/:forumId/posts', upload.single('image'), async (req, res) => {
  try {
      const { forumId } = req.params;
      const { content } = req.body;
      const userId = req.session.userId;
      const imagePath = req.file ? `/uploads/forum-images/${req.file.filename}` : null;
      
      if (!userId) {
          return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const postId = await db.createPost(forumId, userId, content, imagePath);
      res.json({ success: true, postId });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a post
router.delete('/forums/:forumId/posts/:postId', async (req, res) => {
  try {
      const { forumId, postId } = req.params;
      const userId = req.session.userId;
      
      if (!userId) {
          return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const forum = await db.getForum(forumId);
      if (forum.creator_id !== userId) {
          return res.status(403).json({ success: false, message: 'Not authorized to delete posts in this forum' });
      }

      const deleted = await db.deletePost(postId, forumId);
      if (!deleted) {
          return res.status(404).json({ success: false, message: 'Post not found' });
      }
      res.json({ success: true });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});

app.use('/api', router);















app.post("/watch-movie", async (req, res) => {
  const { movieId, userId } = req.body;
  
  try {
      // Fetch movie info from the database
      const movieInfo = await db.fetchMovieInfoById(movieId);
      
      // Store movie info and user info in the session
      req.session.movieInfo = movieInfo;
      req.session.userId = userId;
      
      // Redirect to the movie page
      res.redirect("/movie");
  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err.message });
  }
});


app.get("/video", function (req, res) {
  const range = req.headers.range;
  if (!range) {
    return res.status(400).send("Requires Range header");
  }
  
  if (!req.session.movieInfo || !req.session.movieInfo.filepath) {
    console.error("No movie info or filepath in session");
    return res.status(400).send("No movie selected");
  }

  const videoPath = req.session.movieInfo.filepath;
  console.log("Video path:", videoPath);
  if (!fs.existsSync(videoPath)) {
    console.error(`Video file not found: ${videoPath}`);
    return res.status(404).send("Video not found");
  }
  
  const videoSize = fs.statSync(videoPath).size;
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
  if (start >= videoSize) {
    return res.status(416).send("Requested range not satisfiable");
  }

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  
  res.writeHead(206, headers);
  
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
  
  videoStream.on('error', (streamErr) => {
    console.error('Stream Error:', streamErr);
    if (!res.headersSent) {
      res.status(500).send("Error streaming video");
    } else {
      res.end();
    }
  });
});








app.get('/movie-info/:title', async (request, response) => {
  try {
      const { title } = request.params;
      const result = await db.fetchMovieInfo(title);
      response.json({ data: result });
  } catch (err) {
      console.log(err);
      response.status(500).json({ success: false, message: err.message });
  }
});

app.get("/signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'signup.html'));
 });

 app.get("/test.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'test.html'));
 });

app.get("/team.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'team.html'));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'index.html'));
});

app.get("/testimonials.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'testimonials.html'));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'login.html'));
});

app.get("/contacts.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'contacts.html'));
});

app.get("/movies.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'movies.html'));
});

app.get("/products.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'products.html'));
});

app.get("/test.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'test.html'));
});

app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'admin.html'));
});

app.get("/users.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'Users.html'));
});

app.get("/UserProfile.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'UserProfile.html'));
});

app.get("/UPindex.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'UPindex.html'));
});

app.get('/UPindex.html', (req, res) => {
  if (req.session.user) {
    res.render('UPindex', { user: req.session.user });
  } else {
    res.redirect('/login.html');
  }
});


app.get("/UPmovies.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'UPmovies.html'));
});



app.get("/UPforums.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'UPforums.html'));
});


app.get("/UPchat.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'UPchat.html'));
});

app.get("/UPmovie.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'UPmovie.html'));
});

app.get("/learn.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'learn.html'));
});

app.get("/Aboutus.html", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'Aboutus.html'));
});

app.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

