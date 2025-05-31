import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import requestIp from 'request-ip';
import { ActiveUserModel } from "./model/activeUser/activeUserModel";
import { ActiveUserController } from "./controller/activeUserController";
import { Router } from "./routes/index";
import {ActiveUserRouter} from "./routes/activeUserRouter";
import {MusicRouter} from "./routes/musicRouter";
import {MusicController} from "./controller/musicController";
import {MusicModel} from "./model/music/musicModel";
import {UserMusicMapping} from "./model/activeUser/userMusicMapping";

// 'express-session' の型を拡張
declare module 'express-session' {
    interface SessionData {
        uuid?: string;
    }
}

const app: Express = express();
const port: number = 3000;

async function main() {
    const activeUserModel = new ActiveUserModel();
    const musicModel = new MusicModel();
    const userMusicMapping = new UserMusicMapping();
    const activeUserController = new ActiveUserController(activeUserModel, musicModel, userMusicMapping);
    const musicController = new MusicController(musicModel, userMusicMapping);
    const activeUserRouter = new ActiveUserRouter(activeUserController);
    const musicRouter = new MusicRouter(musicController)
    const router = new Router(activeUserRouter, musicRouter);
    app.use(express.json());
    app.use(requestIp.mw());

    // cookie の設定。デフォルトの session を利用する
    app.use(session({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true
    }));

    app.use((req: Request, res: Response, next: any) => {
        if (req.session.uuid) {
            console.log(`client has uuid: ${req.session.uuid}`);
            activeUserController.resumeAccess(req.clientIp, req.session.uuid, new Date());
        }
        else {
            console.log(`client do not have session.uuid (${req.session.uuid})`);
            const user = activeUserController.newAccess(req.clientIp, new Date());
            req.session.uuid = user.uuid;
        }
        next();
    });

    app.use('/', router.getRouter());

    app.listen(port, '0.0.0.0', () => { console.log('listening to port ' + port); });

}

main();
