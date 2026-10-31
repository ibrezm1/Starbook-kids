import React from 'react';
import ScanModal from './ScanModal';
import ReasonModal from './ReasonModal';
import StarAwardModal from './StarAwardModal';
import CelebrationModal from './CelebrationModal';
import PinGateModal from './PinGateModal';
import CustomCashoutModal from './CustomCashoutModal';
import ManualStarModal from './ManualStarModal';
import BarcodeBinderModal from './BarcodeBinderModal';
import KidReceiptModal from './KidReceiptModal';

export default function ModalRoot() {
  return (
    <>
      <ScanModal />
      <ReasonModal />
      <StarAwardModal />
      <CelebrationModal />
      <PinGateModal />
      <CustomCashoutModal />
      <ManualStarModal />
      <BarcodeBinderModal />
      <KidReceiptModal />
    </>
  );
}

