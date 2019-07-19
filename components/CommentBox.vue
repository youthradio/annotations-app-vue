<template>
  <div class="box">
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
    }
  },
  data () {
    return {
    }
  },
  watch: {

  },
  mounted () {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

.box {
  border: 2px solid black;
  margin-top: auto;
  margin-bottom: auto;
  padding: 1rem;
}
</style>
