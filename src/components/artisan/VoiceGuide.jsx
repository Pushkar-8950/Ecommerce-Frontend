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


    // Stop any speech currently playing.
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

    if (autoSpeak) {

      const timer = setTimeout(() => {
        speakMessage();
      }, 500);


      return () => {

        clearTimeout(timer);

        window.speechSynthesis.cancel();

        updateSpeakingState(false);
      };
    }

  }, [message, autoSpeak]);


  const stopSpeaking = () => {

    window.speechSynthesis.cancel();

    updateSpeakingState(false);
  };


  return (
    <div
      className={`voice-guide ${
        isSpeaking ? "is-speaking" : ""
      }`}
    >

      <div className="voice-guide-icon">

        {isSpeaking ? (
          <Volume2 size={20} />
        ) : (
          <VolumeX size={20} />
        )}

      </div>


      <div className="voice-guide-content">

        <p>{message}</p>


        <div className="voice-guide-actions">

          {isSpeaking ? (

            <button
              type="button"
              onClick={stopSpeaking}
            >
              Stop
            </button>

          ) : (

            <button
              type="button"
              onClick={speakMessage}
              className="Speak-again-button"
            >
              <RotateCcw size={20} />
            </button>

          )}

        </div>

      </div>

    </div>
  );
}

export default VoiceGuide;