import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeatureSection from '@/components/home/FeatureSection';
import CareerJourneySection from '@/components/home/CareerJourneySection';
import CTASection from '@/components/home/CTASection';
import ChatBot from '@/chatbot/ChatBot';

export default function Home() {
  return (
    <div className="min-h-screen text-gray-900 bg-white">
      <HeroSection />
      <StatsSection />
      <FeatureSection />
      <CareerJourneySection />
      <CTASection />
      <ChatBot />
    </div>
  );
}