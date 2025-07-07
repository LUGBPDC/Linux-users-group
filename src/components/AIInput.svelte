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
  let conversationHistory: Array<{query: string, command: string, timestamp: Date}> = [];
  
  onMount(async () => {
    isHealthy = await aiService.checkHealth();
  });
  
  async function handleAISubmit() {
    if (!aiInput.trim()) return;
    
    // No processing limitations - allow immediate reuse
    isProcessing = true;
    
    try {
      const suggestion = await aiService.translateCommand(aiInput.trim());
      currentSuggestion = suggestion;
      showSuggestion = true;
    } catch (error) {
      console.error('AI translation failed:', error);
      currentSuggestion = {
        command: 'help',
        explanation: 'AI service encountered an error. You can try again immediately.',
        confidence: 0.7,
        needsConfirmation: false
      };
      showSuggestion = true;
    } finally {
      // Always allow immediate next use
      isProcessing = false;
    }
  }
  
  function acceptSuggestion() {
    if (currentSuggestion?.command) {
      // Add to conversation history with timestamp
      conversationHistory = [...conversationHistory, {
        query: aiInput,
        command: currentSuggestion.command,
        timestamp: new Date()
      }];
      
      dispatch('execute-command', currentSuggestion.command);
      
      // Clear input for next query but keep AI open
      aiInput = '';
      showSuggestion = false;
      currentSuggestion = null;
      
      // Immediately focus back to input for next query
      setTimeout(() => {
        const input = document.querySelector('#ai-input') as HTMLInputElement;
        if (input) input.focus();
      }, 100);
    }
  }
  
  function rejectSuggestion() {
    showSuggestion = false;
    currentSuggestion = null;
    // Keep the input text for modification
  }
  
  function clearHistory() {
    conversationHistory = [];
  }
  
  function reuseQuery(query: string) {
    aiInput = query;
    // Auto-focus input
    setTimeout(() => {
      const input = document.querySelector('#ai-input') as HTMLInputElement;
      if (input) input.focus();
    }, 50);
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAISubmit();
    } else if (event.key === 'Escape') {
      rejectSuggestion();
    }
    // No other key restrictions
  }
  
  // Auto-submit quick queries
  function quickQuery(query: string) {
    aiInput = query;
    setTimeout(() => handleAISubmit(), 100);
  }
</script>

