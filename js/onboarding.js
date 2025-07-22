document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get("product");

  if (!product) {
    document.getElementById("title").textContent = "No product specified.";
    return;
  }

  fetch("/config/onboarding.json")
    .then(response => {
      if (!response.ok) throw new Error("Config file not found.");
      return response.json();
    })
    .then(data => {
      const info = data[product];
      if (!info) {
        document.getElementById("title").textContent = "Invalid product name.";
        return;
      }

      document.getElementById("title").textContent = info.title;

      const stepsContainer = document.getElementById("steps");
      stepsContainer.innerHTML = ""; // clear previous steps

      info.steps.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        stepsContainer.appendChild(li);
      });
    })
    .catch(error => {
      document.getElementById("title").textContent = "Error loading onboarding info.";
      console.error(error);
    });
});

