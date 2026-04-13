/**
 * English localization for VisionCrafterAI Frontend
 * All UI text and messages are centralized here
 */

export const COMMON = {
  loading: "Loading...",
  error: "An error occurred",
  success: "Success",
  cancel: "Cancel",
  save: "Save",
  delete: "Delete",
  edit: "Edit",
  create: "Create",
};

export const LANDING_PAGE = {
  // Navbar
  navLogo: "Vision Crafter AI",
  navHome: "Home",
  navFeatures: "Features",
  navPricing: "Pricing",
  navAbout: "About",
  navLogin: "Log in",

  // Home Section
  homeTitle: "Transform Your Imagination Into Reality",
  homeSubtitle: "AI-Powered Image Editing, Simplified.",
  homeDescription:
    "Vision Crafter AI is an all-in-one browser-based image studio that fuses a Fabric.js canvas editor with generative AI. Remove backgrounds, extend scenes, generate new visuals, add typography, and fine-tune every pixel — no installs, no Photoshop, no steep learning curve.",
  homeHighlights: [
    "Built-in AI background removal & image extension",
    "Text-to-image generation with token credits",
    "Cloud projects with auto-save & version history",
  ],
  homeCtaButton: "Get Started Free",
  homeSecondaryCta: "See Pricing",
  homeTrustedBy: "Trusted by creators worldwide",

  // Stats
  stats: [
    { value: "10K+", label: "Images Edited" },
    { value: "2K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "User Rating" },
  ],

  // Features Section
  featuresTitle: "Everything You Need, In One Canvas",
  featuresSubtitle:
    "A production-grade toolkit that combines classic image editing with modern generative AI — all running in your browser.",
  features: [
    {
      title: "AI Background Removal",
      description:
        "Isolate subjects from any photo in one click. AI-grade edge detection handles hair, fur, and fine details automatically.",
      icon: "eraser",
    },
    {
      title: "Generative Image Extension",
      description:
        "Expand your canvas beyond the original frame. The AI paints seamless, context-aware content into the new space.",
      icon: "expand",
    },
    {
      title: "Rich Text & Typography",
      description:
        "Add headline-worthy type with Google Fonts, custom colors, shadows, and pixel-perfect positioning.",
      icon: "type",
    },
    {
      title: "Smart Adjustments",
      description:
        "Fine-tune brightness, contrast, saturation, and filters with real-time sliders for pro-level results.",
      icon: "sliders",
    },
    {
      title: "Crop, Resize & Transform",
      description:
        "Precision cropping, resizing, layering, and object manipulation — perfect for social, print, or web delivery.",
      icon: "crop",
    },
    {
      title: "Cloud Projects & Auto-Save",
      description:
        "Every change is auto-saved to the cloud with thumbnail previews. Pick up exactly where you left off, from any device.",
      icon: "cloud",
    },
  ],

  // How It Works
  howItWorksTitle: "How It Works",
  howItWorksSubtitle: "From blank canvas to polished visual in three steps",
  steps: [
    {
      step: "01",
      title: "Upload or Start Fresh",
      description:
        "Drag & drop any image, or spin up a blank canvas. We support PNG, JPG, WebP, and more.",
    },
    {
      step: "02",
      title: "Edit With AI Tools",
      description:
        "Use AI features by spending tokens, or refine freely with unlimited non-AI editing tools.",
    },
    {
      step: "03",
      title: "Export & Share",
      description:
        "Download in PNG, JPG, WebP, or PDF at up to 4K — or share directly from the editor.",
    },
  ],

  // Pricing — Token Credits Model
  pricingTitle: "Pay Only For What You Create",
  pricingSubtitle:
    "Non-AI editing is always free. AI features use tokens — buy a pack that fits your workflow, no subscription required.",
  tokenCostsTitle: "Token Cost Per AI Action",
  tokenCosts: [
    { action: "Background Removal", cost: "2 tokens" },
    { action: "Image Extension (Outpaint)", cost: "5 tokens" },
    { action: "AI Image Generation", cost: "4 tokens" },
    { action: "Smart Object Removal", cost: "3 tokens" },
  ],
  plans: [
    {
      name: "Starter",
      price: "Free",
      period: "",
      tokens: "50 tokens",
      description: "Try every AI feature, no card required.",
      features: [
        "50 free tokens on signup",
        "Full editor access",
        "Cloud projects & auto-save",
        "1080p exports",
        "Community support",
      ],
      buttonText: "Start Free",
    },
    {
      name: "Creator",
      price: "$9",
      period: "one-time",
      tokens: "500 tokens",
      description: "For hobbyists and side projects.",
      features: [
        "500 tokens (never expire)",
        "All AI features unlocked",
        "4K exports",
        "Unlimited cloud projects",
        "Email support",
      ],
      buttonText: "Buy Creator Pack",
      popular: true,
    },
    {
      name: "Pro",
      price: "$29",
      period: "one-time",
      tokens: "2,000 tokens",
      description: "For content creators & freelancers.",
      features: [
        "2,000 tokens (never expire)",
        "All AI features unlocked",
        "4K & PDF exports",
        "Priority AI queue",
        "Priority email support",
      ],
      buttonText: "Buy Pro Pack",
    },
  ],

  // About Developer
  aboutTitle: "About the Developer",
  aboutSubtitle: "One developer, one vision, one canvas.",
  developer: {
    name: "Anuj More",
    role: "Full Stack Developer · MS Computer Science @ CSU Fullerton",
    bio: "I'm Anuj — a full-stack engineer with 3+ years of production experience building React/TypeScript dashboards, Node.js & FastAPI microservices, and event-driven systems on AWS. Vision Crafter AI is my take on what a modern, AI-first image editor should feel like: fast, cloud-synced, and pay-as-you-create. Currently pursuing my MS in Computer Science at California State University, Fullerton (graduating May 2026) and actively looking for software engineering opportunities.",
    highlights: [
      "3+ yrs full-stack at Sankey Solutions & Study Monk",
      "React · TypeScript · Node.js · FastAPI · PostgreSQL · AWS",
      "Built EV analytics platforms, Kafka microservices & Stripe integrations",
      "MS Computer Science @ CSU Fullerton (GPA 3.8, grad May 2026)",
    ],
    location: "Fullerton, CA",
    email: "moreanuj1307@gmail.com",
    phone: "+1 (714) 519-7477",
    github: "https://github.com/OfficialAnujMore",
    linkedin: "https://linkedin.com/in/anuj-more",
    portfolio: "https://anuj-more.netlify.app",
  },

  // Footer
  footerTagline: "Craft your vision with the power of AI.",
  footerCopyright: "VisionCrafterAI. Built by Anuj More. All rights reserved.",
};
