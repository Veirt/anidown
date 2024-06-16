<script lang="ts">
    import Toast from "$lib/components/Toast.svelte";
    import { notifications } from "$lib/store/notifications";
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

    let isLoading = false;

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
        animeList = [];
        isLoading = true;
        const res = await axios.get("/api/anime", {
            params: { q: query },
        });
        isLoading = false;

        animeList = res.data;
    }

    async function downloadTorrent(item: AnimeItem) {
        const res = await axios.post("/api/download", {
            item,
        });

        if (res.data.success) {
            notifications.success(res.data.message, 2000);
        } else {
            notifications.danger(res.data.message, 2000);
        }
    }
</script>

<Toast />

<div class="flex flex-col gap-3 items-center my-5 mt-10">
    <form class="w-1/2" on:submit={() => getAnimeTorrents(query)}>
        <input
            bind:value={query}
            type="text"
            placeholder="Search for anime..."
            class="w-full input input-bordered"
        />
    </form>
    <section class="w-1/2">
        <input bind:checked={disableDailyRelease} type="checkbox" />
        Disable Daily Release
    </section>
</div>

<main class="flex overflow-x-auto justify-center">
    {#if isLoading}
        <span class="loading loading-ring loading-lg"></span>
    {/if}
    {#if filtered.length}
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
                            <button
                                on:click={() => downloadTorrent(item)}
                                class="btn">Download</button
                            >
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</main>
