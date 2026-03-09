# BattleTanks Frontend

Frontend for the BattleTanks game, built with **Angular 19** and real-time communication via **SignalR**.

## Technologies

- **Angular 19** - Frontend framework
- **NgRx Signals** - State management
- **SignalR** - Real-time WebSocket communication
- **Firebase** - Authentication
- **HTML Canvas** - Game rendering

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Angular CLI](https://angular.dev/tools/cli) v19+
- The [BattleTanks Backend](../BattleTanks-Backend) running on `http://localhost:5000`

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BattleTanks-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environments

Create the development environment file at `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000",
};
```

> **Note:** The `apiUrl` must point to the running BattleTanks Backend.

### 4. Configure Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and access your project.
2. Navigate to **Project Settings > General > Your apps** and copy the Firebase SDK configuration.
3. Update `src/firebase.config.ts` with your project's credentials:

```typescript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export const app = initializeApp(firebaseConfig);
```

### 5. Run the Application

```bash
ng serve
```

Once started, open your browser and navigate to:

- **App:** [http://localhost:4200/](http://localhost:4200/)

> **Note:** Make sure the backend is running on `http://localhost:5000` before starting the frontend.

## Project Architecture

The project follows a modular architecture organized by responsibility:

```
src/app/
├── core/           # Guards, interceptors, and core services
├── domain/         # Global models, services, and stores
├── features/       # Feature modules (pages/views)
└── shared/         # Reusable components, pipes, and utilities
```
