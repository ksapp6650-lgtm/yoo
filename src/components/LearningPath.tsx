import { useState } from 'react';
import { CheckCircle, Circle, Lock, BookOpen } from 'lucide-react';

interface Module {
  name: string;
  completed: boolean;
  locked: boolean;
  description: string;
  duration: string;
}

interface LearningPathProps {
  onModuleStart?: (moduleName: string, level: string) => void;
}

export function LearningPath({ onModuleStart }: LearningPathProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const paths = [
    {
      level: 'Beginner',
      color: 'green',
      modules: [
        {
          name: 'Introduction to Web Security',
          completed: false,
          locked: false,
          description: 'Learn the fundamentals of web security and common attack vectors.',
          duration: '30 mins',
        },
        {
          name: 'SQL Injection Basics',
          completed: false,
          locked: false,
          description: 'Understand how SQL injection attacks work and how to exploit them.',
          duration: '45 mins',
        },
        {
          name: 'Cross-Site Scripting (XSS)',
          completed: false,
          locked: false,
          description: 'Learn about reflected, stored, and DOM-based XSS vulnerabilities.',
          duration: '40 mins',
        },
        {
          name: 'Basic Authentication',
          completed: false,
          locked: false,
          description: 'Explore common authentication vulnerabilities and bypass techniques.',
          duration: '35 mins',
        },
      ],
    },
    {
      level: 'Intermediate',
      color: 'yellow',
      modules: [
        {
          name: 'Advanced SQL Injection',
          completed: false,
          locked: true,
          description: 'Master blind SQL injection and advanced exploitation techniques.',
          duration: '60 mins',
        },
        {
          name: 'CSRF Attacks',
          completed: false,
          locked: true,
          description: 'Understand Cross-Site Request Forgery and token validation.',
          duration: '45 mins',
        },
        {
          name: 'Session Management',
          completed: false,
          locked: true,
          description: 'Learn about session fixation and hijacking attacks.',
          duration: '50 mins',
        },
        {
          name: 'File Upload Vulnerabilities',
          completed: false,
          locked: true,
          description: 'Exploit unrestricted file upload functionality.',
          duration: '55 mins',
        },
      ],
    },
    {
      level: 'Advanced',
      color: 'red',
      modules: [
        {
          name: 'XXE Exploitation',
          completed: false,
          locked: true,
          description: 'Master XML External Entity injection attacks.',
          duration: '70 mins',
        },
        {
          name: 'SSRF Attacks',
          completed: false,
          locked: true,
          description: 'Learn Server-Side Request Forgery exploitation.',
          duration: '65 mins',
        },
        {
          name: 'Deserialization Attacks',
          completed: false,
          locked: true,
          description: 'Exploit insecure deserialization vulnerabilities.',
          duration: '75 mins',
        },
        {
          name: 'Advanced Exploit Chains',
          completed: false,
          locked: true,
          description: 'Chain multiple vulnerabilities for maximum impact.',
          duration: '90 mins',
        },
      ],
    },
  ];

  const colorClasses = {
    green: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      gradient: 'from-green-500 to-green-600',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      gradient: 'from-yellow-500 to-yellow-600',
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      gradient: 'from-red-500 to-red-600',
    },
  };

  const handleModuleStart = (moduleName: string, levelName: string) => {
    setActiveModule(moduleName);
    onModuleStart?.(moduleName, levelName);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Path</h1>
        <p className="text-gray-600 mt-2">
          Follow a structured path to master cybersecurity concepts
        </p>
      </div>

      <div className="space-y-6">
        {paths.map((path, pathIndex) => {
          const colors = colorClasses[path.color as keyof typeof colorClasses];
          return (
            <div key={pathIndex} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{path.level} Level</h2>
                  <span className={`px-4 py-2 rounded-full font-semibold ${colors.bg} ${colors.text}`}>
                    {path.modules.filter(m => m.completed).length}/{path.modules.length} Complete
                  </span>
                </div>

                <div className="space-y-3">
                  {path.modules.map((module, moduleIndex) => (
                    <div
                      key={moduleIndex}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        module.locked
                          ? 'bg-gray-50 border-gray-200 opacity-60'
                          : module.completed
                          ? `${colors.bg} ${colors.border}`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => !module.locked && handleModuleStart(module.name, path.level)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {module.locked ? (
                            <Lock className="h-5 w-5 text-gray-400 mt-1" />
                          ) : module.completed ? (
                            <CheckCircle className={`h-5 w-5 ${colors.text} mt-1`} />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400 mt-1" />
                          )}
                          <div className="flex-1">
                            <h3 className={`font-semibold ${module.locked ? 'text-gray-500' : 'text-gray-900'}`}>
                              {module.name}
                            </h3>
                            {!module.locked && (
                              <>
                                <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                <p className="text-xs text-gray-500 mt-2">Duration: {module.duration}</p>
                              </>
                            )}
                          </div>
                        </div>
                        {!module.locked && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModuleStart(module.name, path.level);
                            }}
                            className={`ml-4 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                              module.completed
                                ? `bg-gradient-to-r ${colors.gradient} text-white hover:shadow-lg`
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {module.completed ? 'Review' : 'Start'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Certification Path</h3>
            <p className="text-blue-800 text-sm mb-4">
              Complete all modules to unlock the CyberSec Academy certification and demonstrate your expertise.
            </p>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-sm text-blue-700 mt-2">0% Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}
