import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { User, Mail, Phone, Lock, CheckCircle, AlertCircle, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);

    setUpdatingProfile(true);
    try {
      const updated = await userService.updateProfile({ fullName, phone });
      updateUser(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(false);

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setChangingPass(true);
    try {
      await userService.changePassword(currentPassword, newPassword);
      setPassSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(false), 4000);
    } catch (err) {
      setPassError(err.response?.data?.message || 'Current password incorrect.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="page-header-container">
        <h1>User Account & Settings</h1>
        <p>Manage your personal profile details and password security.</p>
      </div>

      <div className="profile-layout-grid">
        {/* Profile Card / Edit */}
        <div className="profile-card">
          <div className="card-top-header">
            <div className="profile-avatar-circle">
              <User size={32} />
            </div>
            <div>
              <h2>{user?.fullName}</h2>
              <span className="role-tag">{user?.role?.replace('ROLE_', '')}</span>
            </div>
          </div>

          {profileSuccess && (
            <div className="success-banner">
              <CheckCircle size={16} /> Profile details saved successfully!
            </div>
          )}
          {profileError && (
            <div className="error-banner">
              <AlertCircle size={16} /> {profileError}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="field-icon" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address (Immutable)</label>
              <div className="input-with-icon">
                <Mail size={18} className="field-icon" />
                <input type="email" value={user?.email || ''} disabled className="disabled-input" />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-with-icon">
                <Phone size={18} className="field-icon" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={updatingProfile} className="save-profile-btn">
              {updatingProfile ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="profile-card">
          <h2>Change Password</h2>
          <p className="card-sub-info">Ensure your account uses a secure password with at least 6 characters.</p>

          {passSuccess && (
            <div className="success-banner">
              <CheckCircle size={16} /> Password updated successfully!
            </div>
          )}
          {passError && (
            <div className="error-banner">
              <AlertCircle size={16} /> {passError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="form-group">
              <label>Current Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={changingPass} className="save-profile-btn">
              {changingPass ? 'Updating Password...' : 'Change Password'}
            </button>
          </form>

          <div className="logout-zone">
            <button onClick={logout} className="danger-logout-btn">
              <LogOut size={16} /> Sign Out of All Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
