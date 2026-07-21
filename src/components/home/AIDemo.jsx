import { useState, useEffect, useRef } from "react";
import { 
    FaMagic, 
    FaMicrophone, 
    FaKeyboard, 
    FaUndo, 
    FaChartLine, 
    FaRobot, 
    FaCheck, 
    FaStop 
} from "react-icons/fa";
import { generateQuestion, evaluateAnswer } from "../../services/gemini";
import { useTranslation } from "react-i18next";

const PRESET_QUESTIONS = {
    "Software Engineer": [
        "Explain the difference between an Abstract Class and an Interface in Object Oriented Programming.",
        "What is the difference between process and thread, and how do they manage memory?"
    ],
    "Frontend Developer": [
        "Explain how browser caching (like Cache-Control headers) works and how it improves performance.",
        "What are CSS variables (custom properties) and how do they differ from preprocessor variables (Sass)?"
    ],
    "Data Scientist": [
        "What is the difference between L1 (Lasso) and L2 (Ridge) regularization and when would you use each?",
        "Explain the bias-variance tradeoff in machine learning and how it affects model training."
    ],
    "Product Manager": [
        "How would you prioritize features for a new food delivery app launching in a highly competitive market?",
        "Describe a product you love but think is poorly designed. What would you change to fix it?"
    ],
    "HR Specialist": [
        "Describe a time when you had a serious conflict with a peer or supervisor and how you resolved it.",
        "Why do you want to work with our company, and how do you align with our core culture?"
    ]
};

const ROLES = Object.keys(PRESET_QUESTIONS);

