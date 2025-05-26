import {Music} from "../model/music/musicRepository";
import {MusicModel} from "../model/music/musicModel";

export class MusicController {
    public readonly musicModel = new MusicModel();

    getMusic(musicName: string): Music | undefined {
        return this.musicModel.getMusic(musicName);
    }

    getMusicList(): Music[] {
        return this.musicModel.getList();
    }

    takeMusicPart(musicName: string) {
        return this.getMusic(musicName)?.takePart();
    }
}