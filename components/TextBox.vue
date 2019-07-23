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
    quotedContentList () {
      return this.commentsData.map(e => e.quotedContentCleaned)
    },
    getHTMLHighlights () {
      let htmlOutput = this.textData
      // const tags = Array.from(matchAll(result, /{([^}]+)\}/g)) // match all contetnt between {}

      // const regex = result.map(e => e.trim()).join('|')

      this.quotedContentList.map((comment, id) => {
        // loop over comment matching selection
        // highlight color depends on selected comment
        const regexEscaped = comment.replace(/[-/\\^$*+?.()[\]{}]/g, '\\$&') // escape all caracters
        const regex = new RegExp(regexEscaped, 'gui') // build regex
        htmlOutput = htmlOutput.replace(regex, `<span class="${this.selectedComment === id ? 'highlight' : 'highlight-ligth'}">$&</span>`) // find and replace with higlights
      })
      return htmlOutput
    }
  },
  mounted () { },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.a-text {
  position: relative;
  /deep/ .highlight {
    font-weight: bolder;
    background-color: rgba(255, 255, 0, 1);
  }
  /deep/ .highlight-ligth {
    font-weight: bolder;
    background-color: rgba(255, 255, 0, 0.3);
  }
}
</style>