<div class="ai-input-container mb-4 p-3 rounded-lg border" 
     style={`background-color: rgba(255, 102, 0, 0.1); border-color: ${$theme.orange};`}>
  
  <div class="flex items-center justify-between mb-2">
    <div class="flex items-center">
      <span class="text-sm font-bold mr-2" style={`color: ${$theme.orange};`}>
        🤖 LUG AI Assistant - Unlimited Usage
      </span>
      <span class="text-xs mr-2 px-2 py-1 rounded" 
            style={`background-color: ${isHealthy ? $theme.brightGreen : $theme.red}; color: ${$theme.black};`}>
        {isHealthy ? '● Online & Ready' : '● Offline'}
      </span>
    </div>
    
    <div class="flex gap-2">
      {#if conversationHistory.length > 0}
        <span class="text-xs px-2 py-1 rounded" 
              style={`background-color: ${$theme.blue}; color: ${$theme.white};`}>
          {conversationHistory.length} queries
        </span>
        <button
          class="text-xs px-2 py-1 rounded hover:opacity-80"
          style={`background-color: ${$theme.gray}; color: ${$theme.black};`}
          on:click={clearHistory}
        >
          Clear
        </button>
      {/if}
    </div>
  </div>
  
  <div class="text-xs mb-3" style={`color: ${$theme.brightGreen};`}>
    ✨ Ask as many questions as you want! No limits, no cooldowns, no restrictions.
  </div>
  
  <!-- Conversation History -->
  {#if conversationHistory.length > 0}
    <div class="mb-3 p-2 rounded border max-h-40 overflow-y-auto" 
         style={`background-color: rgba(0, 0, 0, 0.3); border-color: ${$theme.gray};`}>
      <div class="text-xs font-bold mb-2" style={`color: ${$theme.orange};`}>
        Recent Queries ({conversationHistory.length}):
      </div>
      {#each conversationHistory.slice(-5).reverse() as item, index}
        <div class="text-xs mb-2 p-2 rounded border-l-2 border-orange-500" 
             style={`background-color: rgba(255, 102, 0, 0.1);`}>
          <div class="flex items-center justify-between mb-1">
            <span style={`color: ${$theme.gray};`}>
              "{item.query}"
            </span>
            <span class="text-xs" style={`color: ${$theme.gray};`}>
              {item.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span style={`color: ${$theme.brightGreen};`}>→ {item.command}</span>
            <button
              class="text-xs underline hover:opacity-80"
              style={`color: ${$theme.orange};`}
              on:click={() => reuseQuery(item.query)}
            >
              reuse
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  
  <div class="flex gap-2 mb-2">
    <input
      id="ai-input"
      type="text"
      placeholder="Ask anything about LUG BPDC - unlimited questions welcome!"
      class="flex-1 px-3 py-2 bg-transparent border rounded font-mono text-sm outline-none"
      style={`color: ${$theme.foreground}; border-color: ${$theme.orange}; caret-color: ${$theme.orange};`}
      bind:value={aiInput}
      on:keydown={handleKeyDown}
      disabled={false}
    />
    
    <button
      class="px-4 py-2 rounded font-bold text-sm transition-all duration-200 hover:opacity-80"
      style={`background-color: ${$theme.orange}; color: ${$theme.black};`}
      on:click={handleAISubmit}
      disabled={false}
    >
      {isProcessing ? '🔄' : '🚀'}
    </button>
  </div>
  
  <!-- Quick Actions - Always Available -->
  <div class="mb-2 flex flex-wrap gap-1">
    <span class="text-xs mr-2" style={`color: ${$theme.gray};`}>Quick:</span>
    {#each [
      'about LUG', 
      'upcoming events', 
      'how to join', 
      'team members', 
      'contact info',
      'current projects',
      'learning resources',
      'achievements'
    ] as quickQueryText}
      <button
        class="text-xs px-2 py-1 rounded hover:opacity-80 transition-all"
        style={`background-color: rgba(255, 102, 0, 0.2); color: ${$theme.orange}; border: 1px solid ${$theme.orange};`}
        on:click={() => quickQuery(quickQueryText)}
      >
        {quickQueryText}
      </button>
    {/each}
  </div>
  
  {#if showSuggestion && currentSuggestion}
    <div class="mt-3 p-3 rounded border" 
         style={`background-color: rgba(255, 255, 255, 0.05); border-color: ${$theme.brightGreen};`}>
      
      <div class="flex items-start justify-between mb-2">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm font-bold" style={`color: ${$theme.brightGreen};`}>
              AI Suggestion:
            </span>
            {#if currentSuggestion.confidence > 0}
              <span class="text-xs px-2 py-1 rounded" 
                    style={`background-color: ${$theme.orange}; color: ${$theme.black};`}>
                {Math.round(currentSuggestion.confidence * 100)}% confident
              </span>
            {/if}
            <span class="text-xs px-2 py-1 rounded" 
                  style={`background-color: ${$theme.brightGreen}; color: ${$theme.black};`}>
              Ready for next query
            </span>
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
          class="px-3 py-1 rounded text-sm font-bold transition-all duration-200 hover:opacity-80"
          style={`background-color: ${$theme.brightGreen}; color: ${$theme.black};`}
          on:click={acceptSuggestion}
        >
          ✓ Execute & Continue
        </button>
        
        <button
          class="px-3 py-1 rounded text-sm font-bold transition-all duration-200 hover:opacity-80"
          style={`background-color: ${$theme.yellow}; color: ${$theme.black};`}
          on:click={rejectSuggestion}
        >
          ↻ Modify Query
        </button>
        
        <button
          class="px-3 py-1 rounded text-sm font-bold transition-all duration-200 hover:opacity-80"
          style={`background-color: ${$theme.blue}; color: ${$theme.white};`}
          on:click={() => {aiInput = ''; showSuggestion = false;}}
        >
          ⚡ New Query
        </button>
      </div>
    </div>
  {/if}
  
  <!-- Status Bar -->
  <div class="mt-2 text-xs flex justify-between items-center" style={`color: ${$theme.gray};`}>
    <span>💡 Press Enter to ask • No usage limits • Always ready</span>
    <span>Queries today: {conversationHistory.length}</span>
  </div>
</div>
