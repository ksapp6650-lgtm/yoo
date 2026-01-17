import { Shield, BookOpen, Wrench, Bot, Trophy, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { profile, signOut } = useAuth();

  const tabs = [
    { id: 'labs', label: 'Vulnerability Labs', icon: Shield },
    { id: 'tools', label: 'Security Tools', icon: Wrench },
    { id: 'learn', label: 'Learning Path', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: Trophy },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-emerald-400" />
            <span className="text-xl font-bold">CyberSec Academy</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center space-x-3 border-l border-gray-700 pl-4">
              <div className="flex items-center space-x-2">
                <div className="bg-emerald-600 p-2 rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold">{profile?.full_name}</p>
                  <p className="text-xs text-gray-400">{profile?.skill_level}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-800 hover:bg-red-600 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
