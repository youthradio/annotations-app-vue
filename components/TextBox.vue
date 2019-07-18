<template>
  <div
    role="article"
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
      const html = this.textData
      const result = this.filteredComments // clean strings to match on regex

      // const tags = Array.from(matchAll(result, /{([^}]+)\}/g)) // match all contetnt between {}
      const regex = result.map(e => e.trim()).join('|')
      console.log(regex)
      const regexEscaped = regex.replace(/[-/\\^$*+?.()[\]{}]/g, '\\$&') // escape all caracters
      const rg = new RegExp(regexEscaped, 'gi')
      return html.replace(rg, '<span class="highlight">$&</span>') // find and replace with higlights
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
    background-color: rgba(255, 255, 0, 0.8);
  }
}
</style>
