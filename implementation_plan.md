# 🚀 PEC Connect — Full Product & Technical Blueprint

> **Co-founder Brief** | Unofficial Student Super-App for PEC Chandigarh | Drafted: July 2026

---

## Executive Summary

You are building **PEC Connect** — the unofficial, student-run super-app for Punjab Engineering College, Chandigarh. Think of it as a mix of **Notion + WhatsApp + LinkedIn + Google Classroom** — but built by students, for students, free of bureaucratic delay.

The app will serve ~4,000+ students across all departments and years, with CR-level admin rights to manage content per branch/year. 

It will be a **Mobile-First App** built natively using React Native (Expo) with a powerful API backend built in Laravel, hosted cost-effectively on Hostinger Shared Web Hosting.

---

## 🎯 Core Feature Set (MVP → V2 → V3)

### MVP (Launch in 4–6 weeks)
| Feature | Description |
|---|---|
| 🔐 Auth | Google Sign-in restricted to `@pec.edu.in` accounts |
| 📅 Timetable | Branch + Year specific timetables (CR editable via App) |
| 📢 Announcements | CR posts notices per class/branch |
| 📝 Notes | Upload/download PDFs, images per subject |
| 🗂️ Dashboard | Personalized feed based on branch/year |
| 👤 Profile | Name, roll no, branch, year, profile photo |

### V2 (Weeks 7–12)
| Feature | Description |
|---|---|
| 🏛️ Club Hub | Each club gets a page — events, members, posts |
| 📆 Events Calendar | All campus events in one place |
| 💬 Class Chat | Branch/year-level group messaging |
| 🔔 Push Notifications | Announcements trigger real-time alerts |
| 📊 Attendance Tracker | Students self-log attendance per subject |

### V3 (Month 3+)
| Feature | Description |
|---|---|
| 🤝 Social Feed | Student posts, likes, comments (LinkedIn-lite) |
| 🧑‍💼 Internship Board | Students post/find internship opportunities |
| 🎓 Alumni Network | Connect with PEC alumni |
| 🤖 AI Assistant | AI to answer timetable/exam queries |

---

## ⚙️ Tech Stack Decision

### Mobile App Only
> **VERDICT: Build a Cross-Platform Native Mobile App using React Native (Expo).**

**Why?**
- Students prefer native mobile apps over websites for daily use cases like checking timetables and attendance.
- Expo handles the heavy lifting of native builds, letting you write JavaScript/TypeScript.
- You can ship to the Google Play Store (Android) and Apple App Store (iOS) from the same codebase.
- API-driven backend means the mobile app can cleanly talk to your Laravel server.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND (MOBILE APP)           │
│  React Native (Expo framework)                   │
│  UI: NativeWind (Tailwind) or React Native Paper │
└─────────────────────────┬───────────────────────┘
                          │ HTTPS REST API calls (Axios/Fetch)
┌─────────────────────────▼───────────────────────┐
│                  BACKEND (PHP)                   │
│  Laravel 11 (API Only)                           │
│  Auth: Laravel Sanctum (Token-based)             │
│  Queue/Cache: Database/File drivers              │
└─────────────────────────┬───────────────────────┘
                          │
┌─────────────────────────▼───────────────────────┐
│                  DATABASE                        │
│  MySQL (Hostinger Shared Web Hosting)            │
└─────────────────────────┬───────────────────────┘
                          │
┌─────────────────────────▼───────────────────────┐
│              STORAGE & SERVICES                  │
│  Cloudinary (Notes/PDF/Profile pic storage)      │
│  Firebase Cloud Messaging (Push Notifications)   │
│  Google OAuth (Sign-in via @pec.edu.in)          │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Full Tech Stack (Recommended)

### Backend (API)
| Layer | Technology | Why |
|---|---|---|
| Language | PHP 8.2+ | Best suited for your Hostinger shared hosting environment |
| Framework | **Laravel 11 (API Mode)** | Robust API routing, Eloquent ORM, built-in Sanctum auth |
| Auth | Laravel Sanctum + Socialite | API token-based authentication via Google OAuth SSO |
| Queues & Cache | **Database / File Driver** | Since **Redis is NOT available** on shared hosting, use the database driver for queued jobs (like sending emails). |

### Frontend (Mobile App)
| Layer | Technology | Why |
|---|---|---|
| Framework | **React Native (Expo)** | Write once, run on Android & iOS. Expo Go makes testing on real devices effortless. |
| Navigation | React Navigation | Standard for routing between mobile screens. |
| Styling | NativeWind / StyleSheet | Quick UI development. |
| State Mgt. | Zustand / Context API | Lightweight state management. |
| Data Fetching| React Query (Tanstack) | Handles API caching, loading states, and refetching. |

### Database
| Layer | Technology | Why |
|---|---|---|
| Primary DB | MySQL 8.0+ | Hosted on your Hostinger Shared account. |

### File Storage & Services
| Service | Use Case | Free Tier |
|---|---|---|
| Cloudinary | PDFs, images, notes | 25GB free |
| Firebase | Push Notifications via Expo Push API | Free tier covers most needs |
| Google Cloud Console| Google Sign-In (OAuth 2.0) | Free |

