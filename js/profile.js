// Profile page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize profile tabs
  initProfileTabs()

  // Initialize edit profile functionality
  initEditProfile()
})

function initProfileTabs() {
  const tabButtons = document.querySelectorAll(".profile-tabs .tab-btn")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")
      const tabContent = document.getElementById(tabId)

      if (!tabContent) return

      // Remove active class from all tabs
      document.querySelectorAll(".profile-tabs .tab-btn").forEach((btn) => {
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

function initEditProfile() {
  const editProfileBtn = document.querySelector(".edit-profile-btn")
  const editAvatarBtn = document.querySelector(".edit-avatar")

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      // In a real app, this would open a modal to edit the profile
      console.log("Editing profile")

      // For demo purposes, we'll create a simple modal
      const modal = document.createElement("div")
      modal.className = "modal active"
      modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Edit Profile</h2>
                        <button class="close-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="profile-name">Name</label>
                            <input type="text" id="profile-name" value="John Doe">
                        </div>
                        <div class="form-group">
                            <label for="profile-bio">Bio</label>
                            <textarea id="profile-bio" rows="4">Movie enthusiast with a passion for sci-fi and action films. Always looking for the next great cinematic experience.</textarea>
                        </div>
                        <div class="form-group">
                            <label for="profile-email">Email</label>
                            <input type="email" id="profile-email" value="john.doe@example.com">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="neon-button outline" id="cancel-edit">Cancel</button>
                        <button class="neon-button primary" id="save-profile">Save Changes</button>
                    </div>
                </div>
            `

      document.body.appendChild(modal)
      document.body.style.overflow = "hidden" // Prevent scrolling

      // Close modal functionality
      const closeModal = () => {
        modal.remove()
        document.body.style.overflow = "" // Re-enable scrolling
      }

      const closeBtn = modal.querySelector(".close-modal")
      const cancelBtn = modal.querySelector("#cancel-edit")
      const saveBtn = modal.querySelector("#save-profile")

      if (closeBtn) {
        closeBtn.addEventListener("click", closeModal)
      }

      if (cancelBtn) {
        cancelBtn.addEventListener("click", closeModal)
      }

      // Close modal when clicking outside
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal()
        }
      })

      // Save profile changes
      if (saveBtn) {
        saveBtn.addEventListener("click", function () {
          // Get form values
          const name = document.getElementById("profile-name").value
          const bio = document.getElementById("profile-bio").value
          const email = document.getElementById("profile-email").value

          if (!name || !bio || !email) {
            alert("Please fill in all fields")
            return
          }

          // In a real app, this would call the API to update the profile
          console.log("Saving profile:", { name, bio, email })

          // Show loading state
          this.disabled = true
          this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'

          // Simulate API call
          setTimeout(() => {
            // Update UI with new values
            document.querySelector(".profile-name h1").textContent = name
            document.querySelector(".profile-bio").textContent = bio

            // Close modal
            closeModal()

            // Show success message
            showNotification("Profile updated successfully!", "success")
          }, 1500)
        })
      }
    })
  }

  if (editAvatarBtn) {
    editAvatarBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // In a real app, this would open a file picker
      console.log("Editing avatar")

      // Create a file input
      const fileInput = document.createElement("input")
      fileInput.type = "file"
      fileInput.accept = "image/*"

      // Trigger click on file input
      fileInput.click()

      // Handle file selection
      fileInput.addEventListener("change", function () {
        if (this.files && this.files[0]) {
          // In a real app, this would upload the file to the server
          console.log("Selected file:", this.files[0].name)

          // For demo purposes, we'll just show a success message
          showNotification("Profile picture updated!", "success")
        }
      })
    })
  }
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

