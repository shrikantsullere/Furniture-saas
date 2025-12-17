# Furniture Order Management System

A complete MVP-level frontend UI for managing furniture orders (Beds & Mattresses) from order to production sheet to label generation.

## Tech Stack

- **React JS** (latest) - Functional components with hooks
- **Tailwind CSS** (latest) - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server

## Project Structure

```
src/
├── assets/              # Static assets (images, icons, etc.)
├── components/          # Reusable React components
│   ├── common/         # Common UI components (Button, Card, Table, Modal)
│   ├── layout/         # Layout components (Sidebar, MainLayout)
│   └── offcanvas/      # Offcanvas/Drawer components
├── pages/              # Page components
│   ├── dashboard/      # Dashboard page with KPIs and quick actions
│   ├── orders/         # Orders listing and detail view
│   ├── production/     # Production sheet (A4 print-friendly)
│   ├── labels/         # Label generator (4 labels per A4)
│   ├── integrations/   # Marketplace integrations (Amazon, eBay, Shopify)
│   └── settings/       # Application settings
├── services/           # API service layer (ready for backend integration)
├── utils/              # Utility functions and constants
├── App.jsx             # Main app component with routing
└── main.jsx            # Application entry point
```

## Folder Descriptions

### `assets/`
Contains static files like images, logos, and other media assets.

### `components/common/`
Reusable UI components used throughout the application:
- **Button.jsx** - Styled button component with variants
- **Card.jsx** - Container component for content sections
- **Table.jsx** - Data table component
- **Modal.jsx** - Modal dialog component

### `components/layout/`
Layout components that structure the application:
- **Sidebar.jsx** - Fixed left sidebar navigation with mobile support
- **MainLayout.jsx** - Main layout wrapper with sidebar and content area

### `components/offcanvas/`
Offcanvas/Drawer components for side panels:
- **Offcanvas.jsx** - Slide-in panel component (used for order details)

### `pages/`
Page-level components representing different routes:
- **dashboard/** - Home page with KPIs and quick actions
- **orders/** - Order management with table view and detail offcanvas
- **production/** - A4 production sheet generator
- **labels/** - A4 label generator (4 labels per page)
- **integrations/** - Marketplace integration management
- **settings/** - Application configuration

### `services/`
API service layer ready for backend integration:
- **api.js** - Centralized API functions for all endpoints

### `utils/`
Utility functions and constants:
- **constants.js** - Application-wide constants (marketplaces, statuses, etc.)

## Features

### Dashboard
- KPI cards (Total Orders Today, Pending Sheets, Labels Printed)
- Marketplace quick access buttons
- Quick action buttons (Sync Orders, Create Production Sheet, Print Label Sheet)

### Orders
- Table view of all orders
- View order details in offcanvas panel
- Generate production sheet or labels from order view

### Production Sheet
- A4 print-friendly layout
- Company header with logo placeholder
- Customer information block
- Order details with extra notes section
- Production status and signature area

### Label Generator
- A4 page split into 4 identical labels
- Customer name, address, postcode (bold)
- Order ID and product information
- Barcode/QR code placeholder

### Integrations
- Marketplace connection status
- Sync functionality for each marketplace

### Settings
- Company information management
- Logo upload
- A4 layout preferences
- Courier preferences

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Design Philosophy

- **Ultra-light** - Minimal dependencies, fast loading
- **Super clean** - Clean typography, spacing, and alignment
- **Minimal UI** - No flashy animations or heavy dashboards
- **MVP-focused** - Essential features only
- **Fast to use** - Practical for warehouse/production teams
- **Mobile responsive** - Sidebar collapses on mobile with toggle button

## API Integration

The application is API-ready with service layer in `src/services/api.js`. To connect to a backend:

1. Set `VITE_API_BASE_URL` in `.env` file
2. Update API endpoints in `src/services/api.js` if needed
3. Replace dummy data in components with API calls

## Print Functionality

Production sheets and labels are optimized for A4 printing. Use browser's print functionality (Ctrl+P / Cmd+P) to print.

## License

MIT
