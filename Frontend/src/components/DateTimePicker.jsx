import { utcToDatetimeLocal } from '../utils/timezoneUtils';

const DateTimePicker = ({ 
    label, 
    value, 
    onChange, 
    timezone,
    min = null,
    error = null,
    required = false 
}) => {
    // If value is a UTC date, convert to datetime-local format
    const localValue = value ? utcToDatetimeLocal(value, timezone) : '';

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type="datetime-local"
                value={localValue}
                onChange={(e) => onChange(e.target.value)}
                min={min}
                required={required}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default DateTimePicker;

