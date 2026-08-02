document.querySelectorAll(".nav-item").forEach(item=>{

item.addEventListener("click",()=>{

item.animate(

[

{transform:"scale(.9)"},

{transform:"scale(1.05)"},

{transform:"scale(1)"}

],

{

duration:250

}

);

});

});
