// Verifies that a release version matches every pinned version in the repository.
// Usage: bun scripts/check-version.ts [X.Y.Z]   (defaults to the GITHUB_REF_NAME tag without its v prefix)
const expected = process.argv[2] ?? process.env.GITHUB_REF_NAME?.replace(/^v/, '');
if (!expected || !/^\d+\.\d+\.\d+$/.test(expected)) {
  console.error('Usage: bun scripts/check-version.ts X.Y.Z (or set GITHUB_REF_NAME=vX.Y.Z)');
  process.exit(2);
}

const image = 'ghcr.io/gabigabogabu/slashevents';
const pinnedFiles = ['docker-compose.yml', '.env.example', 'README.md'];
const mismatches: string[] = [];

const pkg = await Bun.file('package.json').json() as { version?: string };
if (pkg.version !== expected) mismatches.push(`package.json version is ${pkg.version}`);

for (const file of pinnedFiles) {
  const text = await Bun.file(file).text();
  const pins = text.match(new RegExp(`${image.replaceAll('.', '\\.')}:\\d[^\\s\`"'<>}]*`, 'g')) ?? [];
  if (pins.length === 0) mismatches.push(`${file} does not pin ${image}`);
  for (const pin of pins) {
    if (pin !== `${image}:${expected}`) mismatches.push(`${file} pins ${pin}`);
  }
}

if (mismatches.length > 0) {
  console.error(`Version ${expected} does not match:\n- ${mismatches.join('\n- ')}`);
  process.exit(1);
}
console.log(`All pinned versions match ${expected}.`);
