import { siteConfig } from "@/config/site";
import { articles } from "@/data/articles";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = siteConfig.url;
  const items = [...articles]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .map(
      (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${base}/blog/${a.slug}</link>
      <guid>${base}/blog/${a.slug}</guid>
      <description>${escapeXml(a.description)}</description>
      <category>${escapeXml(a.category)}</category>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Blog</title>
    <link>${base}/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>fr-FR</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
