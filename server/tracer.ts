import tracer from "dd-trace";

tracer.init({
  logInjection: true,
}); // initialized in a different file to avoid hoisting.

tracer.use("express");
tracer.use("http");
tracer.use("http2");

export default tracer;
