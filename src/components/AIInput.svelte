<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { theme } from '../stores/theme';
  import { aiService } from '../lib/ai-service';
  
  const dispatch = createEventDispatcher();
  
  let aiInput = '';
  let isProcessing = false;
  let showSuggestion = false;
  let currentSuggestion: any = null;
  let isHealthy = false;
  let conversationHistory: Array<{query: string, command: string}> = [];
  
  onMount(async () => {
    isHealthy = await aiService.checkHealth();
  });
  
  async function handleAISubmit() {
    if (!aiInput.trim() || isProcessing) return;
    
    isProcessing = true;
    showSuggestion = false;
    
    try {
      const suggestion = await aiService.translateCommand(aiInput.trim());
      currentSuggestion = suggestion;
      showSuggestion = true;
    } catch (error) {
      console.error('AI translation failed:', error);
      currentSuggestion = {
        command: 'help',
        explanation: 'AI service is currently unavailable. Type "help" to see available commands.',
        confidence: 0.7,
        needsConfirmation: false
      };
      showSuggestion = true;
    } finally {
      isProcessing = false;
    }
  }
  
  function acceptSuggestion() {
    if (currentSuggestion?.command) {
      // Add to conversation history
      conversationHistory = [...conversationHistory, {
        query: aiInput,
        command: currentSuggestion.command
      }];
      
      dispatch('execute-command', currentSuggestion.command);
      
      // Keep the AI input visible and clear the text for next query
      aiInput = '';
      showSuggestion = false;
      currentSuggestion = null;
      
      // Don't hide the AI assistant - keep it open for more queries
    }
  }
  
  function rejectSuggestion() {
    showSuggestion = false;
    currentSuggestion = null;
    // Keep the input text so user can modify their query
  }
  
  function clearHistory() {
    conversationHistory = [];
  }
  
  function reuseQuery(query: string) {
    aiInput = query;
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleAISubmit();
    } else if (event.key === 'Escape') {
      rejectSuggestion();
    }
  }
</script>

<div class="ai-input-container mb-4 p-3 rounded-lg border" 
     style={`background-color: rgba(255, 102, 0, 0.1); border-color: ${$theme.orange};`}>
  
  <div class="flex items-center justify-between mb-2">
    <div class="flex items-center">
      <span class="text-sm font-bold mr-2" style={`color: ${$theme.orange};`}>
        🤖 LUG Navigation Assistant
      </span>
      <span class="text-xs mr-2" style={`color: ${$theme.gray};`}>
        {isHealthy ? '● Online' : '● Offline'}
      </span>
    </div>
    
    <div class="flex gap-2">
      {#if conversationHistory.length > 0}
        <button
          class="text-xs px-2 py-1 rounded hover:opacity-80"
          style={`background-color: ${$theme.gray}; color: ${$theme.black};`}
          on:click={clearHistory}
        >
          Clear History
        </button>
      {/if}
      
      <button
        class="text-xs px-2 py-1 rounded hover:opacity-80"
        style={`background-color: ${$theme.red}; color: ${$theme.white};`}
        on:click={() => dispatch('close-ai')}
      >
        ✕ Close AI
      </button>
    </div>
  </div>
  
  <div class="text-xs mb-2" style={`color: ${$theme.gray};`}>
    Navigate LUG BPDC using natural language. Ask multiple questions!
  </div>
  
  <!-- Conversation History -->
  {#if conversationHistory.length > 0}
    <div class="mb-3 p-2 rounded border max-h-32 overflow-y-auto" 
         style={`background-color: rgba(0, 0, 0, 0.2); border-color: ${$theme.gray};`}>
      <div class="text-xs font-bold mb-1" style={`color: ${$theme.orange};`}>
        Recent Queries:
      </div>
      {#each conversationHistory.slice(-3) as item}
        <div class="text-xs mb-1 flex items-center gap-2">
          <span style={`color: ${$theme.gray};`}>"{item.query}"</span>
          <span style={`color: ${$theme.brightGreen};`}>→ {item.command}</span>
          <button
            class="text-xs underline hover:opacity-80"
            style={`color: ${$theme.orange};`}
            on:click={() => reuseQuery(item.query)}
          >
            reuse
          </button>
        </div>
      {/each}
    </div>
  {/if}
  
  <div class="flex gap-2">
    <input
      type="text"
      placeholder="e.g., 'show me about LUG', 'upcoming events', 'how to join', 'team members'"
      class="flex-1 px-3 py-2 bg-transparent border rounded font-mono text-sm outline-none"
      style={`color: ${$theme.foreground}; border-color: ${$theme.orange}; caret-color: ${$theme.orange};`}
      bind:value={aiInput}
      on:keydown={handleKeyDown}
      disabled={isProcessing || !isHealthy}
    />
    
    <button
      class="px-4 py-2 rounded font-bold text-sm transition-all duration-200 hover:opacity-80 disabled:opacity-50"
      style={`background-color: ${$theme.orange}; color: ${$theme.black};`}
      on:click={handleAISubmit}
      disabled={isProcessing || !aiInput.trim() || !isHealthy}
    >
      {isProcessing ? '🔄' : '🧭'}
    </button>
  </div>
  
  <!-- Quick Actions -->
  <div class="mt-2 flex flex-wrap gap-1">
    <span class="text-xs" style={`color: ${$theme.gray};`}>Quick:</span>
    {#each ['about LUG', 'upcoming events', 'how to join', 'team members', 'contact info'] as quickQuery}
      <button
        class="text-xs px-2 py-1 rounded hover:opacity-80"
        style={`background-color: rgba(255, 102, 0, 0.2); color: ${$theme.orange}; border: 1px solid ${$theme.orange};`}
        on:click={() => aiInput = quickQuery}
      >
        {quickQuery}
      </button>
    {/each}
  </div>
  
  {#if showSuggestion && currentSuggestion}
    <div class="mt-3 p-3 rounded border" 
         style={`background-color: rgba(255, 255, 255, 0.05); border-color: ${$theme.gray};`}>
      
      <div class="flex items-start justify-between mb-2">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm font-bold" style={`color: ${$theme.brightGreen};`}>
              Navigation Suggestion:
            </span>
            {#if currentSuggestion.confidence > 0}
              <span class="text-xs px-2 py-1 rounded" 
                    style={`background-color: ${$theme.orange}; color: ${$theme.black};`}>
                {Math.round(currentSuggestion.confidence * 100)}% confident
              </span>
            {/if}
          </div>
          
          {#if currentSuggestion.command}
            <code class="block p-2 rounded font-mono text-sm mb-2" 
                  style={`background-color: ${$theme.black}; color: ${$theme.brightYellow};`}>
              {currentSuggestion.command}
            </code>
          {/if}
          
          <p class="text-sm" style={`color: ${$theme.gray};`}>
            {currentSuggestion.explanation}
          </p>
        </div>
      </div>
      
      <div class="flex gap-2">
        <button
          class="px-3 py-1 rounded text-sm font-bold transition-all duration-200 hover:opacity-80 disabled:opacity-50"
          style={`background-color: ${$theme.brightGreen}; color: ${$theme.black};`}
          on:click={acceptSuggestion}
          disabled={!currentSuggestion.command}
        >
          ✓ Navigate
        </button>
        
        <button
          class="px-3 py-1 rounded text-sm font-bold transition-all duration-200 hover:opacity-80"
          style={`background-color: ${$theme.yellow}; color: ${$theme.black};`}
          on:click={rejectSuggestion}
        >
          ↻ Modify Query
        </button>
      </div>
    </div>
  {/if}
</div>
