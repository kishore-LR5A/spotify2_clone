import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  //   "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
].join(",");

// const params = {
//   scope: scopes,
// };

// const queryParamString = new URLSearchParams(params).toString();
// const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString}`;

// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
//   clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
//   //   redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
// });

// export default spotifyApi;
// export { LOGIN_URL };

// import SpotifyWebApi from "spotify-web-api-node";
// const scopes = [
//   "user-read-playback-state",
//   "user-modify-playback-state",
//   "user-read-currently-playing",
//   "user-read-private",
//   "user-read-email",
//   "user-follow-modify",
//   "user-follow-read",
//   "user-library-read",
//   "streaming",
//   "app-remote-control",
//   "user-read-playback-position",
//   "user-top-read",
//   "user-read-recently-played",
//   "playlist-modify-private",
//   "playlist-read-collaborative",
//   "playlist-read-private",
//   "playlist-modify-public",
// ].join(",");

const params = {
  scope: scopes,
};
const queryParams = new URLSearchParams(params);

export const LOGIN_URL =
  "https://accounts.spotify.com/authorize?" + queryParams.toString();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;
// export { LOGIN_URL };
