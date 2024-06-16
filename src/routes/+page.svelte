<script lang="ts">
    import axios from "axios";

    const commonDailyRelease = [
        "SubsPlease",
        "Erai-raws",
        "HorribleSubs",
        "ToonsHub",
        /[\[\(][wW]eekly[\]\)]/,
    ];

    let animeList: AnimeItem[] = [];
    let filtered: AnimeItem[] = [];
    let query: string = "";
    let disableDailyRelease = true;

    $: if (disableDailyRelease) {
        filtered = animeList.filter((anime) => {
            return !commonDailyRelease.some((release) => {
                return release instanceof RegExp
                    ? release.test(anime.title[0])
                    : anime.title[0].includes(release);
            });
        });
    } else {
        filtered = animeList;
    }

    async function getAnimeTorrents(query: string) {
        const res = await axios.get("/api/anime", {
            params: { q: query },
        });

        animeList = res.data;
    }
</script>

<div class="flex justify-center my-5">
    <form on:submit={() => getAnimeTorrents(query)}>
        <input
            bind:value={query}
            type="text"
            placeholder="Search for anime..."
            class="w-full max-w-sm input input-bordered"
        />
    </form>
</div>

<section class="">
    <input bind:checked={disableDailyRelease} type="checkbox" />
    Disable Daily Release
</section>

<main class="flex overflow-x-auto justify-center">
    <table class="table w-[80%]">
        <thead>
            <tr>
                <th>Title</th>
                <th>Size</th>
                <th>Date</th>
                <th>S / L</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each filtered as item (item["nyaa:infoHash"][0])}
                <tr>
                    <td class="text-ellipsis">{item.title[0]}</td>
                    <td>{item["nyaa:size"][0]}</td>
                    <td>{item.pubDate[0].replace("-0000", "")}</td>
                    <td
                        >{item["nyaa:seeders"][0]} / {item[
                            "nyaa:leechers"
                        ][0]}</td
                    >
                    <td class="flex flex-col gap-3">
                        <button class="btn">Torrent</button>
                        <button class="btn">Magnet</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</main>
