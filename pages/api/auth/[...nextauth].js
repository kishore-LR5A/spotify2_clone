import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

// import NextAuth from "next-auth";
// import SpotifyProvider from "next-auth/providers/spotify";
// import spotifyApi, { LOGIN_URL } from "../../../utils/spotify";

const refreshAccessToken = async (token) => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    const { body: refreshToken } = await spotifyApi.refreshAccessToken();
    return {
      ...token,
      accessToken: refreshToken.access_token,
      accessTokenExpires: Date.now + refreshToken.expires_in * 1000,
      refreshToken: refreshToken.refresh_token ?? token.refreshToken,
    };
  } catch (e) {
    console.error(e);
    return {
      token,
      error: "RefreshTokenError",
    };
  }
};

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),

    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ user, token, account }) {
      if (user && account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        };
      }
      //return previous token if the access token is still valid
      if (Date.now() < token.accesTokenExpires) {
        console.log("Existing access token is valid");
        return token;
      }
      // if the access token has expired we need to refresh it
      console.log("Access Token has expired, Refreshing...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});

// async function refreshAccessToken(token) {
//   try {
//     spotifyApi.setAccessToken(token.accessToken);
//     spotifyApi.setRefreshToken(token.refreshToken);
//     const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
//     console.log("refreshedToken", refreshedToken);
//     return {
//       ...token,
//       accessToken: refreshedToken.access_token,
//       accesTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
//       //Refresh if new one comes back or fallback to old one.
//       refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       ...token,
//       error: "Refreshing access token failed with error",
//     };
//   }
// }

// export default NextAuth({
//   // Configure one or more authentication providers
//   providers: [
//     SpotifyProvider({
//       clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
//       clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
//       authorization: LOGIN_URL,
//     }),

//     // ...add more providers here
//   ],
//   secret: process.env.JWT_SECRET,
//   pages: {
//     signIn: "/login",
//   },
//   // session: { strategy: "jwt" },
//   callbacks: {
//     async jwt({ token, account, user }) {
//       // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//       //intial sign in
//       if (account && user) {
//         return {
//           ...token,
//           accessToken: account.access_token,
//           refreshToken: account.refresh_token,
//           username: account.providerAccountId,
//           accesTokenExpires: account.expires_at * 1000, //we are handling expiry time in milliseconds
//         };
//       }
//       //return previous token if the access token is still valid
//       if (Date.now() < token.accesTokenExpires) {
//         console.log("Existing access token is valid");
//         return token;
//       }
//       // if the access token has expired we need to refresh it
//       console.log("Access Token has expired, Refreshing...");
//       return await refreshAccessToken(token);
//     },
//     async session({ token, session }) {
//       session.user.accessToken = token.accessToken;
//       session.user.refreshToken = token.refreshToken;
//       session.user.username = token.username;
//     },
//   },
// });
