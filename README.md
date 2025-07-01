# Advanced Real-Time Sales Analytics System

A comprehensive React Native mobile application for managing and analyzing sales
data in real-time with Firebase integration.

## Features

### 🔐 Authentication

- User login and signup using Firebase Authentication (Email/Password)
- Secure user session management
- Protected routes and screens

### 📊 Real-Time Analytics Dashboard

- **Total Revenue**: Sum of all orders
- **Total Orders**: Count of all orders
- **Orders Last Hour**: Real-time count of recent orders
- **Average Order Value**: Calculated automatically
- **Top Selling Products**: Most frequent product names with revenue data

### 📦 Order Management

- Add orders with product name, quantity, and price
- Auto-generated timestamps
- Real-time order list updates
- Comprehensive order history

### 🤖 Recommendation Engine

- **Product Promotion**: Identifies high-revenue generators
- **Underperforming Products**: Highlights products with low sales (< 5 units in
  7 days)
- Manual logic-based recommendations (no external AI services)

### ⚡ Real-Time Updates

- Firebase Firestore integration for instant data synchronization
- Live dashboard updates
- Real-time order tracking

## Technical Stack

- **Frontend**: React Native with TypeScript
- **State Management**: React Context API
- **Backend**: Firebase
  - Authentication
  - Firestore Database
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: Expo Router

## Project Structure

```
salesAnalyticsProject/
├── app/                          # Expo Router app directory
│   ├── (auth)/                   # Authentication screens
│   │   ├── sign-in.tsx          # Login screen
│   │   ├── sign-up.tsx          # Registration screen
│   │   └── welcome.tsx          # Welcome screen
│   ├── (root)/                   # Main app screens
│   │   ├── (tabs)/              # Tab navigation
│   │   │   ├── home.tsx         # Dashboard screen
│   │   │   ├── orders.tsx       # Orders tab (redirect)
│   │   │   ├── chat.tsx         # Analytics tab
│   │   │   └── profile.tsx      # Profile tab
│   │   └── orders.tsx           # Order management screen
│   └── index.tsx                # Main entry point
├── components/                   # Reusable components
├── contexts/                    # React Context providers
│   └── AuthContext.tsx         # Authentication context
├── services/                    # Business logic services
│   ├── firebase.ts             # Firebase configuration
│   └── salesService.ts         # Sales data operations
├── types/                       # TypeScript type definitions
│   └── sales.ts                # Sales-related interfaces
└── assets/                      # Images, fonts, etc.
```

## Database Structure (Firestore)

### Orders Collection

```typescript
{
  id: string,                    // Auto-generated document ID
  productName: string,           // Product name
  quantity: number,              // Quantity ordered
  price: number,                 // Price per unit
  timestamp: Timestamp,          // Auto-generated timestamp
  userId: string                 // User ID (for data isolation)
}
```

### Analytics (Calculated in real-time)

- Total Revenue
- Total Orders
- Top Selling Products
- Orders in Last Hour
- Average Order Value

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Firebase project

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd salesAnalyticsProject
npm install
```

### 2. Firebase Setup

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database

#### Configure Firebase

1. Download `google-services.json` for Android
2. Download `GoogleService-Info.plist` for iOS
3. Place these files in the project root (already done)

#### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 3. Environment Configuration

The Firebase configuration is automatically loaded from the service files. No
additional environment variables needed.

### 4. Run the Application

#### Development

```bash
npm start
```

#### iOS

```bash
npm run ios
```

#### Android

```bash
npm run android
```

## Usage Guide

### 1. Authentication

- Open the app
- Sign up with email and password
- Or sign in with existing credentials

### 2. Dashboard

- View real-time analytics
- Monitor sales performance
- Check recommendations

### 3. Order Management

- Tap "Manage Orders" or the Orders tab
- Add new orders with product details
- View order history

### 4. Analytics

- Real-time updates on all metrics
- Top-selling products analysis
- Revenue tracking

## Testing the System

### 1. Add Test Orders

1. Navigate to Orders screen
2. Add multiple orders with different products
3. Verify real-time updates on dashboard

### 2. Test Recommendations

1. Add orders for various products
2. Wait for recommendation engine to analyze data
3. Check recommendations section on dashboard

### 3. Test Real-Time Updates

1. Add orders from multiple devices/sessions
2. Verify instant synchronization
3. Check analytics updates

## Key Features Implementation

### Real-Time Analytics

- Uses Firebase Firestore listeners
- Automatic calculation of metrics
- Live dashboard updates

### Recommendation Engine

- Analyzes last 7 days of data
- Identifies underperforming products (< 5 sales)
- Highlights top revenue generators
- No external AI dependencies

### Data Security

- User-specific data isolation
- Firebase security rules
- Authentication required for all operations

## Troubleshooting

### Common Issues

1. **Firebase Connection Issues**

   - Verify `google-services.json` and `GoogleService-Info.plist` are in root
   - Check Firebase project configuration
   - Ensure Firestore is enabled

2. **Authentication Problems**

   - Verify Email/Password auth is enabled in Firebase
   - Check network connectivity
   - Clear app cache if needed

3. **Real-Time Updates Not Working**
   - Check Firestore security rules
   - Verify user authentication
   - Check network connectivity

### Development Tips

1. **Testing Real-Time Features**

   - Use multiple devices/simulators
   - Add orders from different sessions
   - Monitor Firebase console for data

2. **Performance Optimization**
   - Orders are paginated automatically
   - Analytics are calculated efficiently
   - Real-time listeners are properly managed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
