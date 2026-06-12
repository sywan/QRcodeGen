const openButton = document.querySelector('#open-app');
const versionText = document.querySelector('#extension-version');
const updateNotice = document.querySelector('#update-notice');
const updateVersion = document.querySelector('#update-version');
const ignoreUpdateButton = document.querySelector('#ignore-update');
const applyUpdateButton = document.querySelector('#apply-update');
const currentVersion = chrome.runtime.getManifest().version;

versionText.textContent = currentVersion;

const sendRuntimeMessage = (message) =>
  new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => resolve(response));
  });

const showUpdateNotice = (notice) => {
  if (!notice || notice.ignored || notice.version === currentVersion) {
    updateNotice.hidden = true;
    return;
  }

  updateVersion.textContent = `version ${notice.version}`;
  updateNotice.hidden = false;
};

const refreshUpdateNotice = async () => {
  const response = await sendRuntimeMessage({ type: 'get-update-notice' });
  showUpdateNotice(response?.notice);
};

openButton?.addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('app/index.html') });
});

ignoreUpdateButton?.addEventListener('click', async () => {
  await sendRuntimeMessage({ type: 'ignore-update' });
  updateNotice.hidden = true;
});

applyUpdateButton?.addEventListener('click', async () => {
  applyUpdateButton.disabled = true;
  applyUpdateButton.textContent = 'Upgrading...';
  await sendRuntimeMessage({ type: 'apply-update' });
});

refreshUpdateNotice();
