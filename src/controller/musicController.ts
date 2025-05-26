import {ActiveUserModel} from "../model/activeUser/activeUserModel";
import {Music} from "../model/music/musicRepository";
import {MusicModel} from "../model/music/musigModel";

export class musicController {
    public readonly musicModel = new MusicModel();

    getMusic(name: string): Music | undefined {
        return this.musicModel.getMusic(name);
    }
}