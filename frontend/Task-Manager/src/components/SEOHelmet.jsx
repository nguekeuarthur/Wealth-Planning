import React from "react";
import { Helmet } from "react-helmet-async";
import { SEO_KEYWORDS, DEFAULT_SEO } from "../utils/seoConfig";

/**
 * Composant SEO principal
 */
const SEOHelmet = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogType = "website",
  ogImage,
  noIndex = false,
  structuredData,
  language = "fr",
}) => {
  // Combine custom keywords with default SEO keywords
  const allKeywords = [
    ...keywords,
    ...SEO_KEYWORDS.primary,
    ...SEO_KEYWORDS.geolocalises,
  ].join(", ");

  const fullTitle = title
    ? `${title} | Geneva Wealth Partners - Conseil Patrimonial Genève`
    : DEFAULT_SEO.title;

  const finalDescription = description || DEFAULT_SEO.description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content="Geneva Wealth Partners" />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:site_name" content="Geneva Wealth Partners" />
      <meta property="og:locale" content={language === "fr" ? "fr_FR" : language === "en" ? "en_US" : language === "de" ? "de_CH" : "it_IT"} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="CH-GE" />
      <meta name="geo.placename" content="Genève" />
      <meta name="geo.position" content="46.2044;6.1432" />
      <meta name="ICBM" content="46.2044, 6.1432" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHelmet;
