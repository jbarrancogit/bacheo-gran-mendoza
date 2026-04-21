import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Steps } from "@/components/sections/steps";
import { CategoriesGrid } from "@/components/sections/categories-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaBand } from "@/components/sections/cta-band";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Steps />
      <CategoriesGrid />
      <Testimonials />
      <CtaBand />
    </>
  );
}
