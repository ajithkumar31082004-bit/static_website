/**
 * Nexora Technologies - Contact Page Module
 * Handles contact form validation, interactive demo notifications,
 * and clears fields upon confirmed receipt.
 */

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-us-form");
  const contactSuccessModalEl = document.getElementById("contactSuccessModal");
  const contactSummaryEl = document.getElementById("contact-summary-details");

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function markField(fieldId, errorId, isValid, errorMessage) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (!field) return isValid;

    if (!isValid) {
      field.classList.add("is-invalid");
      field.classList.remove("is-valid");
      if (error) {
        error.textContent = errorMessage;
        error.style.display = "block";
      }
    } else {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
      if (error) {
        error.style.display = "none";
      }
    }
    return isValid;
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let formIsValid = true;

      // 1. Name
      const nameInput = document.getElementById("contact-name");
      const nameVal = nameInput ? nameInput.value.trim() : "";
      if (!nameVal || nameVal.length < 2) {
        markField("contact-name", "contact-name-error", false, "Please enter your full name.");
        formIsValid = false;
      } else {
        markField("contact-name", "contact-name-error", true);
      }

      // 2. Email
      const emailInput = document.getElementById("contact-email");
      const emailVal = emailInput ? emailInput.value.trim() : "";
      if (!emailVal || !isValidEmail(emailVal)) {
        markField("contact-email", "contact-email-error", false, "Please enter a valid business email address.");
        formIsValid = false;
      } else {
        markField("contact-email", "contact-email-error", true);
      }

      // 3. Subject
      const subjectInput = document.getElementById("contact-subject");
      const subjectVal = subjectInput ? subjectInput.value.trim() : "";
      if (!subjectVal || subjectVal.length < 3) {
        markField("contact-subject", "contact-subject-error", false, "Please enter a topic or inquiry subject.");
        formIsValid = false;
      } else {
        markField("contact-subject", "contact-subject-error", true);
      }

      // 4. Message
      const messageInput = document.getElementById("contact-message");
      const messageVal = messageInput ? messageInput.value.trim() : "";
      if (!messageVal || messageVal.length < 10) {
        markField("contact-message", "contact-message-error", false, "Please enter your message (at least 10 characters).");
        formIsValid = false;
      } else {
        markField("contact-message", "contact-message-error", true);
      }

      if (!formIsValid) {
        const firstError = contactForm.querySelector(".is-invalid");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          firstError.focus();
        }
        return;
      }

      // Submission simulation
      const submitBtn = document.getElementById("contact-submit-btn");
      const origText = submitBtn ? submitBtn.innerHTML : "Send Message";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }

        if (contactSummaryEl) {
          contactSummaryEl.innerHTML = `
            <div class="text-start">
              <p class="mb-1"><strong>Sender:</strong> ${escapeHtml(nameVal)} &lt;${escapeHtml(emailVal)}&gt;</p>
              <p class="mb-1"><strong>Subject:</strong> ${escapeHtml(subjectVal)}</p>
              <p class="mb-0 text-muted small"><strong>Message excerpt:</strong> ${escapeHtml(messageVal.length > 100 ? messageVal.substring(0, 100) + '...' : messageVal)}</p>
            </div>
          `;
        }

        // Show Modal
        if (contactSuccessModalEl && typeof bootstrap !== "undefined") {
          const modalInstance = bootstrap.Modal.getOrCreateInstance(contactSuccessModalEl);
          modalInstance.show();
        }

        // Reset inputs
        contactForm.reset();
        contactForm.querySelectorAll(".is-valid, .is-invalid").forEach(el => {
          el.classList.remove("is-valid", "is-invalid");
        });
      }, 550);
    });
  }
});

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
