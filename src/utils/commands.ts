export const commands: Record<string, (args?: string[]) => string | Promise<string>> = {
  banner: () => {
    return `
██╗     ██╗   ██╗ ██████╗     ██████╗ ██╗████████╗███████╗
██║     ██║   ██║██╔════╝     ██╔══██╗██║╚══██╔══╝██╔════╝
██║     ██║   ██║██║  ███╗    ██████╔╝██║   ██║   ███████╗
██║     ██║   ██║██║   ██║    ██╔══██╗██║   ██║   ╚════██║
███████╗╚██████╔╝╚██████╔╝    ██████╔╝██║   ██║   ███████║
╚══════╝ ╚═════╝  ╚═════╝     ╚═════╝ ╚═╝   ╚═╝   ╚══════╝

Linux Users Group - BITS Pilani Dubai Campus

Welcome to LUG BPDC Terminal! Type 'help' to see available commands.
Visit us at: https://lugbpdc.org
    `;
  },

  help: () => {
    return `Available commands:

System Commands:
  help          - Show this help message
  clear         - Clear the terminal
  whoami        - Display current user
  uname         - System information
  date          - Show current date and time
  uptime        - Show system uptime
  ps            - Show running processes
  pwd           - Print working directory
  ls            - List directory contents

LUG Commands:
  about         - About LUG BPDC
  events        - Upcoming events
  projects      - Current projects
  members       - Core team members
  contact       - Contact information
  join          - How to join LUG
  resources     - Learning resources
  achievements  - Our achievements

System Info Commands:
  neofetch      - System information with style
  lscpu         - CPU information
  lsmem         - Memory information
  lsusb         - USB devices
  lspci         - PCI devices
  df            - Disk space usage
  free          - Memory usage
  hostnamectl   - Host information

Fun Commands:
  cowsay <msg>  - Make a cow say something
  fortune       - Random fortune cookie
  matrix        - Enter the matrix
  joke          - Random programming joke

Navigation:
  Use arrow keys to navigate command history
  Tab for autocompletion
  Ctrl+L to clear screen
    `;
  },

  clear: () => {
    return '';
  },

  whoami: () => {
    return 'guest';
  },

  uname: (args) => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    if (args && args.includes('-a')) {
      return `Linux ${window.location.hostname} ${getBrowserKernel()} ${new Date().toISOString().split('T')[0]} ${getArchitecture()} ${platform} GNU/Linux`;
    }
    
    return 'Linux';
  },

  date: () => {
    return new Date().toString();
  },

  uptime: () => {
    const uptime = Math.floor(performance.now() / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;
    return `up ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}, load average: 0.${Math.floor(Math.random() * 99)}, 0.${Math.floor(Math.random() * 99)}, 0.${Math.floor(Math.random() * 99)}`;
  },

  ps: () => {
    return `  PID TTY          TIME CMD
    1 pts/0    00:00:01 bash
 ${Math.floor(Math.random() * 9000) + 1000} pts/0    00:00:00 lugbpdc-terminal
 ${Math.floor(Math.random() * 9000) + 1000} pts/0    00:00:00 ps`;
  },

  pwd: () => {
    return '/home/guest';
  },

  ls: (args) => {
    const files = [
      'Documents/', 'Downloads/', 'Pictures/', 'Videos/',
      'projects/', 'lug-events/', 'README.md', '.bashrc'
    ];
    
    if (args && args.includes('-la')) {
      return `total 8
drwxr-xr-x  8 guest guest  256 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)} .
drwxr-xr-x  3 root  root   96 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)} ..
-rw-r--r--  1 guest guest  220 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)} .bashrc
drwxr-xr-x  2 guest guest   64 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)} Documents
drwxr-xr-x  2 guest guest   64 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)} Downloads
drwxr-xr-x  2 guest guest   64 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)} lug-events
drwxr-xr-x  2 guest guest   64 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)} Pictures
drwxr-xr-x  2 guest guest   64 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)} projects
-rw-r--r--  1 guest guest  807 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)} README.md
drwxr-xr-x  2 guest guest   64 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)} Videos`;
    }
    
    return files.join('  ');
  },

  neofetch: () => {
    const browserInfo = getBrowserInfo();
    const systemInfo = getSystemInfo();
    const memoryInfo = getMemoryInfo();
    
    return `                    .-/+oossssoo+/-.               guest@${window.location.hostname}
                \`:+ssssssssssssssssss+:\`           ----------------
              -+ssssssssssssssssssyyssss+-         OS: ${systemInfo.os}
            .ossssssssssssssssssdMMMNysssso.       Host: ${systemInfo.host}
           /ssssssssssshdmmNNmmyNMMMMhssssss/      Kernel: ${systemInfo.kernel}
          +ssssssssshmydMMMMMMMNddddyssssssss+     Uptime: ${getUptimeString()}
         /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Packages: ${Math.floor(Math.random() * 3000) + 1000} (web)
        .ssssssssdMMMNhsssssssssshNMMMdssssssss.   Shell: ${browserInfo.name} ${browserInfo.version}
        +sssshhhyNMMNyssssssssssssyNMMMysssssss+   Resolution: ${screen.width}x${screen.height}
        ossyNMMMNyMMhsssssssssssssshmmmhssssssso   DE: Web Browser Environment
        ossyNMMMNyMMhsssssssssssssshmmmhssssssso   WM: ${browserInfo.name}
        +sssshhhyNMMNyssssssssssssyNMMMysssssss+   Theme: Ubuntu-orange-dark
        .ssssssssdMMMNhsssssssssshNMMMdssssssss.   Terminal: lugbpdc-terminal
         /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/    CPU: ${systemInfo.cpu}
          +sssssssssdmydMMMMMMMMddddyssssssss+     GPU: ${systemInfo.gpu}
           /ssssssssssshdmNNNNmyNMMMMhssssss/      Memory: ${memoryInfo.used}MiB / ${memoryInfo.total}MiB
            .ossssssssssssssssssdMMMNysssso.       Browser: ${browserInfo.name} ${browserInfo.version}
              -+sssssssssssssssssyyyssss+-         Platform: ${navigator.platform}
                \`:+ssssssssssssssssss+:\`           Language: ${navigator.language}
                    .-/+oossssoo+/-.               Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
  },

  lscpu: () => {
    const cpuInfo = getCPUInfo();
    return `Architecture:        ${getArchitecture()}
CPU op-mode(s):      32-bit, 64-bit
Byte Order:          Little Endian
CPU(s):              ${cpuInfo.cores}
Thread(s) per core:  ${cpuInfo.threads}
Core(s) per socket:  ${cpuInfo.cores}
Socket(s):           1
Vendor ID:           ${cpuInfo.vendor}
CPU family:          ${cpuInfo.family}
Model:               ${cpuInfo.model}
Model name:          ${cpuInfo.name}
CPU MHz:             ${cpuInfo.speed}
L1d cache:           32K
L1i cache:           32K
L2 cache:            256K
L3 cache:            8192K`;
  },

  lsmem: () => {
    const memory = getMemoryInfo();
    return `RANGE                                 SIZE  STATE REMOVABLE BLOCK
0x0000000000000000-0x000000007fffffff  ${memory.total}G online        no     0

Memory block size:       128M
Total online memory:     ${memory.total}G
Total offline memory:    0B`;
  },

  free: () => {
    const memory = getMemoryInfo();
    const used = memory.used;
    const free = memory.total - used;
    const available = free + Math.floor(memory.total * 0.1); // Simulate cache/buffers
    
    return `              total        used        free      shared  buff/cache   available
Mem:        ${memory.total * 1024}     ${used * 1024}     ${free * 1024}           0         ${Math.floor(memory.total * 0.1) * 1024}     ${available * 1024}
Swap:              0           0           0`;
  },

  df: () => {
    const storage = getStorageInfo();
    return `Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/sda1       ${storage.total}  ${storage.used}  ${storage.available}  ${storage.usedPercent}% /
tmpfs             ${Math.floor(getMemoryInfo().total * 512)}       0   ${Math.floor(getMemoryInfo().total * 512)}   0% /dev/shm
tmpfs             ${Math.floor(getMemoryInfo().total * 102)}    1024   ${Math.floor(getMemoryInfo().total * 102) - 1024}   1% /run`;
  },

  lsusb: () => {
    return `Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 001 Device 003: ID 1bcf:2883 Sunplus Innovation Technology Inc. Laptop_Integrated_Webcam_HD
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 002 Device 002: ID 0781:5567 SanDisk Corp. Cruzer Blade`;
  },

  lspci: () => {
    const systemInfo = getSystemInfo();
    return `00:00.0 Host bridge: Intel Corporation Device 0000
00:02.0 VGA compatible controller: ${systemInfo.gpu}
00:14.0 USB controller: Intel Corporation Device 0000
00:16.0 Communication controller: Intel Corporation Device 0000
00:17.0 SATA controller: Intel Corporation Device 0000
00:1c.0 PCI bridge: Intel Corporation Device 0000
00:1f.0 ISA bridge: Intel Corporation Device 0000
00:1f.3 Audio device: Intel Corporation Device 0000`;
  },

  hostnamectl: () => {
    const systemInfo = getSystemInfo();
    return `   Static hostname: ${window.location.hostname}
         Icon name: computer-laptop
           Chassis: laptop
        Machine ID: ${generateMachineId()}
           Boot ID: ${generateBootId()}
  Operating System: ${systemInfo.os}
            Kernel: ${systemInfo.kernel}
      Architecture: ${getArchitecture()}`;
  },

  // Keep all the existing LUG commands...
  about: () => {
    return `Linux Users Group - BITS Pilani Dubai Campus

LUG BPDC is a student-driven community passionate about open-source 
technology, Linux systems, and collaborative learning. We organize 
workshops, hackathons, and tech talks to promote FOSS culture.

Founded: 2018
Members: 150+ active members
Focus Areas:
  • Linux & System Administration
  • Open Source Development
  • Cybersecurity
  • DevOps & Cloud Computing
  • Programming & Software Development

Mission: Fostering innovation through open-source collaboration.`;
  },

  events: () => {
    return `Upcoming Events:

📅 Linux Installation Workshop
   Date: July 15, 2025
   Time: 2:00 PM - 5:00 PM
   Venue: Computer Lab 1

🔐 Cybersecurity CTF
   Date: July 22, 2025
   Time: 10:00 AM - 6:00 PM
   Venue: Auditorium

💻 Open Source Contribution Drive
   Date: July 29, 2025
   Time: 3:00 PM - 6:00 PM
   Venue: LUG Lab

🚀 DevOps Bootcamp
   Date: August 5, 2025
   Time: 1:00 PM - 7:00 PM
   Venue: Innovation Center

For registration: events@lugbpdc.org`;
  },

  projects: () => {
    return `Current Projects:

🌐 LUG Website Redesign
   Tech Stack: Svelte, TypeScript, TailwindCSS
   Status: In Progress
   Contributors: 8

🔧 Campus Network Monitor
   Tech Stack: Python, Flask, Docker
   Status: Beta Testing
   Contributors: 5

📱 BPDC Mobile App
   Tech Stack: React Native, Node.js
   Status: Planning
   Contributors: 12

🤖 Discord Bot
   Tech Stack: Python, Discord.py
   Status: Live
   Contributors: 3

Want to contribute? Contact: projects@lugbpdc.org`;
  },

  members: () => {
    return `Core Team Members:

👑 President: Ahmed Al-Rashid
   Year: 3rd Year, Computer Science
   Expertise: Full-Stack Development, DevOps

🎯 Vice President: Priya Sharma
   Year: 3rd Year, Information Systems
   Expertise: Cybersecurity, Penetration Testing

💻 Technical Lead: Mohammed Hassan
   Year: 4th Year, Computer Science
   Expertise: Linux Systems, Cloud Computing

📊 Events Coordinator: Sarah Johnson
   Year: 2nd Year, Computer Engineering
   Expertise: Project Management, UI/UX

🎨 Design Lead: Raj Patel
   Year: 3rd Year, Computer Science
   Expertise: Frontend Development, Design

📝 Documentation Lead: Fatima Ali
   Year: 2nd Year, Information Systems
   Expertise: Technical Writing, Documentation`;
  },

  contact: () => {
    return `Contact Information:

📧 Email: contact@lugbpdc.org
🌐 Website: https://lugbpdc.org
💬 Discord: https://discord.gg/lugbpdc
📱 Telegram: @lugbpdc
🐦 Twitter: @lugbpdc
📸 Instagram: @lug_bpdc

📍 Office: Student Activity Center, Room 204
         BITS Pilani Dubai Campus

Office Hours:
Monday - Thursday: 2:00 PM - 6:00 PM
Friday: 1:00 PM - 4:00 PM

For urgent matters: +971-50-XXX-XXXX`;
  },

  join: () => {
    return `How to Join LUG BPDC:

1. 📝 Fill out our membership form:
   https://forms.lugbpdc.org/join

2. 💬 Join our Discord server:
   https://discord.gg/lugbpdc

3. 📅 Attend our weekly meetings:
   Every Wednesday, 4:00 PM - 5:30 PM
   Student Activity Center, Room 204

4. 🚀 Participate in events and workshops

5. 💻 Contribute to our projects on GitHub:
   https://github.com/lugbpdc

Requirements:
• BITS Pilani Dubai Campus student
• Interest in Linux/Open Source
• Willingness to learn and collaborate

Membership Benefits:
• Access to exclusive workshops
• Priority in event registrations
• Mentorship opportunities
• Industry connections
• Certificate of participation`;
  },

  resources: () => {
    return `Learning Resources:

📚 Linux Fundamentals:
   • Linux Journey: https://linuxjourney.com
   • OverTheWire: https://overthewire.org
   • Linux Academy courses

🐧 System Administration:
   • Red Hat Learning: https://redhat.com/training
   • Linux Foundation courses
   • Ubuntu Server Guide

💻 Programming:
   • FreeCodeCamp: https://freecodecamp.org
   • Codecademy Linux courses
   • GitHub Learning Lab

🔐 Cybersecurity:
   • TryHackMe: https://tryhackme.com
   • HackTheBox: https://hackthebox.eu
   • OWASP Top 10

☁️ DevOps & Cloud:
   • AWS Free Tier
   • Docker Documentation
   • Kubernetes tutorials

📖 Our Curated List:
   https://github.com/lugbpdc/awesome-resources`;
  },

  achievements: () => {
    return `LUG BPDC Achievements:

🏆 2024 Highlights:
   • 1st Place - UAE Collegiate Cyber Defense
   • Best Student Organization - BPDC Awards
   • 50+ successful workshops conducted
   • 200+ students trained in Linux

🌟 2023 Achievements:
   • Organized first inter-university hackathon
   • Launched open-source mentorship program
   • 3 members selected for Google Summer of Code
   • Partnership with Red Hat Academy

📈 Growth Metrics:
   • 300% increase in membership (2022-2024)
   • 15 active projects on GitHub
   • 1000+ followers across social platforms
   • 95% member satisfaction rate

🎯 Recognition:
   • Featured in BITS Pilani newsletter
   • Collaboration with industry partners
   • Alumni working at FAANG companies
   • Active contributor to major FOSS projects`;
  },

  cowsay: (args) => {
    const message = args ? args.join(' ') : 'Hello from LUG BPDC!';
    const border = '_'.repeat(message.length + 2);
    
    return `
 ${border}
< ${message} >
 ${'-'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
  },

  fortune: () => {
    const fortunes = [
      "The best way to predict the future is to invent it. - Alan Kay",
      "Talk is cheap. Show me the code. - Linus Torvalds",
      "Programs must be written for people to read, and only incidentally for machines to execute. - Harold Abelson",
      "The only way to learn a new programming language is by writing programs in it. - Dennis Ritchie",
      "Code is like humor. When you have to explain it, it's bad. - Cory House",
      "First, solve the problem. Then, write the code. - John Johnson",
      "Linux is not in the public domain. Linux is a cancer that attaches itself in an intellectual property sense to everything it touches. - Steve Ballmer (We disagree! 😄)"
    ];
    
    return fortunes[Math.floor(Math.random() * fortunes.length)];
  },

  matrix: () => {
    return `Wake up, Neo...
The Matrix has you...
Follow the white rabbit.

01001100 01010101 01000111
01000010 01010000 01000100
01000011

Knock, knock, Neo.`;
  },

  joke: () => {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
      "Why don't programmers like nature? It has too many bugs.",
      "What's a programmer's favorite hangout place? Foo Bar.",
      "Why did the programmer quit his job? He didn't get arrays.",
      "What do you call a programmer from Finland? Nerdic.",
      "Why do Java developers wear glasses? Because they can't C#!"
    ];
    
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
};

// Helper functions for real device information
function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';
  
  if (userAgent.includes('Chrome')) {
    name = 'Chrome';
    version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.includes('Firefox')) {
    name = 'Firefox';
    version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.includes('Safari')) {
    name = 'Safari';
    version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.includes('Edge')) {
    name = 'Edge';
    version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
  }
  
  return { name, version };
}

function getSystemInfo() {
  const userAgent = navigator.userAgent;
  let os = 'Unknown OS';
  let kernel = 'Unknown';
  
  if (userAgent.includes('Windows')) {
    os = 'Microsoft Windows';
    kernel = 'NT';
  } else if (userAgent.includes('Mac')) {
    os = 'macOS';
    kernel = 'Darwin';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
    kernel = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
    kernel = 'Linux';
  } else if (userAgent.includes('iOS')) {
    os = 'iOS';
    kernel = 'Darwin';
  }
  
  return {
    os,
    kernel: `${kernel} ${Math.floor(Math.random() * 5) + 5}.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 100)}`,
    host: `${navigator.platform} System`,
    cpu: getCPUInfo().name,
    gpu: getGPUInfo()
  };
}

function getCPUInfo() {
  const cores = navigator.hardwareConcurrency || 4;
  const userAgent = navigator.userAgent;
  
  let vendor = 'Unknown';
  let name = 'Unknown Processor';
  
  if (userAgent.includes('Intel')) {
    vendor = 'GenuineIntel';
    name = 'Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz';
  } else if (userAgent.includes('AMD')) {
    vendor = 'AuthenticAMD';
    name = 'AMD Ryzen 7 3700X 8-Core Processor';
  } else {
    vendor = 'GenuineIntel';
    name = `Generic ${cores}-Core Processor`;
  }
  
  return {
    cores,
    threads: cores > 4 ? 2 : 1,
    vendor,
    family: Math.floor(Math.random() * 10) + 6,
    model: Math.floor(Math.random() * 200) + 50,
    name,
    speed: `${(Math.random() * 2 + 2).toFixed(2)}GHz`
  };
}

function getMemoryInfo() {
  // Estimate based on device capabilities
  const deviceMemory = (navigator as any).deviceMemory || 8;
  const total = deviceMemory * 1024; // Convert to MB
  const used = Math.floor(total * (0.3 + Math.random() * 0.4)); // 30-70% usage
  
  return {
    total: Math.floor(total / 1024), // Convert to GB for display
    used: Math.floor(used / 1024),   // Convert to GB for display
    totalMB: total,
    usedMB: used
  };
}

function getStorageInfo() {
  // Estimate storage (can't get real values from browser for security)
  const total = Math.floor(Math.random() * 500000) + 250000; // 250-750GB
  const used = Math.floor(total * (0.2 + Math.random() * 0.6)); // 20-80% usage
  const available = total - used;
  const usedPercent = Math.floor((used / total) * 100);
  
  return {
    total,
    used,
    available,
    usedPercent
  };
}

function getGPUInfo() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown GPU';
    }
  }
  
  return 'Unknown Graphics Card';
}

function getArchitecture() {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('win64') || platform.includes('x86_64') || platform.includes('amd64')) {
    return 'x86_64';
  } else if (platform.includes('arm')) {
    return 'arm64';
  } else if (platform.includes('win32') || platform.includes('i386')) {
    return 'i386';
  }
  return 'x86_64'; // Default assumption
}

function getBrowserKernel() {
  const browserInfo = getBrowserInfo();
  return `${browserInfo.name.toLowerCase()}-${browserInfo.version}.0.0`;
}

function getUptimeString() {
  const uptime = Math.floor(performance.now() / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} min${minutes > 1 ? 's' : ''}`;
  } else {
    return `${minutes} min${minutes > 1 ? 's' : ''}`;
  }
}

function generateMachineId() {
  return Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateBootId() {
  return [8,4,4,4,12].map(n => 
    Array.from({length: n}, () => Math.floor(Math.random() * 16).toString(16)).join('')
  ).join('-');
}
