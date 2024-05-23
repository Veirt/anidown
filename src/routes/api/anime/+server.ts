import { json, type RequestHandler } from "@sveltejs/kit";
import axios from "axios";
import { parseStringPromise } from "xml2js";

export const GET: RequestHandler = async ({ url }) => {
  const q = url.searchParams.get("q");
  // https://nyaa.si/&page=rss&c=1_2&s=seeders&o=desc&q=made%20in%20abyss
  const res = await axios.get("https://nyaa.si", {
    params: {
      f: 0, // not sure
      page: "rss",
      c: "1_2", // category
      q,
    },
  });

  const commonDailyRelease = [
    "SubsPlease",
    "Erai-raws",
    "HorribleSubs",
    "ToonsHub",
    /[\[\(][wW]eekly[\]\)]/,
  ];

  const disableDailyRelease = url.searchParams.get("disableDailyRelease");

  const data = await parseStringPromise(res.data);
  const filtered: AnimeItem[] = data["rss"]["channel"][0]["item"].filter(
    (item: AnimeItem) => {
      const title = item["title"][0];

      // true is string.
      if (disableDailyRelease == "true") {
        for (const release of commonDailyRelease) {
          if (title.match(release)) {
            return false;
          }
        }
      }

      return true;
    },
  );

  return json(filtered);
};
