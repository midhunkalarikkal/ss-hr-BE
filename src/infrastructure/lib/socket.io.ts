import http from "http";
import app from "../../app";
import { redis } from "./redis";
import { Types } from "mongoose";
import { Server } from "socket.io";

const socketServer = http.createServer(app);

const io = new Server(socketServer, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

export async function getReceiverSocketId(userId: Types.ObjectId): Promise<string | null> {
    return await redis.get(`socket:${userId}`);
}

async function getOnlineUsers(): Promise<string[]> {
    const keys = await redis.keys("socket:*");
    return keys.map((key) => key.split(":")[1]);
}

io.on("connection", async (socket) => {
    (async () => {
        const queryUserId = socket.handshake.query.userId;
        const userId = typeof queryUserId === "string" ? queryUserId : null;

        if (userId) {
            await redis.set(`socket:${userId}`, socket.id);
        }

        io.emit("getOnlineUsers", await getOnlineUsers());

        socket.on("typing", async ({ fromUserId, toUserId }: { fromUserId: string; toUserId: string }) => {
            const toSocketId: string | null = await redis.get(`socket:${toUserId}`);
            if (toSocketId) {
                io.to(toSocketId).emit("typing", { fromUserId, toUserId });
            }
        });

        socket.on("stopTyping", async ({ fromUserId, toUserId }: { fromUserId: string; toUserId: string }) => {
            const toSocketId: string | null = await redis.get(`socket:${toUserId}`);
            if (toSocketId) {
                io.to(toSocketId).emit("stopTyping", { fromUserId, toUserId });
            }
        });

        socket.on("disconnect", async () => {
            if (userId) {
                await redis.del(`socket:${userId}`);
            }
            io.emit("getOnlineUsers", await getOnlineUsers());
        });
    })();
});

export { io, socketServer };
