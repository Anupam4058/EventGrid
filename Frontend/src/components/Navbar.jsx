import { FiCalendar, FiPlus } from 'react-icons/fi';
import ProfileSelector from './ProfileSelector';

const Navbar = ({ onCreateEvent, onOpenProfileManager }) => {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <FiCalendar size={28} className="text-primary-600" />
                            <h1 className="text-xl font-bold text-gray-900">
                                Event Manager
                            </h1>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <ProfileSelector onOpenProfileManager={onOpenProfileManager} />
                        <button
                            onClick={onCreateEvent}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                        >
                            <FiPlus size={18} />
                            <span className="hidden sm:inline">Create Event</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

