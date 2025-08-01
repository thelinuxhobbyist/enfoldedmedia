document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get("product");

  const titleEl = document.getElementById("title");
  const stepsEl = document.getElementById("steps");

  if (!product) {
    titleEl.textContent = "No product specified.";
    return;
  }

  fetch("/config/onboarding.json")
    .then(response => {
      if (!response.ok) throw new Error("Failed to load onboarding config.");
      return response.json();
    })
    .then(data => {
      const info = data[product];
      if (!info) {
        titleEl.textContent = "Invalid product name.";
        return;
      }

      titleEl.textContent = info.title;
      stepsEl.innerHTML = ""; // Clear existing steps

      info.steps.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        stepsEl.appendChild(li);
      });
    })
    .catch(error => {
      console.error(error);
      titleEl.textContent = "Error loading onboarding info.";
    });
});
