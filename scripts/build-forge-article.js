// Build a full static HTML article page for makemysandbox.com from a Forge
// "My Website" webhook payload. Used by MailForge forge-publish-sandbox-group.
// Node zero-dep. Exports buildArticleHtml(payload) -> string.

"use strict";

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildArticleHtml(payload) {
  const slug = String(payload.slug || "").toLowerCase();
  const title = String(payload.title || "Untitled");
  const excerpt = String(payload.excerpt || (payload.meta && payload.meta.description) || "");
  const hero = typeof payload.heroImageUrl === "string" ? payload.heroImageUrl : "";
  const publishedAt = payload.publishedAt || new Date().toISOString();
  const bodyHtml = typeof payload.html === "string" && payload.html.trim() ? payload.html : "";
  const bodyMd = typeof payload.markdown === "string" ? payload.markdown : "";
  const body = bodyHtml
    ? bodyHtml
    : bodyMd
      ? "<pre class=\"article-md-fallback\">" + esc(bodyMd) + "</pre>"
      : "<p>No body provided.</p>";

  const pageUrl = "https://makemysandbox.com/articles/" + slug + ".html";
  const ogImage = (payload.meta && payload.meta.ogImage) || hero || "";
  const dateLabel = fmtDate(publishedAt);

  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <meta name="color-scheme" content="light" />',
    '  <meta name="theme-color" content="#FFFFFF" />',
    "",
    "  <title>" + esc(title) + " | Sandbox Group LLC</title>",
    '  <meta name="description" content="' + esc(excerpt) + '" />',
    '  <link rel="canonical" href="' + esc(pageUrl) + '" />',
    '  <meta name="forge-source" content="forge" />',
    "",
    '  <meta property="og:title" content="' + esc(title) + '" />',
    '  <meta property="og:description" content="' + esc(excerpt) + '" />',
    '  <meta property="og:url" content="' + esc(pageUrl) + '" />',
    '  <meta property="og:type" content="article" />',
    ogImage ? '  <meta property="og:image" content="' + esc(ogImage) + '" />' : "",
    "",
    '  <link rel="preconnect" href="https://fonts.googleapis.com" />',
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
    "  <link",
    '    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap"',
    '    rel="stylesheet"',
    "  />",
    '  <link rel="stylesheet" href="/styles.css" />',
    "</head>",
    "<body>",
    '  <header class="nav" role="banner">',
    '    <div class="nav__inner">',
    '      <a href="/" class="nav__logo" aria-label="Sandbox Group LLC home">',
    '        <div class="nav__logo-mark" aria-hidden="true"><span>SG</span></div>',
    '        <span class="nav__wordmark">Sandbox Group</span>',
    "      </a>",
    '      <nav aria-label="Primary navigation">',
    '        <ul class="nav__links">',
    '          <li><a href="/#philosophy">Philosophy</a></li>',
    '          <li><a href="/#gtm">GTM</a></li>',
    '          <li><a href="/#xm">XM</a></li>',
    '          <li><a href="/#forge">FORGE</a></li>',
    '          <li><a href="/#intelligence">Intelligence</a></li>',
    '          <li><a href="/articles/">Articles</a></li>',
    "        </ul>",
    "      </nav>",
    "    </div>",
    "  </header>",
    "",
    "  <main>",
    '    <article class="article" data-forge-source="forge">',
    '      <header class="article__header container">',
    '        <p class="article__kicker"><a href="/articles/">Articles</a></p>',
    '        <h1 class="article__title">' + esc(title) + "</h1>",
    dateLabel
      ? '        <time class="article__date" datetime="' +
        esc(publishedAt) +
        '">' +
        esc(dateLabel) +
        "</time>"
      : "",
    excerpt ? '        <p class="article__dek">' + esc(excerpt) + "</p>" : "",
    "      </header>",
    hero && /^https?:\/\//i.test(hero)
      ? '      <div class="article__hero container"><img src="' + esc(hero) + '" alt="" /></div>'
      : "",
    '      <div class="article__body container">',
    "        " + body,
    "      </div>",
    "    </article>",
    "  </main>",
    "",
    '  <footer class="footer" role="contentinfo">',
    '    <div class="footer__inner">',
    '      <div class="footer__brand">',
    '        <span class="footer__wordmark">Sandbox Group LLC</span>',
    '        <p class="footer__tagline">',
    "          Designing, running, and building revenue systems for organizations",
    "          that refuse to be decorative.",
    "        </p>",
    "      </div>",
    '      <div class="footer__companies" aria-label="Sandbox Group companies">',
    '        <a href="https://sandbox-gtm.com/" target="_blank" rel="noopener noreferrer">Sandbox GTM</a>',
    '        <a href="https://sandbox-xm.com/" target="_blank" rel="noopener noreferrer">Sandbox XM</a>',
    '        <a href="https://forge-bysandbox.tech/" target="_blank" rel="noopener noreferrer">FORGE by Sandbox</a>',
    '        <a href="https://forgeintelligence.ai/" target="_blank" rel="noopener noreferrer">Forge Intelligence</a>',
    "      </div>",
    "    </div>",
    '    <div class="footer__bottom">',
    '      <p class="footer__copy">© 2026 Sandbox Group LLC. All rights reserved.</p>',
    '      <p class="footer__copy">GTM · XM · FORGE · Intelligence</p>',
    "    </div>",
    "  </footer>",
    "</body>",
    "</html>",
    "",
  ]
    .filter((line) => line !== null && line !== undefined)
    .join("\n");
}

module.exports = { buildArticleHtml };

if (require.main === module) {
  const fs = require("fs");
  const path = require("path");
  const input = process.argv[2];
  if (!input) {
    console.error("usage: node scripts/build-forge-article.js <payload.json>");
    process.exit(1);
  }
  const payload = JSON.parse(fs.readFileSync(path.resolve(input), "utf8"));
  process.stdout.write(buildArticleHtml(payload));
}
