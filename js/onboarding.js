fetch("https://enfoldedmedia.com/send-customization", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: userEmail,  // User's email (from Stripe or form)
    product: product,  // Product purchased (from onboarding.json)
    customizationDetails: customizationDetails,  // Form data (name, text, etc.)
  }),
})
.then((response) => {
  if (response.ok) {
    alert("Customization details submitted successfully!");
  } else {
    alert("Error submitting customization details.");
  }
})
.catch((error) => {
  console.error("Error:", error);
  alert("There was an error submitting your details.");
});

