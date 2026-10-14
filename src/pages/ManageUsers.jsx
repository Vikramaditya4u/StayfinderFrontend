import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, Mail, Phone, ShieldCheck, UserCheck } from 'lucide-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('Could not retrieve registered users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="manage-users-page">
      <div className="manage-header-row">
        <div>
          <h1>Registered Users</h1>
          <p>View registered guest accounts and system administrators.</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading user directory..." />
      ) : error ? (
        <div className="admin-error-box">
          <p>{error}</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Contact Phone</th>
                <th>System Role</th>
                <th>Account Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <code>#{u.id}</code>
                  </td>
                  <td>
                    <div className="user-name-cell">
                      <div className="user-initial-badge">
                        {u.fullName ? u.fullName[0].toUpperCase() : 'U'}
                      </div>
                      <strong>{u.fullName}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="email-cell">
                      <Mail size={14} /> {u.email}
                    </span>
                  </td>
                  <td>
                    <span className="phone-cell">
                      {u.phone ? (
                        <>
                          <Phone size={14} /> {u.phone}
                        </>
                      ) : (
                        <span className="not-provided">—</span>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={`role-pill ${u.role === 'ROLE_ADMIN' ? 'role-admin' : 'role-user'}`}>
                      {u.role === 'ROLE_ADMIN' ? (
                        <>
                          <ShieldCheck size={14} /> Administrator
                        </>
                      ) : (
                        <>
                          <UserCheck size={14} /> Guest User
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className="active-dot-pill">
                      <span className="dot"></span> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
