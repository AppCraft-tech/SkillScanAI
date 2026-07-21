import { FaRobot, FaChartLine, FaBrain, FaClock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

function Stats() {
    const { t } = useTranslation();
    const stats = [
        {
            number: "25K+",
            title: t('stats.stat1_title'),
            color: "text-brand-600 bg-brand-50 border-brand-100",
            icon: <FaRobot />
        },
        {
            number: "97%",
            title: t('stats.stat2_title'),
            color: "text-emerald-600 bg-emerald-50 border-emerald-100",
            icon: <FaChartLine />
        },
        {
            number: "120+",
            title: t('stats.stat3_title'),
            color: "text-indigo-600 bg-indigo-50 border-indigo-100",
            icon: <FaBrain />
        },
        {
            number: "24/7",
            title: t('stats.stat4_title'),
            color: "text-amber-600 bg-amber-50 border-amber-100",
            icon: <FaClock />
        },
    ];

    return (
        <section className="bg-white py-20 relative border-b border-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto space-y-3"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                        {t('stats.title')}
                    </h2>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                        {t('stats.description')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                    {stats.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card rounded-2xl p-8 text-center hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl"
                        >
                            {/* Icon Wrapper */}
                            <div className={`w-12 h-12 rounded-xl mx-auto border flex items-center justify-center text-xl mb-6 ${item.color}`}>
                                {item.icon}
                            </div>

                            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                {item.number}
                            </h3>

                            <p className="mt-3 text-sm text-slate-500 font-medium">
                                {item.title}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Stats;