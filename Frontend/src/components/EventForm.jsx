import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import useProfileStore from '../stores/profileStore';
import useEventStore from '../stores/eventStore';
import TimezonePicker from './TimezonePicker';
import { datetimeLocalToUTC } from '../utils/timezoneUtils';

const EventForm = ({ isOpen, onClose, event = null }) => {
    const { profiles, selectedProfile } = useProfileStore();
    const { createEvent, updateEvent, loading, error, clearError } = useEventStore();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        timezone: selectedProfile?.timezone || 'UTC',
        profiles: selectedProfile ? [selectedProfile._id] : [],
    });
    
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (event) {
            // Editing mode - populate form with event data
            setFormData({
                title: event.title,
                description: event.description || '',
                startTime: event.startTime,
                endTime: event.endTime,
                timezone: event.timezone,
                profiles: event.profiles.map(p => p._id || p),
            });
        } else if (selectedProfile) {
            // Create mode - use selected profile
            setFormData(prev => ({
                ...prev,
                timezone: selectedProfile.timezone,
                profiles: [selectedProfile._id]
            }));
        }
    }, [event, selectedProfile]);

    if (!isOpen) return null;

    const validateForm = () => {
        const errors = {};
        
        if (!formData.title.trim()) {
            errors.title = 'Title is required';
        }
        
        if (!formData.startTime) {
            errors.startTime = 'Start time is required';
        }
        
        if (!formData.endTime) {
            errors.endTime = 'End time is required';
        }
        
        if (formData.startTime && formData.endTime) {
            const start = new Date(formData.startTime);
            const end = new Date(formData.endTime);
            if (end <= start) {
                errors.endTime = 'End time must be after start time';
            }
        }
        
        if (formData.profiles.length === 0) {
            errors.profiles = 'Select at least one profile';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        
        if (!validateForm()) {
            return;
        }

        try {
            const eventData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                startTime: datetimeLocalToUTC(formData.startTime, formData.timezone),
                endTime: datetimeLocalToUTC(formData.endTime, formData.timezone),
                timezone: formData.timezone,
                profiles: formData.profiles,
                createdBy: selectedProfile?.name || 'Admin',
                ...(event && { updatedBy: selectedProfile?.name || 'Admin' })
            };

            if (event) {
                await updateEvent(event._id, eventData);
            } else {
                await createEvent(eventData);
            }
            
            handleClose();
        } catch (err) {
            console.error('Failed to save event:', err);
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            timezone: selectedProfile?.timezone || 'UTC',
            profiles: selectedProfile ? [selectedProfile._id] : [],
        });
        setFormErrors({});
        clearError();
        onClose();
    };

    const handleProfileToggle = (profileId) => {
        setFormData(prev => ({
            ...prev,
            profiles: prev.profiles.includes(profileId)
                ? prev.profiles.filter(id => id !== profileId)
                : [...prev.profiles, profileId]
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {event ? 'Edit Event' : 'Create New Event'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-800 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter event title"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                formErrors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {formErrors.title && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter event description (optional)"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Timezone */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone <span className="text-red-500">*</span>
                        </label>
                        <TimezonePicker
                            value={formData.timezone}
                            onChange={(tz) => setFormData({ ...formData, timezone: tz })}
                        />
                    </div>

                    {/* Start Date & Time */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date & Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                formErrors.startTime ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {formErrors.startTime && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.startTime}</p>
                        )}
                    </div>

                    {/* End Date & Time */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date & Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            min={formData.startTime}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                formErrors.endTime ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {formErrors.endTime && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.endTime}</p>
                        )}
                    </div>

                    {/* Profiles */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign to Profiles <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                            {profiles.length === 0 ? (
                                <p className="text-gray-500 text-sm">No profiles available</p>
                            ) : (
                                profiles.map(profile => (
                                    <label
                                        key={profile._id}
                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.profiles.includes(profile._id)}
                                            onChange={() => handleProfileToggle(profile._id)}
                                            className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-900">
                                            {profile.name} ({profile.timezone})
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>
                        {formErrors.profiles && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.profiles}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventForm;

