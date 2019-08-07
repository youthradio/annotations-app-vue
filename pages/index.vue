<template>
  <div>
    <div class="container">
      <keep-alive>
        <TextBox
          class="textbox"
          :comments-data="commentsData"
          :text-html="textHTML"
          :selected-comment="selectedComment"
        />
      </keep-alive>
      <div
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
import COMMENTS_DATA from '~/data/data.json'

export default {
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
      return COMMENTS_DATA.comments.sort((a, b) => a.position - b.position)
    },
    textHTML () {
      return COMMENTS_DATA.textHTML
    }
  },
  mounted () {
    window.addEventListener('message', (e) => {
      // Check that message being passed is the documentHeight
      if ((typeof e.data === 'string') &&
          (e.data.includes('iframeTop:') &&
          (e.data.includes('scrollY:')))) {
        const values = e.data.split(',')

        const iframeTop = parseFloat(values[0].split('iframeTop:')[1])
        const scrollY = parseFloat(values[1].split('scrollY:')[1])
        const commentsBox = this.$el.querySelector('.side')
        const totalHeight = this.$el.getBoundingClientRect().height
        const commentsBoxHeight = commentsBox.getBoundingClientRect().height

        if (scrollY > iframeTop && scrollY < iframeTop + totalHeight - commentsBoxHeight) {
          commentsBox.style.top = (scrollY - iframeTop) + 'px'
        }
      }
    }, false)
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
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
}
.a-text {
  order: 1;
  @media screen and (min-width: $responsiveWidth) {
    order: 0;
  }
}
.side {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0px;
  height: 30vh;
  overflow-y: scroll;
  background: white;
  @media screen and (min-width: $responsiveWidth) {
    position: inherit;
    bottom: inherit;
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
