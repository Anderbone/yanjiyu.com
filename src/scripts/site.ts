function initSite() {
  const root = document.documentElement;
  const shortcut = document.querySelector("[data-command-shortcut]");
  if (shortcut)
    shortcut.textContent = /Mac|iPhone|iPad/.test(navigator.platform)
      ? "⌘ K"
      : "Ctrl K";
  const themeButton = document.querySelector<HTMLButtonElement>(
    "[data-theme-toggle]",
  );
  const updateThemeLabel = () =>
    themeButton?.setAttribute(
      "aria-label",
      `Switch to ${root.classList.contains("dark") ? "light" : "dark"} theme`,
    );
  updateThemeLabel();
  themeButton?.addEventListener("click", () => {
    const dark = root.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
    window.dispatchEvent(new Event("theme-change"));
    updateThemeLabel();
  });
  const menu = document.querySelector<HTMLElement>("#mobile-navigation");
  const menuButton =
    document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const closeMenu = () => {
    if (menu) menu.hidden = true;
    menuButton?.setAttribute("aria-expanded", "false");
  };
  menuButton?.addEventListener("click", () => {
    if (!menu) return;
    menu.hidden = !menu.hidden;
    menuButton.setAttribute("aria-expanded", String(!menu.hidden));
  });
  const dialog = document.querySelector<HTMLDialogElement>(".command-palette");
  const input = document.querySelector<HTMLInputElement>("#command-input");
  const results = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-command-result]"),
  );
  let selected = -1;
  const visibleResults = () => results.filter((link) => !link.hidden);
  const select = (index: number) => {
    const visible = visibleResults();
    selected = visible.length ? (index + visible.length) % visible.length : -1;
    results.forEach((link) => link.classList.remove("is-selected"));
    if (selected >= 0) {
      visible[selected].classList.add("is-selected");
      visible[selected].scrollIntoView({ block: "nearest" });
    }
  };
  const filter = () => {
    const query = input?.value.trim().toLowerCase() || "";
    results.forEach((link) => {
      link.hidden = !query
        .split(/\s+/)
        .every((word) => link.dataset.search?.includes(word));
    });
    selected = -1;
    results.forEach((link) => link.classList.remove("is-selected"));
    const count = visibleResults().length;
    const status = document.querySelector(".command-count");
    if (status)
      status.textContent = query
        ? `${count} result${count === 1 ? "" : "s"}`
        : "Pages & writing";
    const empty = document.querySelector<HTMLElement>(".command-empty");
    if (empty) empty.hidden = count > 0;
  };
  const open = () => {
    closeMenu();
    if (!dialog?.open) dialog?.showModal();
    if (input) {
      input.value = "";
      filter();
      input.focus();
    }
  };
  document
    .querySelector("[data-command-open]")
    ?.addEventListener("click", open);
  document
    .querySelector("[data-command-close]")
    ?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        dialog.close();
    }
  });
  input?.addEventListener("input", filter);
  results.forEach((link) =>
    link.addEventListener("click", () => dialog?.close()),
  );
  const onKey = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      dialog?.open ? dialog.close() : open();
    }
    if (event.key === "Escape") {
      if (dialog?.open) {
        event.preventDefault();
        dialog.close();
      }
      if (menu && !menu.hidden) menuButton?.focus();
      closeMenu();
      return;
    }
    if (!dialog?.open || event.target !== input) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      select(selected + (event.key === "ArrowDown" ? 1 : -1));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      visibleResults()[Math.max(0, selected)]?.click();
    }
  };
  document.addEventListener("keydown", onKey);
  const progress = document.querySelector<HTMLElement>(".reading-progress");
  let frame = 0;
  const updateProgress = () => {
    frame = 0;
    const distance = root.scrollHeight - innerHeight;
    if (progress)
      progress.style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(updateProgress);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  updateProgress();
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll("[data-reveal]")
    .forEach((element) => observer.observe(element));
  document.addEventListener(
    "astro:before-swap",
    () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      observer.disconnect();
      dialog?.close();
    },
    { once: true },
  );
}
document.addEventListener("astro:page-load", initSite);

// Astro replaces the root element during navigation; keep the chosen theme.
document.addEventListener("astro:before-swap", (event) => {
  const swapEvent = event as Event & { newDocument: Document };
  swapEvent.newDocument.documentElement.classList.toggle(
    "dark",
    document.documentElement.classList.contains("dark"),
  );
});
