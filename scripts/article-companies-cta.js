// Shared end-of-article CTA markup for child company sites.
// Used by scripts/build-forge-article.js and backfill tooling.

"use strict";

const COMPANIES = [
  {
    name: "Sandbox GTM",
    category: "Go-To-Market",
    href: "https://sandbox-gtm.com/",
    blurb:
      "Event revenue intelligence: targeting, messaging, channel weight, and CRM pipeline you can attribute.",
    cta: "Visit sandbox-gtm.com",
  },
  {
    name: "Sandbox XM",
    category: "Experience Marketing",
    href: "https://sandbox-xm.com/",
    blurb:
      "Enterprise B2B experiences executives remember. Pipeline is the outcome. The experience is the engine.",
    cta: "Visit sandbox-xm.com",
  },
  {
    name: "FORGE by Sandbox",
    category: "Product Engineering",
    href: "https://forge-bysandbox.tech/",
    blurb:
      "Custom tools where off-the-shelf SaaS leaves a gap. Lightweight, CRM-synced, embedded in your stack.",
    cta: "Visit forge-bysandbox.tech",
  },
  {
    name: "Forge Intelligence",
    category: "Brand Intelligence",
    href: "https://forgeintelligence.ai/",
    blurb:
      "An eight-stage content intelligence pipeline. Strategy feedback before you publish, not after.",
    cta: "Visit forgeintelligence.ai",
  },
];

function buildArticleCompaniesCta() {
  const cards = COMPANIES.map(function (c) {
    return [
      '    <a class="article-cta__card" href="' +
        c.href +
        '" target="_blank" rel="noopener noreferrer">',
      '      <span class="article-cta__category">' + c.category + "</span>",
      '      <span class="article-cta__name">' + c.name + "</span>",
      '      <p class="article-cta__blurb">' + c.blurb + "</p>",
      '      <span class="article-cta__link">' +
        c.cta +
        ' <span aria-hidden="true">→</span></span>',
      "    </a>",
    ].join("\n");
  }).join("\n");

  return [
    '<aside class="article-cta" aria-labelledby="article-cta-title">',
    '  <span class="article-cta__eyebrow">Sandbox Group</span>',
    '  <h2 id="article-cta-title" class="article-cta__title">Continue across the companies</h2>',
    '  <p class="article-cta__lede">',
    "    Sandbox Group is the parent. These are the operating companies.",
    "    Pick the lane that matches the problem you are solving next.",
    "  </p>",
    '  <div class="article-cta__grid">',
    cards,
    "  </div>",
    "</aside>",
  ].join("\n");
}

module.exports = { buildArticleCompaniesCta, COMPANIES };
