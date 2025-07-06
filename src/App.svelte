<script lang="ts">
  import Ps1 from './components/Ps1.svelte';
  import Input from './components/Input.svelte';
  import History from './components/History.svelte';
  import { theme } from './stores/theme';
  import { onMount } from 'svelte';

  onMount(() => {
    document.title = 'LUG BPDC Terminal';
    
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = '/favicon.ico';
    }
  });
</script>

<svelte:head>
  <title>LUG BPDC Terminal</title>
  <meta name="description" content="Linux Users Group - BITS Pilani Dubai Campus Terminal Interface" />
  <meta name="keywords" content="LUG, Linux, BITS Pilani, Dubai, Open Source, Terminal" />
  
  {#if import.meta.env.VITE_TRACKING_ENABLED === 'true'}
    <script
      async
      defer
      data-website-id={import.meta.env.VITE_TRACKING_SITE_ID}
      src={import.meta.env.VITE_TRACKING_URL}
    ></script>
  {/if}
</svelte:head>

<main
  class="min-h-screen border-2 rounded-lg p-4 overflow-auto text-xs sm:text-sm md:text-base font-mono"
  style={`
    background: linear-gradient(135deg, #2c001e 0%, #1a0011 50%, #000000 100%);
    color: ${$theme.foreground}; 
    border-color: ${$theme.orange};
    box-shadow: 0 0 20px rgba(255, 102, 0, 0.3);
  `}
>
  <History />

  <div class="flex flex-col md:flex-row items-start">
    <Ps1 />
    <Input />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 8px;
    background: linear-gradient(135deg, #2c001e 0%, #1a0011 50%, #000000 100%);
    font-family: 'Ubuntu Mono', 'Courier New', monospace;
  }
  
  :global(*) {
    box-sizing: border-box;
  }
  
  :global(::selection) {
    background-color: rgba(255, 102, 0, 0.3);
    color: white;
  }
  
  :global(::-webkit-scrollbar) {
    width: 8px;
  }
  
  :global(::-webkit-scrollbar-track) {
    background: rgba(255, 102, 0, 0.1);
  }
  
  :global(::-webkit-scrollbar-thumb) {
    background: rgba(255, 102, 0, 0.5);
    border-radius: 4px;
  }
  
  :global(::-webkit-scrollbar-thumb:hover) {
    background: rgba(255, 102, 0, 0.7);
  }
</style>
