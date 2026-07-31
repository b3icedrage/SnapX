import { supabase } from "./client.js";


export async function uploadMedia(file){


const fileName =
Date.now()+"-"+file.name;


const {data,error}=

await supabase
.storage
.from("snap-media")
.upload(
fileName,
file
);


if(error){

console.log(error);
return;

}


const url =
supabase
.storage
.from("snap-media")
.getPublicUrl(fileName)
.data
.publicUrl;


return url;


}
