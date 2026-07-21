import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

function OurUsers() {
    const { t } = useTranslation();

    const users = [
        {
            title: t('ourUsers.students.title', 'Students and recent graduates'),
            description: t('ourUsers.students.desc', 'Practice answering tailored interview questions and gain confidence for your job search.'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v6m-3-3h6" />
                </svg>
            ),
        },
        {
            title: t('ourUsers.jobSeekers.title', 'Job seekers and Candidates'),
            description: t('ourUsers.jobSeekers.desc', 'Practice answering common interview questions and improve your performance.'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            title: t('ourUsers.remoteWorkers.title', 'Remote Workers and Freelancers'),
            description: t('ourUsers.remoteWorkers.desc', 'Ace virtual job interviews with AI-generated, tailored questions and personalized feedback.'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            title: t('ourUsers.companies.title', 'Companies and HR Teams'),
            description: t('ourUsers.companies.desc', 'Streamline your hiring process with AI-driven interview assessments and objective candidate evaluations.'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto animate-fade-in">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-800 sm:text-5xl">
                            {t('ourUsers.mainTitle', 'Who can benefit from SkillScan AI?')}
                        </h2>
                        <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
                            {t('ourUsers.subtitle', "Whether you're starting your career, seeking new opportunities, or looking to hire the best talent, we have the tools you need.")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {users.map((user, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex-shrink-0 w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                    {user.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-4 h-14 flex items-center justify-center">
                                    {user.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {user.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default OurUsers;
