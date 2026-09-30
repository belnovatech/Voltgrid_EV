import React, { useState, useEffect } from 'react';
import { AdminWalletTransaction } from '../../types/admin';
import { AdminDataTable, Column } from '../../components/AdminDataTable/AdminDataTable';
import './AdminWalletPayments.css';

export const AdminWalletPayments: React.FC = () => {
  const [transactions, setTransactions] = useState<AdminWalletTransaction[]>([]);
  const [filtered, setFiltered] = useState<AdminWalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate realistic transactions
    const mockTx: AdminWalletTransaction[] = [
      {
        id: 'tx_01',
        transactionRef: 'PG-TX-901824',
        userName: 'Praveen Kumar',
        userId: 'usr_01',
        amountINR: 1000,
        type: 'Topup',
        paymentGateway: 'Razorpay UPI',
        status: 'Completed',
        timestamp: 'Today, 02:40 PM',
      },
      {
        id: 'tx_02',
        transactionRef: 'PG-TX-901823',
        userName: 'Lakshmi Narayana',
        userId: 'usr_02',
        amountINR: 420,
        type: 'SessionDebit',
        paymentGateway: 'PowerGrid Wallet',
        status: 'Completed',
        timestamp: 'Today, 02:15 PM',
      },
      {
        id: 'tx_03',
        transactionRef: 'PG-TX-901822',
        userName: 'Divya Sri',
        userId: 'usr_03',
        amountINR: 500,
        type: 'Topup',
        paymentGateway: 'HDFC NetBanking',
        status: 'Completed',
        timestamp: 'Today, 01:50 PM',
      },
      {
        id: 'tx_04',
        transactionRef: 'PG-TX-901821',
        userName: 'Srinivas Rao',
        userId: 'usr_04',
        amountINR: 50,
        type: 'ReservationFee',
        paymentGateway: 'PowerGrid Wallet',
        status: 'Completed',
        timestamp: 'Today, 12:30 PM',
      },
      {
        id: 'tx_05',
        transactionRef: 'PG-TX-901820',
        userName: 'Kalyan Chakravarthy',
        userId: 'usr_05',
        amountINR: 50,
        type: 'Refund',
        paymentGateway: 'PowerGrid Wallet',
        status: 'Completed',
        timestamp: 'Today, 11:00 AM',
      },
    ];
    setTransactions(mockTx);
    setFiltered(mockTx);
    setIsLoading(false);
  }, []);

  const handleSearch = (term: string) => {
    const q = term.toLowerCase();
    setFiltered(
      transactions.filter(
        (t) =>
          (t.transactionRef || t.gatewayTxnId || '').toLowerCase().includes(q) ||
          (t.userName || t.customerName || '').toLowerCase().includes(q) ||
          (t.paymentGateway || t.paymentMethod || '').toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q)
      )
    );
  };

  const columns: Column<AdminWalletTransaction>[] = [
    {
      key: 'transactionRef',
      header: 'Reference ID',
      render: (t) => <span className="pg-admin-wall__ref">{t.transactionRef || t.gatewayTxnId}</span>,
      width: '140px',
    },
    {
      key: 'userName',
      header: 'User / Driver',
      render: (t) => (
        <div>
          <div className="pg-admin-wall__user">{t.userName || t.customerName}</div>
          <span className="pg-admin-wall__uid">{t.userId || t.customerPhone}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Transaction Type',
      render: (t) => <span className="pg-admin-wall__type">{t.type}</span>,
    },
    {
      key: 'paymentGateway',
      header: 'Method / Gateway',
      render: (t) => <span>{t.paymentGateway || t.paymentMethod}</span>,
    },
    {
      key: 'amountINR',
      header: 'Amount (INR)',
      render: (t) => {
        const isCredit = t.type === 'Topup' || t.type === 'Refund';
        return (
          <span className={`pg-admin-wall__amt ${isCredit ? 'pg-admin-wall__amt--credit' : 'pg-admin-wall__amt--debit'}`}>
            {isCredit ? '+' : '-'}₹{t.amountINR.toLocaleString('en-IN')}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => (
        <span className="pg-admin-wall__badge pg-admin-wall__badge--success">
          ✓ {t.status}
        </span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Date & Time',
      render: (t) => <span className="pg-admin-wall__time">{t.timestamp}</span>,
    },
  ];

  return (
    <div className="pg-admin-wall">
      <div className="pg-admin-wall__header">
        <div>
          <h1 className="pg-admin-wall__title">Wallet & Payment Gateways</h1>
          <p className="pg-admin-wall__subtitle">
            Audit gateway settlements, instant wallet top-ups, and debit transactions
          </p>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyExtractor={(t) => t.id}
        isLoading={isLoading}
        searchPlaceholder="Search reference, customer, gateway..."
        onSearch={handleSearch}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};
export default AdminWalletPayments;
