/**
 * English localization for VisionCrafterAI Frontend
 * All UI text and messages are centralized here
 */

export const REGISTER_PAGE = {
  // Left side
  logo: "Vision Crafter AI",
  backToWebsite: "Back to website →",
  slogan1: "Transform Your Imagination Into Reality",
  slogan2: "The future of editing with AI",
  
  // Right side - Header
  title: "Create an account",
  subtitle: "Already have an account?",
  loginLink: "Log in",
  
  // Form fields
  firstNameLabel: "First name",
  firstNamePlaceholder: "First name",
  lastNameLabel: "Last name",
  lastNamePlaceholder: "Last name",
  username: "Username",
  emailLabel: "Email",
  usernamePlaceholder: "Username",
  emailPlaceholder: "Email",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter your password",
  
  // Terms & Actions
  termsPrefix: "I agree to the",
  termsLink: "Terms & Conditions",
  createAccountButton: "Create account",
  
  // Alerts
  termsRequiredAlert: "Please agree to the Terms & Conditions",
};

export const LOGIN_PAGE = {
  title: "Welcome back",
  subtitle: "Don't have an account?",
  signupLink: "Sign up",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter your password",
  forgotPassword: "Forgot password?",
  loginButton: "Log in",
  rememberMe: "Remember me",
};

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
  homeSubtitle: "The future of editing with AI",
  homeDescription: "Create stunning visuals and videos with the power of artificial intelligence.",
  homeCtaButton: "Get Started Free",
  
  // Features Section
  featuresTitle: "Powerful Features",
  featuresSubtitle: "Everything you need to create amazing content",
  features: [
    {
      title: "AI-Powered Editing",
      description: "Intelligent algorithms that understand your vision and bring it to life",
    },
    {
      title: "Smart Templates",
      description: "Pre-designed templates optimized for different content types",
    },
    {
      title: "Real-Time Collaboration",
      description: "Work with your team in real-time with instant updates",
    },
    {
      title: "Professional Quality",
      description: "Export in 4K and multiple formats for any platform",
    },
    {
      title: "Extensive Library",
      description: "Access millions of stock photos, videos, and music tracks",
    },
    {
      title: "Advanced Analytics",
      description: "Track performance and engagement metrics in one place",
    },
  ],
  
  // Pricing Section
  pricingTitle: "Simple, Transparent Pricing",
  pricingSubtitle: "Choose the perfect plan for your needs",
  plans: [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for beginners",
      features: [
        "5 projects per month",
        "1080p exports",
        "Basic templates",
        "Community support",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Professional",
      price: "$29",
      description: "For content creators",
      features: [
        "Unlimited projects",
        "4K exports",
        "All templates",
        "Priority support",
        "Advanced AI features",
      ],
      buttonText: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
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
};
