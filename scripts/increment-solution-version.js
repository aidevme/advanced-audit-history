/**
 * Increments the solution version number in Solution.xml
 * Version format: Major.Minor.Build.Revision
 * This script increments the Revision number by 1
 */

const fs = require('fs');
const path = require('path');

const SOLUTION_XML_PATH = path.join(
    __dirname,
    '..',
    'Solution',
    'AdvancedAuditHistorySolution',
    'src',
    'Other',
    'Solution.xml'
);

function incrementSolutionVersion() {
    try {
        // Read Solution.xml
        const solutionXml = fs.readFileSync(SOLUTION_XML_PATH, 'utf8');

        // Extract current version using regex
        const versionRegex = /<Version>([\d.]+)<\/Version>/;
        const match = solutionXml.match(versionRegex);

        if (!match) {
            throw new Error('Could not find <Version> tag in Solution.xml');
        }

        const currentVersion = match[1];
        console.log(`Current version: ${currentVersion}`);

        // Parse version parts
        const versionParts = currentVersion.split('.');
        if (versionParts.length !== 4) {
            throw new Error(`Invalid version format: ${currentVersion}. Expected Major.Minor.Build.Revision`);
        }

        // Increment revision number (last part)
        const major = parseInt(versionParts[0], 10);
        const minor = parseInt(versionParts[1], 10);
        const build = parseInt(versionParts[2], 10);
        const revision = parseInt(versionParts[3], 10) + 1;

        const newVersion = `${major}.${minor}.${build}.${revision}`;
        console.log(`New version: ${newVersion}`);

        // Replace version in XML
        const updatedXml = solutionXml.replace(
            versionRegex,
            `<Version>${newVersion}</Version>`
        );

        // Write back to file
        fs.writeFileSync(SOLUTION_XML_PATH, updatedXml, 'utf8');
        console.log(`✅ Successfully updated Solution.xml to version ${newVersion}`);

        // Output for GitHub Actions
        if (process.env.GITHUB_OUTPUT) {
            fs.appendFileSync(process.env.GITHUB_OUTPUT, `new_version=${newVersion}\n`);
            fs.appendFileSync(process.env.GITHUB_OUTPUT, `previous_version=${currentVersion}\n`);
        }

        return newVersion;
    } catch (error) {
        console.error('❌ Error incrementing solution version:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    incrementSolutionVersion();
}

module.exports = { incrementSolutionVersion };
