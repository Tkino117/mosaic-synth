import {Music, MusicPart} from "../model/music/musicRepository";
import {MusicModel} from "../model/music/musicModel";
import {UserMusicMapping} from "../model/activeUser/userMusicMapping";
import {User} from "../model/activeUser/activeUserModel";

export class MusicController {

    constructor(public musicModel: MusicModel,
                public userMusicMapping: UserMusicMapping) {}
    getMusic(musicName: string): Music | undefined {
        return this.musicModel.getMusic(musicName);
    }

    getMusicList(): Music[] {
        return this.musicModel.getList();
    }

    takeMusicPart(musicName: string, userUUID: string): MusicPart | null | undefined {
        if (this.userMusicMapping.hasPart(userUUID)) {
            // なんか冗長だけどまぁいいや
            console.log(`user ${userUUID} has already music parts.`)
            return this.userMusicMapping.hasPart(userUUID);
        }
        const part = this.getMusic(musicName)?.takePart();
        if (part) {
            this.userMusicMapping.add(userUUID, part);
        }
        return part;
    }
}