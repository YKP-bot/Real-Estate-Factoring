const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal, .scheme-row");
const faqItems = document.querySelectorAll(".faq-item");
const hero = document.querySelector(".hero");
const stickyCta = document.querySelector(".sticky-cta");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateWideHero = () => {
  const isWideHero = window.innerWidth > 1280;
  document.documentElement.classList.toggle("wide-hero", isWideHero);

  if (!isWideHero) {
    document.documentElement.style.removeProperty("--hero-scale");
    document.documentElement.style.removeProperty("--hero-logical-height");
    return;
  }

  const heroScale = window.innerWidth / 1280;
  document.documentElement.style.setProperty("--hero-scale", heroScale);
  document.documentElement.style.setProperty("--hero-logical-height", `${window.innerHeight / heroScale}px`);
};

const updatePageChrome = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
  if (hero && stickyCta) {
    const showStickyCta = window.scrollY > hero.offsetHeight * 0.7;
    stickyCta.classList.toggle("is-visible", showStickyCta);
    stickyCta.setAttribute("aria-hidden", String(!showStickyCta));
    if (showStickyCta) {
      stickyCta.removeAttribute("tabindex");
    } else {
      stickyCta.setAttribute("tabindex", "-1");
    }
  }
};

let scrollTicking = false;
const handleScroll = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(() => {
    updatePageChrome();
    scrollTicking = false;
  });
};

updateWideHero();
updatePageChrome();
window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("resize", () => {
  updateWideHero();
  handleScroll();
}, { passive: true });

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -4% 0px", threshold: 0.05 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) other.removeAttribute("open");
    });
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
});
