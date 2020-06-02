<template>
  <div>
    <div
      ref="container"
      class="container"
    >
      <keep-alive>
        <TextBox
          class="textbox"
          :comments-data="commentsData"
          :text-html="textHTML"
          :feature-color="textColor"
          :selected-comment="selectedComment"
        />
      </keep-alive>
      <div
        ref="side"
        class="side"
        role="comments"
      >
        <header>
          <h4>Mark-ups</h4>
        </header>
        <CommentBox
          v-for="(comment,ind) in commentsData"
          :key="`comment-item-${ind}`"
          :comment-id="ind"
          :feature-color="textColor"
          :comment-text="comment.content"
          :is-selected="selectedComment === ind"
        />
      </div>
    </div>
  </div>
</template>

<script>
// import matchAll from 'string.prototype.matchall'
import ResizeObserver from 'resize-observer-polyfill'
import CommentBox from '~/components/CommentBox'
import TextBox from '~/components/TextBox'
import MARKUPS_DATA from '~/data/data.json'
import { ViewportObservabler, clamp } from '~/util/ViewportObservabler.js'

export default {
  head () {
    return {
      title: this.markupdata.title
    }
  },
  components: {
    CommentBox,
    TextBox
  },
  data () {
    return {
      selectedComment: null
    }
  },
  computed: {
    commentsData () {
      const copy = this.markupdata.comments.slice()
      return copy.sort((a, b) => a.position - b.position)
    },
    textHTML () {
      return this.markupdata.textHTML
    },
    textColor () {
      return this.markupdata.textColor
    }
  },
  async asyncData (ctx) {
    const slug = await ctx.params.slug
    return {
      markupdata: MARKUPS_DATA.find(e => e.slug === slug)
    }
  },
  mounted () {
    const commentsBox = this.$refs.side
    const container = this.$refs.container
    this.makeSticky(container, commentsBox, { interval: 0, transition: 75, offset: 68 })

    this.$root.$on('activeComment', this.activeComment)

    const elementRoot = this.$root.$el
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const {
          height
        } = entry.contentRect
        const elementHeight = 'elementHeight:' + height
        // console.log(elementHeight)
        parent.postMessage(elementHeight, '*')
      }
    })
    resizeObserver.observe(elementRoot)
  },
  methods: {
    activeComment ({ commentId }) {
      this.selectedComment = commentId
      console.log('activeIII', commentId)
    },
    makeSticky (context, element, { transition = 75, offset = 0, interval = 0 }) {
      element.style.transition = `top ${transition}ms ease-in`
      const update = () => {
        if (window.innerWidth < 800) {
          element.style.position = 'absolute'
        } else {
          element.style.position = 'unset'
        }
      }
      window.addEventListener('resize', update)
      update()

      const observabler = new ViewportObservabler(([top, bottom]) => {
        const rc = context.getBoundingClientRect()
        const rs = element.getBoundingClientRect()
        element.style.top = clamp(0, rc.height - rs.height, top - rc.top + offset) + 'px'
      }, { interval })
      return () => { observabler.disconnect() }
    }
  }
}
</script>

<style lang="scss">
// @import '~@/css/fonts';
@import '~@/css/vars';
@import '~@/css/base';

.container {
  display: flex;
  justify-content: center;
  position: relative;
  flex-wrap: wrap;
  @media screen and (min-width: $responsiveWidth) {
    flex-wrap: nowrap;
  }
}
.side {
  display: flex;
  flex-direction: column;
  height: 20vh;
  bottom: 0px;
  overflow-y: scroll;
  background: white;
  @media screen and (min-width: $responsiveWidth) {
    position: inherit;
    bottom: inherit;
    top: inherit;
    height: inherit;
    overflow-y: inherit;
    background: inherit;
  }
  header {
    position: sticky;
    top: 0px;
    background-color: white;
    z-index: 100;
  }
}
.arrows-flex {
  display: flex;
  justify-content: space-around;
  margin-top: 1em;
}
.arrow {
  color: $sky-blue;
  font-size: 2em;
}
.pulse {
  cursor: pointer;
  animation-duration: 0.5s;
  animation-name: pulse;
  animation-direction: alternate;
  animation-iteration-count: infinite;
}
@keyframes pulse {
  from {
    transform: translateX(-5px);
  }
  to {
    transform: translateX(0px);
  }
}
</style>
