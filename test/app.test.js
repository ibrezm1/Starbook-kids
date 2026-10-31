// Automated tests for Starbook Kids application logic
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Test 1: Verify barcode-gen.js logic
test('BarcodeGenerator encodes and generates valid SVG', () => {
  const code = fs.readFileSync(path.join(__dirname, '../js/barcode-gen.js'), 'utf8');
  // Mock window
  const windowMock = {};
  const evalFunc = new Function('window', code);
  evalFunc(windowMock);

  const generator = windowMock.barcodeGenerator;
  assert.ok(generator, 'barcodeGenerator should be initialized on window');

  const svg = generator.generateSVG('CHORE-ROOM-01');
  assert.ok(svg.includes('<svg'), 'Output should contain an <svg> tag');
  assert.ok(svg.includes('CHORE-ROOM-01'), 'Output should include the label text');
  assert.ok(svg.includes('<rect'), 'Output should render bar rectangles');
});

// Test 2: Verify StarScanner simulated items
test('StarScanner contains essential chore items and handles callbacks', () => {
  const code = fs.readFileSync(path.join(__dirname, '../js/scanner.js'), 'utf8');
  const windowMock = {
    soundController: { playScanBeep: () => {} },
    confettiEngine: { burst: () => {} }
  };
  const evalFunc = new Function('window', 'BarcodeDetector', 'navigator', 'requestAnimationFrame', 'cancelAnimationFrame', code);
  evalFunc(windowMock, undefined, { mediaDevices: {} }, () => 1, () => {});

  const scanner = windowMock.starScanner;
  assert.ok(scanner, 'starScanner should be initialized');
  assert.ok(scanner.simulatedItems.length >= 6, 'Should have multiple preset chore items');

  let detectedResult = null;
  scanner.onBarcodeDetected = (res) => {
    detectedResult = res;
  };

  scanner.simulateScan('CHORE-ROOM-01');
  assert.ok(detectedResult, 'Callback should be triggered by simulateScan');
  assert.strictEqual(detectedResult.barcode, 'CHORE-ROOM-01');
  assert.strictEqual(detectedResult.name, 'Clean Bedroom Token');
});

