import React, { useState, useEffect } from 'react';
import { AdminWalletTransaction } from '../../types/admin';
import { AdminDataTable, Column } from '../../components/AdminDataTable/AdminDataTable';
import { authoritativeWalletService } from '../../../services/walletService';
import './AdminWalletPayments.css';

export const AdminWalletPayments: React.FC = () => {
  const [transactions, setTransactions] = useState<AdminWalletTransaction[]>([]);
  const [filtered, setFiltered] = useState<AdminWalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateTransactions = () => {
      const ledger = authoritativeWalletService.getAllRecords();
      const dynamicTx: AdminWalletTransaction[] = ledger.map((l) => ({
        id: l.id,
        transactionRef: l.referenceId,
        gatewayTxnId: l.gatewayReferenceId || 'Internal Ledger',
        userName: l.customerName || 'Bala Krishna',
        userId: l.customerPhone || '8074407557',
        amountINR: l.amountINR,
        type: (l.type === 'recharge' ? 'Topup' : l.type === 'charging' ? 'SessionDebit' : 'Refund') as AdminWalletTransaction['type'],
        paymentGateway: l.paymentMethod,
        status: 'Completed',
        timestamp: l.date,
      }));

      // Additional driver activity records
      const otherDriverTx: AdminWalletTransaction[] = [
        {
          id: 'tx_other_01',
          transactionRef: 'PG-TX-901824',
          userName: 'Praveen Kumar',
          userId: '9848011223',
          amountINR: 1000,
          type: 'Topup',
          paymentGateway: 'Razorpay UPI',
          status: 'Completed',
          timestamp: '2024-12-16 14:40',
        },
        {
          id: 'tx_other_02',
          transactionRef: 'PG-TX-901822',
          userName: 'Divya Sri',
          userId: '9701234567',
          amountINR: 500,
          type: 'Topup',
          paymentGateway: 'HDFC NetBanking',
          status: 'Completed',
          timestamp: '2024-12-16 13:50',
        },
      ];

      const combined = [...dynamicTx, ...otherDriverTx];
      setTransactions(combined);
      setFiltered(combined);
      setIsLoading(false);
    };

    updateTransactions();
    const unsub = authoritativeWalletService.subscribe(() => {
      updateTransactions();
    });

    return () => unsub();
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
