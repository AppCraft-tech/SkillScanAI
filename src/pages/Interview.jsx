import CameraPreview from "../components/interview/CameraPreview";
import { useState } from "react";
import Timer from "../components/interview/Timer";
import SpeechBox from "../components/interview/SpeechBox";
import axios from "axios";
import {
    generateQuestion,
    evaluateAnswer,
} from "../services/gemini";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
    FaUserTie, FaCode, FaServer, FaCubes, FaBrain, FaChartBar, FaKeyboard, 
    FaChevronDown, FaCheck, FaMobileAlt, FaCloud, FaDatabase, FaShieldAlt, 
    FaPaintBrush, FaBug, FaProjectDiagram, FaBullhorn, FaPenNib, FaChartLine, 
    FaRobot, FaGamepad, FaHeadset, FaSearchDollar, FaNetworkWired, FaTools,
    FaBriefcase, FaHeartbeat, FaChalkboardTeacher, FaCalculator, FaBalanceScale,
    FaHardHat, FaUtensils, FaCameraRetro, FaMusic, FaStore
} from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

function Interview() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Navigation/Setup states
    const [started, setStarted] = useState(false);
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("Frontend Developer");
    const [customRole, setCustomRole] = useState("");
    const [selectedPreset, setSelectedPreset] = useState("Frontend Developer");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Interview session states
    const [answer, setAnswer] = useState("");
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [confidence, setConfidence] = useState(0);
    const [communication, setCommunication] = useState(0);
    const [technical, setTechnical] = useState(0);
    const [isListening, setIsListening] = useState(false);

    // Dynamic lists to aggregate the session
    const [sessionQuestions, setSessionQuestions] = useState([]);
    const [sessionAnswers, setSessionAnswers] = useState([]);
    const [sessionEvaluations, setSessionEvaluations] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
    
    // Timer state
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const presets = [
        { name: t('interview.presets.frontend_developer', 'Frontend Developer'), image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=100&fit=crop", icon: <FaCode className="text-sm text-blue-600" /> },
        { name: t('interview.presets.backend_developer', 'Backend Developer'), image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop", icon: <FaServer className="text-sm text-purple-600" /> },
        { name: t('interview.presets.full_stack_developer', 'Full Stack Developer'), image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop", icon: <FaCubes className="text-sm text-green-600" /> },
        { name: t('interview.presets.ai_ml_engineer', 'AI/ML Engineer'), image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&h=100&fit=crop", icon: <FaBrain className="text-sm text-red-600" /> },
        { name: t('interview.presets.data_scientist', 'Data Scientist'), image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop", icon: <FaChartBar className="text-sm text-yellow-600" /> },
        { name: t('interview.presets.mobile_app_developer', 'Mobile App Developer'), image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=100&h=100&fit=crop", icon: <FaMobileAlt className="text-sm text-indigo-600" /> },
        { name: t('interview.presets.devops_engineer', 'DevOps Engineer'), image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=100&h=100&fit=crop", icon: <FaCloud className="text-sm text-cyan-600" /> },
        { name: t('interview.presets.database_administrator', 'Database Administrator'), image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=100&h=100&fit=crop", icon: <FaDatabase className="text-sm text-orange-600" /> },
        { name: t('interview.presets.cybersecurity_analyst', 'Cybersecurity Analyst'), image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=100&h=100&fit=crop", icon: <FaShieldAlt className="text-sm text-emerald-600" /> },
        { name: t('interview.presets.ui_ux_designer', 'UI/UX Designer'), image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop", icon: <FaPaintBrush className="text-sm text-pink-600" /> },
        { name: t('interview.presets.qa_engineer', 'QA Engineer'), image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=100&h=100&fit=crop", icon: <FaBug className="text-sm text-rose-600" /> },
        { name: t('interview.presets.product_manager', 'Product Manager'), image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop", icon: <FaProjectDiagram className="text-sm text-blue-500" /> },
        { name: t('interview.presets.digital_marketing_specialist', 'Digital Marketing Specialist'), image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=100&h=100&fit=crop", icon: <FaBullhorn className="text-sm text-amber-500" /> },
        { name: t('interview.presets.content_writer', 'Content Writer'), image: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=100&h=100&fit=crop", icon: <FaPenNib className="text-sm text-stone-600" /> },
        { name: t('interview.presets.business_analyst', 'Business Analyst'), image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop", icon: <FaChartLine className="text-sm text-green-500" /> },
        { name: t('interview.presets.robotics_engineer', 'Robotics Engineer'), image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop", icon: <FaRobot className="text-sm text-slate-500" /> },
        { name: t('interview.presets.game_developer', 'Game Developer'), image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=100&h=100&fit=crop", icon: <FaGamepad className="text-sm text-violet-600" /> },
        { name: t('interview.presets.it_support_specialist', 'IT Support Specialist'), image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop", icon: <FaHeadset className="text-sm text-teal-600" /> },
        { name: t('interview.presets.seo_specialist', 'SEO Specialist'), image: "https://images.unsplash.com/photo-1572177812156-58036aae439c?w=100&h=100&fit=crop", icon: <FaSearchDollar className="text-sm text-lime-600" /> },
        { name: t('interview.presets.cloud_architect', 'Cloud Architect'), image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop", icon: <FaCloud className="text-sm text-sky-600" /> },
        { name: t('interview.presets.network_engineer', 'Network Engineer'), image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&h=100&fit=crop", icon: <FaNetworkWired className="text-sm text-blue-800" /> },
        { name: t('interview.presets.system_administrator', 'System Administrator'), image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop", icon: <FaTools className="text-sm text-gray-700" /> },
        { name: t('interview.presets.sales_representative', 'Sales Representative'), image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&h=100&fit=crop", icon: <FaBriefcase className="text-sm text-indigo-500" /> },
        { name: t('interview.presets.financial_analyst', 'Financial Analyst'), image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=100&h=100&fit=crop", icon: <FaChartLine className="text-sm text-emerald-600" /> },
        { name: t('interview.presets.registered_nurse', 'Registered Nurse'), image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=100&h=100&fit=crop", icon: <FaHeartbeat className="text-sm text-red-500" /> },
        { name: t('interview.presets.human_resources_manager', 'Human Resources Manager'), image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop", icon: <FaUserTie className="text-sm text-fuchsia-600" /> },
        { name: t('interview.presets.teacher___educator', 'Teacher / Educator'), image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop", icon: <FaChalkboardTeacher className="text-sm text-orange-500" /> },
        { name: t('interview.presets.accountant', 'Accountant'), image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&h=100&fit=crop", icon: <FaCalculator className="text-sm text-stone-500" /> },
        { name: t('interview.presets.lawyer___legal_counsel', 'Lawyer / Legal Counsel'), image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=100&h=100&fit=crop", icon: <FaBalanceScale className="text-sm text-yellow-700" /> },
        { name: t('interview.presets.civil_engineer', 'Civil Engineer'), image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=100&h=100&fit=crop", icon: <FaHardHat className="text-sm text-amber-500" /> },
        { name: t('interview.presets.chef___culinary_arts', 'Chef / Culinary Arts'), image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&h=100&fit=crop", icon: <FaUtensils className="text-sm text-red-700" /> },
        { name: t('interview.presets.photographer', 'Photographer'), image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop", icon: <FaCameraRetro className="text-sm text-slate-800" /> },
        { name: t('interview.presets.musician', 'Musician'), image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=100&h=100&fit=crop", icon: <FaMusic className="text-sm text-violet-500" /> },
        { name: t('interview.presets.retail_manager', 'Retail Manager'), image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=100&h=100&fit=crop", icon: <FaStore className="text-sm text-cyan-700" /> },
        { name: t('interview.presets.custom', 'Custom'), image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=100&h=100&fit=crop", icon: <FaKeyboard className="text-sm text-slate-600" />, isCustom: true }
    ];

    const handleStart = async () => {
        if (!userName.trim()) {
            alert(t("interview.alerts.enter_name", "Please enter your name before starting the interview."));
            return;
        }
        setLoading(true);
        const finalRole = selectedPreset === "Custom" ? customRole || "General Professional" : selectedPreset;
        setRole(finalRole);
        try {
            const firstQuestion = await generateQuestion(finalRole, [], true);
            setQuestion(firstQuestion);
            setStarted(true);
        } catch (error) {
            console.error(error);
            alert(t("interview.alerts.error_init", "Error initializing interview question. Please try again."));
        }
        setLoading(false);
    };

    const parseEvaluation = (text) => {
        const scoreMatch = text.match(/Overall Score:\s*(\d+(\.\d+)?)\s*\/10/i);
        const confMatch = text.match(/Confidence:\s*(\d+)%/i);
        const commMatch = text.match(/Communication:\s*(\d+)%/i);
        const techMatch = text.match(/Technical (?:Knowledge|Skills|Knowledge:):\s*(\d+)%/i);
        
        const score = scoreMatch ? parseFloat(scoreMatch[1]) : 8.0;
        const confidenceScore = confMatch ? parseInt(confMatch[1], 10) : 80;
        const communicationScore = commMatch ? parseInt(commMatch[1], 10) : 80;
        const technicalScore = techMatch ? parseInt(techMatch[1], 10) : 80;
        
        const getBullets = (sectionName) => {
            const regex = new RegExp(`${sectionName}:[\\s\\S]*?(?:Weaknesses:|Suggestions:|Overall Score:|$|\\n\\n)`, 'i');
            const match = text.match(regex);
            if (!match) return [];
            return match[0]
                .replace(new RegExp(`${sectionName}:`, 'i'), '')
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))
                .map(line => line.replace(/^[•\-*]\s*/, ''));
        };
        
        return {
            score,
            confidence: confidenceScore,
            communication: communicationScore,
            technical: technicalScore,
            strengths: getBullets('Strengths'),
            weaknesses: getBullets('Weaknesses'),
            suggestions: getBullets('Suggestions'),
            raw: text
        };
    };

    const handleNextQuestion = async () => {
        if (answer.trim() === "") {
            alert(t("interview.alerts.answer_first", "Please answer the current question first."));
            return;
        }
        setLoading(true);
        try {
            // Evaluate answer
            const evalResult = await evaluateAnswer(question, answer);
            setFeedback(evalResult);

            const parsed = parseEvaluation(evalResult);
            setConfidence(parsed.confidence);
            setCommunication(parsed.communication);
            setTechnical(parsed.technical);

            // Record this question session
            setSessionQuestions(prev => [...prev, question]);
            setSessionAnswers(prev => [...prev, answer]);
            setSessionEvaluations(prev => [...prev, parsed]);

            // Load next question
            const nextQ = await generateQuestion(role, [...sessionQuestions, question]);
            setQuestion(nextQ);
            setAnswer("");
            setCurrentQuestionIndex(prev => prev + 1);
        } catch (error) {
            console.error(error);
            alert(t("interview.alerts.ai_error", "AI Error during evaluation. Please try again."));
        }
        setLoading(false);
    };

    const handleFinish = async () => {
        // If there's a pending answer that has not been saved yet, warn them, or just use completed ones.
        let finalQuestions = [...sessionQuestions];
        let finalAnswers = [...sessionAnswers];
        let finalEvaluations = [...sessionEvaluations];

        if (finalQuestions.length === 0) {
            alert(t("interview.alerts.complete_one", "Please complete and evaluate at least one question first."));
            return;
        }

        // Calculate averages
        const avgScore = finalEvaluations.reduce((sum, e) => sum + e.score, 0) / finalEvaluations.length;
        const avgConfidence = Math.round(finalEvaluations.reduce((sum, e) => sum + e.confidence, 0) / finalEvaluations.length);
        const avgCommunication = Math.round(finalEvaluations.reduce((sum, e) => sum + e.communication, 0) / finalEvaluations.length);
        const avgTechnical = Math.round(finalEvaluations.reduce((sum, e) => sum + e.technical, 0) / finalEvaluations.length);

        // Accumulate recommendations
        const allSuggestions = [];
        finalEvaluations.forEach(e => {
            if (e.suggestions) {
                allSuggestions.push(...e.suggestions);
            }
        });
        if (allSuggestions.length === 0) {
            allSuggestions.push("Practice answering with structure (e.g., the STAR method).");
            allSuggestions.push("Ensure your responses focus on practical technical context.");
            allSuggestions.push("Keep answers concise, between 1-2 minutes long.");
        }

        const flow = searchParams.get('flow');
        const resumeScore = searchParams.get('score');

        const newSession = {
            userName: userName.trim(),
            role: role,
            date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
            score: `${avgScore.toFixed(1)}/10`,
            numericScore: parseFloat(avgScore.toFixed(1)),
            status: avgScore >= 9.0 ? "Excellent" : avgScore >= 8.0 ? "Very Good" : avgScore >= 7.0 ? "Good" : "Needs Improvement",
            confidence: avgConfidence,
            communication: avgCommunication,
            technical: avgTechnical,
            questions: finalQuestions,
            answers: finalAnswers,
            evaluations: finalEvaluations,
            suggestions: [...new Set(allSuggestions)].slice(0, 3), // Remove duplicates and grab top 3
            isResumeBased: flow === 'resume',
            resumeScore: resumeScore ? parseInt(resumeScore, 10) : null,
            resumeStatus: flow === 'resume' ? 'Eligible' : null
        };

        try {
            // Save to backend database
            const response = await axios.post("http://localhost:5000/api/interviews", newSession);
            
            // Save as latest session for Results page
            localStorage.setItem("latest_interview", JSON.stringify(response.data));
            
            navigate("/results");
        } catch (error) {
            console.error("Error saving interview session:", error);
            alert(t("interview.alerts.failed_save", "Failed to save interview session to the database."));
        }
    };

    if (!started) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-50 pt-24 pb-32 px-6 relative overflow-x-hidden z-20">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-400/10 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-400/10 rounded-full blur-[100px] pointer-events-none"></div>
                    
                    <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-16 items-center">
                        
                        {/* Left: Setup Form */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="w-full lg:w-1/2 glass-card p-8 sm:p-10 relative z-10 rounded-3xl shadow-xl shadow-slate-200/50"
                        >
                            <div className="text-center mb-10">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 text-3xl shadow-sm"
                                >
                                    <FaUserTie />
                                </motion.div>
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {t('interview.chooseRole', 'Choose Your Target Role')}
                                </h1>
                                <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                                    {t('interview.enterNameDesc', 'Enter your name and select your role to customize your AI interview.')}
                                </p>
                            </div>

                            <div className="mb-6 z-30 relative">
                                <label className="block text-slate-700 font-bold text-sm mb-2 ml-1">{t('interview.yourName', 'Your Name')}</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder={t('interview.enterFullName', 'Enter your full name')}
                                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
                                    required
                                />
                            </div>

                            <div className="relative mb-10 z-20">
                                <label className="block text-slate-700 font-bold text-sm mb-2 ml-1">{t('interview.targetRole', 'Target Role')}</label>
                                <div 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className={`w-full flex items-center justify-between border ${dropdownOpen ? 'border-blue-500 bg-white ring-4 ring-blue-500/10' : 'border-slate-200 bg-slate-50 hover:bg-white'} rounded-2xl p-3 cursor-pointer transition-all duration-200`}
                                >
                                    <div className="flex items-center gap-4">
                                        {presets.find(p => p.name === selectedPreset) ? (
                                            <>
                                                <div className="relative">
                                                    <img src={presets.find(p => p.name === selectedPreset)?.image} alt={selectedPreset} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-slate-100 flex items-center justify-center">
                                                        {presets.find(p => p.name === selectedPreset)?.icon}
                                                    </div>
                                                </div>
                                                <div className="text-left pr-4">
                                                    <div className="text-[10px] text-blue-600 font-bold tracking-wider uppercase mb-0.5">{t('interview.targetRole', 'Target Role')}</div>
                                                    <div className="font-bold text-slate-900 text-base line-clamp-1">{selectedPreset === "Custom" ? (customRole || t('interview.customRole', 'Custom Role')) : selectedPreset}</div>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="text-slate-500 font-medium px-2">{t('interview.selectRole', 'Select a role...')}</span>
                                        )}
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 ${dropdownOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-400 bg-transparent'}`}>
                                        <FaChevronDown />
                                    </div>
                                </div>

                                {dropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 flex flex-col transition-all duration-200 origin-top">
                                            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                                                <input
                                                    type="text"
                                                    value={customRole}
                                                    onChange={(e) => {
                                                        setCustomRole(e.target.value);
                                                        setSelectedPreset("Custom");
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && customRole.trim() !== '') {
                                                            setDropdownOpen(false);
                                                            handleStart();
                                                        }
                                                    }}
                                                    placeholder={t('interview.customRolePlaceholder', 'Or write another job role and hit Enter...')}
                                                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 placeholder-slate-400 shadow-inner"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="p-2 space-y-1 max-h-[18rem] overflow-y-auto overflow-x-hidden">
                                                {presets.filter(p => !p.isCustom).map((preset) => (
                                                    <div
                                                        key={preset.name}
                                                        onClick={() => {
                                                            setSelectedPreset(preset.name);
                                                            if (!preset.isCustom) setCustomRole("");
                                                            setDropdownOpen(false);
                                                        }}
                                                        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                                            selectedPreset === preset.name 
                                                                ? 'bg-blue-50 border border-blue-100' 
                                                                : 'hover:bg-slate-50 border border-transparent'
                                                        }`}
                                                    >
                                                        <div className="relative flex-shrink-0">
                                                            <img src={preset.image} alt={preset.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100 flex items-center justify-center w-5 h-5">
                                                                {preset.icon}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <div className={`font-bold text-sm ${selectedPreset === preset.name ? 'text-blue-700' : 'text-slate-800'}`}>
                                                                {preset.name}
                                                            </div>
                                                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                                                {preset.isCustom ? t('interview.customRoleDesc', 'Specify your own specialized job role') : t('interview.standardRoleDesc', 'Standard technical and situational questions')}
                                                            </div>
                                                        </div>
                                                        {selectedPreset === preset.name && (
                                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs">
                                                                <FaCheck />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleStart}
                                disabled={loading}
                                className="w-full bg-gradient-brand hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/25 transition duration-200 text-base disabled:opacity-50"
                            >
                                {loading ? t('interview.startingAI', 'Starting AI Engine...') : t('interview.enterRoom', 'Enter AI Interview Room ➜')}
                            </motion.button>
                        </motion.div>

                        {/* Right: Beautiful Animated Picture */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full lg:w-1/2 relative hidden lg:block"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-300/40 to-accent-300/40 rounded-[2.5rem] blur-2xl opacity-60"></div>
                            <motion.img 
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                src="/slider_2_interview_1784125002190.png" 
                                alt="AI Interview Process" 
                                className="relative w-full h-auto object-cover rounded-[2.5rem] shadow-2xl ring-1 ring-slate-900/5" 
                            />
                            
                            {/* Floating decorative elements */}
                            <motion.div 
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl shadow-xl flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xl font-bold">✨</div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500">Live AI</p>
                                    <p className="text-sm font-bold text-accent-800">Ready to Evaluate</p>
                                </div>
                            </motion.div>
                        </motion.div>

                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-50 py-10">

                <div className="max-w-7xl mx-auto px-6">
                    <SpeechBox
                        setAnswer={setAnswer}
                        isListening={isListening}
                    />

                    {/* Heading */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                {t('interview.roomTitle', 'AI Interview Room')}
                            </h1>
                            <p className="text-slate-500 mt-2 text-sm">
                                {t('interview.practicingFor', 'Practicing for:')} <span className="font-semibold text-blue-600">{role}</span> ({t('interview.questionNumber', 'Question')} {currentQuestionIndex})
                            </p>
                        </div>
                        <Timer isRunning={isTimerRunning} onTimeUp={handleFinish} />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* Left Side */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Camera Preview */}
                            <div className="glass-card rounded-2xl overflow-hidden">
                                <CameraPreview />
                            </div>

                            {/* Question Container */}
                            <div className="glass-card rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2">
                                    <span className="text-blue-500">🤖</span> {t('interview.aiQuestion', 'AI Question')}
                                </h2>
                                <p className="text-slate-700 leading-relaxed font-mono text-sm sm:text-base bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {question}
                                </p>
                            </div>

                            {/* Answer Container */}
                            <div className="glass-card rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2">
                                    <span className="text-blue-500">🎤</span> {t('interview.yourAnswer', 'Your Answer')}
                                </h2>
                                <textarea
                                    rows="8"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    disabled={!isTimerRunning}
                                    className={`w-full border border-slate-200 bg-slate-50/50 rounded-xl p-4 outline-none transition-all text-sm sm:text-base ${!isTimerRunning ? "opacity-60 cursor-not-allowed" : "focus:border-blue-500 focus:bg-white text-slate-800"}`}
                                    placeholder={isTimerRunning ? t('interview.answerPlaceholderActive', "Click 'Start Recording' to speak or type your answer directly here...") : t('interview.answerPlaceholderInactive', "Please start the session to begin answering...")}
                                />
                            </div>

                            {/* AI Feedback Container */}
                            <div className="glass-card rounded-2xl p-6 sm:p-8">
                                <h2 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2">
                                    <span className="text-blue-500">📊</span> {t('interview.aiFeedback', 'Question AI Feedback')}
                                </h2>
                                <pre className="whitespace-pre-wrap text-slate-600 leading-relaxed font-sans text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {feedback || t('interview.feedbackPlaceholder', "Your AI evaluation will appear here after you submit your answer.")}
                                </pre>
                            </div>

                        </div>

                        {/* Right Side Controls & Stats */}
                        <div className="space-y-6">

                            {/* AI Analysis Panel */}
                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-lg font-bold mb-6 text-slate-900">
                                    {t('interview.aiAnalysis', 'AI Analysis (Latest)')}
                                </h2>

                                <div className="space-y-5 text-sm">
                                    <div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{t('dashboard.confidence', 'Confidence')}</span>
                                            <span className="font-bold text-slate-800">{confidence}%</span>
                                        </div>
                                        <div className="bg-slate-100 h-2 rounded-full mt-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${confidence}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{t('dashboard.communication', 'Communication')}</span>
                                            <span className="font-bold text-slate-800">{communication}%</span>
                                        </div>
                                        <div className="bg-slate-100 h-2 rounded-full mt-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${communication}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{t('dashboard.technical', 'Technical Skills')}</span>
                                            <span className="font-bold text-slate-800">{technical}%</span>
                                        </div>
                                        <div className="bg-slate-100 h-2 rounded-full mt-2">
                                            <div
                                                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${technical}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons Panel */}
                            <div className="glass-card rounded-2xl p-6 space-y-4">
                                <button
                                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                                    className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition duration-200 shadow-lg ${
                                        isTimerRunning
                                            ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                                            : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                                    }`}
                                >
                                    {isTimerRunning ? t('interview.stopSession', '⏸ Stop Session') : t('interview.startSession', '▶ Start Session')}
                                </button>

                                <button
                                    onClick={() => setIsListening(!isListening)}
                                    disabled={!isTimerRunning}
                                    className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition duration-200 ${
                                        !isTimerRunning ? "bg-slate-300 cursor-not-allowed" :
                                        isListening
                                            ? "bg-red-50 hover:bg-red-600 animate-pulse text-red-600"
                                            : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                                    }`}
                                >
                                    {isListening ? t('demo.stop_recording', '🛑 Stop Recording') : t('interview.startRecording', '🎤 Start Recording')}
                                </button>

                                <button
                                    onClick={handleNextQuestion}
                                    disabled={loading || !isTimerRunning}
                                    className="w-full bg-gradient-brand text-white py-3.5 rounded-xl font-bold text-sm hover:-translate-y-1 transition duration-200 disabled:opacity-50 shadow-lg shadow-brand-500/20"
                                >
                                    {loading ? t('interview.evaluating', 'Evaluating Answer...') : t('interview.submitNext', '➜ Submit & Next Question')}
                                </button>

                                <button
                                    onClick={handleFinish}
                                    className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-sm transition duration-200"
                                >
                                    {t('interview.endInterview', 'End Interview')}
                                </button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <Footer />
        </>
    );
}

export default Interview;