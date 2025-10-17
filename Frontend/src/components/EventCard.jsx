import { FiCalendar, FiClock, FiUsers, FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import { formatInTimezone, getTimezoneAbbr } from '../utils/timezoneUtils';

const EventCard = ({ event, timezone, onEdit, onDelete, onViewDetails }) => {
    const startFormatted = formatInTimezone(event.startTime, timezone, 'MMM DD, YYYY');
    const startTime = formatInTimezone(event.startTime, timezone, 'h:mm A');
    const endTime = formatInTimezone(event.endTime, timezone, 'h:mm A');
    const tzAbbr = getTimezoneAbbr(timezone);

    const profileNames = event.profiles
        .map(p => typeof p === 'object' ? p.name : p)
        .join(', ');

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {event.title}
                    </h3>
                    {event.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {event.description}
                        </p>
                    )}
                </div>
                <div className="flex gap-2 ml-4">
                    <button
                        onClick={() => onViewDetails(event)}
                        className="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="View Details"
                    >
                        <FiInfo size={18} />
                    </button>
                    <button
                        onClick={() => onEdit(event)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Event"
                    >
                        <FiEdit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(event._id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Event"
                    >
                        <FiTrash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FiCalendar size={16} className="text-gray-400" />
                    <span>{startFormatted}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FiClock size={16} className="text-gray-400" />
                    <span>
                        {startTime} - {endTime} {tzAbbr}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FiUsers size={16} className="text-gray-400" />
                    <span className="truncate" title={profileNames}>
                        {profileNames}
                    </span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Created by {event.createdBy}</span>
                <span>{formatInTimezone(event.createdAt, timezone, 'MMM DD, YYYY')}</span>
            </div>
        </div>
    );
};

export default EventCard;

