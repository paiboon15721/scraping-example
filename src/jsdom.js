const { JSDOM } = require('jsdom')

const dom = new JSDOM('', {
  url: 'https://example.org/',
  referrer: 'https://example.com/',
  contentType: 'text/html',
  includeNodeLocations: true,
  storageQuota: 10000000,
})
console.log(dom.window.document.body.textContent)
