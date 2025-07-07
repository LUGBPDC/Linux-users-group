import { writable } from 'svelte/store';

export interface Theme {
  background: string;
  foreground: string;
  white: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  gray: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
  orange: string;
  brightOrange: string;
}

const ubuntuClassicTheme: Theme = {
  background: '#2c001e',        // Ubuntu dark purple-black
  foreground: '#ffffff',        // White text
  white: '#ffffff',
  black: '#000000',
  red: '#cc0000',
  green: '#4e9a06',
  yellow: '#c4a000',
  blue: '#3465a4',
  magenta: '#75507b',
  cyan: '#06989a',
  gray: '#d3d7cf',
  brightBlack: '#555753',
  brightRed: '#ef2929',
  brightGreen: '#8ae234',
  brightYellow: '#fce94f',
  brightBlue: '#729fcf',
  brightMagenta: '#ad7fa8',
  brightCyan: '#34e2e2',
  brightWhite: '#eeeeec',
  // Ubuntu signature colors
  orange: '#ff6600',            // Ubuntu orange
  brightOrange: '#ff8800'       // Bright Ubuntu orange
};

export const theme = writable<Theme>(ubuntuClassicTheme);
