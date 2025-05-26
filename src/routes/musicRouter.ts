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
            const part: MusicPart | undefined = this.musicController.takeMusicPart(req.params.name);
            if (part)
                res.json(part.toJSON());
            else
                res.status(404).send(`Music not found for name: ${req.params.name}`);
        })
    }

}