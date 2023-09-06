document.body.style.overflow = 'hidden';

let canvas1 = document.getElementById("canvas1");
let context1 = canvas1.getContext("2d");

let canvas2 = document.getElementById("scratch");
let context2 = canvas2.getContext("2d");
  

const images = [
    'static/image01.JPG',
    'static/image02.JPG',
    'static/image03.JPG',
    'static/image04.JPG',
    'static/image05.JPG'
    ];
    
let imageCount = 0; // 設置計數器
    
const init = () => {
    // 载入图片
    const image = new Image();
    image.src = images[imageCount]; // 根據計數器載入對應的圖片
    imageCount++; // 每次呼叫增加計數器
    if (imageCount >= images.length) { // 判斷是否需要重置計數器
        imageCount = 0;
    }


    image.onload = () => {
        canvas1.width = image.width / 10;
        canvas1.height = image.height / 10;
        context1.drawImage(image, 0, 0, canvas1.width, canvas1.height);

        // let gradientColor = context2.createLinearGradient(0, 0, canvas2.width, canvas2.height);
        let gradientColor = context2.createLinearGradient(0, 0, 180, 180);        
        gradientColor.addColorStop(0, '#b3d8e1');
        gradientColor.addColorStop(1, '#ffcd95');
        context2.fillStyle = gradientColor;
        context2.fillRect(0, 0, 410, 410);
        // context2.fillRect(0, 0, canvas2.width, canvas2.height);
      };
};



const nextBtn = document.getElementById('next-btn');
nextBtn.addEventListener('click', () => {
    // 重新初始化 canvas
    context2.globalCompositeOperation = 'source-over';
    context2.clearRect(0, 0, canvas2.width, canvas2.height);
    init();
});


//intially mouse X and mouse Y positions are 0
let mouseX=0;
let mouseY=0;
let isDragged=false;

//Events for touch and mouse
let events={
    mouse:{
        down:"mousedown",
        move:"mousemove",
        up:"mouseup",
    },
    touch:{
        down:"touchstart",
        move:"touchmove",
        up:"touchend",
    },
};

let deviceType="";

//Detect touch device
const isTouchDevice=()=>{
    try{
        //We try to create TouchEvent. It would fail for desktops and throw error.
        document.createEvent("TouchEvent");
        deviceType="touch";
        return true;
    }catch(e){
        deviceType="mouse";
        return false;
    }
};



//Get left and top of canvas
let rectLeft=canvas2.getBoundingClientRect().left;
let rectTop=canvas2.getBoundingClientRect().top;



const getXY = (e) => {
    const rect = canvas2.getBoundingClientRect();
    mouseX = (!isTouchDevice() ? e.pageX : e.touches[0].pageX) - rect.left;
    mouseY = (!isTouchDevice() ? e.pageY : e.touches[0].pageY) - rect.top;
};




isTouchDevice();
//Start scratch
canvas2.addEventListener(events[deviceType].down,(event)=>{
// canvas.addEventListener(events[deviceType].events[deviceType]="mouse"?down:start,(event)=>{
    isDragged=true;
    //Get x and y position
    getXY(event);
    scratch(mouseX,mouseY);
    // 在触摸事件处理函数中增加 scratch() 函数的调用次数，从而增加刮的密度
    for (let i = 0; i < 10; i++) {
        // 每次调用 scratch() 函数时，可以微调刮的位置，例如通过随机值来产生不同的位置
        scratch(mouseX + Math.random() * 5 - 2.5, mouseY + Math.random() * 5 - 2.5);
    }
});    


//mousemove/touchmove
canvas2.addEventListener(events[deviceType].move,(event)=>{
    if(isTouchDevice()){
        event.preventDefault(); // 阻止默认的滚动行为
        getXY(event);
        scratch(mouseX,mouseY);
    }
    if(isDragged){
        getXY(event);
        scratch(mouseX,mouseY);
    }
});

//stop drawing
canvas2.addEventListener(events[deviceType].up,()=>{
    isDragged=false;
});

//If mouse leaves the square
canvas2.addEventListener("mouseleave",()=>{
    isDragged=false;
});


const scratch = (x, y) => {
    context2.globalCompositeOperation = 'destination-out';
    context2.beginPath();
    //arc makes circle-x,y,radius,start angle,end angle
    context2.arc(x, y, 20, 0, 2 * Math.PI);
    context2.fill();
  };


window.onload=init();
