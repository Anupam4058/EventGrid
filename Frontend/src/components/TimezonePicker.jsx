import { useState } from 'react';
import { getGroupedTimezones } from '../utils/timezoneUtils';

const TimezonePicker = ({ value, onChange, className = '' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const groupedTimezones = getGroupedTimezones();
    
    // Filter timezones based on search term
    const filteredGrouped = Object.entries(groupedTimezones).reduce((acc, [region, timezones]) => {
        const filtered = timezones.filter(tz => 
            tz.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tz.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
            acc[region] = filtered;
        }
        return acc;
    }, {});

    return (
        <div className={className}>
            <input
                type="text"
                placeholder="Search timezones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
                {Object.entries(filteredGrouped).map(([region, timezones]) => (
                    <optgroup key={region} label={region}>
                        {timezones.map(tz => (
                            <option key={tz.value} value={tz.value}>
                                {tz.label}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
        </div>
    );
};

export default TimezonePicker;

