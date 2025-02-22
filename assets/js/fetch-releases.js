async function fetchLatestRelease(owner, repo) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

function formatFileSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function generateTable(release) {
  const releaseInfo = document.getElementById('release-info');
  const releaseList = document.getElementById('release-list');

  // Add release information
  releaseInfo.innerHTML = `
      <h3>${release.name || 'Latest Release'}</h3>
      <p>${release.body || 'No description available.'}</p>
      <p class="text-muted">Released on: ${new Date(
        release.published_at
      ).toLocaleDateString()}</p>
    `;

  // Clear loading message
  releaseList.innerHTML = '';

  // Add each asset as a table row
  release.assets.forEach((asset) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${asset.name}</td>
        <td>${formatFileSize(asset.size)}</td>
        <td>
          <a href="${
            asset.browser_download_url
          }" class="btn btn-primary btn-sm" 
             download target="_blank">
            <i class="fas fa-download"></i> Unduh
          </a>
        </td>
      `;
    releaseList.appendChild(row);
  });
}

async function main() {
  const owner = 'rizkikotet-dev';
  const repo = 'RTA-WRT';

  try {
    const release = await fetchLatestRelease(owner, repo);
    generateTable(release);
  } catch (error) {
    console.error('Error fetching release:', error);
    document.getElementById('release-list').innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-danger">
            Error loading release data. Please try again later.
          </td>
        </tr>
      `;
  }
}

document.addEventListener('DOMContentLoaded', main);
