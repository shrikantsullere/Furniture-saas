import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FaAmazon, FaEbay } from 'react-icons/fa';
import { SiShopify } from 'react-icons/si';
import { MdHourglassEmpty } from 'react-icons/md';

const Integrations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState({});

  const integrations = [
    {
      name: 'Amazon',
      icon: FaAmazon,
      status: 'Connected',
      connected: true,
      path: '/integrations/amazon',
    },
    {
      name: 'eBay',
      icon: FaEbay,
      status: 'Not Connected',
      connected: false,
      path: '/integrations/ebay',
    },
    {
      name: 'Shopify',
      icon: SiShopify,
      status: 'Connected',
      connected: true,
      path: '/integrations/shopify',
    },
  ];

  const handleSync = (integrationName) => {
    setSyncing((prev) => ({ ...prev, [integrationName]: true }));
    // Simulate API call to sync orders
    setTimeout(() => {
      setSyncing((prev) => ({ ...prev, [integrationName]: false }));
      // Store synced marketplace in localStorage to show in orders
      localStorage.setItem('lastSyncedMarketplace', integrationName);
      // Redirect to orders page after sync
      navigate('/orders');
    }, 1500);
  };

  // Check if we're on a specific integration page
  const currentPath = location.pathname;
  const activeIntegration = integrations.find((int) => int.path === currentPath);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage marketplace integrations and sync orders</p>
      </div>

      {/* Integration Cards with Sync Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {integrations.map((integration) => {
          const IconComponent = integration.icon;
          return (
          <Card key={integration.name} className="flex flex-col">
            <div className="text-center flex-1">
              <div className="text-4xl sm:text-5xl mb-4 flex justify-center">
                <IconComponent className="text-4xl sm:text-5xl" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {integration.name}
              </h2>
              <div className="mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    integration.connected
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {integration.status}
                </span>
              </div>
              <div className="mb-4">
                <Button
                  variant={integration.connected ? 'outline' : 'primary'}
                  fullWidth
                  onClick={() => {
                    if (!integration.connected) {
                      // Simulate connection
                      alert(`Connecting to ${integration.name}...`);
                    }
                  }}
                  className="min-h-[44px]"
                >
                  {integration.connected ? 'Connected' : 'Connect'}
                </Button>
              </div>
            </div>
            
            {/* Sync Button at Bottom of Card */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleSync(integration.name)}
                disabled={syncing[integration.name] || !integration.connected}
                className="flex items-center justify-center gap-2 min-h-[44px]"
              >
                {syncing[integration.name] ? (
                  <>
                    <MdHourglassEmpty className="animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <IconComponent />
                    <span>Sync {integration.name} Orders</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
          );
        })}
      </div>

      {/* Show details if on specific integration page */}
      {activeIntegration && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {activeIntegration.name} Integration Details
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">
                Status:{' '}
                <span
                  className={`font-medium ${
                    activeIntegration.connected
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}
                >
                  {activeIntegration.status}
                </span>
              </p>
            </div>
            {activeIntegration.connected ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Successfully connected to {activeIntegration.name}. You can
                  sync orders using the "Sync Now" button above.
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Not connected. Click "Connect" to set up the{' '}
                  {activeIntegration.name} integration.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Integrations;
