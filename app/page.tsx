import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Destinations from "@/components/Destinations";
import TopTours from "@/components/TopTours";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Destinations />
      <TopTours />
      <Testimonials />
      <Footer />
    </main>
  );
}
