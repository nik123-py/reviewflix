// Recommendations page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize AI recommendation refresh
  initRecommendationRefresh()
})

function initRecommendationRefresh() {
  const refreshBtn = document.querySelector(".refresh-recommendations")
  const aiProgressContainer = document.querySelector(".ai-progress-container")
  const recommendationCategories = document.querySelector(".recommendation-categories")
  const progressFill = document.querySelector(".progress-fill")

  if (!refreshBtn || !aiProgressContainer || !recommendationCategories || !progressFill) return

  refreshBtn.addEventListener("click", function () {
    // Show loading state
    this.disabled = true
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...'

    // Hide recommendation categories and show progress
    recommendationCategories.style.opacity = "0.5"
    aiProgressContainer.style.display = "block"

    // Animate progress bar
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      progressFill.style.width = `${progress}%`

      if (progress >= 100) {
        clearInterval(interval)

        // Simulate API response with new recommendations
        setTimeout(() => {
          // Reset button
          refreshBtn.disabled = false
          refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Recommendations'

          // Hide progress and show updated recommendations
          aiProgressContainer.style.display = "none"
          recommendationCategories.style.opacity = "1"

          // In a real app, this would update the recommendations with new data from the API
          // For demo purposes, we'll just add a visual effect to simulate new content
          const movieCards = document.querySelectorAll(".movie-card")
          movieCards.forEach((card) => {
            card.classList.add("animate-pulse")
            setTimeout(() => card.classList.remove("animate-pulse"), 1000)
          })

          // Show success message
          showNotification("Recommendations refreshed successfully!", "success")
        }, 1000)
      }
    }, 50)
  })
}

// Notification function
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-info-circle"}"></i>
            <span>${message}</span>
        </div>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `

  // Add styles
  notification.style.position = "fixed"
  notification.style.bottom = "20px"
  notification.style.right = "20px"
  notification.style.backgroundColor = type === "success" ? "var(--neon-tertiary)" : "var(--neon-secondary)"
  notification.style.color = "var(--bg-primary)"
  notification.style.padding = "15px 20px"
  notification.style.borderRadius = "var(--card-radius)"
  notification.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)"
  notification.style.zIndex = "1000"
  notification.style.display = "flex"
  notification.style.alignItems = "center"
  notification.style.justifyContent = "space-between"
  notification.style.minWidth = "300px"
  notification.style.transform = "translateY(100px)"
  notification.style.opacity = "0"
  notification.style.transition = "all 0.3s ease"

  // Add to DOM
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateY(0)"
    notification.style.opacity = "1"
  }, 10)

  // Close button functionality
  const closeBtn = notification.querySelector(".close-notification")
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      notification.style.transform = "translateY(100px)"
      notification.style.opacity = "0"
      setTimeout(() => notification.remove(), 300)
    })
  }

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.transform = "translateY(100px)"
      notification.style.opacity = "0"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

