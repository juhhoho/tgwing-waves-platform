
import Navbar from "@/components/Navbar";
import Header from "@/components/about/Header";
import Vision from "@/components/about/Vision";
import Activities from "@/components/about/Activities";
import Gallery from "@/components/about/Gallery";
import FAQ from "@/components/about/FAQ";
import Contact from "@/components/about/Contact";

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="relative">
        <div className="container mx-auto px-4 pt-32 pb-16">
          <Header />
          <Vision />
          <Activities />
          <Gallery />
          <FAQ />
          <Contact />
        </div>
      </div>
    </div>
  );
};

export default About;
