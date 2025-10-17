import { formatInTimezone, getTimezoneAbbr } from '../utils/timezoneUtils';
import { FiClock } from 'react-icons/fi';

const EventUpdateLogs = ({ logs, timezone }) => {
    if (logs.length === 0) {
        return (
            <div className="text-center py-6 text-gray-500">
                No update history available
            </div>
        );
    }

    const formatValue = (value) => {
        if (Array.isArray(value)) {
            return value.length > 0 ? `${value.length} profiles` : 'None';
        }
        if (typeof value === 'string' && value.includes('T')) {
            // Likely a date string
            return formatInTimezone(value, timezone, 'MMM DD, YYYY h:mm A');
        }
        return value || 'None';
    };

    const getFieldLabel = (field) => {
        const labels = {
            title: 'Title',
            description: 'Description',
            startTime: 'Start Time',
            endTime: 'End Time',
            timezone: 'Timezone',
            profiles: 'Assigned Profiles'
        };
        return labels[field] || field;
    };

    return (
        <div className="space-y-4">
            {logs.map((log, index) => (
                <div
                    key={log._id || index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <FiClock size={14} />
                        <span>
                            Updated by <span className="font-medium">{log.updatedBy}</span> on{' '}
                            {formatInTimezone(log.updatedAt, timezone, 'MMM DD, YYYY h:mm A')} {getTimezoneAbbr(timezone)}
                        </span>
                    </div>
                    <div className="space-y-2">
                        {log.changes.map((change, changeIndex) => (
                            <div
                                key={changeIndex}
                                className="bg-white border border-gray-200 rounded p-3"
                            >
                                <div className="text-sm font-medium text-gray-900 mb-2">
                                    {getFieldLabel(change.field)}
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Old Value:</span>
                                        <div className="mt-1 text-red-600 font-medium break-words">
                                            {formatValue(change.oldValue)}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">New Value:</span>
                                        <div className="mt-1 text-green-600 font-medium break-words">
                                            {formatValue(change.newValue)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EventUpdateLogs;

