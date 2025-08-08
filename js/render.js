
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('packages-container');
  if (!container || typeof packages === 'undefined') return;

  packages.forEach(pkg => {
    const div = document.createElement('div');
    div.className = 'package';
    div.innerHTML = `
      <h2>${pkg.name}</h2>
      <p>${pkg.shortDescription}</p>
      <p class="price package-price">${pkg.price}</p>
      <a class="btn" href="details.html?id=${pkg.id}">Details</a>
    `;
    container.appendChild(div);
  });
});
