import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import TieLogo from "../common/TieLogo";
import LanguageSelector from "../common/LanguageSelector";
import { useTranslation } from 'react-i18next';

function Navbar() {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        `relative py-2 px-1 text-sm font-medium transition duration-200 hover:text-brand-600 ${isActive
            ? "text-brand-600 font-semibold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-brand-600 after:rounded-full"
            : "text-slate-600"
        }`;

    const mobileNavLinkClass = ({ isActive }) =>
        `text-sm font-medium py-2 px-3 rounded-lg transition duration-150 ${isActive
            ? "text-brand-600 bg-brand-50 font-semibold"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
        }`;

    return (
        <header className="sticky top-0 z-50 glass border-b border-slate-200/50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <TieLogo className="w-10 h-10 text-brand-600 group-hover:scale-105 transition-transform duration-250" />
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors duration-200">
                            SkillScan AI
                        </h1>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                            AI Interview and Prep Platform
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation - Clean, exactly 6 pages */}
                <nav className="hidden md:flex items-center gap-8">
                    <NavLink to="/" className={navLinkClass}>
                        {t('navbar.home', 'Home')}
                    </NavLink>
                    <NavLink to="/about" className={navLinkClass}>
                        {t('navbar.about', 'About')}
                    </NavLink>
                    <NavLink to="/interview" className={navLinkClass}>
                        {t('navbar.interview', 'Interview')}
                    </NavLink>
                    <NavLink to="/results" className={navLinkClass}>
                        {t('navbar.results', 'Results')}
                    </NavLink>
                    <NavLink to="/our-users" className={navLinkClass}>
                        {t('navbar.ourUsers', 'Our Users')}
                    </NavLink>
                    <NavLink to="/blog" className={navLinkClass}>
                        {t('navbar.blog', 'Blog')}
                    </NavLink>
                    <LanguageSelector />
                </nav>

                <div className="md:hidden flex items-center gap-4">
                    <LanguageSelector />
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-slate-600 hover:text-slate-800 focus:outline-none p-1.5"
                    >
                        {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden glass border-t border-slate-200/50 absolute top-full left-0 right-0 py-4 px-6 shadow-xl flex flex-col gap-2 animate-fadeIn">
                    <NavLink
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className={mobileNavLinkClass}
                    >
                        {t('navbar.home', 'Home')}
                    </NavLink>
                    <NavLink
                        to="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className={mobileNavLinkClass}
                    >
                        {t('navbar.about', 'About')}
                    </NavLink>
                    <NavLink
                        to="/interview"
                        onClick={() => setMobileMenuOpen(false)}
                        className={mobileNavLinkClass}
                    >
                        {t('navbar.interview', 'Interview')}
                    </NavLink>
                    <NavLink
                        to="/results"
                        onClick={() => setMobileMenuOpen(false)}
                        className={mobileNavLinkClass}
                    >
                        {t('navbar.results', 'Results')}
                    </NavLink>
                    <NavLink
                        to="/our-users"
                        onClick={() => setMobileMenuOpen(false)}
                        className={mobileNavLinkClass}
                    >
                        {t('navbar.ourUsers', 'Our Users')}
                    </NavLink>
                    <NavLink
                        to="/blog"
                        onClick={() => setMobileMenuOpen(false)}
                        className={mobileNavLinkClass}
                    >
                        {t('navbar.blog', 'Blog')}
                    </NavLink>
                </div>
            )}
        </header>
    );
}

export default Navbar;