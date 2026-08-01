const body = document.body;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".section-reveal");
const mediaItems = document.querySelectorAll(".media-placeholder");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxTriggers = document.querySelectorAll("[data-lightbox-src]");
const videoModal = document.querySelector("[data-video-modal]");
const videoModalPanel = document.querySelector("[data-video-modal-panel]");
const videoModalPlayer = document.querySelector("[data-video-modal-player]");
const videoModalClose = document.querySelector("[data-video-modal-close]");
const videoTriggers = document.querySelectorAll("[data-video-src]");

let activeLightboxTrigger = null;
let activeVideoTrigger = null;

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeNav = () => {
  body.classList.remove("nav-open");
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Открыть разделы сайта");
  }
};

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Закрыть разделы сайта" : "Открыть разделы сайта");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      closeNav();
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && body.classList.contains("nav-open")) {
      closeNav();
    }
  });
}

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
  body.classList.remove("lightbox-open");
  activeLightboxTrigger?.focus();
  activeLightboxTrigger = null;
};

if (lightbox && lightboxImage) {
  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      activeLightboxTrigger = trigger;
      lightboxImage.src = trigger.dataset.lightboxSrc;
      lightboxImage.alt = trigger.dataset.lightboxAlt || "";
      lightbox.hidden = false;
      body.classList.add("lightbox-open");
      lightboxClose?.focus();
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightboxClose?.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}

const closeVideoModal = () => {
  if (!videoModal || !videoModalPlayer) return;

  videoModalPlayer.pause();
  videoModalPlayer.removeAttribute("src");
  videoModalPlayer.load();
  videoModal.hidden = true;
  body.classList.remove("video-modal-open");
  activeVideoTrigger?.focus();
  activeVideoTrigger = null;
};

if (videoModal && videoModalPanel && videoModalPlayer && videoModalClose) {
  videoTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const source = trigger.dataset.videoSrc;
      if (!source) return;

      activeVideoTrigger = trigger;
      videoModalPlayer.src = source;
      videoModal.hidden = false;
      body.classList.add("video-modal-open");
      videoModalClose.focus();

      const playPromise = videoModalPlayer.play();
      if (playPromise) {
        playPromise.catch(() => {
          videoModalPlayer.focus();
        });
      }
    });
  });

  videoModalClose.addEventListener("click", closeVideoModal);

  videoModal.addEventListener("click", (event) => {
    if (event.target === videoModal) {
      closeVideoModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (videoModal.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeVideoModal();
      return;
    }

    if (event.key === "Tab") {
      const focusable = [videoModalClose, videoModalPlayer];
      const currentIndex = focusable.indexOf(document.activeElement);
      const direction = event.shiftKey ? -1 : 1;
      const nextIndex = (currentIndex + direction + focusable.length) % focusable.length;
      event.preventDefault();
      focusable[nextIndex].focus();
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const updateMediaMotion = () => {
  if (reduceMotion.matches) return;

  mediaItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
    const offset = Math.max(-14, Math.min(14, progress * 18));
    const scale = 1 + Math.max(0, 1 - Math.abs(progress)) * 0.018;

    item.style.setProperty("--parallax", offset.toFixed(2));
    item.style.setProperty("--media-scale", scale.toFixed(3));
  });
};

if (!reduceMotion.matches) {
  updateMediaMotion();
  window.addEventListener("scroll", updateMediaMotion, { passive: true });
  window.addEventListener("resize", updateMediaMotion);
}
