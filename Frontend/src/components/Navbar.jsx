import { FiCalendar } from 'react-icons/fi';
import ProfileSelector from './ProfileSelector';

const Navbar = ({ onOpenProfileManager }) => {
    return (
        <nav className="glass-effect sticky top-0 z-40 shadow-lg border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 min-h-16 py-2">
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 group">
                            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg group-hover:shadow-primary-500/50 transition-all duration-300">
                                <FiCalendar size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                                    EventGrid
                                </h1>
                                <p className="text-xs text-gray-800 hidden sm:block">Manage events across timezones</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <ProfileSelector onOpenProfileManager={onOpenProfileManager} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

