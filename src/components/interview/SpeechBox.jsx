import { useEffect } from "react";

function SpeechBox({ setAnswer, isListening }) {

    useEffect(() => {

        if (!isListening) return;

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            alert("Speech Recognition is not supported in this browser.");

            return;
        }

        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {

            let transcript = "";

            for (let i = 0; i < event.results.length; i++) {

                transcript += event.results[i][0].transcript;

            }

            setAnswer(transcript);

        };

        recognition.start();

        return () => recognition.stop();

    }, [isListening, setAnswer]);

    return null;
}

export default SpeechBox;