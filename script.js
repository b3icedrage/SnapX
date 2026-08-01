/// Snap X Demo

const createBtn = document.querySelector(".floating-btn");

if (createBtn) {

createBtn.addEventListener("click", function(e){

e.preventDefault();

let file = document.createElement("input");
file.type = "file";
file.accept = "image/*,video/*";

file.onchange = function(){

const selected = file.files[0];

if(!selected) return;

const url = URL.createObjectURL(selected);

const feed = document.querySelector(".feed");

const post = document.createElement("div");
post.className = "post";

let media = "";

if(selected.type.startsWith("image")){

media = `<img src="${url}" class="uploaded-media">`;

}else{

media = `
<video class="uploaded-media" controls>
<source src="${url}">
</video>
`;

}

post.innerHTML = `

<div class="post-header">
<strong>You</strong>
<span>Just now</span>
</div>

${media}

<div class="actions">

<button class="like-btn">❤️ 0</button>

<button>💬 Comment</button>

<button>📤 Share</button>

</div>

<p>New Snap posted 🚀</p>

`;

feed.prepend(post);

enableLikes();

};

file.click();

});

}

function enableLikes(){

document.querySelectorAll(".like-btn").forEach(btn=>{

btn.onclick=function(){

let count=parseInt(this.textContent.replace(/\D/g,''))||0;

count++;

this.innerHTML="❤️ "+count;

}

});

}

enableLikes();
document.addEventListener("dblclick", (e) => {
    const media = e.target.closest(".uploaded-media");

    if (!media) return;

    const post = media.closest(".post");
    const likeBtn = post.querySelector(".like-btn");

    if (likeBtn) {
        let count = parseInt(likeBtn.textContent.replace(/\D/g, "")) || 0;
        count++;
        likeBtn.textContent = "❤️ " + count;
    }

    const heart = document.createElement("div");
    heart.className = "heart-animation";
    heart.innerHTML = "❤️";

    post.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 1000);
});
const toggle = document.getElementById("themeToggle");

if(toggle){

toggle.onclick = ()=>{

document.body.classList.toggle("light");

};

}

const device =
navigator.userAgent;


if(
/Android|iPhone/i.test(device)
){

document.body.classList.add(
"mobile"
);

}
else{

document.body.classList.add(
"desktop"
);

}
