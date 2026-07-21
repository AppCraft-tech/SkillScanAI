function ControlPanel() {
    return (
        <div className="flex gap-4 mt-8">

            <button className="bg-green-600 text-white px-6 py-3 rounded-xl">
                Start Recording
            </button>

            <button className="bg-red-600 text-white px-6 py-3 rounded-xl">
                Stop
            </button>

            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
                Next Question
            </button>

        </div>
    );
}

export default ControlPanel;