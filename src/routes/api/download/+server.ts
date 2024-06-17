import { json, type RequestHandler } from "@sveltejs/kit";
import ky from "ky";

// hardcoded. nobody is going to use this anyway
const QBITTORRENT_URL = "http://qb.veirt.moe";

export const POST: RequestHandler = async ({ request }) => {
  const item: AnimeItem = (await request.json()).item;

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
