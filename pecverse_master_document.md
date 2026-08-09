# PECverse: Master Project Documentation

**Project Name**: PECverse (also referred to as PECconnect)
**Target Audience**: Students of Punjab Engineering College (PEC)
**Platform**: iOS and Android (React Native via Expo)

---

## 🏗️ Phase 1: Current Implementation (v1.0)
The app currently serves as a highly robust, secure, and beautiful utility hub for PEC students. The core architecture is completely finalized and production-ready.

### 1. Technology Stack
- **Frontend Framework**: React Native with Expo (Bare Workflow).
- **Routing**: Expo Router (File-based routing with tab navigation).
- **State & Data**: Zustand (Global state) + TanStack React Query (Server state, caching, & mutations).
- **UI/UX**: Custom Glassmorphism design system, Expo Blur, Expo Haptics, Reanimated (micro-animations).
- **Backend**: Laravel (PHP) with MySQL Database.
- **DevOps**: EAS Build (Cloud compilation) and EAS Update (Over-The-Air updates).

### 2. Authentication System
- **Strict Google OAuth**: Users can only log in using their official university `@pec.edu.in` Google Workspace accounts. This ensures 100% verified student access.
- **Reviewer Bypass (The 5-Tap Trick)**: A hidden trigger on the login screen logo (tapping 5 times) allows Google Play and Apple App Store reviewers to bypass the strict domain lock and access a dummy student dashboard.

### 3. Core Features Developed
- **Dynamic Timetable**: A highly complex, backend-seeded timetable system that maps specific branches (like CSE, Data Science) and further splits them into granular batches and sub-groups (e.g., G1, G2) for labs and practicals.
- **Attendance Manager**: An interactive tracker featuring a giant radial progress gauge. It calculates overall aggregates, tells students exactly how many classes they can safely bunk, and tracks deep history logs for every single subject.
- **Live Mess Menu**: A daily, dynamic menu tracker covering major hostels (Aravali, Shivalik, Kurukshetra, Vindhya).
- **Announcements Hub**: A centralized dashboard for college-wide announcements, powered by Expo Push Notifications.
- **Resources**: A structured database for class notes and study materials.

### 4. Production Robustness
- **Global Error Boundaries**: Catches fatal React crashes and displays a graceful fallback screen instead of force-closing the app.
- **404 Handling**: A `+not-found.tsx` screen catches outdated deep links or broken push notifications.
- **OTA Ready**: The `app.config.js` is hardcoded with `runtimeVersion: "1.0.0"`, perfectly bridging JavaScript updates with the compiled native binaries on EAS.

---

## 🚀 Phase 2: Community & Viral Growth
Once v1.0 is approved and live on the App Stores, Phase 2 focuses entirely on features that drive Daily Active Users (DAU) through community interaction and high utility. Because of our OTA setup, all of these can be pushed instantly to users without a Play Store update!

1. **Smart Bunk Predictor (AI)**: An intelligent layer on top of the manual attendance manager that uses the daily timetable to predict if sleeping in will drop a student below the mandatory 75% threshold.
2. **Live Mess Ratings**: A community voting system (1-5 stars) for the current meal being served. Includes a dashboard indicator warning students if the food is bad today.
3. **PYQ & Notes Marketplace**: Transitioning the "Resources" tab from admin-only to a Reddit-style community hub where students can upload, share, and upvote Previous Year Questions (PYQs) and handwritten notes.
4. **Societies & Fests Hub**: A dedicated event ticketing and RSVP system for PEC's massive society culture and events like PECFEST.
5. **Buy/Sell & Lost/Found**: A digital pinboard for students to trade used engineering gear (drafters, calculators) or report lost items.

---

## 🔮 Phase 3: The "Magic" Integration
Phase 3 is the ultimate technical challenge: seamlessly syncing the app with the legacy PEC portals to create a zero-friction experience.

1. **WebView Session Capture**: Implementing an isolated, in-app browser (`react-native-webview`) where the user logs into the official `pec.edu.in` portal exactly once.
2. **Cookie Extraction**: Safely capturing the official PEC Session Cookie and storing it securely in Expo `SecureStore`.
3. **API Reverse Engineering**: Using the stolen session cookie to execute reverse-engineered backend calls directly against the official PEC APIs.
4. **The Result**: Real-time, automatic syncing of official college attendance, mid-semester grades, and fee statuses natively into the PECverse dashboard without the user ever having to manually track anything again.
