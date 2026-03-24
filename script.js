const video = document.getElementById("webcam")
const match = document.getElementById("lighter")
const cakeImg = document.getElementById("cake")

let handPosition = {x:0,y:0}
let isHandDetected=false
let isCakeLit=false

const hands = new Hands({
locateFile: (file)=>{
return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
}
})

hands.setOptions({
maxNumHands:1,
modelComplexity:1,
minDetectionConfidence:0.7,
minTrackingConfidence:0.5
})

hands.onResults(results=>{
if(results.multiHandLandmarks.length>0){

isHandDetected=true

const landmark=results.multiHandLandmarks[0][8]

handPosition.x=landmark.x
handPosition.y=landmark.y

updateMatchPosition()
checkCandleLighting()

}else{
isHandDetected=false
}
})

const camera=new Camera(video,{
onFrame: async ()=>{
await hands.send({image:video})
},
width:640,
height:480
})

camera.start()

function updateMatchPosition(){

if(!isHandDetected)return

const cakeArea=document.querySelector(".cake-area")
const rect=cakeArea.getBoundingClientRect()

const padding=20

const matchX=padding+handPosition.x*(rect.width-padding*2-40)
const matchY=padding+handPosition.y*(rect.height-padding*2-60)

match.style.left=`${matchX}px`
match.style.top=`${matchY}px`

}

function checkCandleLighting(){

if(isCakeLit)return

const matchRect=match.getBoundingClientRect()
const cakeRect=cakeImg.getBoundingClientRect()

const matchTipX=matchRect.left+matchRect.width/2
const matchTipY=matchRect.top

const candleX=cakeRect.left+cakeRect.width/2
const candleY=cakeRect.top+10

const distance=Math.sqrt(
Math.pow(matchTipX-candleX,2)+
Math.pow(matchTipY-candleY,2)
)

if(distance<40){
lightCake()
}

}

function lightCake(){

if(isCakeLit)return

isCakeLit=true

cakeImg.src="assets/cake_lit.gif"

match.style.display="none"

}
