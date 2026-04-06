# 💎 Zorvyn Finance

A modern, full-stack personal finance tracker designed for clarity, speed, and advanced data management. Built with a focus on **glassmorphism aesthetics**, **MVC architecture**, and **real-time visualization**.

---

## 🚀 Features

- **📊 Advanced Dashboard**: Real-time summary cards (Income, Expenses, Balance) and interactive balance charts using `recharts`.
- **📝 Transaction Management**: Full CRUD operations for financial records with category-based classification.
- **🔍 Smart Filtering**: 
  - Search by description or category.
  - Filter by specific categories.
  - **Date Range Selection**: Filter transactions between two specific dates.
- **📂 Data Grouping**: Toggle between a flat list and a category-grouped view for better organizational clarity.
- **📥 Export Functionality**: Download your financial data in **CSV (Spreadsheet)** or **JSON** formats.
- **🌓 Dark/Light Mode**: Seamless theme switching with persistent state management.
- **✨ Animated UI**: Smooth transitions and entry effects powered by `framer-motion`.
- **💾 Persistent Storage**: Server-side data persistence using a JSON-based mock database.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19**: Modern component-based UI.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS 4**: Utility-first styling with modern CSS features.
- **Framer Motion**: High-performance animations.
- **Recharts**: Responsive and interactive data visualization.
- **Lucide React**: Beautifully crafted open-source icons.

### **Backend**
- **Express.js**: Robust and minimalist web framework.
- **MVC Pattern**: Organized code structure (Models, Controllers, Routes).
- **File System (fs)**: Local data persistence via `data.json`.

---

## 📂 Project Structure (MVC)

The project follows a clean **Model-View-Controller** architecture on the backend to ensure scalability and maintainability:

```text
├── server/
│   ├── models/      # Data logic and persistence (transactionModel.js)
│   ├── controllers/ # Request handling and business logic (transactionController.js)
│   └── routes/      # API endpoint definitions (transactionRoutes.js)
├── src/
│   ├── components/  # Reusable UI components (Dashboard, Transactions, Layout)
│   ├── lib/         # Shared utilities and API client
│   └── App.jsx      # Main application entry and state management
└── server.js        # Express server entry point with Vite middleware
```

---

## ⚙️ Setup & Installation

### **Prerequisites**
- Node.js (v18 or higher)
- npm (v9 or higher)

### **Installation Steps**

1. **Clone the repository** (or download the source):
   ```bash
   git clone <repository-url>
   cd zorvyn-finance
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Access the app**:
   Open your browser and navigate to `http://localhost:3000`.

---

## 🧠 Approach Overview

### **1. Architecture**
The application is built as a **full-stack SPA (Single Page Application)**. The backend uses Express to serve a RESTful API, while the frontend is a React application served via Vite middleware during development. This setup allows for a unified development experience and easy deployment.

### **2. State Management**
State is managed primarily through React's `useState` and `useMemo` hooks. Critical data (transactions, summary) is fetched on mount and kept in sync with the backend. Complex derived data, such as filtered lists and chart data, is memoized to ensure optimal performance even with large datasets.

### **3. Design Philosophy**
The UI follows a **"Glassmorphism"** aesthetic, utilizing semi-transparent backgrounds, subtle borders, and backdrop blurs to create a premium, layered feel. Accessibility is maintained through high-contrast text and clear focus states.

### **4. Data Persistence**
To keep the application lightweight yet functional, data is persisted in a `data.json` file on the server. The `transactionModel.js` handles atomic read/write operations to ensure data integrity without the overhead of a full database system for this scale.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Built with ❤️ by Zorvyn Team*
