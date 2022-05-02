import { NextApiRequest } from "next";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamZoomInHandler = async (
  req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const { sonycam } = res.socket.server;
  sonycam.call("actZoom", ["out", "1shot"]);
  res.json({
    success: true,
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default sonycamZoomInHandler;
