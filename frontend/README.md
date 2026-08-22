# HRFlow — Enterprise HR Management Web Application

> A modern, elegant, and professional HR SaaS single-page application (SPA) built with a sleek Black & Charcoal Grey dark theme, role-based navigation, automated user ID generation, interactive analytics, and comprehensive employee/HR management workflows.

---

## 🎨 Design System

| Token | Dark Theme Value | Usage |
|---|---|---|
| **Surface (Body)** | `#09090B` (Pitch Black) | Main app background |
| **Card Background** | `#18181B` (Charcoal Grey) | Containers, cards, topbar |
| **Card Border** | `#27272A` (Dark Zinc) | Dividers, card outlines |
| **Primary Accent** | `#3B82F6` (Electric Blue) | Buttons, active links, highlights |
| **Text Primary** | `#FAFAFA` (Off-White) | Headings, high-contrast text |
| **Text Secondary** | `#A1A1AA` (Silver Grey) | Labels, descriptions, captions |
| **Success** | `#10B981` (Translucent BG) | Present, approved, completed |
| **Warning** | `#F59E0B` (Translucent BG) | Late, pending, in-progress |
| **Danger** | `#EF4444` (Translucent BG) | Absent, rejected, overdue |

---

## 🔑 Login ID Format

User IDs are generated using the formula:
$$\text{ID} = \text{OI} + \text{First2(First Name)} + \text{First2(Last Name)} + \text{YearOfJoining(4 digits)} + \text{Serial(4 digits)}$$

**Examples:**
- **John Doe** (Joined 2026): `OIJODO20260011`
- **Rahul Sharma** (Joined 2023): `OIRASH20230003`
- **Ananya Krishnan** (Joined 2022): `OIANKR20220001`

---

## 📐 Wireframe & Page Flow Diagrams

### 1. High-Level Application Flow

```
                     ┌────────────────────────────────┐
                     │     1. Logo / Splash Screen    │
                     │  (Animated logo + Progress)    │
                     └───────────────┬────────────────┘
                                     │
                                     ▼
                     ┌────────────────────────────────┐
                     │     2. Authentication Screen   │
                     │   ┌────────────────────────┐   │
                     │   │ [ Sign In ] [ Sign Up ]│   │
                     │   └────────────────────────┘   │
                     └───────────────┬────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
           (Role: Employee)                       (Role: HR)
                    │                                 │
                    ▼                                 ▼
       ┌──────────────────────────┐     ┌──────────────────────────┐
       │ 3. Employee Portal Shell │     │   4. HR Management Shell │
       │  - Topbar Header         │     │  - Topbar Header         │
       │  - Employee Sidebar      │     │  - HR Sidebar            │
       └────────────┬─────────────┘     └────────────┬─────────────┘
                    │                                │
    ┌───────────────┼───────────────┐     ┌──────────┼──────────┬───────────┐
    ▼               ▼               ▼     ▼          ▼          ▼           ▼
[Dashboard]    [Profile]      [Attendance][Dashboard][Profile][Employees] [Leave Requests]
[Work History] [Edit Profile] [Leave]     [Assignments][Work Mail][Permission Mail][Reports]
[Work Mail]    [Assignments]              
```

---

### 2. Employee Portal Wireframe Structure

```
+-----------------------------------------------------------------------------------+
|  [Logo] HRFlow  | Dashboard / Employee Portal                  [Bell] [RS] Logout |
+------------------+----------------------------------------------------------------+
| SIDEBAR          |  WELCOME SECTION                                               |
|                  |  Welcome back, Rahul Sharma! 👋                                |
| [x] Dashboard    |  Software Engineer • Engineering Department • ID: OIRASH20230003|
| [ ] Profile      |  ------------------------------------------------------------- |
| [ ] Work History |  SUMMARY STAT CARDS                                            |
| [ ] Attendance   |  [94% Attendance] [15 Leaves Avail] [3 Pending] [2 Unread Mail]|
| [ ] Leave        |  ------------------------------------------------------------- |
| [ ] Work Mail    |  GRID SECTION                                                  |
| [ ] Assignments  |  +---------------------------+  +----------------------------+ |
|                  |  | Current Assignments       |  | Pending Work Mail          | |
|                  |  | - Q3 Code Review Sprint   |  | - Q3 Sprint Planning       | |
|                  |  | - Security Audit Doc      |  | - Updated Leave Policy     | |
|                  |  +---------------------------+  +----------------------------+ |
+------------------+----------------------------------------------------------------+
```

