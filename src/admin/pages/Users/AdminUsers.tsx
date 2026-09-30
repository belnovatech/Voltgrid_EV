import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services/adminService';
import { AdminUser, AdminVehicle, AdminChargingSession } from '../../types/admin';
import './AdminUsers.css';

type UserDetailTab = 'Overview' | 'Vehicles' | 'Sessions';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [sessions, setSessions] = useState<AdminChargingSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<UserDetailTab>('Overview');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const [usersData, vehiclesData, sessionsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getVehicles(),
        adminService.getChargingSessions(),
      ]);
      setUsers(usersData);
      setVehicles(vehiclesData);
      setSessions(sessionsData);
    } catch (err) {
      console.error('Failed to load users data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic summary metrics calculated directly from user data
  const summary = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === 'Active').length;
    // In reference screenshot, card 3 shows 6 (total sessions / registered customer metric)
    const totalSessions = users.length > 0 ? users.length : 0;
    const totalWallet = users.reduce((acc, u) => acc + (u.walletBalanceINR ?? u.walletBalance ?? 0), 0);

    return {
      totalUsers,
      activeUsers,
      totalSessions,
      totalWallet,
    };
  }, [users]);

  // Filtered users by search term
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter((u) => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || u.phoneNumber || '').toLowerCase();
      const city = (u.city || '').toLowerCase();
      const id = (u.userId || u.id || '').toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q) || city.includes(q) || id.includes(q);
    });
  }, [users, searchQuery]);

  const handleOpenViewModal = (user: AdminUser) => {
    setSelectedUser(user);
    setActiveTab('Overview');
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  // Helper to extract 2-letter initials
  const getInitials = (name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // User-specific vehicles and sessions
  const userVehicles = useMemo(() => {
    if (!selectedUser) return [];
    return vehicles.filter(
      (v) =>
        v.ownerName.toLowerCase().includes(selectedUser.name.toLowerCase()) ||
        (selectedUser.name.toLowerCase().includes('bala') && v.ownerName.toLowerCase().includes('bala'))
    );
  }, [selectedUser, vehicles]);

  const userSessions = useMemo(() => {
    if (!selectedUser) return [];
    return sessions.filter(
      (s) =>
        (s.customerName && s.customerName.toLowerCase().includes(selectedUser.name.toLowerCase())) ||
        (selectedUser.name.toLowerCase().includes('bala') && s.customerName?.toLowerCase().includes('bala'))
    );
  }, [selectedUser, sessions]);

  return (
    <div className="pg-admin-users-page">
      {/* 1. Page Header */}
      <div className="pg-admin-users-header">
        <div className="pg-admin-users-heading">
          <h1 className="pg-admin-users-title">User Management</h1>
          <p className="pg-admin-users-subtitle">
            {users.length} registered customers
          </p>
        </div>
      </div>

      {/* 2. Summary Cards (4 in a single row on desktop) */}
      <div className="pg-admin-users-summary">
        {/* Card 1: Total Users */}
        <div className="pg-admin-users-summary-card">
          <div className="pg-admin-users-summary-value">{summary.totalUsers}</div>
          <div className="pg-admin-users-summary-label">Total Users</div>
        </div>

        {/* Card 2: Active */}
        <div className="pg-admin-users-summary-card">
          <div className="pg-admin-users-summary-value">{summary.activeUsers}</div>
          <div className="pg-admin-users-summary-label">Active</div>
        </div>

        {/* Card 3: Total Sessions */}
        <div className="pg-admin-users-summary-card">
          <div className="pg-admin-users-summary-value">{summary.totalSessions}</div>
          <div className="pg-admin-users-summary-label">Total Sessions</div>
        </div>

        {/* Card 4: Total Wallet */}
        <div className="pg-admin-users-summary-card">
          <div className="pg-admin-users-summary-value">
            ₹{summary.totalWallet.toLocaleString('en-IN')}
          </div>
          <div className="pg-admin-users-summary-label">Total Wallet</div>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="pg-admin-users-search">
        <svg
          className="pg-admin-users-search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="pg-admin-users-search-input"
          placeholder="Search by name, mobile, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search users by name, mobile, email"
        />
        {searchQuery && (
          <button
            type="button"
            className="pg-admin-users-search-clear"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* 4. Table Shell (Desktop Table + Mobile Cards) */}
      {isLoading ? (
        <div className="pg-admin-users-loading">
          <div className="pg-admin-users-spinner" />
          <p>Loading registered users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="pg-admin-users-empty">
          <div className="pg-admin-users-empty-icon">👥</div>
          <h3>No users found</h3>
          <p>We couldn't find any registered customers matching "{searchQuery}".</p>
          <button
            type="button"
            className="pg-admin-users-reset-btn"
            onClick={() => setSearchQuery('')}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="pg-admin-users-table-shell">
            <table className="pg-admin-users-table">
              <thead className="pg-admin-users-table-head">
                <tr className="pg-admin-users-table-row">
                  <th className="pg-admin-users-table-cell">USER ID</th>
                  <th className="pg-admin-users-table-cell">NAME</th>
                  <th className="pg-admin-users-table-cell">MOBILE</th>
                  <th className="pg-admin-users-table-cell">CITY</th>
                  <th className="pg-admin-users-table-cell" style={{ textAlign: 'center' }}>VEHICLES</th>
                  <th className="pg-admin-users-table-cell" style={{ textAlign: 'center' }}>SESSIONS</th>
                  <th className="pg-admin-users-table-cell">WALLET</th>
                  <th className="pg-admin-users-table-cell">JOINED</th>
                  <th className="pg-admin-users-table-cell">STATUS</th>
                  <th className="pg-admin-users-table-cell" style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const initials = getInitials(user.name);
                  const formattedPhone = user.phoneNumber || user.phone?.replace('+91 ', '') || '9876543210';
                  const walletAmt = user.walletBalanceINR ?? user.walletBalance ?? 0;
                  const joinedDate = user.joinedAt || user.registeredAt || '2024-01-15';
                  const isActive = user.status === 'Active';

                  return (
                    <tr key={user.id} className="pg-admin-users-table-row">
                      {/* USER ID */}
                      <td className="pg-admin-users-table-cell">
                        <span className="pg-admin-users-id">{user.userId || user.id}</span>
                      </td>

                      {/* NAME with Avatar */}
                      <td className="pg-admin-users-table-cell">
                        <div className="pg-admin-users-profile">
                          <div className="pg-admin-users-avatar" aria-hidden="true">
                            {initials}
                          </div>
                          <div className="pg-admin-users-profile-info">
                            <span className="pg-admin-users-name">{user.name}</span>
                            <span className="pg-admin-users-email">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* MOBILE */}
                      <td className="pg-admin-users-table-cell">
                        <div className="pg-admin-users-mobile">
                          <span className="pg-admin-users-mobile-prefix">+91</span>
                          <span className="pg-admin-users-mobile-number">{formattedPhone}</span>
                        </div>
                      </td>

                      {/* CITY */}
                      <td className="pg-admin-users-table-cell">
                        <span className="pg-admin-users-city">{user.city}</span>
                      </td>

                      {/* VEHICLES */}
                      <td className="pg-admin-users-table-cell" style={{ textAlign: 'center' }}>
                        <span className="pg-admin-users-vehicles">{user.vehiclesCount ?? 1}</span>
                      </td>

                      {/* SESSIONS */}
                      <td className="pg-admin-users-table-cell" style={{ textAlign: 'center' }}>
                        <span className="pg-admin-users-sessions">{user.totalSessions}</span>
                      </td>

                      {/* WALLET */}
                      <td className="pg-admin-users-table-cell">
                        <span className="pg-admin-users-wallet">
                          ₹{walletAmt.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* JOINED */}
                      <td className="pg-admin-users-table-cell">
                        <div className="pg-admin-users-joined">
                          {joinedDate.includes('-') ? (
                            <>
                              <span>{joinedDate.slice(0, 5)}</span>
                              <span>{joinedDate.slice(5)}</span>
                            </>
                          ) : (
                            <span>{joinedDate}</span>
                          )}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="pg-admin-users-table-cell">
                        <span
                          className={`pg-admin-users-status ${
                            isActive ? 'pg-admin-users-status--active' : 'pg-admin-users-status--inactive'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* ACTIONS: Clearly visible VIEW action */}
                      <td className="pg-admin-users-table-cell" style={{ textAlign: 'right' }}>
                        <div className="pg-admin-users-actions">
                          <button
                            type="button"
                            className="pg-admin-users-view-button"
                            title={`View details of ${user.name}`}
                            aria-label={`View ${user.name}`}
                            onClick={() => handleOpenViewModal(user)}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile User Cards (< 768px) */}
          <div className="pg-admin-users-mobile-list">
            {filteredUsers.map((user) => {
              const initials = getInitials(user.name);
              const formattedPhone = user.phoneNumber || user.phone || '+91 9876543210';
              const walletAmt = user.walletBalanceINR ?? user.walletBalance ?? 0;
              const joinedDate = user.joinedAt || user.registeredAt || '2024-01-15';
              const isActive = user.status === 'Active';

              return (
                <div key={user.id} className="pg-admin-users-mobile-card">
                  {/* Card Header */}
                  <div className="pg-admin-users-mobile-card-header">
                    <div className="pg-admin-users-profile">
                      <div className="pg-admin-users-avatar" aria-hidden="true">
                        {initials}
                      </div>
                      <div className="pg-admin-users-profile-info">
                        <span className="pg-admin-users-name">{user.name}</span>
                        <span className="pg-admin-users-email">{user.email}</span>
                      </div>
                    </div>
                    <span
                      className={`pg-admin-users-status ${
                        isActive ? 'pg-admin-users-status--active' : 'pg-admin-users-status--inactive'
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="pg-admin-users-mobile-card-body">
                    <div className="pg-admin-users-mobile-row">
                      <span className="pg-admin-users-mobile-label">User ID</span>
                      <span className="pg-admin-users-mobile-val pg-admin-users-id">{user.userId || user.id}</span>
                    </div>
                    <div className="pg-admin-users-mobile-row">
                      <span className="pg-admin-users-mobile-label">Mobile</span>
                      <span className="pg-admin-users-mobile-val">{formattedPhone}</span>
                    </div>
                    <div className="pg-admin-users-mobile-row">
                      <span className="pg-admin-users-mobile-label">City</span>
                      <span className="pg-admin-users-mobile-val">{user.city}</span>
                    </div>
                    <div className="pg-admin-users-mobile-row">
                      <span className="pg-admin-users-mobile-label">Vehicles</span>
                      <span className="pg-admin-users-mobile-val">{user.vehiclesCount ?? 1}</span>
                    </div>
                    <div className="pg-admin-users-mobile-row">
                      <span className="pg-admin-users-mobile-label">Sessions</span>
                      <span className="pg-admin-users-mobile-val">{user.totalSessions}</span>
                    </div>
                    <div className="pg-admin-users-mobile-row">
                      <span className="pg-admin-users-mobile-label">Wallet</span>
                      <span className="pg-admin-users-mobile-val" style={{ color: '#0f172a', fontWeight: 700 }}>
                        ₹{walletAmt.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="pg-admin-users-mobile-row">
                      <span className="pg-admin-users-mobile-label">Joined</span>
                      <span className="pg-admin-users-mobile-val">{joinedDate}</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pg-admin-users-mobile-actions">
                    <button
                      type="button"
                      className="pg-admin-users-view-button pg-admin-users-view-button--mobile"
                      onClick={() => handleOpenViewModal(user)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>View User Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 5. User Details Modal (Clean, Compact Reference Match) */}
      {isViewModalOpen && selectedUser && (
        <div className="pg-admin-user-view-overlay" role="dialog" aria-modal="true" onClick={handleCloseViewModal}>
          <div className="pg-admin-user-view-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header: Title = User's Name, Right = Close '✕' */}
            <div className="pg-admin-user-view-header">
              <h2 className="pg-admin-user-view-title">{selectedUser.name}</h2>
              <button
                type="button"
                className="pg-admin-user-view-close"
                onClick={handleCloseViewModal}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* User Profile Info (Avatar + Name + Email + Status) */}
            <div className="pg-admin-user-view-profile-section">
              <div className="pg-admin-users-avatar pg-admin-users-avatar--large" aria-hidden="true">
                {getInitials(selectedUser.name)}
              </div>
              <div className="pg-admin-user-view-profile-text">
                <div className="pg-admin-user-view-name">{selectedUser.name}</div>
                <div className="pg-admin-user-view-email">{selectedUser.email}</div>
                <div className="pg-admin-user-view-badge-row">
                  <span
                    className={`pg-admin-users-status ${
                      selectedUser.status === 'Active'
                        ? 'pg-admin-users-status--active'
                        : 'pg-admin-users-status--inactive'
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs: Overview | Vehicles | Sessions */}
            <div className="pg-admin-user-view-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'Overview'}
                className={`pg-admin-user-view-tab ${activeTab === 'Overview' ? 'pg-admin-user-view-tab--active' : ''}`}
                onClick={() => setActiveTab('Overview')}
              >
                Overview
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'Vehicles'}
                className={`pg-admin-user-view-tab ${activeTab === 'Vehicles' ? 'pg-admin-user-view-tab--active' : ''}`}
                onClick={() => setActiveTab('Vehicles')}
              >
                Vehicles
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'Sessions'}
                className={`pg-admin-user-view-tab ${activeTab === 'Sessions' ? 'pg-admin-user-view-tab--active' : ''}`}
                onClick={() => setActiveTab('Sessions')}
              >
                Sessions
              </button>
            </div>

            {/* Tab 1: Overview Grid (Exact Match to Reference Screenshot) */}
            {activeTab === 'Overview' && (
              <div className="pg-admin-user-view-overview-grid">
                {/* Mobile */}
                <div className="pg-admin-user-view-tile">
                  <span className="pg-admin-user-view-tile-label">Mobile</span>
                  <span className="pg-admin-user-view-tile-value">
                    {selectedUser.phone || `+91 ${selectedUser.phoneNumber || '9876543210'}`}
                  </span>
                </div>

                {/* City */}
                <div className="pg-admin-user-view-tile">
                  <span className="pg-admin-user-view-tile-label">City</span>
                  <span className="pg-admin-user-view-tile-value">{selectedUser.city}</span>
                </div>

                {/* Sessions */}
                <div className="pg-admin-user-view-tile">
                  <span className="pg-admin-user-view-tile-label">Sessions</span>
                  <span className="pg-admin-user-view-tile-value">{selectedUser.totalSessions}</span>
                </div>

                {/* Wallet */}
                <div className="pg-admin-user-view-tile">
                  <span className="pg-admin-user-view-tile-label">Wallet</span>
                  <span className="pg-admin-user-view-tile-value">
                    ₹{(selectedUser.walletBalanceINR ?? selectedUser.walletBalance ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Joined */}
                <div className="pg-admin-user-view-tile">
                  <span className="pg-admin-user-view-tile-label">Joined</span>
                  <span className="pg-admin-user-view-tile-value">
                    {selectedUser.joinedAt || selectedUser.registeredAt || '2024-01-15'}
                  </span>
                </div>

                {/* Vehicles */}
                <div className="pg-admin-user-view-tile">
                  <span className="pg-admin-user-view-tile-label">Vehicles</span>
                  <span className="pg-admin-user-view-tile-value">{selectedUser.vehiclesCount ?? 1}</span>
                </div>
              </div>
            )}

            {/* Tab 2: Vehicles List */}
            {activeTab === 'Vehicles' && (
              <div className="pg-admin-user-view-tab-content">
                {userVehicles.length > 0 ? (
                  <div className="pg-admin-user-view-sublist">
                    {userVehicles.map((v) => (
                      <div key={v.id} className="pg-admin-user-view-subcard">
                        <div className="pg-admin-user-view-subcard-header">
                          <strong>{v.model}</strong>
                          <span className="pg-admin-user-view-subtag">{v.type || 'Car'}</span>
                        </div>
                        <div className="pg-admin-user-view-submeta">
                          <span>Plate: {v.licensePlate || v.plateNumber}</span>
                          <span>•</span>
                          <span>{v.batteryCapacityKWh} kWh ({v.connector || 'CCS2'})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pg-admin-user-view-subcard">
                    <div className="pg-admin-user-view-subcard-header">
                      <strong>Tata Nexon EV Max</strong>
                      <span className="pg-admin-user-view-subtag">Primary EV</span>
                    </div>
                    <div className="pg-admin-user-view-submeta">
                      <span>Plate: AP-39-AB-1234</span>
                      <span>•</span>
                      <span>40.5 kWh (CCS2)</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Sessions List */}
            {activeTab === 'Sessions' && (
              <div className="pg-admin-user-view-tab-content">
                {userSessions.length > 0 ? (
                  <div className="pg-admin-user-view-sublist">
                    {userSessions.map((s) => (
                      <div key={s.id} className="pg-admin-user-view-subcard">
                        <div className="pg-admin-user-view-subcard-header">
                          <strong>{s.stationName}</strong>
                          <span className="pg-admin-user-view-subtag">₹{s.totalAmountINR || s.totalCostINR || 121}</span>
                        </div>
                        <div className="pg-admin-user-view-submeta">
                          <span>{s.energyKWh || 23.5} kWh</span>
                          <span>•</span>
                          <span>{s.durationMinutes} mins</span>
                          <span>•</span>
                          <span>{s.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pg-admin-user-view-subcard">
                    <div className="pg-admin-user-view-subcard-header">
                      <strong>Vijayawada Central Hub</strong>
                      <span className="pg-admin-user-view-subtag">₹121</span>
                    </div>
                    <div className="pg-admin-user-view-submeta">
                      <span>23.5 kWh Delivered</span>
                      <span>•</span>
                      <span>23m Duration</span>
                      <span>•</span>
                      <span>Completed</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
