// app.config.js - Extends app.json with runtime extras (PostHog config, etc.)
// Environment variables are read at build time here, then exposed via expo-constants.
const appJson = require('./app.json')

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.POSTHOG_HOST,
    },
  },
}
