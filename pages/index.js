import { getSession } from "next-auth/react";
import Head from "next/head";
import Center from "../components/Center";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Spotify2</title>
        <link rel="icon" href="/Spotify_icon.svg" type="image/svg" />
      </Head>
      <div className="bg-black h-screen overflow-hidden">
        <main className="flex">
          {/* sidebar */}
          <Sidebar />
          {/* center */}
          <Center />
        </main>
        <div className="sticky bottom-0">
          {/* palyer */}
          <Player />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
