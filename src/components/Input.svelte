<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { history } from '../stores/history';
  import { theme } from '../stores/theme';
  import { commands } from '../utils/commands';
  import { track } from '../utils/tracking';
  import AIInput from './AIInput.svelte';

  let command = '';
  let historyIndex = -1;
  let input: HTMLInputElement;
  let showAI = false;

  onMount(() => {
    input.focus();

    if ($history.length === 0) {
      const bannerCommand = commands['banner'] as () => string;
      if (bannerCommand) {
        const output = bannerCommand();
        $history = [...$history, { command: 'banner', outputs: [output] }];
      }
    }
  });

  afterUpdate(() => {
    input.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      await executeCommand(command.trim());
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (historyIndex < $history.length - 1) {
        historyIndex++;
        command = $history[$history.length - 1 - historyIndex].command;
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex > -1) {
        historyIndex--;
        command = historyIndex >= 0 
          ? $history[$history.length - 1 - historyIndex].command 
          : '';
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const autoCompleteCommand = Object.keys(commands).find((cmd) =>
        cmd.startsWith(command.trim())
      );
      if (autoCompleteCommand) {
        command = autoCompleteCommand;
      }
    } else if (event.ctrlKey && event.key === 'l') {
      event.preventDefault();
      $history = [];
    } else if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      showAI = !showAI;
    }
  };

  async function executeCommand(cmd: string) {
    if (!cmd) {
      command = '';
      return;
    }

    const [commandName, ...args] = cmd.split(' ');

    if (import.meta.env.VITE_TRACKING_ENABLED === 'true') {
      track(commandName, ...args);
    }

    // AI command - always enable, never disable automatically
    if (commandName === 'ai') {
      showAI = true; // Always turn on, never turn off automatically
      $history = [...$history, { 
        command: cmd, 
        outputs: ['🤖 AI Assistant activated! Unlimited usage enabled. Ask as many questions as you want!'] 
      }];
      command = '';
      historyIndex = -1;
      return;
    }

    const commandFunction = commands[commandName];

    if (commandFunction) {
      try {
        const output = await commandFunction(args);
        
        if (commandName === 'clear') {
          $history = [];
        } else {
          $history = [...$history, { command: cmd, outputs: [output] }];
        }
      } catch (error) {
        $history = [...$history, { 
          command: cmd, 
          outputs: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`] 
        }];
      }
    } else {
      const output = `bash: ${commandName}: command not found`;
      $history = [...$history, { command: cmd, outputs: [output] }];
    }

    command = '';
    historyIndex = -1;
  }

  function handleAICommand(event: CustomEvent) {
    executeCommand(event.detail);
    // NEVER close AI automatically - let user decide
    // showAI remains true always
  }
</script>

<svelte:window
  on:click={() => {
    input.focus();
  }}
/>

<div class="w-full">
  {#if showAI}
    <AIInput on:execute-command={handleAICommand} />
  {/if}

  <div class="flex w-full">
    <p class="visible md:hidden" style={`color: ${$theme.white}`}>❯</p>
    
    <input
      id="command-input"
      name="command-input"
      aria-label="Command input"
      class="w-full px-2 bg-transparent outline-none font-mono"
      type="text"
      style={`color: ${$theme.foreground}; caret-color: ${$theme.orange};`}
      bind:value={command}
      on:keydown={handleKeyDown}
      bind:this={input}
      autocomplete="off"
      spellcheck="false"
      placeholder={showAI ? "AI Assistant active - unlimited usage!" : "Type 'ai' to enable unlimited AI assistant"}
    />
  </div>

  <div class="text-xs mt-1 opacity-60" style={`color: ${$theme.gray};`}>
    💡 Press Ctrl+K for AI assistant | Tab for autocomplete | ↑↓ for history
    {#if showAI}
      | 🤖 AI: Unlimited Mode Active
    {/if}
  </div>
</div>
