import express, { Express, Request, Response } from 'express';
import requestIp from 'request-ip';
import { ActiveUserModel } from "./model/activeUserModel";
import { ActiveUserController } from "./controller/activeUserController";
import { Router } from "./routes/index";
import {ActiveUserRouter} from "./routes/activeUserRouter";

const app: Express = express();
const port: number = 3000;

async function main() {
    const activeUserModel = new ActiveUserModel();
    const activeUserController = new ActiveUserController(activeUserModel);
    const activeUserRouter = new ActiveUserRouter(activeUserController);
    const router = new Router(activeUserRouter);
    app.use(express.json());
    app.use(requestIp.mw());

    // ミドルウェアの定義。接続された際にipアドレスと時間を保存
    app.use((req: Request, res: Response, next: any) => {
        const ip: string | undefined = req.clientIp;
        console.log("new access");
        console.log("ip", ip);
        console.log("url",  req.url);
        activeUserController.newAccess(ip, new Date());
        next();
    })
    app.listen(port, '0.0.0.0', () => { console.log('listening to port ' + port); });

    app.use('/', router.getRouter());
}

main();
