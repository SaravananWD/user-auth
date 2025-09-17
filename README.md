# 🔐 Authentication System

**A comprehensive user management system implementing modern authentication patterns. Features secure user registration, session management, and role-based access control with protected routes—replicating the authentication flows that real applications require.**

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://user-auth-proto.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19+-61DAFB.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-000000.svg)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9+-FFCA28.svg)](https://firebase.google.com/)

---

## ✨ Features

### Core Functionality

- **Complete User Lifecycle:** Secure registration, email verification, password management
- **Role-Based Access Control:** Admin and user roles with dynamic content visibility
- **Session Management:** Protected routes with intelligent redirects and session handling
- **Account Security:** Password reset, email change verification, and account recovery flows

### Authentication Workflows

- ✅ User registration with email verification
- ✅ Secure login/logout with session persistence
- ✅ Password reset via email with secure token validation
- ✅ Account recovery when email address is compromised

### Dashboard & Profile Management

- ✅ Role-based content rendering (User vs Admin views)
- ✅ Profile editing with necessary validation
- ✅ Email update requiring re-verification
- ✅ Password change with current password confirmation

### Security & User Experience

- ✅ Protected routes preventing unauthorized access
- ✅ Unauthenticated routes redirecting logged-in users
- ✅ Comprehensive error handling with user-friendly messages
- ✅ Loading states for all asynchronous operations

---

## 🚀 Tech Stack

- **Frontend:** React, Next.js (App Router), Styled Components
- **Backend Services:** Firebase Authentication & Firestore Database
- **React Patterns:** Context API, Prop Validation, Custom Hooks, Protected Route Components
- **Security Features:** Protected routes, role-based rendering, secure session handling
- **Deployment:** Vercel

---

## 📦 Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/SaravananWD/user-auth.git
    cd user-auth
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    - Copy `env.example` to `.env.local`
    - Add your Firebase config values:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project_id.firebasestorage.app"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 🏗️ Project Structure

```
user-auth/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/         # Protected dashboard routes
│   │   │   └── settings/      # User settings pages
│   │   │       ├── change-password/
│   │   │       ├── edit-profile/
│   │   │       └── update-email/
│   │   ├── login/             # Login page
│   │   ├── signup/            # Registration page
│   │   ├── verify-user/       # Email verifications
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Home page
│   ├── assets/                # Static assets
│   ├── components/            # Reusable UI components
│   ├── context/               # React Context providers
│   │   └── AuthContext.js     # Authentication state management
│   ├── custom-hooks/          # Custom React hooks
│   │   ├── useInterval.js     # Interval management
│   │   ├── useTimeout.js      # Timeout management
│   │   └── useUpdateState.js  # State update utilities
│   ├── lib/                   # Utility libraries
│   │   └── firebase.js        # Firebase configuration
│   │   ├── StyledComponentsRegistry.js
│   ├── styles/                # Styled Components
│   │   ├── breakpoints.js     # Responsive breakpoints
│   │   └── global.css         # Global styles
│   └── utils/                 # Utility functions
│       ├── ActionCodeSettings.js
│       ├── constants.js       # App constants
│       ├── getErrorMessage.js # Error handling
│       ├── space.js           # Spacing utilities
│       └── validateFormFields.js # Form validation
├── .env.local                 # Environment variables (create from .env.example)
├── next.config.js             # Next.js configuration
└── package.json               # Dependencies and scripts
```

---

## 🔧 Configuration

### Firebase Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Enable Authentication:**

   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
   - Configure authorized domains

3. **Create Firestore Database:**
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
   match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. **Configure Authentication Settings:**
   - Set up email templates for verification and password reset
   - Configure action URLs to point to your application

### Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
# Firebase Configuration
  NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
  NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project_id.firebasestorage.app"
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
  NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
```

---

## 🛠️ Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Deployment
npm run deploy       # Deploy to Vercel
```

---

## 🔒 Security Features

### Authentication Security

- **Password Requirements:** Minimum 6 characters (Add your complexity on validatePassword() in validateFormFields.js file)
- **Email Verification:** Required for account activation
- **Session Management:** Secure JWT tokens with automatic refresh
- **Rate Limiting:** Built-in Firebase protection against brute force attacks

### Data Protection

- **Firestore Security Rules:** Server-side data validation and access control
- **Role-Based Access:** Dynamic content rendering based on user roles
- **Input Validation:** Client and server-side validation for all forms
- **XSS Protection:** Sanitized inputs and secure rendering

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel:**

   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "New Project" and import your GitHub repository
   - Configure environment variables in Vercel dashboard

2. **Set environment variables:**

   ```bash
   # In Vercel Dashboard > Project Settings > Environment Variables
   NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project_id.firebasestorage.app"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
   ```

3. **Deploy:**
   - Vercel will automatically deploy on every push to main branch
   - Or manually deploy: `vercel --prod`

### Alternative Deployment Options

- **Netlify:** Connect repository for automatic deployments
- **Cloudflare Workers:** Deploy using Wrangler CLI for edge computing
- **Traditional Hosting:** Build with `npm run build` and deploy static files

---

## 🔮 Roadmap & Enhancements

### Planned Features

- [ ] **OAuth Integration:** Google, GitHub, and Microsoft sign-in options
- [ ] **Two-Factor Authentication:** Enhanced security with 2FA implementation
- [ ] **PWA Features:** Offline functionality and mobile app experience
- [ ] **Admin Dashboard:** User management with analytics and bulk operations
- [ ] **Performance Optimization:** Code splitting, lazy loading, and caching strategies

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Firebase Team** for providing robust authentication services
- **Next.js Team** for the excellent React framework
- **React Community** for continuous inspiration and best practices
- **Open Source Contributors** who make projects like this possible

---

## 📞 Support

- **Email:** hello@saravanan.dev

---

**Built with ❤️ by [Saravanan](https://github.com/SaravananWD)**
