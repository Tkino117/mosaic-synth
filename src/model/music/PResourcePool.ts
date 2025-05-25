// how to use PResourcePool
// 1. r = new ResourceTracker<T> で作成
// 2. r.add() でリソースを追加。この際優先して使用するリソースはkey_priorityを小さな値にする。 重複は問題ないが未定義
// 3. r.peek() や r.take() でリソースを取得。peek は先頭のリソースを確認するだけ。take はリソースを使用したとみなされる。
// 4. リソースを使用終了した場合、r.release() をすること。
// 5. リソースの使用状況を完全に初期化する場合、r.reset()。(r.resetAll() で全リソースの使用状況の初期化)
//
// リソースの取得順：
// key_priority の昇順にリソースを1つずつ消費し、全て消費したら再び key_priority 順に1つずつ... という処理

interface PResource<T> {
    id: number;
    served: number;
    item: T;

    // priority 判定に用いる
    key_priority: number;
}

export class PResourcePool<T> {
    // priority の昇順でソートされたリスト。ソートは遅延処理
    private resources: PResource<T>[];
    private id_count = 0;
    private servedMin = 0;
    private sortedFlag = false;
    private readonly INF: number = 1e9;

    constructor(resources: PResource<T>[] | undefined = undefined) {
        if (resources) {
            this.resources = resources;
        }
        else {
            this.resources = [];
        }
    }

    add(item: T, priority: number): number {
        const resource: PResource<T> = {
            id: this.id_count++,
            served: 0,
            item: item,
            key_priority: priority
        };
        this.resources.push(resource);
        this.sortedFlag = false;
        return resource.id;
    }

    peek(): T | undefined {
        const resource = this._peek();
        return resource ? resource.item : undefined;
    }

    take(): T | undefined {
        const resource = this._peek();
        if (resource) {
            resource.served++;
            return resource.item;
        }
        return undefined;
    };

    release(item: T): boolean {
        const resource = this.get(item);
        if (resource) {
            if (resource.served <= 0) {
                console.log("ERROR : in PResourcePool.release()\n the resource doesn't served now.");
                return false;
            }
            resource.served--;
            return true;
        }
        return false;
    }

    releaseById(id: number): boolean {
        const resource = this.getById(id);
        if (resource) {
            if (resource.served <= 0) {
                console.log("ERROR : in PResourcePool.release()\n the resource doesn't served now.");
                return false;
            }
            resource.served--;
            return true;
        }
        return false;
    }

    reset(item: T): boolean {
        const resource = this.get(item);
        if (resource) {
            resource.served = 0;
            return true;
        }
        console.log("ERROR : in PResourcePool.reset()");
        return false;
    }

    resetById(id: number): boolean {
        const resource = this.getById(id);
        if (resource) {
            resource.served = 0;
            return true;
        }
        console.log("ERROR : in PResourcePool.resetById()");
        return false;
    }

    resetAll(): void {
        for (const resource of this.resources) {
            resource.served = 0;
        }
    }

    print(): void {
        this.sort();
        console.log("PResourcePool current resources : ")
        for (let i = 0; i < this.resources.length; i++) {
            const r = this.resources[i];
            console.log(`${i}: \n id: ${r.id}\n served: ${r.served}\n key_priority: ${r.key_priority}\n item: ${r.item}`);
        }
        console.log();
    }
    // private methods
    // 少し冗長に書いてるけど安全のため
    private _peek(): PResource<T> | undefined {
        if (this.resources.length === 0) return undefined;
        this.sort();
        this.culMin();
        for (const resource of this.resources) {
            if (resource.served > this.servedMin) continue;
            return resource;
        }
        console.log("ERROR : in PResourcePool._peek()");
        console.log("current servedMin : " + this.servedMin);
        return undefined;
    }

    private sort(): void {
        if (!this.sortedFlag) {
            this.resources.sort((a, b) => a.key_priority - b.key_priority);
            this.sortedFlag = true;
        }
    }

    private culMin(): number {
        this.servedMin = this.INF;
        for (let i = 0; i < this.resources.length; i++) {
            this.servedMin = Math.min(this.resources[i].served, this.servedMin);
        }
        return this.servedMin;
    }

    private get(item: T): PResource<T> | undefined {
        return this.resources.find(r => r.item === item);
    }

    private getById(id: number): PResource<T> | undefined {
        return this.resources.find(r => r.id == id);
    }
}