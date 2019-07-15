<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        annotations-app-vue
      </h1>
      <h2 class="subtitle">
        My unreal Nuxt.js project
      </h2>
      <div class="links">
        <div class="comments">
          <ul>
            <li v-for="comment in comments" :key="comment">
              {{ comment.content }}
            </li>
          </ul>
        </div>
        <div class="text" v-html="text" />
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import COMMENTS_DATA from '~/data/data.json'

export default {
  components: {
    Logo
  },
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
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
