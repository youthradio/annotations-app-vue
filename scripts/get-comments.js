const fsPromises = require('fs').promises
const Promise = require('bluebird')
const Gootenberg = require('Gootenberg')
const marked = require('marked')
const removeMd = require('remove-markdown')
const docsList = require('./DocsList.js').default
const credentials = require('./credentials.json')

function getComments (docID) {
  return new Promise(async (resolve, reject) => {
    try {
      const goot = new Gootenberg()
      await goot.auth.jwt(credentials)

      const comments = await goot.drive.comments(docID) // get comments data from google DOC_ID
      const resolvedComments = comments.filter(c => !c.resolved)
      const textWithComments = await goot.drive.export(docID, 'text/plain') // get plain text data from google DOC_ID
      const text = textWithComments
        .split('[a]') // split text from footer comments starting on [a] characters
        .slice(0, 2) // slice text from comments ref on bottom
        .join('') // remove footer and join remaining content
      const textCleaned = text.replace(/[\u200B-\u200D\uFEFF]/gu, '')
      const textNoComments = textCleaned.replace(/\[.\]/gu, '') // remove comments brackets
      const textNoTrailing = removeMd(textNoComments.replace(/\s\s*$/gm, '')) // remove trailing spaces before newlines

      resolvedComments.forEach((comment, id) => {
        const quotedContentCleaned = removeMd(
          comment.quotedFileContent.value.replace(/\s\s*$/gm, '')
        )
        const regexEscaped = quotedContentCleaned
          .replace(/&quot;/g, '"') // remove html
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
        baseUrl: null,
        breaks: false,
        gfm: false,
        headerIds: false,
        headerPrefix: '',
        highlight: null,
        mangle: true,
        pedantic: false,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        xhtml: false
      })

      // Compile
      const textHTML = marked(textNoComments) // convert markdown to HTML

      resolve({
        comments: Array.from(resolvedComments),
        textHTML
      })
      console.log('DONE', docID)
    } catch (e) {
      console.log('ERRRO:', docID, e)
      reject(e)
    }
  })
}

function getAllComments () {
  const allDocs = []
  Promise.map(
    docsList,
    async (doc) => {
      await getComments(doc.id).then((d) => {
        allDocs.push(Object.assign(doc, d))
      })
    },
    { concurrency: 30 }
  ).then(async () => {
    await fsPromises.writeFile(
      './data/data.json',
      JSON.stringify(allDocs),
      'utf-8'
    )
    console.log('done')
  })
}

getAllComments()
