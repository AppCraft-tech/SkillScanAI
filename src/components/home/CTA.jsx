import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function CTA() {
    const { t } = useTranslation();
    return (
        <section className="bg-slate-50 py-20 relative overflow-hidden border-t border-slate-100">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="relative glass-dark border border-brand-400/30 rounded-3xl p-10 sm:p-16 text-center shadow-2xl overflow-hidden animate-slide-up">
                    <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                            {t('cta.subtitle')}
                        </span>
                        
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                            {t('cta.title')}
                        </h2>
                        
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            {t('cta.description')}
                        </p>

                        <div className="pt-6">
                            <Link to="/interview">
                                <button className="bg-gradient-brand hover:opacity-90 text-white font-bold text-sm px-10 py-4 rounded-xl shadow-lg shadow-brand-500/25 transition-all duration-200 hover:-translate-y-1 inline-flex items-center gap-2">
                                    <FaPlay className="text-[10px]" /> {t('cta.btn')}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTA;