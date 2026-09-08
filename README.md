<p align="center">
  <img src="./PECverse_app_icon_v2_1024x1024.png" width="140" height="140" alt="PECverse App Icon" style="border-radius: 28px;" />
</p>

<h1 align="center">PECverse</h1>

<p align="center">
  <strong>The all-in-one student super-app engineered for Punjab Engineering College (PEC).</strong><br>
  <em>Unified timetables, intelligent attendance tracking, live hostel mess menus, campus life, and real-time push notifications.</em>
</p>

<p align="center">
  <a href="https://play.google.com/store/apps/details?id=in.edu.pec.connect"><img src="https://img.shields.io/badge/Google_Play-Live-brightgreen?style=for-the-badge&logo=google-play&logoColor=white" alt="Google Play Store" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT" /></a>
  <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React_Native-0.76-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" /></a>
  <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo_SDK-52-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK" /></a>
  <a href="https://laravel.com/"><img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-repository-structure">Repository Structure</a> •
  <a href="#-local-setup">Local Setup</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-security">Security</a> •
  <a href="#-license">License</a>
</p>

---

## 📖 Overview

Academic life at Punjab Engineering College involves managing fragmented communication across disparate channels: timetable PDFs circulated via WhatsApp groups, messy attendance logs, paper-based hostel mess notices, and scattered society announcements.

**PECverse** consolidates all campus utilities into a single, cohesive, mobile-first experience. Engineered with modern React Native and a performant Laravel API, the platform delivers instant answers to daily student routines:

- *Which room is my next lecture or tutorial in?*
- *Can I afford to miss this class while maintaining the mandatory 75% attendance threshold?*
- *What meal is being served in the hostel mess right now?*
- *Has my class schedule been rescheduled or moved by the CR?*

---

## ✨ Key Features

### 📅 Dynamic 21-Day Timetable Engine
- **Horizon Ribbon Navigation**: Scroll smoothly through a 21-day timeline with immediate focus on today's active schedule.
- **Granular Branch & Group Support**: Comprehensive support for 1st-year groups (G1 through G12) and 2nd/3rd/4th-year engineering branches (CSE, CSE-AI, Data Science, ECE, VLSI, EE, Mechanical, Civil, Aerospace, Materials).
- **Sub-batch & Tutorial Splits**: Detailed allocations for practical lab sessions and tutorials (e.g. CSE1–CSE7, G1/G2 batches).
- **CR Schedule Management**: Verified Class Representatives can reschedule classes, assign replacement lecture halls, mark single-day cancellations, or schedule extra sessions directly from their dashboard.
- **Holiday & Exception Handling**: College holidays and individual class cancellations automatically reflect on the timeline without mutating recurring weekly schedules.

### 📊 Attendance Tracker & Bunk Simulator
- **Radial Percentage Gauge**: Visual indicator that adapts color dynamically based on student health (Safe `>= 75%`, Warning `65%-74%`, Critical `< 65%`).
- **Margin Calculator**: Real-time projections showing exactly how many classes you can afford to skip, or how many consecutive classes you must attend to recover your target percentage.
- **Audit Logs & Undo**: Full chronological history of marked attendance with instant undo capabilities.

### 🍲 Hostel Mess Menus
- **Multi-Hostel Coverage**: Complete weekly breakfast, lunch, snacks, and dinner schedules for campus hostels including Aravali, Kurukshetra, Shivalik, Vindhya, and Kalpana Chawla.
- **Active Meal Highlighting**: Automatically emphasizes the upcoming or ongoing meal based on the time of day.

### 🔍 Lost & Found Portal
- **Campus Noticeboard**: Report lost or recovered valuables (keys, student IDs, earphones, calculators, drafters) with photos, location tags, and timestamps.
- **Verification Workflow**: Integrated claim system where posters can set custom verification questions to ensure items are returned to their rightful owners.

### 🏛 Societies & Campus Hub
- **Student Societies Directory**: Browse official technical and cultural societies (Google Developer Student Clubs, PEC ACM, Robotics Society, E-Sports, Enactus, Dramatics, Music, Sports).
- **Orientation & Recruitment Updates**: Society updates, contact details of convenors, and event timelines.

