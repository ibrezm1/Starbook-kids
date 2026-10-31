# ⭐ Starbook Kids - Gold Star Barcode Scanner & Reward System

A playful, gamified, kid-friendly web application designed to turn daily chores and positive habits into an exciting game. Kids scan real barcodes (or simulated chore tokens) to earn Gold, Silver, and Bronze stars, while parents maintain oversight through a secure PIN-protected approval dashboard, full double-entry bank statement ledger, and cash-out reward system.

All data persists locally in the browser via `localStorage` with **zero external server requirements, zero logins, and complete phone-to-phone migration**.

---

## 🚀 Quick Start

### Development with Vite & React
```bash
npm run dev
```
Starts the instant hot-reloading Vite dev server at **`http://localhost:3000`**.

### Production Build
```bash
npm run build
```
Builds the optimized production React bundle into `dist/`.

### Local Server
```bash
npm start
```
Starts the Node.js server serving the React application at **`http://localhost:3000`**.

---

## 🌐 Deploying to GitHub Pages (`github.io`)

The app is fully configured for GitHub Pages with **relative asset paths (`base: './'`)**, `.nojekyll`, fallback `404.html`, and PWA mobile manifest support.

### Option A: Automatic Deployment via GitHub Actions (Recommended)
A pre-configured GitHub Actions workflow is included at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. Initialize git (if not already done) and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Starbook Kids"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** → **Pages**
   - Under **Build and deployment** → **Source**, select **GitHub Actions**
3. That's it! Every time you push to `main`, GitHub Actions will build and deploy automatically to:
   ```
   https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/
   ```

### Option B: Deploy from the `/docs` Folder (Zero-Config Branch Deployment)
Every time you run `npm run build`, Vite compiles the production app into both `dist/` and `docs/`:

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Deploy Starbook Kids"
   git push origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Under **Branch**, select `main` and choose folder **`/docs`**
   - Click **Save**
3. Your app will be live within 1–2 minutes!

> [!TIP]
> **Mobile & Tablet Fullscreen**: When kids open the `github.io` URL on an iPhone, iPad, or Android device in Safari or Chrome, tap **Share** (or **Menu**) → **"Add to Home Screen"**. It will launch like a native fullscreen app with its own custom star icon!

---

## 🏗️ Architecture & Refactoring Overview

The application was refactored from a monolithic 2,400+ line vanilla JavaScript file into a clean, modular **React + Vite** component architecture:

```
src/
├── main.jsx                    # React entry point
├── App.jsx                     # View switcher (Kid View / Parent Dashboard)
├── context/
│   └── StarbookContext.jsx     # Centralized reactive state, ledger, and actions
├── hooks/
│   └── useStarbook.js          # Custom hook for easy component consumption
├── components/
│   ├── common/                 # Header & Toast notifications
│   ├── kid/                    # Kid view components (Bank Banner, Scan Hero,
│   │                           # Chore Starters, Exchange Station, Passbook)
│   ├── parent/                 # Parent tabs (Pending, Bank & Cashout,
│   │                           # Banking Statement, Tokens, Diagnostics)
│   └── modals/                 # Scanner, Reason, Wheel Spinner, PIN Gate,
│                               # Custom Cashout, Bonus Star, Certificate Receipt
└── utils/                      # Modular Web Audio, Confetti, Barcode SVG,
                                # and Double-Entry Ledger Engine
```

---

## 🎮 Key Features

