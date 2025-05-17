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

export class ActiveUsers {
    private users: Map<string, User> = new Map<string, User>();

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
        }
        else {
            const newUser = new User(ip, latestTime, latestTime);
            this.users.set(newUser.ip,  newUser);
        }
    }

}
