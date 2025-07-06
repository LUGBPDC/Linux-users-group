<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { history } from '../stores/history';
  import { theme } from '../stores/theme';
  import { commands } from '../utils/commands';
  import { track } from '../utils/tracking';

  let command = '';
  let historyIndex = -1;
  let input: HTMLInputElement;

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
      const trimmedCommand = command.trim();
      if (!trimmedCommand) {
        command = '';
        return;
      }

      const [commandName, ...args] = trimmedCommand.split(' ');

      if (import.meta.env.VITE_TRACKING_ENABLED === 'true') {
        track(commandName, ...args);
      }

      const commandFunction = commands[commandName];

      if (commandFunction) {
        try {
          const output = await commandFunction(args);
          
          if (commandName === 'clear') {
            $history = [];
          } else {
            $history = [...$history, { command: trimmedCommand, outputs: [output] }];
          }
        } catch (error) {
          $history = [...$history, { 
            command: trimmedCommand, 
            outputs: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`] 
          }];
        }
      } else {
        const output = `bash: ${commandName}: command not found`;
        $history = [...$history, { command: trimmedCommand, outputs: [output] }];
      }

      command = '';
      historyIndex = -1;
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
    }
  };
</script>

<svelte:window
  on:click={() => {
    input.focus();
  }}
/>

<div class="flex w-full">
  <p class="visible md:hidden" style={`color: ${$theme.white}`}>❯</p>
  
  <input
    id="command-input"
    name="command-input"
    aria-label="Command input"
    class="w-full px-2 bg-transparent outline-none font-mono"
    type="text"
    style={`color: ${$theme.foreground}; caret-color: ${$theme.brightGreen};`}
    bind:value={command}
    on:keydown={handleKeyDown}
    bind:this={input}
    autocomplete="off"
    spellcheck="false"
  />
</div>
