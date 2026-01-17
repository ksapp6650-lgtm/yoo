import { useState, useEffect } from 'react';
import { ShoppingCart, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { LabAIAssistant } from './LabAIAssistant';

interface VulnerableStoreProps {
  vulnerabilityType: string;
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

export function VulnerableStore({ vulnerabilityType, onClose }: VulnerableStoreProps) {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Laptop',
      price: 999.99,
      description: 'High-performance laptop for security testing',
      image_url: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      name: 'Security Book',
      price: 49.99,
      description: 'Comprehensive guide to cybersecurity',
      image_url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '3',
      name: 'Wireless Adapter',
      price: 79.99,
      description: 'Monitor mode capable WiFi adapter',
      image_url: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '4',
      name: 'Raspberry Pi Kit',
      price: 129.99,
      description: 'Complete kit for security projects',
      image_url: 'https://images.pexels.com/photos/3888151/pexels-photo-3888151.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [exploitMessage, setExploitMessage] = useState('');
  const [showExploitAlert, setShowExploitAlert] = useState(false);

  const vulnerabilityInfo = {
    'sql-injection': {
      title: 'SQL Injection Lab',
      hint: 'Try entering SQL commands in the search box. Example: \' OR \'1\'=\'1',
      description: 'This store has a vulnerable search function that directly concatenates user input into SQL queries.',
    },
    'xss': {
      title: 'Cross-Site Scripting (XSS) Lab',
      hint: 'Try injecting JavaScript in the search box. Example: <script>alert("XSS")</script>',
      description: 'User input is not properly sanitized before being displayed on the page.',
    },
    'auth-bypass': {
      title: 'Authentication Bypass Lab',
      hint: 'Try common username/password combinations or SQL injection in login form. Example: admin\' --',
      description: 'The authentication system has vulnerabilities that allow bypassing login.',
    },
    'broken-access': {
      title: 'Broken Access Control Lab',
      hint: 'Try accessing other user\'s data by modifying URLs or request parameters.',
      description: 'The application does not properly verify user permissions before granting access to resources.',
    },
    'csrf': {
      title: 'CSRF Lab',
      hint: 'Try crafting a malicious form that makes requests on behalf of authenticated users.',
      description: 'The application does not validate the origin of requests.',
    },
    'xxe': {
      title: 'XXE Lab',
      hint: 'Try uploading XML files with external entity declarations.',
      description: 'XML parser is configured to process external entities.',
    },
    'ssrf': {
      title: 'SSRF Lab',
      hint: 'Try making the server request internal resources by manipulating URLs.',
      description: 'The server fetches resources from user-supplied URLs without proper validation.',
    },
    'deserialization': {
      title: 'Insecure Deserialization Lab',
      hint: 'Try modifying serialized objects to gain unauthorized access.',
      description: 'The application deserializes untrusted data without proper validation.',
    },
  };

  const info = vulnerabilityInfo[vulnerabilityType as keyof typeof vulnerabilityInfo];

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (vulnerabilityType === 'sql-injection' && query.toLowerCase().includes("' or '1'='1")) {
      setExploitMessage('SQL Injection Successful! You bypassed the query filter and can see all products.');
      setShowExploitAlert(true);
      setTimeout(() => setShowExploitAlert(false), 5000);
    }

    if (vulnerabilityType === 'xss' && query.toLowerCase().includes('<script>')) {
      setExploitMessage('XSS Vulnerability Detected! In a real scenario, this script would execute.');
      setShowExploitAlert(true);
      setTimeout(() => setShowExploitAlert(false), 5000);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (vulnerabilityType === 'auth-bypass') {
      if (loginUsername.includes("' --") || loginUsername.includes("admin' #")) {
        setIsLoggedIn(true);
        setExploitMessage('Authentication Bypassed! You logged in as admin without a valid password.');
        setShowExploitAlert(true);
        setTimeout(() => setShowExploitAlert(false), 5000);
      } else if (loginUsername === 'admin' && loginPassword === 'admin') {
        setIsLoggedIn(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{info.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{info.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {showExploitAlert && (
          <div className="mx-6 mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emerald-900">Exploit Successful!</h3>
              <p className="text-emerald-800 text-sm mt-1">{exploitMessage}</p>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">

          {vulnerabilityType === 'auth-bypass' && !isLoggedIn && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-4">Admin Login</h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Login
                </button>
              </form>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Lab Instructions</h3>
                  <p className="text-yellow-800 text-sm mt-1">{info.hint}</p>
                </div>
              </div>

          {(vulnerabilityType !== 'auth-bypass' || isLoggedIn) && (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {searchQuery && (
                  <p className="text-sm text-gray-600 mt-2">
                    Searching for: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{searchQuery}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-emerald-600">
                          ${product.price}
                        </span>
                        <button className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
            </div>

            <div className="lg:col-span-1">
              <LabAIAssistant vulnerabilityType={vulnerabilityType} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
