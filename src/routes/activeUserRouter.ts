import {ActiveUserController} from "../controller/activeUserController";
import {AbstractRouter} from "./AbstractRouter";


export class ActiveUserRouter extends AbstractRouter {
    private activeUserController:  ActiveUserController;

    constructor(activeUserController: ActiveUserController) {
        super();
        this.activeUserController = activeUserController;
        this.initialize();
    }

    initializeRoutes() {
        this.router.get('/', async (req, res) => {
            res.json(this.activeUserController.getActiveUsers());
        });
        this.router.get('/number', async (req, res) => {
            res.json(this.activeUserController.getActiveUsersNumber());
        })
        this.router.get('/update', async (req, res) => {
            this.activeUserController.updateActiveUser();
            res.sendStatus(200);
        })
    }
}