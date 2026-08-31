// Inject end-of-article companies CTA into existing article HTML pages.
// Idempotent: skips files that already contain .article-cta.

"use strict";

const fs = require("fs");
const path = require("path");
const { buildArticleCompaniesCta } = require("./article-companies-cta.js");

const articlesDir = path.join(__dirname, "..", "articles");
const cta = buildArticleCompaniesCta();
const wrapped =
  '      <div class="container">\n        ' + cta + "\n      </div>\n";

const files = fs
  .readdirSync(articlesDir)
  .filter(function (f) {
    return f.endsWith(".html") && f !== "index.html";
  })
  .map(function (f) {
    return path.join(articlesDir, f);
  });

let updated = 0;
let skipped = 0;

for (const file of files) {
  let html = fs.readFileSync(file, "utf8");
  if (html.includes('class="article-cta"') || html.includes("class='article-cta'")) {
    skipped += 1;
    continue;
  }

  // Prefer placing CTA after article body, still inside <article>.
  const bodyClose = html.indexOf("</div>\n    </article>");
  if (bodyClose !== -1) {
    // Find the article__body closing div: last </div> before </article> that closes body.
    // Safer anchor: close of article body container then before </article>
    const articleClose = html.lastIndexOf("</article>");
    if (articleClose === -1) {
      console.error("no article close:", file);
      process.exit(1);
    }
    // Insert before </article>
    html =
      html.slice(0, articleClose) +
      wrapped +
      "    " +
      html.slice(articleClose);
  } else {
    const articleClose = html.lastIndexOf("</article>");
    if (articleClose === -1) {
      console.error("no article close:", file);
      process.exit(1);
    }
    html =
      html.slice(0, articleClose) +
      wrapped +
      "    " +
      html.slice(articleClose);
  }

  fs.writeFileSync(file, html);
  updated += 1;
  console.log("updated", path.basename(file));
}

console.log(
  "backfill_done updated=" + updated + " skipped=" + skipped + " total=" + files.length
);
