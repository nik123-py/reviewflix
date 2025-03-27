const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const auth = require('../middleware/auth');
const Movie = require('../models/Movie');
const movies = global.db.movies;

// Get trending movies
router.get('/trending', async (req, res) => {
  try {
    // Check in-memory cache
    if (movies.length > 0) {
      return res.json(movies);
    }

    const response = await fetch(
      `${process.env.TMDB_API_BASE_URL}/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`
    );
    const data = await response.json();

    const movies = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: movie.vote_average
    }));

    // Store in in-memory cache
    global.db.movies = movies;

    res.json(movies);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    res.status(500).json({ message: 'Error fetching trending movies' });
  }
});

// Like a movie
router.post('/like', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user._id;

    let movie = movies.find(m => m.id === parseInt(movieId));
    
    if (!movie) {
      // Fetch movie details from TMDb
      const response = await fetch(
        `${process.env.TMDB_API_BASE_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`
      );
      const movieData = await response.json();

      movie = {
        id: movieData.id,
        title: movieData.title,
        poster: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
        rating: movieData.vote_average,
        genres: movieData.genres.map(g => g.name),
        overview: movieData.overview,
        releaseDate: movieData.release_date,
        likes: [],
        dislikes: []
      };
      movies.push(movie);
    }

    // Remove from dislikes if present
    movie.dislikes = movie.dislikes.filter(id => id !== userId);

    // Add to likes if not already liked
    if (!movie.likes.includes(userId)) {
      movie.likes.push(userId);
    }
    res.json({ message: 'Movie liked' });
  } catch (error) {
    console.error('Error liking movie:', error);
    res.status(500).json({ message: 'Error liking movie' });
  }
});

// Dislike a movie
router.post('/dislike', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user._id;

    let movie = movies.find(m => m.id === parseInt(movieId));
    
    if (!movie) {
      // Fetch movie details from TMDb
      const response = await fetch(
        `${process.env.TMDB_API_BASE_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`
      );
      const movieData = await response.json();

      movie = {
        id: movieData.id,
        title: movieData.title,
        poster: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
        rating: movieData.vote_average,
        genres: movieData.genres.map(g => g.name),
        overview: movieData.overview,
        releaseDate: movieData.release_date,
        likes: [],
        dislikes: []
      };
      movies.push(movie);
    }

    // Remove from likes if present
    movie.likes = movie.likes.filter(id => id !== userId);

    // Add to dislikes if not already disliked
    if (!movie.dislikes.includes(userId)) {
      movie.dislikes.push(userId);
    }
    res.json({ message: 'Movie disliked' });
  } catch (error) {
    console.error('Error disliking movie:', error);
    res.status(500).json({ message: 'Error disliking movie' });
  }
});

// Get movie recommendations for a user
router.get('/recommendations/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Check in-memory cache
    const cachedRecommendations = movies.filter(m => m.recommendations && m.recommendations[userId]);
    if (cachedRecommendations.length > 0) {
      return res.json(cachedRecommendations);
    }

    // Get user's liked movies
    const likedMovies = await Movie.find({ likes: userId });
    const userGenres = [...new Set(likedMovies.flatMap(m => m.genres))];

    // Get recommendations based on genres
    const response = await fetch(
      `${process.env.TMDB_API_BASE_URL}/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${userGenres.join(',')}&sort_by=popularity.desc`
    );
    const data = await response.json();

    const recommendations = data.results
      .filter(movie => !likedMovies.some(m => m.tmdbId === movie.id.toString()))
      .map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      }));

    // Store recommendations in memory
    recommendations.forEach(rec => {
      const movie = movies.find(m => m.id === rec.id);
      if (movie) {
        if (!movie.recommendations) movie.recommendations = {};
        movie.recommendations[userId] = true;
      }
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
});

module.exports = router;