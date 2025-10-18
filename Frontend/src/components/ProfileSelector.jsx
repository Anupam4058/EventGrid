import { useEffect } from 'react';
import useProfileStore from '../stores/profileStore';
import { FiUser, FiSettings } from 'react-icons/fi';

const ProfileSelector = ({ onOpenProfileManager }) => {
    const { profiles, selectedProfile, selectProfile, fetchProfiles } = useProfileStore();

    useEffect(() => {
        if (profiles.length === 0) {
            fetchProfiles();
        }
    }, [profiles.length, fetchProfiles]);

    if (profiles.length === 0) {
        return (
            <button
                onClick={onOpenProfileManager}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
                <FiUser />
                <span>Create Profile</span>
            </button>
        );
    }

    return (
        <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-2 sm:px-3 py-2 max-w-full sm:max-w-none">
                <FiUser className="text-gray-500" />
                <select
                    value={selectedProfile?._id || ''}
                    onChange={(e) => {
                        const profile = profiles.find(p => p._id === e.target.value);
                        selectProfile(profile);
                    }}
                    className="bg-transparent border-none outline-none cursor-pointer truncate max-w-[60vw] sm:max-w-none"
                >
                    {profiles.map(profile => (
                        <option key={profile._id} value={profile._id}>
                            {profile.name} 
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={onOpenProfileManager}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Manage Profiles"
            >
                <FiSettings size={20} />
            </button>
        </div>
    );
};

export default ProfileSelector;

