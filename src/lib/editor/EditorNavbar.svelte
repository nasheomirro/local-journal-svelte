<script lang="ts"> 
	import Navbar from "$lib/components/Navbar.svelte";
	import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ save: undefined }>();
</script>

<Navbar>
  <a href="/">back</a>
  <button on:click={() => dispatch('save')}>save entry</button>
</Navbar>