<script lang="ts">
    import axios from "axios";

    let animeList: AnimeItem[] = [];

    let query: string = "";
    let disableDailyRelease = true;

    async function getAnimeTorrents(query: string) {
        const res = await axios.get("/api/anime", {
            params: { q: query, disableDailyRelease },
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

<section>
    <input bind:checked={disableDailyRelease} type="checkbox" />
    Disable Daily Release
</section>

<main class="flex overflow-x-auto justify-center">
    <table class="table w-[90%]">
        <thead>
            <tr>
                <th>Title</th>
                <th>Size</th>
                <th>Date</th>
                <th>Seeders/Leechers</th>
            </tr>
        </thead>
        <tbody>
            {#each animeList as item}
                <tr>
                    <th>{item.title[0]}</th>
                    <td>{item["nyaa:size"][0]}</td>
                    <td>{item.pubDate[0]}</td>
                    <td
                        >{item["nyaa:seeders"][0]} / {item[
                            "nyaa:leechers"
                        ][0]}</td
                    >
                </tr>
            {/each}
        </tbody>
    </table>
</main>
