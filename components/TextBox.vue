<template>
  <article class="a-text">
    <v-runtime-template :template="getHTMLHighlights" />
  </article>
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template'
import scrollIntoView from 'scroll-into-view-if-needed'

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
    textHtml: {
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
      firstCommentClick: true
    }
  },
  computed: {
    getHTMLHighlights () {
      // let htmlOutput = this.textData.replace(/^(.*)(\r\n|\r|\n)/gmiu, '<p>$&</p>') // wrap lines with <p></p> tags

      // let htmlOutput = this.textData
      let htmlOutput = this.textHtml
      // const tags = Array.from(matchAll(result, /{([^}]+)\}/g)) // match all contetnt between {}

      // const regex = result.map(e => e.trim()).join('|')
      this.commentsData.map((comment, id) => {
        const quotedContent = comment.quotedContentCleaned
        // loop over comment matching selection
        // highlight color depends on selected comment
        const regexEscaped = quotedContent.replace(/\n/gu, '\\n') // escape all caracters
        regexEscaped.split('\\n')
          .forEach((line) => {
            const escapedline = line.replace(/[-/\\^$*+?.()[\]{}]/gu, '\\$&')
            const regex = new RegExp(escapedline, 'i') // build regex
            htmlOutput = htmlOutput.replace(regex, `
              <span data-cmntid="${id}" @click="hightlightClickEvent" :class="[selectedComment === ${id}? 'highlight': 'highlight-ligth']">
              $&
              ${id < 1 ? `<span v-if="firstCommentClick" class="click-anima"/>` : ``}
              </span>`) // find and replace with higlights
          })
      })
      // htmlOutput = htmlOutput.replace(/^(.*)(\r\n|\r|\n)/gmiu, '<div class="div-p">$&</div>')
      return `<div>${htmlOutput}</div>`
    }
  },
  watch: {
    selectedComment () {
      if (this.firstCommentClick) { this.firstCommentClick = false }

      // watch selected comment to change, scrool comment to screen
      const el = this.$el.querySelector(`span[data-cmntid="${this.selectedComment}"]`)
      scrollIntoView(el, { behavior: 'smooth', block: 'center', inline: 'center', scrollMode: 'if-needed' })
    }
  },
  methods: {
    hightlightClickEvent (event) {
      if (this.firstCommentClick) { this.firstCommentClick = false }
      // click envents on comments
      // change seleceted comment, scroll comment to screen
      const cmntid = +event.target.dataset.cmntid // get comment id from span data-id
      scrollIntoView(event.target, { behavior: 'smooth', block: 'center', inline: 'center', scrollMode: 'if-needed' })
      this.$root.$emit('activeComment', {
        commentId: +cmntid
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '~@/css/vars';

.a-text {
  position: relative;
}
.highlight {
  display: inline;
  font-weight: bolder;
  background-color: rgba($dusk, 1);
}
.highlight-ligth {
  position: relative;
  display: inline;
  font-weight: bolder;
  background-color: rgba($dusk, 0.3);
  cursor: pointer;
}
.click-anima {
  z-index: -100;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  // margin: 100px auto;
  background-color: #333;
  border-radius: 100%;
  animation: scaleout 1s infinite ease-in-out;
}

@keyframes scaleout {
  0% {
    transform: translate(-20px, -20px) scale(0);
  }
  100% {
    transform: translate(-20px, -20px) scale(1.2);
    opacity: 0.2;
  }
}
</style>
