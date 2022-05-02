import { NextApiRequest } from "next";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamIsFetchingStatusHandler = async (
  _req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const { sonycam } = res.socket.server;
  res.json({
    success: true,
    result: sonycam.fetchingStatus,
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default sonycamIsFetchingStatusHandler;
