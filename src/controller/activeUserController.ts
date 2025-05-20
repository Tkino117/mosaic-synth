import {ActiveUserModel, User} from "../model/activeUserModel";

export class ActiveUserController {
    private activeUserModel: ActiveUserModel;
    constructor(activeUsers: ActiveUserModel) {
        this.activeUserModel = activeUsers;
    }

    newAccess(ip: string | undefined, time: Date) {
        this.activeUserModel.addUser(ip, time);
    }

    updateActiveUser(active_duration = undefined) {
        this.activeUserModel.removeInactiveUsers(active_duration);
    }

    getActiveUsers(): User[] {
        return this.activeUserModel.getUsers();
    }

    getActiveUsersNumber(): number {
        return this.activeUserModel.getUsersCount();
    }
}