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

  // Add release information with Chirpy styling
  releaseInfo.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h4 class="card-title mb-3">${release.name || 'Latest Release'}</h4>
          <div class="card-text mb-3">${
            release.body || 'No description available.'
          }</div>
          <div class="text-muted">
            <i class="far fa-calendar-alt"></i> 
            Released on: ${new Date(release.published_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    `;

  // Store assets globally for search function
  window.releaseAssets = release.assets;

  // Initial table population
  populateTable(release.assets);

  // Setup search functionality
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', handleSearch);
}

function populateTable(assets) {
  const releaseList = document.getElementById('release-list');
  const noResults = document.getElementById('noResults');

  if (assets.length === 0) {
    noResults.classList.remove('d-none');
    releaseList.innerHTML = '';
    return;
  }

  noResults.classList.add('d-none');
  releaseList.innerHTML = assets
    .map(
      (asset) => `
      <tr>
        <td class="text-break">${asset.name}</td>
        <td class="text-nowrap">${formatFileSize(asset.size)}</td>
        <td class="text-center">
          <a href="${asset.browser_download_url}" 
             class="btn-download text-decoration-none" 
             download 
             target="_blank">
            <i class="fas fa-download"></i>
          </a>
        </td>
      </tr>
    `
    )
    .join('');
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredAssets = window.releaseAssets.filter((asset) =>
    asset.name.toLowerCase().includes(searchTerm)
  );
  populateTable(filteredAssets);
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
            <i class="fas fa-exclamation-circle"></i>
            Error loading release data. Please try again later.
          </td>
        </tr>
      `;
  }
}

document.addEventListener('DOMContentLoaded', main);
