# 📸 Photo Studio Price Calculator

A Vue 3 SPA application for calculating photo studio service prices. Users can browse products, filter by category, add items to cart, and see real-time price and photo count calculations.

## 🚀 Live Demo

Visit the live application: [https://kiwi-26.github.io/photo-studio-price-calculator/](https://kiwi-26.github.io/photo-studio-price-calculator/)

## Features

- **Product Catalog**: 12 photo studio products across 6 categories
  - Portrait Photography
  - Wedding Photography
  - Event Photography
  - Product Photography
  - Family Photography
  - Real Estate Photography

- **Product Information**: Each product displays:
  - Category badge
  - Name and description
  - Photo count
  - Price
  - Optional variation details

- **Category Filter**: Filter products by category using dropdown

- **Shopping Cart**:
  - Add products to cart
  - Remove individual items
  - Clear entire cart
  - Real-time totals for photo count and price

## Tech Stack

- Vue 3 (Composition API)
- Vite
- Tailwind CSS
- JavaScript

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kiwi-26/photo-studio-price-calculator.git
cd photo-studio-price-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploy to GitHub Pages

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment happens automatically when you push to the `main` branch.

To set up GitHub Pages for your fork:

1. Go to your repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "GitHub Actions"
4. The workflow will automatically deploy your site on the next push to `main`

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
photo-studio-price-calculator/
├── src/
│   ├── assets/
│   │   └── products.json      # Product data
│   ├── App.vue                # Main application component
│   ├── main.js                # Application entry point
│   └── style.css              # Tailwind CSS imports and custom styles
├── index.html                 # HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── package.json              # Dependencies and scripts
```

## Styling

This project uses **Tailwind CSS** for styling, providing:
- Utility-first CSS framework
- Responsive design with mobile-first approach
- Dark/light mode support based on system preferences
- Custom color palette matching the original design
- Optimized build size with unused CSS purging

## Usage

1. **Browse Products**: View all available photo studio services
2. **Filter by Category**: Use the dropdown to filter products by category
3. **Add to Cart**: Click "Add to Cart" button on any product
4. **View Cart**: See selected items in the shopping cart sidebar
5. **Remove Items**: Click the "✕" button to remove individual items
6. **Clear Cart**: Click "Clear Cart" to remove all items at once
7. **View Totals**: See real-time calculations of total photos and total price

## License

MIT