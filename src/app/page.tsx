import FeaturesSection from "../components/FeaturesSection/FeaturesSection";
import PricingSection from "../components/PricingSection/PricingSection";
import HowItWorksSection from "../components/HowItWorksSection/HowItWorksSection";
import TestimonialsSection from "../components/TestimonialsSection/TestimonialsSection";
import CTASection from "../components/CTASection/CTASection";
import HeroSection from "../components/HeroSection/HeroSection";
import TrustedBySection from "../components/TrustedBySection/TrustedBySection";
import RevealOnScroll from "../components/RevealOnScroll/RevealOnScroll";

export default function Home() {
  return (
    <>
     
      {/* <Navbar /> */}
      <RevealOnScroll><section id="home"><HeroSection /></section></RevealOnScroll>

      <RevealOnScroll><TrustedBySection /></RevealOnScroll>

      <RevealOnScroll><section id="features"><FeaturesSection /></section></RevealOnScroll>

      <RevealOnScroll><section id="pricing"><PricingSection /></section></RevealOnScroll>

      <RevealOnScroll><section id="how-it-works"><HowItWorksSection /></section></RevealOnScroll>

      <RevealOnScroll><TestimonialsSection /></RevealOnScroll>

      <RevealOnScroll><CTASection /></RevealOnScroll>
      {/* <Footer /> */}
    </>
  );
}
