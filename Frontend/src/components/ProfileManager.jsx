import { useState } from 'react';
import { FiX, FiGlobe } from 'react-icons/fi';
import useProfileStore from '../stores/profileStore';
import TimezonePicker from './TimezonePicker';

const ProfileManager = ({ isOpen, onClose }) => {
    const { profiles, createProfile, updateProfileTimezone, loading, error, clearError } = useProfileStore();
    const [newProfileName, setNewProfileName] = useState('');
    const [newProfileTimezone, setNewProfileTimezone] = useState('UTC');
    const [editingTimezone, setEditingTimezone] = useState(null);
    const [message, setMessage] = useState(null);

    if (!isOpen) return null;

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        clearError();
        setMessage(null);
        
        try {
            await createProfile({
                name: newProfileName,
                timezone: newProfileTimezone
            });
            setNewProfileName('');
            setNewProfileTimezone('UTC');
            setMessage({ type: 'success', text: 'Profile created successfully!' });
        } catch {
            setMessage({ type: 'error', text: error || 'Failed to create profile' });
        }
    };

    const handleUpdateTimezone = async (profileId, timezone) => {
        clearError();
        setMessage(null);
        
        try {
            await updateProfileTimezone(profileId, timezone);
            setEditingTimezone(null);
            setMessage({ type: 'success', text: 'Timezone updated successfully!' });
        } catch {
            setMessage({ type: 'error', text: error || 'Failed to update timezone' });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[92vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 sm:p-6 border-b border-primary-100 bg-primary-50/60">
                    <h2 className="text-2xl font-bold text-gray-900">Manage Profiles</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-4 py-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-120px)]">
                    {/* Messages */}
                    {message && (
                        <div className={`mb-4 p-3 rounded-md ${
                            message.type === 'success' 
                                ? 'bg-green-50 text-green-800 border border-green-200' 
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Create New Profile */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Profile</h3>
                        <form onSubmit={handleCreateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newProfileName}
                                    onChange={(e) => setNewProfileName(e.target.value)}
                                    placeholder="Enter profile name"
                                    required
                                    minLength={2}
                                    maxLength={50}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Timezone <span className="text-red-500">*</span>
                                </label>
                                <TimezonePicker
                                    value={newProfileTimezone}
                                    onChange={setNewProfileTimezone}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !newProfileName.trim()}
                                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Creating...' : 'Create Profile'}
                            </button>
                        </form>
                    </div>

                    {/* Existing Profiles */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Profiles</h3>
                        {profiles.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No profiles yet. Create one above!</p>
                        ) : (
                            <div className="space-y-3">
                                {profiles.map(profile => (
                                    <div
                                        key={profile._id}
                                        className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{profile.name}</h4>
                                                <div className="mt-2">
                                                    {editingTimezone === profile._id ? (
                                                        <div className="space-y-2">
                                                            <TimezonePicker
                                                                value={profile.timezone}
                                                                onChange={(tz) => handleUpdateTimezone(profile._id, tz)}
                                                            />
                                                            <button
                                                                onClick={() => setEditingTimezone(null)}
                                                                className="text-sm text-gray-600 hover:text-gray-800"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setEditingTimezone(profile._id)}
                                                            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                                                        >
                                                            <FiGlobe size={16} />
                                                            {profile.timezone}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileManager;

