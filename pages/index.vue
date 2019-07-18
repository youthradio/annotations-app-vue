<template>
  <div class="container">
    <TextBox
      class="margin"
      :comments-data="commentsData"
      :text-data="textData"
    />
    <div role="aside">
      <CommentBox
        v-for="(comment,ind) in commentsData"
        :key="`comment-item-${ind}`"
        :comment-text="comment.content"
      />
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
  computed: {
    commentsData () {
      return COMMENTS_DATA.comments
    },
    textData () {
      return COMMENTS_DATA.text
    }
  }
}
</script>

<style lang="scss">
@import '~@/css/fonts';
@import '~@/css/vars';
@import '~@/css/base';

</style>
