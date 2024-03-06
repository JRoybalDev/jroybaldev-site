import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import YoutubeIframe from "../../utils/YoutubeIframe";

/**
 * Props for `VideoBlock`.
 */
export type VideoBlockProps = SliceComponentProps<Content.VideoBlockSlice>;

/**
 * Component for "VideoBlock" Slices.
 */
const VideoBlock = ({ slice }: VideoBlockProps): JSX.Element => {
  // Use optional chaining to safely access the value property
  const videoId = (slice.primary.video_id as KeyTextField);

  return (
    <div className="">
      {videoId && <YoutubeIframe videoId={videoId} />}
    </div>
  );
};

export default VideoBlock;
