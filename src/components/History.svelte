<script lang="ts">
  import { history } from '../stores/history';
  import { theme } from '../stores/theme';
  import Ps1 from './Ps1.svelte';
</script>

{#each $history as { command, outputs }}
  <div class="mb-2">
    <div class="flex flex-col md:flex-row items-start">
      <Ps1 />
      
      <div class="flex items-center ml-2">
        <p class="visible md:hidden mr-2" style={`color: ${$theme.white}`}>❯</p>
        <p class="font-mono" style={`color: ${$theme.foreground}`}>{command}</p>
      </div>
    </div>

    {#each outputs as output}
      <pre class="whitespace-pre-wrap font-mono text-sm mt-1 ml-0 md:ml-4" 
           style={`color: ${$theme.foreground}`}>{output}</pre>
    {/each}
  </div>
{/each}
