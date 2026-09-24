import blogCategory from "./blogCategory";
import category from "./category";
import landingPage from "./landingPage";
import post from "./post";
import product from "./product";
import promoBanner from "./promoBanner";
import seo from "./seo";
import siteSettings from "./siteSettings";

export const schemaTypes = [
  // Singletons
  siteSettings,
  landingPage,
  // Collections
  promoBanner,
  category,
  product,
  blogCategory,
  post,
  // Reusable objects
  seo,
];
