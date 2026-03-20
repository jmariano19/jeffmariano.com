import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CaseStudies from "@/components/CaseStudies";
import Methodology from "@/components/Methodology";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream max-w-[1440px] mx-auto">
      <Nav />
      <Hero />
      <CaseStudies />
      <Methodology />
      <Footer />
    </div>
  );
}
