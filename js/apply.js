/**
 * Nexora Technologies - Job Application Module
 * Validates candidate input, checks resume file type & size,
 * pre-fills selected role from URL parameters or session storage,
 * and renders explicit static-site demo submission confirmations.
 */

document.addEventListener("DOMContentLoaded", () => {
  const applyForm = document.getElementById("job-application-form");
  const positionSelect = document.getElementById("position-applied");
  const resumeInput = document.getElementById("resume-upload");
  const dropZone = document.getElementById("resume-drop-zone");
  const filePreview = document.getElementById("file-preview");
  const fileNameDisplay = document.getElementById("file-name-display");
  const fileSizeDisplay = document.getElementById("file-size-display");
  const removeFileBtn = document.getElementById("remove-file-btn");
  const resetFormBtn = document.getElementById("reset-form-btn");
  const formSuccessModalEl = document.getElementById("applicationSuccessModal");
  const submissionSummaryEl = document.getElementById("submission-summary-details");

  // Position auto-selection from URL query parameter ?job=
  const urlParams = new URLSearchParams(window.location.search);
  const jobParam = urlParams.get("job");

  if (positionSelect) {
    if (jobParam) {
      // Decode and check if matches an option or append dynamically
      const decodedJob = decodeURIComponent(jobParam).trim();
      let optionExists = false;
      for (let i = 0; i < positionSelect.options.length; i++) {
        if (positionSelect.options[i].text.toLowerCase() === decodedJob.toLowerCase() ||
            positionSelect.options[i].value.toLowerCase() === decodedJob.toLowerCase()) {
          positionSelect.selectedIndex = i;
          optionExists = true;
          break;
        }
      }
      if (!optionExists && decodedJob) {
        const newOption = new Option(decodedJob, decodedJob, true, true);
        positionSelect.add(newOption);
      }
      // Save to sessionStorage for cross-page preservation
      try {
        sessionStorage.setItem("nexora_selected_job", decodedJob);
      } catch (e) {}
    } else {
      // Check session storage if no param provided
      try {
        const savedJob = sessionStorage.getItem("nexora_selected_job");
        if (savedJob) {
          for (let i = 0; i < positionSelect.options.length; i++) {
            if (positionSelect.options[i].text.toLowerCase() === savedJob.toLowerCase()) {
              positionSelect.selectedIndex = i;
              break;
            }
          }
        }
      } catch (e) {}
    }
  }

  // --- Resume Drag & Drop and File Validation ---
  let selectedFile = null;
  const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  function validateFile(file) {
    if (!file) return { valid: false, error: "Please upload your resume file." };

    const fileName = file.name.toLowerCase();
    const isExtensionValid = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

    if (!isExtensionValid) {
      return {
        valid: false,
        error: `Invalid file type (.${fileName.split('.').pop()}). Only PDF, DOC, and DOCX files are accepted.`
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `File is too large (${sizeMB} MB). Maximum permitted size is 5.0 MB.`
      };
    }

    return { valid: true };
  }

  function handleFileSelection(file) {
    const errorEl = document.getElementById("resume-error");
    const check = validateFile(file);

    if (!check.valid) {
      selectedFile = null;
      if (resumeInput) resumeInput.value = "";
      if (dropZone) {
        dropZone.classList.remove("has-file");
        dropZone.classList.add("border-danger");
      }
      if (filePreview) filePreview.classList.add("d-none");
      if (errorEl) {
        errorEl.textContent = check.error;
        errorEl.classList.remove("d-none");
      }
      return false;
    }

    selectedFile = file;
    if (dropZone) {
      dropZone.classList.add("has-file");
      dropZone.classList.remove("border-danger");
    }
    if (errorEl) {
      errorEl.classList.add("d-none");
      errorEl.textContent = "";
    }
    if (filePreview) filePreview.classList.remove("d-none");
    if (fileNameDisplay) fileNameDisplay.textContent = file.name;
    if (fileSizeDisplay) {
      const sizeKb = (file.size / 1024).toFixed(1);
      fileSizeDisplay.textContent = `${sizeKb} KB`;
    }
    return true;
  }

  if (resumeInput) {
    resumeInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  if (dropZone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragover');
      }, false);
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        handleFileSelection(files[0]);
      }
    }, false);
  }

  if (removeFileBtn) {
    removeFileBtn.addEventListener("click", () => {
      selectedFile = null;
      if (resumeInput) resumeInput.value = "";
      if (dropZone) dropZone.classList.remove("has-file");
      if (filePreview) filePreview.classList.add("d-none");
      const errorEl = document.getElementById("resume-error");
      if (errorEl) errorEl.classList.add("d-none");
    });
  }

  // --- Real-time Field Validation Helpers ---
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

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidUrl(url) {
    if (!url || url.trim() === "") return true; // Optional URLs
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  function isValidPhone(phone) {
    // Allows standard global digits, spaces, parentheses, hyphens, plus
    return /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(phone.trim());
  }

  // Form Reset Listener
  if (resetFormBtn && applyForm) {
    resetFormBtn.addEventListener("click", () => {
      applyForm.reset();
      selectedFile = null;
      if (filePreview) filePreview.classList.add("d-none");
      if (dropZone) {
        dropZone.classList.remove("has-file");
        dropZone.classList.remove("border-danger");
      }
      applyForm.querySelectorAll(".is-invalid, .is-valid").forEach(el => {
        el.classList.remove("is-invalid", "is-valid");
      });
      applyForm.querySelectorAll(".invalid-feedback-custom").forEach(el => {
        el.style.display = "none";
      });
    });
  }

  // --- Form Submission Handler ---
  if (applyForm) {
    applyForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let formIsValid = true;

      // 1. Full Name
      const nameVal = document.getElementById("applicant-name")?.value.trim() || "";
      if (!nameVal || nameVal.length < 2) {
        markField("applicant-name", "applicant-name-error", false, "Please enter your full name (minimum 2 characters).");
        formIsValid = false;
      } else {
        markField("applicant-name", "applicant-name-error", true);
      }

      // 2. Email Address
      const emailVal = document.getElementById("applicant-email")?.value.trim() || "";
      if (!emailVal || !isValidEmail(emailVal)) {
        markField("applicant-email", "applicant-email-error", false, "Please provide a valid email address (e.g., name@domain.com).");
        formIsValid = false;
      } else {
        markField("applicant-email", "applicant-email-error", true);
      }

      // 3. Phone Number
      const phoneVal = document.getElementById("applicant-phone")?.value.trim() || "";
      if (!phoneVal || !isValidPhone(phoneVal)) {
        markField("applicant-phone", "applicant-phone-error", false, "Please enter a valid phone number (e.g. +1 555-019-2834).");
        formIsValid = false;
      } else {
        markField("applicant-phone", "applicant-phone-error", true);
      }

      // 4. Position Applied For
      const posVal = positionSelect ? positionSelect.value : "";
      if (!posVal || posVal === "") {
        markField("position-applied", "position-error", false, "Please choose the position you wish to apply for.");
        formIsValid = false;
      } else {
        markField("position-applied", "position-error", true);
      }

      // 5. Current Location
      const locVal = document.getElementById("applicant-location")?.value.trim() || "";
      if (!locVal) {
        markField("applicant-location", "applicant-location-error", false, "Please specify your current city and country.");
        formIsValid = false;
      } else {
        markField("applicant-location", "applicant-location-error", true);
      }

      // 6. Experience Level / Fresher
      const expVal = document.getElementById("experience-level")?.value || "";
      if (!expVal) {
        markField("experience-level", "experience-error", false, "Please select your experience status.");
        formIsValid = false;
      } else {
        markField("experience-level", "experience-error", true);
      }

      // 7. Skills & Tech Experience
      const skillsVal = document.getElementById("applicant-skills")?.value.trim() || "";
      if (!skillsVal || skillsVal.length < 3) {
        markField("applicant-skills", "applicant-skills-error", false, "Please list your primary skills and technical tools.");
        formIsValid = false;
      } else {
        markField("applicant-skills", "applicant-skills-error", true);
      }

      // 8. LinkedIn URL (optional)
      const linkedinVal = document.getElementById("applicant-linkedin")?.value.trim() || "";
      if (linkedinVal && !isValidUrl(linkedinVal)) {
        markField("applicant-linkedin", "applicant-linkedin-error", false, "Please enter a valid URL (e.g., https://linkedin.com/in/username).");
        formIsValid = false;
      } else {
        markField("applicant-linkedin", "applicant-linkedin-error", true);
      }

      // 9. GitHub/Portfolio URL (optional)
      const githubVal = document.getElementById("applicant-github")?.value.trim() || "";
      if (githubVal && !isValidUrl(githubVal)) {
        markField("applicant-github", "applicant-github-error", false, "Please enter a valid web URL.");
        formIsValid = false;
      } else {
        markField("applicant-github", "applicant-github-error", true);
      }

      // 10. Resume Check
      const resumeErrorEl = document.getElementById("resume-error");
      if (!selectedFile) {
        if (resumeErrorEl) {
          resumeErrorEl.textContent = "Please upload your resume in PDF, DOC, or DOCX format.";
          resumeErrorEl.classList.remove("d-none");
        }
        if (dropZone) dropZone.classList.add("border-danger");
        formIsValid = false;
      } else {
        const fileCheck = validateFile(selectedFile);
        if (!fileCheck.valid) {
          if (resumeErrorEl) {
            resumeErrorEl.textContent = fileCheck.error;
            resumeErrorEl.classList.remove("d-none");
          }
          formIsValid = false;
        } else {
          if (resumeErrorEl) resumeErrorEl.classList.add("d-none");
        }
      }

      // 11. Consent Checkbox
      const consentChecked = document.getElementById("privacy-consent")?.checked;
      const consentErrorEl = document.getElementById("consent-error");
      if (!consentChecked) {
        document.getElementById("privacy-consent")?.classList.add("is-invalid");
        if (consentErrorEl) consentErrorEl.style.display = "block";
        formIsValid = false;
      } else {
        document.getElementById("privacy-consent")?.classList.remove("is-invalid");
        if (consentErrorEl) consentErrorEl.style.display = "none";
      }

      if (!formIsValid) {
        // Scroll smoothly to first invalid element
        const firstError = applyForm.querySelector(".is-invalid, .border-danger");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          if (typeof firstError.focus === "function") firstError.focus();
        }
        return;
      }

      // Simulation of submission processing
      const submitBtn = document.getElementById("submit-application-btn");
      const originalBtnContent = submitBtn ? submitBtn.innerHTML : "Submit Application";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Validating submission...`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent;
        }

        // Populate summary in the modal
        if (submissionSummaryEl) {
          submissionSummaryEl.innerHTML = `
            <div class="row g-2 text-start">
              <div class="col-sm-6">
                <span class="text-muted small">Candidate:</span>
                <div class="fw-bold">${escapeHtml(nameVal)}</div>
              </div>
              <div class="col-sm-6">
                <span class="text-muted small">Position:</span>
                <div class="fw-bold text-primary">${escapeHtml(posVal)}</div>
              </div>
              <div class="col-sm-6">
                <span class="text-muted small">Email:</span>
                <div>${escapeHtml(emailVal)}</div>
              </div>
              <div class="col-sm-6">
                <span class="text-muted small">Experience:</span>
                <div>${escapeHtml(expVal)}</div>
              </div>
              <div class="col-12">
                <span class="text-muted small">Resume Attached:</span>
                <div><i class="bi bi-file-earmark-check text-success me-1"></i> ${escapeHtml(selectedFile ? selectedFile.name : 'Uploaded')} (${selectedFile ? (selectedFile.size / 1024).toFixed(1) + ' KB' : ''})</div>
              </div>
            </div>
          `;
        }

        // Open Confirmation Modal
        if (formSuccessModalEl && typeof bootstrap !== "undefined") {
          const successModal = bootstrap.Modal.getOrCreateInstance(formSuccessModalEl);
          successModal.show();
        }
      }, 650);
    });
  }
});

// Escape HTML helper
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
