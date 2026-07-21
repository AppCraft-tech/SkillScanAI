import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function ImageSlider() {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const slides = [
        {
            id: 1,
            src: '/slider_1_office_1784124991747.png',
            title: t('slider.slide1_title'),
            subtitle: t('slider.slide1_subtitle')
        },
        {
            id: 2,
            src: '/slider_2_interview_1784125002190.png',
            title: t('slider.slide2_title'),
            subtitle: t('slider.slide2_subtitle')
        },
        {
            id: 3,
            src: '/slider_4_success_1784125024154.png',
            title: t('slider.slide3_title'),
            subtitle: t('slider.slide3_subtitle')
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
        }, 4000); // Slide every 4 seconds
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="w-full bg-slate-900 overflow-hidden relative" style={{ height: '550px' }}>
            {slides.map((slide, index) => {
                const isActive = index === currentIndex;
                const isPast = index < currentIndex;
                const isFuture = index > currentIndex;
                
                let transformClass = "translate-x-full";
                if (isActive) transformClass = "translate-x-0";
                else if (isPast || (currentIndex === 0 && index === slides.length - 1)) transformClass = "-translate-x-full";
                else if (currentIndex === slides.length - 1 && index === 0) transformClass = "translate-x-full";

                return (
                    <div 
                        key={slide.id}
                        className={`absolute inset-0 w-full h-full transition-transform duration-1000 ease-in-out ${transformClass}`}
                    >
                        <img 
                            src={slide.src} 
                            alt={slide.title} 
                            className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center w-full px-4">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2 animate-slide-up">
                                {slide.title}
                            </h2>
                            <p className="text-lg md:text-xl text-slate-200 drop-shadow-md animate-fade-in" style={{animationDelay: '300ms'}}>
                                {slide.subtitle}
                            </p>
                        </div>
                    </div>
                );
            })}
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${idx === currentIndex ? 'bg-teal-400' : 'bg-white/40 hover:bg-white/60'}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default ImageSlider;
