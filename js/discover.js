// Discover page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize swipeable cards
  initSwipeCards()

  // Initialize filters
  initFilters()
})

// Swipeable cards functionality
function initSwipeCards() {
  const cards = document.querySelectorAll(".swipe-card")
  const likeBtn = document.querySelector(".like-btn")
  const dislikeBtn = document.querySelector(".dislike-btn")

  if (!cards.length) return

  let currentCardIndex = 0
  let startX, startY, currentX, currentY
  let initialRotation = 0

  // Touch/mouse events for cards
  cards.forEach((card, index) => {
    // Only the top card should be interactive
    if (index !== 0) return

    card.addEventListener("mousedown", startDrag)
    card.addEventListener("touchstart", startDrag)

    card.addEventListener("mousemove", drag)
    card.addEventListener("touchmove", drag)

    card.addEventListener("mouseup", endDrag)
    card.addEventListener("touchend", endDrag)

    card.addEventListener("mouseleave", endDrag)
  })

  // Button events
  if (likeBtn) {
    likeBtn.addEventListener("click", () => {
      swipeCard("right")
    })
  }

  if (dislikeBtn) {
    dislikeBtn.addEventListener("click", () => {
      swipeCard("left")
    })
  }

  function startDrag(e) {
    e.preventDefault()

    if (e.type === "touchstart") {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    } else {
      startX = e.clientX
      startY = e.clientY
    }

    initialRotation = 0
    this.style.transition = "none"
  }

  function drag(e) {
    if (!startX || !startY) return

    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX
      currentY = e.touches[0].clientY
    } else {
      currentX = e.clientX
      currentY = e.clientY
    }

    const diffX = currentX - startX
    const diffY = currentY - startY
    const rotation = diffX * 0.1 // Rotate based on horizontal movement

    this.style.transform = `translate(${diffX}px, ${diffY}px) rotate(${rotation}deg)`

    // Show like/dislike indicators
    if (diffX > 50) {
      this.classList.add("swiping-right")
      this.classList.remove("swiping-left")
    } else if (diffX < -50) {
      this.classList.add("swiping-left")
      this.classList.remove("swiping-right")
    } else {
      this.classList.remove("swiping-right", "swiping-left")
    }
  }

  function endDrag(e) {
    if (!startX || !startY) return

    let diffX
    if (e.type === "touchend") {
      diffX = (currentX || e.changedTouches[0].clientX) - startX
    } else {
      diffX = (currentX || e.clientX) - startX
    }

    this.style.transition = "transform 0.5s ease"

    if (diffX > 100) {
      // Swipe right - like
      swipeCard("right")
    } else if (diffX < -100) {
      // Swipe left - dislike
      swipeCard("left")
    } else {
      // Return to center
      this.style.transform = ""
      this.classList.remove("swiping-right", "swiping-left")
    }

    startX = null
    startY = null
    currentX = null
    currentY = null
  }

  function swipeCard(direction) {
    const currentCard = cards[currentCardIndex]
    if (!currentCard) return

    currentCard.style.transition = "transform 0.5s ease"

    if (direction === "right") {
      currentCard.style.transform = "translateX(150%) rotate(30deg)"
      // In a real app, this would call an API to update user preferences
      console.log(`Liked movie: ${currentCard.getAttribute("data-movie-id")}`)
    } else {
      currentCard.style.transform = "translateX(-150%) rotate(-30deg)"
      // In a real app, this would call an API to update user preferences
      console.log(`Disliked movie: ${currentCard.getAttribute("data-movie-id")}`)
    }

    // Move to next card after animation
    setTimeout(() => {
      currentCard.style.display = "none"
      currentCardIndex++

      // If there are more cards, make the next one interactive
      if (currentCardIndex < cards.length) {
        const nextCard = cards[currentCardIndex]
        nextCard.style.transform = ""
        nextCard.style.opacity = "1"

        nextCard.addEventListener("mousedown", startDrag)
        nextCard.addEventListener("touchstart", startDrag)

        nextCard.addEventListener("mousemove", drag)
        nextCard.addEventListener("touchmove", drag)

        nextCard.addEventListener("mouseup", endDrag)
        nextCard.addEventListener("touchend", endDrag)

        nextCard.addEventListener("mouseleave", endDrag)
      } else {
        // No more cards
        document.querySelector(".swipe-container").innerHTML = `
                    <div class="no-more-cards">
                        <h3>No more movies to discover</h3>
                        <p>Check back later for more recommendations</p>
                        <button class="neon-button primary refresh-movies">
                            <i class="fas fa-sync-alt"></i> Refresh Movies
                        </button>
                    </div>
                `

        // Add event listener to refresh button
        const refreshBtn = document.querySelector(".refresh-movies")
        if (refreshBtn) {
          refreshBtn.addEventListener("click", () => {
            // In a real app, this would fetch new movies from the API
            window.location.reload()
          })
        }
      }
    }, 500)
  }
}

