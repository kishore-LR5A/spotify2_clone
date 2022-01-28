import { getProviders, signIn } from "next-auth/react";
function Login({ providers }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <img className="w-10 h-10" src="/Spotify_icon.svg" alt="spotify_logo" />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-3 rounded-full"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps(context) {
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const providers = await getProviders();
  // console.log("providers", providers);
  return {
    props: {
      providers,
    },
  };
}
