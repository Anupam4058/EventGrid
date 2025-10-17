import { create } from 'zustand';
import { eventAPI } from '../services/api';

const useEventStore = create((set) => ({
    events: [],
    selectedEvent: null,
    eventLogs: [],
    loading: false,
    error: null,

    // Fetch all events (optionally filtered by profile)
    fetchEvents: async (profileId = null) => {
        set({ loading: true, error: null });
        try {
            const response = await eventAPI.getAll(profileId);
            set({ 
                events: response.data.data, 
                loading: false 
            });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch events',
                loading: false 
            });
        }
    },

    // Create a new event
    createEvent: async (eventData) => {
        set({ loading: true, error: null });
        try {
            const response = await eventAPI.create(eventData);
            const newEvent = response.data.data;
            
            set(state => ({ 
                events: [newEvent, ...state.events],
                loading: false 
            }));
            
            return newEvent;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to create event',
                loading: false 
            });
            throw error;
        }
    },

    // Update an event
    updateEvent: async (eventId, eventData) => {
        set({ loading: true, error: null });
        try {
            const response = await eventAPI.update(eventId, eventData);
            const updatedEvent = response.data.data;
            
            set(state => ({
                events: state.events.map(e => 
                    e._id === eventId ? updatedEvent : e
                ),
                selectedEvent: state.selectedEvent?._id === eventId 
                    ? updatedEvent 
                    : state.selectedEvent,
                loading: false
            }));
            
            return updatedEvent;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to update event',
                loading: false 
            });
            throw error;
        }
    },

    // Delete an event
    deleteEvent: async (eventId) => {
        set({ loading: true, error: null });
        try {
            await eventAPI.delete(eventId);
            
            set(state => ({
                events: state.events.filter(e => e._id !== eventId),
                selectedEvent: state.selectedEvent?._id === eventId 
                    ? null 
                    : state.selectedEvent,
                loading: false
            }));
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to delete event',
                loading: false 
            });
            throw error;
        }
    },

    // Fetch event logs
    fetchEventLogs: async (eventId) => {
        set({ loading: true, error: null });
        try {
            const response = await eventAPI.getLogs(eventId);
            set({ 
                eventLogs: response.data.data, 
                loading: false 
            });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch event logs',
                loading: false 
            });
        }
    },

    // Select an event
    selectEvent: (event) => {
        set({ selectedEvent: event });
    },

    // Clear error
    clearError: () => set({ error: null })
}));

export default useEventStore;

