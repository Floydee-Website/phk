(() => {
  const ACCESS_CODE = "Floydeeinfotech2027*";
  const ACCESS_KEY = "phk-proposal-access";
  const THEME_KEY = "phk-visual-atmosphere";
  const THEMES = ["mediterranean", "light", "midnight", "terracotta"];

  const applyTheme = (theme) => {
    const selected = THEMES.includes(theme) ? theme : "mediterranean";
    document.documentElement.dataset.theme = selected;
    localStorage.setItem(THEME_KEY, selected);
    document.querySelectorAll("[data-theme-choice]").forEach((choice) => {
      const active = choice.dataset.themeChoice === selected;
      choice.classList.toggle("is-active", active);
      choice.setAttribute("aria-pressed", String(active));
    });
  };

  applyTheme(localStorage.getItem(THEME_KEY));

  document.querySelectorAll("[data-theme-studio]").forEach((studio) => {
    const toggle = studio.querySelector("[data-theme-toggle]");
    toggle.addEventListener("click", () => {
      const open = studio.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    studio.querySelectorAll("[data-theme-choice]").forEach((choice) => {
      choice.addEventListener("click", () => {
        applyTheme(choice.dataset.themeChoice);
        window.setTimeout(() => studio.classList.remove("is-open"), 260);
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  });

  const unlockProposal = () => {
    sessionStorage.setItem(ACCESS_KEY, "granted");
    const lock = document.querySelector("[data-proposal-lock]");
    if (lock) {
      lock.classList.add("is-unlocked");
      document.body.classList.remove("is-locked");
    } else {
      window.location.href = "proposal.html";
    }
  };

  const gate = document.querySelector("#proposal-gate");
  const trigger = document.querySelector(".proposal-trigger");

  const openGate = () => {
    if (!gate) return;
    gate.hidden = false;
    requestAnimationFrame(() => gate.classList.add("is-open"));
    document.body.classList.add("is-locked");
    gate.querySelector("input")?.focus();
  };

  const closeGate = () => {
    if (!gate) return;
    gate.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    window.setTimeout(() => { gate.hidden = true; }, 350);
  };

  trigger?.addEventListener("click", openGate);
  document.querySelectorAll("[data-close-gate]").forEach((button) => button.addEventListener("click", closeGate));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && gate?.classList.contains("is-open")) closeGate();
  });

  document.querySelectorAll("[data-toggle-code]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      button.textContent = showing ? "Show" : "Hide";
      button.setAttribute("aria-label", showing ? "Show access code" : "Hide access code");
      input.focus();
    });
  });

  document.querySelectorAll("[data-gate-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      const error = form.querySelector("[data-gate-error]");
      if (!input.value.trim()) {
        error.textContent = "Please enter the access code.";
        input.focus();
        return;
      }
      if (input.value !== ACCESS_CODE) {
        error.textContent = "That code does not match. Please try again.";
        input.classList.remove("shake");
        void input.offsetWidth;
        input.classList.add("shake");
        input.select();
        return;
      }
      error.textContent = "";
      unlockProposal();
    });
  });

  if (document.documentElement.hasAttribute("data-proposal-page")) {
    window.scrollTo(0, 0);
    if (sessionStorage.getItem(ACCESS_KEY) === "granted") {
      document.querySelector("[data-proposal-lock]")?.classList.add("is-unlocked");
    } else {
      document.body.classList.add("is-locked");
      window.setTimeout(() => document.querySelector("[data-proposal-lock] input")?.focus(), 200);
    }
  }

  const menuButton = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    siteNav?.classList.toggle("is-open", !open);
  });
  siteNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  }));

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.addEventListener("pointermove", (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    }, { passive: true });
  }
})();
