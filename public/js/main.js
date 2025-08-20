/* ==========================
   Hanko Powerteam – Main JS
   ========================== */

/**
 * Write the current year into any element with id="y"
 */
function initYear() {
  const el = document.getElementById("y");
  if (el) el.textContent = new Date().getFullYear();
}

/**
 * Instagram feed
 * - Fetches from /api/instagram
 * - Renders cards (photo/video/carousel)
 * - Falls back to mock tiles if API isn’t ready
 */
async function initInstagramFeed() {
  const grid = document.getElementById("ig-grid");
  if (!grid) return; // no feed on this page

  try {
    const items = await fetchInstagramItems("/api/instagram");
    if (!Array.isArray(items) || items.length === 0) throw new Error("No items");

    // Clear skeletons
    grid.innerHTML = "";

    // Render real posts
    items.forEach((item) => grid.appendChild(createInstagramCard(item)));
  } catch (err) {
    console.warn("Instagram not ready, showing mock tiles:", err?.message);
    renderMockTiles(grid, 9);
  }
}

/**
 * Fetch posts from the server endpoint.
 * @param {string} endpoint
 * @returns {Promise<Array>} items
 */
async function fetchInstagramItems(endpoint) {
  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${detail}`);
  }
  const data = await res.json();
  return data.items || [];
}

/**
 * Build a single Instagram card element for the grid.
 * @param {object} item
 * @returns {HTMLElement} anchor card
 */
function createInstagramCard(item) {
  const { type, permalink, url, caption = "", children = [] } = item;

  // Anchor wrapper
  const card = document.createElement("a");
  card.className = "ig-card";
  card.href = permalink;
  card.target = "_blank";
  card.rel = "noopener";

  // Badge (Photo/Video/Carousel)
  const badge = document.createElement("div");
  badge.className = "ig-badge";
  badge.textContent =
    type === "VIDEO" ? "Video" : type === "CAROUSEL_ALBUM" ? "Carousel" : "Photo";

  // Choose preview media
  const previewUrl =
    type === "CAROUSEL_ALBUM" && Array.isArray(children) && children.length
      ? children[0].url || url
      : url;

  // Media element
  const isVideo = type === "VIDEO";
  const media = document.createElement(isVideo ? "video" : "img");
  media.className = "ig-media";
  media.src = previewUrl;

  if (isVideo) {
    media.muted = true;
    media.autoplay = true;
    media.loop = true;
    media.playsInline = true;
  } else {
    media.alt = (caption || "Instagram photo").slice(0, 140);
  }

  // Caption (shown on hover)
  const cap = document.createElement("div");
  cap.className = "ig-cap";
  cap.textContent = caption.slice(0, 100);

  // Assemble
  card.appendChild(media);
  card.appendChild(badge);
  card.appendChild(cap);

  return card;
}

/**
 * Render placeholder tiles if API fails or isn’t configured.
 * @param {HTMLElement} grid
 * @param {number} count
 */
function renderMockTiles(grid, count = 9) {
  grid.innerHTML = "";
  const urls = Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/ig${i}/600/600`);

  urls.forEach((src) => {
    const card = document.createElement("a");
    card.href = "https://instagram.com/hankopowerteam";
    card.target = "_blank";
    card.className = "ig-card";

    const img = document.createElement("img");
    img.src = src;
    img.className = "ig-media";
    img.alt = "Mock Instagram";

    const badge = document.createElement("div");
    badge.className = "ig-badge";
    badge.textContent = "Photo";

    const cap = document.createElement("div");
    cap.className = "ig-cap";
    cap.textContent = "Competition prep • Deadlift day";

    card.appendChild(img);
    card.appendChild(badge);
    card.appendChild(cap);
    grid.appendChild(card);
  });
}

/* ========== Boot ========== */
document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initInstagramFeed();
});
