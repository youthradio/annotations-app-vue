<template>
  <div class="container">
    <div class="text" v-html="text" />
  </div>
</template>

<script>
import matchAll from 'string.prototype.matchall'
import COMMENTS_DATA from '~/data/data.json'

export default {
  components: {},
  computed: {
    comments () {
      return COMMENTS_DATA.comments
    },
    filteredComments () {
      return this.comments.map(e => e.content)
    },
    text () {
      return COMMENTS_DATA.text
    },
    getHTMLHighlights () {
      const html = this.text
      const result = this.filteredComments // clean strings to match on regex

      const tags = Array.from(matchAll(result, /{([^}]+)\}/g)) // match all contetnt between {}
      const regex = tags.map(e => e[1]).join('|')
      const regexEscaped = regex.replace(/[-/\\^$*+?.()[\]{}]/g, '\\$&') // escape all caracters
      const rg = new RegExp(regexEscaped, 'gi')
      return html.replace(rg, '<span class="highlight">$&</span>') // find and replace with higlights
    },
  },
}
</script>

<style lang="scss">
// .container {
//   margin: 0 auto;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
.container {
  /deep/ .highlight {
    font-weight: bolder;
    background-color: rgba(255, 255, 0, 0.8);
  }
}
</style>
