import {MusicRepository} from "../src/model/music/musicRepository";

const rep = new MusicRepository();
rep.get("music1")?.print();