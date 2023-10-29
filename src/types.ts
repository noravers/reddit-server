import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core"
import { Request, Response } from 'express';
import { Session, SessionData } from "express-session";
// import session from 'express-session'

declare module 'express-session' {
    interface SessionData {
        userId: number
    }
}

export type MyContext = {
    em: EntityManager<IDatabaseDriver<Connection>>;
    req: Request & { 
        session?: Session & Partial<SessionData>
    },
    res: Response;
}