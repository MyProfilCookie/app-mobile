<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Recurrly Expo app. Here is a summary of all changes made:

- **`app.config.js`** (new): Converts `app.json` to a JS config, exposing `posthogProjectToken` and `posthogHost` via `expo-constants` extras.
- **`.env`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- **`lib/posthog.ts`** (new): PostHog client singleton configured from `expo-constants`, with lifecycle event capture, debug mode in dev, and graceful disabled state when the token is absent.
- **`app/_layout.tsx`**: Added `PostHogProvider` wrapping the app, plus a `useEffect` for manual screen tracking with Expo Router (pathname + params), consistent with `captureScreens: false`.
- **`app/(auth)/sign-in.tsx`**: Captures `user_signed_in` + `posthog.identify()` on success, `sign_in_failed` with the error message on failure.
- **`app/(auth)/sign-up.tsx`**: Captures `user_signed_up` + `posthog.identify()` (with `$set_once: { sign_up_date }`) on completion, `sign_up_failed` on error.
- **`app/(tabs)/index.tsx`**: Captures `subscription_card_expanded` / `subscription_card_collapsed` with `subscription_id` and `subscription_name` properties.
- **`app/(tabs)/settings.tsx`**: Captures `user_signed_out` and calls `posthog.reset()` before sign-out.
- **`app/(tabs)/insights.tsx`**: Captures `insights_premium_upsell_viewed` (with `plan` property) when a non-premium user views the Insights tab.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully completes sign-in with email and password | `app/(auth)/sign-in.tsx` |
| `sign_in_failed` | User sign-in attempt fails due to invalid credentials or error | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | User successfully completes account creation and email verification | `app/(auth)/sign-up.tsx` |
| `sign_up_failed` | User sign-up attempt fails due to validation error or API error | `app/(auth)/sign-up.tsx` |
| `subscription_card_expanded` | User taps a subscription card to expand and view its details | `app/(tabs)/index.tsx` |
| `subscription_card_collapsed` | User taps an expanded subscription card to collapse it | `app/(tabs)/index.tsx` |
| `user_signed_out` | User taps the sign-out button in the settings screen | `app/(tabs)/settings.tsx` |
| `insights_premium_upsell_viewed` | Non-premium user views the Insights tab and sees the upgrade prompt | `app/(tabs)/insights.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/705122)
- [New sign-ups (last 30 days)](/insights/yO3PKclG)
- [Sign-ups & sign-ins over time](/insights/0DcEQL4U)
- [Sign-up to first sign-in funnel](/insights/FC4FjM7Y)
- [Sign-in failures over time](/insights/Z79x1rOl)
- [Subscription card engagement & churn signals](/insights/r9JRzPgL)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
