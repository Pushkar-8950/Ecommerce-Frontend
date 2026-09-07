import { useEffect, useState } from "react";
import {
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";

import "./VoiceGuide.css";

function VoiceGuide({
  message,
  autoSpeak = true,
  onSpeakingChange,
  speakTrigger,
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);


  const updateSpeakingState = (state) => {
    setIsSpeaking(state);

    if (onSpeakingChange) {
      onSpeakingChange(state);
    }
  };


  const speakMessage = () => {

    if (
      !message ||
      !("speechSynthesis" in window)
    ) {
      return;
    }


    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(message);


    utterance.rate = 0.9;
    utterance.pitch = 2;
    utterance.volume = 1;


    utterance.onstart = () => {
      updateSpeakingState(true);
    };


    utterance.onend = () => {
      updateSpeakingState(false);
    };


    utterance.onerror = () => {
      updateSpeakingState(false);
    };


    window.speechSynthesis.speak(utterance);
  };


  useEffect(() => {

    if (!autoSpeak) {
      return;
    }

    const timer = setTimeout(() => {
      speakMessage();
    }, 500);


    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
      updateSpeakingState(false);
    };

  }, [message, autoSpeak]);


  useEffect(() => {
    if (speakTrigger > 0) {
      speakMessage();
    }
  }, [speakTrigger]);


  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    updateSpeakingState(false);
  };

  if (!isSpeaking) {
    return null;
  }

  return (
    <div
      className={`voice-guide ${
        isSpeaking ? "is-speaking" : ""
      }`}
    >

      {/* =========================
          VOICE ICON
      ========================= */}

      <div className="voice-guide-icon">

        {isSpeaking ? (
          <Volume2 size={20} />
        ) : (
          <VolumeX size={20} />
        )}

      </div>


      {/* =========================
          CONTENT
      ========================= */}

      <div className="voice-guide-content">

        <p>
          {message}
        </p>


        <div className="voice-guide-actions">

          <button
            type="button"
            onClick={stopSpeaking}
          >
            Stop
          </button>

        </div>

      </div>

    </div>
  );
}

export default VoiceGuide;