// Test 3: StarbookApp state logic and parent operations
test('StarbookApp handles data, points, approvals, rejections, and cash outs', () => {
  // Mock localStorage
  const storage = {};
  const localStorageMock = {
    getItem: (key) => storage[key] || null,
    setItem: (key, val) => { storage[key] = val.toString(); },
    removeItem: (key) => { delete storage[key]; }
  };

  // Mock DOM
  const windowMock = {
    localStorage: localStorageMock,
    soundController: {
      playScanBeep: () => {},
      playStarChime: () => {},
      playFanfare: () => {},
      playCashOut: () => {},
      playPop: () => {},
      playReject: () => {}
    },
    confettiEngine: { burst: () => {}, celebrateBig: () => {} },
    starScanner: { onBarcodeDetected: null },
    addEventListener: () => {}
  };

  const documentMock = {
    getElementById: () => null,
    querySelectorAll: () => [],
    querySelector: () => null,
    body: { classList: { add: () => {}, remove: () => {} }, appendChild: () => {} },
    createElement: () => ({ style: {}, appendChild: () => {}, classList: { add: () => {} }, remove: () => {} })
  };

  const appCode = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
  const evalFunc = new Function('window', 'document', 'localStorage', 'confirm', 'alert', 'prompt', 'setInterval', appCode);
  evalFunc(windowMock, documentMock, localStorageMock, () => true, () => {}, () => '56', () => 1);

  // Instantiate
  const app = new windowMock.StarbookApp();

  // 1. Initial points calculation
  // Bank has 2 gold (8), 4 silver (8), 6 bronze (6) = 22 pts (1 Gold = 2 Silver = 4 Bronze)
  const points = app.calculatePoints();
  assert.strictEqual(points, 22, 'Initial demo bank points should be 22 (1 Gold = 4pts, 1 Silver = 2pts, 1 Bronze = 1pt)');

  // 2. Pending star approve flow
  const initialPendingCount = app.data.pendingStars.length;
  assert.ok(initialPendingCount > 0, 'Should have pending demo stars');
  const starToApprove = app.data.pendingStars[0];
  const starId = starToApprove.id;
  const initialGold = app.data.bank.gold;

  app.approveStar(starId, 'gold');
  assert.strictEqual(app.data.pendingStars.length, initialPendingCount - 1, 'Pending count should decrease by 1');
  assert.strictEqual(app.data.bank.gold, initialGold + 1, 'Gold bank count should increase by 1');
  assert.strictEqual(app.data.history[0].type, 'approved', 'History should record approval');

  // 3. Reject flow
  const starToReject = app.data.pendingStars[0];
  const rejectId = starToReject.id;
  app.rejectStar(rejectId);
  assert.strictEqual(app.data.history[0].type, 'rejected', 'History should record rejection');

  // 4. Cash out flow
  const reward = app.data.customRewards[0]; // 30 Mins Video Games (1 Gold, 1 Silver)
  const currentGold = app.data.bank.gold;
  const currentSilver = app.data.bank.silver;
  const initialCashLogLength = app.data.cashOutLog.length;

  app.cashOutReward(reward.id);

  assert.strictEqual(app.data.bank.gold, currentGold - reward.cost.gold, 'Gold stars should be deducted');
  assert.strictEqual(app.data.bank.silver, currentSilver - reward.cost.silver, 'Silver stars should be deducted');
  assert.strictEqual(app.data.cashOutLog.length, initialCashLogLength + 1, 'Cash out log should record transaction');
  assert.strictEqual(app.data.cashOutLog[0].rewardName, reward.name);

  // 5. Verify data persisted to localStorageMock
  const savedData = JSON.parse(storage['starbook_kids_data_v1']);
  assert.strictEqual(savedData.bank.gold, app.data.bank.gold, 'Persisted bank should match in-memory state');

  // 6. Test Quick Tier Starter for Bronze Star
  const pendingBeforeTier = app.data.pendingStars.length;
  app.startTierChore('bronze', 'Brushed Teeth 2 Mins', '🪥', 'CHORE-TEETH-03');
  assert.strictEqual(app.data.pendingStars.length, pendingBeforeTier + 1, 'Pending stars should have new bronze entry');
  assert.strictEqual(app.data.pendingStars[0].tier, 'bronze', 'New pending star should be bronze tier');

  // 7. Test Star Exchange Station (2 Bronze -> 1 Silver, 2 Silver -> 1 Gold & Breakdowns)
  app.data.bank.bronze = 6;
  app.data.bank.silver = 3;
  app.data.bank.gold = 1;

  // Upgrade: 2 Bronze -> 1 Silver
  app.exchangeStars('bronze-to-silver');
  assert.strictEqual(app.data.bank.bronze, 4, 'Bronze should decrease by 2 (from 6 to 4)');
  assert.strictEqual(app.data.bank.silver, 4, 'Silver should increase by 1 (from 3 to 4)');

  // Upgrade: 2 Silver -> 1 Gold
  app.exchangeStars('silver-to-gold');
  assert.strictEqual(app.data.bank.silver, 2, 'Silver should decrease by 2 (from 4 to 2)');
  assert.strictEqual(app.data.bank.gold, 2, 'Gold should increase by 1 (from 1 to 2)');

  // Breakdown: 1 Gold -> 2 Silver
  app.exchangeStars('gold-to-silver');
  assert.strictEqual(app.data.bank.gold, 1, 'Gold should decrease by 1 (from 2 to 1)');
  assert.strictEqual(app.data.bank.silver, 4, 'Silver should increase by 2 (from 2 to 4)');

  // Breakdown: 1 Silver -> 2 Bronze
  app.exchangeStars('silver-to-bronze');
  assert.strictEqual(app.data.bank.silver, 3, 'Silver should decrease by 1 (from 4 to 3)');
  assert.strictEqual(app.data.bank.bronze, 6, 'Bronze should increase by 2 (from 4 to 6)');

  // 8. Test Bank Transaction Ledger recording
  const txCountBefore = (app.data.ledger || []).length;
  app.recordLedgerTransaction({
    type: 'CREDIT',
    action: 'Chore Approved',
    description: 'Cleaned Room',
    barcode: 'GOLD-ROOM-01',
    icon: '🧹',
    delta: { gold: 1, silver: 0, bronze: 0 },
    pointDelta: 4,
    notes: 'Test ledger entry'
  });

  assert.strictEqual(app.data.ledger.length, txCountBefore + 1, 'Ledger should record new transaction');
  const latestTx = app.data.ledger[0];
  assert.strictEqual(latestTx.type, 'CREDIT');
  assert.strictEqual(latestTx.description, 'Cleaned Room');
  assert.strictEqual(latestTx.delta.gold, 1);
  assert.ok(latestTx.balanceAfter, 'Transaction should include running balance after event');

  // 9. Test Phone-to-Phone JSON Export & Import
  const exportedJSON = JSON.stringify({
    app: 'Starbook Kids',
    version: '2.0.0',
    data: {
      settings: { childName: 'TestChild', parentPin: '9999' },
      bank: { gold: 10, silver: 20, bronze: 30 },
      ledger: [
        { txId: 'TX-TEST-1', type: 'CREDIT', description: 'Test', delta: { gold: 10, silver: 20, bronze: 30 }, balanceAfter: { gold: 10, silver: 20, bronze: 30, points: 140 } }
      ]
    }
  });

  const importResult = app.importBackupJSON(exportedJSON);
  assert.strictEqual(importResult, true, 'Import should succeed');
  assert.strictEqual(app.data.settings.childName, 'TestChild', 'Child name should update to imported value');
  assert.strictEqual(app.data.bank.gold, 10, 'Bank gold should match imported value');

  // 10. Test Base64 Sync Code generation and decode
  const syncCode = app.generateSyncCode();
  assert.ok(syncCode.startsWith('STARBOOK-SYNC:'), 'Sync code should start with prefix');
  const syncApplied = app.applySyncCode(syncCode);
  assert.strictEqual(syncApplied, true, 'Applying sync code should succeed');
});

