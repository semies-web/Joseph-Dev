const projects = [
  {
    slug: "maxitech",
    name: "Maxitech",
    category: "Engineering services website",
    description: "A website for Maxitech, a company that delivers engineering services to large companies seeking contractors.",
    role: "Project work",
    technologies: [],
    year: null,
    features: [
      "Presents Maxitech's engineering services to prospective business clients"
    ],
    githubUrl: null,
    aspectRatio: "1376 / 744",
    previewVideo: {
      src: "video/website-project.mp4",
      type: "video/mp4",
      label: "Maxitech engineering services website screen recording"
    },
    gallery: []
  },
  {
    slug: "semies-cuts",
    name: "Semi's Cuts",
    category: "Barber website",
    description: "A completed website project for a barber business. Visit the live site to explore the finished work.",
    role: "Website project",
    technologies: [],
    year: null,
    features: [
      "Independent barber website",
      "Live project available to explore"
    ],
    liveUrl: "https://semies-cuts.vercel.app/",
    githubUrl: null,
    aspectRatio: "478 / 850",
    previewVideo: {
      src: "video/semiscuts-project.mp4",
      type: "video/mp4",
      label: "Semi's Cuts website screen recording"
    },
    gallery: []
  }
];

const projectList = document.querySelector("#project-list");
const projectDialog = document.querySelector(".project-dialog");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#primary-menu");
const themeToggle = document.querySelector(".theme-toggle");
let lastProjectTrigger = null;
let activeGallery = [];

document.documentElement.classList.add("js-enabled");
const themeStorageKey = "joseph-theme";
function setTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelectorAll(".theme-toggle").forEach((toggle) => {
    toggle.setAttribute("aria-checked", String(dark));
    toggle.setAttribute("aria-label", "Dark mode");
    toggle.querySelector(".theme-toggle-label").textContent = dark ? "Dark" : "Light";
  });
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#090a09" : "#f8f8f5");
}
setTheme(document.documentElement.dataset.theme || "light");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // Theme switching still works for this visit when storage is unavailable.
    }
  });
}
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

function createProjectCard(project, index) {
  const entry = document.createElement("article");
  entry.className = `project-entry ${index === 0 ? "project-entry-featured" : "project-entry-secondary"}`;

  const button = document.createElement("button");
  button.className = "project-media reveal";
  button.type = "button";
  button.dataset.project = project.slug;
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-label", `Open ${project.name} project details`);
  if (project.aspectRatio) button.style.aspectRatio = project.aspectRatio;

  if (project.previewVideo?.src) {
    const video = document.createElement("video");
    video.className = "project-video";
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "none";
    video.setAttribute("aria-label", project.previewVideo.label || `${project.name} preview`);
    video.addEventListener("loadeddata", () => video.classList.remove("is-paused"), { once: true });
    video.addEventListener("error", () => video.classList.add("is-paused"), { once: true });
    video.dataset.src = project.previewVideo.src;
    if (project.previewVideo.type) video.dataset.type = project.previewVideo.type;
    video.append(document.createElement("source"));
    button.append(video);
    const playIndicator = document.createElement("span");
    playIndicator.className = "preview-play";
    playIndicator.setAttribute("aria-hidden", "true");
    button.append(playIndicator);
  } else if (project.previewImage?.src) {
    const image = document.createElement("img");
    image.className = "project-image";
    image.src = project.previewImage.src;
    image.alt = project.previewImage.alt || "";
    image.loading = "lazy";
    image.decoding = "async";
    button.append(image);
  } else {
    const placeholder = document.createElement("span");
    placeholder.className = "project-placeholder";
    const indexLabel = document.createElement("span");
    indexLabel.className = "placeholder-index";
    indexLabel.textContent = project.name.toUpperCase();
    const imageLabel = document.createElement("span");
    imageLabel.className = "placeholder-label";
    imageLabel.textContent = "PREVIEW NOT ADDED";
    placeholder.append(indexLabel, imageLabel);
    button.append(placeholder);
  }
  entry.append(button);

  const caption = document.createElement("div");
  caption.className = "project-caption reveal";
  const captionMain = document.createElement("div");
  captionMain.className = "project-caption-main";
  const title = document.createElement("h3");
  title.textContent = project.name;
  const category = document.createElement("span");
  category.className = "project-category";
  category.textContent = project.category;
  const summary = document.createElement("p");
  summary.className = "project-summary";
  summary.textContent = project.description;
  captionMain.append(title, category);
  if (project.year) {
    const yearLabel = document.createElement("span");
    yearLabel.className = "project-year";
    yearLabel.textContent = project.year;
    captionMain.append(yearLabel);
  }
  captionMain.append(summary);

  const captionEnd = document.createElement("div");
  captionEnd.className = "project-caption-end";
  const role = document.createElement("span");
  role.className = "project-role";
  role.textContent = project.role.toUpperCase();
  const caseStudy = document.createElement("button");
  caseStudy.className = "project-open";
  caseStudy.type = "button";
  caseStudy.dataset.project = project.slug;
  caseStudy.setAttribute("aria-haspopup", "dialog");
  caseStudy.append(document.createTextNode("View Project "));
  const caseArrow = document.createElement("span");
  caseArrow.setAttribute("aria-hidden", "true");
  caseArrow.textContent = "↗";
  caseStudy.append(caseArrow);
  captionEnd.append(role, caseStudy);
  if (project.liveUrl) {
    const liveLink = document.createElement("a");
    liveLink.className = "project-live";
    liveLink.href = project.liveUrl;
    liveLink.target = "_blank";
    liveLink.rel = "noopener noreferrer";
    liveLink.append(document.createTextNode("View Live Project "));
    const liveArrow = document.createElement("span");
    liveArrow.setAttribute("aria-hidden", "true");
    liveArrow.textContent = "↗";
    liveLink.append(liveArrow);
    captionEnd.append(liveLink);
  }
  caption.append(captionMain, captionEnd);
  entry.append(caption);
  return entry;
}

