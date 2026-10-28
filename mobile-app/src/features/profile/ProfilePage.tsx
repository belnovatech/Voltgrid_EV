import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Car,
  LifeBuoy,
  LogOut,
  Plus,
  Trash2,
  Check,
  X,
  Edit2,
  Shield,
  Send,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { customerService } from '../../services/customerService';
import { CustomerProfile, CustomerVehicle, SupportTicket } from '../../types/customer';
import { AppHeader } from '../../components/layout/AppHeader';
import { AppButton } from '../../components/common/AppButton';
import { LoadingState } from '../../components/common/LoadingState';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [vehicles, setVehicles] = useState<CustomerVehicle[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('');

  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [vehName, setVehName] = useState('Tata Curvv EV');
  const [vehPlate, setVehPlate] = useState('AP-39-EF-9988');
  const [vehModel, setVehModel] = useState('Curvv EV 55');
  const [vehConnector, setVehConnector] = useState<'CCS2' | 'Type 2'>('CCS2');
  const [vehBattery, setVehBattery] = useState(55);

  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Charging Issues');
  const [ticketDesc, setTicketDesc] = useState('');

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const [prof, vehs, tkts] = await Promise.all([
        customerService.getProfile(),
        customerService.getVehicles(),
        customerService.getSupportTickets(),
      ]);
      setProfile(prof);
      setVehicles(vehs);
      setTickets(tkts);
      setEditName(prof.name);
      setEditCity(prof.city);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName) return;
    const updated = await customerService.updateProfile({ name: editName, city: editCity });
    setProfile(updated);
    setIsEditProfileOpen(false);
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehName || !vehPlate) return;
    await customerService.addVehicle({
      name: vehName,
      model: vehModel,
      type: 'Car',
      licensePlate: vehPlate,
      batteryCapacityKWh: Number(vehBattery),
      connector: vehConnector,
      batteryPercentage: 75,
      isDefault: vehicles.length === 0,
      ratePerKWh: 12,
    });
    const updated = await customerService.getVehicles();
    setVehicles(updated);
    setIsAddVehicleOpen(false);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Delete this vehicle from your profile?')) {
      await customerService.deleteVehicle(id);
      const updated = await customerService.getVehicles();
      setVehicles(updated);
    }
  };

  const handleSetPrimary = async (id: string) => {
    await customerService.setPrimaryVehicle(id);
    const updated = await customerService.getVehicles();
    setVehicles(updated);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;
    await customerService.createSupportTicket({
      subject: ticketSubject,
      category: ticketCategory,
      description: ticketDesc,
      stationName: 'Vijayawada Central Hub',
    });
    const updated = await customerService.getSupportTickets();
    setTickets(updated);
    setIsNewTicketOpen(false);
    setTicketSubject('');
    setTicketDesc('');
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of Voltgrid EV?')) {
      await logoutUser();
      navigate('/login', { replace: true });
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="profile-page">
        <AppHeader title="My Profile" />
        <LoadingState message="Loading driver profile..." />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <AppHeader title="Driver Profile" />

      <main className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-large">{profile.avatarInitials || 'EV'}</div>
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-contact">
            {profile.phoneNumber} · {profile.email || user?.email || 'driver@voltgrid.ev'}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-cyan)', marginTop: '4px' }}>
            {profile.city}, {profile.state} · Member since {profile.memberSince || '2024'}
          </p>

          <AppButton
            variant="outline"
            size="sm"
            style={{ marginTop: '16px' }}
            icon={<Edit2 size={14} />}
            onClick={() => setIsEditProfileOpen(true)}
          >
            Edit Profile Info
          </AppButton>
        </div>

        {/* Vehicles Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={18} color="var(--color-cyan)" />
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>My Electric Vehicles</h3>
            </div>
            <AppButton
              variant="secondary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setIsAddVehicleOpen(true)}
            >
              Add EV
            </AppButton>
          </div>

          <div>
            {vehicles.map((v) => (
              <div key={v.id} className="vehicle-item-row">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <strong style={{ color: '#fff', fontSize: '15px' }}>{v.name}</strong>
                    {v.isDefault && <span className="vehicle-primary-badge">PRIMARY</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {v.licensePlate} · {v.connector || 'CCS2'} ({v.batteryCapacityKWh} kWh)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!v.isDefault && (
                    <button
                      type="button"
                      style={{ fontSize: '11px', color: 'var(--color-cyan)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => handleSetPrimary(v.id)}
                    >
                      Set Primary
                    </button>
                  )}
                  {vehicles.length > 1 && (
                    <button
                      type="button"
                      style={{ color: 'var(--color-status-error)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => handleDeleteVehicle(v.id)}
                      aria-label="Delete Vehicle"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support & Assistance */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LifeBuoy size={18} color="var(--color-neon-green)" />
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>Help & Support</h3>
            </div>
            <AppButton
              variant="secondary"
              size="sm"
              icon={<MessageSquare size={14} />}
              onClick={() => setIsNewTicketOpen(true)}
            >
              New Ticket
            </AppButton>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tickets.map((t) => (
              <div
                key={t.id}
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-cyan)', fontWeight: 'bold' }}>{t.id}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: t.status === 'Resolved' ? 'var(--color-neon-green)' : 'var(--color-status-warning)',
                      fontWeight: 'bold',
                    }}
                  >
                    {t.status}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
                  {t.subject}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t.description}</p>
                {t.replies && t.replies.length > 1 && (
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(57, 230, 0, 0.08)',
                      fontSize: '11px',
                      color: 'var(--color-text-subtle)',
                      borderLeft: '2px solid var(--color-neon-green)',
                    }}
                  >
                    <strong>Support:</strong> {t.replies[1].message}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Security & Logout */}
        <section className="section-group-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-subtle)', fontSize: '13px' }}>
            <Shield size={16} color="var(--color-neon-green)" />
            <span>Voltgrid EV Driver App v1.0.0 (Capacitor Native)</span>
          </div>

          <AppButton
            variant="danger"
            size="md"
            fullWidth
            icon={<LogOut size={16} />}
            onClick={handleLogout}
            style={{ marginTop: '8px' }}
          >
            Log Out Driver Session
          </AppButton>
        </section>
      </main>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="modal-overlay" onClick={() => setIsEditProfileOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title-row">
              <h3 className="modal-title">Edit Profile Information</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsEditProfileOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <AppButton type="submit" variant="primary" size="lg" fullWidth icon={<Check size={18} />}>
                Save Changes
              </AppButton>
            </form>
          </div>
        </div>
      )}

      {/* Add EV Modal */}
      {isAddVehicleOpen && (
        <div className="modal-overlay" onClick={() => setIsAddVehicleOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title-row">
              <h3 className="modal-title">Register New Electric Vehicle</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddVehicleOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Vehicle Nickname</label>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. My Curvv EV"
                    value={vehName}
                    onChange={(e) => setVehName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">License Plate Number</label>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="AP-39-XX-0000"
                    value={vehPlate}
                    onChange={(e) => setVehPlate(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Connector</label>
                  <div className="form-input-wrapper">
                    <select
                      className="form-input"
                      value={vehConnector}
                      onChange={(e) => setVehConnector(e.target.value as 'CCS2' | 'Type 2')}
                      style={{ background: 'transparent', color: '#fff' }}
                    >
                      <option value="CCS2" style={{ background: '#071B32' }}>CCS2 (Fast DC)</option>
                      <option value="Type 2" style={{ background: '#071B32' }}>Type 2 (AC)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Battery (kWh)</label>
                  <div className="form-input-wrapper">
                    <input
                      type="number"
                      className="form-input"
                      value={vehBattery}
                      onChange={(e) => setVehBattery(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </div>

              <AppButton type="submit" variant="primary" size="lg" fullWidth icon={<Plus size={18} />}>
                Add Vehicle
              </AppButton>
            </form>
          </div>
        </div>
      )}

      {/* New Support Ticket Modal */}
      {isNewTicketOpen && (
        <div className="modal-overlay" onClick={() => setIsNewTicketOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title-row">
              <h3 className="modal-title">Raise Support Inquiry</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsNewTicketOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Brief description of issue"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <div className="form-input-wrapper">
                  <select
                    className="form-input"
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    style={{ background: 'transparent', color: '#fff' }}
                  >
                    <option value="Charging Issues" style={{ background: '#071B32' }}>Charging Issues</option>
                    <option value="Wallet & Payments" style={{ background: '#071B32' }}>Wallet & Payments</option>
                    <option value="Station Access" style={{ background: '#071B32' }}>Station Access</option>
                    <option value="App Feedback" style={{ background: '#071B32' }}>App Feedback</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Details</label>
                <div className="form-input-wrapper" style={{ alignItems: 'flex-start', padding: '10px' }}>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Provide details about the issue..."
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    required
                    style={{ resize: 'none', width: '100%' }}
                  />
                </div>
              </div>

              <AppButton type="submit" variant="primary" size="lg" fullWidth icon={<Send size={18} />}>
                Submit Inquiry
              </AppButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
