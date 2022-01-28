import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeOffIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../Atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(70);

  const songInfo = useSongInfo();
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now Playing: ", data.body?.item);
        setCurrentTrackId(data.body?.item?.id);
        spotifyApi
          .getMyCurrentPlaybackState()
          .then((data) => {
            setIsPlaying(data.body?.is_playing);
          })
          .catch(() => {});
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      //  fetch the song info
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);
  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };
  useEffect(() => {
    if (volume > 0 && volume <= 100) {
      debounceAdjustVolume(volume);
    }
  });
  const debounceAdjustVolume = useCallback(
    debounce((voulume) => {
      spotifyApi.setVolume(voulume).catch(() => {});
    }, 500),
    []
  );
  return (
    <div className="sm:h-24 md:h-16  bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* left */}
      <div className="flex items-center justify-center md:justify-start space-x-4 col-span-3 md:col-span-1">
        <img
          className=" h-10 w-10"
          src={songInfo?.album?.images?.[0]?.url ?? "/profile.jpg"}
          alt=""
        />
        <div>
          <h3>{songInfo?.name ?? "Play Date"}</h3>
          <p>{songInfo?.artists?.[0]?.name ?? "Melanie Martinez"}</p>
        </div>
      </div>
      {/* center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>
      {/* right */}
      <div className="flex items-center justify-end space-x-3 md:space-x-4 pr-3">
        <VolumeDownIcon
          className="button"
          onClick={() => {
            volume > 0 &&
              setVolume((volume) => {
                return volume - 10;
              });
          }}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="button"
          onClick={() => {
            volume <= 100 &&
              setVolume((volume) => {
                return volume + 10;
              });
          }}
        />
        <VolumeOffIcon
          className="button"
          onClick={() => {
            setVolume((volume) => {
              return 0;
            });
          }}
        />
      </div>
    </div>
  );
}

export default Player;
