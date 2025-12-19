import React, { useRef, useState } from 'react';
import { generateBarcodeDataURL } from '../../utils/barcode';
import { FaAmazon, FaEbay } from 'react-icons/fa';
import { SiShopify } from 'react-icons/si';
import { MdInventory } from 'react-icons/md';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ProductionSheetComponent = () => {
  const contentRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isProductionSheetEditMode, setIsProductionSheetEditMode] = useState(false);
  const [isLabelEditMode, setIsLabelEditMode] = useState(false);
  
  // Saved production sheet data
  const [savedProductionData, setSavedProductionData] = useState({
    id: 'ORD-001',
    customerName: 'John Smith',
    fullAddress: '23 Principal Street, Apt 45A, New York, 10001',
    phone: '+1 234-567-8901',
    email: 'john.smith@example.com',
    productModel: 'Comfort Plus',
    size: 'King - 30cm height',
    colour: 'Gray',
    storage: 'With Storage',
    height: '30cm',
    quantity: 2,
    orderDate: '15/05/2023',
    deliveryDate: '25/05/2023',
    extras: 'Delivery before 5pm',
    status: 'In Production',
    marketplace: 'Amazon',
    signature: '' // Added signature field
  });
  
  // Temporary production Sheet data for editing
  const [tempProductionData, setTempProductionData] = useState({
    id: 'ORD-001',
    customerName: 'John Smith',
    fullAddress: '23 Principal Street, Apt 45A, New York, 10001',
    phone: '+1 234-567-8901',
    email: 'john.smith@example.com',
    productModel: 'Comfort Plus',
    size: 'King - 30cm height',
    colour: 'Gray',
    storage: 'With Storage',
    height: '30cm',
    quantity: 2,
    orderDate: '15/05/2023',
    deliveryDate: '25/05/2023',
    extras: 'Delivery before 5pm',
    status: 'In Production',
    marketplace: 'Amazon',
    signature: '' // Added signature field
  });
  
  // Saved label data
  const [savedLabelData, setSavedLabelData] = useState({
    id: 'ORD-001',
    customerName: 'John Smith',
    fullAddress: '23 Principal Street, Apt 45A, New York, 10001',
    shipper: 'SOFA & FURNITURE CO.',
    shipperAddress: '123 Production Street, London, UK, SW1A 1AA',
    weight: '50kg',
    item: 'Comfort Plus',
    size: 'King - 30cm height',
    date: '18/12/2025',
    notes: 'Delivery before 5pm'
  });
  
  // Temporary label data for editing
  const [tempLabelData, setTempLabelData] = useState({
    id: 'ORD-001',
    customerName: 'John Smith',
    fullAddress: '23 Principal Street, Apt 45A, New York, 10001',
    shipper: 'SOFA & FURNITURE CO.',
    shipperAddress: '123 Production Street, London, UK, SW1A 1AA',
    weight: '50kg',
    item: 'Comfort Plus',
    size: 'King - 30cm height',
    date: '18/12/2025',
    notes: 'Delivery before 5pm'
  });
  
  // Handle production Sheet input changes
  const handleProductionInputChange = (field, value) => {
    setTempProductionData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle label input changes
  const handleLabelInputChange = (field, value) => {
    setTempLabelData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Toggle production Sheet edit mode
  const toggleProductionSheetEditMode = () => {
    if (isProductionSheetEditMode) {
      // Save data
      setSavedProductionData(tempProductionData);
      setIsProductionSheetEditMode(false);
      alert('Production sheet details saved successfully!');
    } else {
      // Enter edit mode
      setTempProductionData(savedProductionData);
      setIsProductionSheetEditMode(true);
    }
  };
  
  // Cancel production Sheet edit mode
  const cancelProductionSheetEdit = () => {
    setTempProductionData(savedProductionData);
    setIsProductionSheetEditMode(false);
  };
  
  // Toggle label edit mode
  const toggleLabelEditMode = () => {
    if (isLabelEditMode) {
      // Save data
      setSavedLabelData(tempLabelData);
      setIsLabelEditMode(false);
      alert('Label details saved successfully!');
    } else {
      // Enter edit mode
      setTempLabelData(savedLabelData);
      setIsLabelEditMode(true);
    }
  };
  
  // Cancel label edit mode
  const cancelLabelEdit = () => {
    setTempLabelData(savedLabelData);
    setIsLabelEditMode(false);
  };
  
  // Handle signature upload
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleProductionInputChange('signature', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Clear signature
  const clearSignature = () => {
    handleProductionInputChange('signature', '');
  };
  
  const handleDownloadPDF = async () => {
    if (isProductionSheetEditMode || isLabelEditMode) {
      alert('Please save your changes before downloading PDF!');
      return;
    }
    
    // Always generate PDF
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Get content to print
      const printContent = contentRef.current;
      const a4Containers = printContent.querySelectorAll('.a4-container');
      
      // Process each A4 container
      for (let i = 0; i < a4Containers.length; i++) {
        const container = a4Containers[i];
        
        // Convert container to canvas
        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // Add image to PDF
        if (i > 0) {
          pdf.addPage();
        }
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      // Save the PDF
      pdf.save(`production-sheet-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
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

  const marketplaceIcon = getMarketplaceIcon(savedProductionData.marketplace);

  // Sofa image URL
  const sofaImage = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="production-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        
        * {
          font-family: 'Roboto', sans-serif;
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
        }
        
        .production-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          position: relative;
          width: 100%;
        }
        
        .a4-container {
          width: 210mm;
          min-height: 297mm;
          background-color: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          padding: 20mm;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        
        .print-button-container {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-bottom: 20px;
          position: sticky;
          top: 20px;
        }
        
        .download-button, .edit-button, .cancel-button {
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .download-button {
          background-color: #00B7B5;
        }
        
        .download-button:hover {
          background-color: #009a98;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .edit-button {
          background-color: #FFA500;
        }
        
        .edit-button:hover {
          background-color: #FF8C00;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .edit-button.editing {
          background-color: #28a745;
        }
        
        .edit-button.editing:hover {
          background-color: #218838;
        }
        
        .cancel-button {
          background-color: #dc3545;
        }
        
        .cancel-button:hover {
          background-color: #c82333;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .download-button:disabled, .edit-button:disabled, .cancel-button:disabled {
          cursor: not-allowed;
          transform: none;
          opacity: 0.6;
        }
        
        .download-button svg, .edit-button svg, .cancel-button svg {
          width: 18px;
          height: 18px;
        }
        
        /* Production Sheet Styles */
        .production-sheet {
          margin-bottom: 30px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #00B7B5;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
        }
        
        .company-logo {
          font-size: 22px;
          font-weight: 700;
          color: #00B7B5;
          margin-right: 20px;
        }
        
        .marketplace-logo {
          font-size: 16px;
          color: #666;
          padding: 5px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .order-id {
          font-size: 24px;
          font-weight: 700;
          color: #333;
        }
        
        .content {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          flex-grow: 1;
        }
        
        .left-column {
          flex: 1;
        }
        
        .right-column {
          flex: 1;
        }
        
        .section {
          margin-bottom: 25px;
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 5px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 15px;
          color: #00B7B5;
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 10px;
        }
        
        .info-label {
          font-weight: 500;
          width: 150px;
          color: #555;
          flex-shrink: 0;
        }
        
        .info-value {
          flex: 1;
          color: #333;
          word-wrap: break-word;
        }
        
        .info-input {
          flex: 1;
          border: none;
          border-bottom: 1px solid #ddd;
          padding: 2px 4px;
          font-family: 'Roboto', sans-serif;
          font-size: 16px;
          color: #333;
          background-color: transparent;
        }
        
        .info-input:focus {
          outline: none;
          border-bottom-color: #00B7B5;
        }
        
        .product-image-container {
          width: 100%;
          height: 200px;
          border: 1px solid #ddd;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 15px;
        }
        
        .product-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .footer {
          display: flex;
          justify-content: space-between;
          border-top: 2px solid #00B7B5;
          padding-top: 15px;
          margin-top: auto;
        }
        
        .footer-section {
          width: 30%;
        }
        
        .notes {
          width: 100%;
          height: 100px;
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 5px;
          resize: none;
        }
        
        /* Signature Styles */
        .signature-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 60px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #fff;
          position: relative;
        }
        
        .signature-image {
          max-height: 50px;
          max-width: 100%;
          object-fit: contain;
        }
        
        .signature-placeholder {
          color: #999;
          font-style: italic;
          font-size: 14px;
        }
        
        .signature-input {
          display: none;
        }
        
        .signature-buttons {
          position: absolute;
          top: -25px;
          right: 0;
          display: flex;
          gap: 5px;
        }
        
        .signature-btn {
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 3px;
          padding: 3px 8px;
          font-size: 12px;
          cursor: pointer;
          color: #666;
        }
        
        .signature-btn:hover {
          background-color: #e0e0e0;
        }
        
        /* Label Sheet Styles */
        .label-sheet {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 10px;
          height: 100%;
        }
        
        .label {
          border: 2px dashed #ccc;
          padding: 15px;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        .label-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        
        .label-title {
          font-weight: 700;
          font-size: 16px;
          color: #00B7B5;
        }
        
        .label-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        
        .label-row {
          display: flex;
          margin-bottom: 5px;
          font-size: 14px;
        }
        
        .label-label {
          font-weight: 500;
          width: 80px;
          color: #555;
          flex-shrink: 0;
        }
        
        .label-value {
          flex: 1;
          color: #333;
          word-wrap: break-word;
        }
        
        .label-input {
          flex: 1;
          border: none;
          border-bottom: 1px solid #ddd;
          padding: 2px 4px;
          font-family: 'Roboto', sans-serif;
          font-size: 14px;
          color: #333;
          background-color: transparent;
        }
        
        .label-input:focus {
          outline: none;
          border-bottom-color: #00B7B5;
        }
        
        .label-product-image {
          max-width: 120px;
          max-height: 120px;
          border: 1px solid #ddd;
          border-radius: 5px;
          margin: 10px auto;
          align-self: center;
          object-fit: contain;
        }
        
        .barcode {
          margin-top: auto;
          text-align: center;
        }
        
        .barcode img {
          height: 40px;
        }
        
        .barcode-text {
          font-size: 12px;
          color: #666;
        }
        
        /* Mobile Responsive Styles */
        @media screen and (max-width: 1200px) {
          .a4-container {
            transform: scale(0.8);
            transform-origin: top center;
            margin-bottom: -50px;
          }
        }
        
        @media screen and (max-width: 768px) {
          body {
            padding: 10px;
          }
          
          .a4-container {
            width: 100%;
            min-height: auto;
            padding: 15px;
            box-shadow: none;
            border: 1px solid #ddd;
            transform: none;
            margin-bottom: 30px;
          }
          
          .print-button-container {
            position: relative;
            top: 0;
            margin-bottom: 15px;
            flex-wrap: wrap;
          }
          
          .download-button, .edit-button, .cancel-button {
            padding: 10px 15px;
            font-size: 14px;
            flex: 1;
            min-width: 120px;
            justify-content: center;
          }
          
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .logo-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .order-id {
            font-size: 20px;
          }
          
          .content {
            flex-direction: column;
            gap: 15px;
          }
          
          .info-row {
            flex-direction: column;
          }
          
          .info-label {
            width: 100%;
            margin-bottom: 4px;
          }
          
          .footer {
            flex-direction: column;
            gap: 15px;
          }
          
          .footer-section {
            width: 100%;
          }
          
          .label-sheet {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, auto);
            gap: 15px;
            height: auto;
          }
          
          .label {
            min-height: 350px;
          }
          
          .product-image-container {
            height: 150px;
          }
          
          .label-product-image {
            max-width: 100px;
            max-height: 100px;
          }
        }
        
        @media screen and (max-width: 480px) {
          .download-button, .edit-button, .cancel-button {
            padding: 8px 12px;
            font-size: 12px;
          }
          
          .company-logo {
            font-size: 18px;
          }
          
          .order-id {
            font-size: 18px;
          }
          
          .section-title {
            font-size: 16px;
          }
          
          .info-label, .info-value {
            font-size: 14px;
          }
        }
      `}</style>
      
      <div className="print-button-container">
        <button 
          className="download-button" 
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? (
            <>
              <div className="spinner"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>
      
      <div ref={contentRef}>
        {/* Page 1: Single Production Sheet */}
        <div className="a4-container production-sheet">
          {/* Production Sheet Edit Buttons */}
          <div className="print-button-container" style={{position: 'absolute', top: '10px', right: '10px', zIndex: 10}}>
            {isProductionSheetEditMode && (
              <button 
                className="cancel-button" 
                onClick={cancelProductionSheetEdit}
                disabled={isGeneratingPDF}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            )}
            <button 
              className={`edit-button ${isProductionSheetEditMode ? 'editing' : ''}`} 
              onClick={toggleProductionSheetEditMode}
              disabled={isGeneratingPDF}
            >
              {isProductionSheetEditMode ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </>
              )}
            </button>
          </div>
          
          <div className="header">
            <div className="logo-section">
              <div className="company-logo">SOFA & FURNITURE CO.</div>
              <div className="marketplace-logo">
                {marketplaceIcon} {savedProductionData.marketplace}
              </div>
            </div>
            <div className="order-id">{savedProductionData.id}</div>
          </div>
          
          <div className="content">
            <div className="left-column">
              <div className="section">
                <div className="section-title">Customer Information</div>
                <div className="info-row">
                  <div className="info-label">Name:</div>
                  {isProductionSheetEditMode ? (
                    <input 
                      type="text" 
                      className="info-input" 
                      value={tempProductionData.customerName} 
                      onChange={(e) => handleProductionInputChange('customerName', e.target.value)}
                    />
                  ) : (
                    <div className="info-value">{savedProductionData.customerName}</div>
                  )}
                </div>
                <div className="info-row">
                  <div className="info-label">Address:</div>
                  {isProductionSheetEditMode ? (
                    <input 
                      type="text" 
                      className="info-input" 
                      value={tempProductionData.fullAddress} 
                      onChange={(e) => handleProductionInputChange('fullAddress', e.target.value)}
                    />
                  ) : (
                    <div className="info-value">{savedProductionData.fullAddress}</div>
                  )}
                </div>
                <div className="info-row">
                  <div className="info-label">Phone:</div>
                  {isProductionSheetEditMode ? (
                    <input 
                      type="text" 
                      className="info-input" 
                      value={tempProductionData.phone} 
                      onChange={(e) => handleProductionInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <div className="info-value">{savedProductionData.phone}</div>
                  )}
                </div>
                <div className="info-row">
                  <div className="info-label">Email:</div>
                  {isProductionSheetEditMode ? (
                    <input 
                      type="text" 
                      className="info-input" 
                      value={tempProductionData.email} 
                      onChange={(e) => handleProductionInputChange('email', e.target.value)}
                    />
                  ) : (
                    <div className="info-value">{savedProductionData.email}</div>
                  )}
                </div>
              </div>
              
              <div className="section">
                <div className="section-title">Order Details</div>
                <div className="info-row">
                  <div className="info-label">Product Model:</div>
                  {isProductionSheetEditMode ? (
                    <input 
                      type="text" 
                      className="info-input" 
                      value={tempProductionData.productModel} 
                      onChange={(e) => handleProductionInputChange('productModel', e.target.value)}
                    />
                  ) : (
                    <div className="info-value">{savedProductionData.productModel}</div>
                  )}
                </div>
                <div className="info-row">
                  <div className="info-label">Size:</div>
                  {isProductionSheetEditMode ? (
                    <input 
                      type="text" 
                      className="info-input" 
                      value={tempProductionData.size} 
                      onChange={(e) => handleProductionInputChange('size', e.target.value)}
                    />
                  ) : (
                    <div className="info-value">{savedProductionData.size}</div>
                  )}
                </div>
                <div className="info-row">
                  <div className="info-label">Color:</div>
                  {isProductionSheetEditMode ? (
                    <input 
                      type="text" 
                      className="info-input" 
                      value={tempProductionData.colour} 
                      onChange={(e) => handleProductionInputChange('colour', e.target.value)}
                    />
                  ) : (
                    <div className="info-value">{savedProductionData.colour}</div>
                  )}
                </div>
                <div className="info-row">
                  <div className="info-label">Features:</div>
                  {isProductionSheetEditMode ? (
                    <input 
                      type="text" 
                      className="info-input" 
                      value={`${tempProductionData.storage}, ${tempProductionData.height} Height`} 
                      onChange={(e) => {
                        const value = e.target.value;
                        const parts = value.split(', ');
                        if (parts.length >= 2) {
                          handleProductionInputChange('storage', parts[0]);
                          const heightPart = parts[1];
                          handleProductionInputChange('height', heightPart.replace(' Height', ''));
                        }
                      }}
                    />
                  ) : (
                    <div className="info-value">{savedProductionData.storage}, {savedProductionData.height} Height</div>
                  )}
                </div>
                <div className="info-row">
                  <div className="info-label">Quantity:</div>
                  {isProductionSheetEditMode ? (
                    <input 
                      type="number" 
                      className="info-input" 
                      value={tempProductionData.quantity} 
                      onChange={(e) => handleProductionInputChange('quantity', e.target.value)}
                    />
                  ) : (
                    <div className="info-value">{savedProductionData.quantity}</div>
                  )}
                </div>
                <div className="info-row">
                  <div className="info-label">Order Date:</div>
                  {isProductionSheetEditMode ? (
                    <input 
                      type="text" 
                      className="info-input" 
                      value={tempProductionData.orderDate} 
                      onChange={(e) => handleProductionInputChange('orderDate', e.target.value)}
                    />
                  ) : (
                    <div className="info-value">{savedProductionData.orderDate}</div>
                  )}
                </div>
                <div className="info-row">
                  <div className="info-label">Delivery Date:</div>
                  {isProductionSheetEditMode ? (
                    <input 
                      type="text" 
                      className="info-input" 
                      value={tempProductionData.deliveryDate} 
                      onChange={(e) => handleProductionInputChange('deliveryDate', e.target.value)}
                    />
                  ) : (
                    <div className="info-value">{savedProductionData.deliveryDate}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="right-column">
              <div className="section">
                <div className="section-title">Product Image</div>
                <div className="product-image-container">
                  <img src={sofaImage} alt={savedProductionData.productModel} className="product-image" />
                </div>
              </div>
              
              <div className="section">
                <div className="section-title">Extra Notes</div>
                {isProductionSheetEditMode ? (
                  <textarea 
                    className="notes" 
                    value={tempProductionData.extras} 
                    onChange={(e) => handleProductionInputChange('extras', e.target.value)}
                  />
                ) : (
                  <textarea className="notes" readOnly value={savedProductionData.extras}></textarea>
                )}
              </div>
            </div>
          </div>
          
          <div className="footer">
            <div className="footer-section">
              <div className="section-title">Date</div>
              <div className="info-value">{new Date().toLocaleDateString('en-GB')}</div>
            </div>
            <div className="footer-section">
              <div className="section-title">Signature</div>
              <div className="signature-container">
                {isProductionSheetEditMode ? (
                  <>
                    {tempProductionData.signature ? (
                      <img src={tempProductionData.signature} alt="Signature" className="signature-image" />
                    ) : (
                      <div className="signature-placeholder">Click to add signature</div>
                    )}
                    <input 
                      type="file" 
                      className="signature-input" 
                      accept="image/*"
                      onChange={handleSignatureUpload}
                    />
                    <div className="signature-buttons">
                      <button 
                        className="signature-btn" 
                        onClick={() => document.querySelector('.signature-input').click()}
                      >
                        Upload
                      </button>
                      {tempProductionData.signature && (
                        <button 
                          className="signature-btn" 
                          onClick={clearSignature}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  savedProductionData.signature ? (
                    <img src={savedProductionData.signature} alt="Signature" className="signature-image" />
                  ) : (
                    <div className="info-value">__________________</div>
                  )
                )}
              </div>
            </div>
            <div className="footer-section">
              <div className="section-title">Status</div>
              {isProductionSheetEditMode ? (
                <input 
                  type="text" 
                  className="info-input" 
                  value={tempProductionData.status} 
                  onChange={(e) => handleProductionInputChange('status', e.target.value)}
                />
              ) : (
                <div className="info-value">{savedProductionData.status}</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Page 2: 4 Label Sheet */}
        <div className="a4-container label-sheet">
          {/* Label Edit Buttons */}
          <div className="print-button-container" style={{position: 'absolute', top: '10px', right: '10px', zIndex: 10}}>
            {isLabelEditMode && (
              <button 
                className="cancel-button" 
                onClick={cancelLabelEdit}
                disabled={isGeneratingPDF}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            )}
            <button 
              className={`edit-button ${isLabelEditMode ? 'editing' : ''}`} 
              onClick={toggleLabelEditMode}
              disabled={isGeneratingPDF}
            >
              {isLabelEditMode ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </>
              )}
            </button>
          </div>
          
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="label">
              <div className="label-header">
                <div className="label-title">Label {num}</div>
                <div className="company-logo">SOFA & FURNITURE</div>
              </div>
              <div className="label-content">
                <div className="label-row">
                  <div className="label-label">Order ID:</div>
                  {isLabelEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={tempLabelData.id} 
                      onChange={(e) => handleLabelInputChange('id', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{savedLabelData.id}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Receiver:</div>
                  {isLabelEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={tempLabelData.customerName} 
                      onChange={(e) => handleLabelInputChange('customerName', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{savedLabelData.customerName}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Address:</div>
                  {isLabelEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={tempLabelData.fullAddress} 
                      onChange={(e) => handleLabelInputChange('fullAddress', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{savedLabelData.fullAddress}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Shipper:</div>
                  {isLabelEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={tempLabelData.shipper} 
                      onChange={(e) => handleLabelInputChange('shipper', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{savedLabelData.shipper}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Shipper Add:</div>
                  {isLabelEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={tempLabelData.shipperAddress} 
                      onChange={(e) => handleLabelInputChange('shipperAddress', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{savedLabelData.shipperAddress}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Weight:</div>
                  {isLabelEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={tempLabelData.weight} 
                      onChange={(e) => handleLabelInputChange('weight', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{savedLabelData.weight}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Item:</div>
                  {isLabelEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={tempLabelData.item} 
                      onChange={(e) => handleLabelInputChange('item', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{savedLabelData.item}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Size:</div>
                  {isLabelEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={tempLabelData.size} 
                      onChange={(e) => handleLabelInputChange('size', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{savedLabelData.size}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Date:</div>
                  {isLabelEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={tempLabelData.date} 
                      onChange={(e) => handleLabelInputChange('date', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{savedLabelData.date}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Notes:</div>
                  {isLabelEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={tempLabelData.notes} 
                      onChange={(e) => handleLabelInputChange('notes', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{savedLabelData.notes}</div>
                  )}
                </div>
                
                {/* Product Image in Label */}
                <img src={sofaImage} alt={savedLabelData.item} className="label-product-image" />
                
                <div className="barcode">
                  <img src={generateBarcodeDataURL(savedLabelData.id)} alt="Barcode" />
                  <div className="barcode-text">{savedLabelData.id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductionSheetComponent;