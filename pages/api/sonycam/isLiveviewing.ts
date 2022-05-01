import { NextApiRequest } from "next";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamIsLiveviewingHandler = async (
  _req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const { sonycam } = res.socket.server;
  const playing = sonycam.liveviewing;
  res.json({
    success: true,
    playing,
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default sonycamIsLiveviewingHandler;
