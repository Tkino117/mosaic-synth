import {Music, MusicRepository} from "./musicRepository";

export class MusicModel {
    private readonly musicRepository = new MusicRepository();

    public getMusic(name: string): Music | undefined {
        return this.musicRepository.get(name);
    }
}