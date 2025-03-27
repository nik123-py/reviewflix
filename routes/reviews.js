const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const User = require('../models/User');

// Add a review for a movie
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, rating, review } = req.body;
    const userId = req.user._id;

    // Check if movie exists
    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if user has already reviewed this movie
    const existingReview = await Review.findOne({ user: userId, movie: movie._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }

    const newReview = new Review({
      user: userId,
      movie: movie._id,
      rating,
      review
    });

    await newReview.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review' });
  }
});

// Get all reviews for a movie
router.get('/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;

    // Find movie by TMDb ID
    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Get reviews with user details
    const reviews = await Review.find({ movie: movie._id })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map(review => ({
      user: review.user.username,
      rating: review.rating,
      review: review.review,
      createdAt: review.formattedDate
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error('Error getting movie reviews:', error);
    res.status(500).json({ message: 'Error getting movie reviews' });
  }
});

// Get all reviews by a specific user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get reviews with movie details
    const reviews = await Review.find({ user: userId })
      .populate('movie', 'title')
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map(review => ({
      movieTitle: review.movie.title,
      rating: review.rating,
      review: review.review,
      createdAt: review.formattedDate
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error('Error getting user reviews:', error);
    res.status(500).json({ message: 'Error getting user reviews' });
  }
});

module.exports = router;