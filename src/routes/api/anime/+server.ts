import { json, type RequestHandler } from "@sveltejs/kit";
import ky from "ky";
import { parseStringPromise } from "xml2js";

export const GET: RequestHandler = async ({ url }) => {
  const q = url.searchParams.get("q") || "";

  const rssXml = await ky.get("https://nyaa.si", {
    searchParams: new URLSearchParams({
      f: "0", // not sure
      page: "rss",
      c: "1_2", // category
      q,
    }),
  });

  const parsed = await parseStringPromise(await rssXml.text());
  const data: AnimeItem[] | undefined = parsed["rss"]["channel"][0]["item"];

  if (!data) return json([]);

  const sorted = data.sort((a, b) => {
    return parseInt(b["nyaa:seeders"][0]) - parseInt(a["nyaa:seeders"][0]);
  });

  return json(sorted);
};