// Filters functionality
function initFilters() {
  const filterForm = document.querySelector(".filter-panel")
  const applyFiltersBtn = document.querySelector(".apply-filters")

  if (!filterForm || !applyFiltersBtn) return

  applyFiltersBtn.addEventListener("click", function () {
    // In a real app, this would fetch filtered movies from the API
    console.log("Applying filters...")

    // Get filter values
    const genre = document.getElementById("genre-filter").value
    const yearMin = document.getElementById("year-min").textContent
    const yearMax = document.getElementById("year-max").textContent
    const ratingMin = document.getElementById("rating-min").textContent
    const ratingMax = document.getElementById("rating-max").textContent

    console.log(`Filters: Genre=${genre}, Year=${yearMin}-${yearMax}, Rating=${ratingMin}-${ratingMax}`)

    // Show loading state
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...'

    // Simulate API call
    setTimeout(() => {
      this.innerHTML = '<i class="fas fa-check"></i> Applied'

      setTimeout(() => {
        this.innerHTML = "Apply Filters"
      }, 2000)
    }, 1500)
  })

  // Range slider functionality
  const yearRangeInputs = document.querySelectorAll("#year-range")
  const ratingRangeInputs = document.querySelectorAll("#rating-range")

  if (yearRangeInputs.length === 2) {
    const yearMinDisplay = document.getElementById("year-min")
    const yearMaxDisplay = document.getElementById("year-max")

    yearRangeInputs[0].addEventListener("input", function () {
      const minVal = Number.parseInt(this.value)
      const maxVal = Number.parseInt(yearRangeInputs[1].value)

      if (minVal > maxVal) {
        this.value = maxVal
        return
      }

      if (yearMinDisplay) yearMinDisplay.textContent = minVal
    })

    yearRangeInputs[1].addEventListener("input", function () {
      const maxVal = Number.parseInt(this.value)
      const minVal = Number.parseInt(yearRangeInputs[0].value)

      if (maxVal < minVal) {
        this.value = minVal
        return
      }

      if (yearMaxDisplay) yearMaxDisplay.textContent = maxVal
    })
  }

  if (ratingRangeInputs.length === 2) {
    const ratingMinDisplay = document.getElementById("rating-min")
    const ratingMaxDisplay = document.getElementById("rating-max")

    ratingRangeInputs[0].addEventListener("input", function () {
      const minVal = Number.parseFloat(this.value)
      const maxVal = Number.parseFloat(ratingRangeInputs[1].value)

      if (minVal > maxVal) {
        this.value = maxVal
        return
      }

      if (ratingMinDisplay) ratingMinDisplay.textContent = minVal
    })

    ratingRangeInputs[1].addEventListener("input", function () {
      const maxVal = Number.parseFloat(this.value)
      const minVal = Number.parseFloat(ratingRangeInputs[0].value)

      if (maxVal < minVal) {
        this.value = minVal
        return
      }

      if (ratingMaxDisplay) ratingMaxDisplay.textContent = maxVal
    })
  }
}

