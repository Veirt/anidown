import { json, type RequestHandler } from "@sveltejs/kit";
import ky from "ky";

// hardcoded. nobody is going to use this anyway
const QBITTORRENT_URL = "http://qb.veirt.moe";

export const POST: RequestHandler = async ({ request }) => {
  let data;
  let torrents: FormDataEntryValue | null = null;

  const contentType = request.headers.get("content-type");
  if (contentType?.includes("form-data")) {
    torrents = (await request.formData()).get("torrents[]");
  } else {
    data = await request.json();
  }

  const formData = new FormData();
  formData.append("category", "shoko");
  if (data?.item) formData.append("urls", data.item.link[0]);
  if (torrents) formData.append("torrents[]", torrents);

  try {
    await ky.post(`${QBITTORRENT_URL}/api/v2/torrents/add`, {
      body: formData,
    });

    return json({ success: true, message: "Torrent download has started." });
  } catch (err) {
    if (err instanceof Error) {
      return json({ success: false, message: err.message });
    }

    return json({ success: false, message: err });
  }
};
