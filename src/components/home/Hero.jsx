import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

function Hero() {
    const { t } = useTranslation();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section className="relative bg-gradient-to-b from-brand-50/50 via-white to-slate-50 text-slate-800 overflow-hidden py-20 sm:py-28 border-b border-slate-100">
            {/* Subtle light-blue radial glow & grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-400/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-accent-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* Left Column: Heading and description */}
                    <motion.div
                        className="lg:col-span-6 space-y-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 text-xs text-brand-600 font-semibold shadow-sm">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                            </span>
                            {t('hero.badge')}
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-accent-800">
                            {t('hero.title_part1')} <span className="text-gradient">{t('hero.title_highlight')}</span>. <br />
                            {t('hero.title_part2')}
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-xl">
                            {t('hero.description')}
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
                            <Link to="/candidate-screening">
                                <button className="bg-gradient-brand hover:opacity-90 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-brand-500/25 transition duration-200 hover:-translate-y-1 flex items-center gap-2">
                                    <FaPlay className="text-xs" /> Start by Uploading your Resume
                                </button>
                            </Link>
                            <Link to="/about">
                                <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl transition duration-200 shadow-sm">
                                    {t('hero.learn_more_btn')}
                                </button>
                            </Link>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex items-center gap-8 pt-8 border-t border-slate-200/50 text-xs text-slate-400 font-medium">
                            <div className="flex items-center gap-1.5">✓ {t('hero.feature_speech')}</div>
                            <div className="flex items-center gap-1.5">✓ {t('hero.feature_nocredit')}</div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Beautiful Image representing AI mock interview */}
                    <motion.div
                        className="lg:col-span-6 relative flex justify-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <div className="w-full max-w-[500px] glass-card p-2 rounded-3xl relative overflow-hidden group shadow-2xl shadow-brand-500/5 hover:shadow-brand-500/20 transition-all duration-500">
                            <img src="/slider_2_interview_1784125002190.png" alt="AI Interview" className="w-full h-auto rounded-2xl object-cover" />
                            <div className="absolute top-6 right-6 glass p-3 rounded-xl animate-float">
                                <div className="text-xs text-slate-500 font-bold">{t('hero.score_label')}</div>
                                <div className="text-xl font-extrabold text-accent-500">92%</div>
                            </div>
                            <div className="absolute bottom-6 left-6 glass p-4 rounded-xl animate-float" style={{ animationDelay: '1s' }}>
                                <p className="text-slate-800 text-sm font-semibold flex items-center gap-2">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
                                    </span>
                                    {t('hero.analyzing')}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

export default Hero;