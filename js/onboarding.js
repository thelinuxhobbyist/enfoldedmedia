document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get("product");

  const titleEl = document.getElementById("title");
  const stepsEl = document.getElementById("steps");
  const packageNameInput = document.getElementById("package-name");
  const form = document.getElementById("onboarding-form");
  const thankYouMessage = document.getElementById("thank-you-message");

  if (!product) {
    titleEl.textContent = "No product specified.";
    return;
  }

  // Set the package name in the hidden input
  if (packageNameInput) {
    packageNameInput.value = product;
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
      stepsEl.innerHTML = ""; // Clear existing content

      info.steps.forEach((step, index) => {
        const stepId = `step-${index}`;
        const formGroup = document.createElement("div");
        formGroup.className = "form-group";
        formGroup.style.marginBottom = "var(--space-4)";

        const label = document.createElement("label");
        label.htmlFor = stepId;
        label.textContent = step;
        label.style.display = "block";
        label.style.marginBottom = "var(--space-2)";
        label.style.fontWeight = "bold";

        const input = document.createElement("input");
        input.type = "text";
        input.id = stepId;
        input.name = step.replace(/\s+/g, '-').toLowerCase(); // Create a name for the input
        input.required = true;
        input.style.width = "100%";
        input.style.padding = "var(--space-3)";
        input.style.border = "1px solid var(--gray-300)";
        input.style.borderRadius = "var(--radius-md)";

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        stepsEl.appendChild(formGroup);
      });
    })
    .catch(error => {
      console.error(error);
      titleEl.textContent = "Error loading onboarding info.";
    });

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      const formData = new FormData(form);
      
      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          form.style.display = "none";
          thankYouMessage.style.display = "block";
        } else {
          const data = await response.json();
          if (Object.hasOwn(data, 'errors')) {
            alert(data["errors"].map(error => error["message"]).join(", "));
          } else {
            alert("An unexpected error occurred.");
          }
        }
      } catch (error) {
        console.error("Form submission error:", error);
        alert("There was a problem submitting your form. Please try again.");
      }
    });
  }
});
