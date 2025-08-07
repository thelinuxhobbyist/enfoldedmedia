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
  
  // Update mobile elements
  document.getElementById('long-description-mobile').textContent = pkg.longDescription;
  document.getElementById('price-mobile').textContent = pkg.price;
  document.getElementById('buy-link-mobile').href = pkg.stripeLink;

  const hostingSection = document.getElementById('hosting-section');
  const hostingInfo = document.getElementById('hosting-info');
  const hostingSectionMobile = document.getElementById('hosting-section-mobile');
  const hostingInfoMobile = document.getElementById('hosting-info-mobile');

  if (pkg.hosting) {
    hostingInfo.textContent = pkg.hosting;
    hostingInfoMobile.textContent = pkg.hosting;
  } else {
    hostingSection.style.display = 'none';
    hostingSectionMobile.style.display = 'none';
  }

  // Render related packages dynamically
  renderRelatedPackages(pkg);
});

function renderRelatedPackages(currentPackage) {
  const relatedContainer = document.getElementById('related-packages');
  if (!relatedContainer) return;

  // Define package categories and relationships
  const packageCategories = {
    'social-media': ['branding', 'marketing'],
    'event-poster': ['branding', 'creative'],
    'global-pack': ['branding', 'startup'],
    'small-business-starter': ['web', 'startup'],
    'branding-refresh': ['branding', 'creative'],
    'email-marketing': ['marketing', 'automation'],
    'website-maintenance': ['web', 'service'],
    'blog-setup': ['web', 'content'],
    'landing-page': ['web', 'marketing'],
    'portfolio': ['web', 'creative'],
    'multilingual-website': ['web', 'multilingual'],
    'brand-strategy': ['branding', 'consultation'],
    'automation': ['marketing', 'automation'],
    'ecommerce-complete': ['web', 'ecommerce', 'premium'],
    'app-design': ['creative', 'mobile', 'design'],
    'content-strategy': ['marketing', 'content', 'service'],
    'quick-logo': ['branding', 'creative'],
    'enterprise-solution': ['web', 'enterprise', 'service'],
    'video-editing': ['creative', 'marketing', 'service']
  };

  const currentCategories = packageCategories[currentPackage.id] || [];
  
  // Find related packages based on shared categories
  let relatedPackages = packages.filter(pkg => {
    if (pkg.id === currentPackage.id) return false;
    
    const pkgCategories = packageCategories[pkg.id] || [];
    // Check if they share at least one category
    return pkgCategories.some(cat => currentCategories.includes(cat));
  });

  // If we don't have enough related packages, fill with random ones
  if (relatedPackages.length < 3) {
    const remaining = packages.filter(pkg => 
      pkg.id !== currentPackage.id && 
      !relatedPackages.find(r => r.id === pkg.id)
    );
    
    // Shuffle and take needed amount
    const shuffled = remaining.sort(() => Math.random() - 0.5);
    relatedPackages = [...relatedPackages, ...shuffled].slice(0, 3);
  } else {
    // If we have more than 3, take the first 3
    relatedPackages = relatedPackages.slice(0, 3);
  }

  // Render the related packages
  relatedContainer.innerHTML = '';
  relatedPackages.forEach(pkg => {
    const packageCard = document.createElement('div');
    packageCard.className = 'card text-center';
    packageCard.innerHTML = `
      <h4>${pkg.name}</h4>
      <p>${pkg.shortDescription}</p>
      <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-blue); margin: var(--space-4) 0;">${pkg.price}</div>
      <a href="details.html?id=${pkg.id}" class="btn btn-primary">View Details</a>
    `;
    relatedContainer.appendChild(packageCard);
  });
}
