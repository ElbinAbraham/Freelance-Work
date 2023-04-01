// products list
var products = document.getElementById("products");
var anchor = document.getElementsByClassName("anchor");
console.log(anchor[0]);
function func(){
    for (let i = 0; i < anchor.length; i++) {
        anchor[i].classList.toggle("visible");
        products.classList.toggle("clicked");
       

    }
    
}