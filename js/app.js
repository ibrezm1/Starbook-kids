// Starbook Kids - Main Application Logic
// Gamified Gold Star Barcode Scanner & Parent Reward System

class StarbookApp {
  constructor() {
    this.STORAGE_KEY = 'starbook_kids_data_v1';
    this.data = this.loadData();
    this.currentScanData = null;
    this.selectedReason = null;
    this.selectedTier = null;
    this.currentView = 'kid'; // 'kid' or 'parent'
    this.activeParentTab = 'pending';
    this.activeKidPassbookFilter = 'all';
    this.enteredPin = '';

    this.init();
  }

  // Load from localStorage or create initial state
  loadData() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Ensure structure has default keys
        if (!parsed.settings) parsed.settings = {};
        if (!parsed.settings.accountNumber) {
          parsed.settings.accountNumber = `ACCT-7734-${(parsed.settings.childName || 'ALEX').toUpperCase()}`;
        }
        if (!parsed.bank) parsed.bank = { gold: 2, silver: 4, bronze: 6 };
        if (!parsed.pendingStars) parsed.pendingStars = [];
        if (!parsed.history) parsed.history = [];
        if (!parsed.cashOutLog) parsed.cashOutLog = [];
        if (!parsed.ledger || parsed.ledger.length === 0) {
          parsed.ledger = this.generateInitialLedger(parsed.bank, parsed.history, parsed.cashOutLog);
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing stored data, resetting:', e);
      }
    }
    return this.getDefaultData();
  }

  generateInitialLedger(bank = { gold: 2, silver: 4, bronze: 6 }, history = [], cashOutLog = []) {
    const list = [];
    const now = Date.now();

    // Opening deposit
    list.push({
      txId: 'TX-104880',
      timestamp: now - 1000 * 60 * 60 * 48,
      type: 'CREDIT',
      action: 'Initial Account Deposit',
      description: 'Starting Star Bank Balance',
      barcode: 'INIT-BANK-DEPOSIT',
      icon: '🏦',
      delta: { gold: bank.gold || 0, silver: bank.silver || 0, bronze: bank.bronze || 0 },
      pointDelta: (bank.gold || 0) * 4 + (bank.silver || 0) * 2 + (bank.bronze || 0),
      balanceAfter: {
        gold: bank.gold || 0,
        silver: bank.silver || 0,
        bronze: bank.bronze || 0,
        points: (bank.gold || 0) * 4 + (bank.silver || 0) * 2 + (bank.bronze || 0)
      },
      notes: 'Initial account balance opened'
    });

    return list;
  }

  getDefaultData() {
    return {
      settings: {
        childName: 'Alex',
        accountNumber: 'ACCT-7734-ALEX',
        parentPin: '1234',
        pinEnabled: true,
        starValues: { gold: 4, silver: 2, bronze: 1 }
      },
      bank: {
        gold: 2,
        silver: 4,
        bronze: 6
      },
      ledger: [
        {
          txId: 'TX-104928',
          timestamp: Date.now() - 1000 * 60 * 60 * 20,
          type: 'DEBIT',
          action: 'Reward Cashed Out',
          description: '30 Mins Screen Time',
          barcode: 'REWARD-rew_1',
          icon: '🎮',
          delta: { gold: -1, silver: -1, bronze: 0 },
          pointDelta: -6,
          balanceAfter: { gold: 2, silver: 4, bronze: 6, points: 22 },
          notes: 'iPad gaming Saturday morning'
        },
        {
          txId: 'TX-104915',
          timestamp: Date.now() - 1000 * 60 * 60 * 24,
          type: 'CREDIT',
          action: 'Chore Approved',
          description: 'Helped with Groceries',
          barcode: 'GOLD-HELP-02',
          icon: '🤝',
          delta: { gold: 1, silver: 0, bronze: 0 },
          pointDelta: 4,
          balanceAfter: { gold: 3, silver: 5, bronze: 6, points: 28 },
          notes: 'Approved by Mom'
        },
        {
          txId: 'TX-104880',
          timestamp: Date.now() - 1000 * 60 * 60 * 48,
          type: 'CREDIT',
          action: 'Initial Account Deposit',
          description: 'Starting Star Bank Deposit',
          barcode: 'INIT-BANK-DEPOSIT',
          icon: '🏦',
          delta: { gold: 2, silver: 5, bronze: 6 },
          pointDelta: 24,
          balanceAfter: { gold: 2, silver: 5, bronze: 6, points: 24 },
          notes: 'Bank opened for Alex'
        }
      ],
      pendingStars: [
        {
          id: 'star_demo_1',
          barcode: 'CHORE-ROOM-01',
          barcodeName: 'Clean Bedroom Token',
          reason: 'Cleaned Room & Made Bed',
          icon: '🧹',
          tier: 'gold',
          timestamp: Date.now() - 1000 * 60 * 35 // 35 mins ago
        },
        {
          id: 'star_demo_2',
          barcode: 'CHORE-HOMEWORK-02',
          barcodeName: 'Homework Completed',
          reason: 'Finished Math Worksheet',
          icon: '📚',
          tier: 'silver',
          timestamp: Date.now() - 1000 * 60 * 120 // 2 hours ago
        },
        {
          id: 'star_demo_3',
          barcode: 'CHORE-TEETH-03',
          barcodeName: 'Sparkly Teeth Badge',
          reason: 'Brushed Teeth 2 Minutes',
          icon: '🪥',
          tier: 'bronze',
          timestamp: Date.now() - 1000 * 60 * 240 // 4 hours ago
        }
      ],
      history: [
        {
          id: 'hist_1',
          type: 'approved',
          reason: 'Helped with Groceries',
          icon: '🤝',
          tier: 'gold',
          timestamp: Date.now() - 1000 * 60 * 60 * 24 // 1 day ago
        }
      ],
      cashOutLog: [
        {
          id: 'cash_1',
          rewardName: '30 Mins Screen Time',
          icon: '🎮',
          starsSpent: { gold: 1, silver: 1, bronze: 0 },
          totalPoints: 8,
          note: 'iPad gaming on Saturday morning',
          timestamp: Date.now() - 1000 * 60 * 60 * 20
        }
      ],
      customRewards: [
        { id: 'rew_1', name: '30 Mins Video Games', icon: '🎮', cost: { gold: 1, silver: 1, bronze: 0 } },
        { id: 'rew_2', name: 'Delicious Ice Cream Treat', icon: '🍦', cost: { gold: 1, silver: 0, bronze: 0 } },
        { id: 'rew_3', name: 'Pick Friday Movie Night', icon: '🎬', cost: { gold: 0, silver: 2, bronze: 0 } },
        { id: 'rew_4', name: 'Stay Up 30 Mins Late', icon: '🌙', cost: { gold: 1, silver: 0, bronze: 2 } },
        { id: 'rew_5', name: 'Trip to the Fun Park', icon: '🛝', cost: { gold: 2, silver: 1, bronze: 0 } },
        { id: 'rew_6', name: 'Small Toy / Dollar Store', icon: '🎁', cost: { gold: 3, silver: 0, bronze: 0 } }
      ]
    };
  }

  saveData() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving data to localStorage:', e);
    }
    this.render();
  }

  // Calculate total star points
  calculatePoints(bank = this.data.bank) {
    const vals = this.data.settings.starValues || { gold: 4, silver: 2, bronze: 1 };
    return (bank.gold || 0) * vals.gold +
           (bank.silver || 0) * vals.silver +
           (bank.bronze || 0) * vals.bronze;
  }

  // --- Bank Account Transaction Ledger Engine ---
  recordLedgerTransaction({ type, action, description, barcode, icon, delta, pointDelta, notes }) {
    if (!this.data.ledger) this.data.ledger = [];

    const txId = `TX-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const currentPoints = this.calculatePoints();

    const tx = {
      txId,
      timestamp: Date.now(),
      type, // 'CREDIT' (+), 'DEBIT' (-), 'TRANSFER' (⇄), 'ADJUSTMENT' (⚖️)
      action: action || 'Transaction',
      description: description || 'Account Activity',
      barcode: barcode || 'N/A',
      icon: icon || '⭐',
      delta: {
        gold: delta ? (delta.gold || 0) : 0,
        silver: delta ? (delta.silver || 0) : 0,
        bronze: delta ? (delta.bronze || 0) : 0
      },
      pointDelta: pointDelta !== undefined ? pointDelta : 0,
      balanceAfter: {
        gold: this.data.bank.gold || 0,
        silver: this.data.bank.silver || 0,
        bronze: this.data.bank.bronze || 0,
        points: currentPoints
      },
      notes: notes || ''
    };

    this.data.ledger.unshift(tx);
    return tx;
  }

  // Verify Ledger Integrity (Check balance matches sum of transactions)
  verifyLedgerIntegrity() {
    const ledger = this.data.ledger || [];
    let netGold = 0, netSilver = 0, netBronze = 0;

    // From oldest to newest
    const reversed = [...ledger].reverse();
    reversed.forEach(tx => {
      if (tx.delta) {
        netGold += (tx.delta.gold || 0);
        netSilver += (tx.delta.silver || 0);
        netBronze += (tx.delta.bronze || 0);
      }
    });

    const current = this.data.bank || { gold: 0, silver: 0, bronze: 0 };
    const isHealthy = (current.gold === netGold) &&
                      (current.silver === netSilver) &&
                      (current.bronze === netBronze);

    return {
      isHealthy,
      ledgerTotal: { gold: netGold, silver: netSilver, bronze: netBronze },
      currentBank: { gold: current.gold, silver: current.silver, bronze: current.bronze },
      txCount: ledger.length
    };
  }

  // Reconcile Bank Balances from Ledger
  reconcileBalances() {
    const integrity = this.verifyLedgerIntegrity();
    this.data.bank.gold = Math.max(0, integrity.ledgerTotal.gold);
    this.data.bank.silver = Math.max(0, integrity.ledgerTotal.silver);
    this.data.bank.bronze = Math.max(0, integrity.ledgerTotal.bronze);
    this.saveData();
    window.soundController.playStarChime('gold');
    this.showToast('Reconciled bank balance with transaction ledger! ✓', 'success');
  }

  // --- Phone-to-Phone Export & Import System ---
  exportBackupJSON() {
    const backup = {
      app: 'Starbook Kids',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      account: {
        childName: this.data.settings.childName,
        accountNumber: this.data.settings.accountNumber || 'ACCT-7734-ALEX',
        currentBalance: { ...this.data.bank },
        totalPoints: this.calculatePoints()
      },
      data: this.data
    };

    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const safeName = (this.data.settings.childName || 'child').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const dateStr = new Date().toISOString().slice(0, 10);

    const a = document.createElement('a');
    a.href = url;
    a.download = `starbook-backup-${safeName}-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast('Bank backup downloaded! 📥', 'success');
  }

  importBackupJSON(jsonString) {
    try {
      const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      const incomingData = parsed.data || parsed;

      if (!incomingData.bank || !incomingData.settings) {
        throw new Error('Invalid Starbook backup format: missing bank or settings');
      }

      this.data = incomingData;
      if (!this.data.ledger) {
        this.data.ledger = this.generateInitialLedger(this.data.bank);
      }

      this.saveData();
      window.soundController.playFanfare();
      if (window.confettiEngine) {
        window.confettiEngine.celebrateBig();
      }
      this.showToast(`Restored bank data for ${this.data.settings.childName}! 🎉`, 'success');
      return true;
    } catch (err) {
      console.error('Import error:', err);
      alert('Could not restore backup file: ' + err.message);
      return false;
    }
  }

  generateSyncCode() {
    try {
      const payload = JSON.stringify(this.data);
      const b64 = btoa(unescape(encodeURIComponent(payload)));
      return `STARBOOK-SYNC:${b64}`;
    } catch (e) {
      console.error('Sync code generation error:', e);
      return '';
    }
  }

  applySyncCode(codeString) {
    if (!codeString || !codeString.startsWith('STARBOOK-SYNC:')) {
      alert('Invalid Sync Code format! Must begin with STARBOOK-SYNC:');
      return false;
    }
    try {
      const b64 = codeString.replace('STARBOOK-SYNC:', '').trim();
      const decoded = decodeURIComponent(escape(atob(b64)));
      return this.importBackupJSON(decoded);
    } catch (e) {
      alert('Error parsing Sync Code: ' + e.message);
      return false;
    }
  }

  handleSyncQRCode(qrString) {
    if (!qrString.startsWith('STARBOOK-SYNC:')) return;
    try {
      const b64 = qrString.replace('STARBOOK-SYNC:', '').trim();
      const decoded = decodeURIComponent(escape(atob(b64)));
      const parsed = JSON.parse(decoded);
      const childName = parsed.settings?.childName || 'Child';
      const pts = (parsed.bank?.gold || 0) * 5 + (parsed.bank?.silver || 0) * 3 + (parsed.bank?.bronze || 0);

      const confirmRestore = confirm(
        `📲 Starbook Account Transfer Detected!\n\n` +
        `Account: ${childName}\n` +
        `Balance: ${parsed.bank?.gold || 0} Gold, ${parsed.bank?.silver || 0} Silver, ${parsed.bank?.bronze || 0} Bronze (${pts} pts)\n` +
        `Ledger: ${(parsed.ledger || []).length} recorded transactions\n\n` +
        `Import and switch to this account on this device?`
      );

      if (confirmRestore) {
        this.data = parsed;
        this.saveData();
        window.soundController.playFanfare();
        if (window.confettiEngine) window.confettiEngine.celebrateBig();
        this.showToast(`Account for ${childName} successfully migrated! 🚀`, 'success');
      }
    } catch (e) {
      alert('Could not import from QR Code: ' + e.message);
    }
  }

  init() {
    this.setupEventListeners();
    this.render();

    // Hook scanner callback
    if (window.starScanner) {
      window.starScanner.onBarcodeDetected = (result) => {
        this.handleBarcodeScanSuccess(result);
      };
    }

    // Auto-update relative times every minute
    setInterval(() => {
      this.updateTimeDisplays();
    }, 60000);
  }

  setupEventListeners() {
    // Top Bar Actions
    document.getElementById('btn-sound-toggle')?.addEventListener('click', () => {
      const active = window.soundController.toggleSound();
      this.updateSoundButtonUI(active);
    });

    document.getElementById('btn-switch-to-parent')?.addEventListener('click', () => {
      this.requestParentAccess();
    });

    document.getElementById('btn-switch-to-kid')?.addEventListener('click', () => {
      this.switchView('kid');
      window.soundController.playPop();
    });

    // Kid Interface Big Scan Button
    document.getElementById('btn-kid-scan-big')?.addEventListener('click', () => {
      this.openScanModal();
    });

    // Close Modals buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-close-modal');
        this.closeModal(modalId);
        window.soundController.playPop();
      });
    });

    // Scanner Modal Controls
    document.getElementById('btn-scanner-torch')?.addEventListener('click', () => {
      window.starScanner.toggleTorch();
    });

    document.getElementById('btn-scanner-flip')?.addEventListener('click', () => {
      window.starScanner.flipCamera();
    });

    // Simulated quick scan buttons
    document.querySelectorAll('.btn-sim-scan').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const code = e.currentTarget.getAttribute('data-code');
        window.starScanner.simulateScan(code);
      });
    });

    // Custom Barcode input submit
    document.getElementById('btn-submit-manual-code')?.addEventListener('click', () => {
      const input = document.getElementById('input-manual-code');
      const val = input.value.trim();
      if (val) {
        window.starScanner.simulateScan(val);
        input.value = '';
      }
    });

    // PIN Pad logic
    this.setupPinPad();

    // Parent Tabs
    document.querySelectorAll('.parent-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.switchParentTab(tab);
        window.soundController.playPop();
      });
    });

    // Parent: Approve All
    document.getElementById('btn-approve-all-pending')?.addEventListener('click', () => {
      this.approveAllPending();
    });

    // Parent: Print Chore Cards
    document.getElementById('btn-print-chore-cards')?.addEventListener('click', () => {
      window.print();
    });

    // Parent: Settings Form
    document.getElementById('parent-settings-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveParentSettings();
    });

    // Parent: Reset to Demo Data
    document.getElementById('btn-reset-demo-data')?.addEventListener('click', () => {
      if (confirm('Load demo data? This will reset pending chores and bank stars for demoing.')) {
        this.data = this.getDefaultData();
        this.saveData();
        this.showToast('Demo data loaded successfully! ⭐', 'success');
        window.soundController.playFanfare();
      }
    });

    // Parent: Add Manual Star Modal
    document.getElementById('btn-open-manual-star-modal')?.addEventListener('click', () => {
      this.openModal('modal-manual-star');
    });

    document.getElementById('form-manual-star')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleManualStarSubmit();
    });

    // Parent: Custom Cash Out Form
    document.getElementById('btn-open-custom-cashout')?.addEventListener('click', () => {
      this.openModal('modal-custom-cashout');
    });

    document.getElementById('form-custom-cashout')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCustomCashOutSubmit();
    });

    // Kid: Quick Tier Starter Chips (Bronze, Silver, Gold)
    document.querySelectorAll('.tier-quick-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget;
        const tier = target.getAttribute('data-tier') || 'bronze';
        const reason = target.getAttribute('data-reason');
        const icon = target.getAttribute('data-icon') || '⭐';
        const code = target.getAttribute('data-code') || `CHORE-${tier.toUpperCase()}`;
        this.startTierChore(tier, reason, icon, code);
      });
    });

    // Kid: Big Start Tier Action Buttons
    document.querySelectorAll('.btn-start-custom-tier').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tier = e.currentTarget.getAttribute('data-tier') || 'bronze';
        this.openTierChoreModal(tier);
      });
    });

    // Kid: Star Exchange Station Buttons
    document.getElementById('btn-exchange-bronze-silver')?.addEventListener('click', () => {
      this.exchangeStars('bronze-to-silver');
    });

    document.getElementById('btn-exchange-silver-gold')?.addEventListener('click', () => {
      this.exchangeStars('silver-to-gold');
    });

    document.getElementById('btn-exchange-gold-silver')?.addEventListener('click', () => {
      this.exchangeStars('gold-to-silver');
    });

    document.getElementById('btn-exchange-silver-bronze')?.addEventListener('click', () => {
      this.exchangeStars('silver-to-bronze');
    });

    // Kid: Star Passbook (Transaction Book) Controls & Delegation
    document.getElementById('btn-jump-to-passbook')?.addEventListener('click', () => {
      document.getElementById('section-kid-passbook')?.scrollIntoView({ behavior: 'smooth' });
      window.soundController.playPop();
    });

    document.getElementById('btn-passbook-start-first')?.addEventListener('click', () => {
      window.soundController.playPop();
      document.getElementById('btn-kid-scan-big')?.click();
    });

    document.querySelectorAll('.kid-passbook-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.kid-passbook-filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeKidPassbookFilter = e.currentTarget.getAttribute('data-filter') || 'all';
        this.renderKidPassbook();
        window.soundController.playPop();
      });
    });

    document.getElementById('kid-passbook-stream-container')?.addEventListener('click', (e) => {
      const item = e.target.closest('.kid-passbook-item');
      if (item) {
        const txId = item.getAttribute('data-tx-id');
        if (txId) this.openKidReceiptModal(txId);
      }
    });

    document.getElementById('btn-exchange-gold-silver')?.addEventListener('click', () => {
      this.exchangeStars('gold-to-silver');
    });

    document.getElementById('btn-exchange-silver-bronze')?.addEventListener('click', () => {
      this.exchangeStars('silver-to-bronze');
    });

    // Kid: Star Passbook (Transaction Book) Controls & Delegation
    document.getElementById('btn-jump-to-passbook')?.addEventListener('click', () => {
      document.getElementById('section-kid-passbook')?.scrollIntoView({ behavior: 'smooth' });
      window.soundController.playPop();
    });

    document.getElementById('btn-passbook-start-first')?.addEventListener('click', () => {
      window.soundController.playPop();
      document.getElementById('btn-kid-scan-big')?.click();
    });

    document.querySelectorAll('.kid-passbook-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.kid-passbook-filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeKidPassbookFilter = e.currentTarget.getAttribute('data-filter') || 'all';
        this.renderKidPassbook();
        window.soundController.playPop();
      });
    });

    document.getElementById('kid-passbook-stream-container')?.addEventListener('click', (e) => {
      const item = e.target.closest('.kid-passbook-item');
      if (item) {
        const txId = item.getAttribute('data-tx-id');
        if (txId) this.openKidReceiptModal(txId);
      }
    });

    // Parent: Starting & Current Balances Form
    document.getElementById('form-starting-balances')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleStartingBalancesSubmit();
    });

    // Parent: Bank Statement Filters & Search
    document.querySelectorAll('.statement-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.statement-filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.renderBankStatement();
        window.soundController.playPop();
      });
    });

    document.getElementById('input-statement-search')?.addEventListener('input', () => {
      this.renderBankStatement();
    });

    document.getElementById('btn-print-statement')?.addEventListener('click', () => {
      window.print();
    });

    // Parent: Phone-to-Phone Migration & Backup
    document.getElementById('btn-export-backup-json')?.addEventListener('click', () => {
      this.exportBackupJSON();
    });

    document.getElementById('btn-import-backup-file')?.addEventListener('click', () => {
      document.getElementById('input-import-backup-file')?.click();
    });

    document.getElementById('input-import-backup-file')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        this.importBackupJSON(event.target.result);
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-copy-sync-code')?.addEventListener('click', () => {
      const code = this.generateSyncCode();
      navigator.clipboard?.writeText(code).then(() => {
        this.showToast('Copied Sync Code to Clipboard! 📋', 'success');
      }).catch(() => {
        prompt('Copy your Sync Code:', code);
      });
    });

    document.getElementById('form-apply-sync-code')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('input-apply-sync-code')?.value.trim();
      if (code) {
        this.applySyncCode(code);
      }
    });

    // Parent: Debugger Panel Actions
    document.getElementById('btn-debug-reconcile')?.addEventListener('click', () => {
      this.reconcileBalances();
      this.renderDebugPanel();
    });

    document.getElementById('btn-debug-apply-raw-json')?.addEventListener('click', () => {
      const raw = document.getElementById('textarea-debug-raw-json')?.value;
      if (raw) {
        if (confirm('Apply raw JSON changes to localStorage?')) {
          this.importBackupJSON(raw);
          this.renderDebugPanel();
        }
      }
    });

    document.getElementById('form-debug-inject-barcode')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('debug-inject-code')?.value.trim();
      const mode = document.getElementById('debug-inject-mode')?.value;
      if (code) {
        this.handleDebugBarcodeInjection(code, mode);
      }
    });

    // Kid: Chore Barcode Binder Modal
    document.getElementById('btn-open-barcode-binder')?.addEventListener('click', () => {
      this.openBarcodeBinderModal();
    });
  }

  // --- Sound Toggle Button UI ---
  updateSoundButtonUI(active) {
    const btn = document.getElementById('btn-sound-toggle');
    if (btn) {
      btn.innerHTML = active ? '🔊 <span class="sr-only">Sound On</span>' : '🔇 <span class="sr-only">Sound Off</span>';
      btn.title = active ? 'Sound FX: ON' : 'Sound FX: OFF';
    }
  }

  // --- View Switching ---
  switchView(view) {
    this.currentView = view;
    const kidView = document.getElementById('view-kid');
    const parentView = document.getElementById('view-parent');
    const topBarKid = document.getElementById('topbar-kid-controls');
    const topBarParent = document.getElementById('topbar-parent-controls');

    if (view === 'kid') {
      kidView.classList.remove('hidden');
      parentView.classList.add('hidden');
      topBarKid.classList.remove('hidden');
      topBarParent.classList.add('hidden');
      document.body.classList.remove('parent-mode-active');
    } else {
      kidView.classList.add('hidden');
      parentView.classList.remove('hidden');
      topBarKid.classList.add('hidden');
      topBarParent.classList.remove('hidden');
      document.body.classList.add('parent-mode-active');
      this.switchParentTab(this.activeParentTab);
    }
  }

  // --- Parent Access Gate & PIN ---
  requestParentAccess() {
    if (!this.data.settings.pinEnabled) {
      this.switchView('parent');
      return;
    }
    this.enteredPin = '';
    this.updatePinDisplay();
    this.openModal('modal-parent-pin');
  }

  setupPinPad() {
    const pinBtns = document.querySelectorAll('.pin-key');
    pinBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-key');
        window.soundController.playPop();

        if (key === 'clear') {
          this.enteredPin = '';
        } else if (key === 'back') {
          this.enteredPin = this.enteredPin.slice(0, -1);
        } else if (this.enteredPin.length < 4) {
          this.enteredPin += key;
        }

        this.updatePinDisplay();

        if (this.enteredPin.length === 4) {
          this.verifyPin();
        }
      });
    });

    // Parent math challenge fallback
    document.getElementById('btn-parent-math-bypass')?.addEventListener('click', () => {
      const a = Math.floor(Math.random() * 8) + 6;
      const b = Math.floor(Math.random() * 7) + 5;
      const ans = prompt(`Parent Math Challenge: What is ${a} × ${b}?`);
      if (ans && parseInt(ans.trim(), 10) === a * b) {
        this.closeModal('modal-parent-pin');
        this.switchView('parent');
        window.soundController.playFanfare();
        this.showToast('Unlocked Parent Dashboard!', 'success');
      } else if (ans !== null) {
        window.soundController.playReject();
        alert('Incorrect answer. Only parents can unlock this area!');
      }
    });
  }

  updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, idx) => {
      if (idx < this.enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  verifyPin() {
    const correctPin = this.data.settings.parentPin || '1234';
    if (this.enteredPin === correctPin) {
      window.soundController.playStarChime('gold');
      this.closeModal('modal-parent-pin');
      this.switchView('parent');
      this.showToast('Welcome, Mom & Dad! 👑', 'success');
    } else {
      window.soundController.playReject();
      const pinBox = document.querySelector('.pin-dots-container');
      pinBox.classList.add('shake');
      setTimeout(() => {
        pinBox.classList.remove('shake');
        this.enteredPin = '';
        this.updatePinDisplay();
      }, 500);
      this.showToast('Incorrect PIN. (Default: 1234)', 'error');
    }
  }

  // --- Modal Helpers ---
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.classList.add('modal-open');
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.classList.remove('modal-open');
    }

    if (modalId === 'modal-scan') {
      window.starScanner.stopScanning();
    }
  }

  // --- Step 1: Scan Barcode Modal ---
  openScanModal() {
    this.openModal('modal-scan');
    const videoElem = document.getElementById('webcam-video');
    const statusElem = document.getElementById('camera-status-msg');
    window.starScanner.startWebcam(videoElem, statusElem);
  }

  // Barcode successfully scanned or simulated
  handleBarcodeScanSuccess(scanResult) {
    this.closeModal('modal-scan');
    this.currentScanData = scanResult;

    // Show step 2: Reason Selection Modal
    this.openReasonModal();
  }

  // --- Step 2: Reason Modal ---
  openReasonModal() {
    const titleElem = document.getElementById('reason-scanned-item-name');
    const iconElem = document.getElementById('reason-scanned-item-icon');
    const codeElem = document.getElementById('reason-scanned-item-code');

    if (titleElem) titleElem.textContent = this.currentScanData.name;
    if (iconElem) iconElem.textContent = this.currentScanData.icon || '🏷️';
    if (codeElem) codeElem.textContent = `Barcode: ${this.currentScanData.barcode}`;

    // Reset inputs
    document.getElementById('input-custom-reason').value = '';
    document.querySelectorAll('.btn-chore-preset').forEach(b => b.classList.remove('selected'));
    this.selectedReason = null;

    this.openModal('modal-reason');
    this.setupReasonButtons();
  }

  setupReasonButtons() {
    const presetBtns = document.querySelectorAll('.btn-chore-preset');
    presetBtns.forEach(btn => {
      btn.onclick = (e) => {
        window.soundController.playPop();
        presetBtns.forEach(b => b.classList.remove('selected'));
        const target = e.currentTarget;
        target.classList.add('selected');
        this.selectedReason = {
          text: target.getAttribute('data-reason'),
          icon: target.getAttribute('data-icon') || '⭐',
          defaultTier: target.getAttribute('data-tier') || 'silver'
        };
        document.getElementById('input-custom-reason').value = '';
      };
    });

    const nextBtn = document.getElementById('btn-confirm-reason-next');
    nextBtn.onclick = () => {
      const customVal = document.getElementById('input-custom-reason').value.trim();
      if (customVal) {
        this.selectedReason = {
          text: customVal,
          icon: '🌟',
          defaultTier: 'silver'
        };
      }

      if (!this.selectedReason) {
        alert('Please pick a chore or type what awesome deed you did! 🌟');
        return;
      }

      this.closeModal('modal-reason');
      this.openStarAwardModal();
    };
  }

  // --- Step 3: Star Awarding Selector / Spinner Modal ---
  openStarAwardModal() {
    this.selectedTier = null;
    const choreLabel = document.getElementById('award-chore-label');
    if (choreLabel) {
      choreLabel.textContent = `${this.selectedReason.icon} ${this.selectedReason.text}`;
    }

    // Reset spinner UI
    const wheel = document.getElementById('star-spinner-wheel');
    if (wheel) wheel.style.transform = 'rotate(0deg)';
    const spinBtn = document.getElementById('btn-spin-wheel');
    if (spinBtn) {
      spinBtn.disabled = false;
      spinBtn.textContent = '🎰 Spin the Star Wheel!';
    }
    const resultBox = document.getElementById('spinner-result-display');
    if (resultBox) resultBox.classList.add('hidden');

    // Reset difficulty tier buttons
    document.querySelectorAll('.btn-difficulty-tier').forEach(b => b.classList.remove('selected'));

    this.openModal('modal-star-award');
    this.setupStarAwardInteraction();
  }

  setupStarAwardInteraction() {
    // Mode A: Spinner Wheel
    const spinBtn = document.getElementById('btn-spin-wheel');
    const wheel = document.getElementById('star-spinner-wheel');
    const resultBox = document.getElementById('spinner-result-display');

    if (spinBtn) {
      spinBtn.onclick = () => {
        spinBtn.disabled = true;
        spinBtn.textContent = 'Spinning... 💫';

        // Play ticking sounds
        let tickCount = 0;
        const tickInterval = setInterval(() => {
          window.soundController.playTick();
          tickCount++;
          if (tickCount > 18) clearInterval(tickInterval);
        }, 120);

        // Random prize determination: 50% Gold, 35% Silver, 15% Bronze for maximum kid joy!
        const rand = Math.random();
        let targetTier = 'gold';
        let targetDeg = 0;

        if (rand < 0.2) {
          targetTier = 'bronze';
          targetDeg = 1440 + 60; // lands on bronze segment
        } else if (rand < 0.55) {
          targetTier = 'silver';
          targetDeg = 1440 + 180; // lands on silver segment
        } else {
          targetTier = 'gold';
          targetDeg = 1440 + 300; // lands on gold segment
        }

        if (wheel) {
          wheel.style.transition = 'transform 2.5s cubic-bezier(0.15, 0.9, 0.25, 1)';
          wheel.style.transform = `rotate(${targetDeg}deg)`;
        }

        setTimeout(() => {
          this.selectedTier = targetTier;
          window.soundController.playStarChime(targetTier);
          if (window.confettiEngine) {
            window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 50, 'stars');
          }

          if (resultBox) {
            resultBox.classList.remove('hidden');
            resultBox.innerHTML = `
              <div class="result-badge ${targetTier}">
                <span class="text-3xl">${this.getTierIcon(targetTier)}</span>
                <span class="font-bold text-lg capitalize">${targetTier} Star!</span>
              </div>
            `;
          }

          setTimeout(() => {
            this.confirmAndSubmitPendingStar(targetTier);
          }, 900);
        }, 2600);
      };
    }

    // Mode B: Task Difficulty Quick Buttons
    document.querySelectorAll('.btn-difficulty-tier').forEach(btn => {
      btn.onclick = (e) => {
        const tier = e.currentTarget.getAttribute('data-tier');
        this.selectedTier = tier;
        window.soundController.playStarChime(tier);
        if (window.confettiEngine) {
          window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 40, 'stars');
        }
        this.confirmAndSubmitPendingStar(tier);
      };
    });
  }

  // --- Step 4: Submit to Pending Approval & Show Celebration ---
  confirmAndSubmitPendingStar(tier) {
    const newStar = {
      id: `star_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      barcode: this.currentScanData.barcode,
      barcodeName: this.currentScanData.name,
      reason: this.selectedReason.text,
      icon: this.selectedReason.icon || '⭐',
      tier: tier,
      timestamp: Date.now()
    };

    this.data.pendingStars.unshift(newStar);
    this.saveData();

    this.closeModal('modal-star-award');
    this.showCelebrationScreen(newStar);
  }

  showCelebrationScreen(star) {
    const celModal = document.getElementById('modal-celebration');
    const badgeContainer = document.getElementById('celebration-star-badge');
    const deedMsg = document.getElementById('celebration-deed-text');

    if (badgeContainer) {
      badgeContainer.innerHTML = `
        <div class="huge-star-container animate-bounce-gentle">
          ${this.getStarSvg(star.tier, 140)}
          <div class="huge-star-label tier-${star.tier}">
            ${star.tier.toUpperCase()} STAR!
          </div>
        </div>
      `;
    }

    if (deedMsg) {
      deedMsg.innerHTML = `
        <strong>${star.icon} ${star.reason}</strong><br>
        <span class="text-sm text-slate-500">Sent to Mom & Dad for Approval!</span>
      `;
    }

    this.openModal('modal-celebration');
    window.soundController.playFanfare();
    if (window.confettiEngine) {
      window.confettiEngine.celebrateBig();
    }
  }

  // --- Parent Actions: Approve & Reject ---
  approveStar(starId, optionalNewTier = null) {
    const idx = this.data.pendingStars.findIndex(s => s.id === starId);
    if (idx === -1) return;

    const star = this.data.pendingStars.splice(idx, 1)[0];
    const finalTier = optionalNewTier || star.tier;

    // Add to bank
    if (!this.data.bank[finalTier]) this.data.bank[finalTier] = 0;
    this.data.bank[finalTier] += 1;

    // Record into Bank Transaction Ledger
    const pts = (this.data.settings.starValues || { gold: 4, silver: 2, bronze: 1 })[finalTier] || 1;
    this.recordLedgerTransaction({
      type: 'CREDIT',
      action: 'Chore Approved',
      description: star.reason,
      barcode: star.barcode || 'CHORE-APPROVED',
      icon: star.icon || '⭐',
      delta: {
        gold: finalTier === 'gold' ? 1 : 0,
        silver: finalTier === 'silver' ? 1 : 0,
        bronze: finalTier === 'bronze' ? 1 : 0
      },
      pointDelta: pts,
      notes: `Approved by Parent • Barcode: ${star.barcode || 'N/A'}`
    });

    // Add to history
    this.data.history.unshift({
      id: `hist_${Date.now()}`,
      type: 'approved',
      reason: star.reason,
      icon: star.icon,
      tier: finalTier,
      barcode: star.barcode,
      timestamp: Date.now()
    });

    this.saveData();
    window.soundController.playStarChime(finalTier);
    if (window.confettiEngine) {
      window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.4, 50, 'stars');
    }
    this.showToast(`Approved ${finalTier} Star for "${star.reason}"! ⭐`, 'success');
  }

  rejectStar(starId) {
    const idx = this.data.pendingStars.findIndex(s => s.id === starId);
    if (idx === -1) return;

    const star = this.data.pendingStars.splice(idx, 1)[0];
    this.data.history.unshift({
      id: `hist_${Date.now()}`,
      type: 'rejected',
      reason: star.reason,
      icon: star.icon,
      tier: star.tier,
      barcode: star.barcode,
      timestamp: Date.now()
    });

    this.saveData();
    window.soundController.playReject();
    this.showToast(`Declined "${star.reason}"`, 'info');
  }

  approveAllPending() {
    if (!this.data.pendingStars || this.data.pendingStars.length === 0) {
      this.showToast('No pending stars to approve!', 'info');
      return;
    }

    const count = this.data.pendingStars.length;
    this.data.pendingStars.forEach(star => {
      if (!this.data.bank[star.tier]) this.data.bank[star.tier] = 0;
      this.data.bank[star.tier] += 1;

      const pts = (this.data.settings.starValues || { gold: 4, silver: 2, bronze: 1 })[star.tier] || 1;
      this.recordLedgerTransaction({
        type: 'CREDIT',
        action: 'Chore Approved (Bulk)',
        description: star.reason,
        barcode: star.barcode || 'CHORE-APPROVED',
        icon: star.icon || '⭐',
        delta: {
          gold: star.tier === 'gold' ? 1 : 0,
          silver: star.tier === 'silver' ? 1 : 0,
          bronze: star.tier === 'bronze' ? 1 : 0
        },
        pointDelta: pts,
        notes: `Bulk approved by Parent`
      });

      this.data.history.unshift({
        id: `hist_${Date.now()}_${Math.random()}`,
        type: 'approved',
        reason: star.reason,
        icon: star.icon,
        tier: star.tier,
        barcode: star.barcode,
        timestamp: Date.now()
      });
    });

    this.data.pendingStars = [];
    this.saveData();
    window.soundController.playFanfare();
    if (window.confettiEngine) {
      window.confettiEngine.celebrateBig();
    }
    this.showToast(`Awesome! Approved all ${count} stars! 🎉`, 'success');
  }

  // --- Parent Actions: Cash Out Rewards ---
  cashOutReward(rewardId) {
    const reward = this.data.customRewards.find(r => r.id === rewardId);
    if (!reward) return;

    // Check balance
    const cost = reward.cost;
    const goldNeed = cost.gold || 0;
    const silverNeed = cost.silver || 0;
    const bronzeNeed = cost.bronze || 0;

    if ((this.data.bank.gold || 0) < goldNeed ||
        (this.data.bank.silver || 0) < silverNeed ||
        (this.data.bank.bronze || 0) < bronzeNeed) {
      window.soundController.playReject();
      alert(`Not enough stars in ${this.data.settings.childName}'s bank for "${reward.name}"!\nNeed: ${goldNeed} Gold, ${silverNeed} Silver, ${bronzeNeed} Bronze.\nAvailable: ${this.data.bank.gold} Gold, ${this.data.bank.silver} Silver, ${this.data.bank.bronze} Bronze.`);
      return;
    }

    // Deduct
    this.data.bank.gold -= goldNeed;
    this.data.bank.silver -= silverNeed;
    this.data.bank.bronze -= bronzeNeed;

    const pointsSpent = (goldNeed * this.data.settings.starValues.gold) +
                        (silverNeed * this.data.settings.starValues.silver) +
                        (bronzeNeed * this.data.settings.starValues.bronze);

    this.data.cashOutLog.unshift({
      id: `cash_${Date.now()}`,
      rewardName: reward.name,
      icon: reward.icon || '🎁',
      starsSpent: { gold: goldNeed, silver: silverNeed, bronze: bronzeNeed },
      totalPoints: pointsSpent,
      note: 'Redeemed from reward catalog',
      timestamp: Date.now()
    });

    // Record into Bank Transaction Ledger
    this.recordLedgerTransaction({
      type: 'DEBIT',
      action: 'Reward Cashed Out',
      description: reward.name,
      barcode: `REWARD-${reward.id}`,
      icon: reward.icon || '🎁',
      delta: { gold: -goldNeed, silver: -silverNeed, bronze: -bronzeNeed },
      pointDelta: -pointsSpent,
      notes: `Redeemed from reward catalog (${goldNeed} Gold, ${silverNeed} Silver, ${bronzeNeed} Bronze)`
    });

    this.saveData();
    window.soundController.playCashOut();
    if (window.confettiEngine) {
      window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 60, 'mixed');
    }
    this.showToast(`Cashed out "${reward.name}"! Enjoy! 🎉`, 'success');
  }

  handleCustomCashOutSubmit() {
    const name = document.getElementById('custom-reward-name').value.trim();
    const gold = parseInt(document.getElementById('custom-cost-gold').value || '0', 10);
    const silver = parseInt(document.getElementById('custom-cost-silver').value || '0', 10);
    const bronze = parseInt(document.getElementById('custom-cost-bronze').value || '0', 10);
    const note = document.getElementById('custom-reward-note').value.trim();

    if (!name) {
      alert('Please enter a reward name!');
      return;
    }

    if (gold <= 0 && silver <= 0 && bronze <= 0) {
      alert('Please deduct at least 1 star!');
      return;
    }

    if ((this.data.bank.gold || 0) < gold ||
        (this.data.bank.silver || 0) < silver ||
        (this.data.bank.bronze || 0) < bronze) {
      window.soundController.playReject();
      alert('Not enough stars in child\'s bank for this deduction!');
      return;
    }

    this.data.bank.gold -= gold;
    this.data.bank.silver -= silver;
    this.data.bank.bronze -= bronze;

    const pointsSpent = (gold * this.data.settings.starValues.gold) +
                        (silver * this.data.settings.starValues.silver) +
                        (bronze * this.data.settings.starValues.bronze);

    this.data.cashOutLog.unshift({
      id: `cash_${Date.now()}`,
      rewardName: name,
      icon: '🎁',
      starsSpent: { gold, silver, bronze },
      totalPoints: pointsSpent,
      note: note || 'Custom reward redemption',
      timestamp: Date.now()
    });

    // Record into Bank Transaction Ledger
    this.recordLedgerTransaction({
      type: 'DEBIT',
      action: 'Custom Reward Cashed Out',
      description: name,
      barcode: 'CUSTOM-CASHOUT',
      icon: '🎁',
      delta: { gold: -gold, silver: -silver, bronze: -bronze },
      pointDelta: -pointsSpent,
      notes: note || 'Custom reward redemption'
    });

    this.saveData();
    this.closeModal('modal-custom-cashout');
    window.soundController.playCashOut();
    this.showToast(`Cashed out "${name}"!`, 'success');
  }

  handleManualStarSubmit() {
    const tier = document.getElementById('manual-star-tier').value;
    const count = parseInt(document.getElementById('manual-star-count').value || '1', 10);
    const note = document.getElementById('manual-star-note').value.trim();

    if (!this.data.bank[tier]) this.data.bank[tier] = 0;
    this.data.bank[tier] += count;

    // Record into Bank Transaction Ledger
    const starVals = this.data.settings.starValues || { gold: 4, silver: 2, bronze: 1 };
    this.recordLedgerTransaction({
      type: 'CREDIT',
      action: 'Parent Bonus Star',
      description: note || `Parent Bonus (${count}x ${tier} star)`,
      barcode: 'MANUAL-BONUS',
      icon: '🎁',
      delta: {
        gold: tier === 'gold' ? count : 0,
        silver: tier === 'silver' ? count : 0,
        bronze: tier === 'bronze' ? count : 0
      },
      pointDelta: count * (starVals[tier] || 1),
      notes: 'Direct gift by Parent'
    });

    this.data.history.unshift({
      id: `hist_${Date.now()}`,
      type: 'approved',
      reason: note || `Parent Bonus (${count}x ${tier} star)`,
      icon: '🎁',
      tier: tier,
      barcode: 'MANUAL-BONUS',
      timestamp: Date.now()
    });

    this.saveData();
    this.closeModal('modal-manual-star');
    window.soundController.playStarChime(tier);
    this.showToast(`Gifted +${count} ${tier} star(s) to ${this.data.settings.childName}! ⭐`, 'success');
  }

  saveParentSettings() {
    const childNameInput = document.getElementById('setting-child-name').value.trim();
    const pinInput = document.getElementById('setting-parent-pin').value.trim();
    const pinEnabled = document.getElementById('setting-pin-toggle').checked;

    if (childNameInput) {
      this.data.settings.childName = childNameInput;
    }

    if (pinInput && pinInput.length === 4) {
      this.data.settings.parentPin = pinInput;
    } else if (pinInput && pinInput.length !== 4) {
      alert('PIN must be 4 numbers!');
      return;
    }

    this.data.settings.pinEnabled = pinEnabled;
    this.saveData();
    window.soundController.playPop();
    this.showToast('Parent settings saved!', 'success');
  }

  // --- Kid Quick Tier Starters ---
  startTierChore(tier, reason, icon, code) {
    window.soundController.playPop();
    this.currentScanData = {
      barcode: code || `CHORE-${tier.toUpperCase()}`,
      name: `${reason} (${tier.toUpperCase()})`,
      icon: icon || '⭐',
      source: 'Quick Tier Starter'
    };
    this.selectedReason = {
      text: reason,
      icon: icon || '⭐',
      defaultTier: tier
    };
    this.selectedTier = tier;

    window.soundController.playStarChime(tier);
    if (window.confettiEngine) {
      window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 50, 'stars');
    }
    this.confirmAndSubmitPendingStar(tier);
  }

  openTierChoreModal(tier) {
    window.soundController.playPop();
    this.currentScanData = {
      barcode: `CHORE-${tier.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: `${tier.toUpperCase()} Star Activity`,
      icon: this.getTierIcon(tier),
      source: 'Tier Selector'
    };
    this.openReasonModal();
  }

  // --- Star Exchange / Level Up Station ---
  exchangeStars(type) {
    if (type === 'bronze-to-silver') {
      const currentBronze = this.data.bank.bronze || 0;
      if (currentBronze < 2) {
        window.soundController.playReject();
        this.showToast(`Need 2 Bronze Stars to upgrade (you have ${currentBronze})! 🥉`, 'error');
        return;
      }
      this.data.bank.bronze -= 2;
      this.data.bank.silver = (this.data.bank.silver || 0) + 1;

      this.data.history.unshift({
        id: `hist_${Date.now()}`,
        type: 'approved',
        reason: '⭐ Level Up: Exchanged 2 Bronze Stars ➔ 1 Silver Star!',
        icon: '🥈',
        tier: 'silver',
        barcode: 'EXCHANGE-BRONZE-SILVER',
        timestamp: Date.now()
      });

      // Record into Bank Transaction Ledger
      this.recordLedgerTransaction({
        type: 'TRANSFER',
        action: 'Star Upgrade Transfer',
        description: 'Upgraded 2 Bronze ➔ 1 Silver Star',
        barcode: 'EXCHANGE-BRONZE-SILVER',
        icon: '🥈',
        delta: { gold: 0, silver: 1, bronze: -2 },
        pointDelta: 0,
        notes: 'Level Up in Star Exchange (-2 Bronze, +1 Silver)'
      });

      this.saveData();
      if (window.soundController.playExchange) {
        window.soundController.playExchange();
      } else {
        window.soundController.playStarChime('silver');
      }
      if (window.confettiEngine) {
        window.confettiEngine.celebrateBig();
      }
      this.showToast('Level Up! 2 Bronze converted into 1 Silver Star! 🥈', 'success');
    } else if (type === 'silver-to-gold') {
      const currentSilver = this.data.bank.silver || 0;
      if (currentSilver < 2) {
        window.soundController.playReject();
        this.showToast(`Need 2 Silver Stars to upgrade (you have ${currentSilver})! 🥈`, 'error');
        return;
      }
      this.data.bank.silver -= 2;
      this.data.bank.gold = (this.data.bank.gold || 0) + 1;

      this.data.history.unshift({
        id: `hist_${Date.now()}`,
        type: 'approved',
        reason: '🌟 Super Level Up: Exchanged 2 Silver Stars ➔ 1 Gold Star!',
        icon: '🥇',
        tier: 'gold',
        barcode: 'EXCHANGE-SILVER-GOLD',
        timestamp: Date.now()
      });

      // Record into Bank Transaction Ledger
      this.recordLedgerTransaction({
        type: 'TRANSFER',
        action: 'Star Upgrade Transfer',
        description: 'Upgraded 2 Silver ➔ 1 Gold Star',
        barcode: 'EXCHANGE-SILVER-GOLD',
        icon: '🥇',
        delta: { gold: 1, silver: -2, bronze: 0 },
        pointDelta: 0,
        notes: 'Level Up in Star Exchange (-2 Silver, +1 Gold)'
      });

      this.saveData();
      if (window.soundController.playExchange) {
        window.soundController.playExchange();
      } else {
        window.soundController.playFanfare();
      }
      if (window.confettiEngine) {
        window.confettiEngine.celebrateBig();
      }
      this.showToast('Super Level Up! 2 Silver converted into 1 Gold Star! 🥇', 'success');
    } else if (type === 'gold-to-silver') {
      const currentGold = this.data.bank.gold || 0;
      if (currentGold < 1) {
        window.soundController.playReject();
        this.showToast(`Need 1 Gold Star to break down into Silver (you have ${currentGold})! 🥇`, 'error');
        return;
      }
      this.data.bank.gold -= 1;
      this.data.bank.silver = (this.data.bank.silver || 0) + 2;

      this.data.history.unshift({
        id: `hist_${Date.now()}`,
        type: 'approved',
        reason: '🔄 Change Breakdown: 1 Gold Star ➔ 2 Silver Stars!',
        icon: '🥈',
        tier: 'silver',
        barcode: 'BREAK-GOLD-SILVER',
        timestamp: Date.now()
      });

      // Record into Bank Transaction Ledger
      this.recordLedgerTransaction({
        type: 'TRANSFER',
        action: 'Currency Breakdown Transfer',
        description: 'Broke 1 Gold ➔ 2 Silver Stars',
        barcode: 'BREAK-GOLD-SILVER',
        icon: '🥈',
        delta: { gold: -1, silver: 2, bronze: 0 },
        pointDelta: 0,
        notes: 'Currency Breakdown in Star Exchange (-1 Gold, +2 Silver)'
      });

      this.saveData();
      if (window.soundController.playExchange) {
        window.soundController.playExchange();
      } else {
        window.soundController.playStarChime('silver');
      }
      this.showToast('Exchanged! 1 Gold broken down into 2 Silver Stars! 🥈🥈', 'success');
    } else if (type === 'silver-to-bronze') {
      const currentSilver = this.data.bank.silver || 0;
      if (currentSilver < 1) {
        window.soundController.playReject();
        this.showToast(`Need 1 Silver Star to break down into Bronze (you have ${currentSilver})! 🥈`, 'error');
        return;
      }
      this.data.bank.silver -= 1;
      this.data.bank.bronze = (this.data.bank.bronze || 0) + 2;

      this.data.history.unshift({
        id: `hist_${Date.now()}`,
        type: 'approved',
        reason: '🔄 Change Breakdown: 1 Silver Star ➔ 2 Bronze Stars!',
        icon: '🥉',
        tier: 'bronze',
        barcode: 'BREAK-SILVER-BRONZE',
        timestamp: Date.now()
      });

      // Record into Bank Transaction Ledger
      this.recordLedgerTransaction({
        type: 'TRANSFER',
        action: 'Currency Breakdown Transfer',
        description: 'Broke 1 Silver ➔ 2 Bronze Stars',
        barcode: 'BREAK-SILVER-BRONZE',
        icon: '🥉',
        delta: { gold: 0, silver: -1, bronze: 2 },
        pointDelta: 0,
        notes: 'Currency Breakdown in Star Exchange (-1 Silver, +2 Bronze)'
      });

      this.saveData();
      if (window.soundController.playExchange) {
        window.soundController.playExchange();
      } else {
        window.soundController.playStarChime('bronze');
      }
      this.showToast('Exchanged! 1 Silver broken down into 2 Bronze Stars! 🥉🥉', 'success');
    }
  }

  // --- Parent: Starting & Current Balances Form ---
  handleStartingBalancesSubmit() {
    const gold = parseInt(document.getElementById('input-balance-gold').value || '0', 10);
    const silver = parseInt(document.getElementById('input-balance-silver').value || '0', 10);
    const bronze = parseInt(document.getElementById('input-balance-bronze').value || '0', 10);

    if (isNaN(gold) || isNaN(silver) || isNaN(bronze) || gold < 0 || silver < 0 || bronze < 0) {
      alert('Star counts must be valid positive numbers!');
      return;
    }

    const oldGold = this.data.bank.gold || 0;
    const oldSilver = this.data.bank.silver || 0;
    const oldBronze = this.data.bank.bronze || 0;
    const oldPoints = this.calculatePoints();

    this.data.bank.gold = gold;
    this.data.bank.silver = silver;
    this.data.bank.bronze = bronze;

    this.data.history.unshift({
      id: `hist_${Date.now()}`,
      type: 'approved',
      reason: `Parent updated star balances (Gold: ${gold}, Silver: ${silver}, Bronze: ${bronze})`,
      icon: '⚖️',
      tier: 'gold',
      barcode: 'PARENT-BALANCE-UPDATE',
      timestamp: Date.now()
    });

    this.recordLedgerTransaction({
      type: 'ADJUSTMENT',
      action: 'Balance Adjustment',
      description: 'Parent adjusted star balances',
      barcode: 'PARENT-BALANCE-UPDATE',
      icon: '⚖️',
      delta: {
        gold: gold - oldGold,
        silver: silver - oldSilver,
        bronze: bronze - oldBronze
      },
      pointDelta: this.calculatePoints() - oldPoints,
      notes: `Set to: ${gold} Gold, ${silver} Silver, ${bronze} Bronze`
    });

    this.saveData();
    window.soundController.playStarChime('gold');
    this.showToast(`Saved Star Balances! (${gold} Gold, ${silver} Silver, ${bronze} Bronze) ⭐`, 'success');
  }

  // --- Render UI ---
  render() {
    this.renderKidView();
    this.renderParentView();
  }

  renderKidView() {
    // Child's Name Header
    const childNameElem = document.getElementById('display-child-name');
    if (childNameElem) {
      childNameElem.textContent = `${this.data.settings.childName}'s Star Rewards`;
    }

    // Kid Bank Balance
    const goldCount = document.getElementById('kid-bank-gold');
    const silverCount = document.getElementById('kid-bank-silver');
    const bronzeCount = document.getElementById('kid-bank-bronze');
    const pointsCount = document.getElementById('kid-bank-points');

    if (goldCount) goldCount.textContent = this.data.bank.gold || 0;
    if (silverCount) silverCount.textContent = this.data.bank.silver || 0;
    if (bronzeCount) bronzeCount.textContent = this.data.bank.bronze || 0;
    if (pointsCount) pointsCount.textContent = this.calculatePoints();

    // Star Exchange Station UI update
    const bankB = this.data.bank.bronze || 0;
    const bankS = this.data.bank.silver || 0;
    const bankG = this.data.bank.gold || 0;

    const exBoxB = document.getElementById('exchange-box-bronze');
    const exBtnB = document.getElementById('btn-exchange-bronze-silver');
    const exHintB = document.getElementById('exchange-bronze-hint');

    if (exBtnB) {
      if (bankB >= 2) {
        exBtnB.disabled = false;
        exBtnB.className = 'btn-exchange ready';
        exBtnB.textContent = 'Trade for Silver 🥈 (+1)';
        if (exBoxB) exBoxB.classList.add('ready');
        if (exHintB) exHintB.innerHTML = `<span class="text-emerald-600 font-bold">Ready! You have ${bankB} Bronze stars.</span>`;
      } else {
        exBtnB.disabled = true;
        exBtnB.className = 'btn-exchange disabled';
        exBtnB.textContent = 'Need 2 Bronze';
        if (exBoxB) exBoxB.classList.remove('ready');
        if (exHintB) exHintB.innerHTML = `<span class="text-slate-500">Have ${bankB}/2 Bronze (${2 - bankB} more needed)</span>`;
      }
    }

    const exBoxS = document.getElementById('exchange-box-silver');
    const exBtnS = document.getElementById('btn-exchange-silver-gold');
    const exHintS = document.getElementById('exchange-silver-hint');

    if (exBtnS) {
      if (bankS >= 2) {
        exBtnS.disabled = false;
        exBtnS.className = 'btn-exchange ready';
        exBtnS.textContent = 'Trade for Gold 🥇 (+1)';
        if (exBoxS) exBoxS.classList.add('ready');
        if (exHintS) exHintS.innerHTML = `<span class="text-emerald-600 font-bold">Ready! You have ${bankS} Silver stars.</span>`;
      } else {
        exBtnS.disabled = true;
        exBtnS.className = 'btn-exchange disabled';
        exBtnS.textContent = 'Need 2 Silver';
        if (exBoxS) exBoxS.classList.remove('ready');
        if (exHintS) exHintS.innerHTML = `<span class="text-slate-500">Have ${bankS}/2 Silver (${2 - bankS} more needed)</span>`;
      }
    }

    // Change Breakdown Station UI update
    const exBoxGbrk = document.getElementById('exchange-box-gold-break');
    const exBtnGbrk = document.getElementById('btn-exchange-gold-silver');
    const exHintGbrk = document.getElementById('exchange-gold-break-hint');
    if (exBtnGbrk) {
      if (bankG >= 1) {
        exBtnGbrk.disabled = false;
        exBtnGbrk.className = 'btn-exchange ready';
        exBtnGbrk.textContent = 'Break to 2 Silver 🥈';
        if (exBoxGbrk) exBoxGbrk.classList.add('ready');
        if (exHintGbrk) exHintGbrk.innerHTML = `<span class="text-emerald-600 font-bold">Ready! You have ${bankG} Gold.</span>`;
      } else {
        exBtnGbrk.disabled = true;
        exBtnGbrk.className = 'btn-exchange disabled';
        exBtnGbrk.textContent = 'Need 1 Gold';
        if (exBoxGbrk) exBoxGbrk.classList.remove('ready');
        if (exHintGbrk) exHintGbrk.innerHTML = `<span class="text-slate-500">Need 1 Gold star to break</span>`;
      }
    }

    const exBoxSbrk = document.getElementById('exchange-box-silver-break');
    const exBtnSbrk = document.getElementById('btn-exchange-silver-bronze');
    const exHintSbrk = document.getElementById('exchange-silver-break-hint');
    if (exBtnSbrk) {
      if (bankS >= 1) {
        exBtnSbrk.disabled = false;
        exBtnSbrk.className = 'btn-exchange ready';
        exBtnSbrk.textContent = 'Break to 2 Bronze 🥉';
        if (exBoxSbrk) exBoxSbrk.classList.add('ready');
        if (exHintSbrk) exHintSbrk.innerHTML = `<span class="text-emerald-600 font-bold">Ready! You have ${bankS} Silver.</span>`;
      } else {
        exBtnSbrk.disabled = true;
        exBtnSbrk.className = 'btn-exchange disabled';
        exBtnSbrk.textContent = 'Need 1 Silver';
        if (exBoxSbrk) exBoxSbrk.classList.remove('ready');
        if (exHintSbrk) exHintSbrk.innerHTML = `<span class="text-slate-500">Need 1 Silver star to break</span>`;
      }
    }

    // Pending Stars Box for Kid
    const pendingList = document.getElementById('kid-pending-stars-list');
    const pendingCountBadge = document.getElementById('kid-pending-count-badge');
    const pendingStars = this.data.pendingStars || [];

    if (pendingCountBadge) {
      pendingCountBadge.textContent = pendingStars.length;
      pendingCountBadge.style.display = pendingStars.length > 0 ? 'inline-flex' : 'none';
    }

    if (pendingList) {
      if (pendingStars.length === 0) {
        pendingList.innerHTML = `
          <div class="empty-state">
            <span class="text-4xl">🌟</span>
            <p class="font-bold text-slate-700 mt-2">All caught up!</p>
            <p class="text-xs text-slate-500">Scan a barcode when you complete a chore to earn stars!</p>
          </div>
        `;
      } else {
        pendingList.innerHTML = pendingStars.map(star => `
          <div class="pending-star-item tier-${star.tier}">
            <div class="star-left">
              <span class="star-icon">${this.getTierIcon(star.tier)}</span>
              <div>
                <div class="font-bold text-slate-800 text-sm">${star.icon} ${star.reason}</div>
                <div class="text-xs text-slate-500 flex items-center gap-1">
                  <span>${star.barcodeName || star.barcode}</span> • 
                  <span data-timestamp="${star.timestamp}">${this.formatRelativeTime(star.timestamp)}</span>
                </div>
              </div>
            </div>
            <div class="pending-status-pill">
              <span class="pulse-dot"></span> Waiting for Approval
            </div>
          </div>
        `).join('');
      }
    }

    // Render Kid's Star Passbook / Transaction Book
    this.renderKidPassbook();
  }

  // --- Kid's Star Passbook / Transaction Book Renderer ---
  renderKidPassbook() {
    const container = document.getElementById('kid-passbook-stream-container');
    const emptyState = document.getElementById('kid-passbook-empty-state');
    const countElem = document.getElementById('kid-passbook-count-text');
    const titleNameElem = document.getElementById('kid-passbook-title-name');
    const statEarned = document.getElementById('kid-passbook-stat-earned');
    const statSpent = document.getElementById('kid-passbook-stat-spent');
    const statUpgrades = document.getElementById('kid-passbook-stat-upgrades');

    if (titleNameElem) {
      titleNameElem.textContent = this.data.settings.childName || 'Alex';
    }

    const ledger = this.data.ledger || [];

    // Calculate kid passbook stats
    let starsEarnedCount = 0;
    let treatsRedeemedCount = 0;
    let upgradesCount = 0;

    ledger.forEach(tx => {
      if (tx.type === 'CREDIT') {
        const g = (tx.delta && tx.delta.gold) || 0;
        const s = (tx.delta && tx.delta.silver) || 0;
        const b = (tx.delta && tx.delta.bronze) || 0;
        starsEarnedCount += (g + s + b);
      } else if (tx.type === 'DEBIT') {
        treatsRedeemedCount += 1;
      } else if (tx.type === 'TRANSFER' || tx.type === 'ADJUSTMENT') {
        upgradesCount += 1;
      }
    });

    if (statEarned) statEarned.textContent = `+${starsEarnedCount}`;
    if (statSpent) statSpent.textContent = `${treatsRedeemedCount}`;
    if (statUpgrades) statUpgrades.textContent = `${upgradesCount}`;

    if (!container) return;

    // Filter transactions
    const filter = this.activeKidPassbookFilter || 'all';
    const filtered = ledger.filter(tx => {
      if (filter === 'credits') return tx.type === 'CREDIT';
      if (filter === 'debits') return tx.type === 'DEBIT';
      if (filter === 'transfers') return tx.type === 'TRANSFER' || tx.type === 'ADJUSTMENT';
      return true;
    });

    if (countElem) {
      countElem.textContent = `Showing ${filtered.length} of ${ledger.length} entries`;
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      container.innerHTML = filtered.map((tx, idx) => {
        let typeBadgeClass = 'credit';
        let typeBadgeText = '⭐ Star Earned';
        let stampClass = 'stamp-approved';
        let stampText = '✓ APPROVED';
        let pointClass = 'text-emerald-600';

        if (tx.type === 'DEBIT') {
          typeBadgeClass = 'debit';
          typeBadgeText = '🍦 Treat Redeemed';
          stampClass = 'stamp-redeemed';
          stampText = '🎉 REDEEMED';
          pointClass = 'text-rose-600';
        } else if (tx.type === 'TRANSFER') {
          typeBadgeClass = 'transfer';
          typeBadgeText = '🚀 Level Up';
          stampClass = 'stamp-upgrade';
          stampText = '⚡ LEVEL UP';
          pointClass = 'text-purple-600';
        } else if (tx.type === 'ADJUSTMENT') {
          typeBadgeClass = 'transfer';
          typeBadgeText = '⚖️ Balance Update';
          stampClass = 'stamp-upgrade';
          stampText = '⚖️ ADJUSTED';
          pointClass = 'text-amber-600';
        }

        const deltas = [];
        if (tx.delta) {
          if (tx.delta.gold) deltas.push(`${tx.delta.gold > 0 ? '+' : ''}${tx.delta.gold} 🥇`);
          if (tx.delta.silver) deltas.push(`${tx.delta.silver > 0 ? '+' : ''}${tx.delta.silver} 🥈`);
          if (tx.delta.bronze) deltas.push(`${tx.delta.bronze > 0 ? '+' : ''}${tx.delta.bronze} 🥉`);
        }
        const deltaStr = deltas.length > 0 ? deltas.join(', ') : (tx.pointDelta > 0 ? `+${tx.pointDelta} pts` : `${tx.pointDelta} pts`);
        const pointSign = tx.pointDelta > 0 ? `+${tx.pointDelta}` : `${tx.pointDelta}`;

        const delay = Math.min(idx * 0.04, 0.45);

        return `
          <div class="kid-passbook-item passbook-type-${tx.type.toLowerCase()}" data-tx-id="${tx.txId}" style="animation-delay: ${delay}s" title="Tap to view official certificate">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="kid-passbook-icon-wrapper">
                  <span class="kid-passbook-icon">${tx.icon || '⭐'}</span>
                </div>
                <div>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="kid-passbook-badge ${typeBadgeClass}">${typeBadgeText}</span>
                    <span class="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-bold">${tx.barcode || 'N/A'}</span>
                    <span class="text-[11px] text-slate-400 font-bold" data-timestamp="${tx.timestamp}">${this.formatRelativeTime(tx.timestamp)}</span>
                  </div>
                  <h4 class="font-black text-slate-800 text-base md:text-lg font-kid mt-1 leading-snug">
                    ${tx.description}
                  </h4>
                  <div class="text-xs text-slate-500 font-medium mt-0.5">
                    ${tx.notes || tx.action}
                  </div>
                </div>
              </div>

              <div class="text-right flex flex-col items-end shrink-0">
                <div class="kid-passbook-delta ${pointClass}">
                  ${deltaStr}
                </div>
                <div class="kid-passbook-pts ${pointClass}">
                  ${pointSign} pts
                </div>
                <div class="kid-passbook-stamp ${stampClass}">
                  ${stampText}
                </div>
              </div>
            </div>

            <div class="kid-passbook-card-footer mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5 font-bold text-slate-600 bg-amber-50/70 px-2.5 py-1 rounded-xl border border-amber-200/60">
                <span class="text-amber-600 font-black">🏦 Balance:</span>
                <span>${tx.balanceAfter ? (tx.balanceAfter.gold || 0) : 0}🥇</span>
                <span>${tx.balanceAfter ? (tx.balanceAfter.silver || 0) : 0}🥈</span>
                <span>${tx.balanceAfter ? (tx.balanceAfter.bronze || 0) : 0}🥉</span>
                <span class="text-amber-800 font-black">(${tx.balanceAfter ? (tx.balanceAfter.points || 0) : 0} pts)</span>
              </div>
              <button class="btn-view-receipt text-xs font-black text-amber-700 hover:text-amber-900 bg-amber-100/80 hover:bg-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1 transition transform active:scale-95" data-tx-id="${tx.txId}">
                <span>📜</span> <span>View Stamp</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // --- Kid's Official Receipt Modal ---
  openKidReceiptModal(txId) {
    const tx = (this.data.ledger || []).find(t => t.txId === txId);
    if (!tx) return;

    const iconContainer = document.getElementById('kid-receipt-icon-container');
    const badgeElem = document.getElementById('kid-receipt-badge');
    const titleElem = document.getElementById('kid-receipt-title');
    const barcodeElem = document.getElementById('kid-receipt-barcode');
    const txIdElem = document.getElementById('kid-receipt-tx-id');
    const timeElem = document.getElementById('kid-receipt-time');
    const deltaElem = document.getElementById('kid-receipt-delta');
    const balanceElem = document.getElementById('kid-receipt-balance');
    const stampElem = document.getElementById('kid-receipt-stamp');
    const acctNumElem = document.getElementById('kid-receipt-acct-num');

    if (acctNumElem) {
      acctNumElem.textContent = `Account: ${this.data.settings.accountNumber || `ACCT-7734-${(this.data.settings.childName || 'ALEX').toUpperCase()}`}`;
    }

    if (iconContainer) iconContainer.textContent = tx.icon || '⭐';
    if (titleElem) titleElem.textContent = tx.description;
    if (barcodeElem) barcodeElem.textContent = `Barcode: ${tx.barcode || 'N/A'}`;
    if (txIdElem) txIdElem.textContent = tx.txId;
    if (timeElem) timeElem.textContent = this.formatDateTime(tx.timestamp);

    const deltas = [];
    if (tx.delta) {
      if (tx.delta.gold) deltas.push(`${tx.delta.gold > 0 ? '+' : ''}${tx.delta.gold} 🥇`);
      if (tx.delta.silver) deltas.push(`${tx.delta.silver > 0 ? '+' : ''}${tx.delta.silver} 🥈`);
      if (tx.delta.bronze) deltas.push(`${tx.delta.bronze > 0 ? '+' : ''}${tx.delta.bronze} 🥉`);
    }
    const deltaStr = deltas.length > 0 ? deltas.join(', ') : `${tx.pointDelta > 0 ? '+' : ''}${tx.pointDelta} pts`;
    const pointSign = tx.pointDelta > 0 ? `+${tx.pointDelta}` : `${tx.pointDelta}`;

    if (deltaElem) {
      deltaElem.textContent = `${deltaStr} (${pointSign} pts)`;
      deltaElem.className = tx.type === 'CREDIT' ? 'font-extrabold text-emerald-600 text-sm' : (tx.type === 'DEBIT' ? 'font-extrabold text-rose-600 text-sm' : 'font-extrabold text-purple-600 text-sm');
    }

    if (balanceElem) {
      balanceElem.textContent = `${tx.balanceAfter ? tx.balanceAfter.gold : 0}🥇 ${tx.balanceAfter ? tx.balanceAfter.silver : 0}🥈 ${tx.balanceAfter ? tx.balanceAfter.bronze : 0}🥉 (${tx.balanceAfter ? tx.balanceAfter.points : 0} pts)`;
    }

    if (badgeElem) {
      if (tx.type === 'CREDIT') {
        badgeElem.innerHTML = `<span class="kid-passbook-badge credit">⭐ CHORE APPROVED BY PARENT</span>`;
      } else if (tx.type === 'DEBIT') {
        badgeElem.innerHTML = `<span class="kid-passbook-badge debit">🍦 REWARD CASHED OUT</span>`;
      } else {
        badgeElem.innerHTML = `<span class="kid-passbook-badge transfer">🚀 LEVEL UP / BREAKDOWN</span>`;
      }
    }

    if (stampElem) {
      if (tx.type === 'CREDIT') {
        stampElem.className = 'kid-rubber-stamp approved';
        stampElem.textContent = '✓ OFFICIAL CHORE APPROVED';
      } else if (tx.type === 'DEBIT') {
        stampElem.className = 'kid-rubber-stamp redeemed';
        stampElem.textContent = '🎉 REWARD UNLOCKED';
      } else {
        stampElem.className = 'kid-rubber-stamp upgrade';
        stampElem.textContent = '⚡ STAR LEVEL UP';
      }
    }

    if (window.soundController) {
      if (tx.type === 'CREDIT') {
        window.soundController.playStarChime(tx.delta && tx.delta.gold ? 'gold' : 'silver');
        if (window.confettiEngine) window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 25, 'stars');
      } else if (tx.type === 'DEBIT') {
        window.soundController.playCashOut();
      } else {
        window.soundController.playPop();
      }
    }

    this.openModal('modal-kid-receipt');
  }

  switchParentTab(tab) {
    this.activeParentTab = tab;
    document.querySelectorAll('.parent-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('.parent-tab-pane').forEach(pane => {
      if (pane.id === `tab-${tab}`) {
        pane.classList.remove('hidden');
      } else {
        pane.classList.add('hidden');
      }
    });

    if (tab === 'tokens') {
      this.renderPrintableChoreCards();
    } else if (tab === 'statement') {
      this.renderBankStatement();
    } else if (tab === 'debug') {
      this.renderDebugPanel();
    } else if (tab === 'sync') {
      this.renderSyncPanel();
    }
  }

  renderSyncPanel() {
    const codeElem = document.getElementById('display-sync-code-text');
    if (codeElem) {
      codeElem.value = this.generateSyncCode();
    }
  }

  renderParentView() {
    // Badges & Counters
    const pendingBadge = document.getElementById('parent-pending-count');
    const pendingCount = (this.data.pendingStars || []).length;
    if (pendingBadge) {
      pendingBadge.textContent = pendingCount;
      pendingBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }

    // Tab 1: Pending Approvals Pane
    const pendingContainer = document.getElementById('parent-pending-items-container');
    const approveAllBtn = document.getElementById('btn-approve-all-pending');
    if (approveAllBtn) {
      approveAllBtn.style.display = pendingCount > 1 ? 'inline-flex' : 'none';
    }

    if (pendingContainer) {
      if (pendingCount === 0) {
        pendingContainer.innerHTML = `
          <div class="p-8 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <span class="text-5xl">✨</span>
            <h3 class="text-lg font-bold text-slate-700 mt-3">No pending star requests</h3>
            <p class="text-sm text-slate-500">When your child scans a barcode, their request will appear here for you to approve.</p>
          </div>
        `;
      } else {
        pendingContainer.innerHTML = this.data.pendingStars.map(star => `
          <div class="pending-card" id="card-${star.id}">
            <div class="card-info">
              <div class="flex items-center gap-2">
                <span class="tier-chip ${star.tier}">
                  ${this.getTierIcon(star.tier)} ${star.tier.toUpperCase()} STAR
                </span>
                <span class="text-xs text-slate-400" data-timestamp="${star.timestamp}">
                  ${this.formatDateTime(star.timestamp)} (${this.formatRelativeTime(star.timestamp)})
                </span>
              </div>
              <h4 class="font-extrabold text-slate-800 text-lg mt-1 flex items-center gap-2">
                <span>${star.icon}</span> <span>${star.reason}</span>
              </h4>
              <p class="text-xs text-slate-500 font-mono mt-0.5">
                Barcode: <span class="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">${star.barcode}</span> • ${star.barcodeName || 'Scanned item'}
              </p>
            </div>
            <div class="card-actions">
              <div class="flex items-center gap-2">
                <select class="tier-adjust-select text-xs font-semibold rounded-lg px-2 py-1.5 border border-slate-300" data-star-id="${star.id}">
                  <option value="gold" ${star.tier === 'gold' ? 'selected' : ''}>Gold Star (4 pts)</option>
                  <option value="silver" ${star.tier === 'silver' ? 'selected' : ''}>Silver Star (2 pts)</option>
                  <option value="bronze" ${star.tier === 'bronze' ? 'selected' : ''}>Bronze Star (1 pt)</option>
                </select>
                <button class="btn-approve-star btn-action-approve" data-star-id="${star.id}">
                  ✓ Approve
                </button>
                <button class="btn-reject-star btn-action-reject" data-star-id="${star.id}">
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        `).join('');

        // Attach event listeners to approve/reject buttons
        pendingContainer.querySelectorAll('.btn-approve-star').forEach(b => {
          b.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-star-id');
            const select = pendingContainer.querySelector(`.tier-adjust-select[data-star-id="${id}"]`);
            const tier = select ? select.value : null;
            this.approveStar(id, tier);
          });
        });

        pendingContainer.querySelectorAll('.btn-reject-star').forEach(b => {
          b.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-star-id');
            if (confirm('Decline this star request?')) {
              this.rejectStar(id);
            }
          });
        });
      }
    }

    // Tab 2: Bank & Cash Out
    const pGold = document.getElementById('parent-bank-gold');
    const pSilver = document.getElementById('parent-bank-silver');
    const pBronze = document.getElementById('parent-bank-bronze');
    const pPoints = document.getElementById('parent-bank-points');

    if (pGold) pGold.textContent = this.data.bank.gold || 0;
    if (pSilver) pSilver.textContent = this.data.bank.silver || 0;
    if (pBronze) pBronze.textContent = this.data.bank.bronze || 0;
    if (pPoints) pPoints.textContent = this.calculatePoints();

    // Populate Starting Balances Form Inputs
    const inGold = document.getElementById('input-balance-gold');
    const inSilver = document.getElementById('input-balance-silver');
    const inBronze = document.getElementById('input-balance-bronze');

    if (inGold && document.activeElement !== inGold) inGold.value = this.data.bank.gold || 0;
    if (inSilver && document.activeElement !== inSilver) inSilver.value = this.data.bank.silver || 0;
    if (inBronze && document.activeElement !== inBronze) inBronze.value = this.data.bank.bronze || 0;

    // Rewards Catalog Grid
    const rewardGrid = document.getElementById('rewards-catalog-grid');
    if (rewardGrid) {
      rewardGrid.innerHTML = (this.data.customRewards || []).map(r => {
        const costG = r.cost.gold || 0;
        const costS = r.cost.silver || 0;
        const costB = r.cost.bronze || 0;

        const canAfford = (this.data.bank.gold >= costG) &&
                          (this.data.bank.silver >= costS) &&
                          (this.data.bank.bronze >= costB);

        const costBadges = [];
        if (costG > 0) costBadges.push(`<span class="cost-badge gold">${costG} 🥇</span>`);
        if (costS > 0) costBadges.push(`<span class="cost-badge silver">${costS} 🥈</span>`);
        if (costB > 0) costBadges.push(`<span class="cost-badge bronze">${costB} 🥉</span>`);

        return `
          <div class="reward-catalog-card ${canAfford ? 'affordable' : 'unaffordable'}">
            <div class="flex items-start justify-between">
              <span class="text-3xl">${r.icon || '🎁'}</span>
              <div class="flex gap-1">${costBadges.join('')}</div>
            </div>
            <h4 class="font-bold text-slate-800 mt-2">${r.name}</h4>
            <div class="mt-4">
              <button class="btn-cashout-reward w-full py-2 px-3 rounded-xl font-bold text-sm ${canAfford ? 'bg-amber-500 hover:bg-amber-600 text-white shadow' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}"
                      data-reward-id="${r.id}" ${canAfford ? '' : 'disabled'}>
                ${canAfford ? '🪙 Redeem / Cash Out' : 'Need More Stars'}
              </button>
            </div>
          </div>
        `;
      }).join('');

      rewardGrid.querySelectorAll('.btn-cashout-reward').forEach(b => {
        b.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-reward-id');
          this.cashOutReward(id);
        });
      });
    }

    // Tab 3: History & Cash-Out Audit Log
    const cashOutLogElem = document.getElementById('cashout-history-log');
    if (cashOutLogElem) {
      const logs = this.data.cashOutLog || [];
      if (logs.length === 0) {
        cashOutLogElem.innerHTML = `<div class="text-slate-400 text-sm text-center py-6">No rewards cashed out yet.</div>`;
      } else {
        cashOutLogElem.innerHTML = logs.map(l => {
          const spent = [];
          if (l.starsSpent.gold) spent.push(`${l.starsSpent.gold} Gold`);
          if (l.starsSpent.silver) spent.push(`${l.starsSpent.silver} Silver`);
          if (l.starsSpent.bronze) spent.push(`${l.starsSpent.bronze} Bronze`);
          return `
            <div class="history-item">
              <div class="flex items-center gap-3">
                <span class="text-2xl">${l.icon || '🎁'}</span>
                <div>
                  <div class="font-bold text-slate-800 text-sm">${l.rewardName}</div>
                  <div class="text-xs text-slate-500">${l.note || ''} • <span class="font-medium text-amber-600">${spent.join(', ')} (${l.totalPoints} pts)</span></div>
                </div>
              </div>
              <div class="text-xs text-slate-400 text-right">
                ${this.formatDateTime(l.timestamp)}<br>
                <span>${this.formatRelativeTime(l.timestamp)}</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Chores approval/rejection history
    const choreHistElem = document.getElementById('chores-approval-log');
    if (choreHistElem) {
      const hist = this.data.history || [];
      if (hist.length === 0) {
        choreHistElem.innerHTML = `<div class="text-slate-400 text-sm text-center py-6">No chore history recorded yet.</div>`;
      } else {
        choreHistElem.innerHTML = hist.map(h => `
          <div class="history-item">
            <div class="flex items-center gap-3">
              <span class="text-2xl">${h.icon || '⭐'}</span>
              <div>
                <div class="font-bold text-slate-800 text-sm">${h.reason}</div>
                <div class="text-xs text-slate-500">
                  <span class="capitalize font-semibold ${h.type === 'approved' ? 'text-emerald-600' : 'text-red-500'}">${h.type}</span> • 
                  <span class="capitalize">${h.tier} Star</span> ${h.barcode ? `(${h.barcode})` : ''}
                </div>
              </div>
            </div>
            <div class="text-xs text-slate-400 text-right">
              ${this.formatDateTime(h.timestamp)}
            </div>
          </div>
        `).join('');
      }
    }

    // Tab 5: Settings populate
    const childNameInput = document.getElementById('setting-child-name');
    const pinToggle = document.getElementById('setting-pin-toggle');
    if (childNameInput) childNameInput.value = this.data.settings.childName || 'Alex';
    if (pinToggle) pinToggle.checked = !!this.data.settings.pinEnabled;
  }

  // Render Printable / Displayable Chore Cards with real barcodes
  renderPrintableChoreCards() {
    const container = document.getElementById('chore-cards-printable-grid');
    if (!container || !window.barcodeGenerator) return;

    const cards = [
      { code: 'CHORE-ROOM-01', title: 'Clean My Room', icon: '🧹', desc: 'Bed made & floor cleared', tier: 'Gold' },
      { code: 'CHORE-HOMEWORK-02', title: 'Finish Homework', icon: '📚', desc: 'Worksheets & reading done', tier: 'Gold' },
      { code: 'CHORE-TEETH-03', title: 'Sparkly Teeth', icon: '🪥', desc: 'Brushed for 2 full minutes', tier: 'Silver' },
      { code: 'CHORE-VEGGIES-06', title: 'Eat All Veggies', icon: '🥦', desc: 'Finished greens at dinner', tier: 'Silver' },
      { code: 'ITEM-BOOK-07', title: 'Read 20 Minutes', icon: '📖', desc: 'Book or story chapter', tier: 'Silver' },
      { code: 'CHORE-HELP-08', title: 'Kind Helper', icon: '🤝', desc: 'Helped mom, dad, or sibling', tier: 'Gold' },
      { code: 'ITEM-TOY-09', title: 'Tidy Toy Box', icon: '🧸', desc: 'Toys stored in bins', tier: 'Bronze' },
      { code: 'CHORE-PET-05', title: 'Pet Care Hero', icon: '🐕', desc: 'Fed dog, cat, or fish', tier: 'Silver' },
      { code: 'CHORE-BED-10', title: 'Bedtime Champion', icon: '🌙', desc: 'In bed with lights out', tier: 'Bronze' },
      { code: 'MYSTERY-SCAN-99', title: 'Super Mystery Deed', icon: '⭐', desc: 'Any wonderful deed', tier: 'Surprise' }
    ];

    container.innerHTML = cards.map(c => `
      <div class="printable-chore-token" data-code="${c.code}">
        <div class="token-header">
          <span class="token-icon">${c.icon}</span>
          <div>
            <h4 class="token-title">${c.title}</h4>
            <p class="token-desc">${c.desc}</p>
          </div>
          <span class="token-tier-tag">${c.tier}</span>
        </div>
        <div class="token-barcode-box" id="barcode-box-${c.code.replace(/[^a-zA-Z0-9]/g, '')}">
          <!-- Barcode SVG inserted dynamically -->
        </div>
        <div class="token-footer">
          <span>Starbook Kids Reward Token</span>
          <button class="btn-test-scan-token text-xs text-indigo-600 font-bold hover:underline" data-code="${c.code}">
            ▶ Test Scan
          </button>
        </div>
      </div>
    `).join('');

    // Generate barcodes for each card
    cards.forEach(c => {
      const boxId = `barcode-box-${c.code.replace(/[^a-zA-Z0-9]/g, '')}`;
      const elem = document.getElementById(boxId);
      if (elem) {
        elem.innerHTML = window.barcodeGenerator.generateSVG(c.code, {
          height: 48,
          narrowWidth: 1.8,
          wideWidth: 4,
          showText: true
        });
      }
    });

    // Test scan click listener
    container.querySelectorAll('.btn-test-scan-token').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const code = e.currentTarget.getAttribute('data-code');
        this.switchView('kid');
        window.starScanner.simulateScan(code);
      });
    });
  }

  // --- Bank Statement & Ledger Renderer ---
  renderBankStatement() {
    const listElem = document.getElementById('ledger-transactions-table-body');
    const emptyElem = document.getElementById('ledger-empty-state');
    const searchInput = document.getElementById('input-statement-search');
    const activeFilterBtn = document.querySelector('.statement-filter-btn.active');
    const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    // Populate Account Summary
    const acctNumElem = document.getElementById('statement-account-number');
    const childNameElem = document.getElementById('statement-child-name');
    const balanceElem = document.getElementById('statement-balance-badge');
    const earnedElem = document.getElementById('statement-total-earned');
    const spentElem = document.getElementById('statement-total-spent');

    if (acctNumElem) acctNumElem.textContent = this.data.settings.accountNumber || `ACCT-7734-${(this.data.settings.childName || 'ALEX').toUpperCase()}`;
    if (childNameElem) childNameElem.textContent = `${this.data.settings.childName}'s Star Savings`;
    if (balanceElem) balanceElem.textContent = `${this.data.bank.gold || 0} Gold • ${this.data.bank.silver || 0} Silver • ${this.data.bank.bronze || 0} Bronze (${this.calculatePoints()} pts)`;

    const ledger = this.data.ledger || [];

    // Calculate lifetime earned & spent
    let totalEarnedPts = 0;
    let totalSpentPts = 0;

    ledger.forEach(tx => {
      if (tx.pointDelta > 0) totalEarnedPts += tx.pointDelta;
      if (tx.pointDelta < 0) totalSpentPts += Math.abs(tx.pointDelta);
    });

    if (earnedElem) earnedElem.textContent = `+${totalEarnedPts} pts`;
    if (spentElem) spentElem.textContent = `-${totalSpentPts} pts`;

    // Filter transactions
    const filtered = ledger.filter(tx => {
      if (filter === 'credits' && tx.type !== 'CREDIT') return false;
      if (filter === 'debits' && tx.type !== 'DEBIT') return false;
      if (filter === 'transfers' && tx.type !== 'TRANSFER' && tx.type !== 'ADJUSTMENT') return false;

      if (query) {
        const text = `${tx.txId} ${tx.description} ${tx.barcode} ${tx.action} ${tx.notes || ''}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });

    if (!listElem) return;

    if (filtered.length === 0) {
      listElem.innerHTML = '';
      if (emptyElem) emptyElem.classList.remove('hidden');
    } else {
      if (emptyElem) emptyElem.classList.add('hidden');
      listElem.innerHTML = filtered.map(tx => {
        let typeBadge = '';

        if (tx.type === 'CREDIT') {
          typeBadge = `<span class="tx-badge credit">+ DEPOSIT</span>`;
        } else if (tx.type === 'DEBIT') {
          typeBadge = `<span class="tx-badge debit">- WITHDRAWAL</span>`;
        } else if (tx.type === 'TRANSFER') {
          typeBadge = `<span class="tx-badge transfer">⇄ TRANSFER</span>`;
        } else {
          typeBadge = `<span class="tx-badge adjust">⚖️ ADJUSTMENT</span>`;
        }

        // Format Delta Currency
        const deltas = [];
        if (tx.delta) {
          if (tx.delta.gold) deltas.push(`${tx.delta.gold > 0 ? '+' : ''}${tx.delta.gold} 🥇`);
          if (tx.delta.silver) deltas.push(`${tx.delta.silver > 0 ? '+' : ''}${tx.delta.silver} 🥈`);
          if (tx.delta.bronze) deltas.push(`${tx.delta.bronze > 0 ? '+' : ''}${tx.delta.bronze} 🥉`);
        }

        const pointSign = tx.pointDelta > 0 ? `+${tx.pointDelta}` : `${tx.pointDelta}`;
        const pointClass = tx.pointDelta > 0 ? 'text-emerald-600' : (tx.pointDelta < 0 ? 'text-rose-600' : 'text-slate-500');

        return `
          <tr class="statement-row">
            <td class="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
              <span class="font-bold text-slate-700 block">${this.formatDateTime(tx.timestamp)}</span>
              <span class="text-[10px] text-slate-400 font-mono">${tx.txId}</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <span class="text-2xl">${tx.icon || '⭐'}</span>
                <div>
                  <div class="font-black text-slate-800 text-sm">${tx.description}</div>
                  <div class="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                    <span class="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600">${tx.barcode}</span>
                    <span>${tx.notes || tx.action}</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              ${typeBadge}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-right">
              <div class="font-bold text-sm text-slate-800">${deltas.join(', ') || '0'}</div>
              <div class="text-xs font-black ${pointClass}">${pointSign} pts</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-right">
              <span class="inline-block bg-slate-100 px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-slate-700">
                ${tx.balanceAfter ? `${tx.balanceAfter.gold}🥇 ${tx.balanceAfter.silver}🥈 ${tx.balanceAfter.bronze}🥉 (${tx.balanceAfter.points} pts)` : '—'}
              </span>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // --- Debugger & Health Panel Renderer ---
  renderDebugPanel() {
    const integrity = this.verifyLedgerIntegrity();
    const statusElem = document.getElementById('debug-health-status');
    const storageElem = document.getElementById('debug-storage-status');
    const rawTextarea = document.getElementById('textarea-debug-raw-json');

    if (statusElem) {
      if (integrity.isHealthy) {
        statusElem.innerHTML = `
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ✓ Healthy & Reconciled (${integrity.txCount} Ledger Transactions Verified)
          </span>
        `;
      } else {
        statusElem.innerHTML = `
          <div class="flex items-center gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black">
              ⚠️ Balance Mismatch (Bank: ${integrity.currentBank.gold}G/${integrity.currentBank.silver}S/${integrity.currentBank.bronze}B vs Ledger: ${integrity.ledgerTotal.gold}G/${integrity.ledgerTotal.silver}S/${integrity.ledgerTotal.bronze}B)
            </span>
            <button id="btn-quick-fix-balance" class="px-3 py-1 bg-amber-500 text-slate-900 rounded-lg font-bold text-xs">
              Reconcile Now
            </button>
          </div>
        `;
        document.getElementById('btn-quick-fix-balance')?.addEventListener('click', () => {
          this.reconcileBalances();
          this.renderDebugPanel();
        });
      }
    }

    if (storageElem) {
      const raw = localStorage.getItem(this.STORAGE_KEY) || '{}';
      const kb = (raw.length / 1024).toFixed(2);
      storageElem.textContent = `Key: "${this.STORAGE_KEY}" • ${kb} KB used • ${(this.data.ledger || []).length} ledger txs • ${(this.data.pendingStars || []).length} pending`;
    }

    if (rawTextarea && document.activeElement !== rawTextarea) {
      rawTextarea.value = JSON.stringify(this.data, null, 2);
    }
  }

  handleDebugBarcodeInjection(code, mode) {
    const matched = window.starScanner.simulatedItems.find(i => i.code.toLowerCase() === code.toLowerCase());
    const tier = matched ? matched.tier : 'gold';
    const reason = matched ? matched.reason : `Debug Test: ${code}`;
    const icon = matched ? matched.icon : '🏷️';
    const pts = (this.data.settings.starValues || { gold: 4, silver: 2, bronze: 1 })[tier] || 1;

    if (mode === 'pending') {
      const newStar = {
        id: `star_debug_${Date.now()}`,
        barcode: code,
        barcodeName: matched ? matched.name : 'Debug Barcode',
        reason: reason,
        icon: icon,
        tier: tier,
        timestamp: Date.now()
      };
      this.data.pendingStars.unshift(newStar);
      this.saveData();
      window.soundController.playScanBeep();
      this.showToast(`Injected "${reason}" into Pending Box! ⏳`, 'info');
    } else {
      // Immediate bank deposit
      if (!this.data.bank[tier]) this.data.bank[tier] = 0;
      this.data.bank[tier] += 1;

      this.recordLedgerTransaction({
        type: 'CREDIT',
        action: 'Debug Instant Deposit',
        description: `[Debug] ${reason}`,
        barcode: code,
        icon: icon,
        delta: { gold: tier === 'gold' ? 1 : 0, silver: tier === 'silver' ? 1 : 0, bronze: tier === 'bronze' ? 1 : 0 },
        pointDelta: pts,
        notes: 'Injected via Parent Debugger'
      });

      this.saveData();
      window.soundController.playStarChime(tier);
      if (window.confettiEngine) window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.4, 40, 'stars');
      this.showToast(`Deposited +1 ${tier} star (${code}) directly to Bank! ⭐`, 'success');
    }
  }

  // --- Kid: Chore Barcode Binder Modal ---
  openBarcodeBinderModal() {
    this.openModal('modal-barcode-binder');
    const container = document.getElementById('barcode-binder-cards-container');
    if (!container || !window.barcodeGenerator) return;

    const cards = [
      // Bronze (1 pt)
      { code: 'BRONZE-TEETH-01', title: 'Brushed Teeth 2 Mins', icon: '🪥', tier: 'bronze', pts: 1, desc: 'Sparkly clean smile' },
      { code: 'BRONZE-BED-02', title: 'Made My Bed', icon: '🛏️', tier: 'bronze', pts: 1, desc: 'Bed made and pillow fluffed' },
      { code: 'BRONZE-TOYS-03', title: 'Put Away Toys', icon: '🧸', tier: 'bronze', pts: 1, desc: 'Playroom neat and tidy' },
      { code: 'BRONZE-SHOES-04', title: 'Shoes by the Door', icon: '👟', tier: 'bronze', pts: 1, desc: 'Shoes in shoe rack' },
      { code: 'BRONZE-WATER-05', title: 'Drank Water', icon: '💧', tier: 'bronze', pts: 1, desc: 'Stay hydrated hero' },
      { code: 'BRONZE-HANDS-06', title: 'Washed Hands', icon: '🧼', tier: 'bronze', pts: 1, desc: 'Clean hands with soap' },

      // Silver (2 pts)
      { code: 'SILVER-HW-01', title: 'Finished Homework', icon: '📚', tier: 'silver', pts: 2, desc: 'Math, reading, or worksheet' },
      { code: 'SILVER-READ-02', title: 'Read 20 Minutes', icon: '📖', tier: 'silver', pts: 2, desc: 'Finished story chapter' },
      { code: 'SILVER-VEG-03', title: 'Ate All My Veggies', icon: '🥦', tier: 'silver', pts: 2, desc: 'Healthy dinner champion' },
      { code: 'SILVER-PET-04', title: 'Pet Care Hero', icon: '🐕', tier: 'silver', pts: 2, desc: 'Fed dog, cat, or fish' },
      { code: 'SILVER-MUSIC-05', title: 'Music Practice', icon: '🎵', tier: 'silver', pts: 2, desc: 'Practiced instrument 20m' },
      { code: 'SILVER-TABLE-06', title: 'Set Dinner Table', icon: '🍽️', tier: 'silver', pts: 2, desc: 'Forks, cups, & napkins set' },

      // Gold (4 pts)
      { code: 'GOLD-ROOM-01', title: 'Clean Entire Bedroom', icon: '🧹', tier: 'gold', pts: 4, desc: 'Floor, closet, & desk cleaned' },
      { code: 'GOLD-HELP-02', title: 'Kind Family Helper', icon: '🤝', tier: 'gold', pts: 4, desc: 'Helped mom, dad, or sibling' },
      { code: 'GOLD-DISH-03', title: 'Wash / Load Dishes', icon: '🧽', tier: 'gold', pts: 4, desc: 'Clean kitchen counter & dishes' },
      { code: 'GOLD-LAUNDRY-04', title: 'Fold & Put Laundry Away', icon: '🧺', tier: 'gold', pts: 4, desc: 'Clothes folded and put in drawers' },
      { code: 'GOLD-PROJECT-05', title: 'Big School Project', icon: '🌟', tier: 'gold', pts: 4, desc: 'Extra milestone project completed' },
      { code: 'GOLD-YARD-06', title: 'Yard & Trash Helper', icon: '🍂', tier: 'gold', pts: 4, desc: 'Binned trash and weeded yard' }
    ];

    container.innerHTML = cards.map(c => `
      <div class="binder-card tier-${c.tier}">
        <div class="binder-card-header">
          <span class="text-3xl">${c.icon}</span>
          <div class="flex-1">
            <h4 class="font-extrabold text-slate-800 text-sm leading-tight">${c.title}</h4>
            <p class="text-[11px] text-slate-500">${c.desc}</p>
          </div>
          <span class="tier-chip ${c.tier}">${c.tier.toUpperCase()} (+${c.pts})</span>
        </div>
        <div class="binder-barcode-svg">
          ${window.barcodeGenerator.generateSVG(c.code, { height: 42, showText: true })}
        </div>
        <div class="binder-card-footer">
          <button class="btn-binder-scan-camera" data-code="${c.code}">
            📷 Point Camera
          </button>
          <button class="btn-binder-test-tap" data-code="${c.code}">
            ⚡ Quick Tap Scan
          </button>
        </div>
      </div>
    `).join('');

    // Attach listeners
    container.querySelectorAll('.btn-binder-scan-camera').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.closeModal('modal-barcode-binder');
        this.openScanModal();
      });
    });

    container.querySelectorAll('.btn-binder-test-tap').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const code = e.currentTarget.getAttribute('data-code');
        this.closeModal('modal-barcode-binder');
        window.starScanner.simulateScan(code);
      });
    });
  }

  // --- Helpers for Star Icons & Timestamps ---
  getTierIcon(tier) {
    if (tier === 'gold') return '🥇';
    if (tier === 'silver') return '🥈';
    return '🥉';
  }

  getStarSvg(tier, size = 32) {
    let gradId = `star-grad-${tier}-${Math.floor(Math.random() * 1000)}`;
    let stop1 = '#FFD700', stop2 = '#FFA500', stroke = '#D97706';

    if (tier === 'silver') {
      stop1 = '#F1F5F9'; stop2 = '#94A3B8'; stroke = '#64748B';
    } else if (tier === 'bronze') {
      stop1 = '#FDBA74'; stop2 = '#C2410C'; stroke = '#9A3412';
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="url(#${gradId})" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="inline-block drop-shadow">
        <defs>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${stop1}" />
            <stop offset="100%" stop-color="${stop2}" />
          </linearGradient>
        </defs>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    `;
  }

  formatDateTime(timestamp) {
    const d = new Date(timestamp);
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatRelativeTime(timestamp) {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  updateTimeDisplays() {
    document.querySelectorAll('[data-timestamp]').forEach(el => {
      const ts = parseInt(el.getAttribute('data-timestamp'), 10);
      if (ts) el.textContent = this.formatRelativeTime(ts);
    });
  }

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `app-toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }
}

window.StarbookApp = StarbookApp;

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.starbookApp = new StarbookApp();
});
