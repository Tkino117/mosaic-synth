export class User {
    public static id_count: number = 0;
    public id:  number;
    public ip: string;
    constructor(ip: string | undefined, public startTime: Date, public latestTime: Date) {
        this.id = User.id_count++;
        if (ip == undefined) {
            this.ip = String(this.id);
        }
        else {
            this.ip = String(ip);
        }
    }
}

export class ActiveUserModel {
    private users: Map<string, User> = new Map<string, User>();
    private active_duration = 60;    // second

    getUsersCount(): number {
        return this.users.size;
    }

    getUsers(): User[] {
        return Array.from(this.users.values());
    }

    addUser(ip: string | undefined, latestTime: Date) {
        const user: User | undefined = ip == undefined ? undefined : this.users.get(ip);
        if (user) {
            user.latestTime = latestTime;
            console.log(`updated user ${ip}: ${latestTime}`);
        }
        else {
            const newUser = new User(ip, latestTime, latestTime);
            this.users.set(newUser.ip,  newUser);
            console.log(`added user ${ip}: ${latestTime}`);
        }
    }

    removeUser(ip: string) {
        return this.users.delete(ip);
    }

    // 計算量改善できる。いったん放置
    removeInactiveUsers(duration_second: number = this.active_duration): number {
        let removedNumber = 0;
        this.users.forEach((user: User, ip: string) =>  {
            if (user.latestTime.getMinutes() < new Date().getMinutes() - duration_second) {
                this.users.delete(ip);
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
