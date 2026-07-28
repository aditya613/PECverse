<p align="center">
  <img src="./pecconnect-mobile/assets/images/splash-icon.png" width="180" alt="PECverse Logo" />
</p>

<h1 align="center">PECverse</h1>

<p align="center">
  <strong>The unofficial student super-app for Punjab Engineering College (PEC).</strong><br>
  <em>Built with ❤️ by PEC students, for PEC students.</em>
</p>

<p align="center">
  <a href="https://github.com/your-username/PECverse/actions"><img src="https://img.shields.io/github/actions/workflow/status/your-username/PECverse/test.yml?branch=main&style=for-the-badge&color=success" alt="Build Status"></a>
  <a href="https://github.com/your-username/PECverse/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License"></a>
  <a href="https://github.com/your-username/PECverse/stargazers"><img src="https://img.shields.io/github/stars/your-username/PECverse?style=for-the-badge&color=yellow" alt="Stars"></a>
  <a href="https://github.com/your-username/PECverse/network/members"><img src="https://img.shields.io/github/forks/your-username/PECverse?style=for-the-badge&color=lightgray" alt="Forks"></a>
</p>

<p align="center">
  <a href="#-the-vision">The Vision</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

---

## 🌟 The Vision

Life as an engineering student is chaotic enough without having to juggle five different portals for attendance, timetables, and campus announcements. 

**PECverse** was born out of a simple necessity: to unify the scattered digital life of a PEC student into one seamless, beautifully designed application. We believe that interacting with your college should feel as smooth and modern as using your favorite social media app. 

Whether you're frantically checking if you can afford to bunk the next class, or trying to figure out which room your tutorial is in, PECverse is designed to give you the answer instantly.

---

## ✨ Features

We've focused on solving the core problems students face daily, packaging them in a fluid, native-feeling interface:

* 🔔 **Real-time Announcements:** Say goodbye to endless WhatsApp forwards. Get instant push notifications for critical campus news, filtered perfectly by your branch, section, and graduating class.
* 📅 **Smart Timetable:** No more zooming into pixelated PDFs. We built an infinitely scrolling, 21-day ribbon interface showing exactly what class you have next, where it is, and who is teaching it.
* ✋ **Intelligent Attendance Manager:** Swipe to mark attendance. Set target percentages, visualize your health with dynamic color coding (know exactly when you are in the "red zone"), and access deep history logs with full undo capabilities.
* 🔒 **Secure, Exclusive Access:** Strictly fenced via `@pec.edu.in` Google OAuth. Only verified Punjab Engineering College students can enter the platform.

---

## 🛠 Tech Stack & Architecture

PECverse is built as a robust, modern monorepo, cleanly separating the mobile client from the backend REST API.

### 📱 Frontend (Mobile App)
Located in `pecconnect-mobile/`, the app is built for speed and fluid interactions.
- **Framework:** React Native / Expo
- **Navigation:** Expo Router (File-based navigation for deep linking)
- **State Management:** Zustand (Fast, scalable state without the boilerplate)
- **Animations & UX:** Reanimated 3 & Expo Haptics (for that premium, native feel)

### ⚙️ Backend (REST API)
Located in `pecconnect-backend/`, the server is designed to be stateless and highly scalable.
- **Framework:** Laravel 11 (PHP 8.2+)
- **Authentication:** Laravel Sanctum (Stateless API Tokens) & Laravel Socialite (Google OAuth)
- **Database:** MySQL / SQLite
- **Notifications:** Expo Push Notification Server SDK

---

## 🚦 Getting Started

We absolutely love open-source contributions! Whether you want to fix a typo, add a massive new feature, or optimize a database query, you are welcome here. 

To spin up PECverse on your local machine, follow these steps:

### Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) & npm
- [PHP 8.2+](https://www.php.net/) & [Composer](https://getcomposer.org/)
- MySQL (or use SQLite for a quick local setup)

### 1. Backend Setup (Laravel)
```bash
# 1. Navigate to the backend directory
cd pecconnect-backend

# 2. Install PHP dependencies
composer install

# 3. Setup your environment variables
cp .env.example .env

# 4. Generate your unique Application Key
php artisan key:generate

# 5. Run Database Migrations (ensure your DB is running)
php artisan migrate --seed

# 6. Start the local development server
php artisan serve --host=0.0.0.0
```

> **Note:** To test Google Authentication locally, you will need to create your own OAuth Client IDs in the [Google Cloud Console](https://console.cloud.google.com) and add them to your backend `.env` file.

### 2. Frontend Setup (React Native)
```bash
# 1. Open a new terminal tab and navigate to the mobile directory
cd pecconnect-mobile

# 2. Install Node dependencies
npm install

# 3. Setup your environment variables
cp .env.example .env

# 4. Point the app to your local backend
# Open the .env file and set EXPO_PUBLIC_API_URL to your machine's local IP address
# Example: EXPO_PUBLIC_API_URL=http://192.168.1.5:8000/api

# 5. Start the Expo Bundler
npm start -c
```

Once the bundler starts, scan the QR code in your terminal using the **Expo Go** app on your iOS or Android device.

---

## 🤝 Contributing

We want to build a strong community of student developers around this project. Contributions, issues, and feature requests are welcome and greatly appreciated! 

Please read our [Contributing Guidelines](CONTRIBUTING.md) to learn how to submit a pull request, and check our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community standards.

**The quick version:**
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🛡️ Security

Security is a top priority. If you discover any security-related issues, please refer to our [Security Policy](SECURITY.md) for information on how to responsibly disclose them to the maintainers.

## 📝 License

This project is distributed under the MIT License. See the [`LICENSE`](LICENSE) file for more information.
