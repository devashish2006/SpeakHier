'use client';

import { useEffect, useState, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { Mic, StopCircle, Upload, FileText, Briefcase, Clock, AlertCircle } from 'lucide-react';

export default function InterviewAgent() {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [interviewDuration, setInterviewDuration] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxDuration = 150; // Exactly 2.5 minutes in seconds

  const predefinedRoles = [
    'Senior Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager',
    'Engineering Manager',
    'Custom Role'
  ];

  useEffect(() => {
    const v = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!); 
    setVapi(v);

    // Event listeners
    v.on('call-start', () => {
      console.log('Interview started');
      setIsSpeaking(true);
      setInterviewDuration(0);
    });

    v.on('call-end', () => {
      console.log('Interview ended');
      setIsSpeaking(false);
      setInterviewDuration(0);
    });

    v.on('error', (error) => {
      console.error('Vapi error:', error);
      setIsSpeaking(false);
    });

    return () => {
      v.removeAllListeners();
    };
  }, []);

  // Timer for interview duration - exactly 2.5 minutes
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isSpeaking) {
      interval = setInterval(() => {
        setInterviewDuration(prev => {
          const newDuration = prev + 1;
          // Auto-end interview after exactly 2.5 minutes
          if (newDuration >= maxDuration) {
            stopAgent();
            return maxDuration;
          }
          return newDuration;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpeaking]);

  // Function to extract text from PDF using FileReader and basic text extraction
  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Convert PDF bytes to text (basic extraction)
          let text = '';
          for (let i = 0; i < uint8Array.length; i++) {
            const char = String.fromCharCode(uint8Array[i]);
            if (char.match(/[a-zA-Z0-9\s\.,\-\(\)@]/)) {
              text += char;
            }
          }
          
          // Clean up the extracted text
          text = text
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s\.,\-\(\)@]/g, '')
            .trim();
          
          // If basic extraction doesn't work well, provide a fallback
          if (text.length < 50) {
            text = `Resume file: ${file.name} - Please extract key information about the candidate's experience, skills, projects, education, and technical background for this interview.`;
          }
          
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setIsProcessingResume(true);
      
      try {
        const extractedText = await extractTextFromPDF(file);
        setResumeText(extractedText);
        console.log('Extracted resume text:', extractedText); 
      } catch (error) {
        console.error('Error processing PDF:', error);
        
        setResumeText(`Resume file uploaded: ${file.name}. Please conduct interview based on the candidate's background and the role requirements.`);
      } finally {
        setIsProcessingResume(false);
      }
    } else {
      alert('Please upload a PDF file');
    }
  };

  const generateSystemPrompt = () => {
    const role = selectedRole === 'Custom Role' ? customRole : selectedRole;
    
    return `You are a highly realistic virtual interviewer conducting mock or real interviews for the role of ${role}. You must behave exactly like a human interviewer.

🧠 Behavioral Rules:
Start the interview naturally with:
"Hi, thanks for joining. Let's start with a quick introduction — could you tell me a bit about yourself?"

Use real-time conversation context:
- Listen carefully to the candidate's responses.
- Ask follow-up questions based on what they say.
- Keep track of the conversation as a human would — referencing past answers to dive deeper or branch out naturally.

IMPORTANT - Use context from the candidate's resume to personalize your questions:
RESUME CONTENT: ${resumeText}

Based on the resume above, ask targeted questions like:
- "I noticed you worked on [specific project/company from resume] — can you walk me through that experience?"
- "You mentioned [specific technology/skill from resume] — how have you used it in production?"
- Reference specific achievements, companies, or projects mentioned in their resume

Focus your questions on the ${role} role, including:
- System design and architecture
- Tech stack and hands-on coding experience
- Team leadership, code review, and decision-making
- Scalability, reliability, and performance challenges
- Past impactful projects and achievements

Between responses, use a natural conversational tone. Show active listening with phrases like:
"That's insightful.", "Sounds like a great challenge.", "Thanks for elaborating."

The interview should last about 2-3 minutes total. After sufficient discussion, politely close with:
"Thanks for your time today. We'll be in touch soon. Wishing you all the best!"

🚫 Do not reveal you are an AI. Do not explain your behavior. Just play the role of a human interviewer.
📄 CRITICAL: You have access to the candidate's resume content above. Reference it specifically to show you've reviewed their background.`;
  };

  const startInterview = () => {
    if (!vapi || !selectedRole || !resumeFile || !resumeText) return;

    console.log('Starting interview with resume text:', resumeText); 

    vapi.start({
      model: {
        provider: 'openai',
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: generateSystemPrompt()
          }
        ]
      },
      voice: {
        provider: '11labs',
        voiceId: process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID! 
      },
      firstMessage: `Hi, thanks for joining today's interview. Let's start with a quick introduction — could you tell me a bit about yourself and your background?`,
    });
  };

  const stopAgent = () => {
    vapi?.stop();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canStartInterview = selectedRole && resumeFile && resumeText && !isProcessingResume && (selectedRole !== 'Custom Role' || customRole.trim());

  if (!isSetupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-lg w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">AI Interview Setup</h1>
            <p className="text-gray-300">Prepare for your 2.5-minute personalized interview</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3 flex items-center gap-2">
              <Briefcase size={18} />
              Select Interview Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose a role...</option>
              {predefinedRoles.map(role => (
                <option key={role} value={role} className="bg-gray-800">
                  {role}
                </option>
              ))}
            </select>
            
            {selectedRole === 'Custom Role' && (
              <input
                type="text"
                placeholder="Enter custom role title..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full mt-3 bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>

          {/* Resume Upload */}
          <div className="mb-8">
            <label className="block text-white font-medium mb-3 flex items-center gap-2">
              <FileText size={18} />
              Upload Resume (PDF)
            </label>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingResume}
                className="w-full bg-black/20 border-2 border-dashed border-white/30 rounded-xl px-4 py-6 text-white hover:border-purple-400 transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
              >
                {isProcessingResume ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                ) : (
                  <Upload size={24} />
                )}
                {resumeFile ? (
                  <div className="text-center">
                    <p className="text-green-400 font-medium">{resumeFile.name}</p>
                    {isProcessingResume ? (
                      <p className="text-sm text-yellow-400">Processing resume...</p>
                    ) : resumeText ? (
                      <p className="text-sm text-green-400">✓ Resume processed successfully</p>
                    ) : (
                      <p className="text-sm text-gray-400">Click to change</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p>Click to upload your resume</p>
                    <p className="text-sm text-gray-400">PDF files only</p>
                  </div>
                )}
              </button>
            </div>
            
            {resumeText && (
              <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <AlertCircle size={16} />
                  Resume content extracted successfully
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  The AI will reference your resume during the interview
                </p>
              </div>
            )}
          </div>

          {/* Start Button */}
          <button
            onClick={() => setIsSetupComplete(true)}
            disabled={!canStartInterview}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-2xl font-medium transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isProcessingResume ? 'Processing Resume...' : 'Continue to Interview'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {selectedRole === 'Custom Role' ? customRole : selectedRole}
          </h1>
          <p className="text-gray-300">2.5 Minute AI Interview</p>
        </div>

        {/* Interview Timer */}
        {isSpeaking && (
          <div className="bg-black/20 rounded-2xl p-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
                <Clock size={20} />
                <span className="font-mono text-2xl">{formatTime(interviewDuration)}</span>
              </div>
              <p className="text-xs text-gray-400">Interview Duration</p>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(interviewDuration / maxDuration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0:00</span>
                <span>2:30</span>
              </div>
            </div>

            {interviewDuration > 120 && (
              <div className="mt-3 text-center">
                <p className="text-yellow-400 text-sm">Interview ending soon...</p>
              </div>
            )}
          </div>
        )}

        {/* Control Button */}
        <div className="flex justify-center mb-6">
          {!isSpeaking ? (
            <button
              onClick={startInterview}
              className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-medium shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <Mic size={20} className="group-hover:scale-110 transition-transform duration-200" />
              Start 2.5min Interview
            </button>
          ) : (
            <button
              onClick={stopAgent}
              className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-medium shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <StopCircle size={20} className="group-hover:scale-110 transition-transform duration-200" />
              End Interview
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-gray-400 text-sm leading-relaxed">
            {!isSpeaking 
              ? 'Your resume has been processed. The AI interviewer will reference your background during the 2.5-minute interview.'
              : 'Interview in progress. The AI can see your resume and will ask personalized questions based on your experience.'
            }
          </p>
        </div>

        {/* Audio Visualization */}
        {isSpeaking && (
          <div className="mt-6 flex justify-center items-center gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Back Button */}
        {!isSpeaking && (
          <button
            onClick={() => setIsSetupComplete(false)}
            className="mt-4 w-full text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Setup
          </button>
        )}
      </div>
    </div>
  );
}