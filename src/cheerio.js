const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs').promises

const fetch = axios.create({
  baseURL: 'https://www.residences.in.th',
})

const fetchStation = async link => {
  const { data } = await fetch.get(link)
  const $ = cheerio.load(data)
  const dorms = $('.residences-info')
    .map((_, e) => {
      const target = $(e)
      return {
        name: target.find('.residences-name > h3 > a').text(),
        address: target.find('.residences-address').text(),
        price: target.find('.price > .number').text(),
      }
    })
    .get()
  return dorms
}

const app = async () => {
  const { data } = await fetch.get('/browse/bts_mrt')
  const $ = cheerio.load(data)
  const urls = $('.filterable-item > .locations_link > a')
    .map((_, e) => {
      const target = $(e)
      return { station: target.text().trim(), link: target.attr('href') }
    })
    .get()

  for (const url of urls) {
    console.log(`Fetching ${url.station}`)
    const dorms = await fetchStation(url.link)
    await fs.writeFile(
      `${path.join('cheerio', url.station)}.json`,
      JSON.stringify(dorms),
    )
  }
}

app().catch(console.log)
