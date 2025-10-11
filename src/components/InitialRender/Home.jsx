import BrowseCategories from "./BrowseCategories";
import Header from "./Header";
import Hero from "./Hero";
import FeaturedJobs from "./FeaturedJobs"
import BrowseCompanies from "./BrowseCompanies"
import Footer from "@/footer/Footer";

export default function Home() {
  return (
    <div className="min-h-screen overflow-y-auto custom-scrollbar">
      <Header />
      <Hero />
      <FeaturedJobs/>
      <BrowseCategories />
      <BrowseCompanies/>
      <Footer/>
    </div>
  );
}