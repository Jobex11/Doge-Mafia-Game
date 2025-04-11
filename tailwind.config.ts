
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
				sans: ['Inter', 'sans-serif'],
				display: ['Clash Display', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				mafia: {
					DEFAULT: 'hsl(348, 100%, 61%)',
					light: 'hsl(348, 100%, 70%)',
					dark: 'hsl(348, 100%, 45%)',
				},
				rescuer: {
					DEFAULT: 'hsl(207, 100%, 61%)',
					light: 'hsl(207, 100%, 70%)',
					dark: 'hsl(207, 100%, 45%)',
				},
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
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'card-flip': {
					'0%': { transform: 'rotateY(0deg)' },
					'100%': { transform: 'rotateY(180deg)' }
				},
				'card-appear': {
					from: { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
					to: { opacity: '1', transform: 'translateY(0) scale(1)' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'slide-up': {
					from: { transform: 'translateY(20px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					from: { transform: 'translateY(-20px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-left': {
					from: { transform: 'translateX(20px)', opacity: '0' },
					to: { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-right': {
					from: { transform: 'translateX(-20px)', opacity: '0' },
					to: { transform: 'translateX(0)', opacity: '1' }
				},
				'shimmer': {
					from: { backgroundPosition: '200% 0' },
					to: { backgroundPosition: '-200% 0' }
				},
				'dash': {
					to: { strokeDashoffset: '0' }
				},
				'spin-slow': {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'glow': {
					'0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(138, 75, 175, 0.5))' },
					'50%': { filter: 'drop-shadow(0 0 15px rgba(138, 75, 175, 0.8))' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'card-flip': 'card-flip 0.6s ease-out forwards',
				'card-appear': 'card-appear 0.5s ease-out forwards',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'slide-up': 'slide-up 0.5s ease-out forwards',
				'slide-down': 'slide-down 0.5s ease-out forwards',
				'slide-left': 'slide-left 0.5s ease-out forwards',
				'slide-right': 'slide-right 0.5s ease-out forwards',
				'shimmer': 'shimmer 3s linear infinite',
				'dash': 'dash 3s linear infinite',
				'spin-slow': 'spin-slow 10s linear infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
			},
			backgroundImage: {
				'hero-pattern': 'linear-gradient(to bottom right, rgba(13, 13, 13, 0.9), rgba(20, 20, 20, 0.85)), url("/images/tokyo-bg.jpg")',
				'card-gradient': 'linear-gradient(to bottom right, rgba(40, 40, 40, 0.8), rgba(15, 15, 15, 0.9))',
				'mafia-gradient': 'linear-gradient(135deg, #2d0813 0%, #5a0f28 100%)',
				'rescuer-gradient': 'linear-gradient(135deg, #0a2a4a 0%, #1a4c80 100%)',
				'shimmer-gradient': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)',
				'donation-gradient': 'linear-gradient(135deg, #D946EF 0%, #8B5CF6 100%)',
				'asian-pattern': 'linear-gradient(rgba(13, 13, 13, 0.9), rgba(20, 20, 20, 0.9)), url("/lovable-uploads/2cfdf967-6e5f-4eb9-a956-a4b75dfc7cf7.png")',
				'neon-grid': 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/lovable-uploads/3b85fedc-243a-4a05-b130-6c8e729e88ec.png")',
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }) {
			const newUtilities = {
				'.text-gradient-mafia': {
					'background': 'linear-gradient(to right, #ff3366, #ff5e62)',
					'-webkit-background-clip': 'text',
					'-webkit-text-fill-color': 'transparent',
				},
				'.text-gradient-rescuer': {
					'background': 'linear-gradient(to right, #0ea5e9, #2563eb)',
					'-webkit-background-clip': 'text',
					'-webkit-text-fill-color': 'transparent',
				},
				'.text-gradient-primary': {
					'background': 'linear-gradient(to right, #D946EF, #8B5CF6)',
					'-webkit-background-clip': 'text',
					'-webkit-text-fill-color': 'transparent',
				},
				'.text-gradient-neon': {
					'background': 'linear-gradient(to right, #ff00cc, #3393ff)',
					'-webkit-background-clip': 'text',
					'-webkit-text-fill-color': 'transparent',
					'filter': 'drop-shadow(0 0 2px rgba(255, 0, 204, 0.5))',
				},
				'.animate-dash': {
					'stroke-dasharray': '100',
					'stroke-dashoffset': '100',
					'animation': 'dash 3s linear infinite',
				},
				'.card-3d-effect': {
					'transform-style': 'preserve-3d',
					'transition': 'transform 0.5s ease',
				},
				'.card-3d-effect:hover': {
					'transform': 'translateY(-10px) rotateX(5deg) rotateY(5deg)',
					'box-shadow': '0 30px 40px rgba(0, 0, 0, 0.4)',
				},
				'.glow-on-hover': {
					'position': 'relative',
					'z-index': '1',
				},
				'.glow-on-hover::after': {
					'content': '""',
					'position': 'absolute',
					'top': '-2px',
					'left': '-2px',
					'right': '-2px',
					'bottom': '-2px',
					'z-index': '-1',
					'background': 'linear-gradient(45deg, #ff00cc, #3393ff, #00ff9d, #ffcc00)',
					'background-size': '400% 400%',
					'border-radius': 'inherit',
					'filter': 'blur(10px)',
					'opacity': '0',
					'transition': 'opacity 0.3s ease',
				},
				'.glow-on-hover:hover::after': {
					'opacity': '1',
					'animation': 'shimmer 3s linear infinite',
				},
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;
