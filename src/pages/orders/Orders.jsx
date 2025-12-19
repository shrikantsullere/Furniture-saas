import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Offcanvas from '../../components/offcanvas/Offcanvas';
import Card from '../../components/common/Card';
import SearchBar from '../../components/common/SearchBar';
import { mockOrders, placeholderImage } from '../../data/mockOrders';
import { useSearch } from '../../context/SearchContext';
import { FaAmazon, FaEbay } from 'react-icons/fa';
import { SiShopify } from 'react-icons/si';
import { MdCheckCircle } from 'react-icons/md';

const ORDERS_STORAGE_KEY = 'furniture_orders';

// Initialize orders from localStorage or use mock data
const initializeOrders = () => {
  try {
    const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (storedOrders) {
      const parsed = JSON.parse(storedOrders);
      // Ensure all orders have deliveryNoteNumber
      return parsed.map(order => ({
        ...order,
        deliveryNoteNumber: order.deliveryNoteNumber || `DN-${order.id}`,
      }));
    }
  } catch (error) {
    console.error('Error loading orders from localStorage:', error);
  }
  
  // Initialize mock orders with deliveryNoteNumber if not exists
  return mockOrders.map(order => ({
    ...order,
    deliveryNoteNumber: order.deliveryNoteNumber || `DN-${order.id}`,
  }));
};


