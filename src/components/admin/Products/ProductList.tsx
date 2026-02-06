import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import DataTable from '../ui/DataTable';
import { Badge, StockBadge } from '../ui/Badge';
import { ConfirmModal } from '../ui/Modal';
import { FormSwitch } from '../ui/FormComponents';
import { formatters } from '../../../utils/formatters';
import { 
  dogProducts, 
  catProducts, 
  birdProducts, 
  otherAnimalsProducts,
  vetDietProducts,
  Product 
} from '../../../data/mockProducts';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  });

  useEffect(() => {
    // Combine all products
    const mockProducts = [
      ...dogProducts,
      ...catProducts,
      ...birdProducts,
      ...otherAnimalsProducts,
      ...vetDietProducts
    ];
    
    // Get admin-created products from localStorage
    const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    
    // Combine all products
    const allProducts = [...mockProducts, ...adminProducts];
    setProducts(allProducts);

    // Calculate stats
    const inStock = allProducts.filter(p => p.inStock && (p.stock ?? 0) > 10).length;
    const lowStock = allProducts.filter(p => p.inStock && (p.stock ?? 0) <= 10 && (p.stock ?? 0) > 0).length;
    const outOfStock = allProducts.filter(p => !p.inStock || (p.stock ?? 0) === 0).length;
    const totalValue = allProducts.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

    setStats({
      totalProducts: allProducts.length,
      inStock,
      lowStock,
      outOfStock,
      totalValue
    });
  }, []);

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      
      // Also remove from localStorage if it's an admin-created product
      const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      const updatedAdminProducts = adminProducts.filter((p: Product) => p.id !== selectedProduct.id);
      localStorage.setItem('adminProducts', JSON.stringify(updatedAdminProducts));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalProducts: prev.totalProducts - 1
      }));
    }
  };

  const toggleProductStatus = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    ));
  };

  const columns = [
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      render: (product: Product) => (
        <div className="flex items-center">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-10 h-10 rounded-lg object-cover mr-3"
          />
          <div>
            <p className="font-fredoka font-medium text-charcoal">{product.name}</p>
            <p className="text-sm text-gray-600">{product.brand}</p>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (product: Product) => (
        <Badge variant="info">{product.category}</Badge>
      )
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (product: Product) => (
        <span className="font-fredoka font-semibold">{formatters.currency(product.price)}</span>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (product: Product) => (
        <StockBadge stock={product.stock || 0} />
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (product: Product) => (
        <div className="flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1 font-fredoka">{product.rating}</span>
          <span className="ml-1 text-sm text-gray-600">({product.reviews})</span>
        </div>
      )
    },
    {
      key: 'inStock',
      label: 'Status',
      render: (product: Product) => (
        <FormSwitch
          label=""
          checked={product.inStock}
          onChange={() => toggleProductStatus(product.id)}
        />
      )
    }
  ];

  const actions = (product: Product) => (
    <div className="flex items-center space-x-2">
      <Link
        to={`/admin/products/${product.id}`}
        className="text-gray-600 hover:text-primary-blue transition-colors"
        title="View"
      >
        <Eye className="h-4 w-4" />
      </Link>
      <Link
        to={`/admin/products/${product.id}/edit`}
        className="text-gray-600 hover:text-primary-blue transition-colors"
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Link>
      <button
        onClick={() => handleDelete(product)}
        className="text-gray-600 hover:text-red-600 transition-colors"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-fredoka font-bold text-charcoal">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory</p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-primary-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-fredoka font-medium flex items-center transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-fredoka text-gray-600">Total Products</p>
              <p className="text-2xl font-fredoka font-bold text-charcoal mt-1">
                {stats.totalProducts}
              </p>
            </div>
            <Package className="h-8 w-8 text-primary-blue" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-fredoka text-gray-600">In Stock</p>
              <p className="text-2xl font-fredoka font-bold text-green-600 mt-1">
                {stats.inStock}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-fredoka text-gray-600">Low Stock</p>
              <p className="text-2xl font-fredoka font-bold text-yellow-600 mt-1">
                {stats.lowStock}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-fredoka text-gray-600">Out of Stock</p>
              <p className="text-2xl font-fredoka font-bold text-red-600 mt-1">
                {stats.outOfStock}
              </p>
            </div>
            <Package className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-fredoka text-gray-600">Total Value</p>
              <p className="text-xl font-fredoka font-bold text-charcoal mt-1">
                {formatters.currency(stats.totalValue)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <DataTable
          data={products}
          columns={columns}
          searchKeys={['name', 'brand', 'category']}
          pageSize={15}
          actions={actions}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default ProductList;