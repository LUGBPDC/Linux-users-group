import { commands } from '../utils/commands';

interface AIResponse {
  command: string;
  explanation: string;
  confidence: number;
  needsConfirmation: boolean;
}

class OllamaAIService {
  private baseUrl: string;
  private model: string;
  private availableCommands: string[];

  constructor() {
    this.baseUrl = import.meta.env.VITE_AI_API_URL || 'http://localhost:11434';
    this.model = import.meta.env.VITE_AI_MODEL || 'llama3.2:3b';
    // Get only the commands defined in commands.ts
    this.availableCommands = Object.keys(commands);
  }

  async translateCommand(naturalLanguage: string): Promise<AIResponse> {
    const prompt = this.buildRestrictedPrompt(naturalLanguage);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.1,
            top_p: 0.9,
            max_tokens: 150,
            stop: ['\n\n']
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.parseAndValidateResponse(data.response);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(naturalLanguage);
    }
  }

  private buildRestrictedPrompt(input: string): string {
    const commandList = this.availableCommands.join(', ');
    
    return `You are a navigation assistant for the LUG BPDC website terminal. You can ONLY suggest commands that exist in this terminal.

AVAILABLE COMMANDS ONLY: ${commandList}

User request: "${input}"

You must ONLY respond with commands from the available list above. Do not suggest any other commands.

Command descriptions:
- help: Show available commands
- about: About LUG BPDC
- events: Upcoming events
- projects: Current projects  
- members: Core team members
- contact: Contact information
- join: How to join LUG
- resources: Learning resources
- achievements: Our achievements
- neofetch: System information
- clear: Clear screen
- whoami: Show current user
- date: Show current date
- ls: List directory contents
- pwd: Show current directory
- cowsay: Make cow say message
- fortune: Random quote
- joke: Programming joke
- matrix: Matrix effect

Respond ONLY with valid JSON in this exact format:
{"command": "exact_command_from_list", "explanation": "what this command does", "confidence": 0.95, "needsConfirmation": false}

If the user asks for something not available, suggest the closest available command or help.

JSON only:`;
  }

  private parseAndValidateResponse(response: string): AIResponse {
    try {
      const jsonMatch = response.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate that the suggested command exists in our commands
      if (parsed.command && !this.availableCommands.includes(parsed.command)) {
        console.warn(`AI suggested invalid command: ${parsed.command}`);
        return {
          command: 'help',
          explanation: `Command "${parsed.command}" is not available. Type 'help' to see available commands.`,
          confidence: 0.8,
          needsConfirmation: false
        };
      }
      
      return {
        command: parsed.command || '',
        explanation: parsed.explanation || 'Command translated',
        confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
        needsConfirmation: parsed.needsConfirmation || false
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        command: 'help',
        explanation: 'Could not understand the request. Type "help" to see available commands.',
        confidence: 0.7,
        needsConfirmation: false
      };
    }
  }

  private getFallbackResponse(input: string): AIResponse {
    const lowerInput = input.toLowerCase();
    
    // Map natural language to your specific commands
    const commandMap: Record<string, { cmd: string; desc: string; conf: number }> = {
      // Navigation commands
      'help': { cmd: 'help', desc: 'Shows available commands', conf: 0.9 },
      'commands': { cmd: 'help', desc: 'Shows available commands', conf: 0.9 },
      
      // LUG-specific commands
      'about': { cmd: 'about', desc: 'About LUG BPDC', conf: 0.9 },
      'info': { cmd: 'about', desc: 'Information about LUG BPDC', conf: 0.8 },
      'events': { cmd: 'events', desc: 'Shows upcoming events', conf: 0.9 },
      'workshops': { cmd: 'events', desc: 'Shows upcoming workshops and events', conf: 0.8 },
      'projects': { cmd: 'projects', desc: 'Shows current projects', conf: 0.9 },
      'members': { cmd: 'members', desc: 'Shows core team members', conf: 0.9 },
      'team': { cmd: 'members', desc: 'Shows team members', conf: 0.8 },
      'contact': { cmd: 'contact', desc: 'Shows contact information', conf: 0.9 },
      'join': { cmd: 'join', desc: 'How to join LUG BPDC', conf: 0.9 },
      'resources': { cmd: 'resources', desc: 'Learning resources', conf: 0.9 },
      'achievements': { cmd: 'achievements', desc: 'Our achievements', conf: 0.9 },
      
      // System commands
      'clear': { cmd: 'clear', desc: 'Clears the screen', conf: 0.9 },
      'clean': { cmd: 'clear', desc: 'Cleans the screen', conf: 0.8 },
      'system': { cmd: 'neofetch', desc: 'Shows system information', conf: 0.8 },
      'whoami': { cmd: 'whoami', desc: 'Shows current user', conf: 0.9 },
      'user': { cmd: 'whoami', desc: 'Shows current user', conf: 0.8 },
      'date': { cmd: 'date', desc: 'Shows current date and time', conf: 0.9 },
      'time': { cmd: 'date', desc: 'Shows current date and time', conf: 0.8 },
      'files': { cmd: 'ls', desc: 'Lists directory contents', conf: 0.8 },
      'list': { cmd: 'ls', desc: 'Lists directory contents', conf: 0.8 },
      'directory': { cmd: 'pwd', desc: 'Shows current directory', conf: 0.8 },
      
      // Fun commands
      'cow': { cmd: 'cowsay', desc: 'Make a cow say something', conf: 0.8 },
      'fortune': { cmd: 'fortune', desc: 'Shows a random quote', conf: 0.9 },
      'quote': { cmd: 'fortune', desc: 'Shows a random quote', conf: 0.8 },
      'joke': { cmd: 'joke', desc: 'Shows a programming joke', conf: 0.9 },
      'matrix': { cmd: 'matrix', desc: 'Enter the matrix', conf: 0.9 }
    };

    // Find the best match
    for (const [key, value] of Object.entries(commandMap)) {
      if (lowerInput.includes(key)) {
        return {
          command: value.cmd,
          explanation: value.desc,
          confidence: value.conf,
          needsConfirmation: false
        };
      }
    }

    // Default fallback
    return {
      command: 'help',
      explanation: 'Could not understand the request. Type "help" to see all available commands.',
      confidence: 0.6,
      needsConfirmation: false
    };
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Method to get available commands for display
  getAvailableCommands(): string[] {
    return [...this.availableCommands];
  }
}

export const aiService = new OllamaAIService();
