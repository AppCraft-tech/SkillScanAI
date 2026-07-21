import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../utils/blogData';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useTranslation } from 'react-i18next';

function BlogPost() {
    const { t } = useTranslation();
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === id);

    if (!post) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-16">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('blog.postNotFound', 'Post not found')}</h2>
                        <Link to="/blog" className="text-blue-600 hover:underline">{t('blog.returnToBlog', 'Return to Blog')}</Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Get 3 related posts (just the first 3 that aren't this one)
    const relatedPosts = blogPosts.filter(p => p.id !== id).slice(0, 3);

    const renderContent = (content) => {
        return content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.trim().startsWith('### ')) {
                return <h3 key={idx} className="text-2xl font-bold text-slate-800 mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.trim().startsWith('- **')) {
                // simple list rendering for the mockup
                const listItems = paragraph.split('\n').filter(item => item.trim().startsWith('-'));
                return (
                    <ul key={idx} className="list-disc pl-6 mb-6 space-y-2 text-slate-700 leading-relaxed">
                        {listItems.map((item, i) => {
                            const match = item.match(/- \*\*(.*?)\*\*(.*)/);
                            if (match) {
                                return (
                                    <li key={i}>
                                        <strong>{match[1]}</strong>{match[2]}
                                    </li>
                                );
                            }
                            return <li key={i}>{item.replace('- ', '')}</li>;
                        })}
                    </ul>
                );
            }
            return <p key={idx} className="mb-6 text-slate-700 leading-relaxed">{paragraph}</p>;
        });
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white pb-20 pt-16">
            {/* Header Section */}
            <div className="bg-[#0B1A3D] text-white py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <p className="text-sm text-slate-300 mb-3">
                        <Link to="/" className="hover:text-white transition-colors">{t('navbar.home', 'Home')}</Link> / 
                        <Link to="/blog" className="hover:text-white transition-colors mx-1">{t('navbar.blog', 'Blog')}</Link> / 
                        <span className="ml-1 text-slate-400">{post.title}</span>
                    </p>
                    <h1 className="text-3xl font-bold sm:text-4xl">
                        {post.title}
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 animate-fade-in">
                <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-[400px] object-cover rounded-2xl mb-10 shadow-sm"
                />

                <h1 className="text-3xl font-extrabold text-slate-900 mb-6">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-10 border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {post.date}
                    </div>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {post.readTime}
                    </div>
                </div>

                <div className="prose prose-lg max-w-none text-slate-700">
                    {renderContent(post.content)}
                </div>

                {/* Share Section (Mock) */}
                <div className="mt-12 flex items-center justify-end gap-4 border-t border-slate-100 pt-8">
                    <span className="text-slate-500 font-medium">{t('blog.share', 'Share this Post:')}</span>
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">f</div>
                        <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors">t</div>
                        <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center cursor-pointer hover:bg-blue-900 transition-colors">in</div>
                    </div>
                </div>
            </div>

            {/* Related Posts */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-slate-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-8">{t('blog.relatedPosts', 'Related Posts')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedPosts.map((rPost) => (
                        <div key={rPost.id} className="group cursor-pointer">
                            <Link to={`/blog/${rPost.id}`}>
                                <div className="h-48 overflow-hidden rounded-xl mb-4">
                                    <img 
                                        src={rPost.image} 
                                        alt={rPost.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <p className="text-sm text-slate-500 mb-2">{rPost.date}</p>
                                <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                    {rPost.title}
                                </h4>
                                <span className="text-blue-600 font-medium mt-3 inline-block">{t('blog.readMore', 'Read More')} &rarr;</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default BlogPost;
