import AgencyPartner from "./components/AgencyPartner";
import BrowseGenre from "./components/BrowseGenre";
import CaseStudies from "./components/CaseStudies";
import CategoryStrip from "./components/CategoryStrip";
import ClientTestimonials from "./components/ClientTestimonials";
import ConsultationBanner from "./components/ConsultationBanner";
import FAQs from "./components/FAQs";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LatestAddition from "./components/LatestAddition";
import OurClients from "./components/OurClients";
import PopularBlogPosts from "./components/PopularBlogPosts";
import PreFooterCTA from "./components/PreFooterCTA";
import TopMediaSpends from "./components/TopMediaSpends";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <CategoryStrip />
      <Hero />
      <BrowseGenre />
      <AgencyPartner />
      <TopMediaSpends />
      <LatestAddition />
      <ConsultationBanner />
      <PopularBlogPosts />
      <CaseStudies />
      <ClientTestimonials />
      <OurClients />
      <FAQs />
      <PreFooterCTA />
      <Footer />
    </div>
  );
}