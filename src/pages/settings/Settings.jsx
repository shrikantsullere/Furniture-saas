import { useState, useRef } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { MdImage } from 'react-icons/md';

const Settings = () => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setFileError('Invalid file format. Please select a .png, .jpg, .jpeg, or .svg file.');
      setSelectedFile(null);
      setLogoPreview(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Clear any previous errors
    setFileError('');
    
    // Store file in state
    setSelectedFile(file);
    
    // Log file details to console
    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified),
    });

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Manage your company logo and default layout settings
        </p>
      </div>

      {/* Logo Upload */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Company Logo
        </h2>
        <div className="space-y-4">
          {logoPreview && (
            <div className="flex justify-center">
              <img
                src={logoPreview}
                alt="Company logo preview"
                className="max-h-32 w-auto max-w-full object-contain border border-gray-200 rounded-lg p-2"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          )}
          <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center">
            <div className="text-4xl mb-2 flex justify-center">
              <MdImage className="text-4xl text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Upload your company logo (PNG, JPG, JPEG, SVG only)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.svg"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleFileSelect}
              className="min-h-[44px]"
            >
              Choose File
            </Button>
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {selectedFile.name}
              </p>
            )}
            {fileError && (
              <p className="text-red-500 text-sm mt-2">{fileError}</p>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Logo will appear on delivery notes and labels. Recommended size:
            200x100px.
          </p>
        </div>
      </Card>

      {/* A4 Layout Settings */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Default A4 Layout Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Font Size
            </label>
            <select className="w-full border border-primary rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary">
              <option>12pt</option>
              <option>14pt</option>
              <option>16pt</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-primary text-primary focus:ring-primary"
                defaultChecked
              />
              <span className="text-sm text-gray-700">
                Show company logo on delivery notes
              </span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-primary text-primary focus:ring-primary"
                defaultChecked
              />
              <span className="text-sm text-gray-700">
                Show marketplace icon on delivery notes
              </span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Note Layout
            </label>
            <select className="w-full border border-primary rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary">
              <option>Standard (Full Details)</option>
              <option>Compact (Summary Only)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Company Information */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Company Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              className="w-full border border-primary rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
              defaultValue="Bed & Mattress Co."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              className="w-full border border-primary rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
              rows="3"
              defaultValue="123 Production Street, London, UK"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="text"
              className="w-full border border-primary rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
              defaultValue="+44 20 1234 5678"
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto min-h-[44px]"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
