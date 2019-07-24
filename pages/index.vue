<template>
  <div>
    <div class="container">
      <keep-alive>
        <TextBox
          class="textbox"
          :comments-data="commentsData"
          :text-data="textData"
          :selected-comment="selectedComment"
        />
      </keep-alive>
      <div
        class="side"
        role="comments"
      >
        <header>
          <h3>Comments</h3>
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
    <div
      role="menu"
      class="arrows-flex"
    >
      <span class="icon-arrow-left arrow pulse" />
      <span class="icon-arrow-right arrow pulse" />
    </div>
  </div>
</template>

<script>
// import matchAll from 'string.prototype.matchall'
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
    textData () {
      return COMMENTS_DATA.text
    }
  },
  mounted () {
    this.$root.$on('activeComment', this.activeComment)
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
@import '~@/css/fonts';
@import '~@/css/vars';
@import '~@/css/base';

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.side {
  display: flex;
  flex-direction: column;
  position: sticky;
  bottom: 0px;
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
  header{
    position: sticky;
    top:0px;
    background-color: white;
    z-index: 1000;
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
