import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Volume2, VolumeX } from 'lucide-react';

interface LabAIAssistantProps {
  vulnerabilityType: string;
}

export function LabAIAssistant({ vulnerabilityType }: LabAIAssistantProps) {
  const [messages, setMessages] = useState<Array<{ role: 'assistant' | 'user'; content: string }>>([
    {
      role: 'assistant',
      content: getInitialMessage(vulnerabilityType),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function getInitialMessage(vulnType: string): string {
    const messages: Record<string, string> = {
      'sql-injection':
        "I'm here to guide you through SQL Injection exploitation!\n\nTips:\n• SQL queries use AND/OR operators to create conditions\n• Try injection like: admin' --\n• The -- comments out the rest of the query\n• What specific aspect would you like help with?",
      'xss':
        "I'm your XSS exploitation guide!\n\nKey concepts:\n• XSS executes in the victim's browser\n• Common payloads: <script>alert('XSS')</script>\n• Try searching for: <img src=x onerror=alert('XSS')>\n• How can I assist you?",
      'auth-bypass':
        "Welcome to the Authentication Bypass lab!\n\nCommon techniques:\n• SQL injection in login forms\n• Default credentials (admin/admin)\n• Weak password resets\n• Try: admin' -- in the username field\n• Need help with anything specific?",
      'broken-access':
        "Let's explore Broken Access Control!\n\nWhat to test:\n• Can you access other users' profiles?\n• Try modifying user IDs in URLs\n• Check if you can access admin functions\n• Look for parameter tampering opportunities\n• Any questions?",
      'csrf':
        "CSRF exploitation guide here!\n\nKey points:\n• CSRF uses authenticated user's browser\n• Create malicious forms on external sites\n• No CSRF token validation = vulnerable\n• Tokens must be regenerated per request\n• What would you like to learn?",
      'xxe':
        "XML External Entity injection lab!\n\nExploit techniques:\n• Define external entities: <!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]>\n• Use the entity in XML: &xxe;\n• Can be used to read files or cause DoS\n• Questions about XXE?",
      'ssrf':
        "Server-Side Request Forgery guide!\n\nWhat to try:\n• Make server request internal URLs\n• Access services like: http://localhost:8080\n• Try: http://127.0.0.1/admin\n• Can bypass IP restrictions\n• Need guidance?",
      'deserialization':
        "Insecure Deserialization lab!\n\nKey concepts:\n• Serialize and deserialize untrusted data\n• Can lead to RCE (Remote Code Execution)\n• Gadget chains enable exploitation\n• Common in Java and .NET\n• How can I help?",
    };
    return messages[vulnType] || "Hello! I'm your lab AI assistant. Ask me anything about exploiting this vulnerability!";
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    setTimeout(() => {
      const response = getLabResponse(vulnerabilityType, userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
      speakText(response);
    }, 600);
  };

  function getLabResponse(vulnType: string, question: string): string {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('what') || lowerQ.includes('how')) {
      const tips: Record<string, string> = {
        'sql-injection':
          "Great question! Here's how to exploit SQL injection:\n\n1. Find the vulnerable parameter (usually search/login)\n2. Try adding ' to break the query\n3. Use OR operators: ' OR '1'='1\n4. Comment out the rest: ' OR '1'='1'--\n5. Extract data with UNION queries\n\nExample payload: ' OR '1'='1'--\n\nWant to try a specific technique?",
        'xss':
          "XSS exploitation steps:\n\n1. Identify where user input is reflected\n2. Try simple alert box: <script>alert('XSS')</script>\n3. If blocked, try event handlers: <img onerror=alert('XSS')>\n4. Use encoding: <img src=x onerror=\"alert('XSS')\">\n5. Check if input is sanitized\n\nLet's test your understanding!",
        'auth-bypass':
          "Authentication bypass techniques:\n\n1. Try default credentials (admin/admin)\n2. SQL injection: admin' --\n3. Boolean blind: ' OR '1'='1\n4. Check password reset vulnerabilities\n5. Look for session manipulation\n\nWhich method would you like to attempt?",
        'broken-access':
          "Test access control:\n\n1. Log in with different users\n2. Try accessing other user profiles\n3. Modify IDs in URLs (1, 2, 3...)\n4. Check API endpoints\n5. Look for role-based access issues\n\nReady to test?",
        'csrf':
          "CSRF exploitation:\n\n1. Understand the vulnerable action\n2. Create a malicious form\n3. Host it on external site\n4. Trick user into visiting\n5. Action executes with their privileges\n\nLet me know what action to target!",
        'xxe':
          "XXE exploitation:\n\n1. Find XML upload/parsing\n2. Inject entity declaration\n3. Reference the entity\n4. Access local files\n5. Can also cause XXE Bombs (DoS)\n\nReady to craft payload?",
        'ssrf':
          "SSRF exploitation:\n\n1. Find parameter that fetches URLs\n2. Try localhost: http://localhost:8080\n3. Try 127.0.0.1 addresses\n4. Access internal services\n5. Can scan internal network\n\nWhich service to target?",
        'deserialization':
          "Deserialization attacks:\n\n1. Find serialized objects\n2. Modify object properties\n3. Create malicious gadget chains\n4. Deserialize tampered object\n5. Achieves RCE or privilege escalation\n\nAny questions about this?",
      };
      return tips[vulnType] || "I can help you with exploiting this vulnerability!";
    }

    if (lowerQ.includes('why') || lowerQ.includes('dangerous')) {
      return "This vulnerability is dangerous because:\n\n• Attackers gain unauthorized access\n• Data can be stolen or modified\n• Complete system compromise possible\n• User trust is violated\n• Regulations (GDPR, etc.) may be triggered\n\nAlways practice ethically and with permission!";
    }

    if (lowerQ.includes('tool') || lowerQ.includes('payload')) {
      return "Try these payloads:\n\nBasic: ' OR '1'='1\nAdvanced: ' UNION SELECT * FROM users--\nCommented: '; DROP TABLE users;--\nBoolean: ' AND 1=1\nTime-based: ' AND SLEEP(5)--\n\nStart simple and escalate!";
    }

    if (lowerQ.includes('stuck') || lowerQ.includes('help') || lowerQ.includes('hint')) {
      return "Try these hints:\n\n1. Look at how input is processed\n2. Check the database error messages\n3. Test with simple payloads first\n4. Watch for reflections in responses\n5. Use browser DevTools to inspect\n\nTake your time and experiment safely!";
    }

    return "That's a great question! Here are some tips:\n\n• Experiment with different inputs\n• Check for error messages\n• Use browser DevTools (F12)\n• Start with basic techniques\n• Escalate to advanced methods\n\nWhat specific challenge are you facing?";
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-96 border-l-4 border-emerald-500">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">Lab AI Assistant</span>
          </div>
          <div className="flex space-x-2">
            {isSpeaking && (
              <button
                onClick={stopSpeech}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                title="Stop speaking"
              >
                <VolumeX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none text-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-3 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for hints..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
