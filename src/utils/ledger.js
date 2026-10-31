// Starbook Kids - Banking Ledger Engine & Currency Utility

export const STAR_VALUES = {
  gold: 4,
  silver: 2,
  bronze: 1
};

export function calculatePoints(bank = {}, starValues = STAR_VALUES) {
  const vals = starValues || STAR_VALUES;
  return ((bank.gold || 0) * (vals.gold || 4)) +
         ((bank.silver || 0) * (vals.silver || 2)) +
         ((bank.bronze || 0) * (vals.bronze || 1));
}

export function createTransaction({
  type, // 'CREDIT', 'DEBIT', 'TRANSFER', 'ADJUSTMENT'
  action = 'Transaction',
  description = 'Account Activity',
  barcode = 'N/A',
  icon = '⭐',
  delta = { gold: 0, silver: 0, bronze: 0 },
  pointDelta = 0,
  bank = { gold: 0, silver: 0, bronze: 0 },
  starValues = STAR_VALUES,
  notes = ''
}) {
  const txId = `TX-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  const currentPoints = calculatePoints(bank, starValues);

  return {
    txId,
    timestamp: Date.now(),
    type,
    action,
    description,
    barcode,
    icon,
    delta: {
      gold: delta.gold || 0,
      silver: delta.silver || 0,
      bronze: delta.bronze || 0
    },
    pointDelta: pointDelta !== undefined ? pointDelta : 0,
    balanceAfter: {
      gold: bank.gold || 0,
      silver: bank.silver || 0,
      bronze: bank.bronze || 0,
      points: currentPoints
    },
    notes: notes || ''
  };
}

export function verifyLedgerIntegrity(bank = {}, ledger = []) {
  let netGold = 0, netSilver = 0, netBronze = 0;

  const reversed = [...ledger].reverse();
  reversed.forEach(tx => {
    if (tx.delta) {
      netGold += (tx.delta.gold || 0);
      netSilver += (tx.delta.silver || 0);
      netBronze += (tx.delta.bronze || 0);
    }
  });

  const isHealthy = ((bank.gold || 0) === netGold) &&
                    ((bank.silver || 0) === netSilver) &&
                    ((bank.bronze || 0) === netBronze);

  return {
    isHealthy,
    ledgerTotal: { gold: netGold, silver: netSilver, bronze: netBronze },
    currentBank: { gold: bank.gold || 0, silver: bank.silver || 0, bronze: bank.bronze || 0 },
    txCount: ledger.length
  };
}

export function reconcileBankFromLedger(ledger = []) {
  let netGold = 0, netSilver = 0, netBronze = 0;
  ledger.forEach(tx => {
    if (tx.delta) {
      netGold += (tx.delta.gold || 0);
      netSilver += (tx.delta.silver || 0);
      netBronze += (tx.delta.bronze || 0);
    }
  });

  return {
    gold: Math.max(0, netGold),
    silver: Math.max(0, netSilver),
    bronze: Math.max(0, netBronze)
  };
}

export function generateSyncCode(data) {
  const payload = {
    app: 'Starbook Kids',
    version: '2.0.0',
    exportTime: Date.now(),
    data: {
      settings: data.settings,
      bank: data.bank,
      pendingStars: data.pendingStars,
      history: data.history,
      customRewards: data.customRewards,
      cashOutLog: data.cashOutLog,
      ledger: data.ledger
    }
  };

  const jsonStr = JSON.stringify(payload);
  const base64 = typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(jsonStr))) : Buffer.from(jsonStr).toString('base64');
  return `STARBOOK-SYNC:${base64}`;
}

export function decodeSyncCode(syncCode) {
  if (!syncCode || !syncCode.startsWith('STARBOOK-SYNC:')) {
    throw new Error('Invalid Starbook Sync Code format.');
  }

  const base64 = syncCode.replace('STARBOOK-SYNC:', '').trim();
  const jsonStr = typeof atob === 'function' ? decodeURIComponent(escape(atob(base64))) : Buffer.from(base64, 'base64').toString('utf8');
  const parsed = JSON.parse(jsonStr);

  if (!parsed.data || !parsed.data.bank || !parsed.data.settings) {
    throw new Error('Sync code is missing bank or settings data.');
  }

  return parsed.data;
}

export function formatDateTime(timestamp) {
  if (!timestamp) return 'N/A';
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Just now';
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateTime(timestamp);
}