// Test 4: Currency conversion ratio (1 Gold = 2 Silver, 1 Silver = 2 Bronze) and Ledger Integrity
test('Currency ratio: 1 Gold = 2 Silver = 4 Bronze with double-entry integrity', () => {
  const storage = {};
  const localStorageMock = {
    getItem: (key) => storage[key] || null,
    setItem: (key, val) => { storage[key] = val.toString(); },
    removeItem: (key) => { delete storage[key]; }
  };

  const windowMock = {
    localStorage: localStorageMock,
    soundController: {
      playScanBeep: () => {},
      playStarChime: () => {},
      playFanfare: () => {},
      playCashOut: () => {},
      playPop: () => {},
      playReject: () => {},
      playExchange: () => {}
    },
    confettiEngine: { burst: () => {}, celebrateBig: () => {} },
    starScanner: { onBarcodeDetected: null },
    addEventListener: () => {}
  };

  const documentMock = {
    getElementById: () => null,
    querySelectorAll: () => [],
    querySelector: () => null,
    body: { classList: { add: () => {}, remove: () => {} }, appendChild: () => {} },
    createElement: () => ({ style: {}, appendChild: () => {}, classList: { add: () => {} }, remove: () => {} })
  };

  const appCode = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
  const evalFunc = new Function('window', 'document', 'localStorage', 'confirm', 'alert', 'prompt', 'setInterval', appCode);
  evalFunc(windowMock, documentMock, localStorageMock, () => true, () => {}, () => '56', () => 1);

  const app = new windowMock.StarbookApp();

  // 1. Verify point valuation equivalence
  const oneGoldPts = app.calculatePoints({ gold: 1, silver: 0, bronze: 0 });
  const twoSilverPts = app.calculatePoints({ gold: 0, silver: 2, bronze: 0 });
  const fourBronzePts = app.calculatePoints({ gold: 0, silver: 0, bronze: 4 });

  assert.strictEqual(oneGoldPts, 4, '1 Gold Star must equal 4 points');
  assert.strictEqual(twoSilverPts, 4, '2 Silver Stars must equal 4 points (1 Gold = 2 Silver)');
  assert.strictEqual(fourBronzePts, 4, '4 Bronze Stars must equal 4 points (1 Silver = 2 Bronze)');
  assert.strictEqual(oneGoldPts, twoSilverPts, '1 Gold must equal 2 Silver');
  assert.strictEqual(twoSilverPts, fourBronzePts, '2 Silver must equal 4 Bronze');

  // 2. Set controlled bank: 0 Gold, 0 Silver, 4 Bronze
  app.data.bank = { gold: 0, silver: 0, bronze: 4 };
  app.data.ledger = app.generateInitialLedger(app.data.bank);
  const initialPts = app.calculatePoints();
  assert.strictEqual(initialPts, 4);

  // Upgrade 2 Bronze -> 1 Silver
  app.exchangeStars('bronze-to-silver');
  assert.deepStrictEqual(app.data.bank, { gold: 0, silver: 1, bronze: 2 });
  assert.strictEqual(app.calculatePoints(), initialPts, 'Exchange must be value-neutral (4 pts)');

  // Upgrade remaining 2 Bronze -> 1 Silver (now 2 Silver, 0 Bronze)
  app.exchangeStars('bronze-to-silver');
  assert.deepStrictEqual(app.data.bank, { gold: 0, silver: 2, bronze: 0 });
  assert.strictEqual(app.calculatePoints(), initialPts, 'Exchange must be value-neutral (4 pts)');

  // Upgrade 2 Silver -> 1 Gold (now 1 Gold, 0 Silver, 0 Bronze)
  app.exchangeStars('silver-to-gold');
  assert.deepStrictEqual(app.data.bank, { gold: 1, silver: 0, bronze: 0 });
  assert.strictEqual(app.calculatePoints(), initialPts, 'Exchange must be value-neutral (4 pts)');

  // Breakdown 1 Gold -> 2 Silver
  app.exchangeStars('gold-to-silver');
  assert.deepStrictEqual(app.data.bank, { gold: 0, silver: 2, bronze: 0 });
  assert.strictEqual(app.calculatePoints(), initialPts, 'Breakdown must be value-neutral (4 pts)');

  // Breakdown 1 Silver -> 2 Bronze
  app.exchangeStars('silver-to-bronze');
  assert.deepStrictEqual(app.data.bank, { gold: 0, silver: 1, bronze: 2 });
  assert.strictEqual(app.calculatePoints(), initialPts, 'Breakdown must be value-neutral (4 pts)');

  // 3. Verify ledger integrity
  const integrity = app.verifyLedgerIntegrity();
  assert.strictEqual(integrity.isHealthy, true, 'Ledger transactions must balance with current bank');
});

