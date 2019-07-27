const fsPromises = require('fs').promises
const Gootenberg = require('Gootenberg')
const marked = require('marked')
const removeMd = require('remove-markdown')
const credentials = require('./credentials.json')

const DOC_ID = '1jZqkCsAWyt-_-8huRhveGoHhpKlmasqKFr1iKKOtqSI'

async function getComments () {
  const goot = new Gootenberg()
  await goot.auth.jwt(credentials)

  const comments = await goot.drive.comments(DOC_ID) // get comments data from google DOC_ID
  const resolvedComments = comments.filter(c => !c.resolved)
  const textWithComments = await goot.drive.export(DOC_ID, 'text/plain') // get plain text data from google DOC_ID
  const text = textWithComments
    .split('[a]') // split text from footer comments starting on [a] characters
    .slice(0, 2) // slice text from comments ref on bottom
    .join('') // remove footer and join remaining content
  const textCleaned = text.replace(/[\u200B-\u200D\uFEFF]/gu, '')
  const textNoComments = textCleaned.replace(/\[.\]/gu, '') // remove comments brackets
  const textNoTrailing = removeMd(textNoComments.replace(/\s\s*$/gm, '')) // remove trailing spaces before newlines

  resolvedComments.forEach((comment, id) => {
    const quotedContentCleaned = removeMd(comment.quotedFileContent.value.replace(/\s\s*$/gm, ''))
    const regexEscaped = quotedContentCleaned.replace(/&quot;/g, '"') // remove html
      .replace(/[-/\\^$*+?.()[\]{}/]/gu, '\\$&') // escape all caracters
    const regex = new RegExp(regexEscaped, 'gim') // build regex
    const match = regex.exec(textNoTrailing) // match regex on html text

    comment.position = match.index // return regex position for ordering comments
    comment.quotedContentCleaned = quotedContentCleaned
  })

  // Set options
  // `highlight` example uses `highlight.js`
  marked.setOptions({
    renderer: new marked.Renderer(),
    'baseUrl': null,
    'breaks': false,
    'gfm': false,
    'headerIds': false,
    'headerPrefix': '',
    'highlight': null,
    'mangle': true,
    'pedantic': false,
    'sanitize': false,
    'sanitizer': null,
    'silent': false,
    'smartLists': false,
    'smartypants': false,
    'xhtml': false
  })

  // Compile
  const textHTML = marked(textNoComments) // convert markdown to HTML

  await fsPromises.writeFile(
    './data/data.json',
    JSON.stringify({
      comments: Array.from(resolvedComments),
      textHTML
    }),
    'utf-8'
  )
  console.log('DONE') // eslint-disable-line no-console
}

getComments()
