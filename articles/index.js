(function () {
  var root = document.getElementById("articles-list");
  if (!root) return;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "\u0026amp;")
      .replace(/</g, "\u0026lt;")
      .replace(/>/g, "\u0026gt;")
      .replace(/"/g, "\u0026quot;");
  }

  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  fetch("/articles/manifest.json", { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("manifest " + r.status);
      return r.json();
    })
    .then(function (items) {
      if (!Array.isArray(items) || !items.length) {
        root.innerHTML =
          '<p class="articles-list__empty">No articles published yet.</p>';
        return;
      }
      var sorted = items.slice().sort(function (a, b) {
        return String(b.publishedAt || "").localeCompare(
          String(a.publishedAt || "")
        );
      });
      root.innerHTML = sorted
        .map(function (item) {
          var slug = esc(item.slug || "");
          var title = esc(item.title || slug);
          var excerpt = esc(item.excerpt || "");
          var date = esc(fmtDate(item.publishedAt));
          return (
            '<article class="article-card">' +
            '<a class="article-card__link" href="/articles/' +
            slug +
            '.html">' +
            (date
              ? '<time class="article-card__date" datetime="' +
                esc(item.publishedAt) +
                '">' +
                date +
                "</time>"
              : "") +
            '<h2 class="article-card__title">' +
            title +
            "</h2>" +
            (excerpt
              ? '<p class="article-card__excerpt">' + excerpt + "</p>"
              : "") +
            '<span class="article-card__cta">Read <span aria-hidden="true">→</span></span>' +
            "</a></article>"
          );
        })
        .join("");
    })
    .catch(function () {
      root.innerHTML =
        '<p class="articles-list__empty">Articles are not available right now.</p>';
    });
})();
