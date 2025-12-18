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
  const [isEditMode, setIsEditMode] = useState(false);
  
  // State for editable label data
  const [labelData, setLabelData] = useState({
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
  
  // Handle input changes
  const handleInputChange = (field, value) => {
    setLabelData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  
  // Detect if device is mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };
  
  const handlePrint = async () => {
    if (isMobileDevice()) {
      // For mobile devices, generate PDF
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
    } else {
      // For desktop devices, use the original print functionality
      const printContent = contentRef.current;
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      // Copy the content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Production Sheets</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
              
              * {
                font-family: 'Roboto', sans-serif;
                box-sizing: border-box;
              }
              
              body {
                margin: 0;
                padding: 0;
                background-color: white;
              }
              
              .production-container {
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              
              .a4-container {
                width: 210mm;
                min-height: 297mm;
                background-color: white;
                padding: 20mm;
                position: relative;
                display: flex;
                flex-direction: column;
                page-break-after: always;
              }
              
              .a4-container:last-child {
                page-break-after: auto;
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
              
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                
                .a4-container {
                  margin: 0;
                  box-shadow: none;
                }
                
                .label-input {
                  border-bottom: none;
                }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for the content to load before printing
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }
  };

  // Sample order data
  const orderData = {
    id: 'ORD-001',
    customerName: 'John Smith',
    fullAddress: '23 Principal Street, Apt 45A, New York, 10001',
    phone: '+1 234-567-8901',
    email: 'john.smith@example.com',
    order: {
      model: 'Comfort Plus',
      size: 'King - 30cm height',
      colour: 'Gray',
      storage: 'With Storage',
      height: '30cm',
      quantity: 2
    },
    orderDate: '15/05/2023',
    deliveryDate: '25/05/2023',
    extras: 'Delivery before 5pm',
    status: 'In Production',
    marketplace: 'Amazon',
    weight: '50kg',
    shipper: 'SOFA & FURNITURE CO.',
    shipperAddress: '123 Production Street, London, UK, SW1A 1AA',
    labelDate: '18/12/2025'
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
        
        .button-container {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-bottom: 20px;
          position: sticky;
          top: 20px;
        }
        
        .print-button, .edit-button {
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
        
        .print-button {
          background-color: #00B7B5;
        }
        
        .print-button:hover {
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
        
        .print-button:disabled, .edit-button:disabled {
          cursor: not-allowed;
          transform: none;
          opacity: 0.6;
        }
        
        .print-button svg, .edit-button svg {
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
          
          .button-container {
            position: relative;
            top: 0;
            margin-bottom: 15px;
            flex-direction: column;
          }
          
          .print-button, .edit-button {
            padding: 10px 15px;
            font-size: 14px;
            width: 100%;
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
          .print-button, .edit-button {
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
      
      <div className="button-container">
        <button 
          className={`edit-button ${isEditMode ? 'editing' : ''}`} 
          onClick={toggleEditMode}
          disabled={isGeneratingPDF}
        >
          {isEditMode ? (
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
        <button 
          className="print-button" 
          onClick={handlePrint}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              {isMobileDevice() ? 'Download PDF' : 'Print'}
            </>
          )}
        </button>
      </div>
      
      <div ref={contentRef}>
        {/* Page 1: Single Production Sheet */}
        {/* <div className="a4-container production-sheet">
          <div className="header">
            <div className="logo-section">
              <div className="company-logo">SOFA & FURNITURE CO.</div>
              <div className="marketplace-logo">
                {marketplaceIcon} {orderData.marketplace}
              </div>
            </div>
            <div className="order-id">{orderData.id}</div>
          </div>
          
          <div className="content">
            <div className="left-column">
              <div className="section">
                <div className="section-title">Customer Information</div>
                <div className="info-row">
                  <div className="info-label">Name:</div>
                  <div className="info-value">{orderData.customerName}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Address:</div>
                  <div className="info-value">{orderData.fullAddress}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Phone:</div>
                  <div className="info-value">{orderData.phone}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Email:</div>
                  <div className="info-value">{orderData.email}</div>
                </div>
              </div>
              
              <div className="section">
                <div className="section-title">Order Details</div>
                <div className="info-row">
                  <div className="info-label">Product Model:</div>
                  <div className="info-value">{orderData.order.model}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Size:</div>
                  <div className="info-value">{orderData.order.size}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Color:</div>
                  <div className="info-value">{orderData.order.colour}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Features:</div>
                  <div className="info-value">{orderData.order.storage}, {orderData.order.height} Height</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Quantity:</div>
                  <div className="info-value">{orderData.order.quantity}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Order Date:</div>
                  <div className="info-value">{orderData.orderDate}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Delivery Date:</div>
                  <div className="info-value">{orderData.deliveryDate}</div>
                </div>
              </div>
            </div>
            
            <div className="right-column">
              <div className="section">
                <div className="section-title">Product Image</div>
                <div className="product-image-container">
                  <img src={sofaImage} alt={orderData.order.model} className="product-image" />
                </div>
              </div>
              
              <div className="section">
                <div className="section-title">Extra Notes</div>
                <textarea className="notes" readOnly value={orderData.extras}></textarea>
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
              <div className="info-value">__________________</div>
            </div>
            <div className="footer-section">
              <div className="section-title">Status</div>
              <div className="info-value">{orderData.status}</div>
            </div>
          </div>
        </div> */}
        
        {/* Page 2: 4 Label Sheet */}
        <div className="a4-container label-sheet">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="label">
              <div className="label-header">
                <div className="label-title">Label {num}</div>
                <div className="company-logo">SOFA & FURNITURE</div>
              </div>
              <div className="label-content">
                <div className="label-row">
                  <div className="label-label">Order ID:</div>
                  {isEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={labelData.id} 
                      onChange={(e) => handleInputChange('id', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{labelData.id}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Receiver:</div>
                  {isEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={labelData.customerName} 
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{labelData.customerName}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Address:</div>
                  {isEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={labelData.fullAddress} 
                      onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{labelData.fullAddress}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Shipper:</div>
                  {isEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={labelData.shipper} 
                      onChange={(e) => handleInputChange('shipper', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{labelData.shipper}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Shipper Add:</div>
                  {isEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={labelData.shipperAddress} 
                      onChange={(e) => handleInputChange('shipperAddress', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{labelData.shipperAddress}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Weight:</div>
                  {isEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={labelData.weight} 
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{labelData.weight}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Item:</div>
                  {isEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={labelData.item} 
                      onChange={(e) => handleInputChange('item', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{labelData.item}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Size:</div>
                  {isEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={labelData.size} 
                      onChange={(e) => handleInputChange('size', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{labelData.size}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Date:</div>
                  {isEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={labelData.date} 
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{labelData.date}</div>
                  )}
                </div>
                <div className="label-row">
                  <div className="label-label">Notes:</div>
                  {isEditMode ? (
                    <input 
                      type="text" 
                      className="label-input" 
                      value={labelData.notes} 
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                  ) : (
                    <div className="label-value">{labelData.notes}</div>
                  )}
                </div>
                
                {/* Product Image in Label */}
                <img src={sofaImage} alt={labelData.item} className="label-product-image" />
                
                <div className="barcode">
                  <img src={generateBarcodeDataURL(labelData.id)} alt="Barcode" />
                  <div className="barcode-text">{labelData.id}</div>
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