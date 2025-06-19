// src/app/(app)/profile/notifications/page.tsx
'use client';

import SubPageHeader from '@/components/SubPageHeader';
import { useState } from 'react';

// A simple reusable toggle switch component
const ToggleSwitch = ({ label, enabled, onToggle }: { label: string, enabled: boolean, onToggle: (isEnabled: boolean) => void }) => (
  <div className="flex items-center justify-between">
    <span className="font-semibold text-gray-700">{label}</span>
    <button
      onClick={() => onToggle(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

export default function NotificationsPage() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(false);

  return (
    <div>
      <SubPageHeader title="Notifications" />
      <div className="p-4">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <ToggleSwitch label="Push Notifications" enabled={pushEnabled} onToggle={setPushEnabled} />
          <ToggleSwitch label="Email Alerts" enabled={emailEnabled} onToggle={setEmailEnabled} />
          <ToggleSwitch label="Transaction Alerts" enabled={transactionAlerts} onToggle={setTransactionAlerts} />
        </div>
      </div>
    </div>
  );
}