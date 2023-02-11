import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import { sendEmail } from "../utils";

export const commentsRoute = Router();

const prisma = new PrismaClient();

commentsRoute.post("", async (req: Request, res: Response) => {
  try {
    const { email, comment } = req.body
    
    await prisma.$runCommandRaw({
      insert: 'comments',
      documents: [{
          email: email,
          comment: comment,
          created_at: new Date().toISOString()
        }]
    })

    await sendEmail(email, comment)
    
    res.json({email, comment});
  } catch (err) {
    res.status(400)
    res.json({"detail": "Não foi possível inserir seu comentário!"})
  }
});


