import { v4 as uuidv4 } from 'uuid';

export class User {
    public static id_count: number = 0;
    public id:  number;
    public uuid: string;
    public ip: string;
    private constructor(ip: string | undefined, uuid: string, public startTime: Date, public latestTime: Date) {
        this.id = User.id_count++;
        this.uuid = uuid;
        if (ip == undefined) {
            this.ip = String(this.id);
        }
        else {
            this.ip = String(ip);
        }
    }

    // User.newUser() で新規 User 作成
    public static newUser(ip: string | undefined, time: Date) {
        return new User(ip, uuidv4(), time, time);
    }

    public static newUserWithUuid(ip: string | undefined, uuid: string, time: Date)  {
        return new User(ip, uuid, time, time);
    }
}

export class ActiveUserModel {
    // ActiveUser の一覧 < uuid, User >
    private users: Map<string, User> = new Map<string, User>();

    // 一定時間アクセスのない user は ActiveUser から消去
    private active_duration = 20;    // second

    getUsersCount(): number {
        return this.users.size;
    }

    getUsers(): User[] {
        const users: User[] = Array.from(this.users.values());
        const copies: User[] = structuredClone(users);
        copies.forEach(user => { user.ip = ""; });
        return copies;
    }

    addUser(ip: string | undefined, time: Date): User {
        const user: User = User.newUser(ip, time);
        this.users.set(user.uuid, user);
        return user;
    }

    addUserWithUuid(ip: string | undefined, uuid: string, time: Date): User {
        let user: User | undefined = this.users.get(uuid);
        if (user) {
            user.latestTime = time;
        }
        else {
            user = User.newUserWithUuid(ip, uuid, time);
            this.users.set(user.uuid, user);
        }
        return user;
    }

    removeUser(uuid: string) {
        return this.users.delete(uuid);
    }

    // 計算量改善できる。いったん放置
    removeInactiveUsers(duration_second: number = this.active_duration): number {
        let removedNumber = 0;
        this.users.forEach((user: User, uuid: string) =>  {
            if (user.latestTime.getTime() < new Date().getTime() - duration_second * 1000) {
                this.users.delete(uuid);
                removedNumber++;
            }
        })
        console.log(`Removed ${removedNumber} inactive members.`);
        console.log(`current number of active members is ${this.getUsersCount()}.`);
        return removedNumber;
    }

    setActiveDuration(duration: number) {
        if (duration > 0) {
            this.active_duration = duration;
        }
    }

    getActiveDuration(): number {
        return this.active_duration;
    }
}
