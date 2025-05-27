/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
	"./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}", 
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // Pawsome Brand Colors - Primary (CTAs, Branding, Highlights)
        'energetic-orange': '#FF914D',
        'natural-sage': '#9DB47C', 
        'calm-blue': '#6CA6CD',
        'warm-orange': '#FFB67',
        
        // Secondary Colors (Cards, Backgrounds, Hover states)
        'soft-yellow': '#FFE066',
        'periwinkle': '#D6CDEA',
        'warm-taupe': '#A1866F',
        'mint': '#1AB487',
        'crimson': '#F64E4E',
        
        // Background Colors (Text, Borders)
        'off-white': '#F9FAFB',
        'light-gray': '#E5E7EB',
        'charcoal-gray': '#3C3D3C',
        
        // Semantic color mappings for easy usage
        pawsome: {
          primary: '#FF914D',      // Energetic Orange
          secondary: '#9DB47C',    // Natural Sage  
          accent: '#6CA6CD',       // Calm Blue
          highlight: '#FFB657',    // Warm Orange
          success: '#1AB487',      // Mint
          warning: '#FFE066',      // Soft Yellow
          error: '#F64E4E',        // Crimson
          neutral: {
            50: '#F9FAFB',         // Off White
            100: '#E5E7EB',        // Light Gray
            900: '#3C3D3C',        // Charcoal Gray
          },
          hover: {
            yellow: '#FFE066',     // Soft Yellow
            purple: '#D6CDEA',     // Periwinkle
            taupe: '#A1866F',      // Warm Taupe
          }
        },
        
        // Keep existing shadcn colors for compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'        
        }
      },
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
  },
  plugins: [require("tailwindcss-animate")],
};
