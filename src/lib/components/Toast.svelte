<script lang="ts">
    import { flip } from "svelte/animate";
    import { fly } from "svelte/transition";
    import { notifications } from "$lib/store/notifications";
</script>

<div class="notifications">
    {#each $notifications as notification (notification.id)}
        <div
            class:alert-success={notification.type === "success"}
            class:alert-error={notification.type === "danger"}
            animate:flip
            class="mx-10 w-1/3 rounded alert"
            transition:fly={{ y: 30 }}
        >
            {#if notification.type === "success"}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6 stroke-current shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    /></svg
                >
            {:else if notification.type === "danger"}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6 stroke-current shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    /></svg
                >
            {/if}

            <div class="content">{notification.message}</div>
        </div>
    {/each}
</div>

<style>
    .notifications {
        position: fixed;
        top: 15px;
        left: 0;
        right: 0;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        pointer-events: none;
    }

    .content {
        padding: 10px;
        display: block;
        color: white;
        font-weight: 500;
    }
</style>
