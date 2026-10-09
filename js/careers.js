/**
 * Nexora Technologies - Careers Interactive Module
 * Handles job search, multi-faceted filtering, job detail modal,
 * and linking to the application page.
 */

const sampleJobs = [
  {
    id: "aws-cloud-intern",
    title: "AWS Cloud Intern",
    department: "Cloud & Infrastructure",
    location: "San Francisco, CA",
    workplaceType: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Intern / Entry",
    postedDate: "Oct 05, 2026",
    shortDescription: "Join our cloud architecture team to build automated CI/CD pipelines and configure AWS services (EC2, S3, Lambda, ECS).",
    skills: ["AWS", "Terraform", "Python", "Docker", "Linux Basics"],
    overview: "As an AWS Cloud Intern at Nexora, you will work side-by-side with senior cloud architects supporting enterprise clients transitioning to modern serverless and containerized cloud environments.",
    responsibilities: [
      "Assist in writing Infrastructure as Code (IaC) using Terraform and AWS CloudFormation.",
      "Monitor cloud resources and troubleshoot configuration issues across staging environments.",
      "Implement automated backup policies and cloud storage bucket access controls.",
      "Collaborate with the security team to run IAM permission audits.",
      "Document cloud infrastructure best practices and runbooks."
    ],
    qualifications: [
      "Currently pursuing or recently graduated with a degree in Computer Science, IT, or related technical field.",
      "Hands-on familiarity with core AWS services (EC2, S3, IAM, CloudWatch) or AWS Certified Cloud Practitioner / Solutions Architect Associate.",
      "Basic scripting knowledge in Python, Bash, or JavaScript.",
      "Foundational understanding of networking (VPC, Subnets, DNS) and Git version control.",
      "Eager curiosity and willingness to learn modern cloud methodologies."
    ],
    benefits: [
      "Paid competitive internship stipend ($35 - $45 / hour).",
      "Direct 1-on-1 mentorship with Principal Cloud Architects.",
      "Full coverage for AWS certification examination fees.",
      "Flexible hybrid working schedule (2 days office / 3 days remote).",
      "Opportunity to convert into a full-time Cloud Engineer role upon graduation."
    ]
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    department: "Cloud & Infrastructure",
    location: "Austin, TX",
    workplaceType: "Remote",
    employmentType: "Full-Time",
    experienceLevel: "Mid-Level",
    postedDate: "Oct 03, 2026",
    shortDescription: "Lead the design of resilient Kubernetes clusters, automate multi-region deployments, and maintain 99.99% service reliability.",
    skills: ["Kubernetes", "AWS / Azure", "Terraform", "GitHub Actions", "Prometheus", "Argocd"],
    overview: "We are seeking a proactive DevOps Engineer to scale our automated release engineering, enhance container security, and streamline our continuous delivery pipelines across distributed cloud clusters.",
    responsibilities: [
      "Architect and maintain high-availability Kubernetes (EKS/GKE) production clusters.",
      "Construct robust CI/CD pipelines with GitHub Actions, ArgoCD, and Helm.",
      "Automate cloud provisioning using modular Terraform and configuration management tools.",
      "Establish observability dashboards and alert rules using Prometheus, Grafana, and Datadog.",
      "Participate in an on-call rotation ensuring 99.99% system availability and rapid incident resolution."
    ],
    qualifications: [
      "3+ years of production experience in DevOps, Cloud Engineering, or SRE roles.",
      "Extensive proficiency with AWS or GCP enterprise environments.",
      "Deep understanding of Linux internals, container runtimes, and microservice networking.",
      "Proven track record with Infrastructure as Code (Terraform) and GitOps tooling.",
      "Experience with automated security scanning (Trivy, Snyk, SonarQube) in build pipelines."
    ],
    benefits: [
      "100% remote flexibility with home office setup stipend ($1,500).",
      "Competitive salary ($130,000 - $160,000) + equity package.",
      "Comprehensive medical, dental, and vision health coverage.",
      "Unlimited paid time off (PTO) with a mandatory minimum 3 weeks policy.",
      "$3,000 annual professional development and conference budget."
    ]
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    workplaceType: "Remote",
    employmentType: "Full-Time",
    experienceLevel: "Mid-Level",
    postedDate: "Sep 28, 2026",
    shortDescription: "Craft accessible, high-performance web applications and responsive customer portals with modern web standards.",
    skills: ["HTML5", "CSS3 / Vanilla JS", "React / Vue", "TypeScript", "Bootstrap", "Web Accessibility"],
    overview: "We are looking for a creative, detail-oriented Frontend Developer who cares deeply about user experience, page speed performance, and accessible UI component engineering.",
    responsibilities: [
      "Develop responsive, pixel-perfect user interfaces adhering to WCAG 2.1 AA accessibility standards.",
      "Translate Figma design systems into scalable, reusable web components and stylesheets.",
      "Optimize web vital metrics (LCP, FID, CLS) for top-tier speed and rendering efficiency.",
      "Collaborate with backend and cloud engineers to integrate RESTful and GraphQL APIs.",
      "Write thorough end-to-end and unit tests using Jest, Cypress, and Playwright."
    ],
    qualifications: [
      "3+ years of professional front-end web development experience.",
      "Mastery of modern JavaScript (ES6+), HTML5 semantic markup, and CSS architecture.",
      "Solid experience with component-driven frameworks (React, Vue, or modern Web Components).",
      "Familiarity with responsive CSS frameworks (Bootstrap 5, Tailwind CSS) and CSS Grid/Flexbox.",
      "Eye for visual aesthetics, typography, micro-interactions, and design consistency."
    ],
    benefits: [
      "Flexible remote-first work culture.",
      "Competitive compensation ($115,000 - $145,000) with stock options.",
      "Annual company retreats in international locations.",
      "Premium workstation hardware (MacBook Pro M3 / Dual monitors).",
      "Generous parental leave and mental wellness subscriptions."
    ]
  },
  {
    id: "senior-software-developer",
    title: "Senior Software Developer",
    department: "Engineering",
    location: "Austin, TX",
    workplaceType: "Hybrid",
    employmentType: "Full-Time",
    experienceLevel: "Senior",
    postedDate: "Sep 25, 2026",
    shortDescription: "Architect scalable distributed backend services, high-throughput microservices, and reliable event-driven data systems.",
    skills: ["Node.js / Go", "Microservices", "PostgreSQL", "Kafka", "AWS Lambda", "Distributed Systems"],
    overview: "As a Senior Software Developer, you will spearhead the design and implementation of mission-critical cloud-native enterprise platforms handling millions of daily transactions.",
    responsibilities: [
      "Architect resilient microservices and distributed transaction handlers with Go or Node.js.",
      "Design database schemas, query optimizations, and caching tiers with PostgreSQL and Redis.",
      "Implement event-driven streaming pipelines using Apache Kafka or AWS Kinesis.",
      "Mentor junior and mid-level software engineers through rigorous code reviews and architecture design documents.",
      "Ensure robust security patterns, encryption at rest/transit, and SOC 2 compliance."
    ],
    qualifications: [
      "5+ years of software engineering experience designing scalable backend architectures.",
      "Demonstrated experience with Go, TypeScript/Node.js, or Java in production.",
      "In-depth knowledge of database indexing, query planning, and asynchronous event streams.",
      "Hands-on expertise with AWS or Azure cloud architectures and serverless primitives.",
      "Strong technical leadership and written communication skills."
    ],
    benefits: [
      "Competitive salary ($160,000 - $190,000) + equity grant.",
      "401(k) retirement plan with 5% immediate company match.",
      "Health, Dental, Vision & Life insurance fully paid by company.",
      "Hybrid work schedule with catered lunch at the Austin hub.",
      "Sabbatical program after 4 years of tenure."
    ]
  },
  {
    id: "cloud-security-specialist",
    title: "Cloud Security Specialist",
    department: "Security & Compliance",
    location: "London, UK",
    workplaceType: "Hybrid",
    employmentType: "Full-Time",
    experienceLevel: "Senior",
    postedDate: "Oct 01, 2026",
    shortDescription: "Fortify cloud boundaries, implement zero-trust network architectures, and lead automated vulnerability assessments.",
    skills: ["Cloud Security", "Zero Trust", "AWS IAM", "Compliance (SOC2/ISO)", "Threat Modeling"],
    overview: "Guide Nexora's cybersecurity posture and client engagements. You will define security guardrails, lead penetration tests, and automate compliance monitoring.",
    responsibilities: [
      "Architect and enforce Zero-Trust network topologies across AWS and hybrid clouds.",
      "Automate cloud posture management (CSPM) and drift detection.",
      "Conduct threat modeling exercises for new cloud architectures and product releases.",
      "Collaborate with internal teams and external auditors for SOC 2 Type II, ISO 27001, and GDPR compliance.",
      "Lead incident response procedures and digital forensics during security simulations."
    ],
    qualifications: [
      "4+ years specialized experience in cloud security, SecOps, or cybersecurity consultancy.",
      "Industry certifications preferred (CISSP, CCSP, AWS Certified Security - Specialty).",
      "Hands-on experience with vulnerability scanning tools, SIEM solutions, and firewall rules.",
      "Solid knowledge of cloud compliance frameworks and cryptographic standards.",
      "Strong analytical approach to risk assessment and mitigation."
    ],
    benefits: [
      "Competitive UK package (£85,000 - £110,000) + equity.",
      "Central London office access with hybrid flexibility (2 days office).",
      "Generous pension scheme with 8% employer contribution.",
      "Private medical insurance via Bupa.",
      "30 days annual holiday plus UK bank holidays."
    ]
  },
  {
    id: "product-designer",
    title: "UI/UX Product Designer",
    department: "Product & Design",
    location: "San Francisco, CA",
    workplaceType: "Remote",
    employmentType: "Full-Time",
    experienceLevel: "Mid-Level",
    postedDate: "Sep 22, 2026",
    shortDescription: "Design intuitive enterprise dashboards, design system components, and human-centered workflows for cloud tools.",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing"],
    overview: "We are seeking a talented UI/UX Product Designer who can turn complex cloud infrastructure data into clean, intuitive, and delightful software interfaces.",
    responsibilities: [
      "Lead end-to-end user experience design for our internal and client-facing cloud portals.",
      "Develop and evolve the Nexora Design System in Figma and maintain design tokens.",
      "Conduct user research sessions, synthesize qualitative feedback, and build wireframes.",
      "Deliver interactive high-fidelity prototypes and collaborate closely with frontend developers.",
      "Advocate for visual polish, accessible color contrast, and effortless usability."
    ],
    qualifications: [
      "3+ years of experience designing web-based SaaS or enterprise software products.",
      "Strong online portfolio demonstrating end-to-end design process, problem solving, and UI craftsmanship.",
      "Expert knowledge of Figma (Auto-layout, Components, Variants, Design Tokens).",
      "Basic understanding of HTML/CSS constraints to communicate effectively with engineering.",
      "Empathy for users navigating complex technical data."
    ],
    benefits: [
      "Remote-first work environment across North America.",
      "Competitive salary ($115,000 - $140,000) + stock options.",
      "Generous equipment allowance for ergonomic desk setup.",
      "Annual wellness stipend ($1,200/yr).",
      "Collaborative culture valuing craft and design excellence."
    ]
  }
];

