const packages = [
  {
    id: 'social-media',
    name: 'Social Media Setup',
    shortDescription: 'Branded profile creation for Instagram, Facebook, TikTok or LinkedIn.',
    longDescription: 'We create social media profiles with branded graphics, bios, and startup content. Great for growing your brand on any platform.',
    price: '£80',
    stripeLink: 'https://buy.stripe.com/9B600i2DQ5zm9s74u91VK02',
    hosting: 'Free hosting for the first year'
  },
  {
    id: 'event-poster',
    name: 'Event Poster Design',
    shortDescription: 'Print and digital format poster design in any language.',
    longDescription: 'Beautiful, bold posters delivered in both print-ready and digital format. Multilingual options available.',
    price: '£60',
    stripeLink: 'https://buy.stripe.com/bJe9AS0vIe5SbAf4u91VK01',
    hosting: null // No hosting for this service
  },
  {
    id: 'global-pack',
    name: 'Startup Brand Pack',
    shortDescription: 'Logo, business cards, flyer, and 3 social templates.',
    longDescription: 'Get your brand ready to launch: professional logo, business cards, flyer, and matching social media templates.',
    price: '£150',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null // No hosting for this service
  },
  {
    id: 'small-business-starter',
    name: 'Small Business Starter Package',
    shortDescription: 'A one-page static website with free hosting.',
    longDescription: 'Get your business online with a professional one-page website. Includes free hosting for the first year and a custom domain from the second year.',
    price: '£100',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Free hosting for the first year'
  },
  {
    id: 'branding-refresh',
    name: 'Branding Refresh',
    shortDescription: 'Logo redesign, color scheme, and font style guide.',
    longDescription: 'Rejuvenate your brand with a new logo, updated color palette, and a complete style guide that fits your business vision.',
    price: '£120',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null // No hosting for this service
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing Setup',
    shortDescription: 'Email template design and setup on Mailchimp or similar.',
    longDescription: 'Reach your customers effectively with a customized email template designed to match your brand, and setup on Mailchimp or another platform.',
    price: '£90',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null // No hosting for this service
  },
  {
    id: 'website-maintenance',
    name: 'Website Maintenance & Updates',
    shortDescription: 'Ongoing updates, backups, and security for your site.',
    longDescription: 'Ensure your website remains secure, up-to-date, and running smoothly with monthly maintenance, backups, and content updates.',
    price: '£100/month',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null // No hosting for this service
  },
  {
    id: 'blog-setup',
    name: 'Blog Setup & Content Writing',
    shortDescription: 'Setup your blog and create 3 posts.',
    longDescription: 'Get your blog set up with an SEO-friendly layout and 3 initial posts, to help engage visitors and improve SEO.',
    price: '£150',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Free hosting for the first year'
  },
  {
    id: 'landing-page',
    name: 'Landing Page Design',
    shortDescription: 'High-converting landing page for your product or service.',
    longDescription: 'We design a focused landing page that drives conversions for your product, service, or promotional offer.',
    price: '£120',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Free hosting for the first year'
  },
  {
    id: 'portfolio',
    name: 'Online Portfolio for Creatives',
    shortDescription: 'A stunning portfolio website for photographers, designers, or artists.',
    longDescription: 'Showcase your creative work with a custom-designed portfolio, perfect for any artist, photographer, or designer.',
    price: '£200',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Paid hosting required' // Portfolio might require paid hosting
  },
  {
    id: 'multilingual-website',
    name: 'Multilingual Website Setup',
    shortDescription: 'Expand your reach with a multilingual website.',
    longDescription: 'We set up a multilingual website, enabling you to reach customers across different languages and borders.',
    price: '£250',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Free hosting for the first year'
  },
  {
    id: 'brand-strategy',
    name: 'Brand Strategy Session',
    shortDescription: '1-on-1 consultation to define your brand.',
    longDescription: 'In this session, we help you clarify your brand’s vision, mission, and target audience, setting a clear direction for your marketing.',
    price: '£150',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null // No hosting for this service
  },
  {
    id: 'automation',
    name: 'Marketing Automation Setup',
    shortDescription: 'Automate email and SMS campaigns.',
    longDescription: 'We set up automated email or SMS sequences to engage with leads and customers, improving your marketing efficiency.',
    price: '£180',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null // No hosting for this service
  },
  {
    id: 'ecommerce-complete',
    name: 'Complete E-commerce Website with Advanced Analytics Dashboard',
    shortDescription: 'Full e-commerce solution with payment processing, inventory management, and detailed analytics.',
    longDescription: 'A comprehensive e-commerce platform with secure payment processing, inventory management, customer accounts, order tracking, and advanced analytics dashboard to monitor your business performance.',
    price: '£450/month + £150 setup',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Premium hosting with SSL and daily backups included'
  },
  {
    id: 'app-design',
    name: 'Mobile App UI/UX Design',
    shortDescription: 'Modern app interface design.',
    longDescription: 'Complete mobile app user interface and user experience design including wireframes, prototypes, and final designs ready for development.',
    price: '£280',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null
  },
  {
    id: 'content-strategy',
    name: 'Comprehensive Content Marketing Strategy with Social Media Management',
    shortDescription: 'Complete content plan with social media management, blog writing, and SEO optimization.',
    longDescription: 'A full content marketing strategy including content calendar, blog post creation, social media management, SEO optimization, and monthly performance reports.',
    price: '£220/month',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null
  },
  {
    id: 'quick-logo',
    name: 'Logo',
    shortDescription: 'Simple logo design.',
    longDescription: 'A clean, professional logo design with 2 revisions included.',
    price: '£45',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null
  },
  {
    id: 'enterprise-solution',
    name: 'Enterprise Digital Transformation Package with Custom CRM Integration',
    shortDescription: 'Complete digital transformation solution including custom CRM, automated workflows, staff training, and ongoing support.',
    longDescription: 'A comprehensive enterprise solution featuring custom CRM development, automated business workflows, staff training programs, data migration, and 24/7 ongoing technical support.',
    price: '£1,200/month + £500 setup fee',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Enterprise hosting with dedicated servers and premium security'
  },
  {
    id: 'video-editing',
    name: 'Video Editing Service',
    shortDescription: 'Professional video editing for marketing.',
    longDescription: 'High-quality video editing for promotional content, social media, and marketing campaigns.',
    price: '£95/video',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null
  }
];

