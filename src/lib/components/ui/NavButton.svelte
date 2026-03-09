<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        href?: string;
        children: Snippet;
    }

    let { href = '#', children }: Props = $props();

</script>

<div>
    <a {href}>
        {@render children()}
    </a>
</div>


<style>
</style>
