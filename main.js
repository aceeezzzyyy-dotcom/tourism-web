document.addEventListener("DOMContentLoaded", () => {
  // Current year in the footer
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // Mobile navigation
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "✕" : "☰";
    });
  }

  // Destination category filters
  const filterButtons = document.querySelectorAll("[data-filter]");
  const placeCards = document.querySelectorAll(".place-card[data-category]");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("selected", item === button));
    placeCards.forEach(card => {
      const categories = (card.dataset.category || "").split(" ");
      card.hidden = filter !== "all" && !categories.includes(filter);
    });
  }));

  // Trip checklist progress
  const checklistItems = document.querySelectorAll(".check-item input[type='checkbox']");
  const progressText = document.getElementById("progress-text");
  const progressBar = document.getElementById("progress-bar");
  const updateProgress = () => {
    if (!progressText || !progressBar) return;
    const checked = [...checklistItems].filter(item => item.checked).length;
    progressText.textContent = `${checked} of ${checklistItems.length} complete`;
    progressBar.style.width = `${checklistItems.length ? checked / checklistItems.length * 100 : 0}%`;
  };
  checklistItems.forEach(item => item.addEventListener("change", updateProgress));
  const resetButton = document.getElementById("reset-checklist");
  if (resetButton) resetButton.addEventListener("click", () => {
    checklistItems.forEach(item => item.checked = false);
    updateProgress();
  });
  updateProgress();

  // Contact form: validate, then hand off to the visitor's email app (no server storage).
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const message = document.getElementById("form-message");
      if (!contactForm.reportValidity()) {
        message.textContent = "Please complete all required fields.";
        message.classList.add("error");
        return;
      }
      const data = new FormData(contactForm);
      const recipient = contactForm.dataset.recipient || "hello@ormintara.example";
      const subject = `Ormin Tara inquiry: ${data.get("topic")}`;
      const body = `Name: ${data.get("name")}\nReply email: ${data.get("email")}\nTopic: ${data.get("topic")}\n\nMessage:\n${data.get("message")}`;
      message.classList.remove("error");
      message.textContent = "Opening your email app with your inquiry. This demo uses a fictional recipient, so replace it with a real address before publishing.";
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
});
