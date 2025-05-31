import {ActiveUserModel, User} from "../model/activeUser/activeUserModel";
import {MusicModel} from "../model/music/musicModel";
import {UserMusicMapping} from "../model/activeUser/userMusicMapping";
import {MusicRepository} from "../model/music/musicRepository";

export class ActiveUserController {
    constructor(private readonly activeUserModel: ActiveUserModel,
                private readonly musicModel: MusicModel,
                private readonly userMusicMapping: UserMusicMapping) {
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
    // userMusicMapping からも削除し、musicModelのリソースもリリースする
    updateActiveUser(active_duration = undefined) {
        const deletedUsers = this.activeUserModel.removeInactiveUsers(active_duration);
        deletedUsers.forEach((user: User) => {
            const part = this.userMusicMapping.pop(user.uuid);
            if (part) {
                const music = part.music;
                if (music) {
                    this.musicModel.getMusic(music.name)?.releasePart(part);
                }
            }
        })
    }

    getActiveUsers(): User[] {
        return this.activeUserModel.getUsers();
    }

    getActiveUsersNumber(): number {
        return this.activeUserModel.getUsersCount();
    }
}