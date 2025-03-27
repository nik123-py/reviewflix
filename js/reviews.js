// Reviews page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize review modal
  initReviewModal()

  // Initialize star rating
  initStarRating()

  // Initialize review actions
  initReviewActions()
})

function initReviewModal() {
  const writeReviewBtn = document.getElementById("write-review-btn")
  const reviewModal = document.getElementById("review-modal")
  const closeModalBtn = document.querySelector(".close-modal")
  const cancelReviewBtn = document.getElementById("cancel-review")
  const submitReviewBtn = document.getElementById("submit-review")
  const movieSearch = document.getElementById("movie-search")
  const searchResults = document.querySelector(".search-results")
  const searchResultItems = document.querySelectorAll(".search-result-item")
  const selectedMovie = document.querySelector(".selected-movie")

  if (!writeReviewBtn || !reviewModal) return

  // Open modal
  writeReviewBtn.addEventListener("click", () => {
    reviewModal.classList.add("active")
    document.body.style.overflow = "hidden" // Prevent scrolling
  })

  // Close modal functions
  const closeModal = () => {
    reviewModal.classList.remove("active")
    document.body.style.overflow = "" // Re-enable scrolling
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal)
  }

  if (cancelReviewBtn) {
    cancelReviewBtn.addEventListener("click", closeModal)
  }

  // Close modal when clicking outside
  reviewModal.addEventListener("click", (e) => {
    if (e.target === reviewModal) {
      closeModal()
    }
  })

  // Movie search functionality
  if (movieSearch && searchResults) {
    movieSearch.addEventListener("focus", () => {
      searchResults.style.display = "block"
    })

    movieSearch.addEventListener("input", function () {
      // In a real app, this would search the API for movies
      if (this.value.length > 2) {
        searchResults.style.display = "block"
      } else {
        searchResults.style.display = "none"
      }
    })

    // Select movie from search results
    searchResultItems.forEach((item) => {
      item.addEventListener("click", function () {
        if (selectedMovie) {
          selectedMovie.style.display = "flex"
        }
        searchResults.style.display = "none"
        movieSearch.value = this.querySelector("h4").textContent
      })
    })
  }

  // Submit review
  if (submitReviewBtn) {
    submitReviewBtn.addEventListener("click", function () {
      // Get review data
      const movieTitle = document.querySelector(".selected-movie-info h3")?.textContent
      const rating = document.querySelectorAll(".star-rating i.active").length
      const reviewText = document.getElementById("review-text")?.value

      if (!movieTitle || !rating || !reviewText) {
        alert("Please fill in all fields")
        return
      }

      // In a real app, this would submit the review to the API
      console.log("Submitting review:", { movieTitle, rating, reviewText })

      // Show loading state
      this.disabled = true
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'

      // Simulate API call
      setTimeout(() => {
        closeModal()

        // Add the new review to the UI
        const reviewsList = document.querySelector(".user-reviews")
        if (reviewsList) {
          const newReview = document.createElement("div")
          newReview.className = "review-item"
          newReview.innerHTML = `
                        <div class="review-movie">
                            <img src="img/movie2.jpg" alt="Movie Poster">
                            <div class="movie-info">
                                <h3>${movieTitle}</h3>
                                <div class="movie-meta">
                                    <span>2010</span>
                                    <span>Action</span>
                                </div>
                            </div>
                        </div>
                        <div class="review-content">
                            <div class="review-header">
                                <div class="review-rating">
                                    ${Array(5)
                                      .fill(0)
                                      .map((_, i) => `<i class="${i < rating ? "fas" : "far"} fa-star"></i>`)
                                      .join("")}
                                    <span>${rating}.0</span>
                                </div>
                                <div class="review-date">
                                    <i class="far fa-calendar"></i> ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </div>
                            </div>
                            <p>${reviewText}</p>
                            <div class="review-actions">
                                <button class="review-action-btn edit-btn"><i class="fas fa-edit"></i> Edit</button>
                                <button class="review-action-btn delete-btn"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    `

          reviewsList.prepend(newReview)
          newReview.classList.add("animate-fadeIn")

          // Reset form
          document.getElementById("review-text").value = ""
          document.querySelectorAll(".star-rating i").forEach((star) => {
            star.classList.remove("active")
          })

          // Reset button
          submitReviewBtn.disabled = false
          submitReviewBtn.innerHTML = "Submit Review"
        }
      }, 1500)
    })
  }
}

function initStarRating() {
  const stars = document.querySelectorAll(".star-rating i")

  stars.forEach((star, index) => {
    star.addEventListener("mouseover", () => {
      // Highlight stars on hover
      for (let i = 0; i <= index; i++) {
        stars[i].classList.add("fas")
        stars[i].classList.remove("far")
      }
    })

    star.addEventListener("mouseout", () => {
      // Reset stars that aren't active
      stars.forEach((s, i) => {
        if (!s.classList.contains("active")) {
          s.classList.remove("fas")
          s.classList.add("far")
        }
      })
    })

    star.addEventListener("click", () => {
      // Set active stars
      stars.forEach((s, i) => {
        if (i <= index) {
          s.classList.add("active")
          s.classList.add("fas")
          s.classList.remove("far")
        } else {
          s.classList.remove("active")
          s.classList.remove("fas")
          s.classList.add("far")
        }
      })
    })
  })
}

function initReviewActions() {
  // Edit review buttons
  const editButtons = document.querySelectorAll(".edit-btn")
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const reviewItem = this.closest(".review-item")
      const reviewContent = reviewItem.querySelector("p").textContent
      const rating = reviewItem.querySelectorAll(".review-rating i.fas").length
      const movieTitle = reviewItem.querySelector(".movie-info h3").textContent

      // In a real app, this would open the edit modal with the review data
      console.log("Editing review:", { movieTitle, rating, reviewContent })

      // For demo purposes, we'll just show an alert
      alert(`Editing review for ${movieTitle}`)
    })
  })

  // Delete review buttons
  const deleteButtons = document.querySelectorAll(".delete-btn")
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const reviewItem = this.closest(".review-item")
      const movieTitle = reviewItem.querySelector(".movie-info h3").textContent

      // Confirm deletion
      if (confirm(`Are you sure you want to delete your review for ${movieTitle}?`)) {
        // In a real app, this would call the API to delete the review
        console.log("Deleting review for:", movieTitle)

        // Animate removal
        reviewItem.style.opacity = "0"
        reviewItem.style.transform = "translateY(20px)"
        setTimeout(() => {
          reviewItem.remove()
        }, 300)
      }
    })
  })

  // Unsave review buttons
  const unsaveButtons = document.querySelectorAll(".unsave-btn")
  unsaveButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const reviewItem = this.closest(".review-item")
      const movieTitle = reviewItem.querySelector(".movie-info h3").textContent

      // In a real app, this would call the API to unsave the review
      console.log("Unsaving review for:", movieTitle)

      // Animate removal
      reviewItem.style.opacity = "0"
      reviewItem.style.transform = "translateY(20px)"
      setTimeout(() => {
        reviewItem.remove()
      }, 300)
    })
  })
}

