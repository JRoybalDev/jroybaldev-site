import { Content } from "@prismicio/client";
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
  return (
    <div className="">
      <YoutubeIframe videoId={slice.primary.video_id} />
    </div>
  );
};

export default VideoBlock;
