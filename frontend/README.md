# AI Agricultural Platform - Frontend

A modern React-based frontend for an AI-powered agricultural platform that helps farmers optimize their crop yields and make data-driven decisions.

## 🌿 Features

- **Dashboard**: Real-time KPI monitoring with yield predictions, revenue estimates, and efficiency scores
- **Farm Input Form**: Interactive form with live prediction updates as users input farm data
- **AI Insights Panel**: Smart recommendations with color-coded alerts
- **Interactive Charts**: Market price trends and yield impact factor analysis
- **Efficiency Gauge**: Visual representation of farm efficiency with regional comparisons
- **Responsive Design**: Mobile-first approach with collapsible sidebar navigation

## 🎨 Design System

### Colors
- **Primary**: Deep Green (#1B5E20)
- **Secondary**: Fresh Green (#4CAF50)
- **Accent**: Soft Lime (#8BC34A)
- **Background**: Light Beige (#F5F5DC)
- **Danger**: Red (#E53935)
- **Warning**: Orange (#FB8C00)

### Typography
- **Fonts**: Inter / Poppins
- **Titles**: Bold
- **Metrics**: Large + SemiBold
- **Body**: Regular

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── FarmForm.jsx              # Interactive farm input form
│   ├── PredictionCard.jsx        # Live prediction preview
│   ├── EfficiencyGauge.jsx       # Circular efficiency gauge
│   ├── InsightsPanel.jsx         # AI recommendations panel
│   └── Charts/
│        ├── YieldChart.jsx       # SHAP bar chart for yield factors
│        └── PriceTrendChart.jsx  # Market price trend line chart
├── pages/
│   ├── Dashboard.jsx             # Main dashboard with KPIs and charts
│   ├── Home.jsx                  # Landing page
│   └── AddFarm.jsx               # Farm input page with split-screen layout
├── services/
│   └── api.js                    # API service layer
├── App.jsx                       # Main app with routing
└── main.jsx                      # App entry point
```

## 🔧 Technologies Used

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **Lucide React**: Icon library
- **Vite**: Fast build tool and dev server

## 📱 Responsive Features

- **Mobile**: Collapsible sidebar with hamburger menu
- **Tablet**: Optimized card layouts and touch interactions
- **Desktop**: Full-featured dashboard with side-by-side layouts

## 🎯 Key Components

### Dashboard
- 4 KPI cards showing recommended crop, predicted yield, revenue, and efficiency score
- Interactive charts for market trends and yield impact factors
- AI insights panel with color-coded recommendations
- Efficiency gauge with regional comparisons

### Farm Input Form
- Grouped sections for soil/crop, weather, and farm inputs
- Real-time prediction updates as user types
- Range sliders for numeric inputs
- Split-screen layout with live preview

### Efficiency Gauge
- Circular progress indicator with color zones
- Dynamic percentage display
- Regional average comparison
- Smooth animations

## 🔌 API Integration

The frontend is designed to work with a backend API. Key endpoints:

- `POST /api/predict-yield` - Get AI predictions for farm data
- `GET /api/market-prices` - Fetch market price trends
- `GET /api/farms/{id}/analytics` - Get farm analytics
- `GET /api/farms/{id}/insights` - Get AI recommendations

## 🎨 UI/UX Features

- **Micro-interactions**: Hover effects, smooth transitions
- **Loading states**: AI analysis animation
- **Color-coded alerts**: Green (good), Orange (warning), Red (critical)
- **Responsive charts**: Touch-friendly on mobile devices
- **Accessibility**: Semantic HTML, ARIA labels

## 🔄 State Management

The app uses React's built-in state management with hooks:
- `useState` for component state
- `useEffect` for side effects and API calls
- Context API for global state (if needed)

## 🚀 Deployment

The app is ready for deployment to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📝 Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
