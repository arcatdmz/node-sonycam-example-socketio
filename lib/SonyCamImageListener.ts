export type SonyCamImageListener = (image: {
  frameNumber: number;
  timestamp: number;
  dataSize: number;
  data: ArrayBuffer;
}) => void;
