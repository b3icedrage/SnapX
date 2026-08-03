const viewer = document.getElementById("storyViewer");
const image = document.getElementById("storyImage");
const video = document.getElementById("storyVideo");
const close = document.getElementById("closeStory");
const progress = document.getElementById("storyProgress");


let stories = [];
let current = 0;
let timer;


export function openStory(index){

    current=index;

    viewer.classList.remove("hidden");

    showStory();

}



function showStory(){

    clearTimeout(timer);

    let story = stories[current];


    image.style.display="none";
    video.style.display="none";


    progress.style.transition="none";
    progress.style.transform="scaleX(0)";


    if(story.type==="video"){

        video.src=story.url;
        video.style.display="block";

        video.play();

        timer=setTimeout(nextStory,15000);

    }else{

        image.src=story.url;
        image.style.display="block";

        timer=setTimeout(nextStory,5000);
    }


    setTimeout(()=>{

        progress.style.transition="transform 5s linear";
        progress.style.transform="scaleX(1)";

    },50);

}



function nextStory(){

    current++;

    if(current >= stories.length){

        closeStory();

    }else{

        showStory();

    }

}



function previousStory(){

    if(current>0){

        current--;
        showStory();

    }

}



function closeStory(){

    clearTimeout(timer);

    video.pause();
    video.src="";

    viewer.classList.add("hidden");

}



viewer.onclick=(e)=>{

    let x=e.clientX;

    if(x > window.innerWidth/2){

        nextStory();

    }else{

        previousStory();

    }

};


close.onclick=closeStory;
