const fs = require('fs');
const path = require('path');

// Read the TypeScript file
let tsContent = fs.readFileSync(
    path.join(__dirname, 'AdvancedAuditHistory', 'mocks', 'mockData.ts'),
    'utf8'
);

// Remove imports, exports, and type annotations to make it valid JavaScript
tsContent = tsContent
    .replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\s*/g, '')
    .replace(/export\s+/g, '')
    .replace(/:\s*Attribute\[\]/g, '')
    .replace(/:\s*Audit\[\]/g, '')
    .replace(/new\s+Date\(["']([^"']+)["']\)/g, '"$1"');

// Extract just the array declarations
const attributesMatch = tsContent.match(/const\s+mockAttributes\s*=\s*(\[[^\]]*\][^;]*);/s);
const auditsMatch = tsContent.match(/const\s+mockAudits\s*=\s*(\[[\s\S]*\]);/);

if (!attributesMatch || !auditsMatch) {
    console.error('Failed to match data arrays');
    process.exit(1);
}

// Create a temporary JS file with the parsed content
const tempJs = `
${tsContent}

// Export as JSON
const jsonData = {
    attributes: mockAttributes,
    audits: mockAudits
};

const fs = require('fs');
const path = require('path');
fs.writeFileSync(
    path.join(__dirname, 'AdvancedAuditHistory', 'mocks', 'mockData.json'),
    JSON.stringify(jsonData, null, 2),
    'utf8'
);

console.log('Successfully extracted mock data to mockData.json');
console.log('-', mockAttributes.length, 'attributes');
console.log('-', mockAudits.length, 'audit records');
`;

// Write temp file and execute it
fs.writeFileSync('temp-extract.js', tempJs, 'utf8');
require('./temp-extract.js');
fs.unlinkSync('temp-extract.js');
console.log('Cleanup complete');
