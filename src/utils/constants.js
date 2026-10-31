// Starbook Kids - Core Constants & Preset Data

export const STORAGE_KEY = 'starbook_kids_data_v1';

export const STAR_VALUES = {
  gold: 4,
  silver: 2,
  bronze: 1
};

export const CHORE_BARCODES = [
  // Bronze (1 pt)
  { code: 'BRONZE-TEETH-01', title: 'Brushed Teeth 2 Mins', name: 'Sparkly Teeth Badge', icon: '🪥', tier: 'bronze', points: 1, reason: 'Brushed Teeth 2 Minutes', desc: 'Sparkly clean smile' },
  { code: 'BRONZE-BED-02', title: 'Made My Bed', name: 'Made My Bed Token', icon: '🛏️', tier: 'bronze', points: 1, reason: 'Made My Bed Nicely', desc: 'Bed made and pillow fluffed' },
  { code: 'BRONZE-TOYS-03', title: 'Put Away Toys', name: 'Tidied Toy Box Tag', icon: '🧸', tier: 'bronze', points: 1, reason: 'Put Away All Toys', desc: 'Playroom neat and tidy' },
  { code: 'BRONZE-SHOES-04', title: 'Shoes by the Door', name: 'Shoes Put Away Tag', icon: '👟', tier: 'bronze', points: 1, reason: 'Put Shoes by Front Door', desc: 'Shoes in shoe rack' },
  { code: 'BRONZE-WATER-05', title: 'Drank Water', name: 'Hydration Hero Badge', icon: '💧', tier: 'bronze', points: 1, reason: 'Drank Water / Healthy Snack', desc: 'Stay hydrated hero' },
  { code: 'BRONZE-HANDS-06', title: 'Washed Hands', name: 'Clean Hands Token', icon: '🧼', tier: 'bronze', points: 1, reason: 'Washed Hands with Soap', desc: 'Clean hands with soap' },

  // Silver (2 pts)
  { code: 'SILVER-HW-01', title: 'Finished Homework', name: 'Homework Completed Tag', icon: '📚', tier: 'silver', points: 2, reason: 'Finished Homework', desc: 'Math, reading, or worksheet' },
  { code: 'SILVER-READ-02', title: 'Read 20 Minutes', name: '20-Min Reading Token', icon: '📖', tier: 'silver', points: 2, reason: 'Read for 20 Minutes', desc: 'Finished story chapter' },
  { code: 'SILVER-VEG-03', title: 'Ate All My Veggies', name: 'Veggie Champion Badge', icon: '🥦', tier: 'silver', points: 2, reason: 'Ate All My Veggies', desc: 'Healthy dinner champion' },
  { code: 'SILVER-PET-04', title: 'Pet Care Hero', name: 'Pet Care Hero Badge', icon: '🐕', tier: 'silver', points: 2, reason: 'Fed / Walked Pet', desc: 'Fed dog, cat, or fish' },
  { code: 'SILVER-MUSIC-05', title: 'Music Practice', name: 'Music Practice Token', icon: '🎵', tier: 'silver', points: 2, reason: 'Practiced Instrument', desc: 'Practiced instrument 20m' },
  { code: 'SILVER-TABLE-06', title: 'Set Dinner Table', name: 'Dinner Table Helper', icon: '🍽️', tier: 'silver', points: 2, reason: 'Set & Cleared Dinner Table', desc: 'Forks, cups, & napkins set' },

  // Gold (4 pts)
  { code: 'GOLD-ROOM-01', title: 'Clean Entire Bedroom', name: 'Clean Bedroom Champion', icon: '🧹', tier: 'gold', points: 4, reason: 'Cleaned Bedroom & Made Bed', desc: 'Floor, closet, & desk cleaned' },
  { code: 'GOLD-HELP-02', title: 'Kind Family Helper', name: 'Kind Family Helper Badge', icon: '🤝', tier: 'gold', points: 4, reason: 'Helped Family Member', desc: 'Helped mom, dad, or sibling' },
  { code: 'GOLD-DISH-03', title: 'Wash / Load Dishes', name: 'Kitchen Dishes Hero', icon: '🧽', tier: 'gold', points: 4, reason: 'Washed / Loaded Dishes', desc: 'Clean kitchen counter & dishes' },
  { code: 'GOLD-LAUNDRY-04', title: 'Fold & Put Laundry Away', name: 'Laundry Folding Master', icon: '🧺', tier: 'gold', points: 4, reason: 'Folded & Put Laundry Away', desc: 'Clothes folded and put in drawers' },
  { code: 'GOLD-PROJECT-05', title: 'Big School Project', name: 'Big Project Superstar', icon: '🌟', tier: 'gold', points: 4, reason: 'Completed Big School Project', desc: 'Extra milestone project completed' },
  { code: 'GOLD-YARD-06', title: 'Yard & Trash Helper', name: 'Yard & Trash Master', icon: '🍂', tier: 'gold', points: 4, reason: 'Helped with Yard / Took Out Trash', desc: 'Binned trash and weeded yard' }
];

