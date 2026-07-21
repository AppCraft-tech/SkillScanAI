import { Link } from "react-router-dom";
import {
    FaGithub,
    FaLinkedin,
    FaInstagram,
    FaEnvelope,
} from "react-icons/fa";
import TieLogo from "../common/TieLogo";
import { useTranslation } from "react-i18next";

function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="bg-slate-50 text-slate-600 border-t border-slate-200/80 py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    
                    {/* Logo & Description */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <TieLogo className="w-10 h-10 text-brand-600" />
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                                SkillScan AI
                            </h2>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            {t('footer.description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-slate-800 font-bold text-xs tracking-wider uppercase mb-5">
                            {t('footer.quick_links')}
                        </h3>
                        <ul className="space-y-3.5 text-sm">
                            <li>
                                <Link to="/" className="text-slate-500 hover:text-brand-600 transition-colors duration-150">
                                    {t('navbar.home')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-slate-500 hover:text-brand-600 transition-colors duration-150">
                                    {t('navbar.about')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-slate-500 hover:text-brand-600 transition-colors duration-150">
                                    {t('navbar.dashboard')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/interview" className="text-slate-500 hover:text-brand-600 transition-colors duration-150">
                                    {t('navbar.interview')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/results" className="text-slate-500 hover:text-brand-600 transition-colors duration-150">
                                    {t('navbar.results')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Key Features */}
                    <div>
                        <h3 className="text-slate-800 font-bold text-xs tracking-wider uppercase mb-5">
                            {t('footer.key_features')}
                        </h3>
                        <ul className="space-y-3.5 text-sm text-slate-500">
                            <li className="flex items-center gap-2">
                                <span className="text-brand-500 font-bold">✓</span> {t('footer.feature1')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-brand-500 font-bold">✓</span> {t('footer.feature2')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-brand-500 font-bold">✓</span> {t('footer.feature3')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-brand-500 font-bold">✓</span> {t('footer.feature4')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-brand-500 font-bold">✓</span> {t('footer.feature5')}
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Community */}
                    <div>
                        <h3 className="text-slate-800 font-bold text-xs tracking-wider uppercase mb-5">
                            {t('footer.contact_community')}
                        </h3>
                        <div className="space-y-4 text-sm">
                            <a 
                                href="mailto:support@SkillScanai.com" 
                                className="flex items-center gap-3 text-slate-500 hover:text-brand-600 transition-colors duration-150"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    <FaEnvelope className="text-slate-400 group-hover:text-brand-500 transition-colors" />
                                </div>
                                <span>support@SkillScanai.com</span>
                            </a>
                            <div className="flex gap-4 pt-2">
                                <a 
                                    href="#" 
                                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-600 hover:border-brand-500 hover:shadow-md transition-all duration-200"
                                >
                                    <FaGithub />
                                </a>
                                <a 
                                    href="#" 
                                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-600 hover:border-brand-500 hover:shadow-md transition-all duration-200"
                                >
                                    <FaLinkedin />
                                </a>
                                <a 
                                    href="#" 
                                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-600 hover:border-brand-500 hover:shadow-md transition-all duration-200"
                                >
                                    <FaInstagram />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Divider & Credits */}
                <div className="border-t border-slate-200 mt-14 pt-8 text-center text-xs text-slate-400">
                    <p>© {new Date().getFullYear()} SkillScan AI. {t('footer.rights')}</p>
                    <p className="mt-2 text-slate-400/80">
                        {t('footer.credits')}
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;