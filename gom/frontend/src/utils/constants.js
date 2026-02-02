/**
 * MadMann Dynamics Theme Configuration
 * Centralized design tokens and theme settings
 */

export const theme = {
  colors: {
    primary: {
      black: '#0A0A0A',
      darkGrey: '#1F1F1F',
      steel: '#C0C0C0',
      yellow: '#FFD700',
    },
    secondary: {
      blue: '#00D4FF',
      cyan: '#00F0FF',
      orange: '#FF8C00',
    },
    status: {
      success: '#22C55E',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
  },
  typography: {
    fontFamily: {
      mono: "'IBM Plex Mono', 'Courier New', monospace",
    },
    sizes: {
      h1: '48px',
      h2: '36px',
      h3: '24px',
      h4: '18px',
      body: '16px',
      small: '14px',
      micro: '12px',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  breakpoints: {
    mobile: '640px',
    tablet: '1024px',
    desktop: '1280px',
  },
  animations: {
    duration: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.6s',
      verySlow: '0.8s',
    },
  },
};

export const services = [
  {
    id: 'odm',
    name: 'Original Design Manufacturing',
    category: 'ODM',
    description: 'High-precision components for aerospace, defense, nuclear, and consumer technology applications.',
    icon: 'Rocket',
    color: 'from-caution-yellow to-orange-600',
  },
  {
    id: 'scm',
    name: 'SCM Partnership',
    category: 'SCM',
    description: 'Strategic component sourcing leveraging new Indian manufacturing alternatives to reduce costs.',
    icon: 'TrendingUp',
    color: 'from-tech-blue to-tech-cyan',
  },
  {
    id: 'ems',
    name: 'Electronics Manufacturing Services',
    category: 'EMS',
    description: 'Full lifecycle production from mad ideation through prototype to large-scale manufacturing.',
    icon: 'Cpu',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'wire',
    name: 'Wire Harnessing',
    category: 'Wire Harnessing',
    description: 'Specialized solutions for automotive, electric vehicles, and defense sector applications.',
    icon: 'Zap',
    color: 'from-green-500 to-emerald-600',
  },
];

export default theme;
