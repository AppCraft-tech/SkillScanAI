import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import CTA from "../components/home/CTA";
import Footer from "../components/layout/Footer";
import AIDemo from "../components/home/AIDemo";
import ImageSlider from "../components/common/ImageSlider";

function Home() {
    return (
        <>
            <Navbar />
            <ImageSlider />
            <Hero />
            <Stats />
            <Features />
            <HowItWorks />
            <AIDemo />
            <CTA />
            <Footer />
        </>
    );
}

export default Home;