if (projectList) {
  projects.forEach((project, index) => {
    projectList.append(createProjectCard(project, index));
  });
}

function addDialogLink(container, label, url, primary = false) {
  if (!url) return;
  const link = document.createElement("a");
  link.className = primary ? "button button-dark" : "project-live";
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  link.append(arrow);
  container.append(link);
}

function createVideo(item, { controls, className, preload }) {
  const video = document.createElement("video");
  video.className = className;
  video.controls = controls;
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = preload;
  video.setAttribute("aria-label", item.label || item.alt || "Project website screen recording");
  if (item.poster) video.poster = item.poster;
  const source = document.createElement("source");
  source.src = item.src;
  if (item.type) source.type = item.type;
  video.append(source);
  return video;
}

function renderGallery(project) {
  const gallery = projectDialog.querySelector(".dialog-gallery");
  gallery.replaceChildren();
  activeGallery = project.gallery || [];

  if (project.previewVideo?.src) {
    const heroMedia = document.createElement("div");
    heroMedia.className = "gallery-hero-media";
    heroMedia.append(createVideo(project.previewVideo, {
      controls: true,
      className: "gallery-video",
      preload: "metadata"
    }));
    gallery.append(heroMedia);
  }

  if (activeGallery.length) {
    const imageGallery = document.createElement("div");
    imageGallery.className = "gallery-images";
    activeGallery.forEach((item) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-item";
      if (item.type === "video") {
        figure.append(createVideo(item, {
          controls: true,
          className: "gallery-image-video",
          preload: "none"
        }));
      } else {
        const image = document.createElement("img");
        image.src = item.src;
        image.alt = item.alt || "";
        image.loading = "lazy";
        image.decoding = "async";
        figure.append(image);
      }
      if (item.caption) {
        const caption = document.createElement("figcaption");
        caption.textContent = item.caption;
        figure.append(caption);
      }
      imageGallery.append(figure);
    });
    gallery.append(imageGallery);
  }
}

