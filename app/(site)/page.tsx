import Hero from "@/components/Hero";
import About from "@/components/About";
import Destinations from "@/components/Destinations";
import TopTours from "@/components/TopTours";
import Blog from "@/components/Blog";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Whyus from "@/components/Whyus";

export default function Home() {
  return (
    <main>

      <Hero />
      <TopTours />
      <About />
      
      <Whyus />
      {/* <Destinations /> */}

      <Blog />
      <Testimonials />
      <FAQ />
      <Contact />

    </main>
  );
}
