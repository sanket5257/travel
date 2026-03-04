import Hero from "@/components/Hero";
import About from "@/components/About";
import Destinations from "@/components/Destinations";
import TopTours from "@/components/TopTours";
import Blog from "@/components/Blog";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Whyus from "@/components/Whyus";
import TrekkingLeaders from "@/components/Experts";

export default function Home() {
  return (
    <main>

      <Hero />
      <TopTours />
      <About />
      
      <Whyus />
        <TrekkingLeaders />
      {/* <Destinations /> */}

      <Blog />
    
      <Testimonials />
      <FAQ />
      <Contact />

    </main>
  );
}
