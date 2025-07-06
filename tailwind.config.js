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
			fontFamily: {
				'fredoka': ['Fredoka', 'Comic Sans MS', 'sans-serif'],
				'nunito': ['Nunito', 'Segoe UI', 'sans-serif'],
				'pacifico': ['Pacifico', 'cursive']
			},
			colors: {
				// New Vibrant Pet-Friendly Palette
				// Primary Colors
				"primary-blue": "#2196F3",      // Bright, trustworthy blue
				"vibrant-orange": "#FF6B35",    // Playful orange for CTAs
				"sunny-yellow": "#FFD93D",      // Happy yellow for highlights
				
				// Secondary Colors
				"soft-pink": "#FFB6C1",         // Gentle pink for accents
				"mint-green": "#4ECDC4",        // Fresh mint for success states
				"lavender": "#B19CD9",          // Soft purple for special features
				
				// Neutrals
				"warm-white": "#FFFAF0",        // Creamy white backgrounds
				"soft-gray": "#F5F5F5",         // Light gray for sections
				"charcoal": "#2C3E50",          // Dark text
				"medium-gray": "#7F8C8D",       // Secondary text
				
				// Legacy colors (keeping for backward compatibility)
				"energetic-orange": "#FF914D",
				"natural-sage": "#9DB17C",
				"calm-blue": "#6CA6CD",
				"warm-orange": "#FFBF57",
				"soft-yellow": "#FFE066",
				"periwinkle": "#D6CDEA",
				"warm-taupe": "#A1866F",
				"mint": "#1AB487",
				"crimson": "#F64E4E",
				"off-white": "#F9FAFB",
				"light-gray": "#E5E7EB",
				"charcoal-gray": "#3C3D3C",
				"cream-white": "#F9F7F3",

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
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '20px',
				'3xl': '30px'
			},
			fontSize: {
				'hero': '4rem',
				'display': '3rem'
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
				},
				'bounce-slow': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				},
				'wiggle': {
					'0%, 100%': {
						transform: 'rotate(-3deg)'
					},
					'50%': {
						transform: 'rotate(3deg)'
					}
				},
				'pulse-soft': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'wiggle': 'wiggle 1s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
