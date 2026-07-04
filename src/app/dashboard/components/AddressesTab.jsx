import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Trash2, MapPin, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

const bdCities = [
  { city: 'Dhaka', division: 'Dhaka' },
  { city: 'Faridpur', division: 'Dhaka' },
  { city: 'Gazipur', division: 'Dhaka' },
  { city: 'Gopalganj', division: 'Dhaka' },
  { city: 'Kishoreganj', division: 'Dhaka' },
  { city: 'Madaripur', division: 'Dhaka' },
  { city: 'Manikganj', division: 'Dhaka' },
  { city: 'Munshiganj', division: 'Dhaka' },
  { city: 'Narayanganj', division: 'Dhaka' },
  { city: 'Narsingdi', division: 'Dhaka' },
  { city: 'Rajbari', division: 'Dhaka' },
  { city: 'Shariatpur', division: 'Dhaka' },
  { city: 'Tangail', division: 'Dhaka' },
  { city: 'Bogra', division: 'Rajshahi' },
  { city: 'Joypurhat', division: 'Rajshahi' },
  { city: 'Naogaon', division: 'Rajshahi' },
  { city: 'Natore', division: 'Rajshahi' },
  { city: 'Nawabganj', division: 'Rajshahi' },
  { city: 'Pabna', division: 'Rajshahi' },
  { city: 'Rajshahi', division: 'Rajshahi' },
  { city: 'Sirajganj', division: 'Rajshahi' },
  { city: 'Dinajpur', division: 'Rangpur' },
  { city: 'Gaibandha', division: 'Rangpur' },
  { city: 'Kurigram', division: 'Rangpur' },
  { city: 'Lalmonirhat', division: 'Rangpur' },
  { city: 'Nilphamari', division: 'Rangpur' },
  { city: 'Panchagarh', division: 'Rangpur' },
  { city: 'Rangpur', division: 'Rangpur' },
  { city: 'Thakurgaon', division: 'Rangpur' },
  { city: 'Barguna', division: 'Barisal' },
  { city: 'Barisal', division: 'Barisal' },
  { city: 'Bhola', division: 'Barisal' },
  { city: 'Jhalokati', division: 'Barisal' },
  { city: 'Patuakhali', division: 'Barisal' },
  { city: 'Pirojpur', division: 'Barisal' },
  { city: 'Bandarban', division: 'Chittagong' },
  { city: 'Brahmanbaria', division: 'Chittagong' },
  { city: 'Chandpur', division: 'Chittagong' },
  { city: 'Chittagong', division: 'Chittagong' },
  { city: 'Comilla', division: 'Chittagong' },
  { city: 'Cox\'s Bazar', division: 'Chittagong' },
  { city: 'Feni', division: 'Chittagong' },
  { city: 'Khagrachhari', division: 'Chittagong' },
  { city: 'Lakshmipur', division: 'Chittagong' },
  { city: 'Noakhali', division: 'Chittagong' },
  { city: 'Rangamati', division: 'Chittagong' },
  { city: 'Habiganj', division: 'Sylhet' },
  { city: 'Moulvibazar', division: 'Sylhet' },
  { city: 'Sunamganj', division: 'Sylhet' },
  { city: 'Sylhet', division: 'Sylhet' },
  { city: 'Bagerhat', division: 'Khulna' },
  { city: 'Chuadanga', division: 'Khulna' },
  { city: 'Jessore', division: 'Khulna' },
  { city: 'Jhenaidah', division: 'Khulna' },
  { city: 'Khulna', division: 'Khulna' },
  { city: 'Kushtia', division: 'Khulna' },
  { city: 'Magura', division: 'Khulna' },
  { city: 'Meherpur', division: 'Khulna' },
  { city: 'Narail', division: 'Khulna' },
  { city: 'Satkhira', division: 'Khulna' },
  { city: 'Jamalpur', division: 'Mymensingh' },
  { city: 'Mymensingh', division: 'Mymensingh' },
  { city: 'Netrokona', division: 'Mymensingh' },
  { city: 'Sherpur', division: 'Mymensingh' }
];

export default function AddressesTab() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    division: '',
    addressType: 'Home',
  });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/addresses');
      setAddresses(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-update division when city is selected
    if (name === 'city') {
      const matchedCity = bdCities.find(c => c.city.toLowerCase() === value.toLowerCase());
      if (matchedCity) {
        setFormData({ ...formData, city: value, division: matchedCity.division });
        return;
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleAddNew = () => {
    setFormData({
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      division: '',
      addressType: 'Home',
    });
    setEditId(null);
    setIsEditing(true);
  };

  const handleEdit = (addr) => {
    setFormData({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      division: addr.division || '',
      addressType: addr.addressType || 'Home',
    });
    setEditId(addr._id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/user/addresses/${id}`);
      fetchAddresses();
    } catch (error) {
      console.error('Failed to delete address', error);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.patch(`/user/addresses/${id}/default`);
      fetchAddresses();
    } catch (error) {
      console.error('Failed to set default address', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.patch(`/user/addresses/${editId}`, formData);
      } else {
        await api.post('/user/addresses', formData);
      }
      setIsEditing(false);
      fetchAddresses();
    } catch (error) {
      console.error('Failed to save address', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-900">{editId ? 'Edit Address' : 'Add New Address'}</h1>
          <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900">Cancel</button>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Address Line 1</label>
            <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent" placeholder="Street address, P.O. box, etc." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Address Line 2 (Optional)</label>
            <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent" placeholder="Apartment, suite, unit, etc." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
              <input 
                list="bd-cities"
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleInputChange} 
                required 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent" 
                placeholder="Search City..."
                autoComplete="off"
              />
              <datalist id="bd-cities">
                {bdCities.map(c => (
                  <option key={c.city} value={c.city} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Division/State</label>
              <input type="text" name="division" value={formData.division} onChange={handleInputChange} required readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Address Type</label>
              <select name="addressType" value={formData.addressType} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent cursor-pointer bg-white">
                <option value="Home">Home</option>
                <option value="Office">Office</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm">
              Save Address
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">Shipping Addresses</h1>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
          <Plus size={18} /> Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} className="text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">No Addresses Found</h3>
          <p className="text-gray-500 text-sm mb-4">Add a shipping address to speed up checkout.</p>
          <button onClick={handleAddNew} className="text-accent hover:underline font-bold text-sm">Add Address</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr._id} className={`bg-white rounded-xl shadow-sm border p-6 relative ${addr.isDefault ? 'border-accent' : 'border-gray-100'}`}>
              {addr.isDefault && (
                <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1">
                  <CheckCircle2 size={12} /> Default
                </div>
              )}
              <h3 className="font-bold text-gray-900 mb-1">
                {addr.fullName} <span className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{addr.addressType}</span>
              </h3>
              <p className="text-sm text-gray-600 mb-1">{addr.phone}</p>
              <div className="text-sm text-gray-500 leading-relaxed mb-4">
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.division}</p>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                <button onClick={() => handleEdit(addr)} className="text-sm font-bold text-gray-600 hover:text-primary flex items-center gap-1">
                  <Edit2 size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(addr._id)} className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                  <Trash2 size={16} /> Delete
                </button>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr._id)} className="ml-auto text-sm font-bold text-accent hover:underline">
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
