const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_DIR = './web/src/services'; // Adjust this path to your frontend source directory
const DRY_RUN = true; // Set to true to preview changes without modifying files

// Patterns to match fetch calls
const patterns = [
  // fetch('/endpoint') or fetch("/endpoint")
  {
    regex: /fetch\s*\(\s*(['"`])\/(?!api\/)([^'"`\s]+)\1/g,
    replacement: "fetch($1/api/$2$1"
  },
  // fetch(`/endpoint`) or fetch(`/${variable}`)
  {
    regex: /fetch\s*\(\s*`\/(?!api\/)([^`]*)`/g,
    replacement: "fetch(`/api/$1`"
  },
  // axios.get('/endpoint'), axios.post('/endpoint'), etc.
  {
    regex: /axios\.(get|post|put|delete|patch)\s*\(\s*(['"`])\/(?!api\/)([^'"`\s]+)\2/g,
    replacement: "axios.$1($2/api/$3$2"
  },
  // axios.get(`/endpoint`)
  {
    regex: /axios\.(get|post|put|delete|patch)\s*\(\s*`\/(?!api\/)([^`]*)`/g,
    replacement: "axios.$1(`/api/$2`"
  }
];

// Track changes
let filesModified = 0;
let totalChanges = 0;

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  let fileChanges = 0;

  patterns.forEach(({ regex, replacement }) => {
    const matches = content.match(regex);
    if (matches) {
      fileChanges += matches.length;
      newContent = newContent.replace(regex, replacement);
    }
  });

  if (fileChanges > 0) {
    console.log(`\n📝 ${filePath}`);
    console.log(`   Found ${fileChanges} API call(s) to update`);

    if (!DRY_RUN) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`   ✅ Updated`);
    } else {
      console.log(`   ⚠️  DRY RUN - No changes made`);
    }

    filesModified++;
    totalChanges += fileChanges;
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and other common directories
      if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
        processDirectory(filePath);
      }
    } else if (stat.isFile()) {
      // Process JavaScript/TypeScript/JSX/TSX files
      if (/\.(js|jsx|ts|tsx)$/.test(file)) {
        processFile(filePath);
      }
    }
  });
}

// Main execution
console.log('🔍 Searching for API calls to update...');
console.log(`📁 Directory: ${FRONTEND_DIR}`);
console.log(`${DRY_RUN ? '⚠️  DRY RUN MODE - No files will be modified' : '✏️  WRITE MODE - Files will be updated'}\n`);

if (!fs.existsSync(FRONTEND_DIR)) {
  console.error(`❌ Error: Directory '${FRONTEND_DIR}' does not exist!`);
  console.error(`   Please update FRONTEND_DIR in the script to point to your frontend source directory.`);
  process.exit(1);
}

processDirectory(FRONTEND_DIR);

console.log('\n' + '='.repeat(50));
console.log(`✨ Complete!`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total changes: ${totalChanges}`);
if (DRY_RUN) {
  console.log(`\n💡 This was a dry run. Set DRY_RUN = false to apply changes.`);
}
console.log('='.repeat(50));