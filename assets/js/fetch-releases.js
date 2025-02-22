async function fetchLatestRelease(owner, repo) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

function generateMarkdown(release) {
  let markdown = `# Daftar File Rilis Terbaru\n\nBerikut adalah daftar file dari rilis terbaru:\n\n`;

  release.assets.forEach((asset) => {
    markdown += `- [${asset.name}](${asset.browser_download_url}) - ${asset.size} bytes\n`;
  });

  markdown += `\nSilakan klik pada nama file untuk mengunduhnya.`;
  return markdown;
}

async function main() {
  const owner = 'rizkikotet-dev'; // Ganti dengan username GitHub Anda
  const repo = 'RTA-WRT'; // Ganti dengan nama repositori Anda

  try {
    const release = await fetchLatestRelease(owner, repo);
    const markdown = generateMarkdown(release);
    document.getElementById('release-list').innerText = markdown; // Menampilkan hasil di elemen dengan id 'release-list'
  } catch (error) {
    console.error('Error fetching release:', error);
  }
}

document.addEventListener('DOMContentLoaded', main);
