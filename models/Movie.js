const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  poster: {
    type: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  genres: [{
    type: String
  }],
  overview: {
    type: String
  },
  releaseDate: {
    type: Date
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  popularity: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
movieSchema.index({ tmdbId: 1, title: 1 });

// Method to check if a user has liked the movie
movieSchema.methods.isLikedByUser = function(userId) {
  return this.likes.includes(userId);
};

// Method to check if a user has disliked the movie
movieSchema.methods.isDislikedByUser = function(userId) {
  return this.dislikes.includes(userId);
};

module.exports = mongoose.model('Movie', movieSchema);