import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUpload, FaEnvelope, FaWhatsapp, FaCommentDots, FaCheckCircle, FaTimesCircle, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { analyzeResume } from '../utils/geminiService';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ImageSlider from '../components/common/ImageSlider';
import { useTranslation } from 'react-i18next';

function CandidateScreening() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'frontend';

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [report, setReport] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

    const loadScript = (url) => new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = url;
        s.onload = resolve;
        s.onerror = () => reject(new Error(`Failed to load ${url}`));
        document.head.appendChild(s);
    });

    const extractTextFromFile = (fileObj) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        const ext = fileObj.name.split('.').pop().toLowerCase();
        if (['txt', 'json', 'md'].includes(ext)) {
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read text file.'));
            reader.readAsText(fileObj);
        } else if (ext === 'pdf') {
            reader.onload = async e => {
                try {
                    const typed = new Uint8Array(e.target.result);
                    if (!window.pdfjsLib) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js');
                    const lib = window.pdfjsLib;
                    lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
                    const pdf = await lib.getDocument({ data: typed }).promise;
                    let text = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        text += content.items.map(item => item.str).join(' ') + '\n';
                    }
                    resolve(text);
                } catch (err) {
                    reject(new Error('Failed to parse PDF: ' + err.message));
                }
            };
            reader.onerror = () => reject(new Error('Failed to load PDF binary data.'));
            reader.readAsArrayBuffer(fileObj);
        } else {
            reject(new Error(`Unsupported file type (.${ext}). Please upload .txt or .pdf.`));
        }
    });

    const handleFileChange = async (fileObj) => {
        if (!fileObj) return;
        setFile(fileObj);
        setError('');
        setLoading(true);
        setReport(null);

        try {
            const text = await extractTextFromFile(fileObj);
            if (text?.trim().length > 100) {
                // Call gemini service to analyze
                const result = await analyzeResume(text, "", apiKey);
                setReport(result);
            } else {
                throw new Error('Extracted text is too short. Please check file contents.');
            }
        } catch (err) {
            setError(err.message || 'Failed to analyze CV.');
            setFile(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) await handleFileChange(e.dataTransfer.files[0]);
    };

    // Passed if ATS score is greater than 60
    const isPassed = report ? report.atsScore >= 60 : false;

    return (
        <>
            <Navbar />
            <ImageSlider />
            <div className="min-h-screen bg-slate-50 pt-16 pb-24 px-6">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 p-8 text-center text-white animate-fade-in">
                    <h1 className="text-3xl font-bold mb-2">{t('candidate.resumeTitle', 'Resume')}</h1>
                    <p className="text-slate-300">{t('candidate.resumeDesc', 'Upload your CV to unlock the interview, or proceed without one.')}</p>
                </div>

                <div className="p-8">
                    {!report && !loading && (
                        <div 
                            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragActive ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-teal-400'}`}
                            onDragEnter={handleDrag} onDragOver={handleDrag}
                            onDragLeave={handleDrag} onDrop={handleDrop}
                        >
                            <input
                                type="file" id="cv-upload" className="hidden"
                                accept=".txt,.pdf"
                                onChange={e => handleFileChange(e.target.files[0])}
                            />
                            <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center">
                                <FaUpload className="text-5xl text-slate-400 mb-4" />
                                <h3 className="text-xl font-semibold text-slate-800 mb-1">{t('candidate.uploadCV', 'Upload your CV')}</h3>
                                <p className="text-sm text-slate-500">{t('candidate.uploadFormat', 'PDF or TXT up to 10 MB')}</p>
                            </label>
                            {error && (
                                <p className="mt-4 text-red-500 font-medium">{error}</p>
                            )}

                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <p className="text-slate-500 mb-3">{t('candidate.noResume', "Don't have a resume ready?")}</p>
                                <button 
                                    onClick={() => navigate('/role?flow=no-resume')}
                                    className="text-brand-600 font-semibold hover:text-brand-700 hover:underline"
                                >
                                    {t('candidate.interviewWithout', 'Interview without Resume')} &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                            <FaSpinner className="text-5xl text-brand-500 animate-spin mb-6" />
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('candidate.analyzing', 'Analyzing Resume...')}</h3>
                            <p className="text-slate-500">{t('candidate.analyzingDesc', 'Our AI is parsing your experience and skills.')}</p>
                        </div>
                    )}

                    {report && (
                        <div className="text-center">
                            <div className="mb-8">
                                {isPassed ? (
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                                        <FaCheckCircle className="text-5xl text-green-600" />
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                                        <FaTimesCircle className="text-5xl text-red-600" />
                                    </div>
                                )}
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                    {isPassed ? t('candidate.congrats', 'Congratulations!') : t('candidate.notSelected', 'Not Selected')}
                               </h2>
                                <p className="text-slate-600 mb-6">
                                    {t('candidate.atsScore', 'Your ATS Score:')} <span className="font-bold text-lg">{report.atsScore}/100</span>
                                </p>
                                <p className="text-slate-600 text-lg font-medium">
                                    {isPassed 
                                        ? t('candidate.eligible', "You are eligible for Interview!")
                                        : t('candidate.notEligible', "You are not eligible for Interview. Please practice more and improve your resume.")}
                                </p>
                            </div>

                            {isPassed && (
                                <div className="space-y-6">
                                    <div className="pt-6 border-t border-slate-100">
                                        <button 
                                            onClick={() => navigate(`/role?flow=resume&score=${report.atsScore}`)}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-brand text-white font-bold py-3 px-8 rounded-xl transition-transform shadow-md hover:-translate-y-1"
                                        >
                                            {t('candidate.nextSelectRole', 'Next: Select Role')} <FaArrowRight />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <button 
                                    onClick={() => { setReport(null); setFile(null); }}
                                    className="text-sm text-slate-500 hover:text-slate-800 underline"
                                >
                                    {t('candidate.uploadDifferent', 'Upload a different CV')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </div>
            <Footer />
        </>
    );
}

export default CandidateScreening;
