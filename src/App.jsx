import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import RoleSelection from "./pages/RoleSelection";
import CandidateScreening from "./pages/CandidateScreening";
import OurUsers from "./pages/OurUsers";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />

      <Route path="/candidate-screening" element={<CandidateScreening />} />

      <Route path="/interview" element={<Interview />} />

      <Route path="/role" element={<RoleSelection />} />

      <Route path="/results" element={<Results />} />
      <Route path="/our-users" element={<OurUsers />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />

    </Routes>
  );
}

export default App;