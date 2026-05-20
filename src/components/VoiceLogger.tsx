'use client';

import React, { useEffect, useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, AlertCircle, Sparkles, Send, Volume2 } from 'lucide-react';

export const VoiceLogger: React.FC = () => {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript, 
    error, 
    supported 
  } = useSpeechRecognition();

  const { sendChatMessage, activeLang, isLoadingAI } = useApp();
  const [typedInput, setTypedInput] = useState('');

  // When speech transcript changes, sync it to typed input so user can edit it
  useEffect(() => {
    if (transcript) {
      setTypedInput(transcript);
    }
  }, [transcript]);

  const handleStartVoice = () => {
    resetTranscript();
    setTypedInput('');
    startListening(activeLang);
  };

  const handleSend = async () => {
    if (!typedInput.trim()) return;
    await sendChatMessage(typedInput, true);
    setTypedInput('');
    resetTranscript();
  };

  const handleSuggestionClick = (text: string) => {
    setTypedInput(text);
  };

  const suggestions = [
    { label: 'गेहूं का भाव', action: 'गेहूं का क्या भाव चल रहा है?' },
    { label: 'सिंचाई का रिमाइंडर', action: 'कल सुबह पानी देने का रिमाइंडर लगा दो' },
    { label: 'दवाई का छिड़काव', action: 'टाइमलाइन पर डालो: टमाटर में दवाई स्प्रे किया' },
    { label: 'केसीसी ब्याज दर', action: 'किसान क्रेडिट कार्ड योजना के बारे में बताओ' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md border border-emerald-800/10 shadow-xl rounded-2xl p-6 flex flex-col items-center max-w-xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
        <h2 className="text-lg font-bold text-emerald-950">AI Voice Assistant (कृषि आवाज साथी)</h2>
      </div>
      
      <p className="text-xs text-emerald-800/70 text-center mb-6 leading-relaxed">
        Speak in Hindi, Punjabi, or English to query mandi rates, log farm activity, or schedule crop watering tasks.
      </p>

      {/* Voice visualizer */}
      <div className="relative flex items-center justify-center mb-8">
        {isListening && (
          <>
            <span className="absolute inline-flex h-24 w-24 rounded-full bg-emerald-500/20 animate-ping" />
            <span className="absolute inline-flex h-32 w-32 rounded-full bg-emerald-500/10 animate-ping delay-75" />
          </>
        )}
        <button
          onClick={isListening ? stopListening : handleStartVoice}
          disabled={!supported || isLoadingAI}
          className={`
            relative z-10 p-6 rounded-full text-white shadow-2xl transition-all duration-300 transform active:scale-95
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 hover:scale-105' 
              : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-105'
            }
            ${(!supported || isLoadingAI) && 'opacity-50 cursor-not-allowed'}
          `}
        >
          {isListening ? (
            <MicOff className="h-8 w-8 animate-pulse" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </button>
      </div>

      <div className="text-center mb-6">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          isListening ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
        }`}>
          {isListening ? 'हम सुन रहे हैं... (Listening...)' : 'बोलने के लिए माइक दबाएं (Press to speak)'}
        </span>
      </div>

      {/* Browser compatibility check */}
      {!supported && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-xl text-xs w-full mb-5">
          <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Speech Recognition Unsupported</p>
            <p className="opacity-90 mt-0.5">Your browser doesn&apos;t support the Web Speech API. You can still type commands in the input below.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs w-full mb-4">
          Error: {error}
        </div>
      )}

      {/* Transcript / Input text area */}
      <div className="w-full space-y-4">
        <div className="relative">
          <textarea
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder="आपका संदेश यहां दिखाई देगा या टाइप करें... (Your message will appear here or type it...)"
            rows={3}
            className="w-full border border-emerald-800/10 rounded-xl px-4 py-3 text-sm text-emerald-950 placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-emerald-50/20 resize-none font-medium leading-relaxed"
          />
          {typedInput.trim() && (
            <button
              onClick={handleSend}
              disabled={isLoadingAI}
              className="absolute bottom-3.5 right-3.5 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Suggestions */}
        <div>
          <span className="text-[11px] font-semibold text-emerald-800/60 uppercase tracking-wider block mb-2">
            कोशिश करें (Suggestions):
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(s.action)}
                className="text-xs bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-800/10 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
