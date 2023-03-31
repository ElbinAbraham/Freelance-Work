// const carousel = document.querySelector(".carousel"),
// firstImg = carousel.querySelectorAll("img")[0],
// arrowIcons = document.querySelectorAll(".wrapper i");

// let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;

// const showHideIcons = () => {
//     // showing and hiding prev/next icon according to carousel scroll left value
//     let scrollWidth = carousel.scrollWidth - carousel.clientWidth; // getting max scrollable width
//     arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
//     arrowIcons[1].style.display = carousel.scrollLeft == scrollWidth ? "none" : "block";
// }

// arrowIcons.forEach(icon => {
//     icon.addEventListener("click", () => {
//         let firstImgWidth = firstImg.clientWidth + 14; // getting first img width & adding 14 margin value
//         // if clicked icon is left, reduce width value from the carousel scroll left else add to it
//         carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
//         setTimeout(() => showHideIcons(), 60); // calling showHideIcons after 60ms
//     });
// });

// const autoSlide = () => {
//     // if there is no image left to scroll then return from here
//     if(carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 || carousel.scrollLeft <= 0) return;

//     positionDiff = Math.abs(positionDiff); // making positionDiff value to positive
//     let firstImgWidth = firstImg.clientWidth + 14;
//     // getting difference value that needs to add or reduce from carousel left to take middle img center
//     let valDifference = firstImgWidth - positionDiff;

//     if(carousel.scrollLeft > prevScrollLeft) { // if user is scrolling to the right
//         return carousel.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
//     }
//     // if user is scrolling to the left
//     carousel.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
// }

// const dragStart = (e) => {
//     // updatating global variables value on mouse down event
//     isDragStart = true;
//     prevPageX = e.pageX || e.touches[0].pageX;
//     prevScrollLeft = carousel.scrollLeft;
// }

// const dragging = (e) => {
//     // scrolling images/carousel to left according to mouse pointer
//     if(!isDragStart) return;
//     e.preventDefault();
//     isDragging = true;
//     carousel.classList.add("dragging");
//     positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
//     carousel.scrollLeft = prevScrollLeft - positionDiff;
//     showHideIcons();
// }

// const dragStop = () => {
//     isDragStart = false;
//     carousel.classList.remove("dragging");

//     if(!isDragging) return;
//     isDragging = false;
//     autoSlide();
// }

// carousel.addEventListener("mousedown", dragStart);
// carousel.addEventListener("touchstart", dragStart);

// document.addEventListener("mousemove", dragging);
// carousel.addEventListener("touchmove", dragging);

// document.addEventListener("mouseup", dragStop);
// carousel.addEventListener("touchend", dragStop);

// const displacementSlider = function(opts) {

//     let vertex = `
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
//         }
//     `;

//     let fragment = `
        
//         varying vec2 vUv;

//         uniform sampler2D currentImage;
//         uniform sampler2D nextImage;

//         uniform float dispFactor;

//         void main() {

//             vec2 uv = vUv;
//             vec4 _currentImage;
//             vec4 _nextImage;
//             float intensity = 0.3;

//             vec4 orig1 = texture2D(currentImage, uv);
//             vec4 orig2 = texture2D(nextImage, uv);
            
//             _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));

//             _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));

//             vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);

//             gl_FragColor = finalTexture;

//         }
//     `;

//     let images = opts.images, image, sliderImages = [];;
//     let canvasWidth = images[0].clientWidth;
//     let canvasHeight = images[0].clientHeight;
//     let parent = opts.parent;
//     let renderWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
//     let renderHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

//     let renderW, renderH;

//     if( renderWidth > canvasWidth ) {
//         renderW = renderWidth;
//     } else {
//         renderW = canvasWidth;
//     }

//     renderH = canvasHeight;

//     let renderer = new THREE.WebGLRenderer({
//         antialias: false,
//     });

//     renderer.setPixelRatio( window.devicePixelRatio );
//     renderer.setClearColor( 0xffffff, 0.0 );
//     renderer.setSize( renderW, renderH );
//     parent.appendChild( renderer.domElement );

//     let loader = new THREE.TextureLoader();
//     loader.crossOrigin = "anonymous";

//     images.forEach( ( img ) => {

//         image = loader.load( img.getAttribute( 'src' ) + '?v=' + Date.now() );
//         image.magFilter = image.minFilter = THREE.LinearFilter;
//         image.anisotropy = renderer.capabilities.getMaxAnisotropy();
//         sliderImages.push( image );

