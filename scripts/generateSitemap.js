const fs = require("fs");
const path = require("path");
const axios = require("axios");

const baseUrl = "https://e-learning.jude-alexis-dy.site"; // Replace with your actual domain

// Static pages
const staticPages = [
  "",
  "/courses",
];

// Dynamic course watch pages
const getCourseUrls = async () => {
  try {
    const response = await axios.get("http://localhost:8000/courses/ids");
    const ids = response.data.ids;

    return ids.map((id) => `/courses/watch/${id}`);
  } catch (error) {
    console.error("❌ Failed to fetch course IDs:", error.message);
    return [];
  }
};

const generateSitemap = async () => {
  const dynamicPages = await getCourseUrls();
  const allPages = [...staticPages, ...dynamicPages];

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>${page === "" ? "1.0" : "0.8"}</priority>
    </url>`
    )
    .join("")}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, "../public/sitemap.xml"), sitemapContent.trim());
  console.log("✅ sitemap.xml generated.");
};

const generateRobots = () => {
  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  fs.writeFileSync(path.join(__dirname, "../public/robots.txt"), robotsContent.trim());
  console.log("✅ robots.txt generated.");
};

// Run both
(async () => {
  await generateSitemap();
  generateRobots();
})();
