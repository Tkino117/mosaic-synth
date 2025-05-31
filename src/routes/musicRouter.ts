import {AbstractRouter} from "./AbstractRouter";
import {MusicController} from "../controller/musicController";
import {MusicPart} from "../model/music/musicRepository";

export class MusicRouter extends AbstractRouter {
    constructor(private readonly musicController: MusicController) {
        super();
        this.initialize();
    }
    protected initializeRoutes(): void {
        this.router.get('/', async (req, res) => {
            res.json(this.musicController.getMusicList().map(music => music.toJSON()));
        });
        this.router.get('/:name', async (req, res) => {
            // 返すものはまだ未定 !note!
            if (req.session.uuid) {
                const part = this.musicController.takeMusicPart(req.params.name, req.session.uuid);
                if (part)
                    res.json(part.toJSON());
                else
                    res.status(404).send(`Music not found for name: ${req.params.name}`);
            }
            else {
                // ここには本来来ないはず
                console.log("ERROR : req.session.uuid is null (in MusicRouter.initializeRoutes())");
                res.status(404).send(`UUID is null (in MusicRouter.initializeRoutes())`);
            }
        })
    }

}