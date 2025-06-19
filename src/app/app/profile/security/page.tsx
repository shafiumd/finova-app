// src/app/(app)/profile/security/page.tsx
'use client';

import SubPageHeader from '@/components/SubPageHeader';
import { useState } from 'react';

export default function SecurityPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    // Placeholder for update logic
    // await account.updatePassword(newPassword, oldPassword);
    alert('Password changed successfully! (Placeholder)');
  };

  return (
    <div>
      <SubPageHeader title="Security" />
      <div className="p-4 space-y-8">
        {/* Change Password Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="input-field" />
            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-field" />
            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field" />
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg">Update Password</button>
          </form>
        </div>

        {/* 2FA Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Two-Factor Authentication (2FA)</h2>
          <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account.</p>
          <button className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg">Enable 2FA</button>
        </div>
      </div>
      {/* Helper style for inputs */}
      <style jsx>{`.input-field { display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; }`}</style>
    </div>
  );
}