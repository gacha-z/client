import { useEffect } from 'react';
import { Modal as RNModal, Pressable } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

import { styles } from './index.css';

type VideoPreviewModalProps = {
  visible: boolean;
  videoUri: string | null;
  onClose: () => void;
};

function CloseIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5564 1.71641C17.7252 1.54761 17.82 1.31868 17.82 1.07998C17.82 0.841271 17.7252 0.61234 17.5564 0.443549C17.3876 0.274758 17.1587 0.179932 16.92 0.179932C16.6813 0.179932 16.4523 0.274758 16.2835 0.443549L8.99998 7.72712L1.71641 0.443549C1.54761 0.274758 1.31868 0.179932 1.07998 0.179932C0.841271 0.179932 0.61234 0.274758 0.443549 0.443549C0.274758 0.61234 0.179932 0.841271 0.179932 1.07998C0.179932 1.31868 0.274758 1.54761 0.443549 1.71641L7.72712 8.99998L0.443549 16.2835C0.274758 16.4523 0.179932 16.6813 0.179932 16.92C0.179932 17.1587 0.274758 17.3876 0.443549 17.5564C0.61234 17.7252 0.841271 17.82 1.07998 17.82C1.31868 17.82 1.54761 17.7252 1.71641 17.5564L8.99998 10.2728L16.2835 17.5564C16.4523 17.7252 16.6813 17.82 16.92 17.82C17.1587 17.82 17.3876 17.7252 17.5564 17.5564C17.7252 17.3876 17.82 17.1587 17.82 16.92C17.82 16.6813 17.7252 16.4523 17.5564 16.2835L10.2728 8.99998L17.5564 1.71641Z"
        fill={colors.white}
      />
    </Svg>
  );
}

/** 미션로그 영상 전체화면 미리보기 — 열리면 자동재생, 배경/X버튼으로 닫힘 */
export function VideoPreviewModal({ visible, videoUri, onClose }: VideoPreviewModalProps) {
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    if (visible) {
      player.currentTime = 0;
      player.play();
    } else {
      player.pause();
    }
  }, [visible, player]);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        {videoUri ? (
          <Pressable style={styles.videoWrap} onPress={() => {}}>
            <VideoView
              style={styles.video}
              player={player}
              contentFit="contain"
              nativeControls={false}
            />
          </Pressable>
        ) : null}
        <Pressable
          accessibilityLabel="미리보기 닫기"
          accessibilityRole="button"
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={12}
        >
          <CloseIcon />
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
