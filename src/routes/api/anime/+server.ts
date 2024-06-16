import { json, type RequestHandler } from "@sveltejs/kit";
import axios from "axios";
import { parseStringPromise } from "xml2js";

export const GET: RequestHandler = async ({ url }) => {
  const q = url.searchParams.get("q");
  const res = await axios.get("https://nyaa.si", {
    params: {
      f: 0, // not sure
      page: "rss",
      c: "1_2", // category
      q,
    },
  });

  const data: AnimeItem[] = (await parseStringPromise(res.data))["rss"][
    "channel"
  ][0]["item"];

  const sorted = data.sort((a, b) => {
    return parseInt(b["nyaa:seeders"][0]) - parseInt(a["nyaa:seeders"][0]);
  });

  return json(sorted);
};
