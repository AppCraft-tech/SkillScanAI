import { 
    FaMagic, 
    FaVideo, 
    FaMicrophone, 
    FaBrain, 
    FaRegCommentDots, 
    FaFileDownload 
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

function Features() {
    const { t } = useTranslation();
    const features = [
        {
            title: t('features.f1_title'),
            desc: t('features.f1_desc'),
            icon: <FaMagic />,
            color: "text-brand-600 bg-brand-50 border-brand-100"
        },
        {
            title: t('features.f2_title'),
            desc: t('features.f2_desc'),
            icon: <FaVideo />,
            color: "text-emerald-600 bg-emerald-50 border-emerald-100"
        },
        {
            title: t('features.f3_title'),
            desc: t('features.f3_desc'),
            icon: <FaMicrophone />,
            color: "text-cyan-600 bg-cyan-50 border-cyan-100"
        },
        {
            title: t('features.f4_title'),
            desc: t('features.f4_desc'),
            icon: <FaBrain />,
            color: "text-purple-600 bg-purple-50 border-purple-100"
        },
        {
            title: t('features.f5_title'),
            desc: t('features.f5_desc'),
            icon: <FaRegCommentDots />,
            color: "text-rose-600 bg-rose-50 border-rose-100"
        },
        {
            title: t('features.f6_title'),
            desc: t('features.f6_desc'),
            icon: <FaFileDownload />,
            color: "text-amber-600 bg-amber-50 border-amber-100"
        },
    ];

    return (
        <section className="py-24 bg-brand-50 relative overflow-hidden">
            {/* Soft decorative blur */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-200/30 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto space-y-3"
                >
                    <span className="text-brand-600 font-bold uppercase tracking-wider text-xs">
                        {t('features.subtitle')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                        {t('features.title')}
                    </h2>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                        {t('features.description')}
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12 mt-16 items-center">
                    {/* Left: Image */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/3 relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-tr from-brand-300 to-accent-300 rounded-3xl blur-2xl opacity-40"></div>
                        <img 
                            src="/slider_1_office_1784124991747.png" 
                            alt="Professional Environment" 
                            className="relative w-full h-auto object-cover rounded-3xl shadow-2xl ring-1 ring-white/50" 
                        />
                    </motion.div>

                    {/* Right: Grid */}
                    <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-xl"
                            >
                                {/* Icon circle */}
                                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 mb-4 shadow-sm border border-brand-200/50">
                                    {feature.icon}
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                    {feature.title}
                                </h3>

                                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Features;