import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

function HowItWorks() {
    const { t } = useTranslation();
    const steps = [
        {
            id: "01",
            title: t('howitworks.step1_title'),
            desc: t('howitworks.step1_desc'),
        },
        {
            id: "02",
            title: t('howitworks.step2_title'),
            desc: t('howitworks.step2_desc'),
        },
        {
            id: "03",
            title: t('howitworks.step3_title'),
            desc: t('howitworks.step3_desc'),
        },
        {
            id: "04",
            title: t('howitworks.step4_title'),
            desc: t('howitworks.step4_desc'),
        },
    ];

    return (
        <section className="bg-white py-24 relative overflow-hidden border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    
                    {/* Left: Timeline & Content */}
                    <div className="w-full lg:w-1/2">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="space-y-3 mb-12"
                        >
                            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                                {t('howitworks.subtitle')}
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-accent-800 tracking-tight">
                                {t('howitworks.title')}
                            </h2>
                            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                                {t('howitworks.description')}
                            </p>
                        </motion.div>

                        <div className="space-y-8 relative">
                            {/* Vertical Connector Line */}
                            <div className="absolute top-8 bottom-8 left-6 w-0.5 bg-slate-100 z-0"></div>

                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    className="group relative flex gap-6 items-start"
                                >
                                    {/* Step Bubble */}
                                    <div className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-gradient-brand text-white flex items-center justify-center text-lg font-black shadow-lg shadow-brand-500/20 group-hover:scale-110 duration-300">
                                        {step.id}
                                    </div>
                                    
                                    <div className="glass-card flex-1 rounded-2xl p-6 shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow">
                                        <h3 className="text-xl font-bold text-accent-800 tracking-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Beautiful Image */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="absolute -inset-6 bg-gradient-to-br from-brand-300/40 to-accent-300/40 rounded-full blur-3xl opacity-50"></div>
                        <img 
                            src="/slider_3_ai_1784125013203.png" 
                            alt="AI Interview Process" 
                            className="relative w-full h-auto object-cover rounded-[2.5rem] shadow-2xl ring-1 ring-slate-900/5" 
                        />
                        
                        {/* Floating elements for Next.js-like animation feel */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl shadow-xl flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">✓</div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Live Analysis</p>
                                <p className="text-sm font-bold text-accent-800">Processing Data...</p>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

export default HowItWorks;