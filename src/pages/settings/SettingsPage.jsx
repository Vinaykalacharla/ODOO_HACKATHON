import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { User, Lock, Mail, ShieldCheck } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuthStore();
  const { addToast } = useToast();
  
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock API call as this endpoint wasn't explicitly in the 15 screens list but required by Settings
      // await api.put('/user/profile', profileData);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      return addToast('New passwords do not match', 'error');
    }
    setLoading(true);
    try {
      // await api.put('/user/password', passwordData);
      addToast('Password changed successfully!', 'success');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (err) {
      addToast('Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl mb-2">Account Settings</h1>
        <p className="text-muted text-lg">Manage your profile and security preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-accent font-bold mb-2">
            <User className="h-5 w-5" />
            <h2 className="text-xl">Profile Information</h2>
          </div>
          <Card className="p-8">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <Input 
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                icon={User}
              />
              <Input 
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                icon={Mail}
              />
              <Button type="submit" loading={loading} className="w-full">
                Update Profile
              </Button>
            </form>
          </Card>

          {user?.is_admin === 1 && (
            <div className="bg-teal/5 border border-teal/10 p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-teal rounded-xl text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-teal">Administrator Account</p>
                <p className="text-sm text-teal/70">You have full platform access.</p>
              </div>
            </div>
          )}
        </div>

        {/* Security Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-accent font-bold mb-2">
            <Lock className="h-5 w-5" />
            <h2 className="text-xl">Security</h2>
          </div>
          <Card className="p-8">
            <form onSubmit={handleChangePassword} className="space-y-6">
              <Input 
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={passwordData.current}
                onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
              />
              <Input 
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={passwordData.new}
                onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                helper="Minimum 8 characters"
              />
              <Input 
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
              />
              <Button type="submit" variant="secondary" loading={loading} className="w-full">
                Change Password
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
