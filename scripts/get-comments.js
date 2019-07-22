const fsPromises = require('fs').promises
const Gootenberg = require('Gootenberg')
const credentials = require('./credentials.json')

const DOC_ID = '1fMO25KNG1IVNHbvq5u4JOxFndr1FhN4A_2UMaEm27n0'

async function getComments () {
  const goot = new Gootenberg()
  await goot.auth.jwt(credentials)

  const comments = await goot.drive.comments(DOC_ID)
  const textWithComments = await goot.drive.export(DOC_ID, 'text/plain')
  const text = textWithComments
    .split('[a]')
    .slice(0, 2) // slice text from comments ref on bottom
    .join('')
  const textCleaned = text.replace(/[\u200B-\u200D\uFEFF]/g, '')
  const textNoComments = textCleaned.replace(/\[.\]/g, '') // remove comments brackets
  const textHtml = textNoComments.replace(/^(.*)(\r\n|\r|\n)/gm, '<p>$&</p>') // wrap lines with <p></p> tags

  comments.forEach((comment, id) => {
    const regexEscaped = comment.quotedFileContent.value.replace(/[-/\\^$*+?.()[\]{}]/g, '\\$&') // escape all caracters
    const regex = new RegExp(regexEscaped, 'gi')
    const match = regex.exec(textHtml)
    comment.position = match.index
  })
  await fsPromises.writeFile(
    './data/data.json',
    JSON.stringify({
      comments,
      text: textHtml
    }),
    'utf-8'
  )
  console.log('DONE') // eslint-disable-line no-console
}

getComments()
