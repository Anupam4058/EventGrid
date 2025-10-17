import { useState, useMemo } from 'react';
import EventCard from './EventCard';
import { formatInTimezone } from '../utils/timezoneUtils';
import { FiSearch } from 'react-icons/fi';

const EventList = ({ events, timezone, onEdit, onDelete, onViewDetails, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('startTime');

    // Filter and sort events
    const processedEvents = useMemo(() => {
        let filtered = events;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        filtered = [...filtered].sort((a, b) => {
            if (sortBy === 'startTime') {
                return new Date(a.startTime) - new Date(b.startTime);
            } else if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

        return filtered;
    }, [events, searchTerm, sortBy]);

    // Group events by date
    const groupedEvents = useMemo(() => {
        const groups = {};
        processedEvents.forEach(event => {
            const date = formatInTimezone(event.startTime, timezone, 'YYYY-MM-DD');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(event);
        });
        return groups;
    }, [processedEvents, timezone]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="startTime">Sort by Start Time</option>
                    <option value="title">Sort by Title</option>
                </select>
            </div>

            {/* Events List */}
            {processedEvents.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {searchTerm ? 'No events found matching your search' : 'No events yet'}
                    </p>
                    {!searchTerm && (
                        <p className="text-gray-400 mt-2">
                            Create your first event to get started!
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                        <div key={date}>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="text-primary-600">
                                    {formatInTimezone(dateEvents[0].startTime, timezone, 'dddd, MMMM DD, YYYY')}
                                </span>
                                <span className="text-sm font-normal text-gray-500">
                                    ({dateEvents.length} {dateEvents.length === 1 ? 'event' : 'events'})
                                </span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {dateEvents.map(event => (
                                    <EventCard
                                        key={event._id}
                                        event={event}
                                        timezone={timezone}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onViewDetails={onViewDetails}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;

