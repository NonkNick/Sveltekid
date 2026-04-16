<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import {Button} from "$lib/components/ui/button";

</script>

<Card.Root class="glass w-full">
    <Card.Header>
        <Card.Title>this is card for example yes</Card.Title>
        <Card.Description>description of tha card aa</Card.Description>
        <Card.Action>
            <Button variant="link">a button but link</Button>
        </Card.Action>
    </Card.Header>
    <Card.Content></Card.Content>
    <Card.Footer class="gap-2 flex-col">
        <Button type="submit" class="w-full">button</Button>
    </Card.Footer>
</Card.Root>

<div class="w-100 h-100 bg-red-400"></div>

<style>

</style>