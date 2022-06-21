import cluster from "cluster";
import { cpus } from "os";
import process from "process";

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  for (let i = 0; i < cpus().length; i++) cluster.fork();
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  import("./index");
  console.log(`Worker ${process.pid} started`);
}
