# Car Dealership

## Manual testing (goal)

- Step 1: create car trial (ssn, registration number) => Car Trial ID

- Step 2: go to link: http://localhost:8040/se/car-trials?id={CAR_TRIAL_ID}

  > Exact link is pending

- Step 3: submit the form and go through checkout

## Manual testing (now)

- Step 1: Create Shop Session (ssn, registration number) => Shop Session ID

  ```bash
  curl -X POST \
    http://localhost:8040/api/car-trials \
    -H 'Content-Type: application/json' \
    -d '{
      "ssn": "199001011234"
    }'
  ```

- Step 2: go to link: http://localhost:8040/se/car-trials?id={SHOP_SESSION_ID}

- Step 3: page fetches Shop Session and extracts Price Intent

- Step 4: submit the form and go through checkout
