/****
 * --------------------------------------
 * MAKE API SECURE
 * --------------------------------------
 * The person, who should have access:
 * 
 * Concept_________
 * 1. Assign two tokens for each person.(access token, refresh token)
 * 2. Access token contains: Users identification(email, role etc) and valid for a short duration
 * 3. Refresh token is used to recreate an access token that was expired.
 * 4. If refresh token is invalid then logout the user.
*/

/**
 * JWT------------------------------>>>>>>>>>>>>>>>(Json web Token)
 * 1. Generate a token by using jwt.sign
 * 2. Create API set to cookie. http only, secure, sameSite
 * 3. From client side:
 *  ------------------with credentials: true
 * 4. CORS setup origin: URL and credentials: true
*/

/**
 * --------------------------->>>>>>>>>>>>>>>>>>>>>>>>For the secure API calls
 * 1. On server side, install cookie parser and use it as a middleware
 * 2. Get the cookies from req.cookies
 * 
 * 3. On client side: Make API calls using AXIOS with credentials: true Or using fetch: Credentials: 'include'
*/