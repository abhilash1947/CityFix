import React, { useState, useRef } from 'react';
import { Camera, MapPin, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { rewards } from '../../lib/mockRewards';
import { ISSUE_CATEGORIES } from '../../constants/categories';
import { useGeolocation } from '../../hooks/useGeolocation';
import { mockIssueService } from '../../lib/mockIssues';
import { useAuth } from '../../hooks/useAuth';

export const ReportIssue: React.FC = () => {
  const { user } = useAuth();
  const { location, loading: locationLoading, getCurrentLocation } = useGeolocation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [awarded, setAwarded] = useState(0);
  const [manualMode, setManualMode] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [touched, setTouched] = useState<{title?: boolean; category?: boolean; description?: boolean; manualAddress?: boolean}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos(prev => [...prev, ...files].slice(0, 5)); // Max 5 photos
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location && !manualMode) {
      setError('Please allow location access or enter a location manually');
      return;
    }
    if (manualMode && !manualAddress.trim()) {
      setError('Please enter a location address');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Upload photos using mock service
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const { data, error: uploadError } = await mockIssueService.uploadPhoto(photo);
        if (data && !uploadError) {
          photoUrls.push(data.publicUrl);
        }
      }

      // Submit issue to mock database
      const { error } = await mockIssueService.createIssue({
        user_id: user?.id || '',
        title: formData.title,
        description: formData.description,
        category: formData.category,
        urgency: formData.urgency,
        location: manualMode
          ? {
              address: manualAddress,
              lat: manualLat ? parseFloat(manualLat) : 0,
              lng: manualLng ? parseFloat(manualLng) : 0,
            }
          : location!,
        photos: photoUrls,
      });

      if (error) {
        setError(error.message);
      } else {
        // Award points: base + bonus per photo
        const base = 10;
        const bonus = Math.min(photos.length, 5) * 2;
        const total = base + bonus;
        if (user?.id) {
          rewards.addPoints(user.id, total);
        }
        setAwarded(total);
        setSuccess(true);
        // Reset form
        setFormData({ title: '', description: '', category: '', urgency: 'medium' });
        setPhotos([]);
        setManualAddress('');
        setManualLat('');
        setManualLng('');
        setManualMode(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">Issue Reported Successfully!</h2>
          <p className="text-green-600 mb-4">
            Your civic issue has been submitted and municipal authorities have been notified.
            You'll receive updates on the progress.
          </p>
          {awarded > 0 && (
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-brand-700 bg-brand-100 border border-brand-200 rounded-full px-3 py-1 animate-[pop_1000ms_ease-out_forwards]">
                +{awarded} points earned
              </span>
            </div>
          )}
          <button
            onClick={() => setSuccess(false)}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Report Another Issue
          </button>
        </div>
        <style>
          {`@keyframes pop { 0% { transform: translateY(4px) scale(.9); opacity: 0 } 30% { transform: translateY(0) scale(1); opacity: 1 } 100% { transform: translateY(-6px); opacity: 0 } }`}
        </style>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Report a Civic Issue</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
              placeholder="Brief title describing the issue"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
            >
              <option value="">Select a category</option>
              {ISSUE_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <select
              id="urgency"
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value as 'low' | 'medium' | 'high' })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-600 focus:ring-brand-600"
            >
              <option value="low">Low - Can wait for regular schedule</option>
              <option value="medium">Medium - Should be addressed soon</option>
              <option value="high">High - Requires immediate attention</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              maxLength={500}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-600 focus:ring-brand-600"
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              
              {photos.length === 0 ? (
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photos
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5 photos</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center hover:border-gray-400"
                    >
                      <Upload className="w-6 h-6 text-gray-400" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={manualMode}
                  onChange={(e) => setManualMode(e.target.checked)}
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                />
                Enter location manually
              </label>
              {!manualMode && (
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="text-brand-600 hover:text-brand-500 text-sm font-medium"
                >
                  {locationLoading ? 'Getting location...' : 'Use current location'}
                </button>
              )}
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              {manualMode ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder="Address or landmark"
                      onBlur={() => setTouched({ ...touched, manualAddress: true })}
                      className={`w-full rounded-md shadow-sm ${manualMode && touched.manualAddress && !manualAddress.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'}`}
                    />
                    {manualMode && touched.manualAddress && !manualAddress.trim() && (
                      <p className="mt-1 text-sm text-red-600">Address is required in manual mode</p>
                    )}
                  </div>
                  <input
                    type="number"
                    step="any"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    placeholder="Latitude (optional)"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  />
                  <input
                    type="number"
                    step="any"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    placeholder="Longitude (optional)"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  />
                </div>
              ) : location ? (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location Captured</p>
                    <p className="text-sm text-gray-600">{location.address}</p>
                    <p className="text-xs text-gray-500">
                      Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No location detected yet</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              (!manualMode && !location) ||
              (manualMode && !manualAddress.trim())
            }
            className="w-full bg-brand-600 text-white py-2 px-4 rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Issue Report'}
          </button>
        </form>
      </div>
    </div>
  );
};