import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../utils/blogData';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useTranslation } from 'react-i18next';

function Blog() {
    const { t } = useTranslation();
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pb-20 pt-16">
                {/* Header Section */}
                <div className="bg-accent-800 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <p className="text-sm text-slate-300 mb-2">
                        <Link to="/" className="hover:text-white transition-colors">{t('navbar.home', 'Home')}</Link> / {t('navbar.blog', 'Blog')}
                    </p>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{t('blog.title', 'Interview & Career Insights')}</h1>
                    <p className="text-lg text-slate-300 max-w-2xl">
                        {t('blog.subtitle', 'Expert advice, tips, and strategies to help you ace your interviews and advance your career.')}
                    </p>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <motion.div 
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                        >
                            <Link to={`/blog/${post.id}`} className="block overflow-hidden h-48 relative">
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {post.category}
                                </div>
                            </Link>
                            
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center text-sm text-slate-500 mb-3 gap-3">
                                    <span>{post.date}</span>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                </div>
                                <Link to={`/blog/${post.id}`} className="group">
                                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                </Link>
                                <p className="text-slate-600 mb-6 line-clamp-3 flex-grow text-sm leading-relaxed">
                                    {post.excerpt}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                            {post.author.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{post.author}</span>
                                    </div>
                                    <Link 
                                        to={`/blog/${post.id}`} 
                                        className="text-brand-600 font-bold hover:text-brand-700 transition-colors inline-flex items-center gap-1 group"
                                    >
                                        {t('blog.readMore', 'Read More')} <span className="text-lg leading-none transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default Blog;