### Hosting (Production)
| Component | Hosting Solution | Why |
|---|---|---|
| Backend (API) | **Hostinger Shared Web Hosting** | You already have it. Affordable. Easy to deploy Laravel (configure public_html to point to Laravel's public folder). |
| Frontend (App)| Google Play Store & Apple App Store | Handled via Expo Application Services (EAS). |

---

## 🗄️ Database Schema (Core Tables)

```sql
-- Users
users: id, roll_no, name, email, phone, class_id, 
       role (student/cr/superadmin), profile_photo, created_at

-- Branches  
branches: id, name (CSE/ECE/ME/CE...), code

-- Classes / Groups (e.g., CSE Group-1)
classes: id, branch_id, year, group_name, cr_user_id

-- Timetables
timetables: id, class_id, day_of_week, 
            period_no, subject, teacher, room, created_by

-- Announcements
announcements: id, title, body, class_id (nullable for all), branch_id (nullable), 
               posted_by (user_id), attachment_url, created_at

-- Notes
notes: id, title, subject, class_id, 
       file_url, file_type, uploaded_by, downloads_count, created_at

-- Jobs / Failed Jobs (For Database Queue Driver)
jobs, failed_jobs -- Used by Laravel to process background tasks (emails, notifications) since Redis is absent.
```

---

## 🗂️ Project Structure

You will maintain two separate codebases (repositories):

### 1. `pecconnect-backend` (Laravel)
```text
pecconnect-backend/
├── app/
│   ├── Http/Controllers/Api/  ← All API Controllers
│   ├── Models/
│   └── Providers/
├── routes/
│   ├── api.php                ← All routes go here (Sanctum auth)
│   └── web.php                ← Unused (or just a simple landing page API status)
└── .env                       ← Contains QUEUE_CONNECTION=database, CACHE_DRIVER=file
```

### 2. `pecconnect-mobile` (Expo)
```text
pecconnect-mobile/
├── app/                       ← Expo Router / Screens
│   ├── (auth)/                ← Login, OTP verification
│   ├── (tabs)/                ← Dashboard, Timetable, Profile
│   └── notes/                 ← Nested screens
├── components/                ← Reusable UI (Buttons, Cards, Inputs)
├── hooks/                     ← Custom React hooks (API calls, Auth state)
├── utils/                     ← Helpers (Axios instance, Token storage)
├── assets/                    ← Images, Fonts
└── app.json                   ← Expo configuration
```

---

## 🚀 Launch Timeline (6-Week Sprint)

### Week 1 — Foundation (Backend & Auth)
- [ ] Set up Laravel backend on local XAMPP.
- [ ] Configure `QUEUE_CONNECTION=database` and run `php artisan queue:table`.
- [ ] Build API endpoints for Google OAuth Login (Laravel Socialite + Sanctum).
- [ ] Initialize Expo project (`npx create-expo-app`).
- [ ] Integrate Google Sign-in in Expo and connect to Laravel API.
- [ ] Manually seed the `classes` (e.g. CSE Group-1) and assign initial CRs in the database.

### Week 2 — Core API & Mobile Dashboard
- [ ] Backend: Timetable & Announcement CRUD APIs.
- [ ] Mobile: Setup React Navigation (Tabs).
- [ ] Mobile: Build Dashboard screen fetching announcements from API.

### Week 3 — Timetables & CR Controls
- [ ] Mobile: Timetable view screen.
- [ ] Mobile: Forms for CRs to add/edit timetable entries.
- [ ] Mobile: Secure these features based on user role (returned from `/api/user`).

### Week 4 — Notes & Cloudinary Integration
- [ ] Backend: API for uploading files to Cloudinary and storing DB records.
- [ ] Mobile: Notes list screen and document viewer/downloader.
- [ ] Mobile: Notes upload form for CRs (using `expo-document-picker`).

### Week 5 — Notifications & Hosting Setup
- [ ] Backend: Deploy Laravel API to Hostinger Shared Hosting via FTP or Git hooks.
- [ ] Backend: Set up a cron job in Hostinger cPanel to run `php artisan queue:work --stop-when-empty` every minute (to process emails).
- [ ] Mobile: Integrate Expo Push Notifications.

### Week 6 — Polish & App Store Deployment
- [ ] Test API endpoints on Hostinger.
- [ ] Build Android APK/AAB using `eas build`.
- [ ] Distribute to 5-10 CRs for internal testing (using Expo Go or direct APK).
- [ ] Launch on Google Play Store.

---

## ⚠️ Important Considerations for Shared Hosting

> [!WARNING]
> **No Redis / Daemons**: Hostinger shared hosting doesn't allow long-running daemon processes (like `php artisan queue:work`). 
> **Solution**: Use the `database` queue driver. Set up a **Cron Job** in cPanel to run `php artisan queue:work --stop-when-empty` every minute to process emails/notifications.

> [!IMPORTANT]
> **Public Folder Configuration**: Laravel's entry point is the `public/` directory, but shared hosting expects it to be `public_html/`. You will need to carefully structure your files or modify `.htaccess` to map correctly without exposing your `.env` file.

> [!NOTE]
> **App Store Approvals**: Android approvals take 3-7 days. iOS approvals take longer and require a $99/yr developer account. Focus on Android (Play Store) first.

## 🔧 Immediate Next Steps (Today)

1. Open your terminal in `c:\xampp\htdocs\PECPROJECT`.
2. Create the backend: `composer create-project laravel/laravel pecconnect-backend`
3. Create the mobile app: `npx create-expo-app pecconnect-mobile`
4. Set up your local MySQL database (e.g., `pecconnect_db`) in XAMPP.
5. In your backend `.env`, configure the DB credentials and set `QUEUE_CONNECTION=database`.
