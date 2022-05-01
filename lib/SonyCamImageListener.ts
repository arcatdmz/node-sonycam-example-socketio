export type SonyCamImageListener = (image: {
  /**
   * Range: [0, 65535]
   */
  frameNumber: number;

  timestamp: number;
  dataSize: number;
  data: ArrayBuffer;
}) => void;
