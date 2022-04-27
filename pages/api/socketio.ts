import type { NextApiRequest } from "next";
import { NextApiResponseWithSocketIO } from "../../lib/NextApiResponseWithSocketIO";
import { ensureSocketIOServer } from "../../lib/ensureSocketIOServer";

const ioHandler = (_req: NextApiRequest, res: NextApiResponseWithSocketIO) => {
  ensureSocketIOServer(res);
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
