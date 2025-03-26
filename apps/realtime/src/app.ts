import "./config";

import { version } from "../package.json";
import "./features/socket";

const port = process.env.PORT ?? 3001;

console.info(`Starting Bitrock Town Server v${version} on port ${port}`);
