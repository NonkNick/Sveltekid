<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import type { post as postTable } from "$lib/server/db/posts.schema";

	type Post = typeof postTable.$inferSelect; //ts yoga

	let { post }: { post: Post } = $props();
</script>

<Card.Root class="glass w-full">
	<Card.Header>
		<Card.Title>{post.title}</Card.Title>
		<Card.Description>{post.author.name}</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>{post.content.text}</p>
		{console.log(post)}
	</Card.Content>
</Card.Root>
