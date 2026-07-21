import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ImageSlider from '../components/common/ImageSlider';
import { FaCode, FaServer, FaCogs, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function RoleSelection() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const flow = searchParams.get('flow') || 'resume';
    
    const [selectedRole, setSelectedRole] = useState(null);

    const roles = [
        { id: 'frontend', name: t('rolesel.roles.frontend', 'Frontend Developer'), icon: <FaCode className="text-3xl" /> },
        { id: 'backend', name: t('rolesel.roles.backend', 'Backend Developer'), icon: <FaServer className="text-3xl" /> },
        { id: 'other', name: t('rolesel.roles.other', 'Other Field'), icon: <FaCogs className="text-3xl" /> }
    ];

    const handleNext = () => {
        if (!selectedRole) return;
        
        let url = `/interview?role=${selectedRole}&flow=${flow}`;
        const score = searchParams.get('score');
        if (score) {
            url += `&score=${score}`;
        }
        
        navigate(url);
    };

    return (
        <>
            <Navbar />
            <ImageSlider />
            <div className="min-h-screen bg-slate-50 pt-16 pb-24 px-6 flex items-center justify-center">
                <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                    <div className="bg-slate-900 p-8 text-center text-white">
                        <h1 className="text-3xl font-bold mb-2">{t('rolesel.title')}</h1>
                        <p className="text-slate-300">{t('rolesel.subtitle')}</p>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`p-6 rounded-xl border-2 flex flex-col items-center gap-4 transition-all duration-200 ${
                                        selectedRole === role.id 
                                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className={selectedRole === role.id ? 'text-blue-600' : 'text-slate-400'}>
                                        {role.icon}
                                    </div>
                                    <span className="font-semibold">{role.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleNext}
                                disabled={!selectedRole}
                                className={`px-8 py-4 rounded-xl flex items-center gap-3 font-bold transition duration-200 ${
                                    selectedRole 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                {t('rolesel.continue_btn', 'Continue')}
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default RoleSelection;
