import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEY, getDefaultData, ALL_RECOGNIZED_ITEMS, CHORE_BARCODES, DEFAULT_REWARDS, LEGACY_SIMULATED_ITEMS } from '../utils/constants';
import {
  calculatePoints as calcPts,
  createTransaction,
  verifyLedgerIntegrity,
  reconcileBankFromLedger,
  generateSyncCode as createSyncCode,
  decodeSyncCode
} from '../utils/ledger';
import { soundController } from '../utils/audio';
import { confettiEngine } from '../utils/confetti';

const StarbookContext = createContext(null);

export function StarbookProvider({ children }) {
  // Load initial data from localStorage or default
  const [data, setData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (!parsed.settings) parsed.settings = {};
          if (!parsed.settings.childName) parsed.settings.childName = 'Alex';
          if (!parsed.settings.accountNumber) {
            parsed.settings.accountNumber = `ACCT-7734-${(parsed.settings.childName || 'ALEX').toUpperCase()}`;
          }
          if (!parsed.bank) parsed.bank = { gold: 2, silver: 4, bronze: 6 };
          if (!parsed.pendingStars) parsed.pendingStars = [];
          if (!parsed.history) parsed.history = [];
          if (!parsed.cashOutLog) parsed.cashOutLog = [];
          if (!parsed.customRewards || !Array.isArray(parsed.customRewards) || parsed.customRewards.length === 0) {
            parsed.customRewards = DEFAULT_REWARDS;
          }
          if (!parsed.customChores || !Array.isArray(parsed.customChores) || parsed.customChores.length === 0) {
            parsed.customChores = CHORE_BARCODES;
          }
          if (!parsed.ledger || parsed.ledger.length === 0) {
            const now = Date.now();
            parsed.ledger = [
              {
                txId: 'TX-104880',
                timestamp: now - 1000 * 60 * 60 * 48,
                type: 'CREDIT',
                action: 'Initial Account Deposit',
                description: 'Starting Star Bank Balance',
                barcode: 'INIT-BANK-DEPOSIT',
                icon: '🏦',
                delta: { gold: parsed.bank.gold || 0, silver: parsed.bank.silver || 0, bronze: parsed.bank.bronze || 0 },
                pointDelta: ((parsed.bank.gold || 0) * 4) + ((parsed.bank.silver || 0) * 2) + (parsed.bank.bronze || 0),
                balanceAfter: {
                  gold: parsed.bank.gold || 0,
                  silver: parsed.bank.silver || 0,
                  bronze: parsed.bank.bronze || 0,
                  points: ((parsed.bank.gold || 0) * 4) + ((parsed.bank.silver || 0) * 2) + (parsed.bank.bronze || 0)
                },
                notes: 'Initial account balance opened'
              }
            ];
          }
          return parsed;
        }
      } catch (e) {
        console.error('Error loading stored Starbook data:', e);
      }
    }
    return getDefaultData();
  });

  // UI state
  const [currentView, setCurrentView] = useState('kid'); // 'kid' or 'parent'
  const [activeParentTab, setActiveParentTab] = useState('pending');
  const [activeModal, setActiveModal] = useState(null);
  const [modalPayload, setModalPayload] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(data.settings?.soundEnabled ?? true);

  // Sync state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }
  }, [data]);

  // Sync sound controller state
  useEffect(() => {
    soundController.enabled = soundEnabled;
  }, [soundEnabled]);

  // Toast manager
  const showToast = useCallback((message, type = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      setData(d => ({
        ...d,
        settings: { ...d.settings, soundEnabled: next }
      }));
      soundController.playPop();
      return next;
    });
  }, []);

  const openModal = useCallback((modalName, payload = null) => {
    setModalPayload(payload);
    setActiveModal(modalName);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalPayload(null);
  }, []);

  // Calculate points
  const calculatePoints = useCallback((bank = data.bank) => {
    return calcPts(bank, data.settings.starValues);
  }, [data.bank, data.settings.starValues]);

  // Record a transaction and update ledger
  const recordTransaction = useCallback((txParams, currentBank) => {
    const tx = createTransaction({
      ...txParams,
      bank: currentBank,
      starValues: data.settings.starValues
    });
    return tx;
  }, [data.settings.starValues]);

  // Kid Actions: Start a chore
  const startChore = useCallback((tier, reason, icon, barcode, barcodeName = '') => {
    const newStar = {
      id: `star_${Date.now()}`,
      barcode: barcode || `CHORE-${tier.toUpperCase()}`,
      barcodeName: barcodeName || 'Custom Chore',
      reason,
      icon: icon || '⭐',
      tier: tier || 'bronze',
      timestamp: Date.now()
    };

    setData(prev => ({
      ...prev,
      pendingStars: [newStar, ...prev.pendingStars]
    }));

    soundController.playFanfare();
    confettiEngine.celebrateBig();
    openModal('celebration', newStar);
  }, [openModal]);

  // Parent Actions: Approve Star
  const approveStar = useCallback((starId, optionalNewTier = null) => {
    setData(prev => {
      const idx = prev.pendingStars.findIndex(s => s.id === starId);
      if (idx === -1) return prev;

      const star = prev.pendingStars[idx];
      const finalTier = optionalNewTier || star.tier;
      const newPending = prev.pendingStars.filter(s => s.id !== starId);

      const newBank = {
        ...prev.bank,
        [finalTier]: (prev.bank[finalTier] || 0) + 1
      };

      const pts = (prev.settings.starValues || { gold: 4, silver: 2, bronze: 1 })[finalTier] || 1;

      const tx = createTransaction({
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
        bank: newBank,
        starValues: prev.settings.starValues,
        notes: `Approved by Parent • Barcode: ${star.barcode || 'N/A'}`
      });

      const newHistory = [
        {
          id: `hist_${Date.now()}`,
          type: 'approved',
          reason: star.reason,
          icon: star.icon,
          tier: finalTier,
          barcode: star.barcode,
          timestamp: Date.now()
        },
        ...prev.history
      ];

      return {
        ...prev,
        bank: newBank,
        pendingStars: newPending,
        history: newHistory,
        ledger: [tx, ...prev.ledger]
      };
    });

    soundController.playStarChime(optionalNewTier || 'gold');
    confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 30, 'stars');
    showToast('Star Approved! Added to Bank! ⭐', 'success');
  }, [showToast]);

  // Bulk Approve
  const approveAllPending = useCallback(() => {
    setData(prev => {
      if (!prev.pendingStars || prev.pendingStars.length === 0) return prev;

      const newBank = { ...prev.bank };
      const newHistory = [...prev.history];
      const newTxs = [];

      prev.pendingStars.forEach(star => {
        newBank[star.tier] = (newBank[star.tier] || 0) + 1;
        const pts = (prev.settings.starValues || { gold: 4, silver: 2, bronze: 1 })[star.tier] || 1;

        const tx = createTransaction({
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
          bank: newBank,
          starValues: prev.settings.starValues,
          notes: 'Bulk approved by Parent'
        });
        newTxs.push(tx);

        newHistory.unshift({
          id: `hist_${Date.now()}_${Math.random()}`,
          type: 'approved',
          reason: star.reason,
          icon: star.icon,
          tier: star.tier,
          barcode: star.barcode,
          timestamp: Date.now()
        });
      });

      return {
        ...prev,
        bank: newBank,
        pendingStars: [],
        history: newHistory,
        ledger: [...newTxs, ...prev.ledger]
      };
    });

    soundController.playFanfare();
    confettiEngine.celebrateBig();
    showToast('All pending stars approved! 🚀', 'success');
  }, [showToast]);

  // Reject Star
  const rejectStar = useCallback((starId) => {
    setData(prev => {
      const idx = prev.pendingStars.findIndex(s => s.id === starId);
      if (idx === -1) return prev;

      const star = prev.pendingStars[idx];
      const newPending = prev.pendingStars.filter(s => s.id !== starId);

      const newHistory = [
        {
          id: `hist_${Date.now()}`,
          type: 'rejected',
          reason: star.reason,
          icon: star.icon,
          tier: star.tier,
          barcode: star.barcode,
          timestamp: Date.now()
        },
        ...prev.history
      ];

      return {
        ...prev,
        pendingStars: newPending,
        history: newHistory
      };
    });

    soundController.playReject();
    showToast('Chore request rejected.', 'error');
  }, [showToast]);

  // Cash Out Reward
  const cashOutReward = useCallback((rewardId, customReward = null) => {
    setData(prev => {
      let reward = prev.customRewards.find(r => r.id === rewardId);
      if (!reward && customReward) {
        reward = customReward;
      }
      if (!reward) return prev;

      const cost = reward.cost || { gold: 0, silver: 0, bronze: 0 };
      const currentBank = prev.bank;

      // Check balance
      if ((currentBank.gold || 0) < (cost.gold || 0) ||
          (currentBank.silver || 0) < (cost.silver || 0) ||
          (currentBank.bronze || 0) < (cost.bronze || 0)) {
        soundController.playReject();
        showToast('Not enough stars in the bank for this reward! ❌', 'error');
        return prev;
      }

      const newBank = {
        gold: Math.max(0, (currentBank.gold || 0) - (cost.gold || 0)),
        silver: Math.max(0, (currentBank.silver || 0) - (cost.silver || 0)),
        bronze: Math.max(0, (currentBank.bronze || 0) - (cost.bronze || 0))
      };

      const pts = (cost.gold || 0) * (prev.settings.starValues?.gold || 4) +
                  (cost.silver || 0) * (prev.settings.starValues?.silver || 2) +
                  (cost.bronze || 0) * (prev.settings.starValues?.bronze || 1);

      const tx = createTransaction({
        type: 'DEBIT',
        action: 'Reward Redeemed',
        description: reward.name,
        barcode: 'REWARD-CASHOUT',
        icon: reward.icon || '🎁',
        delta: {
          gold: -(cost.gold || 0),
          silver: -(cost.silver || 0),
          bronze: -(cost.bronze || 0)
        },
        pointDelta: -pts,
        bank: newBank,
        starValues: prev.settings.starValues,
        notes: `Cashed out reward: ${reward.name}`
      });

      const cashEntry = {
        id: `cash_${Date.now()}`,
        rewardName: reward.name,
        rewardIcon: reward.icon || '🎁',
        cost: { ...cost },
        pointCost: pts,
        note: customReward?.note || 'Redeemed with Parent',
        timestamp: Date.now()
      };

      soundController.playCashOut();
      confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 25, 'confetti');
      showToast(`Enjoy your reward: ${reward.name}! 🎉`, 'success');

      return {
        ...prev,
        bank: newBank,
        cashOutLog: [cashEntry, ...prev.cashOutLog],
        ledger: [tx, ...prev.ledger]
      };
    });
  }, [showToast]);

  // Star Exchange / Level Up & Breakdown
  const exchangeStars = useCallback((type) => {
    setData(prev => {
      const currentBank = { ...prev.bank };

      if (type === 'bronze-to-silver') {
        if ((currentBank.bronze || 0) < 2) {
          soundController.playReject();
          showToast(`Need 2 Bronze Stars to upgrade (you have ${currentBank.bronze || 0})! 🥉`, 'error');
          return prev;
        }
        currentBank.bronze -= 2;
        currentBank.silver = (currentBank.silver || 0) + 1;

        const tx = createTransaction({
          type: 'TRANSFER',
          action: 'Star Upgrade Transfer',
          description: 'Upgraded 2 Bronze ➔ 1 Silver Star',
          barcode: 'EXCHANGE-BRONZE-SILVER',
          icon: '🥈',
          delta: { gold: 0, silver: 1, bronze: -2 },
          pointDelta: 0,
          bank: currentBank,
          starValues: prev.settings.starValues,
          notes: 'Level Up in Star Exchange (-2 Bronze, +1 Silver)'
        });

        soundController.playExchange();
        confettiEngine.celebrateBig();
        showToast('Level Up! 2 Bronze converted into 1 Silver Star! 🥈', 'success');

        return {
          ...prev,
          bank: currentBank,
          ledger: [tx, ...prev.ledger]
        };
      } else if (type === 'silver-to-gold') {
        if ((currentBank.silver || 0) < 2) {
          soundController.playReject();
          showToast(`Need 2 Silver Stars to upgrade (you have ${currentBank.silver || 0})! 🥈`, 'error');
          return prev;
        }
        currentBank.silver -= 2;
        currentBank.gold = (currentBank.gold || 0) + 1;

        const tx = createTransaction({
          type: 'TRANSFER',
          action: 'Star Upgrade Transfer',
          description: 'Upgraded 2 Silver ➔ 1 Gold Star',
          barcode: 'EXCHANGE-SILVER-GOLD',
          icon: '🥇',
          delta: { gold: 1, silver: -2, bronze: 0 },
          pointDelta: 0,
          bank: currentBank,
          starValues: prev.settings.starValues,
          notes: 'Level Up in Star Exchange (-2 Silver, +1 Gold)'
        });

        soundController.playExchange();
        confettiEngine.celebrateBig();
        showToast('Super Level Up! 2 Silver converted into 1 Gold Star! 🥇', 'success');

        return {
          ...prev,
          bank: currentBank,
          ledger: [tx, ...prev.ledger]
        };
      } else if (type === 'gold-to-silver') {
        if ((currentBank.gold || 0) < 1) {
          soundController.playReject();
          showToast(`Need 1 Gold Star to break down (you have ${currentBank.gold || 0})! 🥇`, 'error');
          return prev;
        }
        currentBank.gold -= 1;
        currentBank.silver = (currentBank.silver || 0) + 2;

        const tx = createTransaction({
          type: 'TRANSFER',
          action: 'Currency Breakdown Transfer',
          description: 'Broke 1 Gold ➔ 2 Silver Stars',
          barcode: 'BREAK-GOLD-SILVER',
          icon: '🥈',
          delta: { gold: -1, silver: 2, bronze: 0 },
          pointDelta: 0,
          bank: currentBank,
          starValues: prev.settings.starValues,
          notes: 'Currency Breakdown in Star Exchange (-1 Gold, +2 Silver)'
        });

        soundController.playExchange();
        showToast('Exchanged! 1 Gold broken down into 2 Silver Stars! 🥈🥈', 'success');

        return {
          ...prev,
          bank: currentBank,
          ledger: [tx, ...prev.ledger]
        };
      } else if (type === 'silver-to-bronze') {
        if ((currentBank.silver || 0) < 1) {
          soundController.playReject();
          showToast(`Need 1 Silver Star to break down (you have ${currentBank.silver || 0})! 🥈`, 'error');
          return prev;
        }
        currentBank.silver -= 1;
        currentBank.bronze = (currentBank.bronze || 0) + 2;

        const tx = createTransaction({
          type: 'TRANSFER',
          action: 'Currency Breakdown Transfer',
          description: 'Broke 1 Silver ➔ 2 Bronze Stars',
          barcode: 'BREAK-SILVER-BRONZE',
          icon: '🥉',
          delta: { gold: 0, silver: -1, bronze: 2 },
          pointDelta: 0,
          bank: currentBank,
          starValues: prev.settings.starValues,
          notes: 'Currency Breakdown in Star Exchange (-1 Silver, +2 Bronze)'
        });

        soundController.playExchange();
        showToast('Exchanged! 1 Silver broken down into 2 Bronze Stars! 🥉🥉', 'success');

        return {
          ...prev,
          bank: currentBank,
          ledger: [tx, ...prev.ledger]
        };
      }

      return prev;
    });
  }, [showToast]);

  // Parent: Update Starting / Current Balances
  const updateStartingBalances = useCallback((newBalances) => {
    setData(prev => {
      const gold = Math.max(0, parseInt(newBalances.gold || 0, 10));
      const silver = Math.max(0, parseInt(newBalances.silver || 0, 10));
      const bronze = Math.max(0, parseInt(newBalances.bronze || 0, 10));

      const oldBank = prev.bank;
      const deltaGold = gold - (oldBank.gold || 0);
      const deltaSilver = silver - (oldBank.silver || 0);
      const deltaBronze = bronze - (oldBank.bronze || 0);

      const updatedBank = { gold, silver, bronze };
      const starVals = prev.settings.starValues || { gold: 4, silver: 2, bronze: 1 };
      const pointDelta = (deltaGold * starVals.gold) + (deltaSilver * starVals.silver) + (deltaBronze * starVals.bronze);

      const tx = createTransaction({
        type: 'ADJUSTMENT',
        action: 'Account Balance Adjustment',
        description: 'Parent Updated Bank Starting Balances',
        barcode: 'BALANCE-OVERRIDE',
        icon: '⚖️',
        delta: { gold: deltaGold, silver: deltaSilver, bronze: deltaBronze },
        pointDelta,
        bank: updatedBank,
        starValues: starVals,
        notes: `Balance updated: Gold ${gold}, Silver ${silver}, Bronze ${bronze}`
      });

      return {
        ...prev,
        bank: updatedBank,
        ledger: [tx, ...prev.ledger]
      };
    });

    soundController.playPop();
    showToast('Starting balances updated and logged in ledger! ⚖️', 'success');
  }, [showToast]);

  // Parent: Gift Manual Star Bonus
  const giftManualStar = useCallback((tier, count = 1, note = '') => {
    setData(prev => {
      const newBank = {
        ...prev.bank,
        [tier]: (prev.bank[tier] || 0) + count
      };

      const pts = (prev.settings.starValues || { gold: 4, silver: 2, bronze: 1 })[tier] || 1;

      const tx = createTransaction({
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
        pointDelta: count * pts,
        bank: newBank,
        starValues: prev.settings.starValues,
        notes: 'Direct gift by Parent'
      });

      return {
        ...prev,
        bank: newBank,
        ledger: [tx, ...prev.ledger]
      };
    });

    soundController.playStarChime(tier);
    confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 30, 'stars');
    showToast(`Gifted +${count} ${tier} star(s) to bank! 🎁`, 'success');
  }, [showToast]);

  // Get all recognized items (custom chores + defaults)
  const getAllRecognizedItems = useCallback(() => {
    const custom = data.customChores || CHORE_BARCODES;
    return [...custom, ...LEGACY_SIMULATED_ITEMS];
  }, [data.customChores]);

  // Debug Barcode Injector
  const injectDebugBarcode = useCallback((code, mode = 'pending') => {
    const allItems = getAllRecognizedItems();
    const matched = allItems.find(i => i.code.toLowerCase() === code.toLowerCase());
    const tier = matched ? matched.tier : 'gold';
    const reason = matched ? (matched.reason || matched.title || matched.name) : `Debug Test: ${code}`;
    const icon = matched ? matched.icon : '🏷️';

    if (mode === 'pending') {
      const newStar = {
        id: `star_debug_${Date.now()}`,
        barcode: code,
        barcodeName: matched ? (matched.title || matched.name) : 'Debug Barcode',
        reason,
        icon,
        tier,
        timestamp: Date.now()
      };

      setData(prev => ({
        ...prev,
        pendingStars: [newStar, ...prev.pendingStars]
      }));

      soundController.playScanBeep();
      showToast(`Injected "${reason}" into Pending Box! ⏳`, 'info');
    } else {
      setData(prev => {
        const newBank = {
          ...prev.bank,
          [tier]: (prev.bank[tier] || 0) + 1
        };

        const pts = (prev.settings.starValues || { gold: 4, silver: 2, bronze: 1 })[tier] || 1;

        const tx = createTransaction({
          type: 'CREDIT',
          action: 'Debug Instant Deposit',
          description: `[Debug] ${reason}`,
          barcode: code,
          icon,
          delta: {
            gold: tier === 'gold' ? 1 : 0,
            silver: tier === 'silver' ? 1 : 0,
            bronze: tier === 'bronze' ? 1 : 0
          },
          pointDelta: pts,
          bank: newBank,
          starValues: prev.settings.starValues,
          notes: 'Injected via Parent Debugger'
        });

        return {
          ...prev,
          bank: newBank,
          ledger: [tx, ...prev.ledger]
        };
      });

      soundController.playStarChime(tier);
      confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 30, 'stars');
      showToast(`Deposited +1 ${tier} star (${code}) directly to Bank! ⭐`, 'success');
    }
  }, [getAllRecognizedItems, showToast]);

  // Reconcile Balances from Ledger
  const reconcileBalances = useCallback(() => {
    setData(prev => {
      const reconciled = reconcileBankFromLedger(prev.ledger);
      return {
        ...prev,
        bank: reconciled
      };
    });
    soundController.playPop();
    showToast('Bank balances reconciled with double-entry ledger! ⚖️', 'success');
  }, [showToast]);

  // Phone-to-Phone Sync
  const exportBackupJSON = useCallback(() => {
    const payload = {
      app: 'Starbook Kids',
      version: '2.0.0',
      exportTime: Date.now(),
      data
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `starbook-kids-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported Starbook backup file! 📁', 'success');
  }, [data, showToast]);

  const importBackupJSON = useCallback((jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      const incoming = parsed.data || parsed;
      if (!incoming.bank || !incoming.settings) {
        throw new Error('Missing bank or settings in backup file');
      }

      setData(prev => ({
        ...prev,
        ...incoming,
        settings: { ...prev.settings, ...incoming.settings }
      }));

      soundController.playFanfare();
      showToast('Successfully imported Starbook backup! 🎉', 'success');
      return true;
    } catch (e) {
      soundController.playReject();
      showToast(`Import failed: ${e.message}`, 'error');
      return false;
    }
  }, [showToast]);

  const generateSyncCode = useCallback(() => {
    return createSyncCode(data);
  }, [data]);

  const applySyncCode = useCallback((code) => {
    try {
      const incomingData = decodeSyncCode(code);
      setData(prev => ({
        ...prev,
        ...incomingData
      }));
      soundController.playFanfare();
      showToast('Sync Code Applied Successfully! 📲', 'success');
      return true;
    } catch (e) {
      soundController.playReject();
      showToast(`Invalid Sync Code: ${e.message}`, 'error');
      return false;
    }
  }, [showToast]);

  // Customize Child Name
  const setChildName = useCallback((name) => {
    const trimmed = (name || '').trim() || 'Alex';
    setData(prev => {
      const newSettings = {
        ...prev.settings,
        childName: trimmed,
        accountNumber: `ACCT-7734-${trimmed.toUpperCase()}`
      };
      return { ...prev, settings: newSettings };
    });
    soundController.playPop();
    showToast(`Child profile set to "${trimmed}"! 🧒⭐`, 'success');
  }, [showToast]);

  // Reward Catalog Actions
  const addReward = useCallback((newReward) => {
    const id = `rew_${Date.now()}`;
    const rewardItem = {
      id,
      name: newReward.name?.trim() || 'Custom Reward',
      icon: newReward.icon || '🎁',
      cost: {
        gold: Math.max(0, parseInt(newReward.cost?.gold || 0, 10)),
        silver: Math.max(0, parseInt(newReward.cost?.silver || 0, 10)),
        bronze: Math.max(0, parseInt(newReward.cost?.bronze || 0, 10))
      }
    };
    setData(prev => ({
      ...prev,
      customRewards: [...(prev.customRewards || []), rewardItem]
    }));
    soundController.playPop();
    showToast(`Added reward: "${rewardItem.name}"! 🎁`, 'success');
  }, [showToast]);

  const updateReward = useCallback((rewardId, updatedFields) => {
    setData(prev => ({
      ...prev,
      customRewards: (prev.customRewards || []).map(r => {
        if (r.id !== rewardId) return r;
        return {
          ...r,
          name: updatedFields.name?.trim() || r.name,
          icon: updatedFields.icon || r.icon,
          cost: {
            gold: Math.max(0, parseInt(updatedFields.cost?.gold ?? r.cost?.gold ?? 0, 10)),
            silver: Math.max(0, parseInt(updatedFields.cost?.silver ?? r.cost?.silver ?? 0, 10)),
            bronze: Math.max(0, parseInt(updatedFields.cost?.bronze ?? r.cost?.bronze ?? 0, 10))
          }
        };
      })
    }));
    soundController.playPop();
    showToast('Reward updated in catalog! ✨', 'success');
  }, [showToast]);

  const deleteReward = useCallback((rewardId) => {
    setData(prev => ({
      ...prev,
      customRewards: (prev.customRewards || []).filter(r => r.id !== rewardId)
    }));
    soundController.playPop();
    showToast('Reward removed from catalog. 🗑️', 'info');
  }, [showToast]);

  const resetRewards = useCallback(() => {
    setData(prev => ({
      ...prev,
      customRewards: DEFAULT_REWARDS
    }));
    soundController.playPop();
    showToast('Reset rewards to default catalog! 🔄', 'info');
  }, [showToast]);

  // Chore Barcode Simulator Actions
  const addChoreBarcode = useCallback((newChore) => {
    const rawCode = (newChore.code || `${newChore.tier || 'bronze'}-${newChore.title || 'CHORE'}-${Date.now().toString().slice(-4)}`)
      .toUpperCase()
      .replace(/[^A-Z0-9\-\.\$\/\+\%\*]/g, '-');
    
    const tier = newChore.tier || 'bronze';
    const pts = (data.settings?.starValues || { gold: 4, silver: 2, bronze: 1 })[tier] || 1;

    const choreItem = {
      code: rawCode,
      title: newChore.title?.trim() || 'New Chore',
      name: newChore.name?.trim() || newChore.title?.trim() || 'Chore Token',
      icon: newChore.icon || '⭐',
      tier,
      points: pts,
      reason: newChore.reason?.trim() || newChore.title?.trim() || 'Completed Chore',
      desc: newChore.desc?.trim() || 'Custom chore completed'
    };

    setData(prev => {
      const existing = prev.customChores || [];
      const filtered = existing.filter(c => c.code.toUpperCase() !== rawCode);
      return {
        ...prev,
        customChores: [...filtered, choreItem]
      };
    });
    soundController.playPop();
    showToast(`Added chore barcode: "${choreItem.title}" (${choreItem.code})! 🏷️`, 'success');
  }, [data.settings?.starValues, showToast]);

  const updateChoreBarcode = useCallback((code, updatedFields) => {
    setData(prev => ({
      ...prev,
      customChores: (prev.customChores || []).map(c => {
        if (c.code.toUpperCase() !== code.toUpperCase()) return c;
        const tier = updatedFields.tier || c.tier;
        const pts = (prev.settings?.starValues || { gold: 4, silver: 2, bronze: 1 })[tier] || 1;
        return {
          ...c,
          title: updatedFields.title?.trim() || c.title,
          name: updatedFields.name?.trim() || updatedFields.title?.trim() || c.name,
          icon: updatedFields.icon || c.icon,
          tier,
          points: pts,
          reason: updatedFields.reason?.trim() || c.reason,
          desc: updatedFields.desc?.trim() || c.desc
        };
      })
    }));
    soundController.playPop();
    showToast('Chore barcode updated! ✨', 'success');
  }, [showToast]);

  const deleteChoreBarcode = useCallback((code) => {
    setData(prev => ({
      ...prev,
      customChores: (prev.customChores || []).filter(c => c.code.toUpperCase() !== code.toUpperCase())
    }));
    soundController.playPop();
    showToast(`Chore barcode "${code}" removed! 🗑️`, 'info');
  }, [showToast]);

  const resetChoreBarcodes = useCallback(() => {
    setData(prev => ({
      ...prev,
      customChores: CHORE_BARCODES
    }));
    soundController.playPop();
    showToast('Reset chore tokens to default barcodes! 🔄', 'info');
  }, [showToast]);

  const updateSettings = useCallback((newSettings) => {
    setData(prev => {
      const merged = { ...prev.settings, ...newSettings };
      if (newSettings.childName) {
        merged.accountNumber = `ACCT-7734-${newSettings.childName.trim().toUpperCase()}`;
      }
      return {
        ...prev,
        settings: merged
      };
    });
    showToast('Settings saved! ⚙️', 'success');
  }, [showToast]);

  const value = {
    data,
    setData,
    currentView,
    setCurrentView,
    activeParentTab,
    setActiveParentTab,
    activeModal,
    modalPayload,
    openModal,
    closeModal,
    toasts,
    showToast,
    soundEnabled,
    toggleSound,
    calculatePoints,
    startChore,
    approveStar,
    approveAllPending,
    rejectStar,
    cashOutReward,
    exchangeStars,
    updateStartingBalances,
    giftManualStar,
    injectDebugBarcode,
    reconcileBalances,
    exportBackupJSON,
    importBackupJSON,
    generateSyncCode,
    applySyncCode,
    updateSettings,
    setChildName,
    addReward,
    updateReward,
    deleteReward,
    resetRewards,
    addChoreBarcode,
    updateChoreBarcode,
    deleteChoreBarcode,
    resetChoreBarcodes,
    getAllRecognizedItems
  };

  return (
    <StarbookContext.Provider value={value}>
      {children}
    </StarbookContext.Provider>
  );
}

export function useStarbook() {
  const context = useContext(StarbookContext);
  if (!context) {
    throw new Error('useStarbook must be used within a StarbookProvider');
  }
  return context;
}

