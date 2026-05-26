# Deployment instructions

## 1. Update env variables
- Remove the `VITE_COGNITO_USER_POOL_ID` and `VITE_COGNITO_CLIENT_ID` from the `.env.production` file
- Run 
```bash
npx dotenvx set VITE_COGNITO_USER_POOL_ID "<user_pool_id>" -f .env.production
npx dotenvx set VITE_COGNITO_CLIENT_ID "<client_id>" -f .env.production
```