// Test 5: Kid Star Passbook (Transaction Book) rendering, filters, and receipt inspection
test('Kid Star Passbook allows kids to view, filter, and inspect their transaction records', () => {
  const storage = {};
  const localStorageMock = {
    getItem: (key) => storage[key] || null,
    setItem: (key, val) => { storage[key] = val.toString(); },
    removeItem: (key) => { delete storage[key]; }
  };

  const createMockElem = (overrides = {}) => ({
    addEventListener: () => {},
    classList: { add: () => {}, remove: () => {} },
    innerHTML: '',
    textContent: '',
    scrollIntoView: () => {},
    ...overrides
  });

  const containerMock = createMockElem();
  const emptyMock = createMockElem();
  const countMock = createMockElem();
  const statMock = createMockElem();

  const domElements = {
    'btn-jump-to-passbook': createMockElem(),
    'btn-passbook-start-first': createMockElem(),
    'kid-passbook-stream-container': containerMock,
    'kid-passbook-empty-state': emptyMock,
    'kid-passbook-count-text': countMock,
    'kid-passbook-stat-earned': statMock,
    'kid-passbook-stat-spent': statMock,
    'kid-passbook-stat-upgrades': statMock,
    'kid-receipt-icon-container': createMockElem(),
    'kid-receipt-badge': createMockElem(),
    'kid-receipt-title': createMockElem(),
    'kid-receipt-barcode': createMockElem(),
    'kid-receipt-tx-id': createMockElem(),
    'kid-receipt-time': createMockElem(),
    'kid-receipt-delta': createMockElem(),
    'kid-receipt-balance': createMockElem(),
    'kid-receipt-stamp': createMockElem(),
    'kid-receipt-acct-num': createMockElem()
  };

  const documentMock = {
    getElementById: (id) => domElements[id] || null,
    querySelectorAll: () => [],
    querySelector: () => null,
    body: { classList: { add: () => {}, remove: () => {} }, appendChild: () => {} },
    createElement: () => ({ style: {}, appendChild: () => {}, classList: { add: () => {} }, remove: () => {} })
  };

  const windowMock = {
    localStorage: localStorageMock,
    soundController: {
      playScanBeep: () => {},
      playStarChime: () => {},
      playFanfare: () => {},
      playCashOut: () => {},
      playPop: () => {},
      playReject: () => {},
      playExchange: () => {}
    },
    confettiEngine: { burst: () => {}, celebrateBig: () => {} },
    starScanner: { onBarcodeDetected: null },
    addEventListener: () => {}
  };

  const appCode = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
  const evalFunc = new Function('window', 'document', 'localStorage', 'confirm', 'alert', 'prompt', 'setInterval', appCode);
  evalFunc(windowMock, documentMock, localStorageMock, () => true, () => {}, () => '56', () => 1);

  const app = new windowMock.StarbookApp();

  // Verify renderKidPassbook populates stream container
  app.renderKidPassbook();
  assert.ok(containerMock.innerHTML.includes('kid-passbook-item'), 'Passbook container should contain rendered passbook cards');
  assert.ok(containerMock.innerHTML.includes('kid-passbook-stamp'), 'Passbook items should include official rubber stamps');

  // Verify filter by credits
  app.activeKidPassbookFilter = 'credits';
  app.renderKidPassbook();
  assert.ok(containerMock.innerHTML.includes('passbook-type-credit'), 'Should render credit items when filtered to credits');

  // Verify filter by debits
  app.activeKidPassbookFilter = 'debits';
  app.renderKidPassbook();
  assert.ok(containerMock.innerHTML.includes('passbook-type-debit') || containerMock.innerHTML === '', 'Filter by debits should execute cleanly');

  // Verify modal receipt inspection
  const testTx = app.data.ledger[0];
  assert.ok(testTx, 'Should have at least one transaction in ledger');
  app.openKidReceiptModal(testTx.txId);
  assert.strictEqual(domElements['kid-receipt-tx-id'].textContent, testTx.txId, 'Receipt modal should display exact transaction ID');
  assert.strictEqual(domElements['kid-receipt-title'].textContent, testTx.description, 'Receipt modal should display chore description');
});
