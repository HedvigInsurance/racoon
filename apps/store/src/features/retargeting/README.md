# CRM Re-targeting

This feature is responsible for the re-targeting of users that didn't checkout their cart.

## How it works

1. An email is triggered to the user with a link to `/:locale/session/resume`.
2. When the page is loaded, it shows a loading indicator while making a request to `/api/retargeting/:shop-session-id`.
3. The user is redirected based on a number of conditions.

## How to test

1. Create a new shop session

2. Get a price for one or more products

3. Go to the cart, open the page debugger, and copy the re-targeting link

4. Open the link in a new tab

## Good to know

- The re-targeting link requires a shop session ID. However, the page accepts it as a query param. The reason is so we can render the page statically and be able to show a loading UI while the request is being made.
