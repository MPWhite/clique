import tracer from "dd-trace";
tracer.init(); // initialized in a different file to avoid hoisting.

tracer.use("express", {
  service: "clique-be",
});

tracer.use("pg", {
  service: "pg-cluster",
});

export default tracer;
