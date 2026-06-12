const UPDATE_NOTICE_KEY = 'qrStudioUpdateNotice';

const clearUpdateBadge = () => {
  chrome.action.setBadgeText({ text: '' });
};

const showUpdateBadge = () => {
  chrome.action.setBadgeText({ text: 'UP' });
  chrome.action.setBadgeBackgroundColor({ color: '#0f766e' });
};

const getStoredNotice = async () => {
  const result = await chrome.storage.local.get(UPDATE_NOTICE_KEY);
  return result[UPDATE_NOTICE_KEY] || null;
};

const clearUpdateNotice = async () => {
  await chrome.storage.local.remove(UPDATE_NOTICE_KEY);
  clearUpdateBadge();
};

const setUpdateNotice = async (notice) => {
  await chrome.storage.local.set({ [UPDATE_NOTICE_KEY]: notice });
  if (notice?.ignored) {
    clearUpdateBadge();
  } else {
    showUpdateBadge();
  }
};

const syncUpdateBadge = async () => {
  const notice = await getStoredNotice();
  if (notice?.version === chrome.runtime.getManifest().version) {
    await clearUpdateNotice();
    return;
  }

  if (notice && !notice.ignored) {
    showUpdateBadge();
  } else {
    clearUpdateBadge();
  }
};

chrome.runtime.onInstalled.addListener(() => {
  syncUpdateBadge();
});

chrome.runtime.onStartup.addListener(() => {
  syncUpdateBadge();
});

chrome.runtime.onUpdateAvailable.addListener((details) => {
  setUpdateNotice({
    version: details.version,
    detectedAt: Date.now(),
    ignored: false,
    readyToApply: true,
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'get-update-notice') {
    getStoredNotice().then((notice) => sendResponse({ notice }));
    return true;
  }

  if (message?.type === 'ignore-update') {
    getStoredNotice()
      .then((notice) => {
        if (!notice) return null;
        return setUpdateNotice({ ...notice, ignored: true });
      })
      .then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message?.type === 'apply-update') {
    clearUpdateBadge();
    sendResponse({ ok: true });
    chrome.runtime.reload();
    return false;
  }

  return false;
});
