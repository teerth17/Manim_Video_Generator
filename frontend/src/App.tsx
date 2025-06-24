import React, { useState, useRef } from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface GenerationResult {
  success?: boolean;
  code?: string;
  videoUrl?: string;
  outputPath?: string;
  warning?: string;
  attempts?: number;
  warnings?: string[];
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>("");

  const savedPrompt = localStorage.getItem('manimPrompt') || '';
  const savedCode = localStorage.getItem('manimCode') || '';
  const savedVideoUrl = localStorage.getItem('manimVideoUrl') || '';

  const [prompt, setPrompt] = useState(savedPrompt);
  const [code, setCode] = useState(savedCode);
  const [videoUrl, setVideoUrl] = useState(savedVideoUrl);

  const showToast = (message: string, type: 'error' | 'success' | 'warning' = 'error') => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      showToast("Please enter a prompt");
      return;
    }

    localStorage.setItem('manimPrompt', prompt);
    try {
      setLoading(true);
      setGenerationStatus("Generating Manim code...");
      
      const res = await axios.post("/chat", { 
        message: prompt 
      }, { 
        timeout: 30000 
      });
      
      if (!res.data || !res.data.code) {
        throw new Error("No code received from server");
      }

      const manimCode = res.data.code;
      setCode(manimCode);

      localStorage.setItem('manimCode', manimCode);
      
      // Show warnings if any
      if (res.data.warnings && res.data.warnings.length > 0) {
        showToast(`Code generated with warnings: ${res.data.warnings.join(', ')}`, 'warning');
      } else {
        showToast("Code generated successfully!", 'success');
      }
      
      // Automatically generate video
      await generateVideo(manimCode);
      
    } catch (err: any) {
      console.error('Code generation error:', err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to generate code";
      showToast(errorMessage, 'error');
      setGenerationStatus("");
    } finally {
      setLoading(false);
    }
  };

  const generateVideo = async (manimCode: string) => {
    try {
      setLoading(true);
      setGenerationStatus("Generating video from Manim script...");
      
      const res = await axios.post("/generate", { 
        prompt: `\`\`\`python\n${manimCode}\n\`\`\`` 
      }, { 
        timeout: 120000 // 2 minute timeout for video generation
      });
      
      const result: GenerationResult = res.data;
      
      if (result.success && result.videoUrl) {
        // Add cache-busting parameter to video URL
        const videoUrlWithCacheBuster = `${result.videoUrl}?t=${Date.now()}`;
        setVideoUrl(videoUrlWithCacheBuster);

        localStorage.setItem('manimVideoUrl', videoUrlWithCacheBuster);        
        if (result.warning) {
          showToast(result.warning, 'warning');
        } else {
          showToast(`Video generated successfully! (${result.attempts || 1} attempts)`, 'success');
        }
      } else {
        throw new Error("Video generation failed");
      }
      
    } catch (err: any) {
      console.error('Video generation error:', err);
      const errorData = err.response?.data;
      
      let errorMessage = "Failed to generate video";
      if (errorData?.details?.lastError) {
        errorMessage += `: ${errorData.details.lastError}`;
      } else if (errorData?.error) {
        errorMessage += `: ${errorData.error}`;
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      showToast(errorMessage, 'error');
      
      // If there's a suggestion, show it as a separate toast
      if (errorData?.details?.suggestion) {
        setTimeout(() => {
          showToast(`Suggestion: ${errorData.details.suggestion}`, 'warning');
        }, 2000);
      }
      
    } finally {
      setLoading(false);
      setGenerationStatus("");
    }
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'manim_video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e);
    showToast('Failed to load video. The file might be corrupted or still processing.', 'error');
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    if (videoRef.current) {
      // Don't auto-play, let user control
      videoRef.current.currentTime = 0;
    }
  };

  const resetAll = () => {
    setVideoUrl('');
    setCode('');
    setPrompt('');
    setGenerationStatus('');

    localStorage.removeItem('manimPrompt');
    localStorage.removeItem('manimCode');
    localStorage.removeItem('manimVideoUrl');
  };

  // Example prompts for user guidance
  const examplePrompts = [
    "Create a circle that grows and changes color",
    "Show a mathematical formula appearing with animation",
    "Animate a square transforming into a circle",
    "Display text that writes itself character by character",
    "Show two objects moving towards each other"
  ];

  return (
    <div className="bg-black min-h-screen text-white">
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Manim Visualizer</h1>
          <p className="text-gray-400 mb-8">Generate animated videos from text descriptions using Manim</p>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Enter Prompt</label>
              <textarea
                className="w-full bg-gray-700 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                rows={3}
                placeholder="Describe what you want to visualize... (e.g., 'Create a circle that grows and changes color')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Example prompts */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Example prompts:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
                    onClick={() => setPrompt(example)}
                    disabled={loading}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePromptSubmit}
                disabled={loading || !prompt.trim()}
              >
                {loading ? "Generating..." : "Generate Visual"}
              </button>
              
              {generationStatus && (
                <div className="text-cyan-400 text-sm">
                  {generationStatus}
                </div>
              )}
              
              {loading && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
              )}
            </div>
          </div>

          {code && (
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Generated Manim Code</h2>
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                <CodeMirror
                  value={code}
                  height="400px"
                  theme={oneDark}
                  onChange={handleCodeChange}
                  editable={!loading}
                />
              </div>
              
              <div className="flex justify-end mt-4 gap-3">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => generateVideo(code)}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Video"}
                </button>
              </div>
            </div>
          )}

          {videoUrl && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Video Output</h2>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video 
                  ref={videoRef}
                  controls 
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  playsInline
                  onError={handleVideoError}
                  onLoadedData={handleVideoLoad}
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
                  onClick={downloadVideo}
                >
                  Download Video
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                  onClick={resetAll}
                >
                  Reset All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;