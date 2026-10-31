import React from 'react';
import { useStarbook } from '../../hooks/useStarbook';

export default function ToastContainer() {
  const { toasts } = useStarbook();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => {
        let bgClass = 'toast-info';
        if (toast.type === 'success') bgClass = 'toast-success';
        if (toast.type === 'error') bgClass = 'toast-error';

        return (
          <div key={toast.id} className={`app-toast ${bgClass}`}>
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}

