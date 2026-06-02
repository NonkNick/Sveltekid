<script lang="ts">
	import type { PageProps } from "./$types";
	import UserSettings from "$lib/components/UserSettings.svelte";
	let { data }: PageProps = $props();
</script>

<div class="mx-auto grid max-w-[860px] gap-[18px] px-5 py-12">
	<UserSettings user={data.user} />
</div>

<style>
</style>