### 🔔 Automated Push Notification Pipeline
- **15-Minute Class Reminders**: Background cron daemon computes upcoming classes across all enrolled students and sends actionable reminders 15 minutes before the bell rings.
- **CR Rescheduling Alerts**: Instant push notifications to affected batchmates whenever a class timing or room is updated.
- **Audience-Targeted Broadcasts**: Support for campus-wide or batch-specific announcements via Expo's push notification service.

### 🛡 Domain-Locked Authentication
- **Verified University Accounts**: Single Sign-On (SSO) locked exclusively to official `@pec.edu.in` Google Workspace accounts.
- **Fresher & Guest Experience**: Graceful fallback and orientation mode for incoming freshers awaiting university email issuance.

---

## 🏗 System Architecture

```
                                  ┌───────────────────────────────┐
                                  │      PECverse Mobile App      │
                                  │  (React Native / Expo SDK 52) │
                                  └───────────────┬───────────────┘
                                                  │
                                        HTTPS / JSON REST API
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Laravel 11 REST API Backend                                  │
│                                                                                                 │
│  ┌──────────────────────┐   ┌──────────────────────┐   ┌─────────────────────────────────────┐  │
│  │  Sanctum & OAuth     │   │  Timetable & CR Engine│  │  Attendance & Bunk Calculator     │  │
│  │  - Google SSO        │   │  - Weekly Schedules  │   │  - Subject Logs & Undo Records      │  │
│  │  - Role Verification │   │  - Date Exceptions   │   │  - Percentage Aggregators           │  │
│  └──────────────────────┘   └──────────────────────┘   └─────────────────────────────────────┘  │
│  ┌──────────────────────┐   ┌──────────────────────┐   ┌─────────────────────────────────────┐  │
│  │  Mess Menu Service   │   │  Lost & Found Engine │   │  Push Notification Daemon           │  │
│  │  - Hostel Rosters    │   │  - Image Uploads     │   │  - 15-min Class Reminders           │  │
│  │  - Meal Time Matrix  │   │  - Claim Verification│   │  - CLI / Event-Driven Broadcasts    │  │
│  └──────────────────────┘   └──────────────────────┘   └──────────────────┬──────────────────┘  │
└────────────────────────────────────────┬──────────────────────────────────┼─────────────────────┘
                                         │                                  │
                                         ▼                                  ▼
                              ┌────────────────────┐            ┌──────────────────────┐
                              │   MySQL Database   │            │   Expo Push Service  │
                              │ (InnoDB Relational)│            │   (FCM & APNs Relay) │
                              └────────────────────┘            └──────────────────────┘
```

---

## 📁 Repository Structure

```
PECverse/
├── pecconnect-mobile/          # React Native mobile client (Expo SDK 52)
│   ├── assets/                 # App icons, splash screens, brand imagery
│   ├── src/
│   │   ├── app/                # Expo Router file-based screen routes
│   │   │   ├── (auth)/         # Google SSO and guest authentication flows
│   │   │   ├── (tabs)/         # Bottom navigation (Dashboard, Timetable, Attendance, More)
│   │   │   ├── mess/           # Hostel mess menu viewer
│   │   │   ├── lost-found/     # Lost & found noticeboard and claim views
│   │   │   └── societies/      # Campus societies and clubs hub
│   │   ├── components/         # Reusable UI primitives, cards, sheets, headers
│   │   ├── hooks/              # Custom hooks (timetables, push notifications, attendance)
│   │   ├── stores/             # Zustand state stores (auth, user session, settings)
│   │   ├── theme/              # Color system, spacing tokens, typography
│   │   └── utils/              # Axios API client, telemetry, helper utilities
│   ├── app.config.js           # Expo configuration & EAS build profile
│   └── package.json
│
├── pecconnect-backend/         # Laravel 11 REST API
│   ├── app/
│   │   ├── Console/Commands/   # CLI Daemons (Class reminders, broadcasts, branch updates)
│   │   ├── Http/Controllers/   # API endpoints (Auth, Timetable, Attendance, Mess, LostFound)
│   │   ├── Models/             # Eloquent models (User, Timetable, CourseClass, Branch, etc.)
│   │   └── Services/           # Domain business logic & external integrations
│   ├── database/
│   │   ├── migrations/         # Relational database schema definitions
│   │   └── seeders/            # Academic branch, class, timetable, and mess rosters
│   ├── routes/api.php          # Protected and public REST API routes
│   └── composer.json
│
└── pecverse-landing/           # Web showcase & legal documentation
    ├── index.html              # Modern responsive product landing page
    ├── privacy-policy.html     # App Store & Play Store privacy disclosure
    └── terms.html              # Terms of service
```

