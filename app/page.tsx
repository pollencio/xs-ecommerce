import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedProductsSection } from "@/components/sections/FeaturedProductsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { RecentPostsSection } from "@/components/sections/RecentPostsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import {
  getFeaturedProducts,
  getLandingPage,
  getRecentPosts,
  getSiteSettings,
} from "@/lib/sanity/queries";
import { websiteJsonLd } from "@/lib/seo";

export default async function HomePage() {
  const [landing, settings, featuredProducts, recentPosts] = await Promise.all([
    getLandingPage(),
    getSiteSettings(),
    getFeaturedProducts(4),
    getRecentPosts(3),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            websiteJsonLd({ name: settings?.storeName || "Tu Tienda" })
          ),
        }}
      />

      <HeroSection landing={landing} />
      <FeaturedProductsSection products={featuredProducts} />
      <AboutSection landing={landing} />
      <RecentPostsSection posts={recentPosts} />
      <ContactSection landing={landing} settings={settings} />
    </>
  );
}