// Save orders to localStorage
const saveOrdersToStorage = (orders) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
};

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { globalSearchQuery, setSearchQuery: setGlobalSearchQuery } = useSearch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [orders, setOrders] = useState(() => initializeOrders());
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || '');
  const [editingExtras, setEditingExtras] = useState({});
  const [syncedMarketplace, setSyncedMarketplace] = useState(null);

  // Load orders from localStorage on mount
  useEffect(() => {
    const loadedOrders = initializeOrders();
    setOrders(loadedOrders);
    setFilteredOrders(loadedOrders);
  }, []);

  // Sync with global search query
  useEffect(() => {
    if (globalSearchQuery !== searchQuery) {
      setSearchQuery(globalSearchQuery || '');
      if (globalSearchQuery) {
        handleSearch(globalSearchQuery);
      } else {
        setFilteredOrders(orders);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalSearchQuery]);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      saveOrdersToStorage(orders);
    }
  }, [orders]);

  // Check for recently synced marketplace
  useEffect(() => {
    const lastSynced = localStorage.getItem('lastSyncedMarketplace');
    if (lastSynced) {
      setSyncedMarketplace(lastSynced);
      localStorage.removeItem('lastSyncedMarketplace');
      // Filter orders by marketplace if needed
      const marketplaceOrders = orders.filter(order => order.marketplace === lastSynced);
      if (marketplaceOrders.length > 0) {
        setFilteredOrders(marketplaceOrders);
      }
    }
  }, [orders]);

  // Enhanced search functionality - searches all order fields
  const handleSearch = (query) => {
    const searchValue = query || '';
    setSearchQuery(searchValue);
    setGlobalSearchQuery(searchValue); // Sync with global search
    
    if (!searchValue.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const lowerQuery = searchValue.toLowerCase();
    const filtered = orders.filter(order => {
      // Search in all relevant fields
      const searchFields = [
        order.id,
        order.customerName,
        order.deliveryNoteNumber,
        order.marketplace,
        order.fullAddress,
        order.addressLine1,
        order.addressLine2,
        order.postcode,
        order.email,
        order.phone,
        order.status,
        order.extras,
        order.order?.model,
        order.order?.size,
        order.order?.colour,
        order.order?.storage,
        order.order?.height,
      ].filter(Boolean); // Remove null/undefined values

      return searchFields.some(field => 
        String(field).toLowerCase().includes(lowerQuery)
      );
    });
    setFilteredOrders(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setGlobalSearchQuery(''); // Clear global search too
    setFilteredOrders(orders);
  };
  
  // Add Order Modal State
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    orderName: '',
    orderId: '',
    marketplace: 'Manual',   // ✅ NEW
    postcode: '',             // ✅ NEW
    orderDescription: '',
    quantity: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if we're on pending sheets page
  const isPendingPage = location.pathname === '/orders/pending';
  const displayedOrders = isPendingPage
    ? filteredOrders.filter((order) => order.status === 'Pending')
    : filteredOrders;

  const handleView = (order) => {
    setSelectedOrder(order);
    setEditingExtras({ [order.id]: order.extras });
    setIsOffcanvasOpen(true);
  };

  const handleExtrasChange = (orderId, value) => {
    setEditingExtras((prev) => ({ ...prev, [orderId]: value }));
    // Update order in state
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, extras: value } : order
    );
    setOrders(updatedOrders);
    // Update filtered orders if search is active
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      setFilteredOrders(updatedOrders);
    }
  };

  const handleGenerateSheet = () => {
    if (selectedOrder) {
      navigate('/production', { state: { order: selectedOrder } });
    }
  };

  const handleGenerateLabels = () => {
    if (selectedOrder) {
      navigate('/labels', { state: { order: selectedOrder } });
    }
  };

  // Add Order Modal Handlers
  const handleOpenAddOrderModal = () => {
    setIsAddOrderModalOpen(true);
    setFormData({
      orderName: '',
      orderId: '',
      orderDescription: '',
      quantity: '',
    });
    setFormErrors({});
  };

  const handleCloseAddOrderModal = () => {
    setIsAddOrderModalOpen(false);
    setFormData({
      orderName: '',
      orderId: '',
      orderDescription: '',
      quantity: '',
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.orderName.trim()) {
      errors.orderName = 'Order Name is required';
    }
    
    if (!formData.orderId.trim()) {
      errors.orderId = 'Order ID is required';
    }
    
    if (!formData.orderDescription.trim()) {
      errors.orderDescription = 'Order Description is required';
    }
    
    if (!formData.quantity.trim()) {
      errors.quantity = 'Quantity is required';
    }
    if (!formData.marketplace.trim()) {
      errors.marketplace = 'Marketplace is required';
    }
    
    if (!formData.postcode.trim()) {
      errors.postcode = 'Postcode is required';
    } 
    else if (isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
      errors.quantity = 'Quantity must be a positive number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create new order object
      const newOrder = {
        id: formData.orderId,
        marketplace: formData.marketplace,
        customerName: formData.orderName,
        fullAddress: formData.orderDescription,
        addressLine1: formData.orderDescription.split(',')[0] || formData.orderDescription,
        addressLine2: formData.orderDescription.split(',')[1] || '',
        postcode: formData.postcode,
        email: '',
        phone: '',
        itemsCount: parseInt(formData.quantity),
        extras: '',
        order: {
          model: formData.orderDescription,
          size: 'Standard',
          colour: 'Standard',
          storage: 'Standard',
          height: 'Standard',
          quantity: parseInt(formData.quantity),
        },
        productImage: placeholderImage,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        deliveryNoteNumber: `DN-${formData.orderId}`,
      };

      // Add order to state
      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      
      // Update filtered orders
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setFilteredOrders(updatedOrders);
      }
      
      setIsSubmitting(false);
      handleCloseAddOrderModal();
      
      // Show success feedback
      alert('Order added successfully!');
    }, 500);
  };

  const isFormValid = formData.orderName.trim() && 
                      formData.orderId.trim() && 
                      formData.orderDescription.trim() && 
                      formData.quantity.trim() && 
                      !isNaN(formData.quantity) && 
                      parseInt(formData.quantity) > 0;

  const tableHeaders = [
    'Order ID',
    'Marketplace',
    'Customer Name',
    'Postcode',
    'Items Count',
    'Extras',
    'Action',
  ];

  return (
    <div className="space-y-6">
      {syncedMarketplace && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <MdCheckCircle className="text-green-800 flex-shrink-0" />
          <p className="text-sm text-green-800">
            Successfully synced orders from {syncedMarketplace}. Showing {orders.length} order(s).
          </p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isPendingPage ? 'Pending Sheets' : 'All Orders'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {isPendingPage
              ? 'Orders awaiting delivery notes'
              : 'Manage and view all orders'}
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAddOrderModal} className="w-full sm:w-auto min-h-[44px]">
          + Add Order
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search by Order ID, Customer Name, or Delivery Note Number..."
        />
      </Card>

      {searchQuery && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Showing {displayedOrders.length} result(s) for "{searchQuery}"
          </p>
        </div>
      )}

      <Card>
        <Table headers={tableHeaders}>
          {displayedOrders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.id}
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="inline-flex items-center gap-1">
                  {order.marketplace === 'Amazon' && <FaAmazon className="text-orange-600" />}
                  {order.marketplace === 'eBay' && <FaEbay className="text-blue-600" />}
                  {order.marketplace === 'Shopify' && <SiShopify className="text-green-600" />}
                  <span className="hidden sm:inline">{order.marketplace}</span>
                </span>
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {order.customerName}
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.postcode}
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.itemsCount}
              </td>
              <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">
                <input
                  type="text"
                  value={editingExtras[order.id] || order.extras || ''}
                  onChange={(e) => handleExtrasChange(order.id, e.target.value)}
                  placeholder="Add notes..."
                  className="w-full min-w-[120px] px-2 py-2 border border-primary rounded text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(order)}
                  className="min-h-[36px]"
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Add Order Modal */}
      <Modal
        isOpen={isAddOrderModalOpen}
        onClose={handleCloseAddOrderModal}
        title="Add New Order"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="orderName"
              value={formData.orderName}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary ${
                formErrors.orderName ? 'border-red-500' : 'border-primary'
              }`}
              placeholder="Enter order name"
            />
            {formErrors.orderName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.orderName}</p>
            )}
          </div>

          {/* Order ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="orderId"
              value={formData.orderId}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary ${
                formErrors.orderId ? 'border-red-500' : 'border-primary'
              }`}
              placeholder="Enter order ID"
            />
            {formErrors.orderId && (
              <p className="text-red-500 text-xs mt-1">{formErrors.orderId}</p>
            )}
          </div>

          {/* Order Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="orderDescription"
              value={formData.orderDescription}
              onChange={handleInputChange}
              rows="4"
              className={`w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary ${
                formErrors.orderDescription ? 'border-red-500' : 'border-primary'
              }`}
              placeholder="Enter order description"
            />
            {formErrors.orderDescription && (
              <p className="text-red-500 text-xs mt-1">{formErrors.orderDescription}</p>
            )}
          </div>

          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Marketplace <span className="text-red-500">*</span>
  </label>
  <select
    name="marketplace"
    value={formData.marketplace}
    onChange={handleInputChange}
    className={`w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary ${
      formErrors.marketplace ? 'border-red-500' : 'border-primary'
    }`}
  >
    <option value="Manual">Manual</option>
    <option value="Amazon">Amazon</option>
    <option value="eBay">eBay</option>
    <option value="Shopify">Shopify</option>
  </select>
  {formErrors.marketplace && (
    <p className="text-red-500 text-xs mt-1">{formErrors.marketplace}</p>
  )}
</div>


<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Postcode <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    name="postcode"
    value={formData.postcode}
    onChange={handleInputChange}
    className={`w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary ${
      formErrors.postcode ? 'border-red-500' : 'border-primary'
    }`}
    placeholder="Enter postcode"
  />
  {formErrors.postcode && (
    <p className="text-red-500 text-xs mt-1">{formErrors.postcode}</p>
  )}
</div>


          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              className={`w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary ${
                formErrors.quantity ? 'border-red-500' : 'border-primary'
              }`}
              placeholder="Enter quantity"
            />
            {formErrors.quantity && (
              <p className="text-red-500 text-xs mt-1">{formErrors.quantity}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseAddOrderModal}
              className="flex-1 min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 min-h-[44px]"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Order Offcanvas */}
      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={() => setIsOffcanvasOpen(false)}
        title={`Order ${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Product Image */}
            <div className="flex justify-center">
              <img
                src={selectedOrder.productImage || placeholderImage}
                alt={selectedOrder.order.model}
                className="w-full max-w-md h-auto max-h-64 object-cover rounded-lg border border-gray-200"
                style={{ maxWidth: '100%', height: 'auto' }}
                onError={(e) => {
                  e.target.src = placeholderImage;
                }}
              />
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p>
                  <span className="font-medium">Full Name:</span>{' '}
                  {selectedOrder.customerName}
                </p>
                <p>
                  <span className="font-medium">Full Address:</span>{' '}
                  {selectedOrder.fullAddress}
                </p>
                <p>
                  <span className="font-medium">Postcode:</span>{' '}
                  {selectedOrder.postcode}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{' '}
                  {selectedOrder.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{' '}
                  {selectedOrder.phone}
                </p>
              </div>
            </div>

            {/* Order Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p>
                  <span className="font-medium">Model:</span>{' '}
                  {selectedOrder.order.model}
                </p>
                <p>
                  <span className="font-medium">Size:</span>{' '}
                  {selectedOrder.order.size}
                </p>
                <p>
                  <span className="font-medium">Colour:</span>{' '}
                  {selectedOrder.order.colour}
                </p>
                <p>
                  <span className="font-medium">Storage Option:</span>{' '}
                  {selectedOrder.order.storage}
                </p>
                <p>
                  <span className="font-medium">Height:</span>{' '}
                  {selectedOrder.order.height}
                </p>
                <p>
                  <span className="font-medium">Quantity:</span>{' '}
                  {selectedOrder.order.quantity}
                </p>
              </div>
            </div>

            {/* Extras */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Extras
              </h3>
              <textarea
                className="w-full border border-primary rounded-lg p-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
                rows="4"
                value={editingExtras[selectedOrder.id] || selectedOrder.extras || ''}
                onChange={(e) =>
                  handleExtrasChange(selectedOrder.id, e.target.value)
                }
                placeholder="Add any additional notes..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                onClick={handleGenerateSheet}
                className="flex-1 min-h-[44px]"
              >
                Generate Delivery Note (A4)
              </Button>
              <Button
                variant="primary"
                onClick={handleGenerateLabels}
                className="flex-1 min-h-[44px]"
              >
                Generate 4 Labels (A4)
              </Button>
            </div>
          </div>
        )}
      </Offcanvas>
    </div>
  );
};

export default Orders;