export const LEGACY_SIMULATED_ITEMS = [
  { code: 'CHORE-ROOM-01', name: 'Clean Bedroom Token', icon: '🧹', tier: 'gold', points: 4, reason: 'Cleaned Room & Made Bed' },
  { code: 'CHORE-HOMEWORK-02', name: 'Homework Completed', icon: '📚', tier: 'silver', points: 2, reason: 'Finished Math Worksheet' },
  { code: 'CHORE-TEETH-03', name: 'Sparkly Teeth Badge', icon: '🪥', tier: 'bronze', points: 1, reason: 'Brushed Teeth 2 Minutes' },
  { code: 'ITEM-CEREAL-04', name: 'Morning Cereal Box', icon: '🥣', tier: 'bronze', points: 1, reason: 'Ate Healthy Breakfast' },
  { code: 'CHORE-PET-05', name: 'Pet Care Token', icon: '🐕', tier: 'silver', points: 2, reason: 'Fed / Walked Pet' },
  { code: 'CHORE-VEGGIES-06', name: 'Veggie Champion Tag', icon: '🥦', tier: 'silver', points: 2, reason: 'Ate All Veggies at Dinner' },
  { code: 'ITEM-BOOK-07', name: 'Library Storybook', icon: '📖', tier: 'silver', points: 2, reason: 'Read for 20 Minutes' },
  { code: 'CHORE-HELP-08', name: 'Kind Helper Badge', icon: '🤝', tier: 'gold', points: 4, reason: 'Helped Family Member' },
  { code: 'ITEM-TOY-09', name: 'Toy Box Tag', icon: '🧸', tier: 'bronze', points: 1, reason: 'Put Away All Toys' },
  { code: 'CHORE-BED-10', name: 'Made Bed Tag', icon: '🛏️', tier: 'bronze', points: 1, reason: 'Made My Bed' },
  { code: 'CHORE-SHOES-11', name: 'Shoes in Rack', icon: '👟', tier: 'bronze', points: 1, reason: 'Put Shoes by Door' },
  { code: 'CHORE-WATER-12', name: 'Healthy Water Bottle', icon: '💧', tier: 'bronze', points: 1, reason: 'Drank Water / Healthy Snack' },
  { code: 'CHORE-MUSIC-13', name: 'Music Note Tag', icon: '🎵', tier: 'silver', points: 2, reason: 'Practiced Instrument' },
  { code: 'CHORE-DISHES-14', name: 'Clean Plates Tag', icon: '🧽', tier: 'gold', points: 4, reason: 'Washed / Loaded Dishes' },
  { code: 'CHORE-LAUNDRY-15', name: 'Folded Basket', icon: '🧺', tier: 'gold', points: 4, reason: 'Folded & Put Laundry Away' },
  { code: 'MYSTERY-SCAN-99', name: 'Mystery Super Star', icon: '⭐', tier: 'gold', points: 4, reason: 'Awesome Surprise Deed!' }
];

export const ALL_RECOGNIZED_ITEMS = [...CHORE_BARCODES, ...LEGACY_SIMULATED_ITEMS];

