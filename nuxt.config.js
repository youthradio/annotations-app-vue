import { readFileSync } from 'fs'
import docsList from './scripts/DocsList.js'

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  router: {
    base: '/annotations-app-vue/'
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://yr.media/statics/yr-media-typography/yr-typography.css' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/eslint-module'],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    optimization: {
      splitChunks: {
        minChunks: 1,
        maxAsyncRequests: 1,
        maxInitialRequests: 1
      }
    },
    extend (config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common'
    }
  },
  // Generate dynamic routes
  generate: {
    routes: docsList.map(e => `/markup/${e.slug}`)
  },
  server: {
    https: {
      key: readFileSync(`${process.env.HOME}/https/localhost.key`),
      cert: readFileSync(`${process.env.HOME}/https/localhost.crt`)
    }
  }
}
