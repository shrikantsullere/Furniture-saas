import React, { useRef, useState } from 'react';
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
  
  // Generate barcode URL
  const generateBarcodeURL = (text) => {
    // Using JsBarcode CDN for generating barcode
    return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(text)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0`;
  };
  
  const handlePrint = async () => {
    // Always generate PDF regardless of device
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Get content to print
      const printContent = contentRef.current;
      
      // Convert container to canvas with proper dimensions to fit on one page
      const canvas = await html2canvas(printContent, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: printContent.offsetWidth,
        height: printContent.offsetHeight,
        windowWidth: printContent.scrollWidth,
        windowHeight: printContent.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit on one page
      const imgWidth = 190; // A4 width in mm with margins
      const pageHeight = 277; // A4 height in mm with margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If image height is greater than page height, scale it down
      let finalHeight = imgHeight;
      let finalWidth = imgWidth;
      
      if (imgHeight > pageHeight) {
        const ratio = pageHeight / imgHeight;
        finalHeight = pageHeight;
        finalWidth = imgWidth * ratio;
      }
      
      // Center the image on the page
      const xOffset = (210 - finalWidth) / 2;
      const yOffset = (297 - finalHeight) / 2;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      
      // Save the PDF
      pdf.save(`label-sheet-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
        
        .button-container {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-bottom: 20px;
          position: sticky;
          top: 20px;
          z-index: 100;
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
        
        .company-logo {
          font-size: 14px;
          font-weight: 700;
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
          max-width: 100%;
        }
        
        .barcode-text {
          font-size: 12px;
          color: #666;
        }
        
        /* Desktop Styles */
        @media screen and (min-width: 1201px) {
          .a4-container {
            max-width: 100%;
          }
        }
        
        /* Tablet Styles */
        @media screen and (max-width: 1200px) {
          .a4-container {
            transform: scale(0.8);
            transform-origin: top center;
            margin-bottom: -50px;
          }
        }
        
        /* Mobile Styles */
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
            gap: 10px;
          }
          
          .print-button, .edit-button {
            padding: 10px 15px;
            font-size: 14px;
            width: 100%;
            justify-content: center;
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
          
          .label-product-image {
            max-width: 100px;
            max-height: 100px;
          }
        }
        
        /* Small Mobile Styles */
        @media screen and (max-width: 480px) {
          .print-button, .edit-button {
            padding: 8px 12px;
            font-size: 12px;
          }
          
          .company-logo {
            font-size: 12px;
          }
          
          .label-title {
            font-size: 14px;
          }
          
          .label-label, .label-value {
            font-size: 12px;
          }
          
          .label-input {
            font-size: 12px;
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>
      
      <div ref={contentRef}>
        {/* Label Sheet */}
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
                  <img src={generateBarcodeURL(labelData.id)} alt="Barcode" />
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