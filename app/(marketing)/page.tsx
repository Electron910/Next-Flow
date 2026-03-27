import { HeroSection } from "@/components/landing/HeroSection";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { BrandsSection } from "@/components/landing/BrandsSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { SimpleUISection } from "@/components/landing/SimpleUISection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ShowcaseSection />
      <StatsSection />
      <BrandsSection />
      <UseCasesSection />
      <SimpleUISection />
    </>
  );
}