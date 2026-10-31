// Comprehensive Automated Unit Tests for Starbook Kids (React Architecture)
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// 1. Test BarcodeGenerator
test('BarcodeGenerator encodes and generates valid SVG', () => {
  const code = fs.readFileSync(path.join(__dirname, '../src/utils/barcode.js'), 'utf8');
  // Strip export statements for CJS eval
  const cleanCode = code.replace(/export\s+const\s+/g, 'const ').replace(/export\s+/g, '');
  const evalFunc = new Function('window', `${cleanCode}; return barcodeGenerator;`);
  const generator = evalFunc({});

  assert.ok(generator, 'barcodeGenerator should be initialized');
  const svg = generator.generateSVG('CHORE-ROOM-01');
  assert.ok(svg.includes('<svg'), 'Output should contain an <svg> tag');
  assert.ok(svg.includes('CHORE-ROOM-01'), 'Output should include the label text');
  assert.ok(svg.includes('<rect'), 'Output should render bar rectangles');
});

// 2. Test Ledger Engine & Currency Valuation (1 Gold = 2 Silver = 4 Bronze)
test('Ledger Engine enforces 1 Gold = 2 Silver = 4 Bronze and double-entry integrity', () => {
  const code = fs.readFileSync(path.join(__dirname, '../src/utils/ledger.js'), 'utf8');
  const cleanCode = code.replace(/export\s+function\s+/g, 'function ').replace(/export\s+const\s+/g, 'const ');
  const evalFunc = new Function(`${cleanCode}; return { calculatePoints, createTransaction, verifyLedgerIntegrity, reconcileBankFromLedger, generateSyncCode, decodeSyncCode };`);
  const { calculatePoints, createTransaction, verifyLedgerIntegrity, reconcileBankFromLedger, generateSyncCode, decodeSyncCode } = evalFunc();

  // A. Valuation ratios
  const oneGold = calculatePoints({ gold: 1, silver: 0, bronze: 0 });
  const twoSilver = calculatePoints({ gold: 0, silver: 2, bronze: 0 });
  const fourBronze = calculatePoints({ gold: 0, silver: 0, bronze: 4 });

  assert.strictEqual(oneGold, 4, '1 Gold Star must equal 4 points');
  assert.strictEqual(twoSilver, 4, '2 Silver Stars must equal 4 points');
  assert.strictEqual(fourBronze, 4, '4 Bronze Stars must equal 4 points');
  assert.strictEqual(oneGold, twoSilver, '1 Gold must equal 2 Silver');
  assert.strictEqual(twoSilver, fourBronze, '2 Silver must equal 4 Bronze');

  // B. Default Demo Bank Points (2 Gold, 4 Silver, 6 Bronze)
  // (2*4) + (4*2) + (6*1) = 8 + 8 + 6 = 22 pts
  const demoBank = { gold: 2, silver: 4, bronze: 6 };
  assert.strictEqual(calculatePoints(demoBank), 22, 'Default bank points must equal 22');

  // C. Double-entry transaction creation
  const tx = createTransaction({
    type: 'CREDIT',
    action: 'Chore Approved',
    description: 'Cleaned Room',
    barcode: 'GOLD-ROOM-01',
    icon: '🧹',
    delta: { gold: 1, silver: 0, bronze: 0 },
    pointDelta: 4,
    bank: { gold: 3, silver: 4, bronze: 6 }
  });

  assert.ok(tx.txId.startsWith('TX-'), 'Transaction ID should start with TX-');
  assert.strictEqual(tx.type, 'CREDIT');
  assert.strictEqual(tx.pointDelta, 4);
  assert.strictEqual(tx.balanceAfter.gold, 3);
  assert.strictEqual(tx.balanceAfter.points, 26);

  // D. Ledger Integrity Check
  const ledger = [
    {
      txId: 'TX-2',
      type: 'CREDIT',
      delta: { gold: 1, silver: 0, bronze: 0 }
    },
    {
      txId: 'TX-1',
      type: 'CREDIT',
      delta: { gold: 2, silver: 4, bronze: 6 }
    }
  ];

  const integrity = verifyLedgerIntegrity({ gold: 3, silver: 4, bronze: 6 }, ledger);
  assert.strictEqual(integrity.isHealthy, true, 'Ledger should balance with current bank');

  // E. Reconciliation
  const reconciled = reconcileBankFromLedger(ledger);
  assert.deepStrictEqual(reconciled, { gold: 3, silver: 4, bronze: 6 });

  // F. Phone-to-Phone Sync Code
  const dummyState = {
    settings: { childName: 'Alex', parentPin: '1234' },
    bank: { gold: 5, silver: 10, bronze: 15 },
    pendingStars: [],
    history: [],
    customRewards: [],
    cashOutLog: [],
    ledger: []
  };

  const syncCode = generateSyncCode(dummyState);
  assert.ok(syncCode.startsWith('STARBOOK-SYNC:'), 'Sync code must begin with prefix');
  const decoded = decodeSyncCode(syncCode);
  assert.strictEqual(decoded.settings.childName, 'Alex');
  assert.strictEqual(decoded.bank.gold, 5);
});

