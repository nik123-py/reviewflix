// Main JavaScript file for ReviewFlix

document.addEventListener("DOMContentLoaded", () => {
  // Initialize sidebar toggle
  initSidebar()

  // Initialize animations
  initAnimations()

  // Initialize tabs
  initTabs()

  // Initialize movie cards
  initMovieCards()
})

// Sidebar functionality
function initSidebar() {
  const sidebarToggle = document.querySelector(".sidebar-toggle")
  const sidebar = document.querySelector(".sidebar")
  const mainContent = document.querySelector(".main-content")
  const footer = document.querySelector(".main-footer")

  if (sidebarToggle && sidebar && mainContent && footer) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
      mainContent.style.marginLeft = sidebar.classList.contains("collapsed") ? "80px" : "250px"
      footer.style.marginLeft = sidebar.classList.contains("collapsed") ? "80px" : "250px"

      // Rotate the toggle icon
      const icon = sidebarToggle.querySelector("i")
      if (icon) {
        icon.classList.toggle("fa-chevron-left")
        icon.classList.toggle("fa-chevron-right")
      }
    })
  }
}

// Animation functionality
function initAnimations() {
  // Add animation classes to elements as they enter viewport
  const animatedElements = document.querySelectorAll(".section-title, .movie-card, .review-card")

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    animatedElements.forEach((el) => observer.observe(el))
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach((el) => el.classList.add("animate-fadeIn"))
  }
}

// Tabs functionality
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")
      const tabContent = document.getElementById(tabId)

      if (!tabContent) return

      // Remove active class from all tabs
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active")
      })

      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active")
      })

      // Add active class to clicked tab
      this.classList.add("active")
      tabContent.classList.add("active")
    })
  })
}

// Movie cards functionality
function initMovieCards() {
  // Initialize hover effects and interactions for movie cards
  const movieCards = document.querySelectorAll(".movie-card")

  movieCards.forEach((card) => {
    // Add hover animation
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)"
      this.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.4)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = ""
      this.style.boxShadow = ""
    })

    // Add like/dislike functionality
    const likeBtn = card.querySelector(".neon-button i.fa-heart, .neon-button i.fa-thumbs-up")
    const dislikeBtn = card.querySelector(".neon-button i.fa-times, .neon-button i.fa-thumbs-down")

    if (likeBtn) {
      likeBtn.parentElement.addEventListener("click", function (e) {
        e.preventDefault()
        // In a real app, this would call an API to update user preferences
        console.log("Liked movie")
        this.classList.add("animate-pulse")
        setTimeout(() => this.classList.remove("animate-pulse"), 1000)
      })
    }

    if (dislikeBtn) {
      dislikeBtn.parentElement.addEventListener("click", function (e) {
        e.preventDefault()
        // In a real app, this would call an API to update user preferences
        console.log("Disliked movie")
        this.classList.add("animate-pulse")
        setTimeout(() => this.classList.remove("animate-pulse"), 1000)
      })
    }
  })
}

