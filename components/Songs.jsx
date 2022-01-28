import { useRecoilValue } from "recoil";
import { playlistState } from "../Atoms/playlistAtom";
import Song from "./Song";

function Songs() {
  const playlist = useRecoilValue(playlistState);
  // console.log(playlist);
  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 pt-2">
      {playlist?.tracks?.items?.map((item, i) => (
        <Song key={item.track.id} item={item} order={i} />
      ))}
    </div>
  );
}

export default Songs;
