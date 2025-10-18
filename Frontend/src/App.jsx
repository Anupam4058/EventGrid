import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import ProfileManager from './components/ProfileManager';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import EventDetailsModal from './components/EventDetailsModal';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import useProfileStore from './stores/profileStore';
import useEventStore from './stores/eventStore';

function App() {
  const { selectedProfile, fetchProfiles } = useProfileStore();
  const { events, fetchEvents, deleteEvent, loading } = useEventStore();
  
  const [isProfileManagerOpen, setIsProfileManagerOpen] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, eventId: null });

  // Fetch profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Fetch events when profile is selected
  useEffect(() => {
    if (selectedProfile) {
      fetchEvents(selectedProfile._id);
    }
  }, [selectedProfile, fetchEvents]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCreateEvent = () => {
    if (!selectedProfile) {
      showToast('Please select or create a profile first', 'warning');
      setIsProfileManagerOpen(true);
      return;
    }
    setEditingEvent(null);
    setIsEventFormOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
    setConfirmDialog({ isOpen: true, eventId });
  };

  const confirmDelete = async () => {
    try {
      await deleteEvent(confirmDialog.eventId);
      showToast('Event deleted successfully', 'success');
      setConfirmDialog({ isOpen: false, eventId: null });
    } catch {
      showToast('Failed to delete event', 'error');
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleEventFormClose = () => {
    setIsEventFormOpen(false);
    setEditingEvent(null);
    // Refresh events
    if (selectedProfile) {
      fetchEvents(selectedProfile._id);
    }
  };

  const handleProfileManagerClose = () => {
    setIsProfileManagerOpen(false);
    // Refresh profiles
    fetchProfiles();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-200">
      <Navbar onOpenProfileManager={() => setIsProfileManagerOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedProfile ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Event Manager
              </h2>
              <p className="text-gray-600 mb-6">
                Get started by creating your first profile to manage events across different timezones.
              </p>
              <button
                onClick={() => setIsProfileManagerOpen(true)}
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Create Your First Profile
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Page header with primary action (desktop/tablet) */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Events for {selectedProfile.name}
                </h2>
                <p className="text-gray-600">
                  Viewing in timezone: {selectedProfile.timezone}
                </p>
              </div>
              <div className="hidden sm:flex">
                <button
                  onClick={handleCreateEvent}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-300 font-medium"
                >
                  {/* plus icon via CSS pseudo or keep text for clarity */}
                  Create Event
                </button>
              </div>
            </div>

            <EventList
              events={events}
              timezone={selectedProfile.timezone}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onViewDetails={handleViewDetails}
              loading={loading}
            />
          </div>
        )}
      </main>

      {/* Mobile floating action button for creating events */}
      {selectedProfile && (
        <button
          onClick={handleCreateEvent}
          className="sm:hidden fixed bottom-5 right-5 h-12 w-12 rounded-full bg-primary-600 text-white shadow-xl grid place-items-center hover:bg-primary-700 active:scale-95 transition"
          aria-label="Create Event"
          title="Create Event"
        >
          <span className="text-2xl leading-none">+</span>
        </button>
      )}

      {/* Modals */}
      <ProfileManager
        isOpen={isProfileManagerOpen}
        onClose={handleProfileManagerClose}
      />

      <EventForm
        isOpen={isEventFormOpen}
        onClose={handleEventFormClose}
        event={editingEvent}
      />

      <EventDetailsModal
        isOpen={isEventDetailsOpen}
        onClose={() => setIsEventDetailsOpen(false)}
        event={selectedEvent}
        timezone={selectedProfile?.timezone || 'UTC'}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, eventId: null })}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
