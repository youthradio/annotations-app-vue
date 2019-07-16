<template>
  <div class="container">
    <div class="text" v-html="text" />
  </div>
</template>

<script>
import COMMENTS_DATA from '~/data/data.json'

export default {
  components: {},
  computed: {
    comments() {
      return COMMENTS_DATA.comments
    },
    text() {
      return COMMENTS_DATA.text
    }
  }
}
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