function openProject(project, trigger) {
  lastProjectTrigger = trigger;
  projectDialog.querySelector("#dialog-title").textContent = project.name;
  projectDialog.querySelector(".dialog-count").textContent = String(projects.indexOf(project) + 1).padStart(2, "0");
  projectDialog.querySelector(".dialog-role").textContent = project.category;
  projectDialog.querySelector(".dialog-description").textContent = project.description;
  projectDialog.querySelector(".meta-role").textContent = project.role;

  const technologyList = projectDialog.querySelector(".meta-tech");
  const technologyPanel = technologyList.parentElement;
  technologyList.replaceChildren();
  project.technologies.forEach((technology) => {
    const item = document.createElement("li");
    item.textContent = technology;
    technologyList.append(item);
  });
  technologyPanel.hidden = project.technologies.length === 0;
  projectDialog.querySelector(".dialog-meta").classList.toggle("without-tech", project.technologies.length === 0);

  const featureList = projectDialog.querySelector(".dialog-features ul");
  featureList.replaceChildren();
  project.features.forEach((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    featureList.append(item);
  });

  const actions = projectDialog.querySelector(".dialog-actions");
  actions.replaceChildren();
  addDialogLink(actions, "View Live Project", project.liveUrl, true);
  addDialogLink(actions, "View source", project.githubUrl);
  actions.hidden = actions.childElementCount === 0;
  renderGallery(project);
  projectDialog.showModal();

  const detailVideo = projectDialog.querySelector(".gallery-video");
  if (detailVideo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    detailVideo.play().catch(() => {
      detailVideo.controls = true;
    });
  }
}

if (projectList && projectDialog) {
  projectList.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project]");
    if (!trigger) return;
    const project = projects.find((item) => item.slug === trigger.dataset.project);
    if (project) openProject(project, trigger);
  });

  projectDialog.addEventListener("click", (event) => {
    if (event.target.closest(".dialog-close")) {
      projectDialog.close();
    }
  });

  projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });
  projectDialog.addEventListener("close", () => {
    projectDialog.querySelectorAll("video").forEach((video) => video.pause());
    if (lastProjectTrigger) lastProjectTrigger.focus();
  });
  projectDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      projectDialog.close();
      return;
    }
  });
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navMenu.classList.toggle("is-open", !isOpen);
  });

  navMenu.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navMenu.classList.remove("is-open");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !navMenu.classList.contains("is-open")) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navMenu.classList.remove("is-open");
    menuToggle.focus();
  });
}

const siteHeader = document.querySelector(".site-header");
function updateHeader() {
  if (siteHeader) siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (!entry.isIntersecting) {
        video.pause();
        return;
      }

      const source = video.querySelector("source");
      if (!source.getAttribute("src")) {
        source.src = video.dataset.src;
        if (video.dataset.type) source.type = video.dataset.type;
        video.load();
      }
      if (!reducedMotion.matches) {
        video.play().catch(() => {
          video.classList.add("is-paused");
        });
      }
    });
  }, { threshold: 0.15, rootMargin: "120px 0px" });

  document.querySelectorAll(".project-video").forEach((video) => videoObserver.observe(video));
  reducedMotion.addEventListener?.("change", (event) => {
    document.querySelectorAll(".project-video").forEach((video) => {
      if (event.matches) video.pause();
      else if (video.getBoundingClientRect().top < window.innerHeight && video.getBoundingClientRect().bottom > 0) {
        video.play().catch(() => video.classList.add("is-paused"));
      }
    });
  });

  const sectionLinks = new Map();
  document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) sectionLinks.set(section, link);
  });
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = sectionLinks.get(entry.target);
      if (!link || !entry.isIntersecting) return;
      document.querySelectorAll(".nav-link").forEach((item) => {
        item.classList.remove("is-active");
        item.removeAttribute("aria-current");
      });
      link.classList.add("is-active");
      link.setAttribute("aria-current", "location");
    });
  }, { rootMargin: "-25% 0px -65% 0px" });
  sectionLinks.forEach((_, section) => {
    if (section) sectionObserver.observe(section);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  document.querySelectorAll(".project-video").forEach((video) => {
    const source = video.querySelector("source");
    source.src = video.dataset.src;
    if (video.dataset.type) source.type = video.dataset.type;
    video.load();
    video.addEventListener("error", () => video.classList.add("is-paused"), { once: true });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.play().catch(() => video.classList.add("is-paused"));
    }
  });
}
