import { useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';
import { mockOrders, placeholderImage } from '../../data/mockOrders';
import { generateBarcodeDataURL } from '../../utils/barcode';
import { FaAmazon, FaEbay } from 'react-icons/fa';
import { SiShopify } from 'react-icons/si';
import { MdInventory } from 'react-icons/md';

const ProductionSheet = () => {
  const location = useLocation();
  const orderData = location.state?.order || mockOrders[0];

  // Handle print for Delivery Note & Labels combined
  const handlePrint = () => {
    try {
      if (!orderData || !orderData.customerName || !orderData.id) {
        alert('Error: Missing order data.');
        return;
      }

      // Get printable HTML
      const printContent = document.querySelector('.print-area-wrapper');
      if (!printContent) {
        alert('Print content not found');
        return;
      }

      // Create hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';

      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow.document;

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print</title>
            <style>
              @page {
                size: A4;
                margin: 10mm;
              }
  
              body {
                margin: 0;
                font-family: Arial, sans-serif;
              }
  
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
  
          .print-container:first-child {
  break-after: page;
  page-break-after: always;
}



            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();

      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };

    } catch (error) {
      console.error('Print error:', error);
      alert('Printing failed');
    }
  };


  // Get marketplace icon component
  const getMarketplaceIcon = (marketplace) => {
    const iconProps = { className: 'inline-block' };
    switch (marketplace) {
      case 'Amazon':
        return <FaAmazon {...iconProps} />;
      case 'eBay':
        return <FaEbay {...iconProps} />;
      case 'Shopify':
        return <SiShopify {...iconProps} />;
      default:
        return <MdInventory {...iconProps} />;
    }
  };
  const marketplaceIcon = getMarketplaceIcon(orderData.marketplace);

  // Sofa image URL (replacing bed image)
  const sofaImage = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";

  // Company/From address for labels
  const fromAddress = {
    name: 'SOFA & FURNITURE CO.',
    addressLine1: '123 Production Street',
    addressLine2: 'London, UK',
    postcode: 'SW1A 1AA',
  };

  // Label data for shipping labels
  const labelData = {
    shipTo: {
      name: orderData.customerName,
      addressLine1: orderData.addressLine1 || orderData.fullAddress?.split(',')[0] || orderData.fullAddress,
      addressLine2: orderData.addressLine2 || orderData.fullAddress?.split(',').slice(1).join(',') || '',
      postcode: orderData.postcode,
    },
    from: fromAddress,
    orderId: orderData.id,
    weight: `${orderData.order?.quantity * 25 || 25}kg`,
    dimensions: `${orderData.order?.size || 'Standard'} - ${orderData.order?.height || 'Standard'} height`,
    shippingDate: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    remarks: orderData.extras || 'Standard delivery',
    productImage: orderData.productImage || sofaImage,
    productName: orderData.order?.model || 'Product',
  };

  // Single Label Component - Optimized for A4 printing (4 per page)
  const Label = ({ data }) => (
    <div className="border-2 border-gray-900 rounded p-2 flex flex-col justify-between h-full bg-white" style={{ fontFamily: 'Arial, sans-serif', fontSize: '9pt', overflow: 'hidden' }}>
      <div className="mb-2">
        <div className="text-xs font-bold mb-0.5 uppercase text-gray-700">Product:</div>
        <div className="flex items-start space-x-1">
          <img src={data.productImage} alt={data.productName} className="w-12 h-12 object-cover rounded border border-gray-300 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">{data.productName}</p>
            <p className="text-xs text-gray-600">ID: {data.orderId}</p>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <div className="text-xs font-bold mb-0.5 uppercase text-gray-700">SHIP TO:</div>
        <div className="text-xs">
          <p className="font-bold leading-tight">{data.shipTo.name}</p>
          <p className="text-xs leading-tight">{data.shipTo.addressLine1}</p>
          <p className="text-xs leading-tight">{data.shipTo.addressLine2}, {data.shipTo.postcode}</p>
        </div>
      </div>
      <div className="mb-2 border-t border-gray-300 pt-1">
        <div className="text-xs font-bold mb-0.5 uppercase text-gray-700">FROM:</div>
        <div className="text-xs">
          <p className="font-bold leading-tight">{data.from.name}</p>
          <p className="text-xs leading-tight">{data.from.addressLine1}</p>
          <p className="text-xs leading-tight">{data.from.addressLine2}, {data.from.postcode}</p>
        </div>
      </div>
      <div className="mb-2 border-t border-gray-300 pt-1">
        <div className="text-xs font-bold mb-0.5 uppercase text-gray-700">Order Details:</div>
        <div className="text-xs space-y-0">
          <p className="leading-tight"><span className="font-semibold">Weight:</span> {data.weight}</p>
          <p className="leading-tight"><span className="font-semibold">Dimensions:</span> {data.dimensions}</p>
          <p className="leading-tight"><span className="font-semibold">Date:</span> {data.shippingDate}</p>
          <p className="leading-tight"><span className="font-semibold">Remarks:</span> {data.remarks}</p>
        </div>
      </div>
      <div className="mt-auto border-t border-gray-300 pt-1">
        <div className="flex flex-col items-center">
          <img src={generateBarcodeDataURL(data.orderId)} alt={`Barcode ${data.orderId}`} className="h-8 w-full object-contain" />
          <p className="text-xs font-mono mt-0.5 leading-tight">{data.orderId}</p>
        </div>
      </div>
    </div>
  );

  // Delivery Note Sheet Component - Optimized for A4 printing
  const DeliveryNoteSheet = ({ order, icon, image }) => (
    <div className="bg-white" style={{ width: '190mm', minHeight: '277mm', padding: '10mm', fontFamily: 'Arial, sans-serif', fontSize: '12pt', boxSizing: 'border-box' }}>
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold text-primary mb-2">
              SOFA & FURNITURE CO.
            </div>
            <div className="text-sm text-gray-600">
              123 Production Street, London, UK
            </div>
          </div>
          <div className="text-right flex items-center gap-3">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Order ID: {order.id}
              </div>
              <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                <span>{icon}</span>
                {order.marketplace}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info Block */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
          Customer Information
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-base"><span className="font-medium">Full Name:</span> {order.customerName}</p>
          <p className="text-base"><span className="font-medium">Full Address:</span> {order.fullAddress}</p>
          <p className="text-base"><span className="font-medium">Postcode:</span> {order.postcode}</p>
          <p className="text-base"><span className="font-medium">Email:</span> {order.email}</p>
          <p className="text-base"><span className="font-medium">Phone:</span> {order.phone}</p>
        </div>
      </div>

      {/* Order Details Block */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
          Order Details
        </h2>
        <div className="flex gap-4 mb-4">
          <div className="w-1/3">
            <img src={image} alt={order.order.model} className="w-full h-48 object-cover rounded-lg border border-gray-300" />
            <p className="text-sm text-center mt-2 font-medium">{order.order.model}</p>
          </div>
          <div className="w-2/3 bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-base"><span className="font-medium">Model:</span> {order.order.model}</p>
            <p className="text-base"><span className="font-medium">Size:</span> {order.order.size}</p>
            <p className="text-base"><span className="font-medium">Colour:</span> {order.order.colour}</p>
            <p className="text-base"><span className="font-medium">Material:</span> {order.order.storage || 'Premium Fabric'}</p>
            <p className="text-base"><span className="font-medium">Height:</span> {order.order.height}</p>
            <p className="text-base"><span className="font-medium">Quantity:</span> {order.order.quantity}</p>
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">EXTRA NOTES</h3>
          <div className="border-2 border-gray-300 rounded-lg p-4 min-h-[200px] bg-white">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{order.extras || 'Add any additional notes here...'}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t-2 border-gray-300">
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600"><span className="font-medium">Date Generated:</span> {new Date().toLocaleDateString('en-GB')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Status:</span>{' '}
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {order.status}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-900 mb-2">Production Signature:</p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[60px]"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Special CSS for printing */}
      <style>{`
        @media screen {
          .print-area-wrapper {
            position: absolute !important;
            left: -9999px !important;
            top: 0 !important;
            visibility: hidden !important;
          }
        }
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Hide everything except print content */
          body * {
            visibility: hidden;
          }
          /* Show print wrapper and all its content */
          .print-area-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            display: block !important;
            visibility: visible !important;
          }
          .print-area-wrapper,
          .print-area-wrapper *,
          .print-area-wrapper img,
          .print-area-wrapper p,
          .print-area-wrapper div,
          .print-area-wrapper span,
          .print-area-wrapper h1,
          .print-area-wrapper h2,
          .print-area-wrapper h3 {
            visibility: visible !important;
          }
          /* Ensure containers are visible */
          .print-container {
  display: block !important;
  visibility: visible !important;
  break-inside: avoid;
  page-break-inside: avoid;
}

          /* Preserve layouts */
          .print-area-wrapper div[style*="grid"] {
            display: grid !important;
            visibility: visible !important;
          }
          .print-area-wrapper div[style*="flex"] {
            display: flex !important;
            visibility: visible !important;
          }
          /* Hide screen content */
          .screen-content {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      {/* Screen-only content */}
      <div className="screen-content space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Delivery Note</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">A4 print-friendly delivery note with labels</p>
          </div>
          <Button variant="primary" onClick={handlePrint} className="w-full sm:w-auto min-h-[44px]">
            Print Delivery Note & Labels
          </Button>
        </div>

        {/* Screen Preview - Delivery Note */}
        <div className="bg-white shadow-lg mx-auto p-4 sm:p-6 md:p-8" style={{ maxWidth: '900px' }}>
          <DeliveryNoteSheet order={orderData} icon={marketplaceIcon} image={sofaImage} />
        </div>

        {/* Screen Preview - Labels */}
        <div className="bg-white shadow-lg p-2 sm:p-4 mx-auto" style={{ maxWidth: '900px' }}>
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-center">Label Preview (4 Labels per A4)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <Label data={labelData} />
            <Label data={labelData} />
            <Label data={labelData} />
            <Label data={labelData} />
          </div>
        </div>
      </div>

      {/* This wrapper is for printing only and will be hidden on screen */}
      <div className="print-area-wrapper">
        {/* PRINT PAGE 1: Delivery Note (A4) */}
        <div className="print-container">
          <DeliveryNoteSheet order={orderData} icon={marketplaceIcon} image={sofaImage} />
        </div>

        {/* PRINT PAGE 2: 4 Labels (A4 with 2x2 grid) */}

        {/* PRINT PAGE 2: 4 Labels (A4 – SINGLE PAGE ONLY) */}
{/* PRINT PAGE 2: 4 Labels (A4 – SINGLE PAGE ONLY) */}
<div
  className="print-container"
  style={{
    width: '210mm',
    height: '297mm',
    padding: '10mm',
    boxSizing: 'border-box',
    overflow: 'hidden',
  }}
>
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: '6mm',
      width: '100%',
      height: '100%',
    }}
  >
    <Label data={labelData} />
    <Label data={labelData} />
    <Label data={labelData} />
    <Label data={labelData} />
  </div>
</div>


        </div>
    
    </>
  );
};

export default ProductionSheet;
