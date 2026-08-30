const { buildArticleHtml } = require("./build-forge-article.js");
const fs = require("fs");
const html = buildArticleHtml({
  slug: "sample-ops-note",
  title: "Sample ops note",
  excerpt: "A short excerpt for the index card.",
  html:
    '<aside class="article-tldr"><p class="article-tldr-label">TL;DR</p><p class="article-tldr-body">Experience is the engine.</p></aside><h2>Why this matters</h2><p>Body copy here.</p>',
  publishedAt: "2026-08-30T12:00:00.000Z",
});
fs.writeFileSync("/tmp/sample-article.html", html);
if (!html.includes("Sample ops note") || !html.includes("article-tldr")) {
  console.error("smoke failed");
  process.exit(1);
}
console.log("smoke_ok bytes=" + html.length);