### 1. 👧 Kid Interface
- **Playful & Gamified Design**: High-contrast, friendly rounded aesthetics, dynamic star counters, and cheerful sound effects synthesized natively via the Web Audio API.
- **Big Pulsing "Scan Barcode" Button**: Invites children to scan items or chore tokens with camera or simulated items.
- **📚 Chore Barcode Binder**:
  - Full digital catalog of dedicated, scannable **Code 39 SVG Barcodes** for every chore:
    - 🥉 **Bronze Barcodes**: *Brushed Teeth (`BRONZE-TEETH-01`), Made Bed (`BRONZE-BED-02`), Put Toys Away (`BRONZE-TOYS-03`), Shoes Away (`BRONZE-SHOES-04`), Drank Water (`BRONZE-WATER-05`), Clean Hands (`BRONZE-HANDS-06`)*.
    - 🥈 **Silver Barcodes**: *Finished Homework (`SILVER-HW-01`), Read 20 Mins (`SILVER-READ-02`), Ate Veggies (`SILVER-VEG-03`), Pet Care (`SILVER-PET-04`), Music Practice (`SILVER-MUSIC-05`), Set Table (`SILVER-TABLE-06`)*.
    - 🥇 **Gold Barcodes**: *Cleaned Bedroom (`GOLD-ROOM-01`), Kind Helper (`GOLD-HELP-02`), Kitchen Dishes (`GOLD-DISH-03`), Fold Laundry (`GOLD-LAUNDRY-04`), Big Project (`GOLD-PROJECT-05`), Yard Helper (`GOLD-YARD-06`)*.
  - Kids can point a camera at the barcode or tap **"Quick Tap Scan"** to simulate immediately!
- **Star Reward Selector**:
  - **🎰 Interactive Star Spinner Wheel**: Kids spin a prize wheel that lands on Gold, Silver, or Bronze with ticking sound effects!
  - **Task Difficulty Selector**: Or select directly by chore weight (🥉 Bronze for quick tasks, 🥈 Silver for great work, 🥇 Gold for big super star chores!).
- **✨ Star Upgrade & Exchange Station**:
  - Turn **2 Bronze Stars 🥉 into 1 Silver Star 🥈**
  - Turn **2 Silver Stars 🥈 into 1 Gold Star 🥇**
  - Break down change: **1 Gold ➔ 2 Silver** or **1 Silver ➔ 2 Bronze**
  - Interactive buttons automatically light up when ready, playing an alchemy sound effect and celebration confetti!
- **Celebration & Pending Submission**:
  - Automatically submits approved star requests to the **"Pending Approval"** box in `localStorage`.
- **Approved Star Bank Balance**:
  - Real-time display of Gold (4 pts), Silver (2 pts), Bronze (1 pt), and total Star Points (1 Gold = 2 Silver = 4 Bronze).
- **📖 Kid's Star Bank Book (Scrollable Transaction Passbook)**:
  - Kids can scroll their very own tactile, animated savings passbook!
  - **Animated Staggered Cards**: Every chore completed, treat redeemed, and star upgrade slides in with a spring bounce.
  - **Interactive Filter Chips**: *🌟 All Activity, ⭐ Stars Won, 🍦 Treats Redeemed, 🚀 Level Ups & Changes*.
  - **Live Rubber Stamps**: Official *`✓ APPROVED`*, *`🎉 REDEEMED`*, and *`⚡ LEVEL UP`* stamps on every record.
  - **Running Account Balance**: Real-time piggy bank balances logged directly on each passbook entry.
  - **Interactive Certificate / Receipt Modal**: Tap any transaction to view an official Star Bank Adventure Certificate with sound chimes and star confetti!
- **🎨 Rich Kid Animations**:
  - Floating ambient stars & sparkles, radar ripple waves on the Big Scan Button, bobbing camera emoji, bouncy chore chips, shining gleam sweeps on start buttons, and vibrant alchemy glow pulses.

---

### 2. 👨‍👩‍👧 Parent Interface (Protected by PIN)
- **Protected Access**:
  - 4-digit PIN lock (Default PIN: `1234`, customizable in settings).
  - Quick PIN disable toggle option in settings.
  - Adult math challenge bypass fallback (`7 × 8 = ?`) in case the PIN is forgotten.

