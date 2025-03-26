import cors from "cors";
import express from "express";
import "./config";

import swaggerJsdoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import { version } from "../package.json";
import { addPublicRoutes } from "./api/public";

import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

const allowedOrigins = [
  "http://localhost:8080",
  "https://bitrock-town-frontend.vercel.app",
  "https://test.bitrock.town",
  "https://bitrock.town",
];

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bitrock Town API",
      version,
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/api/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

// **** SWAGGER ****

app.use(
  "/api-docs",
  swaggerUi.serve as any,
  swaggerUi.setup(swaggerSpec) as any,
);

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

const port = process.env.PORT ?? 3000;

// **** PUBLIC ****
addPublicRoutes(app);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
