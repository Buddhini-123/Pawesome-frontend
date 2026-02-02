import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Gift,
  Heart,
  Download,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader
} from 'lucide-react';
import { useLoyalty } from '../../hooks/useLoyalty';
import { PointTransaction } from '../../types/loyalty';
import { loyaltyService } from '../../services/loyalty.service';

const PointsHistory: React.FC = () => {
  const { loyaltyCard } = useLoyalty();
  const [filter, setFilter] = useState<'all' | 'earned' | 'redeemed' | 'bonus' | 'donated'>('all');
  const [dateRange, setDateRange] = useState<'all' | '30days' | '90days' | '1year'>('90days');
  const [showExport, setShowExport] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);

  // Fetch transaction history from backend API with pagination
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data, meta } = await loyaltyService.getPointsHistory(currentPage);
        setTransactions(data);
        setTotalPages(meta.last_page);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage]);

  // Filter transactions (client-side filtering for now)
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Type filter
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }

    // Date filter
    const now = new Date();
    switch (dateRange) {
      case '30days':
        filtered = filtered.filter(t =>
          t.createdAt >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        );
        break;
      case '90days':
        filtered = filtered.filter(t =>
          t.createdAt >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        );
        break;
      case '1year':
        filtered = filtered.filter(t =>
          t.createdAt >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        );
        break;
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [transactions, filter, dateRange]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const earned = filteredTransactions
      .filter(t => t.type === 'earned' || t.type === 'bonus')
      .reduce((sum, t) => sum + t.points, 0);
    
    const redeemed = Math.abs(filteredTransactions
      .filter(t => t.type === 'redeemed')
      .reduce((sum, t) => sum + t.points, 0));
    
    const donated = Math.abs(filteredTransactions
      .filter(t => t.type === 'donated')
      .reduce((sum, t) => sum + t.points, 0));

    return { earned, redeemed, donated };
  }, [filteredTransactions]);

  const handleExport = () => {
    // Create CSV content
    const headers = ['Date', 'Type', 'Description', 'Points', 'Balance'];
    const rows = filteredTransactions.map(t => [
      new Date(t.createdAt).toLocaleDateString(),
      t.type,
      t.description,
      t.points > 0 ? `+${t.points}` : t.points.toString(),
      t.balance
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pawsome-points-history-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!loyaltyCard) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-mint-green/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-fredoka text-medium-gray">Points Earned</p>
              <p className="text-2xl font-fredoka font-bold text-mint-green">
                +{summaryStats.earned.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-mint-green" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-vibrant-orange/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-fredoka text-medium-gray">Points Redeemed</p>
              <p className="text-2xl font-fredoka font-bold text-vibrant-orange">
                -{summaryStats.redeemed.toLocaleString()}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-vibrant-orange" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-lavender/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-fredoka text-medium-gray">Current Balance</p>
              <p className="text-2xl font-fredoka font-bold text-lavender">
                {loyaltyCard.points.toLocaleString()}
              </p>
            </div>
            <Gift className="h-8 w-8 text-lavender" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-medium-gray" />
            
            {/* Type Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-light-gray rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-lavender"
            >
              <option value="all">All Types</option>
              <option value="earned">Earned</option>
              <option value="redeemed">Redeemed</option>
              <option value="bonus">Bonus</option>
              <option value="donated">Donated</option>
            </select>

            {/* Date Range Filter */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-2 border border-light-gray rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-lavender"
            >
              <option value="all">All Time</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>

          <button
            onClick={() => setShowExport(!showExport)}
            className="flex items-center space-x-2 px-4 py-2 bg-lavender/10 text-lavender rounded-lg hover:bg-lavender/20 transition-colors font-fredoka"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Export Options */}
        {showExport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-soft-gray rounded-lg"
          >
            <p className="text-sm font-fredoka text-medium-gray mb-3">Export your points history as:</p>
            <div className="flex space-x-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-white border border-light-gray rounded-lg hover:bg-light-gray transition-colors font-fredoka text-sm"
              >
                CSV File
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white border border-light-gray rounded-lg hover:bg-light-gray transition-colors font-fredoka text-sm"
              >
                Print
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-light-gray">
          <h3 className="text-xl font-fredoka font-bold text-charcoal">Transaction History</h3>
          <p className="text-sm text-medium-gray mt-1">
            Showing {filteredTransactions.length} transactions
          </p>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader className="h-8 w-8 text-lavender animate-spin mr-3" />
            <p className="text-medium-gray font-fredoka">Loading transactions...</p>
          </div>
        ) : (
          <div className="divide-y divide-light-gray max-h-96 overflow-y-auto">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <Gift className="h-12 w-12 text-light-gray mx-auto mb-4" />
                <p className="text-medium-gray font-fredoka">No transactions found</p>
              </div>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-soft-gray transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getTransactionIconStyle(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-fredoka font-semibold text-charcoal">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-medium-gray">
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {transaction.expiresAt && (
                          <p className="text-xs text-coral-red mt-1">
                            Expires: {new Date(transaction.expiresAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-fredoka font-bold text-lg ${
                        transaction.points > 0 ? 'text-mint-green' : 'text-coral-red'
                      }`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-light-gray bg-soft-gray"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                className="flex items-center px-6 py-3 bg-white border-2 border-light-gray rounded-xl hover:border-lavender hover:bg-lavender/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-fredoka font-medium text-charcoal w-full sm:w-auto"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-fredoka text-medium-gray">
                  Page <span className="font-bold text-charcoal">{currentPage}</span> of <span className="font-bold text-charcoal">{totalPages}</span>
                </span>
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || loading}
                className="flex items-center px-6 py-3 bg-lavender text-white rounded-xl hover:bg-lavender/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-fredoka font-medium w-full sm:w-auto"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Helper functions
function getTransactionIcon(type: PointTransaction['type']) {
  switch (type) {
    case 'earned':
      return <TrendingUp className="h-4 w-4" />;
    case 'redeemed':
      return <Gift className="h-4 w-4" />;
    case 'bonus':
      return <Calendar className="h-4 w-4" />;
    case 'donated':
      return <Heart className="h-4 w-4" />;
    default:
      return <Gift className="h-4 w-4" />;
  }
}

function getTransactionIconStyle(type: PointTransaction['type']) {
  switch (type) {
    case 'earned':
      return 'bg-mint-green/10 text-mint-green';
    case 'redeemed':
      return 'bg-vibrant-orange/10 text-vibrant-orange';
    case 'bonus':
      return 'bg-sunny-yellow/10 text-sunny-yellow';
    case 'donated':
      return 'bg-lavender/10 text-lavender';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

export default PointsHistory;