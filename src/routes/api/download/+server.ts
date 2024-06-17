import { QBittorrent } from "@ctrl/qbittorrent";
import { json, type RequestHandler } from "@sveltejs/kit";
import axios from "axios";
import * as cheerio from "cheerio";

// hardcoded. nobody is going to use this anyway
const client = new QBittorrent({
  baseUrl: "http://qb.veirt.moe",
  username: "",
  password: "",
});

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

  try {
    const res = await client.addMagnet(magnet, {
      category: "shoko",
    });
    return json({ success: res, message: "Torrent download has started." });
  } catch (err) {
    if (err instanceof Error) {
      return json({ success: false, message: err.message });
    }

    return json({ success: false, message: err });
  }
};
