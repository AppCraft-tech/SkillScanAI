import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ImageSlider from "../components/common/ImageSlider";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

function About() {
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
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <>
            <Navbar />
            <ImageSlider />

            {/* Header Banner */}
            <section className="bg-slate-50 border-b border-slate-200/60 text-slate-800 py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-400/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-400/10 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        
                        {/* Left: Text Content */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="w-full lg:w-1/2 space-y-6"
                        >
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-flex items-center gap-2 bg-white border border-brand-100 rounded-full px-4 py-1.5 text-xs text-brand-600 font-bold shadow-sm"
                            >
                                ✨ Next-Generation Platform
                            </motion.div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-accent-800 tracking-tight leading-[1.15]">
                                {t('about.title')}
                            </h1>
                            <p className="text-base sm:text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {t('about.description')}
                            </p>
                        </motion.div>

                        {/* Right: Beautiful Image */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full lg:w-1/2 relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-300/40 to-accent-300/40 rounded-[2.5rem] blur-2xl opacity-60"></div>
                            <img 
                                src="/blog_ai_recruitment.png" 
                                alt="About SkillScan AI" 
                                className="relative w-full h-auto object-cover rounded-[2rem] shadow-2xl ring-1 ring-slate-900/5" 
                            />
                            
                            {/* Floating Badge */}
                            <motion.div 
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 glass-card p-4 rounded-2xl shadow-xl flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 text-xl font-bold">🎯</div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500">Precision</p>
                                    <p className="text-sm font-bold text-accent-800">AI Accuracy</p>
                                </div>
                            </motion.div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Features list */}
            <section className="bg-white py-24 relative overflow-hidden">
                <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-brand-400/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto space-y-3 mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-accent-800 tracking-tight">
                            {t('about.features_title')}
                        </h2>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Left: Moving Beautiful Image */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="w-full lg:w-1/3 relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-300/40 to-accent-300/40 rounded-3xl blur-2xl opacity-50"></div>
                            <motion.img 
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                src="/media__1784123027829.png" 
                                alt="Platform Features" 
                                className="relative w-full h-auto object-cover rounded-3xl shadow-2xl ring-1 ring-slate-900/5" 
                            />
                            
                            {/* Floating decorative elements */}
                            <motion.div 
                                animate={{ x: [-5, 5, -5], y: [-5, 5, -5] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-4 -right-4 glass p-3 rounded-2xl shadow-xl flex items-center justify-center bg-white/80 backdrop-blur-md"
                            >
                                <span className="text-2xl">🚀</span>
                            </motion.div>
                        </motion.div>

                        {/* Right: Grid */}
                        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: t('about.f1_title'), desc: t('about.f1_desc'), icon: "🤖" },
                                { title: t('about.f2_title'), desc: t('about.f2_desc'), icon: "🎤" },
                                { title: t('about.f3_title'), desc: t('about.f3_desc'), icon: "📷" },
                                { title: t('about.f4_title'), desc: t('about.f4_desc'), icon: "📊" },
                                { title: t('about.f5_title'), desc: t('about.f5_desc'), icon: "📄" },
                                { title: t('about.f6_title'), desc: t('about.f6_desc'), icon: "⚡" },
                            ].map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.03, translateY: -5 }}
                                    className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100/50 hover:shadow-xl transition-all cursor-pointer"
                                >
                                    <h3 className="text-lg font-bold text-accent-800 mb-3 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-lg shadow-sm border border-brand-100/50">
                                            {feature.icon}
                                        </div>
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default About;