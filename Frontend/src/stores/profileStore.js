import { create } from 'zustand';
import { profileAPI } from '../services/api';

const useProfileStore = create((set, get) => ({
    profiles: [],
    selectedProfile: null,
    loading: false,
    error: null,

    // Fetch all profiles
    fetchProfiles: async () => {
        set({ loading: true, error: null });
        try {
            const response = await profileAPI.getAll();
            set({ 
                profiles: response.data.data, 
                loading: false 
            });
            
            // Auto-select first profile if none selected
            if (!get().selectedProfile && response.data.data.length > 0) {
                set({ selectedProfile: response.data.data[0] });
            }
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch profiles',
                loading: false 
            });
        }
    },

    // Create a new profile
    createProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
            const response = await profileAPI.create(profileData);
            const newProfile = response.data.data;
            
            set(state => ({ 
                profiles: [newProfile, ...state.profiles],
                loading: false 
            }));
            
            // Auto-select the new profile if it's the first one
            if (get().profiles.length === 1) {
                set({ selectedProfile: newProfile });
            }
            
            return newProfile;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to create profile',
                loading: false 
            });
            throw error;
        }
    },

    // Select a profile
    selectProfile: (profile) => {
        set({ selectedProfile: profile });
    },

    // Update profile timezone
    updateProfileTimezone: async (profileId, timezone) => {
        set({ loading: true, error: null });
        try {
            const response = await profileAPI.update(profileId, { timezone });
            const updatedProfile = response.data.data;
            
            set(state => ({
                profiles: state.profiles.map(p => 
                    p._id === profileId ? updatedProfile : p
                ),
                selectedProfile: state.selectedProfile?._id === profileId 
                    ? updatedProfile 
                    : state.selectedProfile,
                loading: false
            }));
            
            return updatedProfile;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to update profile',
                loading: false 
            });
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null })
}));

export default useProfileStore;

