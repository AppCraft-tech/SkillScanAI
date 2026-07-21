import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import {
  FaArrowLeft,
  FaRedo,
  FaCheckCircle,
  FaTimesCircle,
  FaRegCommentDots,
  FaAward,
  FaHistory,
  FaUserTie,
  FaCalendarAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Results() {
  const { t } = useTranslation();
  const [latest, setLatest] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("latest_interview");
    if (stored) {
      try {
        setLatest(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing latest interview", e);
      }
    }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/interviews");
      setInterviews(res.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const clearHistory = async () => {
    if (
      !window.confirm("Are you sure you want to delete all interview history?")
    )
      return;
    try {
      await axios.delete("http://localhost:5000/api/interviews");
      setInterviews([]);
    } catch (error) {
      console.error("Failed to clear history:", error);
      alert("Failed to clear history.");
    }
  };

  const deleteHistoryItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/interviews/${id}`);
      setInterviews(interviews.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete history item:", error);
      alert("Failed to delete item.");
    }
  };

  if (!latest) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse-slow"></div>
          <div className="glass-card p-8 sm:p-10 max-w-md text-center relative z-10">
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
              <FaRegCommentDots className="text-3xl" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('results.noSessionTitle', 'No Session Found')}
            </h1>
            <p className="text-slate-500 mt-4 text-sm leading-relaxed">
              {t('results.noSessionDesc', "It looks like you haven't completed an interview session yet. Start one now to receive AI-powered evaluations and analytics.")}
            </p>
            <Link
              to="/interview"
              className="inline-block bg-gradient-brand text-white font-bold px-8 py-3.5 rounded-xl mt-8 transition duration-200 shadow-lg shadow-brand-500/25 hover:-translate-y-1"
            >
              {t('results.startNewBtn', 'Start New Interview')}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Averages/Overall metrics
  const overallScore = parseFloat(latest.score) || 0;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-5xl mx-auto px-6">
          {/* Back button & Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12 bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex-1 relative z-10">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold mb-6 transition bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full text-sm"
              >
                <FaArrowLeft /> {t('results.backToHome', 'Back to Home')}
              </Link>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
                {latest.userName
                  ? `${latest.userName}${t('results.sFeedback', "'s Feedback")}`
                  : t('results.interviewFeedback', 'Interview Feedback')}
              </h1>
              <p className="text-slate-500 text-base mb-8">
                {t('results.role', 'Role:')}{" "}
                <span className="font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full ml-1">
                  {latest.role}
                </span>{" "}
                <span className="mx-2">&bull;</span> {latest.date}
              </p>
              <div className="flex gap-4 w-full sm:w-auto">
                <Link
                  to="/interview"
                  className="flex-1 sm:flex-none bg-gradient-brand text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition duration-300 shadow-lg shadow-brand-500/25 hover:-translate-y-1 hover:shadow-brand-500/40"
                >
                  <FaRedo /> {t('results.retakeInterview', 'Retake Interview')}
                </Link>
              </div>
            </div>

            {/* Beautiful Picture on the right */}
            <div className="flex-1 w-full relative hidden lg:block">
               <motion.img
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  src="/slider_4_success_1784125024154.png"
                  alt="Success Results"
                  className="w-full h-[280px] object-cover rounded-3xl shadow-lg ring-1 ring-slate-900/5"
               />
               <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 glass-card p-3 rounded-2xl shadow-xl flex items-center justify-center bg-white/90 backdrop-blur"
               >
                  <div className="text-xl">🏆</div>
               </motion.div>
            </div>
          </motion.div>

          {/* Top Section: Overall Score and Category Analytics */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mb-8"
          >
            {/* Score Circle Card */}
            <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                {t('results.overallRating', 'Overall Rating')}
              </h2>
              <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-[10px] border-slate-100 shadow-inner bg-slate-50/50">
                <div
                  className="absolute inset-0 rounded-full border-[10px] border-brand-600"
                  style={{ clipPath: `inset(0px 0px 0px 0px)` }}
                ></div>
                <div className="z-10">
                  <span className="text-4xl font-extrabold text-slate-800">
                    {latest.score.split("/")[0]}
                  </span>
                  <span className="text-slate-400 text-lg">/10</span>
                </div>
              </div>
              <span
                className={`mt-6 px-4 py-1.5 rounded-full text-xs font-bold border ${
                  overallScore >= 9.0
                    ? "bg-green-50 text-green-700 border-green-200"
                    : overallScore >= 8.0
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : overallScore >= 7.0
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {latest.status}
              </span>
            </div>

            {/* Breakdown progress bars */}
            <div className="glass-card rounded-2xl p-8 md:col-span-2 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                  {t('results.evalCatScores', 'Evaluation Category Scores')}
                </h2>
                <div className="space-y-6 text-sm">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-500 font-medium">
                        {t('dashboard.confidence', 'Confidence Score')}
                      </span>
                      <span className="font-bold text-slate-800">
                        {latest.confidence}%
                      </span>
                    </div>
                    <div className="bg-slate-100 h-2 rounded-full w-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${latest.confidence}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-green-500 h-2 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-500 font-medium">
                        {t('dashboard.communication', 'Communication Skills')}
                      </span>
                      <span className="font-bold text-slate-800">
                        {latest.communication}%
                      </span>
                    </div>
                    <div className="bg-slate-100 h-2 rounded-full w-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${latest.communication}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="bg-blue-500 h-2 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-500 font-medium">
                        {t('dashboard.technical', 'Technical Skills')}
                      </span>
                      <span className="font-bold text-slate-800">
                        {latest.technical}%
                      </span>
                    </div>
                    <div className="bg-slate-100 h-2 rounded-full w-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${latest.technical}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                        className="bg-purple-600 h-2 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Feedback Highlights: Strengths & Weaknesses */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid md:grid-cols-2 gap-8 mb-8 text-sm"
          >
            {/* Strengths */}
            <div className="glass-card rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FaCheckCircle className="text-green-600" /> {t('results.keyStrengths', 'Key Strengths')}
              </h2>
              <ul className="space-y-4">
                {latest.evaluations.some(
                  (e) => e.strengths && e.strengths.length > 0,
                ) ? (
                  [...new Set(latest.evaluations.flatMap((e) => e.strengths))]
                    .slice(0, 4)
                    .map((str, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-slate-600 leading-relaxed"
                      >
                        <span className="text-green-500 font-bold mt-0.5">
                          &bull;
                        </span>
                        <span>{str}</span>
                      </li>
                    ))
                ) : (
                  <li className="text-slate-400 italic">
                    No specific strengths parsed. Your response met standard
                    baseline criteria.
                  </li>
                )}
              </ul>
            </div>

            {/* Weaknesses / Improvements */}
            <div className="glass-card rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FaTimesCircle className="text-red-500" /> {t('results.focusAreas', 'Focus Areas')}
              </h2>
              <ul className="space-y-4">
                {latest.evaluations.some(
                  (e) => e.weaknesses && e.weaknesses.length > 0,
                ) ? (
                  [...new Set(latest.evaluations.flatMap((e) => e.weaknesses))]
                    .slice(0, 4)
                    .map((weak, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-slate-600 leading-relaxed"
                      >
                        <span className="text-red-500 font-bold mt-0.5">
                          &bull;
                        </span>
                        <span>{weak}</span>
                      </li>
                    ))
                ) : (
                  <li className="text-slate-400 italic">
                    No major points of improvement captured. Great job!
                  </li>
                )}
              </ul>
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <div className="glass-card rounded-2xl p-8 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FaAward className="text-yellow-500" /> {t('results.aiRecommendations', 'AI Recommendations')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {latest.suggestions && latest.suggestions.length > 0 ? (
                latest.suggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6"
                  >
                    <h3 className="font-semibold text-slate-700 text-sm mb-2">
                      {t('results.tipPrefix', 'Tip #')}{idx + 1}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {sug}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic col-span-3 text-sm">
                  {t('results.noSuggestions', 'No suggestions available.')}
                </p>
              )}
            </div>
          </div>

          {/* Interview Room Transcript */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-8">
              {t('results.transcriptTitle', 'Question-by-Question Transcript')}
            </h2>
            <div className="space-y-8">
              {latest.questions.map((q, idx) => (
                <div
                  key={idx}
                  className="border-b border-slate-100 pb-8 last:border-b-0 last:pb-0 group"
                >
                  <div className="flex items-center gap-3 mb-4 transition-transform duration-300 group-hover:translate-x-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm">
                      Q{idx + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-relaxed">
                      {q}
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {t('results.yourAnswer', 'Your Answer')}
                      </h4>
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {latest.answers[idx] || (
                          <span className="italic text-slate-400">
                            {t('results.noAnswer', 'No answer provided.')}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {t('results.aiAssessment', 'AI Assessment')}
                      </h4>
                      <pre className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {latest.evaluations[idx]?.raw ||
                          "No feedback generated."}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* History Section */}
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                  <FaHistory />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {t('results.historyTitle', 'Interview History')}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {t('results.historyDesc', 'Review all your past AI interview sessions')}
                  </p>
                </div>
              </div>
              {interviews.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                >
                  <FaTrashAlt /> {t('results.clearAll', 'Clear All')}
                </button>
              )}
            </div>

            {loadingHistory ? (
              <div className="text-center py-10">
                <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium">{t('results.loadingHistory', 'Loading history...')}</p>
              </div>
            ) : interviews.length === 0 ? (
              <div className="glass-card text-center py-12 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                  <FaHistory />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">
                  {t('results.noOtherInterviews', 'No Other Interviews Yet')}
                </h3>
                <p className="text-slate-500 text-sm">
                  {t('results.pastSessions', 'Your past sessions will appear here.')}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {interviews.map((session) => (
                  <div
                    key={session.id}
                    className="glass-card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                        <FaUserTie className="text-lg text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {session.userName || "Anonymous"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                            {session.role}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt /> {session.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          {t('results.scoreTitle', 'Score')}
                        </div>
                        <div className="text-lg font-extrabold text-slate-800">
                          {session.score.split("/")[0]}
                          <span className="text-xs text-slate-400 font-medium">
                            /10
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          {t('results.statusTitle', 'Status')}
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            session.status === "Excellent"
                              ? "bg-green-50 text-green-700"
                              : session.status === "Very Good"
                                ? "bg-blue-50 text-blue-700"
                                : session.status === "Good"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-red-50 text-red-700"
                          }`}
                        >
                          {session.status}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteHistoryItem(session.id)}
                        className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        title="Delete this session"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Results;
