import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const IG_LONG_LIVED_TOKEN = process.env.IG_LONG_LIVED_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;

let cache = { time: 0, data: null };
const CACHE_MS = 5 * 60 * 1000; // 5 minutes

router.get("/", async (req, res) => {
  try {
    if (!IG_LONG_LIVED_TOKEN || !IG_USER_ID) {
      return res.status(400).json({
        error: "Missing IG env vars",
        hint: "Set IG_USER_ID and IG_LONG_LIVED_TOKEN in .env",
      });
    }

    if (cache.data && Date.now() - cache.time < CACHE_MS) {
      return res.json(cache.data);
    }

    const fields = [
      "id",
      "caption",
      "media_type",
      "media_url",
      "permalink",
      "thumbnail_url",
      "timestamp",
      "username",
      "children{media_type,media_url,thumbnail_url,id}",
    ].join(",");

    const url = `https://graph.instagram.com/${IG_USER_ID}/media?fields=${encodeURIComponent(
      fields
    )}&access_token=${IG_LONG_LIVED_TOKEN}&limit=12`;

    const r = await fetch(url);
    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ error: "Instagram API error", detail: txt });
    }
    const j = await r.json();

    const items = (j.data || []).map((m) => ({
      id: m.id,
      type: m.media_type, // IMAGE | VIDEO | CAROUSEL_ALBUM
      caption: m.caption || "",
      url: m.media_url,
      thumb: m.thumbnail_url || null,
      permalink: m.permalink,
      timestamp: m.timestamp,
      username: m.username,
      children: (m.children?.data || []).map((c) => ({
        type: c.media_type,
        url: c.media_url,
        thumb: c.thumbnail_url || null,
        id: c.id,
      })),
    }));

    const shaped = { items };
    cache = { time: Date.now(), data: shaped };
    res.json(shaped);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
