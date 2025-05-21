import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import SearchSection from './components/SearchSection';
import FeaturedCars from './components/FeaturedCars';
import LoanApplicationForm from './components/LoanApplicationForm';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <div>
      <Header />
      <HeroBanner />
      <SearchSection />
      <FeaturedCars />
      <LoanApplicationForm />
      <Footer />
    </div>
  );
} 