import {MusicPart, MusicRepository} from "../music/musicRepository";
import {User} from "./activeUserModel";

export class UserMusicMapping {
    // <userUUID, MusicPart>
    private mapping: Map<string, MusicPart>  = new Map<string, MusicPart>();

    add(userUUID: string, musicPart: MusicPart) {
        return this.mapping.set(userUUID, musicPart);
    }
    pop(userUUID: string): MusicPart | undefined {
        const part = this.mapping.get(userUUID);
        return this.mapping.delete(userUUID) ? part : undefined;
    }
    hasPart(userUUID: string): MusicPart | undefined {
        return this.mapping.get(userUUID);
    }
}