<template>
  <div>
    <h1>Home page</h1>
    <ul>
      <li
        v-for="markup in markupsData"
        :key="markup.id"
      >
        <nuxt-link :to="`/markup/${markup.slug}`">
          {{ markup.title }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import MARKUPS_DATA from '~/data/data.json'

export default {
  computed: {
    markupsData () {
      return MARKUPS_DATA
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
</style>
