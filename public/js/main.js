/* ==========================
   Hanko Powerteam – Main JS
   ========================== */

/** Current year in footer */
function initYear() {
  const el = document.getElementById("y");
  if (el) el.textContent = new Date().getFullYear();
}

/* ==========================
   Instagram feed
   ========================== */
async function initInstagramFeed() {
  const grid = document.getElementById("ig-grid");
  if (!grid) return;

  try {
    const items = await fetchInstagramItems("/api/instagram");
    if (!Array.isArray(items) || items.length === 0) throw new Error("No items");
    grid.innerHTML = "";
    items.forEach((item) => grid.appendChild(createInstagramCard(item)));
  } catch (err) {
    console.warn("Instagram not ready, showing mock tiles:", err?.message);
    renderMockTiles(grid, 9);
  }
}

async function fetchInstagramItems(endpoint) {
  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${detail}`);
  }
  const data = await res.json();
  return data.items || [];
}

function createInstagramCard(item) {
  const { type, permalink, url, caption = "", children = [] } = item;

  const card = document.createElement("a");
  card.className = "ig-card";
  card.href = permalink;
  card.target = "_blank";
  card.rel = "noopener";

  const badge = document.createElement("div");
  badge.className = "ig-badge";
  badge.textContent =
    type === "VIDEO" ? "Video" : type === "CAROUSEL_ALBUM" ? "Carousel" : "Photo";

  const previewUrl =
    type === "CAROUSEL_ALBUM" && Array.isArray(children) && children.length
      ? children[0].url || url
      : url;

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

  const cap = document.createElement("div");
  cap.className = "ig-cap";
  cap.textContent = caption.slice(0, 100);

  card.appendChild(media);
  card.appendChild(badge);
  card.appendChild(cap);

  return card;
}

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

/* ==========================
   Language (i18n)
   ========================== */
const I18N = {
  en: {
    "nav.about": "About",
    "nav.memberships": "Memberships",
    "nav.instagram": "Instagram",
    "nav.contact": "Contact",
    "cta.join": "Join Now",

    "hero.kicker": "Professional Powerlifting • Competition Prep",
    "hero.title": "Push Your Limits",
    "hero.subtitle":
      "Elite coaching, calibrated plates, competition racks, and a community built for lifters chasing PRs.",
    "hero.become": "Become a member",
    "hero.vibe": "See our training vibe",

    "about.title": "About Hangö Powerteam",
    "about.lead":
      "We are a specialist powerlifting gym focused on meet prep and strength progress. Access IPF-style equipment, experienced coaches, and a serious—but friendly—training environment.",
    "about.facilities": "Facilities",
    "about.li1": "Competition combo racks, calibrated plates, deadlift platforms",
    "about.li2": "Belt squat, specialty bars (SSB, Duffalo, Buffalo)",
    "about.li3": "Chalk & ammonia allowed; proper bar care",
    "about.li4": "Competition simulations and attempt selection help",

    "plans.title": "Memberships",
    "plans.popular": "Popular",
    "plans.12m": "12 Months",
    "plans.6m": "6 Months",
    "plans.3m": "3 Months",
    "plans.1m": "1 Month",
    "plans.dropin": "1-Time Visit",
    "plans.best": "Best value",
    "plans.247": "24/7 gym access",
    "plans.community": "Powerlifting community support",
    "plans.equip": "Competition equipment",
    "plans.events": "Community & events",
    "plans.short": "Short-term commitment",
    "plans.try": "Try us out for a month",
    "plans.daypass": "Day pass",
    "plans.full": "Full access to gym facilities",

    "training.title": "Training Environment",
    "training.lead":
      "Our gym is open 24/7 for members. No scheduled classes — just a serious training space for lifters who want to focus.",
    "training.li1": "Always competition-ready racks and calibrated plates",
    "training.li2": "Community of lifters who push each other",
    "training.li3": "Bring your coach or train solo — your choice",

    "ig.title": "Instagram",
    "ig.lead": "@hangöpowerteam • latest posts",
    "ig.view": "View on Instagram →",

    "contact.title": "Find Us",
    "contact.h3": "Hangö Powerteam",
    "contact.lead":
      "Serious training for serious lifters. Drop us a DM on Instagram or swing by for a trial session.",
    "contact.email": "Email:",

    "footer.motto": "Lift heavy. Be kind."
  },

  sv: {
    "nav.about": "Om oss",
    "nav.memberships": "Medlemskap",
    "nav.instagram": "Instagram",
    "nav.contact": "Kontakt",
    "cta.join": "Bli medlem",

    "hero.kicker": "Professionell styrkelyft • Tävlingsträning",
    "hero.title": "Pressa dina gränser",
    "hero.subtitle":
      "Elitcoaching, kalibrerade vikter, tävlingsställningar och en gemenskap för PR‑hungriga lyftare.",
    "hero.become": "Bli medlem",
    "hero.vibe": "Se vår träningsstämning",

    "about.title": "Om Hangö Powerteam",
    "about.lead":
      "Vi är ett specialiserat styrkelyftsgym med fokus på tävlingsförberedelser och styrkeutveckling. IPF‑utrustning, erfarna coacher och en seriös men vänlig miljö.",
    "about.facilities": "Utrustning",
    "about.li1": "Tävlingsställningar, kalibrerade vikter, marklyftspodier",
    "about.li2": "Bältsquat, specialstänger (SSB, Duffalo, Buffalo)",
    "about.li3": "Krit & ammoniak tillåtet; god skötsel av stänger",
    "about.li4": "Tävlingssimuleringar och hjälp med försöksval",

    "plans.title": "Medlemskap",
    "plans.popular": "Populärt",
    "plans.12m": "12 månader",
    "plans.6m": "6 månader",
    "plans.3m": "3 månader",
    "plans.1m": "1 månad",
    "plans.dropin": "Engångsbesök",
    "plans.best": "Bästa värdet",
    "plans.247": "Tillgång dygnet runt",
    "plans.community": "Styrkelyftargemenskap",
    "plans.equip": "Tävlingsutrustning",
    "plans.events": "Gemenskap & evenemang",
    "plans.short": "Kort bindningstid",
    "plans.try": "Prova en månad",
    "plans.daypass": "Dagspass",
    "plans.full": "Full tillgång till gymmet",

    "training.title": "Träningsmiljö",
    "training.lead":
      "Gymmet är öppet 24/7 för medlemmar. Inga klasser — bara ett seriöst utrymme för fokuserad träning.",
    "training.li1": "Alltid tävlingsredo utrustning",
    "training.li2": "Lyftare som pushar varandra",
    "training.li3": "Träna med coach eller solo — du väljer",

    "ig.title": "Instagram",
    "ig.lead": "@hangöpowerteam • senaste inlägg",
    "ig.view": "Visa på Instagram →",

    "contact.title": "Hitta oss",
    "contact.h3": "Hangö Powerteam",
    "contact.lead":
      "Seriös träning för seriösa lyftare. Skicka DM på Instagram eller kom förbi för en provträning.",
    "contact.email": "E‑post:",

    "footer.motto": "Lyft tungt. Var snäll."
  },

  fi: {
    "nav.about": "Tietoa",
    "nav.memberships": "Jäsenyydet",
    "nav.instagram": "Instagram",
    "nav.contact": "Yhteys",
    "cta.join": "Liity jäseneksi",

    "hero.kicker": "Ammattimainen voimanosto • Kilpailuvalmennus",
    "hero.title": "Riko rajasi",
    "hero.subtitle":
      "Huippuvalmennus, kalibroidut levyt, kisatelineet ja yhteisö tavoitteellisille nostajille.",
    "hero.become": "Liity jäseneksi",
    "hero.vibe": "Katso treenifiilis",

    "about.title": "Hangö Powerteam",
    "about.lead":
      "Olemme voimanostoon erikoistunut sali, jonka painopiste on kilpailuihin valmistautumisessa ja voiman kehittämisessä. IPF‑tyylinen kalusto, kokeneet valmentajat ja vakava mutta ystävällinen ilmapiiri.",
    "about.facilities": "Tilat",
    "about.li1": "Kilpatelineet, kalibroidut levyt, maastavetolavat",
    "about.li2": "Belt squat, erikoistangot (SSB, Duffalo, Buffalo)",
    "about.li3": "Magnesium & ammoniakki sallittu; tankojen hoito",
    "about.li4": "Kilpailusimulaatiot ja yritysvalinnat",

    "plans.title": "Jäsenyydet",
    "plans.popular": "Suosituin",
    "plans.12m": "12 kuukautta",
    "plans.6m": "6 kuukautta",
    "plans.3m": "3 kuukautta",
    "plans.1m": "1 kuukausi",
    "plans.dropin": "Kertakäynti",
    "plans.best": "Paras hinta",
    "plans.247": "Käyttö 24/7",
    "plans.community": "Voimanostoyhteisö",
    "plans.equip": "Kilpakalusto",
    "plans.events": "Yhteisö & tapahtumat",
    "plans.short": "Lyhyt sitoutuminen",
    "plans.try": "Kokeile kuukausi",
    "plans.daypass": "Päivälippu",
    "plans.full": "Täysi pääsy salille",

    "training.title": "Treenimiljöö",
    "training.lead":
      "Sali on auki jäsenille 24/7. Ei tunteja — vain tila keskittyneelle treenille.",
    "training.li1": "Aina kisavalmis kalusto",
    "training.li2": "Yhteisö joka kannustaa",
    "training.li3": "Oma valmentaja tai soolotreeni — sinä päätät",

    "ig.title": "Instagram",
    "ig.lead": "@hangöpowerteam • uusimmat julkaisut",
    "ig.view": "Avaa Instagramissa →",

    "contact.title": "Löydä meidät",
    "contact.h3": "Hangö Powerteam",
    "contact.lead":
      "Vakavaa treeniä tosissaan treenaaville. Laita viesti Instagramissa tai tule kokeilemaan.",
    "contact.email": "Sähköposti:",

    "footer.motto": "Nosta raskaasti. Ole kiltti."
  }
};

function initI18n() {
  const wrap = document.querySelector(".lang-switch");
  if (!wrap) return;
  const btns = wrap.querySelectorAll(".lang");

  // Load from URL (?lang=fi), then localStorage, else 'en'
  const urlLang = new URL(location.href).searchParams.get("lang");
  const savedLang = localStorage.getItem("lang");
  const lang = (urlLang || savedLang || document.documentElement.lang || "en").toLowerCase();
  setLang(lang);

  btns.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

  function setLang(newLang) {
    const dict = I18N[newLang] || I18N.en;

    // Persist + reflect
    localStorage.setItem("lang", newLang);
    document.documentElement.setAttribute("lang", newLang);

    const u = new URL(location.href);
    u.searchParams.set("lang", newLang);
    history.replaceState(null, "", u);

    // Swap texts
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = dict[key];
      if (typeof val === "string") el.textContent = val;
    });

    // Active state on buttons
    btns.forEach((b) => b.classList.toggle("active", b.dataset.lang === newLang));

    // Notify (hook point if you expand i18n)
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: newLang } }));
  }
}

/* ========== Boot ========== */
document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initInstagramFeed();
  initI18n();
});
