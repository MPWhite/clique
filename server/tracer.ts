import tracer from "dd-trace";
tracer.init(); // initialized in a different file to avoid hoisting.

const httpOptions = {
  service: "test",
  allowlist: ["url", /url/, (url) => true],
  blocklist: ["url", /url/, (url) => true],
  validateStatus: (code) => code < 400,
  headers: ["host"],
  middleware: true,
};

const httpServerOptions = {
  ...httpOptions,
  hooks: {
    request: (span, req, res) => {
      span.setTag("http.route", req.originalUrl);
    },
  },
};

tracer.use("express");
tracer.use("express", httpServerOptions);
tracer.use("http");
tracer.use("http2");

export default tracer;
