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

  // Smart recommendation algorithm
  function getSmartRecommendations(currentPackageId, allPackages, count = 3) {
    const currentPkg = allPackages.find(p => p.id === currentPackageId);
    if (!currentPkg) return [];

    // Define package categories and relationships
    const packageMetadata = {
      'social-media': { 
        category: 'digital-marketing', 
        priceRange: 'low', 
        complementary: ['branding-refresh', 'global-pack', 'email-marketing', 'automation'],
        keywords: ['social', 'marketing', 'online', 'digital']
      },
      'event-poster': { 
        category: 'print-design', 
        priceRange: 'low', 
        complementary: ['global-pack', 'branding-refresh', 'social-media'],
        keywords: ['design', 'poster', 'print', 'visual']
      },
      'global-pack': { 
        category: 'branding', 
        priceRange: 'high', 
        complementary: ['social-media', 'small-business-starter', 'branding-refresh', 'brand-strategy'],
        keywords: ['branding', 'startup', 'logo', 'identity']
      },
      'small-business-starter': { 
        category: 'web-development', 
        priceRange: 'medium', 
        complementary: ['social-media', 'blog-setup', 'email-marketing', 'landing-page'],
        keywords: ['website', 'business', 'online', 'web']
      },
      'branding-refresh': { 
        category: 'branding', 
        priceRange: 'medium', 
        complementary: ['social-media', 'global-pack', 'brand-strategy', 'email-marketing'],
        keywords: ['branding', 'logo', 'refresh', 'identity']
      },
      'email-marketing': { 
        category: 'digital-marketing', 
        priceRange: 'medium', 
        complementary: ['social-media', 'automation', 'small-business-starter', 'blog-setup'],
        keywords: ['email', 'marketing', 'automation', 'digital']
      },
      'website-maintenance': { 
        category: 'web-services', 
        priceRange: 'medium', 
        complementary: ['small-business-starter', 'blog-setup', 'landing-page', 'portfolio'],
        keywords: ['maintenance', 'website', 'updates', 'service']
      },
      'blog-setup': { 
        category: 'web-development', 
        priceRange: 'high', 
        complementary: ['small-business-starter', 'email-marketing', 'social-media', 'website-maintenance'],
        keywords: ['blog', 'content', 'writing', 'seo']
      },
      'landing-page': { 
        category: 'web-development', 
        priceRange: 'medium', 
        complementary: ['social-media', 'email-marketing', 'small-business-starter', 'automation'],
        keywords: ['landing', 'conversion', 'page', 'web']
      },
      'portfolio': { 
        category: 'web-development', 
        priceRange: 'high', 
        complementary: ['branding-refresh', 'social-media', 'global-pack', 'website-maintenance'],
        keywords: ['portfolio', 'creative', 'showcase', 'artist']
      },
      'multilingual-website': { 
        category: 'web-development', 
        priceRange: 'premium', 
        complementary: ['global-pack', 'branding-refresh', 'social-media', 'email-marketing'],
        keywords: ['multilingual', 'international', 'website', 'global']
      },
      'brand-strategy': { 
        category: 'consulting', 
        priceRange: 'high', 
        complementary: ['global-pack', 'branding-refresh', 'social-media', 'automation'],
        keywords: ['strategy', 'consultation', 'branding', 'planning']
      },
      'automation': { 
        category: 'digital-marketing', 
        priceRange: 'high', 
        complementary: ['email-marketing', 'social-media', 'brand-strategy', 'landing-page'],
        keywords: ['automation', 'marketing', 'email', 'sms']
      }
    };

    // Auto-detect metadata for unknown packages
    function autoDetectMetadata(pkg) {
      const name = pkg.name.toLowerCase();
      const shortDesc = pkg.shortDescription.toLowerCase();
      const longDesc = pkg.longDescription.toLowerCase();
      const text = `${name} ${shortDesc} ${longDesc}`;
      
      // Extract price number for range classification
      const priceMatch = pkg.price.match(/£(\d+)/);
      const priceNum = priceMatch ? parseInt(priceMatch[1]) : 0;
      
      let category = 'general';
      let priceRange = 'medium';
      let keywords = [];
      
      // Auto-detect category based on text content
      if (text.match(/website|web|online|site|page|blog|portfolio/)) {
        category = 'web-development';
      } else if (text.match(/social|marketing|email|automation|campaign|digital/)) {
        category = 'digital-marketing';
      } else if (text.match(/brand|logo|identity|design|visual|graphic/)) {
        category = 'branding';
      } else if (text.match(/print|poster|flyer|card|brochure/)) {
        category = 'print-design';
      } else if (text.match(/maintenance|support|service|update/)) {
        category = 'web-services';
      } else if (text.match(/consult|strategy|planning|advice/)) {
        category = 'consulting';
      }
      
      // Auto-detect price range
      if (priceNum <= 80) priceRange = 'low';
      else if (priceNum <= 150) priceRange = 'medium';
      else if (priceNum <= 200) priceRange = 'high';
      else priceRange = 'premium';
      
      // Extract keywords from text
      const keywordPatterns = [
        'social', 'media', 'website', 'web', 'marketing', 'email', 'branding', 'brand',
        'logo', 'design', 'digital', 'online', 'print', 'poster', 'business', 'startup',
        'portfolio', 'blog', 'automation', 'strategy', 'consultation', 'maintenance',
        'creative', 'visual', 'graphic', 'content', 'seo', 'campaign'
      ];
      
      keywords = keywordPatterns.filter(keyword => text.includes(keyword));
      
      // Auto-suggest complementary services based on category
      let complementary = [];
      const categoryComplements = {
        'web-development': ['social-media', 'email-marketing', 'branding-refresh'],
        'digital-marketing': ['social-media', 'email-marketing', 'automation'],
        'branding': ['social-media', 'global-pack', 'branding-refresh'],
        'print-design': ['branding-refresh', 'global-pack', 'social-media'],
        'web-services': ['small-business-starter', 'website-maintenance'],
        'consulting': ['brand-strategy', 'branding-refresh', 'global-pack']
      };
      complementary = categoryComplements[category] || ['social-media', 'global-pack'];
      
      return { category, priceRange, complementary, keywords };
    }

    // Get or auto-detect metadata for current package
    const currentMeta = packageMetadata[currentPackageId] || autoDetectMetadata(currentPkg);

    // Score each package based on multiple factors
    const scoredPackages = allPackages
      .filter(p => p.id !== currentPackageId)
      .map(pkg => {
        const pkgMeta = packageMetadata[pkg.id] || autoDetectMetadata(pkg);
        let score = 0;

        // 1. Complementary services (highest weight)
        if (currentMeta.complementary.includes(pkg.id)) {
          score += 50;
        }

        // 2. Same category (medium weight)
        if (pkgMeta.category === currentMeta.category) {
          score += 30;
        }

        // 3. Similar price range (low weight)
        if (pkgMeta.priceRange === currentMeta.priceRange) {
          score += 15;
        }

        // 4. Keyword matching (low weight)
        const keywordMatches = currentMeta.keywords.filter(keyword => 
          pkgMeta.keywords.some(pkgKeyword => pkgKeyword.includes(keyword) || keyword.includes(pkgKeyword))
        ).length;
        score += keywordMatches * 5;

        // 5. Popular combinations bonus
        const popularCombos = {
          'social-media': ['global-pack', 'email-marketing'],
          'global-pack': ['social-media', 'small-business-starter'],
          'small-business-starter': ['social-media', 'email-marketing'],
          'branding-refresh': ['social-media', 'global-pack']
        };
        
        if (popularCombos[currentPackageId]?.includes(pkg.id)) {
          score += 25;
        }

        // 6. Boost score for unknown packages to give them visibility
        if (!packageMetadata[pkg.id]) {
          score += 10; // Small boost so new packages don't get buried
        }

        // 7. Add some randomness to avoid always showing the same packages
        score += Math.random() * 5;

        return { package: pkg, score };
      });

    // Sort by score and return top packages
    return scoredPackages
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(item => item.package);
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
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-blue); margin: var(--space-4) 0;">${relatedPkg.price}</div>
        <a href="details.html?id=${relatedPkg.id}" class="btn btn-primary">View Details</a>
      `;
      relatedPackagesContainer.appendChild(cardDiv);
    });
  }
});
