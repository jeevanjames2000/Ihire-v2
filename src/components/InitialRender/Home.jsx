import BrowseCategories from "./BrowseCategories";
import Header from "./Header";
import Hero from "./Hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <BrowseCategories />
      {}
    </div>
  );
}