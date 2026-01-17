import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { VulnerabilityLabs } from './components/VulnerabilityLabs';
import { VulnerableStore } from './components/VulnerableStore';
import { SecurityTools } from './components/SecurityTools';
import { LearningPath } from './components/LearningPath';
import { Progress } from './components/Progress';
import { AIAssistant } from './components/AIAssistant';
import { ToolPage } from './components/ToolPage';
import { VoiceGuide } from './components/VoiceGuide';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { useAuth } from './contexts/AuthContext';
import { Loader } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('labs');
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showVoiceGuide, setShowVoiceGuide] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  const { user, loading } = useAuth();

  const handleLabSelect = (labType: string) => {
    setSelectedLab(labType);
  };

  const handleCloseStore = () => {
    setSelectedLab(null);
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
  };

  const handleCloseToolPage = () => {
    setSelectedTool(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-semibold">Loading CyberSec Academy...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'signup') {
      return (
        <Signup
          onSwitchToLogin={() => setAuthView('login')}
          onSignupSuccess={() => setAuthView('login')}
        />
      );
    }
    return (
      <Login
        onSwitchToSignup={() => setAuthView('signup')}
        onLoginSuccess={() => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'labs' && (
          <>
            <Dashboard />
            <div className="mt-8">
              <VulnerabilityLabs onLabSelect={handleLabSelect} />
            </div>
          </>
        )}

        {activeTab === 'tools' && <SecurityTools onToolSelect={handleToolSelect} />}
        {activeTab === 'learn' && <LearningPath />}
        {activeTab === 'progress' && <Progress />}
        {activeTab === 'assistant' && <AIAssistant />}
      </main>

      {selectedLab && (
        <VulnerableStore
          vulnerabilityType={selectedLab}
          onClose={handleCloseStore}
        />
      )}

      {selectedTool && (
        <ToolPage
          toolId={selectedTool}
          onClose={handleCloseToolPage}
        />
      )}

      {showVoiceGuide && (
        <VoiceGuide onClose={() => setShowVoiceGuide(false)} />
      )}
    </div>
  );
}

export default App;