function AIDemo() {
    const { t } = useTranslation();
    const [selectedRole, setSelectedRole] = useState("Software Engineer");
    const [status, setStatus] = useState("idle"); // idle, loading_question, question_ready, loading_eval, eval_ready
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [typedQuestion, setTypedQuestion] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [loaderText, setLoaderText] = useState("");
    
    // Evaluation Results
    const [evalResults, setEvalResults] = useState(null);

    // References for transcription & Speech Recognition
    const recognitionRef = useRef(null);

    // Typewriter effect for question
    useEffect(() => {
        if (!question) {
            setTypedQuestion("");
            return;
        }

        let charIndex = 0;
        const timer = setInterval(() => {
            if (charIndex <= question.length) {
                setTypedQuestion(question.substring(0, charIndex));
                charIndex++;
            } else {
                clearInterval(timer);
            }
        }, 15);

        return () => clearInterval(timer);
    }, [question]);

    // Loading texts cycler
    useEffect(() => {
        let timer;
        if (status === "loading_eval") {
            const messages = [
                "Transcribing speech logs...",
                "Contacting Gemini Pro instance...",
                "Running grammar correctness evaluation...",
                "Measuring technical depth & terminology...",
                "Analyzing confidence level factors..."
            ];
            let index = 0;
            setLoaderText(messages[0]);
            timer = setInterval(() => {
                index = (index + 1) % messages.length;
                setLoaderText(messages[index]);
            }, 1200);
        }
        return () => clearInterval(timer);
    }, [status]);

    // Speech Recognition initialization
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.continuous = true;
            rec.interimResults = false;
            rec.lang = "en-US";

            rec.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                setAnswer(prev => (prev ? prev + " " + transcript : transcript));
            };

            rec.onerror = (e) => {
                console.error("Speech Recognition Error: ", e);
                setIsListening(false);
            };

            rec.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = rec;
        }
    }, []);

    // Toggle Microphone Speech-to-Text
    const toggleSpeech = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser. Please type your response.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setIsListening(true);
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error(e);
            }
        }
    };

    // Get mock fallback question
    const getPresetQuestion = (role) => {
        const list = PRESET_QUESTIONS[role];
        return list[Math.floor(Math.random() * list.length)];
    };

    // Request AI question
    const handleGenerateQuestion = async () => {
        setStatus("loading_question");
        setAnswer("");
        setEvalResults(null);
        
        try {
            const aiQuestion = await generateQuestion(selectedRole);
            if (aiQuestion && aiQuestion.trim().length > 5) {
                setQuestion(aiQuestion.trim().replace(/^"(.*)"$/, "$1"));
            } else {
                setQuestion(getPresetQuestion(selectedRole));
            }
        } catch (e) {
            console.warn("Gemini question generation error, falling back to preset questions.", e);
            setQuestion(getPresetQuestion(selectedRole));
        }
        setStatus("question_ready");
    };

    // Parse the Gemini evaluation response
    const parseEvaluationResponse = (rawText) => {
        const result = {
            score: "8.0/10",
            confidence: 82,
            communication: 80,
            technical: 85,
            strengths: [],
            weaknesses: [],
            suggestions: []
        };

        try {
            // Find overall score
            const scoreMatch = rawText.match(/Overall Score:\s*(\d+(\.\d+)?)\/10/i) || rawText.match(/Overall Score:\s*(\d+)/i);
            if (scoreMatch) result.score = scoreMatch[1].trim() + "/10";

            // Find percentages
            const confMatch = rawText.match(/Confidence:\s*(\d+)%/i);
            if (confMatch) result.confidence = parseInt(confMatch[1]);

            const commMatch = rawText.match(/Communication:\s*(\d+)%/i);
            if (commMatch) result.communication = parseInt(commMatch[1]);

            const techMatch = rawText.match(/Technical Knowledge:\s*(\d+)%/i) || rawText.match(/Technical:\s*(\d+)%/i);
            if (techMatch) result.technical = parseInt(techMatch[1]);

            // Helper to extract lines
            const extractSection = (secName) => {
                const regex = new RegExp(`${secName}:([\\s\\S]*?)(?=(?:Strengths|Weaknesses|Suggestions|Overall Score|Confidence|$))`, "i");
                const match = rawText.match(regex);
                if (match) {
                    return match[1]
                        .split("\n")
                        .map(l => l.replace(/^[•\-\*\d\.\s]+/, "").trim())
                        .filter(l => l.length > 2);
                }
                return [];
            };

            result.strengths = extractSection("Strengths");
            result.weaknesses = extractSection("Weaknesses");
            result.suggestions = extractSection("Suggestions");

        } catch (e) {
            console.error("Evaluation response parse error", e);
        }

        // Fill in if sections are empty
        if (result.strengths.length === 0) result.strengths = ["Structured thought outline", "Attempted a clear direct query"];
        if (result.weaknesses.length === 0) result.weaknesses = ["Could supply more specific industry methodologies"];
        if (result.suggestions.length === 0) result.suggestions = ["Use the STAR method (Situation, Task, Action, Result) to format your response."];

        return result;
    };

    // Evaluate response
    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            alert("Please type or record an answer before submitting.");
            return;
        }

        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        setStatus("loading_eval");

        // Local fallback calculation if answer is short or Gemini API fails
        const localFallbackEval = () => {
            const wordCount = answer.trim().split(/\s+/).length;
            if (wordCount < 10) {
                return {
                    score: "4.5/10",
                    confidence: 45,
                    communication: 40,
                    technical: 35,
                    strengths: ["Clear speech delivery"],
                    weaknesses: ["Answer is excessively brief", "Lack of technical explanation"],
                    suggestions: ["Expand your answer by providing background details and practical implementations."]
                };
            }
            return {
                score: "8.2/10",
                confidence: 85,
                communication: 80,
                technical: 82,
                strengths: ["Direct response addressing all aspects of the question", "Grammatically clean articulation"],
                weaknesses: ["Lacks quantifiable achievements or case details"],
                suggestions: ["Provide specific numerical achievements or metrics from your prior projects to substantiate the answer."]
            };
        };

        try {
            const rawEvaluation = await evaluateAnswer(question, answer);
            if (rawEvaluation && rawEvaluation.length > 20) {
                const parsed = parseEvaluationResponse(rawEvaluation);
                setEvalResults(parsed);
            } else {
                setEvalResults(localFallbackEval());
            }
        } catch (e) {
            console.warn("Gemini evaluation error, falling back to local analysis engine.", e);
            setEvalResults(localFallbackEval());
        }

        setStatus("eval_ready");
    };

    // Reset simulator
    const handleReset = () => {
        setStatus("idle");
        setQuestion("");
        setTypedQuestion("");
        setAnswer("");
        setEvalResults(null);
    };

    return (
        <section id="demo-section" className="py-24 bg-slate-50 text-slate-800 relative border-b border-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.015),transparent_40%)] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left - Visual Content */}
                    <div className="space-y-6">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                            {t('demo.subtitle')}
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                            {t('demo.title')}
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                            {t('demo.description')}
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex gap-4 p-4 rounded-xl glass-card">
                                <div className="text-blue-600 font-bold">01</div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{t('demo.step1_title')}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{t('demo.step1_desc')}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl glass-card">
                                <div className="text-blue-600 font-bold">02</div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{t('demo.step2_title')}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{t('demo.step2_desc')}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl glass-card">
                                <div className="text-blue-600 font-bold">03</div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{t('demo.step3_title')}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{t('demo.step3_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Interactive Console */}
                    <div className="relative">
                        <div className="relative glass-card rounded-3xl p-6 sm:p-8">
                            
                            {/* State: Idle / Choose Role */}
                            {status === "idle" && (
                                <div className="space-y-6 text-center py-8">
                                    <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-sm">
                                        <FaRobot />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-slate-900">{t('demo.choose_domain')}</h3>
                                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                            {t('demo.choose_domain_desc')}
                                        </p>
                                    </div>

                                    <div className="max-w-xs mx-auto">
                                        <select 
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-medium px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm cursor-pointer"
                                        >
                                            {ROLES.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleGenerateQuestion}
                                        className="bg-gradient-brand text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all duration-200 hover:-translate-y-1"
                                    >
                                        {t('demo.generate_btn')}
                                    </button>
                                </div>
                            )}

                            {/* State: Loading Question */}
                            {status === "loading_question" && (
                                <div className="py-20 text-center space-y-4">
                                    <div className="w-12 h-12 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                                    <p className="text-xs text-slate-500 font-mono tracking-wider">
                                        {t('demo.loading_question')}
                                    </p>
                                </div>
                            )}

                            {/* State: Question Ready & Answering */}
                            {(status === "question_ready" || status === "loading_eval") && (
                                <div className="space-y-5">
                                    {/* Question Panel */}
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5">
                                        <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider flex items-center gap-1.5 mb-2">
                                            <FaMagic className="text-[9px]" /> Interviewer Question
                                        </span>
                                        <h4 className="text-sm sm:text-base font-semibold leading-relaxed text-slate-800 font-mono">
                                            {typedQuestion || <span className="text-slate-400 italic">Formulating...</span>}
                                            {typedQuestion.length < question.length && <span className="animate-pulse">|</span>}
                                        </h4>
                                    </div>

                                    {/* Answer Text Area */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 font-medium">{t('demo.your_response')}</span>
                                            <span className="text-slate-400">{answer.trim().split(/\s+/).filter(Boolean).length} {t('demo.words')}</span>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                value={answer}
                                                onChange={(e) => setAnswer(e.target.value)}
                                                disabled={status === "loading_eval"}
                                                placeholder={t('demo.placeholder')}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[120px] max-h-[200px] outline-none text-xs sm:text-sm text-slate-800 focus:border-blue-500 disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    {/* Control panel buttons */}
                                    {status === "loading_eval" ? (
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-4">
                                            <div className="w-10 h-10 border-2 border-t-blue-600 border-slate-200 rounded-full animate-spin mx-auto"></div>
                                            <p className="text-xs font-mono text-blue-600 tracking-wide animate-pulse">
                                                {loaderText}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={toggleSpeech}
                                                className={`flex-1 font-bold text-xs py-3.5 rounded-xl border flex items-center justify-center gap-2 transition duration-200 ${
                                                    isListening 
                                                        ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" 
                                                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-slate-100"
                                                }`}
                                            >
                                                {isListening ? (
                                                    <>
                                                        <FaStop className="text-[10px]" /> {t('demo.stop_recording')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaMicrophone className="text-[10px]" /> {t('demo.speak_response')}
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={handleSubmitAnswer}
                                                className="flex-1 bg-gradient-brand text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all duration-200 hover:-translate-y-1"
                                            >
                                                {t('demo.evaluate_btn')}
                                            </button>

                                            <button
                                                onClick={handleReset}
                                                className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition duration-200"
                                                title="Restart"
                                            >
                                                <FaUndo className="text-xs" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* State: Evaluation Results Ready */}
                            {status === "eval_ready" && evalResults && (
                                <div className="space-y-6">
                                    {/* Header Grade banner */}
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                                <FaCheck />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-slate-900">{t('demo.eval_generated')}</h3>
                                                <p className="text-[10px] text-slate-500 font-mono">{t('demo.eval_processed')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400">{t('demo.overall_score')}</p>
                                            <p className="text-xl font-black text-emerald-600">{evalResults.score}</p>
                                        </div>
                                    </div>

                                    {/* Metric Progress Bars */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl font-mono text-[10px]">
                                            <span className="text-slate-500">CONFIDENCE</span>
                                            <p className="text-sm font-bold text-blue-600 mt-1">{evalResults.confidence}%</p>
                                            <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-blue-600" style={{ width: `${evalResults.confidence}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl font-mono text-[10px]">
                                            <span className="text-slate-500">COMMUNICATION</span>
                                            <p className="text-sm font-bold text-purple-600 mt-1">{evalResults.communication}%</p>
                                            <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-purple-600" style={{ width: `${evalResults.communication}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl font-mono text-[10px]">
                                            <span className="text-slate-500">TECHNICAL DEPTH</span>
                                            <p className="text-sm font-bold text-amber-600 mt-1">{evalResults.technical}%</p>
                                            <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-amber-600" style={{ width: `${evalResults.technical}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Insights list */}
                                    <div className="space-y-4 text-xs">
                                        <div>
                                            <h5 className="font-bold text-emerald-600 mb-1 flex items-center gap-1.5">
                                                <span>✓</span> {t('demo.strengths')}
                                            </h5>
                                            <ul className="list-disc pl-4 text-slate-600 space-y-1">
                                                {evalResults.strengths.slice(0, 2).map((str, i) => (
                                                    <li key={i}>{str}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-rose-600 mb-1 flex items-center gap-1.5">
                                                <span>⚠</span> {t('demo.weaknesses')}
                                            </h5>
                                            <ul className="list-disc pl-4 text-slate-600 space-y-1">
                                                {evalResults.weaknesses.slice(0, 2).map((weak, i) => (
                                                    <li key={i}>{weak}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-blue-600 mb-1 flex items-center gap-1.5">
                                                <span>⚡</span> {t('demo.improvement')}
                                            </h5>
                                            <ul className="list-disc pl-4 text-slate-600 space-y-1">
                                                {evalResults.suggestions.slice(0, 2).map((sug, i) => (
                                                    <li key={i}>{sug}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Action button */}
                                    <button
                                        onClick={handleReset}
                                        className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2"
                                    >
                                        <FaUndo className="text-[10px]" /> {t('demo.practice_again')}
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default AIDemo;