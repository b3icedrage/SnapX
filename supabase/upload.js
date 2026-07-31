import { supabase } from "./client.js";


export async function uploadMedia(file){


try {


const fileName =
`${Date.now()}-${file.name}`;


console.log(
"Uploading:",
fileName
);



const { data, error } = await supabase
.storage
.from("snap-media")
.upload(
fileName,
file,
{
cacheControl: "3600",
upsert: false
}
);



if(error){

console.error(
"Upload error:",
error
);

alert(error.message);

return null;

}



const publicUrl =
supabase
.storage
.from("snap-media")
.getPublicUrl(fileName)
.data
.publicUrl;



console.log(
"Uploaded URL:",
publicUrl
);



return publicUrl;



}

catch(error){

console.error(
"Supabase error:",
error
);

return null;

}


}
