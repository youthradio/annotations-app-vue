<template>
  <article
    class="a-text"
    v-html="getHTMLHighlights"
  />
</template>

<script>
export default {
  name: 'TextBox',
  components: {

  },
  props: {
    commentsData: {
      type: Array,
      default: null,
      require: true
    },
    textData: {
      type: String,
      default: null,
      require: true
    },
    selectedComment: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
    }
  },
  computed: {
    filteredComments () {
      return this.commentsData.map(e => e.quotedFileContent.value)
    },
    getHTMLHighlights () {
      let htmlOutput = this.textData
      const commentsList = this.filteredComments // clean strings to match on regex

      // const tags = Array.from(matchAll(result, /{([^}]+)\}/g)) // match all contetnt between {}

      // const regex = result.map(e => e.trim()).join('|')

      commentsList.map((comment, id) => {
        // loop over comment matching selection
        // highlight color depends on selected comment
        const regexEscaped = comment.replace(/[-/\\^$*+?.()[\]{}]/g, '\\$&') // escape all caracters
        const regex = new RegExp(regexEscaped, 'gi') // build regex
        htmlOutput = htmlOutput.replace(regex, `<span class="${this.selectedComment === id ? 'highlight' : 'highlight-ligth'}">$&</span>`) // find and replace with higlights
      })
      return htmlOutput
    }
  },
  mounted () {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.a-text {
  position: relative;
  /deep/ .highlight {
    font-weight: bolder;
    background-color: rgba(255, 255, 0, 1.0);
  }
  /deep/ .highlight-ligth {
    font-weight: bolder;
    background-color: rgba(255, 255, 0, 0.3);
  }
}
</style>
