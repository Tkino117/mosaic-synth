import {ActiveUserModel, User} from "../model/activeUserModel";

export class ActiveUserController {
    private activeUserModel: ActiveUserModel;
    constructor(activeUsers: ActiveUserModel) {
        this.activeUserModel = activeUsers;
    }

    // 新規アクセス
    newAccess(ip: string | undefined, time: Date): User {
        return this.activeUserModel.addUser(ip, time);
    }

    // 既存ユーザーのアクセス
    resumeAccess(ip: string | undefined, uuid: string, time: Date): User {
        return this.activeUserModel.addUserWithUuid(ip, uuid, time);
    }

    // アクティブユーザーのリストをリフレッシュ。一定時間アクセスのないユーザーを削除する
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