export const DEFAULT_REWARDS = [
  { id: 'rew_1', name: '30 Mins Video Games', icon: '🎮', cost: { gold: 1, silver: 1, bronze: 0 } },
  { id: 'rew_2', name: 'Delicious Ice Cream Treat', icon: '🍦', cost: { gold: 1, silver: 0, bronze: 0 } },
  { id: 'rew_3', name: 'Pick Friday Movie Night', icon: '🎬', cost: { gold: 0, silver: 2, bronze: 0 } },
  { id: 'rew_4', name: 'Stay Up 30 Mins Late', icon: '🌙', cost: { gold: 1, silver: 0, bronze: 2 } },
  { id: 'rew_5', name: 'Trip to the Fun Park', icon: '🛝', cost: { gold: 2, silver: 1, bronze: 0 } },
  { id: 'rew_6', name: 'Small Toy / Dollar Store', icon: '🎁', cost: { gold: 3, silver: 0, bronze: 0 } }
];

export function getDefaultData() {
  const now = Date.now();
  const initialBank = { gold: 2, silver: 4, bronze: 6 };
  const initialPoints = (initialBank.gold * 4) + (initialBank.silver * 2) + initialBank.bronze;

  return {
    version: '2.0.0',
    settings: {
      childName: 'Alex',
      parentPin: '1234',
      pinEnabled: true,
      soundEnabled: true,
      accountNumber: 'ACCT-7734-ALEX',
      starValues: { gold: 4, silver: 2, bronze: 1 }
    },
    bank: initialBank,
    pendingStars: [
      {
        id: `star_${now - 1000 * 60 * 15}`,
        barcode: 'CHORE-ROOM-01',
        barcodeName: 'Clean Bedroom Token',
        reason: 'Cleaned Bedroom & Made Bed',
        icon: '🧹',
        tier: 'gold',
        timestamp: now - 1000 * 60 * 15
      },
      {
        id: `star_${now - 1000 * 60 * 45}`,
        barcode: 'CHORE-HOMEWORK-02',
        barcodeName: 'Homework Completed',
        reason: 'Finished Math Worksheet',
        icon: '📚',
        tier: 'silver',
        timestamp: now - 1000 * 60 * 45
      },
      {
        id: `star_${now - 1000 * 60 * 120}`,
        barcode: 'CHORE-TEETH-03',
        barcodeName: 'Sparkly Teeth Badge',
        reason: 'Brushed Teeth 2 Minutes',
        icon: '🪥',
        tier: 'bronze',
        timestamp: now - 1000 * 60 * 120
      }
    ],
    history: [
      {
        id: 'hist_1',
        type: 'approved',
        reason: 'Read for 20 Minutes',
        icon: '📖',
        tier: 'silver',
        barcode: 'ITEM-BOOK-07',
        timestamp: now - 1000 * 60 * 60 * 24
      },
      {
        id: 'hist_2',
        type: 'approved',
        reason: 'Ate All Dinner Veggies',
        icon: '🥦',
        tier: 'silver',
        barcode: 'CHORE-VEGGIES-06',
        timestamp: now - 1000 * 60 * 60 * 30
      }
    ],
    customRewards: DEFAULT_REWARDS,
    cashOutLog: [
      {
        id: 'cash_1',
        rewardName: 'Pick Friday Movie Night',
        rewardIcon: '🎬',
        cost: { gold: 0, silver: 2, bronze: 0 },
        pointCost: 4,
        note: 'Watched Animated Movie',
        timestamp: now - 1000 * 60 * 60 * 36
      }
    ],
    ledger: [
      {
        txId: 'TX-104928',
        timestamp: now - 1000 * 60 * 60 * 24,
        type: 'CREDIT',
        action: 'Chore Approved',
        description: 'Read for 20 Minutes',
        barcode: 'ITEM-BOOK-07',
        icon: '📖',
        delta: { gold: 0, silver: 1, bronze: 0 },
        pointDelta: 2,
        balanceAfter: { gold: 2, silver: 4, bronze: 6, points: initialPoints },
        notes: 'Approved by Parent • Barcode: ITEM-BOOK-07'
      },
      {
        txId: 'TX-104880',
        timestamp: now - 1000 * 60 * 60 * 48,
        type: 'CREDIT',
        action: 'Initial Account Deposit',
        description: 'Starting Star Bank Balance',
        barcode: 'INIT-BANK-DEPOSIT',
        icon: '🏦',
        delta: { gold: 2, silver: 3, bronze: 6 },
        pointDelta: initialPoints - 2,
        balanceAfter: { gold: 2, silver: 3, bronze: 6, points: initialPoints - 2 },
        notes: 'Initial account balance opened'
      }
    ]
  };
}

