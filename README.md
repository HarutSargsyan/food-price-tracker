# Food Price Tracker

## Inspiration

As someone living alone for the first time, I wanted to optimize my grocery spending and make smarter choices about where to shop. This project was born out of my need to easily track food prices across different stores, spot trends, and always know where I can get the best deal for my groceries.

---

## Overview

**Food Price Tracker** is a modern web app that helps you track, compare, and analyze grocery prices across your favorite stores. It’s designed for individuals who want to save money and make data-driven shopping decisions.

---

## Features

- **User Authentication:** Secure Google sign-in with user-specific data isolation.
- **Personalized Dashboard:** See best prices for your products, price trends, and quick stats.
- **Product & Store Management:** Add, edit, and remove your own products and stores. Default options are provided for convenience.
- **Price Entry Tracking:** Log prices for any product at any store, with date and unit.
- **Best Price & Trends:** Instantly see where to buy each product cheapest, and whether prices are rising or falling.
- **Cascading Deletes:** Deleting a product or store automatically removes all related price entries.
- **Live Data Sync:** All lists and stats update in real time after any change.
- **Modern UI/UX:** Clean, responsive design with card-based layouts and intuitive forms.
- **Protected Routes:** Only authenticated users can access the dashboard and preferences.
- **Public Landing Page:** Welcoming home page with a simple Google login.

---

## Tech Stack

### Frontend

- **React 19** with **TypeScript**: Modern, type-safe UI development.
- **Vite**: Lightning-fast build tool and dev server.
- **Tailwind CSS**: Utility-first CSS framework for rapid, consistent styling.
- **React Router v7**: Client-side routing and protected routes.
- **React Icons** & **Lucide React**: Beautiful, consistent iconography.

### Backend & Data

- **Firebase Firestore**: Serverless, scalable NoSQL database for all user data.
- **Firebase Auth**: Secure Google authentication.
- **Firestore Data Model:**
  - User-specific `products` and `stores` collections.
  - `priceEntries` collection referencing products and stores.
  - Deterministic document IDs (`userId_productName`, `userId_storeName`) to enforce uniqueness and prevent duplicates.
  - Atomic default initialization for new users.
  - Cascading deletes for data integrity.

### Architecture & Code Quality

- **Custom Hooks**: For fetching and syncing price entries.
- **Service Layer**: Encapsulates all Firestore operations for products, stores, and price entries.
- **Type Definitions**: Strong typing for all data models and API calls.
- **ESLint**: Enforced code quality and style.
- **CI/CD**: GitHub Actions workflow for build, test, and deployment.

---

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone git@github.com:your-username/food-price-tracker.git
   cd food-price-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project.
   - Enable Firestore and Google Auth.
   - Copy your config to `.env`:
     ```
     VITE_API_KEY=...
     VITE_AUTH_DOMAIN=...
     VITE_PROJECT_ID=...
     VITE_STORAGE_BUCKET=...
     VITE_MESSAGING_SENDER_ID=...
     VITE_APP_ID=...
     VITE_MEASUREMENT_ID=...
     ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

## License

MIT

---

Let me know if you want to add screenshots, usage instructions, or anything else!
