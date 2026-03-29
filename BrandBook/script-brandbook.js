// Scroll Reveal
const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("visible");
}
});
},{threshold:0.2});

sections.forEach(section=>observer.observe(section));

// Progress bar
window.addEventListener("scroll",()=>{
const scrollTop=window.scrollY;
const docHeight=document.body.scrollHeight-window.innerHeight;
const progress=(scrollTop/docHeight)*100;
document.querySelector(".progress-bar").style.width=progress+"%";
});

// Active sidebar
const navLinks=document.querySelectorAll(".sidebar a");

window.addEventListener("scroll",()=>{
let current="";
sections.forEach(section=>{
if(pageYOffset>=section.offsetTop-200){
current=section.getAttribute("id");
}
});
navLinks.forEach(link=>{
link.classList.remove("active");
if(link.getAttribute("href")==="#"+current){
link.classList.add("active");
}
});
});