//     });

//     let scene = new THREE.Scene();
//     scene.background = new THREE.Color( 0xffffff );
//     let camera = new THREE.OrthographicCamera(
//         renderWidth / -2,
//         renderWidth / 2,
//         renderHeight / 2,
//         renderHeight / -2,
//         1,
//         1000
//     );

//     camera.position.z = 1;

//     let mat = new THREE.ShaderMaterial({
//         uniforms: {
//             dispFactor: { type: "f", value: 0.0 },
//             currentImage: { type: "t", value: sliderImages[0] },
//             nextImage: { type: "t", value: sliderImages[1] },
//         },
//         vertexShader: vertex,
//         fragmentShader: fragment,
//         transparent: true,
//         opacity: 1.0
//     });

//     let geometry = new THREE.PlaneBufferGeometry(
//         parent.offsetWidth,
//         parent.offsetHeight,
//         1
//     );
//     let object = new THREE.Mesh(geometry, mat);
//     object.position.set(0, 0, 0);
//     scene.add(object);

//     let addEvents = function(){

//         let pagButtons = Array.from(document.getElementById('pagination').querySelectorAll('button'));
//         let isAnimating = false;

//         pagButtons.forEach( (el) => {

//             el.addEventListener('click', function() {

//                 if( !isAnimating ) {

//                     isAnimating = true;

//                     document.getElementById('pagination').querySelectorAll('.active')[0].className = '';
//                     this.className = 'active';

//                     let slideId = parseInt( this.dataset.slide, 10 );

//                     mat.uniforms.nextImage.value = sliderImages[slideId];
//                     mat.uniforms.nextImage.needsUpdate = true;

//                     TweenLite.to( mat.uniforms.dispFactor, 1, {
//                         value: 1,
//                         ease: 'Expo.easeInOut',
//                         onComplete: function () {
//                             mat.uniforms.currentImage.value = sliderImages[slideId];
//                             mat.uniforms.currentImage.needsUpdate = true;
//                             mat.uniforms.dispFactor.value = 0.0;
//                             isAnimating = false;
//                         }
//                     });

//                     let slideTitleEl = document.getElementById('slide-title');
//                     let slideStatusEl = document.getElementById('slide-status');
//                     let nextSlideTitle = document.querySelectorAll(`[data-slide-title="${slideId}"]`)[0].innerHTML;
//                     let nextSlideStatus = document.querySelectorAll(`[data-slide-status="${slideId}"]`)[0].innerHTML;

//                     TweenLite.fromTo( slideTitleEl, 0.5,
//                         {
//                             autoAlpha: 1,
//                             y: 0
//                         },
//                         {
//                             autoAlpha: 0,
//                             y: 20,
//                             ease: 'Expo.easeIn',
//                             onComplete: function () {
//                                 slideTitleEl.innerHTML = nextSlideTitle;

//                                 TweenLite.to( slideTitleEl, 0.5, {
//                                     autoAlpha: 1,
//                                     y: 0,
//                                 })
//                             }
//                         });

//                     TweenLite.fromTo( slideStatusEl, 0.5,
//                         {
//                             autoAlpha: 1,
//                             y: 0
//                         },
//                         {
//                             autoAlpha: 0,
//                             y: 20,
//                             ease: 'Expo.easeIn',
//                             onComplete: function () {
//                                 slideStatusEl.innerHTML = nextSlideStatus;

//                                 TweenLite.to( slideStatusEl, 0.5, {
//                                     autoAlpha: 1,
//                                     y: 0,
//                                     delay: 0.1,
//                                 })
//                             }
//                         });

//                 }

//             });

//         });

//     };

//     addEvents();

//     window.addEventListener( 'resize' , function(e) {
//         renderer.setSize(renderW, renderH);
//     });

//     let animate = function() {
//         requestAnimationFrame(animate);

//         renderer.render(scene, camera);
//     };
//     animate();
// };

// imagesLoaded( document.querySelectorAll('img'), () => {

//     document.body.classList.remove('loading');

//     const el = document.getElementById('slider');
//     const imgs = Array.from(el.querySelectorAll('img'));
//     new displacementSlider({
//         parent: el,
//         images: imgs
//     });

// });


function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: '', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
    var banner = document.querySelector(".goog-te-banner");
    if (banner) {
      banner.style.display = "none";
    }
  }
  