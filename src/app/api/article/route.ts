import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const html = await res.text();

    // Extract OG image
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
    const ogImage = ogImageMatch?.[1] ?? null;

    // Extract subtitle / OG description
    const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/);
    const description = ogDescMatch?.[1] ?? null;

    // Extract the article body — Substack puts it in <div class="body markup">
    const bodyMarkupMatch = html.match(
      /<div[^>]*class="[^"]*\bbody\b[^"]*\bmarkup\b[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?=<div|<\/section|<footer)/
    );

    // Fallback: grab the largest <article> block
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);

    const content = bodyMarkupMatch?.[1] ?? articleMatch?.[1] ?? null;

    return NextResponse.json({ content, ogImage, description });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
