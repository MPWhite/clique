import tracer from "dd-trace";
tracer.init(); // initialized in a different file to avoid hoisting.

tracer.use("express");

tracer.use("http");

export default tracer;
