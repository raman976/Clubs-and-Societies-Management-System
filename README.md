# 🏛️ Club and Societies Event Management System (Full-Stack)

## 🌟 Project Overview

This is a **Full-Stack Web Application** designed to manage Clubs, Societies, and their Events. The project consists of a backend API (built with Node.js/Express/Prisma) and a separate frontend client (to be built) that interacts with the API to display information, manage clubs, and allow user registrations.

### 🎯 Key Functionality Implemented (Backend)

The minimum working functionality available for demonstration is:

* **CRUD Operations for Core Models:** Full Create, Read, Update, and Delete support is implemented for **Clubs**, **Events**, and **CoreMembers**.
* **Example:** Creating a new club via **`POST /api/clubs`** successfully stores the data in the MySQL database.
* **Architecture:** Demonstrates a clean separation of concerns using the **Router-Controller-Prisma** pattern.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | **Node.js** & **Express.js** | The server runtime and minimalist web framework. |
| **Database** | **MySQL** | The relational database used for persistent storage. |
| **ORM** | **Prisma** | Modern database toolkit used for schema definition and queries. |
| **Frontend** | **[Placeholder - e.g., React.js / Next.js]** | The client-side framework used for the user interface. |
| **Package Mgr.** | **npm** | Used for managing project dependencies. |

---

## 💻 Local Setup Instructions (Detailed)

### Prerequisites

You must have the following installed on your system:

* **Node.js** (v18 or higher recommended)
* **MySQL Server** (or a similar relational database)
* **Git**

### Step 1: Fork and Clone the Repository

Start by **forking** the repository to your own GitHub account, then clone it locally.

```bash
# Fork the repository first on GitHub
# Then clone your forked version:
git clone <YOUR_FORKED_GITHUB_REPO_LINK>
cd clubs-and-societies-event-management
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Database Schema and Client

```bash
npx prisma generate
```

### Step 4: Run the Server

```bash
npm run dev
```