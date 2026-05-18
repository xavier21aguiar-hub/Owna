import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Categories from "./pages/Categories";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/collections" element={<Categories />} />
        <Route path="/shop" element={<Categories />} />
        <Route path="/new-in" element={<Categories />} />
        <Route path="/about" element={<Categories />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
