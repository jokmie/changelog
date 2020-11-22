const child = require("child_process");
const fs = require("fs");

const output = child
  .execSync(`git log --format=%ad--SPLIT--%B--SPLIT--%H--DELIMITER-- --date=short`)
  .toString("utf-8");

const repo = "https://github.com/jokmie/changelog";

const commitsArray = output
  .split("--DELIMITER--\n")
  .map(commit => {
    const [date, message, sha] = commit.split("--SPLIT--");

    return { date, sha, message };
  })

const currentVersion = require("./package.json").version;
let newChangelog = `Changelog for ${repo} (generated:${new Date().toISOString().split("T")[0]
  })\n # Latest Version [${currentVersion}](https://artifactory-placeholder.com)\n\n`;

const features = [];

features.push(`\n\n### Version ${currentVersion}\n\n`);

commitsArray.forEach(commit => {
  if (commit.message) {
    if (commit.message.startsWith('chore:'))
    {
      features.push(`\n\n### Version ${commit.message.includes('version') && commit.message.split('version ')[1].replace('[skip ci]\n','')}\n\n`);
    }
    if (!commit.message.startsWith('chore:')){
    features.push(
      `>* ${commit.message.split('\n\n').join('\n').split('\r\n\r\n').join('\n').split('*').join('>*')} ([${commit.sha && commit.sha.substring(
        0,
        6
      )}](${repo}/commit/${
        commit.sha
      }))\n`
    );
  }
  }
});

if (features.length) {
  newChangelog += ``;
  features.forEach(feature => {
    newChangelog += feature;
  });
  newChangelog += '\n';
}

fs.writeFileSync("./CHANGELOG.md", `${newChangelog}`);