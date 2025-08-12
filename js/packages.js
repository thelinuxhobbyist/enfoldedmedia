const packages = [
  {
    id: 'social-media',
    name: 'Social Media Setup',
    shortDescription: 'Branded profile creation for Instagram, Facebook, TikTok or LinkedIn.',
    longDescription: 'We create social media profiles with branded graphics, bios, and startup content. Great for growing your brand on any platform.',
    price: '£80',
    stripeLink: 'https://buy.stripe.com/9B600i2DQ5zm9s74u91VK02',
    hosting: 'Free hosting for the first year',
    packageFeatures: [
      'Professional design',
      'Fast delivery (3-5 days)',
      'Account setup assistance'
    ],
    detailFeatures: [
      'Professional branded graphics',
      'Platform-optimized content',
      'Fast delivery (2-3 days)',
      'Account setup assistance'
    ]
  },
  {
    id: 'event-poster',
    name: 'Event Poster Design',
    shortDescription: 'Print and digital format poster design.',
    longDescription: 'Beautiful, bold posters delivered in both print-ready and digital format. Multilingual options can be discussed directly with you.',
    price: '£60',
    stripeLink: 'https://buy.stripe.com/bJe9AS0vIe5SbAf4u91VK01',
    hosting: null,
    packageFeatures: [
      'Print & digital formats',
      'Fast delivery (3-5 days)'
    ],
    detailFeatures: [
      'Print-ready high resolution',
      'Digital format included',
      'Up to 3 revision rounds',
      'Professional layout design'
    ]
  },
  {
    id: 'global-pack',
    name: 'Startup Brand Pack',
    shortDescription: 'Logo, business cards, flyer, and 3 social templates.',
    longDescription: 'Get your brand ready to launch: professional logo, business cards, flyer, and matching social media templates.',
    price: '£150',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null,
    packageFeatures: [
      'Professional design',
      'Fast delivery (3-5 days)'
    ],
    detailFeatures: [
      'Professional logo design',
      'Business card design',
      'Promotional flyer design',
      '3 social media templates',
      'Brand guideline document'
    ]
  },
  {
    id: 'quick-amendments',
    name: 'Quick Amendments',
    shortDescription: 'Make fast changes to your existing designs.',
    longDescription: 'Already have a design but need a few tweaks? Let us update or replace your images, text, or other elements quickly to meet your needs.',
    price: '£25',
    stripeLink: 'https://buy.stripe.com/bJe9AS0vIe5SbAf4u91VK01',
    hosting: null,
    packageFeatures: [
      'Fast design updates',
      'Up to 2 rounds of revisions',
      'Print-ready PDF provided'
    ],
    detailFeatures: [
      'Minor image and text replacements',
      'Quick turnaround (1-2 days)',
      'Print-ready high resolution file',
      'Up to two revision rounds'
    ]
  },
  {
    id: 'layout-design',
    name: 'Layout Design',
    shortDescription: 'Custom design layout for your content.',
    longDescription: 'You provide the content, and we’ll create a custom layout to bring your vision to life, tailored to your specific needs and branding.',
    price: '£50',
    stripeLink: 'https://buy.stripe.com/bJe9AS0vIe5SbAf4u91VK01',
    hosting: null,
    packageFeatures: [
      'One custom layout design',
      'Fast delivery (3-5 days)'
    ],
    detailFeatures: [
      'Tailored layout design based on your brief',
      'Print-ready and digital formats included',
      'Quick turnaround (3-5 days)'
    ]
  },
  {
    id: 'recreate-design',
    name: 'Recreate Design',
    shortDescription: 'Recreate or redesign your existing artwork.',
    longDescription: 'Need to give your current design a fresh look? We can help you recreate or redesign existing artwork to make it more professional or updated.',
    price: '£75',
    stripeLink: 'https://buy.stripe.com/bJe9AS0vIe5SbAf4u91VK01',
    hosting: null,
    packageFeatures: [
      'Recreation of existing design',
      'Print and digital formats'
    ],
    detailFeatures: [
      'Redesign or recreate your artwork from scratch',
      'Print and digital versions included',
      'Professional layout and high-quality files'
    ]
  },
  {
    id: 'full-design-package',
    name: 'Full Design Package',
    shortDescription: 'End-to-end design service for complete branding or event creation.',
    longDescription: 'Need a full design service from start to finish? We handle everything, from concept to creation, ensuring consistency and professional quality.',
    price: '£120',
    stripeLink: 'https://buy.stripe.com/bJe9AS0vIe5SbAf4u91VK01',
    hosting: null,
    packageFeatures: [
      'Full design service from concept to print',
      'Brand guidelines included'
    ],
    detailFeatures: [
      'Senior designer consultation',
      'Up to three design concepts',
      'Brand style guide and asset delivery',
      'Print and digital formats included'
    ]
  },
  {
    id: 'small-business-starter',
    name: 'Small Business Starter Package',
    shortDescription: 'A one-page static website with free hosting.',
    longDescription: 'Get your business online with a professional one-page website. Includes free hosting, but you’ll need to purchase the domain.',
    price: '£100',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Free hosting (Domain purchase required)',
    packageFeatures: [
      'Professional design',
      'Fast delivery (3-5 days)',
      'Free hosting (Domain purchase required)'
    ],
    detailFeatures: [
      'One-page responsive website',
      'Mobile-optimized design',
      'Contact form integration',
      'SEO-friendly structure',
      'Domain purchase required',
      'SSL certificate included'
    ]
  },
  {
    id: 'branding-refresh',
    name: 'Branding Refresh',
    shortDescription: 'Logo redesign, color scheme, and font style guide.',
    longDescription: 'Rejuvenate your brand with a new logo, updated color palette, and a complete style guide that fits your business vision.',
    price: '£120',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null,
    packageFeatures: [
      'Professional design',
      'Fast delivery (3-5 days)'
    ],
    detailFeatures: [
      'Logo redesign',
      'Color scheme development',
      'Font style guide',
      'Brand identity document',
      'Vector files provided'
    ]
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing Setup',
    shortDescription: 'Email template design and setup on Mailchimp or similar.',
    longDescription: 'Reach your customers effectively with a customized email template designed to match your brand, and setup on Mailchimp or another platform.',
    price: '£90',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null,
    packageFeatures: [
      'Professional design',
      'Fast delivery (3-5 days)'
    ],
    detailFeatures: [
      'Custom email template design',
      'Platform setup (Mailchimp/similar)',
      'Brand-matched styling',
      'Mobile-responsive design',
      'Test campaign setup',
      'Basic analytics setup'
    ]
  },
  {
    id: 'website-maintenance',
    name: 'Website Maintenance & Updates',
    shortDescription: 'Ongoing updates, backups, and security for your site.',
    longDescription: 'Ensure your website remains secure, up-to-date, and running smoothly with monthly maintenance, backups, and content updates.',
    price: '£100/month',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null,
    packageFeatures: [
      'Monthly maintenance',
      'Security updates',
      'Content updates'
    ],
    detailFeatures: [
      'Monthly security updates',
      'Regular backups',
      'Content updates (up to 2 hours/month)',
      'Performance monitoring',
      'Security scanning',
      'Priority support'
    ]
  },
  {
    id: 'blog-setup',
    name: 'Blog Setup & Content Writing',
    shortDescription: 'Set up and write content for your blog.',
    longDescription: 'We help you set up a professional blog with SEO-friendly layout and initial content creation. Great for businesses looking to start a blog or improve existing blogs.',
    price: '£150',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Paid hosting (Domain purchase required)',
    packageFeatures: [
      'Professional design',
      'Fast delivery (3-5 days)',
      'Paid hosting (Domain purchase required)'
    ],
    detailFeatures: [
      'Blog setup and design',
      '3 professionally written posts',
      'SEO optimization',
      'Comment system setup',
      'Social sharing integration',
      'Paid hosting (Domain purchase required)'
    ]
  },
  {
    id: 'landing-page',
    name: 'Landing Page Design',
    shortDescription: 'High-converting landing page for your product or service.',
    longDescription: 'We design a focused landing page that drives conversions for your product, service, or promotional offer.',
    price: '£120',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Free hosting (Domain purchase required)',
    packageFeatures: [
      'Professional design',
      'Fast delivery (3-5 days)',
      'Free hosting (Domain purchase required)'
    ],
    detailFeatures: [
      'Conversion-optimized design',
      'Mobile-responsive layout',
      'Contact form integration',
      'Analytics setup',
      'A/B testing recommendations',
      'Domain purchase required'
    ]
  },
  {
    id: 'portfolio',
    name: 'Online Portfolio for Creatives',
    shortDescription: 'A stunning portfolio website for photographers, designers, or artists.',
    longDescription: 'Showcase your creative work with a custom-designed portfolio, perfect for any artist, photographer, or designer.',
    price: '£200',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Paid hosting required',
    packageFeatures: [
      'Professional design',
      'Fast delivery (3-5 days)'
    ],
    detailFeatures: [
      'Custom portfolio design',
      'Gallery functionality',
      'Contact form integration',
      'Mobile-optimized display',
      'Client testimonials section',
      'Social media integration'
    ]
  },
  {
    id: 'multilingual-website',
    name: 'Multilingual Website Setup',
    shortDescription: 'Expand your reach with a multilingual website.',
    longDescription: 'Reach new audiences in the UK with a multilingual website. You provide the content, or we can translate it for you.',
    price: '£250',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Free hosting (Domain purchase required)',
    packageFeatures: [
      'Professional design',
      'Fast delivery (3-5 days)',
      'Free hosting (Domain purchase required)'
    ],
    detailFeatures: [
      'Multi-language setup',
      'You provide content or we can translate it',
      'SEO optimization for each language',
      'Cultural adaptation guidance',
      'Domain purchase required'
    ]
  },
];
