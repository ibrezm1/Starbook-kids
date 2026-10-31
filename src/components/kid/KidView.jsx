import React from 'react';
import KidBankBanner from './KidBankBanner';
import BigScanButton from './BigScanButton';
import TierStarterCards from './TierStarterCards';
import StarExchangeStation from './StarExchangeStation';
import KidPendingBox from './KidPendingBox';
import KidPassbook from './KidPassbook';
import QuickBarcodesShelf from './QuickBarcodesShelf';

export default function KidView() {
  return (
    <div id="view-kid" className="space-y-6">
      <KidBankBanner />
      <BigScanButton />
      <TierStarterCards />
      <StarExchangeStation />
      <KidPendingBox />
      <KidPassbook />
      <QuickBarcodesShelf />
    </div>
  );
}

