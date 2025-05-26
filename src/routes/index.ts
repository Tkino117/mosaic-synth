import {AbstractRouter} from "./AbstractRouter";
import {ActiveUserRouter} from "./activeUserRouter";
import {MusicRouter} from "./musicRouter";

export class Router extends AbstractRouter {
    constructor(private readonly activeUserRouter: ActiveUserRouter,
                private readonly musicRouter: MusicRouter) {
        super();
        this.initialize();
    }

    initializeRoutes() {
        this.router.use('/api/dev/active-users', this.activeUserRouter.getRouter());
        this.router.use('/api/music', this.musicRouter.getRouter())
    }
}