// Document Ready Initialization for Careers Page
document.addEventListener("DOMContentLoaded", () => {
  const jobsListContainer = document.getElementById("jobs-list-container");
  const jobCountBadge = document.getElementById("job-count-badge");
  const searchInput = document.getElementById("job-search-input");
  const departmentFilter = document.getElementById("department-filter");
  const typeFilter = document.getElementById("type-filter");
  const locationFilter = document.getElementById("location-filter");
  const experienceFilter = document.getElementById("experience-filter");
  const resetFiltersBtn = document.getElementById("reset-filters-btn");
  const emptyStateContainer = document.getElementById("empty-state");

  // Only run if on careers page
  if (!jobsListContainer) return;

  function renderJobs(jobs) {
    jobsListContainer.innerHTML = "";

    if (jobCountBadge) {
      jobCountBadge.textContent = `${jobs.length} open position${jobs.length === 1 ? '' : 's'}`;
    }

    if (jobs.length === 0) {
      if (emptyStateContainer) emptyStateContainer.classList.remove("d-none");
      jobsListContainer.classList.add("d-none");
      return;
    }

    if (emptyStateContainer) emptyStateContainer.classList.add("d-none");
    jobsListContainer.classList.remove("d-none");

    jobs.forEach((job) => {
      const col = document.createElement("div");
      col.className = "col-lg-6 mb-4";

      const skillsHtml = job.skills
        .map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`)
        .join("");

      col.innerHTML = `
        <article class="job-card" data-job-id="${job.id}">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <span class="badge-soft badge-soft-cyan mb-2">${escapeHtml(job.department)}</span>
              <h3 class="job-title h4">${escapeHtml(job.title)}</h3>
            </div>
            <span class="badge-soft ${job.employmentType === 'Internship' ? 'badge-soft-emerald' : 'badge-soft-slate'}">
              ${escapeHtml(job.employmentType)}
            </span>
          </div>

          <div class="d-flex flex-wrap align-items-center mb-3">
            <span class="job-meta-pill">
              <i class="bi bi-geo-alt text-primary"></i> ${escapeHtml(job.location)} (${escapeHtml(job.workplaceType)})
            </span>
            <span class="job-meta-pill">
              <i class="bi bi-briefcase text-primary"></i> ${escapeHtml(job.experienceLevel)}
            </span>
            <span class="job-meta-pill">
              <i class="bi bi-calendar3 text-primary"></i> ${escapeHtml(job.postedDate)}
            </span>
          </div>

          <p class="text-secondary small mb-3 flex-grow-1">
            ${escapeHtml(job.shortDescription)}
          </p>

          <div class="mb-4">
            <div class="small fw-semibold text-dark mb-1">Key Tech &amp; Skills:</div>
            <div class="d-flex flex-wrap">
              ${skillsHtml}
            </div>
          </div>

          <div class="d-flex align-items-center gap-2 pt-3 border-top mt-auto">
            <button type="button" class="btn btn-outline-primary-custom btn-sm w-50 view-details-btn" data-job-id="${job.id}">
              <i class="bi bi-info-circle me-1"></i> View Details
            </button>
            <a href="apply.html?job=${encodeURIComponent(job.title)}" class="btn btn-primary-custom btn-sm w-50">
              Apply Now <i class="bi bi-arrow-right ms-1"></i>
            </a>
          </div>
        </article>
      `;

      jobsListContainer.appendChild(col);
    });

    // Attach click listeners to view-details-btn
    document.querySelectorAll(".view-details-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const jobId = e.currentTarget.getAttribute("data-job-id");
        openJobDetailsModal(jobId);
      });
    });
  }

  function filterJobs() {
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const selectedDept = departmentFilter ? departmentFilter.value : "all";
    const selectedType = typeFilter ? typeFilter.value : "all";
    const selectedLoc = locationFilter ? locationFilter.value : "all";
    const selectedExp = experienceFilter ? experienceFilter.value : "all";

    const filtered = sampleJobs.filter((job) => {
      // Search matching (title, description, skills, department)
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.shortDescription.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query));

      // Department filter
      const matchesDept = selectedDept === "all" || job.department === selectedDept;

      // Type filter
      const matchesType = selectedType === "all" || job.employmentType === selectedType;

      // Location filter (checks workplace type or city)
      const matchesLoc =
        selectedLoc === "all" ||
        job.workplaceType.toLowerCase() === selectedLoc.toLowerCase() ||
        job.location.toLowerCase().includes(selectedLoc.toLowerCase());

      // Experience filter
      const matchesExp = selectedExp === "all" || job.experienceLevel === selectedExp;

      return matchesSearch && matchesDept && matchesType && matchesLoc && matchesExp;
    });

    renderJobs(filtered);
  }

  // Event Listeners for filter controls
  if (searchInput) searchInput.addEventListener("input", debounce(filterJobs, 250));
  if (departmentFilter) departmentFilter.addEventListener("change", filterJobs);
  if (typeFilter) typeFilter.addEventListener("change", filterJobs);
  if (locationFilter) locationFilter.addEventListener("change", filterJobs);
  if (experienceFilter) experienceFilter.addEventListener("change", filterJobs);

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (departmentFilter) departmentFilter.value = "all";
      if (typeFilter) typeFilter.value = "all";
      if (locationFilter) locationFilter.value = "all";
      if (experienceFilter) experienceFilter.value = "all";
      renderJobs(sampleJobs);
    });
  }

  // Initial Render
  renderJobs(sampleJobs);

  // Check if URL has ?filter= or ?dept=
  const urlParams = new URLSearchParams(window.location.search);
  const initialDept = urlParams.get("dept");
  if (initialDept && departmentFilter) {
    departmentFilter.value = initialDept;
    filterJobs();
  }
});

/**
 * Open Job Details Modal with comprehensive information
 */
function openJobDetailsModal(jobId) {
  const job = sampleJobs.find((j) => j.id === jobId);
  if (!job) return;

  const modalTitle = document.getElementById("jobModalLabel");
  const modalBody = document.getElementById("jobModalBody");
  const modalApplyBtn = document.getElementById("jobModalApplyBtn");

  if (modalTitle) {
    modalTitle.textContent = job.title;
  }

  if (modalApplyBtn) {
    modalApplyBtn.href = `apply.html?job=${encodeURIComponent(job.title)}`;
  }

  if (modalBody) {
    modalBody.innerHTML = `
      <div class="mb-4 pb-3 border-bottom">
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span class="badge-soft badge-soft-cyan">${escapeHtml(job.department)}</span>
          <span class="badge-soft badge-soft-slate"><i class="bi bi-geo-alt"></i> ${escapeHtml(job.location)} (${escapeHtml(job.workplaceType)})</span>
          <span class="badge-soft badge-soft-slate"><i class="bi bi-briefcase"></i> ${escapeHtml(job.employmentType)}</span>
          <span class="badge-soft badge-soft-emerald"><i class="bi bi-award"></i> ${escapeHtml(job.experienceLevel)}</span>
        </div>
        <p class="lead fs-6 text-dark">${escapeHtml(job.overview)}</p>
      </div>

      <div class="mb-4">
        <h6 class="fw-bold text-dark mb-2"><i class="bi bi-check2-circle text-primary me-2"></i>Key Responsibilities</h6>
        <ul class="text-secondary small ps-3">
          ${job.responsibilities.map(r => `<li class="mb-1">${escapeHtml(r)}</li>`).join("")}
        </ul>
      </div>

      <div class="mb-4">
        <h6 class="fw-bold text-dark mb-2"><i class="bi bi-mortarboard text-primary me-2"></i>Qualifications &amp; Requirements</h6>
        <ul class="text-secondary small ps-3">
          ${job.qualifications.map(q => `<li class="mb-1">${escapeHtml(q)}</li>`).join("")}
        </ul>
      </div>

      <div class="mb-4">
        <h6 class="fw-bold text-dark mb-2"><i class="bi bi-gift text-primary me-2"></i>What We Offer</h6>
        <ul class="text-secondary small ps-3">
          ${job.benefits.map(b => `<li class="mb-1">${escapeHtml(b)}</li>`).join("")}
        </ul>
      </div>

      <div>
        <h6 class="fw-bold text-dark mb-2">Technologies &amp; Tools</h6>
        <div class="d-flex flex-wrap gap-1">
          ${job.skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join("")}
        </div>
      </div>
    `;
  }

  // Show bootstrap modal
  const modalElement = document.getElementById("jobDetailModal");
  if (modalElement && typeof bootstrap !== "undefined") {
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
  }
}

// Utility: Debounce for input search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility: Safe text escaping
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
