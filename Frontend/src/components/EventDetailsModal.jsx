import { useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiUsers, FiFileText } from 'react-icons/fi';
import { formatInTimezone, getTimezoneAbbr } from '../utils/timezoneUtils';
import useEventStore from '../stores/eventStore';
import EventUpdateLogs from './EventUpdateLogs';

const EventDetailsModal = ({ isOpen, onClose, event, timezone }) => {
    const { eventLogs, fetchEventLogs, loading } = useEventStore();

    useEffect(() => {
        if (isOpen && event) {
            fetchEventLogs(event._id);
        }
    }, [isOpen, event, fetchEventLogs]);

    if (!isOpen || !event) return null;

    const startFormatted = formatInTimezone(event.startTime, timezone, 'dddd, MMMM DD, YYYY');
    const startTime = formatInTimezone(event.startTime, timezone, 'h:mm A');
    const endTime = formatInTimezone(event.endTime, timezone, 'h:mm A');
    const tzAbbr = getTimezoneAbbr(timezone);

    const profilesList = event.profiles.map(p => typeof p === 'object' ? p : { _id: p, name: p });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[92vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 sm:p-6 border-b border-primary-100 bg-primary-50/60">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Event Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-4 py-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-120px)]">
                    {/* Event Information */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            {event.title}
                        </h3>

                        {event.description && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <FiFileText className="text-gray-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 mb-1">Description</div>
                                        <p className="text-gray-700">{event.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <FiCalendar className="text-primary-600 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Date</div>
                                    <div className="text-gray-900">{startFormatted}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FiClock className="text-primary-600 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Time</div>
                                    <div className="text-gray-900">
                                        {startTime} - {endTime} {tzAbbr}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Timezone: {timezone}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FiUsers className="text-primary-600 mt-1 flex-shrink-0" size={20} />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-700 mb-1">
                                        Assigned Profiles ({profilesList.length})
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {profilesList.map(profile => (
                                            <span
                                                key={profile._id}
                                                className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                                            >
                                                {profile.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Created by:</span>
                                        <div className="text-gray-900 font-medium">{event.createdBy}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Created at:</span>
                                        <div className="text-gray-900 font-medium">
                                            {formatInTimezone(event.createdAt, timezone, 'MMM DD, YYYY h:mm A')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update History */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Update History</h3>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                        ) : (
                            <EventUpdateLogs logs={eventLogs} timezone={timezone} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;

