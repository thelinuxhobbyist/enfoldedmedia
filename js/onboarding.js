document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get("product");

  const titleEl = document.getElementById("title");
  const descriptionEl = document.querySelector(".hero-description");
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
      
      // Set description if available
      if (info.description && descriptionEl) {
        descriptionEl.textContent = info.description;
      }

      stepsEl.innerHTML = ""; // Clear existing content

      // Check if this is a new format with fields array
      if (info.fields && Array.isArray(info.fields)) {
        renderFields(info.fields, stepsEl);
      } else if (info.steps && Array.isArray(info.steps)) {
        renderSteps(info.steps, stepsEl);
      } else {
        stepsEl.innerHTML = "<p>No form fields or steps defined.</p>";
      }
    })
    .catch(error => {
      console.error(error);
      titleEl.textContent = "Error loading onboarding info.";
    });

  // Function to render traditional steps as inputs
  function renderSteps(steps, container) {
    steps.forEach((step, index) => {
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
      input.name = step.replace(/\\s+/g, '-').toLowerCase(); // Create a name for the input
      input.required = true;
      input.style.width = "100%";
      input.style.padding = "var(--space-3)";
      input.style.border = "1px solid var(--gray-300)";
      input.style.borderRadius = "var(--radius-md)";

      formGroup.appendChild(label);
      formGroup.appendChild(input);
      container.appendChild(formGroup);
    });
  }

  // Function to render new fields format
  function renderFields(fields, container) {
    fields.forEach((field, index) => {
      if (field.type === "info") {
        // Special case for info field - just display message
        const infoBox = document.createElement("div");
        infoBox.className = "info-box";
        infoBox.style.cssText = `
          background: var(--primary-light);
          border-left: 4px solid var(--primary);
          padding: var(--space-4);
          margin-bottom: var(--space-4);
          border-radius: var(--radius-md);
        `;
        
        const infoIcon = document.createElement("div");
        infoIcon.innerHTML = `<i class="fas fa-info-circle"></i>`;
        infoIcon.style.cssText = `
          margin-right: var(--space-2);
          color: var(--primary);
          display: inline-block;
        `;
        
        const infoText = document.createElement("span");
        infoText.textContent = field.text;
        
        infoBox.appendChild(infoIcon);
        infoBox.appendChild(infoText);
        container.appendChild(infoBox);
        return;
      }
      
      const fieldId = `field-${index}`;
      const formGroup = document.createElement("div");
      formGroup.className = "form-group";
      formGroup.style.marginBottom = "var(--space-4)";

      const label = document.createElement("label");
      label.htmlFor = fieldId;
      label.textContent = field.label;
      label.style.display = "block";
      label.style.marginBottom = "var(--space-2)";
      label.style.fontWeight = "bold";
      
      if (field.required) {
        const requiredSpan = document.createElement("span");
        requiredSpan.textContent = " *";
        requiredSpan.style.color = "var(--red-500)";
        label.appendChild(requiredSpan);
      }

      formGroup.appendChild(label);

      let input;
      
      switch (field.type) {
        case "text":
        case "email":
        case "tel":
        case "url":
        case "password":
        case "date":
          input = document.createElement("input");
          input.type = field.type;
          input.placeholder = field.placeholder || "";
          input.style.width = "100%";
          input.style.padding = "var(--space-3)";
          input.style.border = "1px solid var(--gray-300)";
          input.style.borderRadius = "var(--radius-md)";
          break;
          
        case "textarea":
          input = document.createElement("textarea");
          input.placeholder = field.placeholder || "";
          input.rows = 4;
          input.style.width = "100%";
          input.style.padding = "var(--space-3)";
          input.style.border = "1px solid var(--gray-300)";
          input.style.borderRadius = "var(--radius-md)";
          break;
          
        case "select":
          input = document.createElement("select");
          input.style.width = "100%";
          input.style.padding = "var(--space-3)";
          input.style.border = "1px solid var(--gray-300)";
          input.style.borderRadius = "var(--radius-md)";
          
          // Add empty option
          const emptyOption = document.createElement("option");
          emptyOption.value = "";
          emptyOption.textContent = "-- Select an option --";
          input.appendChild(emptyOption);
          
          // Add options
          if (field.options && Array.isArray(field.options)) {
            field.options.forEach(option => {
              const optionEl = document.createElement("option");
              optionEl.value = option;
              optionEl.textContent = option;
              input.appendChild(optionEl);
            });
          }
          break;
          
        case "radio":
          input = document.createElement("div");
          input.className = "radio-group";
          input.style.marginTop = "var(--space-2)";
          
          if (field.options && Array.isArray(field.options)) {
            field.options.forEach((option, i) => {
              const radioContainer = document.createElement("div");
              radioContainer.style.marginBottom = "var(--space-2)";
              
              const radio = document.createElement("input");
              radio.type = "radio";
              radio.id = `${fieldId}-${i}`;
              radio.name = field.name;
              radio.value = option;
              radio.required = field.required;
              
              const radioLabel = document.createElement("label");
              radioLabel.htmlFor = `${fieldId}-${i}`;
              radioLabel.textContent = option;
              radioLabel.style.marginLeft = "var(--space-2)";
              radioLabel.style.fontWeight = "normal";
              
              radioContainer.appendChild(radio);
              radioContainer.appendChild(radioLabel);
              input.appendChild(radioContainer);
            });
          }
          break;
          
        case "checkbox":
          input = document.createElement("div");
          input.className = "checkbox-group";
          input.style.marginTop = "var(--space-2)";
          
          if (field.options && Array.isArray(field.options)) {
            field.options.forEach((option, i) => {
              const checkContainer = document.createElement("div");
              checkContainer.style.marginBottom = "var(--space-2)";
              
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.id = `${fieldId}-${i}`;
              checkbox.name = `${field.name}[]`;
              checkbox.value = option;
              
              const checkLabel = document.createElement("label");
              checkLabel.htmlFor = `${fieldId}-${i}`;
              checkLabel.textContent = option;
              checkLabel.style.marginLeft = "var(--space-2)";
              checkLabel.style.fontWeight = "normal";
              
              checkContainer.appendChild(checkbox);
              checkContainer.appendChild(checkLabel);
              input.appendChild(checkContainer);
            });
            
            // Add a hidden field to track if any box was checked
            if (field.required) {
              const validationInput = document.createElement("input");
              validationInput.type = "hidden";
              validationInput.name = `${field.name}_validation`;
              validationInput.required = true;
              validationInput.className = "checkbox-validation";
              validationInput.dataset.checkboxGroup = field.name;
              input.appendChild(validationInput);
              
              // Add validation script
              const checkboxes = input.querySelectorAll(`input[name="${field.name}[]"]`);
              checkboxes.forEach(cb => {
                cb.addEventListener("change", () => {
                  const anyChecked = Array.from(checkboxes).some(c => c.checked);
                  validationInput.value = anyChecked ? "valid" : "";
                });
              });
            }
          }
          break;
      }

      if (input) {
        input.id = fieldId;
        input.name = field.name;
        input.required = field.required;
        formGroup.appendChild(input);
        
        // Add help text if provided
        if (field.helpText) {
          const helpText = document.createElement("div");
          helpText.className = "help-text";
          helpText.textContent = field.helpText;
          helpText.style.cssText = `
            font-size: 0.85rem;
            color: var(--gray-500);
            margin-top: 0.25rem;
          `;
          formGroup.appendChild(helpText);
        }
        
        container.appendChild(formGroup);
      }
    });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      // Validate checkboxes
      const validations = form.querySelectorAll('.checkbox-validation');
      let isValid = true;
      
      validations.forEach(validation => {
        if (validation.required && !validation.value) {
          const groupName = validation.dataset.checkboxGroup;
          isValid = false;
          alert(`Please select at least one option for ${groupName}`);
        }
      });
      
      if (!isValid) return;
      
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
          const data = await response.json();
          if (data.next) {
            window.location.href = data.next;
          } else {
            form.style.display = "none";
            thankYouMessage.style.display = "block";
          }
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
