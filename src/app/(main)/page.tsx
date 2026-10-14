import BrowseGenre from "./components/BrowseGenre";
import CaseStudies from "./components/CaseStudies";
import ClientTestimonials from "./components/ClientTestimonials";
import ConsultationBanner from "./components/ConsultationBanner";
import FAQs from "./components/FAQs";
import Hero from "./components/Hero";
import LatestAddition from "./components/LatestAddition";
import LatestMediaStories from "./components/LatestMediaStories";
import PopularBlogPosts from "./components/PopularBlogPosts";
import PreFooterCTA from "./components/PreFooterCTA";
import ServicesStack from "./components/ServicesStack";
import AgencyPartner from "./components/AgencyPartner";
import HowItWorks from "./components/HowItWorks";
import EverythingYouNeed from "./components/EverytingYouNeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Hero />
      <LatestMediaStories />
      <BrowseGenre />
      <AgencyPartner />
      <ServicesStack />
      <LatestAddition />
      <ConsultationBanner />
      <PopularBlogPosts />
      <CaseStudies />
      <ClientTestimonials />
      <EverythingYouNeed />
      <HowItWorks />
      <FAQs />
      <PreFooterCTA />
    </div>
  );
}