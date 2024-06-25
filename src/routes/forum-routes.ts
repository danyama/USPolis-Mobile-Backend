import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";

type RequestQuery = {
    event_id: string;
};

export const forumRoute = Router();

const prisma = new PrismaClient();

forumRoute.get("", async (
    req: Request<{}, {}, {}, RequestQuery>,
    res: Response) => {
    if ("event_id" in req.query) {
        const results = await prisma.posts.findMany({
            where: {
                event_id: req.query.event_id
            }
        })

        res.json(results);
    } else {
        res.status(400);
        res.json({ "detail": "Missing 'event_id' parameter" });
    }
});

forumRoute.post("", async (req: Request, res: Response) => {
    try {
        const { author, content, event_id } = req.body;

        const createdPost = await prisma.$runCommandRaw({
            insert: 'posts',
            documents: [{
                author: author,
                content: content,
                created_at: new Date().toISOString(),
                event_id: event_id
            }]
        });

        res.json({ createdPost });
    } catch (err) {
        res.status(400);
        res.json({ "detail": "Não foi possível adicionar sua postagem" });
    }
});
