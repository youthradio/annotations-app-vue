<template>
  <div
    :class="['box', isSelected? 'selected' : 'unselected' ]"
    @click="clickEvent"
  >
    {{ commentText }}
  </div>
</template>

<script>
export default {
  name: 'CommentBox',
  components: {

  },
  props: {
    commentText: {
      type: String,
      default: null,
      require: true
    },
    commentId: {
      type: Number,
      default: null,
      require: true
    },
    isSelected: {
      type: Boolean,
      default: false,
      require: true
    }
  },
  data () {
    return {
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    clickEvent () {
      this.$root.$emit('activeComment', {
        commentId: this.commentId
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '~@/css/vars';

.box {
  border: 1px solid rgb(0, 0, 0);
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: white;
  padding: 1em;
  margin-left: 1.5em;
  margin-right: 1.5em;
  font-size: $scale / 2 * 1rem;
  @media screen and (min-width: $responsiveWidth) {
    max-width: 18em;
    margin-top: auto;
    margin-bottom: auto;
  }
}
.selected {
  transform: translate(-1em, -1em);
  box-shadow: 2px 2px 5px black;
  transition: all 300ms;
}
.unselected {
  transition: all 300ms;
}
</style>
