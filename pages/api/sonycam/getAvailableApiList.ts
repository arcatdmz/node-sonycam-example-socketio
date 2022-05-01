import { NextApiRequest } from "next";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamAvailableApiListHandler = async (
  _req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const { availableApiList } = res.socket.server.sonycam;
  res.json({
    success: true,
    availableApiList,
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default sonycamAvailableApiListHandler;
