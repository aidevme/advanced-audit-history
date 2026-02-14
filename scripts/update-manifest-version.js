/**
 * Updates the version number in ControlManifest.Input.xml
 * 
 * This script is called by semantic-release during the prepare step
 * to update the PCF control manifest with the new version number.
 * 
 * Usage: node scripts/update-manifest-version.js <version>
 * Example: node scripts/update-manifest-version.js 1.2.3
 */

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'AdvancedAuditHistory', 'ControlManifest.Input.xml');
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('❌ Error: Version argument is required');
  console.error('Usage: node scripts/update-manifest-version.js <version>');
  process.exit(1);
}

// Validate version format (semver: major.minor.patch)
if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error(`❌ Error: Invalid version format: ${newVersion}`);
  console.error('Version must follow semantic versioning (e.g., 1.2.3)');
  process.exit(1);
}

try {
  // Read the manifest file
  let manifestContent = fs.readFileSync(manifestPath, 'utf8');
  
  // Extract current version
  const versionMatch = manifestContent.match(/version="(\d+\.\d+\.\d+)"/);
  const currentVersion = versionMatch ? versionMatch[1] : 'unknown';
  
  // Update the version attribute
  manifestContent = manifestContent.replace(
    /version="\d+\.\d+\.\d+"/,
    `version="${newVersion}"`
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(manifestPath, manifestContent, 'utf8');
  
  console.log('✅ Successfully updated ControlManifest.Input.xml');
  console.log(`   ${currentVersion} → ${newVersion}`);
  
} catch (error) {
  console.error('❌ Error updating manifest version:', error.message);
  process.exit(1);
}
