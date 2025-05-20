import {AbstractRouter} from "./AbstractRouter";
import {ActiveUserRouter} from "./activeUserRouter";

export class Router extends AbstractRouter {
    private activeUserRouter: ActiveUserRouter;
    constructor(activeUserRouter: ActiveUserRouter) {
        super();
        this.activeUserRouter = activeUserRouter;
        this.initialize();
    }

    initializeRoutes() {
        this.router.use('/api/dev/active-users', this.activeUserRouter.getRouter());
    }
}