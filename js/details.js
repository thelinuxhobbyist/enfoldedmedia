document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id || typeof packages === 'undefined') return;

  const pkg = packages.find(p => p.id === id);
  if (!pkg) return;

  document.getElementById('package-title').textContent = pkg.name;
  document.getElementById('long-description').textContent = pkg.longDescription;
  document.getElementById('price').textContent = pkg.price;
  document.getElementById('buy-link').href = pkg.stripeLink;

  const hostingEl = document.getElementById('hosting-info');
  hostingEl.textContent = pkg.hosting || 'Not included';
});

