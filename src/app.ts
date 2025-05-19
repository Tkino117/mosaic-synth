import express, { Express, Request, Response } from 'express';
import { ActiveUsers } from "./model/util/activeUsers";
import routes from "./routes/index";

const app: Express = express();
const port: number = 3000;

async function main() {
    const activeUsers = new ActiveUsers();
    app.use(express.json());

    // ミドルウェアの定義。接続された際にipアドレスと時間を保存
    app.use((req: Request, res: Response, next: any) => {
        console.log(req.ip);
        console.log(req.originalUrl);
        const ip = req.ip || req.socket.remoteAddress;
        activeUsers.addUser(ip, new Date());
        next();
    })
    app.listen(port, '0.0.0.0', () => { console.log('listening to port ' + port); });

    app.use('/api', routes);
}

main();
