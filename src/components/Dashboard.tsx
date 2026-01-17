import { useState, useEffect } from 'react';
import { Target, Zap, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function Dashboard() {
  const { profile, user } = useAuth();
  const [labsCompleted, setLabsCompleted] = useState(0);

  useEffect(() => {
    if (user) {
      fetchLabProgress();
    }
  }, [user]);

  const fetchLabProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_lab_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true);

    if (!error && data) {
      setLabsCompleted(data.length);
    }
  };

  const stats = [
    { label: 'Labs Completed', value: labsCompleted.toString(), icon: Target, color: 'bg-blue-500' },
    { label: 'Points Earned', value: profile?.total_points?.toString() || '0', icon: Award, color: 'bg-emerald-500' },
    { label: 'Current Streak', value: `${profile?.current_streak || 0} days`, icon: Zap, color: 'bg-yellow-500' },
    { label: 'Skill Level', value: profile?.skill_level || 'Beginner', icon: TrendingUp, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {profile?.full_name}!</h2>
        <p className="text-emerald-50 mb-4">
          Master cybersecurity through hands-on practice with real-world vulnerabilities and tools.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="font-semibold">8 Vulnerability Types</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="font-semibold">Interactive Labs</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="font-semibold">Real-World Tools</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="font-semibold">AI Assistant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
