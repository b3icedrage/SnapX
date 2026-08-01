import { supabase } from "./client.js";


export async function uploadMedia(file){

console.log("UPLOAD FUNCTION STARTED");


if(!file){

console.log("NO FILE");

return null;

}


console.log(
"File received:",
file.name,
file.type,
file.size
);



const fileName =
Date.now() + "_" + file.name;



console.log(
"Uploading:",
fileName
);



const result =
await supabase
.storage
.from("snap-media")
.upload(
fileName,
file
);



console.log(
"SUPABASE RESPONSE:",
result
);



if(result.error){

console.error(
result.error
);

alert(result.error.message);

return null;

}



const url =
supabase
.storage
.from("snap-media")
.getPublicUrl(fileName)
.data
.publicUrl;



console.log(
"PUBLIC URL:",
url
);



return url;


}
