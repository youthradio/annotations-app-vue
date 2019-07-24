<template>
  <article class="a-text">
    <v-runtime-template :template="getHTMLHighlights" />
  </article>
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template'

export default {
  name: 'TextBox',
  components: {
    VRuntimeTemplate
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
    getHTMLHighlights () {
      // let htmlOutput = this.textData.replace(/^(.*)(\r\n|\r|\n)/gmiu, '<p>$&</p>') // wrap lines with <p></p> tags

      let htmlOutput = this.textData
      // const tags = Array.from(matchAll(result, /{([^}]+)\}/g)) // match all contetnt between {}

      // const regex = result.map(e => e.trim()).join('|')

      this.commentsData.map((comment, id) => {
        const quotedContent = comment.quotedContentCleaned
        // loop over comment matching selection
        // highlight color depends on selected comment
        const regexEscaped = quotedContent.replace(/[-/\\^$*+?.()[\]{}]/, '\\$&').replace(/\n/g, '\\n') // escape all caracters
        regexEscaped.split('\\n')
          .forEach((line) => {
            const regex = new RegExp(line, 'ui') // build regex
            htmlOutput = htmlOutput.replace(regex, `<span data-cmntid="${id}" @click="hightlightClickEvent" :class="[selectedComment === ${id}? 'highlight': 'highlight-ligth']">$&</span>`) // find and replace with higlights
          })
      })
      htmlOutput = htmlOutput.replace(/^(.*)(\r\n|\r|\n)/gmiu, '<div class="div-p">$&</div>')
      return `<div>${htmlOutput}</div>`
    }
  },
  watch: {
    selectedComment () {
      // watch selected comment to change, scrool comment to screen
      const el = this.$el.querySelector(`span[data-cmntid="${this.selectedComment}"]`)
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  },
  methods: {
    hightlightClickEvent (event) {
      // click envents on comments
      // change seleceted comment, scroll comment to screen
      const cmntid = +event.target.dataset.cmntid // get comment id from span data-id
      event.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      this.$root.$emit('activeComment', {
        commentId: +cmntid
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.a-text {
  position: relative;
  /deep/ .highlight {
    display: inline;
    font-weight: bolder;
    background-color: rgba(255, 255, 0, 1);
  }
  /deep/ .highlight-ligth {
    display: inline;
    font-weight: bolder;
    background-color: rgba(255, 255, 0, 0.3);
  }
}
</style>
