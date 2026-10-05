export type Family={id:string;name:string;type:string;from:number;cover:string;description:string};
export type Project={id:string;family:string;name:string;area:number;price:number;dimensions:string;page:number};
export type Option={id:string;group:string;name:string;price:number;calc:string;source:string};
export type Catalog={families:Family[];projects:Project[];complexes:any[];options:Option[]};
export type Quote={number:string;kind:'ready'|'custom';client:string;phone:string;email:string;project:string;base:number;items:{name:string;price:number;calc?:string}[];external:{name:string;price:number}[];notes:string;manager:string;createdAt:string};
