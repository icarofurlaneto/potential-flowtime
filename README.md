# ⏱️ FlowTimer

> A modern, intelligent Pomodoro timer built for focus and productivity, featuring detailed analytics and cloud synchronization.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?logo=firebase&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ Features

- **🎯 Smart Timer Logic:** 
  - Standard Pomodoro modes: Focus (25m), Short Break (5m), Long Break (15m).
  - **Smart Stashing:** Switching tabs doesn't kill your progress; time is stashed and restored automatically.
  - **Auto-Commit:** Focus time is only saved to history when a break actually starts or the cycle completes.
  
- **📊 Advanced Analytics:**
  - Interactive charts powered by **Recharts**.
  - Visualize focus time by **Week**, **Month** (calendar-week logic), and **Year**.
  - Track daily averages and consistency.

- **☁️ Cloud Sync (Firebase):**
  - **Authentication:** Sign in with Google or Email/Password.
  - **Firestore:** Your focus history is synced across all your devices in real-time.

- **🎨 Modern UI/UX:**
  - Glassmorphism design system.
  - Dynamic Favicon & Title updates (timer runs in the tab title).
  - Custom Audio engine using Web Audio API for notifications.

## 🏗️ Architecture

This project follows a clean, scalable Clean Architecture pattern:

```
src/
├── components/   # UI Layer (Presentation only)
│   ├── auth/
│   ├── layout/
│   ├── timer/
│   └── stats/
├── context/      # State Layer (Dependency Injection)
│   ├── AuthContext.tsx      # Handles User Session
│   └── PomodoroContext.tsx  # Handles Timer State
├── hooks/        # Logic Layer (Reusability)
│   ├── useAuth.ts
│   ├── useStats.ts
│   └── usePomodoroContext.ts
├── services/     # Service Layer (External Communication)
│   ├── authService.ts       # Firebase Auth abstraction
│   └── statsService.ts      # Firestore abstraction
├── utils/        # Domain Logic (Pure Functions)
│   ├── time.ts              # Time formatting
│   └── chartHelpers.ts      # Complex date/chart math
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Firebase Project (for Auth & Firestore)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/flowtimer.git
   cd flowtimer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🧪 Testing

The project uses **Vitest** for Unit and Integration testing. We maintain high coverage on critical logic (Timer State, Date Math).

To run the tests:
```bash
npm test
```

### Test Structure
- **Unit Tests:** `src/utils/*.test.ts` (Validates math and formatting logic).
- **Integration Tests:** `src/context/*.test.tsx` (Validates the timer flow, pausing, and saving logic).
- **App Smoke Test:** `src/App.test.tsx` (Validates if the app mounts and title updates).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
