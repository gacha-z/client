import { useVideoPlayer, VideoView } from 'expo-video';

import { styles } from './index.css';

type VideoThumbnailProps = {
  uri: string;
};

/** 정지된 VideoView를 썸네일처럼 사용 — 별도 이미지 추출 없이 첫 프레임만 보여준다 */
export function VideoThumbnail({ uri }: VideoThumbnailProps) {
  const player = useVideoPlayer(uri, (player) => {
    player.muted = true;
  });

  return (
    <VideoView
      style={styles.thumbnail}
      player={player}
      contentFit="cover"
      nativeControls={false}
      pointerEvents="none"
    />
  );
}
