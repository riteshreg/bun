import { db, insertMessage, listAllMessage } from "./db/client";
const CHAT_GROUP_NAME = "group-chat";

if (process.env.MIGRATE === "true") {
    await import("./db/migrate");
}

const server = Bun.serve<{ username: string }, any>({
    routes: {
        // Static routes
        "/": () =>
            new Response("welcome to chatapp backend!", {
                headers: { "X-resp": "hi" },
            }),
        "/api/status": new Response("OK"),
        "/chat": (req, server) => {
            const url = new URL(req.url);
            const username = url.searchParams.get("username");

            //   returning a error if username is not defined
            if (!username) {
                return new Response("Username is Required", {
                    status: 400,
                    statusText: "Username is Required",
                });
            }

            const success = server.upgrade(req, { data: { username } });
            if (success) {
                // Bun automatically returns a 101 Switching Protocols
                // if the upgrade succeeds
                return;
            }

            // handle HTTP request normally
            return new Response("WebSocket connection required", { status: 400 });
        },
    },
    websocket: {
        async open(ws) {
            // subscribing to a group chat with bun build in ws method
            ws.subscribe(CHAT_GROUP_NAME);

            const history = await listAllMessage();

            for (const msg of history) {
                const msg_string = JSON.stringify(msg);
                ws.send(msg_string);
            }
        },

        // this is called when a message is received
        async message(ws, message) {
            const text = message.toString();
            const msg = await insertMessage({
                message: text,
                username: ws.data.username,
            });
            if (!msg) return;
            const msg_string = JSON.stringify(msg);
            // publishing to other users,
            ws.publish(CHAT_GROUP_NAME, msg_string);
            // also sending back to the client with id and other stuff
            ws.send(msg_string);
        },
        close(ws) {
            ws.unsubscribe(CHAT_GROUP_NAME);
        },
    },
    fetch() {
        return new Response("Path Not Found", { status: 500 });
    },
    port: process.env.PORT ?? 3001,
});

console.log(`listining at port ${server.port} `);
