import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatters } from '../../../utils/formatters';
import { adminOrderService } from '../../../services/adminOrder.service';
import { mockDb } from '../../../services/mockDb';
import { seedSampleOrders } from '../../../utils/seedOrders';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  usersChange: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: number;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  stock: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 125000,
    totalOrders: 324,
    totalProducts: 156,
    totalUsers: 1250,
    revenueChange: 12.5,
    ordersChange: 8.3,
    productsChange: 2.1,
    usersChange: 15.7
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([
    {
      id: 'ORD001',
      customer: 'John Doe',
      date: '2025-01-08',
      total: 2500,
      status: 'completed',
      items: 3
    },
    {
      id: 'ORD002',
      customer: 'Jane Smith',
      date: '2025-01-08',
      total: 1800,
      status: 'processing',
      items: 2
    },
    {
      id: 'ORD003',
      customer: 'Mike Johnson',
      date: '2025-01-07',
      total: 3200,
      status: 'pending',
      items: 5
    },
    {
      id: 'ORD004',
      customer: 'Sarah Williams',
      date: '2025-01-07',
      total: 950,
      status: 'completed',
      items: 1
    },
    {
      id: 'ORD005',
      customer: 'Tom Brown',
      date: '2025-01-06',
      total: 4100,
      status: 'cancelled',
      items: 4
    }
  ]);

  const [topProducts] = useState<TopProduct[]>([
    {
      id: 'PRD001',
      name: 'Royal Canin Adult Dog Food',
      category: 'Dog Food',
      sales: 145,
      revenue: 45000,
      stock: 230
    },
    {
      id: 'PRD002',
      name: 'Whiskas Cat Food - Tuna',
      category: 'Cat Food',
      sales: 120,
      revenue: 36000,
      stock: 180
    },
    {
      id: 'PRD003',
      name: 'Premium Dog Leash',
      category: 'Accessories',
      sales: 98,
      revenue: 19600,
      stock: 75
    },
    {
      id: 'PRD004',
      name: 'Bird Seed Mix',
      category: 'Bird Food',
      sales: 87,
      revenue: 8700,
      stock: 150
    }
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load order statistics
      const orderStats = await adminOrderService.getOrderStats();
      const allOrders = mockDb.getAllOrders();
      const allUsers = mockDb.getAllUsers();
      
      // Get admin products from localStorage
      const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      const totalProducts = 133 + adminProducts.length; // Mock products + admin created
      
      // Update stats with real data
      setStats({
        totalRevenue: orderStats.totalRevenue,
        totalOrders: orderStats.totalOrders,
        totalProducts: totalProducts,
        totalUsers: allUsers.length,
        revenueChange: 12.5, // These would be calculated from historical data
        ordersChange: 8.3,
        productsChange: 2.1,
        usersChange: 15.7
      });
      
      // Get recent orders
      const recentOrdersData = allOrders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(order => ({
          id: order.id.slice(0, 8).toUpperCase(),
          customer: order.shippingAddress.fullName || order.userEmail,
          date: new Date(order.createdAt).toISOString().split('T')[0],
          total: order.totalAmount,
          status: order.status === 'confirmed' ? 'processing' : 
                 order.status === 'delivered' ? 'completed' : 
                 order.status as any,
          items: order.items.length
        }));
      
      if (recentOrdersData.length > 0) {
        setRecentOrders(recentOrdersData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-fredoka font-bold text-charcoal">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-fredoka text-gray-600">Total Revenue</p>
              <p className="text-2xl font-fredoka font-bold text-charcoal mt-2">
                {formatters.currency(stats.totalRevenue)}
              </p>
              <div className="flex items-center mt-2">
                {stats.revenueChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-fredoka ${stats.revenueChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(stats.revenueChange)}%
                </span>
                <span className="text-sm text-gray-600 ml-1">from last month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-fredoka text-gray-600">Total Orders</p>
              <p className="text-2xl font-fredoka font-bold text-charcoal mt-2">
                {stats.totalOrders}
              </p>
              <div className="flex items-center mt-2">
                {stats.ordersChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-fredoka ${stats.ordersChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(stats.ordersChange)}%
                </span>
                <span className="text-sm text-gray-600 ml-1">from last month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-fredoka text-gray-600">Total Products</p>
              <p className="text-2xl font-fredoka font-bold text-charcoal mt-2">
                {stats.totalProducts}
              </p>
              <div className="flex items-center mt-2">
                {stats.productsChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-fredoka ${stats.productsChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(stats.productsChange)}%
                </span>
                <span className="text-sm text-gray-600 ml-1">from last month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-fredoka text-gray-600">Total Users</p>
              <p className="text-2xl font-fredoka font-bold text-charcoal mt-2">
                {stats.totalUsers}
              </p>
              <div className="flex items-center mt-2">
                {stats.usersChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-fredoka ${stats.usersChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(stats.usersChange)}%
                </span>
                <span className="text-sm text-gray-600 ml-1">from last month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-fredoka font-bold text-charcoal">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary-blue hover:text-blue-700 text-sm font-fredoka">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-fredoka font-medium text-charcoal">{order.id}</p>
                    <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-fredoka ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{order.customer} • {order.items} items</p>
                </div>
                <div className="text-right">
                  <p className="font-fredoka font-semibold text-charcoal">{formatters.currency(order.total)}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-fredoka font-bold text-charcoal">Top Products</h2>
            <Link to="/admin/products" className="text-primary-blue hover:text-blue-700 text-sm font-fredoka">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center flex-1">
                  <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center text-white font-fredoka font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-fredoka font-medium text-charcoal">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category} • {product.sales} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-fredoka font-semibold text-charcoal">{formatters.currency(product.revenue)}</p>
                  <p className="text-xs text-gray-500">{product.stock} in stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-primary-blue to-vibrant-orange rounded-xl p-6 text-white">
        <h3 className="text-xl font-fredoka font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/products/new" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
            <Package className="h-8 w-8 mx-auto mb-2" />
            <span className="text-sm font-fredoka">Add Product</span>
          </Link>
          <Link to="/admin/orders" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
            <span className="text-sm font-fredoka">View Orders</span>
          </Link>
          <Link to="/admin/users" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
            <Users className="h-8 w-8 mx-auto mb-2" />
            <span className="text-sm font-fredoka">Manage Users</span>
          </Link>
          <Link to="/admin/analytics" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
            <TrendingUp className="h-8 w-8 mx-auto mb-2" />
            <span className="text-sm font-fredoka">Analytics</span>
          </Link>
        </div>
      </div>

      {/* Development Tools - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 bg-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-fredoka font-bold text-gray-700 mb-4">Development Tools</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={async () => {
                const confirm = window.confirm('This will create 20 sample orders. Continue?');
                if (confirm) {
                  try {
                    await seedSampleOrders(20);
                    alert('Sample orders created successfully!');
                    loadDashboardData();
                  } catch (error) {
                    console.error('Error creating sample orders:', error);
                    alert('Error creating sample orders. Check console.');
                  }
                }
              }}
              className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600"
            >
              Seed Sample Orders
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-fredoka hover:bg-red-600"
            >
              Clear All Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;