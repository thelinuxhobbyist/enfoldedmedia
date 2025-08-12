document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id || typeof window.packages === 'undefined') return;

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

  // Populate features dynamically
  const desktopFeatures = document.getElementById('desktop-features');
  const mobileFeatures = document.getElementById('mobile-features');
  
  if (pkg.detailFeatures && pkg.detailFeatures.length > 0) {
    // Clear existing features
    desktopFeatures.innerHTML = '';
    mobileFeatures.innerHTML = '';
    
    // Populate desktop features (simple list)
    pkg.detailFeatures.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      desktopFeatures.appendChild(li);
    });
    
    // Populate mobile features (with checkmarks)
    pkg.detailFeatures.forEach((feature, index) => {
      const li = document.createElement('li');
      li.style.cssText = `
        display: flex; 
        align-items: center; 
        gap: var(--space-2); 
        margin-bottom: ${index === pkg.detailFeatures.length - 1 ? '0' : 'var(--space-2)'};
      `;
      li.innerHTML = `
        <span style="color: var(--primary-red); font-weight: bold;">✓</span>
        ${feature}
      `;
      mobileFeatures.appendChild(li);
    });
  } else {
    // Fallback features for packages without detailFeatures defined
    const fallbackFeatures = [
      'Professional design',
      'Multiple revisions included',
      'Fast delivery (3-5 business days)',
      'Full commercial rights'
    ];
    
    // Desktop fallback
    desktopFeatures.innerHTML = fallbackFeatures.map(feature => `<li>${feature}</li>`).join('');
    
    // Mobile fallback
    mobileFeatures.innerHTML = fallbackFeatures.map((feature, index) => `
      <li style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: ${index === fallbackFeatures.length - 1 ? '0' : 'var(--space-2)'};">
        <span style="color: var(--primary-red); font-weight: bold;">✓</span>
        ${feature}
      </li>
    `).join('');
  }

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

  // Smart recommendation algorithm (fully auto-detected)
  function getSmartRecommendations(currentPackageId, allPackages, count = 3) {
    const currentPkg = allPackages.find(p => p.id === currentPackageId);
    if (!currentPkg) return [];

    // Auto-detect metadata for any package based on its text & price
    function autoDetectMetadata(pkg) {
      const name = (pkg.name || '').toLowerCase();
      const shortDesc = (pkg.shortDescription || '').toLowerCase();
      const longDesc = (pkg.longDescription || '').toLowerCase();
      const text = `${name} ${shortDesc} ${longDesc}`;

      const priceMatch = String(pkg.price || '').match(/£(\d+)/);
      const priceNum = priceMatch ? parseInt(priceMatch[1]) : 0;

      let category = 'general';
      let priceRange = 'medium';

      if (/website|web|online|site|page|blog|portfolio/.test(text)) {
        category = 'web-development';
      } else if (/social|marketing|email|automation|campaign|digital/.test(text)) {
        category = 'digital-marketing';
      } else if (/brand|logo|identity|design|visual|graphic/.test(text)) {
        category = 'branding';
      } else if (/print|poster|flyer|card|brochure/.test(text)) {
        category = 'print-design';
      } else if (/maintenance|support|service|update/.test(text)) {
        category = 'web-services';
      } else if (/consult|strategy|planning|advice/.test(text)) {
        category = 'consulting';
      }

      if (priceNum <= 80) priceRange = 'low';
      else if (priceNum <= 150) priceRange = 'medium';
      else if (priceNum <= 200) priceRange = 'high';
      else if (priceNum > 200) priceRange = 'premium';

      const keywordPatterns = [
        'social', 'media', 'website', 'web', 'marketing', 'email', 'branding', 'brand',
        'logo', 'design', 'digital', 'online', 'print', 'poster', 'business', 'startup',
        'portfolio', 'blog', 'automation', 'strategy', 'consultation', 'maintenance',
        'creative', 'visual', 'graphic', 'content', 'seo', 'campaign'
      ];
      const keywords = keywordPatterns.filter(k => text.includes(k));

      const categoryComplements = {
        'web-development': ['social-media', 'email-marketing', 'branding-refresh'],
        'digital-marketing': ['social-media', 'email-marketing', 'automation'],
        'branding': ['social-media', 'global-pack', 'branding-refresh'],
        'print-design': ['branding-refresh', 'global-pack', 'social-media'],
        'web-services': ['small-business-starter', 'website-maintenance'],
        'consulting': ['brand-strategy', 'branding-refresh', 'global-pack'],
        'general': ['global-pack', 'social-media']
      };

      const complementary = categoryComplements[category] || categoryComplements.general;

      return { category, priceRange, complementary, keywords };
    }

    const currentMeta = autoDetectMetadata(currentPkg);

    const scoredPackages = allPackages
      .filter(p => p.id !== currentPackageId)
      .map(pkg => {
        const pkgMeta = autoDetectMetadata(pkg);
        let score = 0;

        if (currentMeta.complementary.includes(pkg.id)) score += 50; // complementary
        if (pkgMeta.category === currentMeta.category) score += 30;  // same category
        if (pkgMeta.priceRange === currentMeta.priceRange) score += 15; // similar price

        const keywordMatches = currentMeta.keywords.filter(k => pkgMeta.keywords.some(pk => pk.includes(k) || k.includes(pk))).length;
        score += keywordMatches * 5; // keyword overlap

        score += Math.random() * 5; // small randomizer

        return { package: pkg, score };
      });

    return scoredPackages
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(x => x.package);
  }

  // Generate smart related packages
  const relatedPackagesContainer = document.getElementById('related-packages-container');
  if (relatedPackagesContainer) {
    const relatedPackages = getSmartRecommendations(id, packages, 3);
    
    relatedPackages.forEach(relatedPkg => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card text-center';
      cardDiv.innerHTML = `
        <h4>${relatedPkg.name}</h4>
        <p>${relatedPkg.shortDescription}</p>
        <div class="package-price" style="font-size: 1.5rem; margin: var(--space-4) 0;">${relatedPkg.price}</div>
        <a href="details.html?id=${relatedPkg.id}" class="btn btn-primary">View Details</a>
      `;
      relatedPackagesContainer.appendChild(cardDiv);
    });
  }
});
