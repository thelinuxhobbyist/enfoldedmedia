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
  // Test packages with varying content lengths
  {
    id: 'logo',
    name: 'Logo',
    shortDescription: 'Simple logo design.',
    longDescription: 'A simple logo design for your business.',
    price: '£50',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null
  },
  {
    id: 'mobile-app-ui-ux',
    name: 'Mobile App UI/UX Design',
    shortDescription: 'Complete mobile app interface and user experience design with wireframes, prototypes, and design systems.',
    longDescription: 'Comprehensive mobile application interface and user experience design service including detailed user research, wireframe creation, interactive prototypes, visual design, and complete design system development. We create intuitive and engaging mobile experiences that delight users and drive business results through thoughtful design decisions.',
    price: '£450',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null
  },
  {
    id: 'enterprise-package',
    name: 'Enterprise Digital Transformation Package with Custom CRM Integration',
    shortDescription: 'Complete digital transformation solution including custom CRM, advanced analytics, and comprehensive training.',
    longDescription: 'Our most comprehensive enterprise solution featuring complete digital transformation services including custom CRM development, advanced data analytics implementation, automated workflow systems, comprehensive staff training programs, ongoing technical support, and strategic digital consulting services designed to revolutionize your business operations.',
    price: '£2,500',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Enterprise hosting included'
  },
  {
    id: 'business-card-design',
    name: 'Business Card Design',
    shortDescription: 'Professional business card design with print files.',
    longDescription: 'Professional business card design service with multiple concepts and print-ready files.',
    price: '£40',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null
  },
  {
    id: 'comprehensive-marketing',
    name: 'Comprehensive Marketing Strategy Development and Implementation Package',
    shortDescription: 'Full marketing strategy including brand development, digital marketing, content creation, and performance analytics.',
    longDescription: 'Complete marketing strategy development and implementation including comprehensive brand identity development, multi-channel digital marketing campaigns, content creation and management, social media strategy, email marketing automation, search engine optimization, paid advertising management, and detailed performance analytics and reporting.',
    price: '£850',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: 'Marketing platform hosting included'
  },
  {
    id: 'flyer',
    name: 'Flyer',
    shortDescription: 'Basic flyer design.',
    longDescription: 'A basic flyer design for your promotional needs.',
    price: '£30',
    stripeLink: 'https://buy.stripe.com/eVq3cu4LY4vi33J5yd1VK00',
    hosting: null
  }
];

