const puppeteer = require('puppeteer')

const baseURL = 'https://www.residences.in.th'

const app = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`${baseURL}/browse/bts_mrt`)

  const urls = await page.evaluate(() => {
    const es = document.querySelectorAll(
      '.filterable-item > .locations_link > a',
    )
    return Array.from(es, v => ({
      station: v.textContent.trim(),
      link: v.href,
    }))
  })

  await page.goto(urls[0].link)
  const results = await page.evaluate(() => {
    const es = Array.from(document.querySelectorAll('.residences-info'))
    return es.map(e => {
      const name = e.querySelector('.residences-name > h3 > a')
      return {
        name: name && name.innerText,
        // address: e.querySelector('.residences-address').innerText,
        // price: e.querySelector('.price > .number').innerText,
      }
    })
  })

  console.log(results)

  await browser.close()
}
app().catch(console.log)