---

### 3. HR Management Portal Wireframe Structure

```
+-----------------------------------------------------------------------------------+
|  [Logo] HRFlow  | Dashboard / HR Management                    [Bell] [AK] Logout |
+------------------+----------------------------------------------------------------+
| SIDEBAR          |  HR OVERVIEW SECTION                                           |
|                  |  HR Management Dashboard 🏢                                    |
| [x] Dashboard    |  Welcome, Ananya Krishnan • HR Manager                         |
| [ ] Profile      |  ------------------------------------------------------------- |
| [ ] Employees    |  EXECUTIVE STAT CARDS                                          |
| [ ] Assignments  |  [8 Total Employees] [7 Present Today] [1 Absent] [2 Leaves]  |
| [ ] Work Mail    |  ------------------------------------------------------------- |
| [ ] Leave Req    |  CHARTS GRID                                                   |
| [ ] Permissions  |  +---------------------------+  +----------------------------+ |
| [ ] Reports      |  | Attendance Overview Bar   |  | Dept Distribution Doughnut | |
| [ ] Settings     |  | (Jan-Aug Attendance Rate) |  | (Engg, Design, HR, etc.)   | |
|                  |  +---------------------------+  +----------------------------+ |
|                  |  EMPLOYEE DIRECTORY TABLE                                      |
|                  |  [Search...]  [Department Filter v]  [Status Filter v]         |
|                  |  ID | Name | Department | Designation | Status | Actions       |
+------------------+----------------------------------------------------------------+
```

---

## 🛠️ Detailed Component Architecture

### Reusable UI Components (`js/components.js`)
- `Components.StatCard()`: Stat display card with icon, value, label, and color theme.
- `Components.DataTable()`: Searchable, filterable table with custom cell renders.
- `Components.CalendarView()`: Month calendar grid (Sun-Sat) with color-coded days & navigation controls.
- `Components.LeaveCard()`: Leave balance card showing allocated/taken/remaining progress bars.
- `Components.MailItem()`: Inbox item displaying sender, subject, date, priority, and read status.
- `Components.AssignmentCard()`: Work assignment item with priority badge and action triggers.
- `Components.Modal()`: Modal dialog overlay template with slide-up animation.
- `Components.StatusBadge()`: Translucent status pill badge (Success, Warning, Danger, Info, Neutral).

---

## 📂 Project Directory Layout

```
HR web/
├── index.html                 # Single-Page Application (SPA) HTML shell
├── README.md                  # Documentation and Wireframe Specifications
├── package.json               # Development server script configuration
├── css/
│   └── styles.css             # Complete Black & Grey Design System CSS
└── js/
    ├── data.js                # Mock data layer & user registration handler
    ├── components.js          # Reusable component render library
    ├── charts.js              # Chart.js dark-mode presets
    ├── employee-views.js      # Employee page view renderers
    ├── hr-views.js            # HR page view renderers
    └── app.js                 # Router, session, auth, modal & toast controller
```

---

## 💻 How to Run Locally

1. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm start
   # Or run: npx live-server --port=3000
   ```

3. **Open in your web browser:**
   ```
   http://localhost:3000
   ```

4. **Test Credentials:**
   - **Employee Login:** `OIRASH20230003` / `emp123`
   - **HR Manager Login:** `OIANKR20220001` / `hr123`
   - **Sign Up / New Person:** Register any new user on the Sign Up tab!
