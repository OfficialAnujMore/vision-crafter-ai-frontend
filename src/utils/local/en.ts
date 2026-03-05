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
  navLogin: "Log in",

  // Home Section
  homeTitle: "Transform Your Imagination Into Reality",
  homeSubtitle: "AI-Powered Image Editing, Simplified.",
  homeDescription: "Remove backgrounds, extend images, add text overlays, and fine-tune every detail — all from your browser with the power of AI.",
  homeCtaButton: "Get Started",
  homeTrustedBy: "Trusted by creators worldwide",

  // Stats
  stats: [
    { value: "10K+", label: "Images Edited" },
    { value: "2K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "User Rating" },
  ],

  // Features Section
  featuresTitle: "Powerful Features",
  featuresSubtitle: "Everything you need to create amazing content",
  features: [
    {
      title: "Background Removal",
      description: "Instantly remove backgrounds from any image with AI precision — no manual masking required.",
      icon: "eraser",
    },
    {
      title: "Image Extension",
      description: "Expand your canvas beyond the original frame. AI generates seamless content to fill the new space.",
      icon: "expand",
    },
    {
      title: "Text Overlays",
      description: "Add beautiful, customizable text with Google Fonts, adjust sizing, color, and positioning on your canvas.",
      icon: "type",
    },
    {
      title: "Smart Adjustments",
      description: "Fine-tune brightness, contrast, and saturation with intuitive sliders for pixel-perfect results.",
      icon: "sliders",
    },
    {
      title: "Crop & Resize",
      description: "Precisely crop and resize your images to any dimension — perfect for social media, print, or web.",
      icon: "crop",
    },
    {
      title: "Cloud Projects",
      description: "Your work is saved securely in the cloud. Access, manage, and continue your projects from anywhere.",
      icon: "cloud",
    },
  ],

  // How It Works
  howItWorksTitle: "How It Works",
  howItWorksSubtitle: "Three simple steps to stunning visuals",
  steps: [
    {
      step: "01",
      title: "Upload Your Image",
      description: "Drag & drop or browse to upload any image. We support all major formats.",
    },
    {
      step: "02",
      title: "Edit with AI Tools",
      description: "Use our suite of AI-powered tools to transform your image exactly how you want.",
    },
    {
      step: "03",
      title: "Export & Share",
      description: "Download your finished image in high quality or share it directly from the editor.",
    },
  ],

  // Pricing Section
  pricingTitle: "Simple, Transparent Pricing",
  pricingSubtitle: "Choose the perfect plan for your needs",
  plans: [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for beginners",
      features: [
        "5 projects per month",
        "1080p exports",
        "Basic AI tools",
        "Community support",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For content creators",
      features: [
        "Unlimited projects",
        "4K exports",
        "All AI features",
        "Priority support",
        "Background removal",
        "Image extension",
      ],
      buttonText: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large teams",
      features: [
        "Everything in Professional",
        "Custom branding",
        "Dedicated support",
        "Team management",
        "API access",
      ],
      buttonText: "Contact Sales",
    },
  ],

  // Footer
  footerTagline: "Craft your vision with the power of AI.",
  footerCopyright: "VisionCrafterAI. All rights reserved.",
};
