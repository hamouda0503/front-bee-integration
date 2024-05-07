import {Episode} from './episode.model'
export class Podcast {
    title: string;
    description: string;
    lien: string; 
    language: string[];
    image_url: string;
    Episodes:Episode[];
    id: string;
}
