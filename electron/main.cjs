const { app, BrowserWindow, net, protocol, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const APP_SCHEME = 'qrstudio';
const APP_HOST = 'app';

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

const getAppIndexUrl = () => `${APP_SCHEME}://${APP_HOST}/index.html`;

const registerAppProtocol = () => {
  const distPath = path.join(app.getAppPath(), 'dist');

  protocol.handle(APP_SCHEME, (request) => {
    const url = new URL(request.url);
    const requestedPath = decodeURIComponent(url.pathname);
    const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.slice(1);
    const filePath = path.normalize(path.join(distPath, relativePath));

    if (!filePath.startsWith(distPath)) {
      return new Response('Not found', { status: 404 });
    }

    return net.fetch(pathToFileURL(filePath).toString());
  });
};

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

const showLoadError = (window, details = '') => {
  const safeDetails = escapeHtml(details);
  window.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>QR Studio</title>
          <style>
            body {
              margin: 0;
              min-height: 100vh;
              display: grid;
              place-items: center;
              background: #f2efe6;
              color: #172018;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }
            main {
              max-width: 560px;
              padding: 32px;
            }
            h1 {
              margin: 0 0 12px;
              font-size: 28px;
            }
            p {
              margin: 0;
              line-height: 1.5;
              color: #6f7568;
            }
            code {
              display: block;
              margin-top: 16px;
              overflow-wrap: anywhere;
              color: #9a3412;
            }
          </style>
        </head>
        <body>
          <main>
            <h1>QR Studio could not open.</h1>
            <p>The app could not load its bundled interface. Please reinstall QR Studio from the latest installer.</p>
            ${safeDetails ? `<code>${safeDetails}</code>` : ''}
          </main>
        </body>
      </html>
    `)}`,
  );
};

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 900,
    minHeight: 680,
    title: 'QR Studio',
    backgroundColor: '#f2efe6',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  const indexUrl = getAppIndexUrl();

  window.webContents.on('will-navigate', (event, url) => {
    if (url === indexUrl || url === `${APP_SCHEME}://${APP_HOST}/` || url.startsWith('data:text/html')) return;
    event.preventDefault();
    if (url.startsWith('file:') || url.startsWith(`${APP_SCHEME}:`)) {
      window.loadURL(indexUrl);
      return;
    }
    shell.openExternal(url);
  });

  window.webContents.on('did-fail-load', (_event, code, description, failedUrl) => {
    if (failedUrl === indexUrl) showLoadError(window, `${description} (${code})`);
  });

  window.loadURL(indexUrl).catch((error) => {
    showLoadError(window, error.message);
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
};

app.whenReady().then(() => {
  registerAppProtocol();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
