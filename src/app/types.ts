export type User = { id: number; name: string; email: string; role: 'USER' | 'TEACHER' | 'ADMIN' }
export type News = { id:number; slug:string; title:string; excerpt:string; content:string; image_url?:string; published_at?:string }
export type Teacher = { id:number; slug:string; name:string; position:string; subject:string; bio:string; image_url?:string }
export type Event = { id:number; slug:string; title:string; description:string; event_date:string; event_time?:string; location:string; image_url?:string }
export type ScheduleEntry = { id:number; lesson_number:number; time_start:string; subject:string; teacher:string; classroom:string }
export type Album = { id:number; slug:string; title:string; description:string; cover_url?:string; items:Array<{id:number;title:string;description:string;image_url:string}> }