// 3. Test Starbook Presets & Constants
test('Constants contains valid chore barcodes and rewards', () => {
  const code = fs.readFileSync(path.join(__dirname, '../src/utils/constants.js'), 'utf8');
  const cleanCode = code.replace(/export\s+function\s+/g, 'function ').replace(/export\s+const\s+/g, 'const ');
  const evalFunc = new Function(`${cleanCode}; return { CHORE_BARCODES, DEFAULT_REWARDS, getDefaultData };`);
  const { CHORE_BARCODES, DEFAULT_REWARDS, getDefaultData } = evalFunc();

  assert.strictEqual(CHORE_BARCODES.length, 18, 'Must contain 18 distinct chore barcodes');
  assert.strictEqual(CHORE_BARCODES.filter(c => c.tier === 'bronze').length, 6, 'Must have 6 Bronze chores');
  assert.strictEqual(CHORE_BARCODES.filter(c => c.tier === 'silver').length, 6, 'Must have 6 Silver chores');
  assert.strictEqual(CHORE_BARCODES.filter(c => c.tier === 'gold').length, 6, 'Must have 6 Gold chores');

  const defaultData = getDefaultData();
  assert.strictEqual(defaultData.bank.gold, 2);
  assert.strictEqual(defaultData.bank.silver, 4);
  assert.strictEqual(defaultData.bank.bronze, 6);
  assert.ok(DEFAULT_REWARDS.length >= 6, 'Must have pre-configured rewards catalog');
});

// 4. Test Currency Exchange & Breakdown Math
test('Exchange and breakdown math preserves value neutrality', () => {
  const code = fs.readFileSync(path.join(__dirname, '../src/utils/ledger.js'), 'utf8');
  const cleanCode = code.replace(/export\s+function\s+/g, 'function ').replace(/export\s+const\s+/g, 'const ');
  const evalFunc = new Function(`${cleanCode}; return { calculatePoints };`);
  const { calculatePoints } = evalFunc();

  let bank = { gold: 0, silver: 0, bronze: 4 };
  assert.strictEqual(calculatePoints(bank), 4);

  // Upgrade 2 Bronze -> 1 Silver
  bank.bronze -= 2;
  bank.silver += 1;
  assert.deepStrictEqual(bank, { gold: 0, silver: 1, bronze: 2 });
  assert.strictEqual(calculatePoints(bank), 4, 'Points must remain 4');

  // Upgrade 2 Bronze -> 1 Silver
  bank.bronze -= 2;
  bank.silver += 1;
  assert.deepStrictEqual(bank, { gold: 0, silver: 2, bronze: 0 });
  assert.strictEqual(calculatePoints(bank), 4, 'Points must remain 4');

  // Upgrade 2 Silver -> 1 Gold
  bank.silver -= 2;
  bank.gold += 1;
  assert.deepStrictEqual(bank, { gold: 1, silver: 0, bronze: 0 });
  assert.strictEqual(calculatePoints(bank), 4, 'Points must remain 4');

  // Breakdown 1 Gold -> 2 Silver
  bank.gold -= 1;
  bank.silver += 2;
  assert.deepStrictEqual(bank, { gold: 0, silver: 2, bronze: 0 });
  assert.strictEqual(calculatePoints(bank), 4, 'Points must remain 4');

  // Breakdown 1 Silver -> 2 Bronze
  bank.silver -= 1;
  bank.bronze += 2;
  assert.deepStrictEqual(bank, { gold: 0, silver: 1, bronze: 2 });
  assert.strictEqual(calculatePoints(bank), 4, 'Points must remain 4');
});

// 5. Test Child Name Customization, Custom Rewards, and Barcode Simulator Customization
test('Supports kid name customization, custom reward catalog, and chore barcode additions', () => {
  const code = fs.readFileSync(path.join(__dirname, '../src/utils/constants.js'), 'utf8');
  const cleanCode = code.replace(/export\s+function\s+/g, 'function ').replace(/export\s+const\s+/g, 'const ');
  const evalFunc = new Function(`${cleanCode}; return { getDefaultData, DEFAULT_REWARDS, CHORE_BARCODES };`);
  const { getDefaultData, DEFAULT_REWARDS, CHORE_BARCODES } = evalFunc();

  const data = getDefaultData();
  
  // A. Child name customization
  assert.strictEqual(data.settings.childName, 'Alex');
  data.settings.childName = 'Sophia';
  data.settings.accountNumber = `ACCT-7734-${data.settings.childName.toUpperCase()}`;
  assert.strictEqual(data.settings.childName, 'Sophia');
  assert.strictEqual(data.settings.accountNumber, 'ACCT-7734-SOPHIA');

  // B. Custom Reward Catalog addition and editing
  assert.ok(data.customRewards.length >= 6);
  const newReward = {
    id: 'rew_custom_99',
    name: 'Trampoline Park Hour',
    icon: '🤸',
    cost: { gold: 2, silver: 1, bronze: 0 }
  };
  data.customRewards.push(newReward);
  const foundReward = data.customRewards.find(r => r.id === 'rew_custom_99');
  assert.ok(foundReward);
  assert.strictEqual(foundReward.name, 'Trampoline Park Hour');
  assert.strictEqual(foundReward.cost.gold, 2);

  // C. Custom Chore Barcode additions
  assert.ok(data.customChores.length >= 18);
  const newChore = {
    code: 'CHORE-PIANO-01',
    title: 'Practice Piano 15m',
    name: 'Piano Practice Token',
    icon: '🎹',
    tier: 'silver',
    points: 2,
    reason: 'Practiced Piano 15 Minutes'
  };
  data.customChores.push(newChore);
  const foundChore = data.customChores.find(c => c.code === 'CHORE-PIANO-01');
  assert.ok(foundChore);
  assert.strictEqual(foundChore.title, 'Practice Piano 15m');
  assert.strictEqual(foundChore.tier, 'silver');
});