- **Tab 1: ⏳ Pending Approvals**:
  - View all star submissions with timestamp, relative time ("5m ago"), scanned barcode, chore reason, and star tier badge.
  - One-click **"✓ Approve"** (adds to child's bank, triggers celebratory chime & confetti).
  - **"✕ Reject"** with confirmation.
  - **Star Tier Adjuster Dropdown**: Parents can adjust a request (e.g., Gold to Silver) before approving.
  - **"✓ Approve All Pending"** button for quick review.

- **Tab 2: 🪙 Star Bank & Cash Out**:
  - Real-time balance breakdown: Gold, Silver, Bronze, and Star Points.
  - **Pre-Configured Reward Catalog**:
    - 🎮 30 Mins Video Games (1 Gold, 1 Silver)
    - 🍦 Delicious Ice Cream Treat (1 Gold)
    - 🎬 Pick Friday Movie Night (2 Silver)
    - 🌙 Stay Up 30 Mins Late (1 Gold, 2 Bronze)
    - 🛝 Trip to the Fun Park (2 Gold, 1 Silver)
    - 🎁 Small Toy / Dollar Store (3 Gold)
    - Buttons are dynamically enabled or disabled based on current bank balance!
  - **Custom Cash Out**: Deduct any combination of Gold, Silver, and Bronze stars with custom reward name and note.
  - **Starting & Current Balances Manager**: Directly set child's starting count of Gold, Silver, and Bronze stars.

- **Tab 3: 🏛️ Bank Statement & Transaction Ledger (Banking System)**:
  - Modeled like a real financial banking account ledger!
  - Account Number (*e.g. `ACCT-7734-ALEX`*), Available Balance, Lifetime Deposits, and Lifetime Withdrawals.
  - Complete double-entry style audit log:
    - Unique Transaction ID (*e.g. `TX-104928`*)
    - Date & Time
    - Transaction Type: `+ DEPOSIT` (Credit), `- WITHDRAWAL` (Debit), `⇄ TRANSFER` (Exchange), `⚖️ ADJUSTMENT`
    - Description & Scanned Barcode (*e.g. "Cleaned Bedroom & Made Bed [GOLD-ROOM-01]"*)
    - Amount (*e.g. `+1 🥇 (+4 pts)` or `-1 🥇, -1 🥈 (-6 pts)`*)
    - **Running Account Balance After Transaction** (*e.g. `2🥇 4🥈 6🥉 (22 pts)`*)
  - Interactive Filter Tabs: *All, Deposits (+), Withdrawals (-), Upgrades (⇄)*.
  - Real-time search by chore name, reward name, or barcode.
  - **🖨️ Print Bank Statement**: Formatted printable statement layout for children's piggy bank records.

- **Tab 4: 🔧 Parent Debugger & System Health**:
  - **Ledger Integrity Health Check**: Compares `sum(credits) - sum(debits)` against the bank balance. Displays a healthy checkmark or provides a 1-click **"Force Reconcile Balances"** button.
  - **Storage Monitor**: Displays `localStorage` key, memory consumption (in KB), and record counts.
  - **Barcode Scanner Debugger & Injector**: Simulate how any barcode resolves and inject synthetic events into the pending queue or directly into the bank.
  - **Raw JSON State Editor**: View, copy, or manually edit the raw state JSON with safe schema validation.

- **Tab 5: 📲 Phone-to-Phone Migration & Backup**:
  - **Method 1: Universal JSON File Backup**:
    - **Download Backup File (`.json`)**: Save full account backup.
    - **Restore from File**: Drag-and-drop or select backup file on any device to restore instantly.
  - **Method 2: Copyable Sync Code**:
    - Generates a Base64 encoded transfer string (`STARBOOK-SYNC:...`).
    - Copy & paste via SMS, WhatsApp, AirDrop, or Notes to restore on another phone.
  - **Method 3: QR Code Camera Migration**:
    - Starbook Kids camera scanner recognizes `STARBOOK-SYNC:...` QR codes and prompts to migrate the account in one tap!

- **Tab 6: 🏷️ Printable Chore Tokens**:
  - Generates scannable **Code 39 SVG Barcodes** for common chores.
  - Clean printable layout (`Cmd + P` / `Ctrl + P`) with scissor cut lines to print physical cards for the fridge or chore board.

- **Tab 7: ⚙️ Settings & PIN**:
  - Change child's display name and 4-digit PIN.
  - Toggle PIN requirement on/off.
  - 🔄 **Load Demo Data** button (pre-populates demo chores, ledger, and bank balance).

---

## 🧪 Automated Testing

Automated test suite verifying barcode generation, scanner simulation, transaction ledger calculations, balance reconciliation, and phone-to-phone JSON export/import:

```bash
npm test
```
