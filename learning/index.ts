import figlet from "figlet";
import { beautifyConsole } from "./lib/console.ts";


const server = Bun.serve({
    port: 3000,
    fetch(req) {
       const body = figlet.textSync("hello, from bun!")
       return new Response(body)
    }
})

// beautifyConsole("new console sd dsaf")


console.log(`Listening on http://localhost:${server.port} ...`);

