export type Family={id:string;name:string;type:'house'|'bath';from:number;cover:string;description:string};
export type Project={id:string;family:string;name:string;area:number;price:number;dimensions:string;page:number};
export type Complex={id:string;name:string;area:number;price:number;dimensions:string;page:number;cover:string};
export type Option={id:string;group:string;name:string;price:number;calc:string;source:string};
export type Catalog={families:Family[];projects:Project[];complexes:Complex[];options:Option[]};
