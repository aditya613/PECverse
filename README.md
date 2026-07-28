<p align="center">
  <img src="./pecconnect-mobile/assets/images/splash-icon.png" width="150" alt="PECverse Logo" />
</p>

<h1 align="center">PECverse</h1>

<p align="center">
  <strong>The unofficial student super-app for Punjab Engineering College (PEC).</strong><br>
  Built with ❤️ by PEC students, for PEC students.
</p>

<p align="center">
  <a href="https://github.com/your-username/PECverse/actions"><img src="https://img.shields.io/github/actions/workflow/status/your-username/PECverse/test.yml?branch=main&style=flat-square" alt="Build Status"></a>
  <a href="https://github.com/your-username/PECverse/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License"></a>
  <a href="https://github.com/your-username/PECverse/stargazers"><img src="https://img.shields.io/github/stars/your-username/PECverse?style=flat-square" alt="Stars"></a>
  <a href="https://github.com/your-username/PECverse/network/members"><img src="https://img.shields.io/github/forks/your-username/PECverse?style=flat-square" alt="Forks"></a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

---

## ✨ Features

PECverse is designed to unify the scattered digital life of a PEC student into one seamless, beautifully designed application. 

* 🔔 **Real-time Announcements:** Get instant push notifications for critical campus news, filtered perfectly by your branch and graduating class.
* 📅 **Smart Timetable:** An infinitely scrolling, 21-day ribbon interface showing exactly what class you have next and where.
* ✋ **Intelligent Attendance Manager:** Swipe to mark attendance. Set target percentages, visualize your health with dynamic color coding, and access deep history logs with full undo capabilities.
* 🔒 **Secure Auth:** Strictly fenced via `@pec.edu.in` Google OAuth. Only verified students can enter.

## 🛠 Tech Stack

PECverse is built as a robust, modern monorepo separating the mobile client and the backend API.

### 📱 Frontend (Mobile App)
- **Framework:** React Native / Expo
- **Navigation:** Expo Router (File-based navigation)
- **State Management:** Zustand
- **Animations:** Reanimated & Expo Haptics for fluid, native-feeling UX

### ⚙️ Backend (REST API)
- **Framework:** Laravel 11 (PHP 8.2+)
- **Authentication:** Laravel Sanctum (Stateless API Auth) & Socialite (Google OAuth)
- **Database:** MySQL / SQLite
- **Notifications:** Expo Push Notification Server SDK

---

## 🚦 Getting Started

We welcome open-source contributions! To spin up PECverse on your local machine, follow these steps carefully.

### Prerequisites
Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) & npm
- [PHP 8.2+](https://www.php.net/) & [Composer](https://getcomposer.org/)
- MySQL (or use SQLite for local testing)

### 1. Backend Setup (Laravel)
```bash
# Navigate to the backend directory
cd pecconnect-backend

# Install dependencies
composer install

# Copy environment template
cp .env.example .env

# Generate Application Key
php artisan key:generate

# Run Database Migrations (ensure your DB is running)
php artisan migrate --seed

# Start the local development server
php artisan serve --host=0.0.0.0
```

> **Note:** To test Google Authentication locally, you will need to create your own OAuth Client IDs in the [Google Cloud Console](https://console.cloud.google.com) and add them to your backend `.env` file.

### 2. Frontend Setup (React Native)
```bash
# Navigate to the mobile directory
cd pecconnect-mobile

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit the .env file with your local backend IP
# EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8000/api

# Start the Expo Bundler
npm start -c
```

Scan the QR code in the terminal using the **Expo Go** app on your iOS or Android device.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome and greatly appreciated! 

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us. Don't forget to check our [Code of Conduct](CODE_OF_CONDUCT.md).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🛡️ Security

If you discover any security related issues, please refer to our [Security Policy](SECURITY.md) for information on how to responsibly disclose them.

## 📝 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
