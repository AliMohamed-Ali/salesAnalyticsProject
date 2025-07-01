# Advanced Real-Time Sales Analytics System

A comprehensive React Native mobile application for managing and analyzing sales
data in real-time, featuring Firebase integration, AI-powered recommendations,
and a modern UI.

## 🚀 Features

### Authentication

- **Firebase Authentication**: Secure email/password login and signup
- **Protected Routes**: Automatic navigation based on authentication state
- **User Session Management**: Persistent login state

### Order Management

- **Add Orders**: Create new orders with product name, quantity, and price
- **Edit Orders**: Modify existing order details
- **Delete Orders**: Remove orders from the system
- **Real-time Updates**: Instant synchronization across all devices
- **Auto Timestamp**: Automatic timestamp generation for all orders

### Real-Time Analytics Dashboard

- **Total Revenue**: Sum of all orders with real-time updates
- **Orders Last Hour**: Live count of recent orders
- **Top-Selling Products**: Most frequently sold products
- **Revenue Trends**: 7-day revenue visualization
- **Total Orders**: Complete order count

### AI-Powered Recommendation Engine

- **Products to Promote**: Identifies products with low sales (< 5 in last 7
  days)
- **Top Revenue Products**: Highlights highest revenue-generating products
- **Underperforming Products**: Flags products with no sales in 30 days
- **Smart Insights**: Data-driven recommendations for business optimization

### Technical Features

- **Real-time Data**: Firebase Firestore for instant updates
- **Offline Support**: Data persistence and sync when online
- **Responsive Design**: Optimized for various screen sizes
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Tailwind CSS with custom components

## 🛠 Tech Stack

- **Frontend**: React Native with TypeScript
- **Navigation**: Expo Router
- **State Management**: React Context API
- **Backend**: Firebase
  - Authentication
  - Firestore Database
- **Styling**: Tailwind CSS (NativeWind)
- **Icons**: Expo Vector Icons
- **Development**: Expo SDK

## 📱 Screenshots

### Dashboard

- Real-time analytics cards
- Revenue trends chart
- AI recommendations
- Top-selling products

### Orders

- Order list with real-time updates
- Add/Edit/Delete functionality
- Search and filter capabilities

### Authentication

- Clean login/signup screens
- Form validation
- Error handling

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Firebase project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd salesAnalyticsProject
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Firebase Setup**

   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Download `google-services.json` (Android) and `GoogleService-Info.plist`
     (iOS)
   - Place them in the appropriate directories

4. **Environment Configuration**

   - Update Firebase configuration in your project
   - Set up Firestore security rules

5. **Run the application**

   ```bash
   # Start Expo development server
   npm start

   # Run on iOS
   npm run ios

   # Run on Android
   npm run android
   ```

## 📁 Project Structure

```
salesAnalyticsProject/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Authentication screens
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── welcome.tsx
│   ├── (root)/                   # Main app screens
│   │   └── (tabs)/
│   │       ├── home.tsx          # Analytics dashboard
│   │       ├── orders.tsx        # Order management
│   │       └── profile.tsx       # User profile
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── DashboardCard.tsx         # Analytics card component
│   ├── RecommendationCard.tsx    # AI recommendations
│   ├── CustomButton.tsx          # Custom button component
│   ├── InputField.tsx            # Form input component
│   └── orders/
│       └── AddEditOrdersModal.tsx # Order modal
├── contexts/                     # React Context providers
│   └── AuthContext.tsx           # Authentication context
├── services/                     # Business logic services
│   ├── firebase.ts               # Firebase operations
│   └── analytics.ts              # Analytics calculations
├── types/                        # TypeScript type definitions
│   ├── order.d.ts                # Order-related types
│   └── type.d.ts                 # Component types
├── constants/                    # App constants
│   └── index.ts                  # Icons and images
└── assets/                       # Static assets
    ├── fonts/                    # Custom fonts
    ├── icons/                    # App icons
    └── images/                   # App images
```

## 🔧 Firebase Configuration

### Firestore Database Structure

```javascript
// Orders Collection
{
  id: "auto-generated",
  productName: "string",
  quantity: "string",
  price: "string",
  timestamp: "serverTimestamp"
}

// Analytics Collection (optional caching)
{
  id: "current",
  totalRevenue: "number",
  ordersLastHour: "number",
  topProducts: "array",
  lastUpdated: "timestamp"
}
```

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write orders
    match /Orders/{document} {
      allow read, write: if request.auth != null;
    }

    // Allow authenticated users to read/write analytics
    match /Analytics/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🧠 AI Recommendation Engine

The recommendation engine uses local logic to provide intelligent insights:

### Products to Promote

- Analyzes sales data from the last 7 days
- Identifies products with fewer than 5 sales
- Suggests promotional strategies

### Top Revenue Products

- Calculates total revenue per product
- Ranks products by revenue contribution
- Highlights best-performing items

### Underperforming Products

- Tracks products with no sales in 30 days
- Identifies potential inventory issues
- Suggests review or removal

## 📊 Analytics Features

### Real-time Metrics

- **Total Revenue**: Live calculation of all sales
- **Orders Last Hour**: Real-time count of recent activity
- **Top Products**: Dynamic ranking based on sales frequency
- **Revenue Trends**: 7-day visualization with daily breakdown

### Data Visualization

- Bar charts for revenue trends
- Color-coded recommendation cards
- Interactive analytics dashboard
- Responsive design for all screen sizes

## 🔒 Security Features

- **Firebase Authentication**: Secure user management
- **Protected Routes**: Authentication-based navigation
- **Data Validation**: Input validation and sanitization
- **Error Handling**: Comprehensive error management
- **Offline Security**: Secure data storage

## 🚀 Deployment

### Android

1. Build the app: `expo build:android`
2. Upload to Google Play Store

### iOS

1. Build the app: `expo build:ios`
2. Upload to App Store Connect

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the Firebase documentation
- Review the Expo documentation

## 🔄 Updates and Maintenance

- Regular dependency updates
- Security patches
- Feature enhancements
- Performance optimizations

---

**Built with ❤️ using React Native, Firebase, and Expo**
