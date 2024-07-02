<script lang="ts">
    import Toast from "$lib/components/Toast.svelte";
    import { notifications } from "$lib/store/notifications";
    import ky from "ky";

    import { page } from "$app/stores";
    import { onMount } from "svelte";

    const commonDailyRelease = [
        "SubsPlease",
        "Erai-raws",
        "HorribleSubs",
        "ToonsHub",
        /[\[\(][wW]eekly[\]\)]/,
    ];

    let animeList: AnimeItem[] = [];
    let filtered: AnimeItem[] = [];
    let query: string = $page.url.searchParams.get("query") || "";
    let disableDailyRelease = true;

    let isLoading = false;

    onMount(() => {
        getAnimeTorrents(query);
    });

    $: {
        if (disableDailyRelease) {
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
    }

    async function getAnimeTorrents(query: string) {
        animeList = [];
        isLoading = true;
        const data = await ky
            .get("/api/anime", {
                searchParams: new URLSearchParams({ q: query }),
            })
            .json<AnimeItem[]>();
        isLoading = false;

        animeList = data;
    }

    async function downloadTorrent(item: AnimeItem) {
        const data = await ky
            .post("/api/download", {
                json: { item },
            })
            .json<{ success: boolean; message: string }>();

        if (data.success) {
            notifications.success(data.message, 2000);
            return;
        }

        notifications.danger(data.message, 2000);
    }
</script>

<div class="flex flex-col gap-3 items-center my-10">
    <form class="flex sm:w-1/2" on:submit={() => getAnimeTorrents(query)}>
        <input
            bind:value={query}
            name="query"
            type="text"
            placeholder="Search for anime..."
            class="w-full focus:outline-none input input-bordered"
        />
        <button class="btn" type="submit"
            ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                ><path
                    fill="white"
                    d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
                /></svg
            ></button
        >
    </form>
    <section class="w-1/2">
        <input
            id="disableDailyRelease"
            bind:checked={disableDailyRelease}
            type="checkbox"
        />
        <label for="disableDailyRelease"> Disable Daily Release </label>
    </section>
</div>

<main>
    <div class="flex justify-center">
        {#if isLoading}
            <span class="loading loading-ring loading-lg"></span>
        {/if}
    </div>
    {#if filtered.length}
        <table class="hidden justify-center sm:table table-xs sm:table-md">
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
                        <td class="max-w-xs font-bold break-words text-pretty"
                            >{item.title[0]}</td
                        >
                        <td>{item["nyaa:size"][0]}</td>
                        <td>{item.pubDate[0].replace("-0000", "")}</td>
                        <td
                            >{item["nyaa:seeders"][0]} / {item[
                                "nyaa:leechers"
                            ][0]}</td
                        >
                        <td>
                            <button
                                on:click={() => downloadTorrent(item)}
                                class="btn btn-sm">Download</button
                            >
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>

        <div class="flex flex-col gap-5 justify-center items-center sm:hidden">
            {#each filtered as item (item["nyaa:infoHash"][0])}
                <div class="w-[90%] rounded shadow-xl card bg-neutral">
                    <div class="card-body">
                        <h2 class="text-xs font-bold card-title">
                            {item.title[0]}
                        </h2>
                        <p class="text-xs">{item["nyaa:size"][0]}</p>
                        <p class="text-xs">
                            {item.pubDate[0].replace("-0000", "")}
                        </p>
                        <p class="text-xs">
                            {item["nyaa:seeders"][0]} / {item[
                                "nyaa:leechers"
                            ][0]}
                        </p>
                        <button
                            on:click={() => downloadTorrent(item)}
                            class="btn btn-sm">Download</button
                        >
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</main>

<Toast />
