#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const command = process.argv[2];
  const flags = {};
  for (let i = 3; i < process.argv.length; i += 2) {
    if (i % 2 === 1) { // Odd indices are flags
      const flag = process.argv[i].replace('--', '');
      const value = process.argv[i + 1];
      flags[flag] = value;
    }
  }

  /**
   * Init command
   * 
   * Initializes a new HYTOPIA project. Accepting an optional
   * project name as an argument.
   * 
   * @example
   * `bunx hytopia init my-project-name`
   */
  if (command === 'init') {
    const destDir = process.cwd();

    if (flags.template) {
      // Init from example template
      console.log(`🔧 Initializing project with examples template ${flags.template}`);

      const templateDir = path.join(__dirname, '..', 'examples', flags.template);

      if (!fs.existsSync(templateDir)) {
        console.error(`Examples template ${flags.template} does not exist in the examples directory, could not initialize project!`);
        return;
      }

      fs.cpSync(templateDir, destDir, { recursive: true });
    } else {
      // Init from boilerplate
      const srcDir = path.join(__dirname, '..', 'boilerplate');
      fs.cpSync(srcDir, destDir, { recursive: true });  
    }

    // Initialize project
    console.log('✨ Finalizing setup...');
    execSync('bun init --yes');
    execSync('bun add hytopia@latest');

    // Done, lfg!
    console.log('--------------------------------');
    console.log('🚀 Hytopia project initialized successfully!');
    console.log('💡 Start your development server with `bun --watch index.ts`!');
    console.log('🎮 After you start your development server, play by opening your browser and visiting: https://play.hytopia.com/?join=localhost:8080')
    return;
  }
  
  console.log('Unknown command: ' + command);
})();

