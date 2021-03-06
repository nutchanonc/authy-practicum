// function hash(stringy) {
//     console.log(stringy);
//     document.getElementById("output").innerHTML = hex_sha256(stringy);
// }





let _card_placed = false;
let _card_placed_cache = false;


const device_e = document.getElementById("device-name");
const status_e = document.getElementById("device-status");
const location_e = document.getElementById("device-location");
const description_e = document.getElementById("device-description");
const username_e = document.getElementById("username");

const current_user_display_e = document.getElementById("currentUserDisplay");
const current_username_e     = document.getElementById("currentUsername");
const profile_img_e          = document.getElementById("currentUserPicture");


const lightGreenForBox = "rgb(207, 255, 234)";
const lightGreenForBoxBorder = "rgb(26, 173, 109)"

const redForBoxBorder = "rgb(252, 3, 82)";
const redForBox = "rgb(255, 217, 221)";

const lightYellowForBox = "rgb(240, 239, 182)";


const defaultBorderColor = "rgb(48, 48, 48)";

// no 
document.getElementById('user').style.visibility = 'hidden';

function _initialize_client_user() {
    // fetch('https://practicum-po.herokuapp.com/userInfo?{}')
}


function placeCard() {

    _card_placed = true;
    
}


function removeCard() {
    _card_placed = false;
}

function checkCard() {
    if (_card_placed == !_card_placed_cache) {
        setInterfaceForCardPlaced(_card_placed);
        _card_placed_cache = _card_placed;
    }
}

function setInterfaceForCardPlaced(bool) {
    if (bool) {
        document.getElementById("device-bg").style.backgroundColor = lightGreenForBox;
        document.getElementById("device-bg").style.borderColor = lightGreenForBoxBorder;
        document.getElementById("device-status").innerHTML = 'card detected'
    }
    else {

        document.getElementById("device-bg").style.backgroundColor = redForBox;
        document.getElementById("device-bg").style.borderColor = redForBoxBorder;
        document.getElementById("device-status").innerHTML = 'card removed'
        setTimeout(() => {
            document.getElementById("device-bg").style.backgroundColor = "white";
            document.getElementById("device-bg").style.borderColor = defaultBorderColor;
            document.getElementById("device-status").innerHTML = '(not in used)'
        } , 1000);
    }
}





setInterval(() => {

    // Update UI
    checkCard(_card_placed , _card_placed_cache);
    getDeviceStatus();
},1500);



// Extra functions
var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10)
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
}


async function getDeviceStatus() {
    await fetch('https://practicum-po.herokuapp.com/getDevice')
    .then(res => res.json())
    .then(res => {
        //console.log(res);
        updateDeviceUI(res);
    });
}

function printDeviceStatus() {
    console.log(device);
}

function updateDeviceUI(res) {
    device_e.innerHTML = `${res.deviceName} `;
    location_e.innerHTML = `${res.location}`;
    description_e.innerHTML = `${res.descriptions.toUpperCase()}`
    status_e.innerHTML = `${res.currentUserId ? "( in used )" : "( not in used )"}`;
    if (res.currentUserId) {
        placeCard();
        fetch(`https://practicum-po.herokuapp.com/userInfo?id=${res.currentUserId}`)
        .then(res => res.json())
        .then(res => {
            current_user_display_e.innerHTML = `${res.firstname} ${res.lastname}`;
            current_username_e.innerHTML = `@${res.username}`;
            profile_img_e.src = res.image;
            setTimeout(() => document.getElementById('user').style.visibility = 'visible' , 700)
            
        });
    }
    else {
        removeCard();
        document.getElementById('user').style.visibility = 'hidden';
    }
    checkCard();
}


initializeCookie();
readAuthCookies_Home();