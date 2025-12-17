import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { mockOrders } from '../../data/mockOrders';
import { MdDescription, MdHourglassEmpty, MdLocalOffer } from 'react-icons/md';
import { FaAmazon, FaEbay } from 'react-icons/fa';
import { SiShopify } from 'react-icons/si';

const Dashboard = () => {
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  // Calculate stats from mock orders
  const today = new Date().toISOString().split('T')[0];
  const totalOrdersToday = mockOrders.filter(
    (order) => order.date === today
  ).length;
  const pendingSheets = mockOrders.filter(
    (order) => order.status === 'Pending'
  ).length;
  const labelsPrinted = 156; // Mock stat

  const handleSyncOrders = () => {
    setSyncing(true);
    // Simulate API call
    setTimeout(() => {
      setSyncing(false);
      alert('All orders synced successfully!');
      navigate('/orders');
    }, 1500);
  };

  const marketplaces = [
    { name: 'Amazon', icon: FaAmazon, color: 'bg-orange-100 text-orange-700' },
    { name: 'eBay', icon: FaEbay, color: 'bg-blue-100 text-blue-700' },
    { name: 'Shopify', icon: SiShopify, color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Overview of your orders and production</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Orders Today</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{totalOrdersToday}</p>
            </div>
            <MdDescription className="text-3xl sm:text-4xl text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Pending Delivery Notes</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{pendingSheets}</p>
            </div>
            <MdHourglassEmpty className="text-3xl sm:text-4xl text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Labels Printed</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{labelsPrinted}</p>
            </div>
            <MdLocalOffer className="text-3xl sm:text-4xl text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="primary"
            fullWidth
            onClick={handleSyncOrders}
            disabled={syncing}
            className="min-h-[44px]"
          >
            {syncing ? 'Syncing...' : 'Sync Orders'}
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/production')}
            className="min-h-[44px]"
          >
            Create Delivery Note
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/labels')}
            className="min-h-[44px]"
          >
            Print Label Sheet
          </Button>
        </div>
      </Card>

      {/* Quick Link to Integrations */}
      <Card>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Marketplace Integrations</h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          Sync orders from Amazon, eBay, or Shopify. Go to the Integrations menu in the sidebar to sync orders.
        </p>
        <Button
          variant="outline"
          fullWidth
          onClick={() => navigate('/integrations')}
          className="min-h-[44px]"
        >
          Go to Integrations
        </Button>
      </Card>
    </div>
  );
};

export default Dashboard;
