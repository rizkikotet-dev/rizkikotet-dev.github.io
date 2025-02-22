async function fetchAllReleases(owner, repo) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases`
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

function setupReleaseSelector(releases) {
  const selector = document.getElementById('releaseSelector');
  selector.innerHTML = releases
    .map(
      (release) => `
      <option value="${release.id}">
        ${release.name || release.tag_name}
      </option>
    `
    )
    .join('');

  // Store releases globally
  window.allReleases = releases;

  // Set up event listener
  selector.addEventListener('change', (event) => {
    const selectedRelease = releases.find(
      (r) => r.id.toString() === event.target.value
    );
    if (selectedRelease) {
      populateTable(selectedRelease.assets);
      // Reset search
      document.getElementById('searchInput').value = '';
    }
  });

  // Initially populate with first release
  if (releases.length > 0) {
    populateTable(releases[0].assets);
  }
}

function populateTable(assets) {
  const releaseList = document.getElementById('release-list');
  const noResults = document.getElementById('noResults');

  if (assets.length === 0) {
    noResults.classList.remove('hidden');
    releaseList.innerHTML = '';
    return;
  }

  noResults.classList.add('hidden');
  releaseList.innerHTML = assets
    .map(
      (asset) => `
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 break-all">
          ${asset.name}
        </td>
        <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
          ${formatFileSize(asset.size)}
        </td>
        <td class="px-4 py-3 text-center">
          <a href="${asset.browser_download_url}" 
             class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors" 
             download 
             target="_blank"
             title="Download ${asset.name}">
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
  const selectedReleaseId = document.getElementById('releaseSelector').value;
  const selectedRelease = window.allReleases.find(
    (r) => r.id.toString() === selectedReleaseId
  );

  if (selectedRelease) {
    const filteredAssets = selectedRelease.assets.filter((asset) =>
      asset.name.toLowerCase().includes(searchTerm)
    );
    populateTable(filteredAssets);
  }
}

async function main() {
  const owner = 'rizkikotet-dev';
  const repo = 'RTA-WRT';

  try {
    const releases = await fetchAllReleases(owner, repo);
    setupReleaseSelector(releases);

    // Setup search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
  } catch (error) {
    console.error('Error fetching releases:', error);
    document.getElementById('release-list').innerHTML = `
        <tr>
          <td colspan="3" class="px-4 py-3 text-center text-red-600 dark:text-red-400">
            <i class="fas fa-exclamation-circle mr-2"></i>
            Error loading release data. Please try again later.
          </td>
        </tr>
      `;

    document.getElementById('releaseSelector').innerHTML = `
        <option value="">Error loading releases</option>
      `;
  }
}

document.addEventListener('DOMContentLoaded', main);
