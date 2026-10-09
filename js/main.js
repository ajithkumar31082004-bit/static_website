/**
 * Nexora Technologies - Core Global Script
 * Manages navigation, header scroll effects, active link highlighting,
 * and common user interface utilities.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic copyright year in footer
  const yearSpans = document.querySelectorAll(".current-year");
  const currentYear = new Date().getFullYear();
  yearSpans.forEach(el => {
    el.textContent = currentYear;
  });

  // 2. Navbar shrink & shadow on scroll
  const navbar = document.querySelector(".navbar-custom");
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  // 3. Active Nav Link Detection
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link-custom");
  navLinks.forEach(link => {
    const linkHref = link.getAttribute("href");
    if (linkHref) {
      const cleanHref = linkHref.split("/").pop();
      if (
        cleanHref === currentPath ||
        (currentPath === "" && cleanHref === "index.html") ||
        (currentPath === "index.html" && cleanHref === "index.html")
      ) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    }
  });

  // 4. Smooth close mobile menu on click
  const navItems = document.querySelectorAll('.navbar-collapse .nav-link-custom, .navbar-collapse .btn-custom');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // 5. Dismissible static demo notice alert
  const demoBanner = document.getElementById("static-demo-banner");
  const dismissBannerBtn = document.getElementById("dismiss-banner-btn");
  if (dismissBannerBtn && demoBanner) {
    dismissBannerBtn.addEventListener("click", () => {
      demoBanner.style.display = "none";
      try {
        sessionStorage.setItem("nexora_banner_dismissed", "true");
      } catch (e) {}
    });

    try {
      if (sessionStorage.getItem("nexora_banner_dismissed") === "true") {
        demoBanner.style.display = "none";
      }
    } catch (e) {}
  }
});
