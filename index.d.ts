export function getFace(
    srcBuffer:Buffer,
    mime:string,
    top:number,right:number,bottom:number,left:number
):Promise<Array<Buffer>>;