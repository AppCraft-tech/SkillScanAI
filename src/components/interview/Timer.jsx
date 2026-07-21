import { useEffect, useState, useRef } from "react";

function Timer({ isRunning, onTimeUp }) {
    const [seconds, setSeconds] = useState(600);
    const onTimeUpRef = useRef(onTimeUp);

    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    }, [onTimeUp]);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        if (onTimeUpRef.current) onTimeUpRef.current();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    return (
        <div className="bg-red-500 text-white px-6 py-3 rounded-xl text-xl font-bold shadow">
            ⏱ {minutes}:{secs}
        </div>
    );
}

export default Timer;