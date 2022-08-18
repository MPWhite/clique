import tracer from "dd-trace";

tracer.init({
  logInjection: true,
}); // initialized in a different file to avoid hoisting.

// const httpOptions = {
//   service: "clique-be",
//   validateStatus: (code) => code < 400,
//   headers: ["host"],
//   middleware: true,
// };
//
// const httpServerOptions = {
//   ...httpOptions,
//   hooks: {
//     request: (span, req, res) => {
//       span.setTag("http.route", req.originalUrl);
//     },
//   },
// };
//
tracer.use("express");
tracer.use("http");
tracer.use("http2");

export default tracer;
