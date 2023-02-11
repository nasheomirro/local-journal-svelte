<script lang="ts"> 
	import Navbar from "$lib/components/Navbar.svelte";
	import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ save: undefined }>();

</script>
<Navbar>
  <a href="/">Home</a>
  <button on:click={() => dispatch('save')}>Save Entry</button>
</Navbar>