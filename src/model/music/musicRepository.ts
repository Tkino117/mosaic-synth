import {PResourcePool} from "./PResourcePool";

export class MusicPart {
    public music: Music | null = null;
    public readonly id: number;
    private static id_count = 0;
    // コンストラクタにmusicのmp3? を入れ、音楽操作のいろいろメソッド追加予定
    constructor(public name: string) {
        this.id = MusicPart.id_count++;
    }
    toString() {
        return `(id: ${this.id}, part name: ${this.name})`;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            musicId: this.music ? this.music.id : null,
            musicName: this.music ? this.music.name : null
        }
    }
}

export class Music {
    private readonly parts: PResourcePool<MusicPart> = new PResourcePool<MusicPart>();
    public readonly id: number;
    private static id_count = 0;
    private constructor(public readonly name: string) {
        this.id = Music.id_count++;
    }

    addPart(part: MusicPart, priority: number): Music {
        part.music = this;
        this.parts.add(part, priority);
        return this;
    }

    takePart(): MusicPart | undefined {
        return this.parts.take();
    }

    releasePart(part: MusicPart): boolean {
        return this.parts.release(part);
    }

    print(): void {
        console.log("Music print :  ")
        console.log(`music name: ${this.name}\nmusic id: ${this.id}`);
        this.parts.print();
    }

    public static create(name: string): Music {
        return new Music(name);
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            parts: this.parts.toJSON()
        };
    }
}

export class MusicRepository {
    // <Music.name, Music>
    private readonly repository: Map<string, Music>;

    // フィールドで Music そのもの保持してもいいかもね

    constructor() {
        this.repository = new Map<string, Music>();

        // 新規Music の追加。ここで完結する
        const music1 = Music.create("music1")
            .addPart(new MusicPart("music1-part1"), 1)
            .addPart(new MusicPart("music1-part2"), 2)
            .addPart(new MusicPart("music1-part3"), 3);
        this.register(music1);

        const music2 = Music.create("music2")
            .addPart(new MusicPart("music2-part1"), 1)
            .addPart(new MusicPart("music2-part2"), 2)
            .addPart(new MusicPart("music2-part3"), 3);
        this.register(music2);
    }

    public get(name: string): Music | undefined {
        return this.repository.get(name);
    }

    public getList(): Music[]{
        return Array.from(this.repository.values());
    }

    private register(music: Music) {
        this.repository.set(music.name, music);
    }

}