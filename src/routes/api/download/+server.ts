import { json, type RequestHandler } from "@sveltejs/kit";
import axios from "axios";
import * as cheerio from "cheerio";
import ky from "ky";

// hardcoded. nobody is going to use this anyway
const QBITTORRENT_URL = "http://qb.veirt.moe";

export const POST: RequestHandler = async ({ request }) => {
  const item: AnimeItem = (await request.json()).item;

  const viewLink = item.guid[0]._;
  const infoPage = await axios.get(viewLink);

  const $ = cheerio.load(infoPage.data);
  const selector = ".card-footer-item";
  const magnet = $(selector).attr("href");

  if (!magnet) {
    return json({ success: false, message: "Magnet link not found." });
  }

  const formData = new FormData();
  formData.append("category", "shoko");
  formData.append("urls", item.link[0]);

  try {
    await ky.post(`${QBITTORRENT_URL}/api/v2/torrents/add`, {
      body: formData,
      headers: {},
    });

    return json({ success: true, message: "Torrent download has started." });
  } catch (err) {
    if (err instanceof Error) {
      return json({ success: false, message: err.message });
    }

    return json({ success: false, message: err });
  }
};