---

## 🚀 Local Setup

### Prerequisites
Make sure you have the following installed on your development machine:
- **Node.js**: 20.x or later (`node -v`)
- **PHP**: 8.2 or later (`php -v`)
- **Composer**: 2.x (`composer -v`)
- **MySQL**: 8.0+ or MariaDB 10.4+ (or SQLite for rapid prototyping)

---

### 1. Backend Setup (Laravel API)

```bash
# 1. Navigate to the backend directory
cd pecconnect-backend

# 2. Install PHP dependencies
composer install

# 3. Create your local environment configuration
cp .env.example .env

# 4. Generate your unique application encryption key
php artisan key:generate

# 5. Configure your database settings in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=pecconnect
# DB_USERNAME=root
# DB_PASSWORD=

# 6. Execute migrations and seed academic timetables
php artisan migrate --seed

# 7. Start the local development server
php artisan serve --host=0.0.0.0 --port=8000
```

The API will now be listening at `http://localhost:8000/api`.

#### Running Background CLI Commands
- **Send 15-Minute Class Reminders**:
  ```bash
  php artisan app:send-class-reminders
  ```
- **Send Broadcast Push Notification**:
  ```bash
  php artisan app:broadcast "Title" "Message Body" --url="/(tabs)/timetable"
  ```
- **Notify Specific Batches (e.g. 3rd Year CSE)**:
  ```bash
  php artisan app:notify-branch-update --target=today --dry-run
  ```

---

### 2. Mobile App Setup (React Native / Expo)

```bash
# 1. Navigate to the mobile directory
cd pecconnect-mobile

# 2. Install JavaScript dependencies
npm install

# 3. Create your local environment configuration
cp .env.example .env

# 4. Point the app to your backend API URL in .env
# When testing on a physical device, use your local machine's LAN IP address:
# EXPO_PUBLIC_API_URL=http://192.168.1.X:8000/api

# 5. Start the Expo development server
npx expo start
```

Press `a` to open in an Android emulator, `i` to open in iOS simulator, or scan the QR code with **Expo Go** or a custom development build on your physical device.

---

## 🔐 Environment Variables

### Backend (`pecconnect-backend/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `APP_NAME` | Application identifier | `PECverse` |
| `APP_ENV` | Environment state (`local`, `production`) | `local` |
| `APP_KEY` | Laravel encryption key | `base64:...` |
| `APP_URL` | Base public backend URL | `http://localhost:8000` |
| `DB_CONNECTION` | Database driver | `mysql` |
| `DB_HOST` | Database host | `127.0.0.1` |
| `DB_DATABASE` | Database name | `pecconnect` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID for token validation | Optional for guest dev |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Optional for guest dev |
| `DISCORD_FEEDBACK_WEBHOOK_URL` | Webhook URL for student feedback alerts | Optional |

### Mobile Client (`pecconnect-mobile/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `EXPO_PUBLIC_API_URL` | REST API base endpoint | `http://localhost:8000/api` |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Google Web OAuth Client ID | `your_web_client_id` |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | Google iOS OAuth Client ID | `your_ios_client_id` |
| `EXPO_PUBLIC_POSTHOG_API_KEY` | PostHog telemetry project key | Optional (disabled if empty) |
| `EXPO_PUBLIC_POSTHOG_HOST` | PostHog endpoint | `https://us.i.posthog.com` |

---

## 🤝 Contributing

We welcome contributions from student developers, alumni, and open-source enthusiasts.

1. **Fork the Repository** on GitHub.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your Changes** following conventional commit standards:
   ```bash
   git commit -m "feat(timetable): add support for elective batch switching"
   ```
4. **Push to your Branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** describing your changes and testing procedures.

Please review our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 🛡 Security Policy

We treat the security of our users and data with the highest priority. If you discover a vulnerability or potential security weakness, please do not disclose it via public issues.

Please email the core maintainers directly at **adgupta006@gmail.com**. See our [Security Policy](SECURITY.md) for full response timelines.

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
Built with passion by students of **Punjab Engineering College**.
