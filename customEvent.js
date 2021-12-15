var contextMenuItem = {
  id: 'removeLink',
  title: 'Remove link',
  contexts: ['link'],
};

chrome.contextMenus.create(contextMenuItem);
