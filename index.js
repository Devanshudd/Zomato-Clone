let isOrderAccepted = false;
let isValetFound = false;
let hasRestaurantSeenYourOrder =false;
let restaurantTimer =null;
let valetTimer = null;
let isOrderDelivered= false;
let valetDeliveryTimer = null;

//Zomato App - BOOT up/ Power Up /Start
window.addEventListener('load', function(){
  document.getElementById('acceptOrder').addEventListener('click',function(){
        askRestaurantToAcceptOrReject();

    });

    this.document.getElementById('findValet').addEventListener('click',function(){
        startSearchingForValets();
    });


    this.document.getElementById('deliverOrder').addEventListener('click',function(){
        setTimeout(() =>{
            isOrderDelivered= true;
        },2000);
    });

    checkIfOrderAcceptedFromRestaurant()
        .then(isOrderAccepted=>{
            console.log('Update from Restaurant ',isOrderAccepted);
            //step-2 -start preparing
            if(isOrderAccepted) startPreparingOrder();
            //step-3 - Order rejected
            else alert ('Sorry restaurant coundnt accept your order! Returning your amount with zomato shares!');
        })
        .catch(err=>{
            console.log(err);
            this.alert('Something went wrong! Please try again later');
        })
  
})

//Step-1 - Check Whether Restaurant Accepted order or Not
function askRestaurantToAcceptOrReject(){
    // Callback
    setTimeout(() =>
    {
        isOrderAccepted = confirm('Should Restaurant Accept order?');
        hasRestaurantSeenYourOrder=true;
    },1000);

}

//Step-2 - check if Restaurant has accepted order

function checkIfOrderAcceptedFromRestaurant()
{
    return new Promise((resolve,reject) =>{
        restaurantTimer=setInterval(()=>{
            console.log('Checking if order accepted or not')
            if(!hasRestaurantSeenYourOrder) return;
            if(isOrderAccepted) resolve(true);
            else resolve(false);
            clearInterval(restaurantTimer);
        },2000)
    });
}


//Step-4 -Start Preparing
function startPreparingOrder(){
    Promise.allSettled([
        updateOrderStatus(),
        updateMapView(),
        checkIfValetAssigned(),
        checkIfOrderDelievered()
    ])
    .then(res=>{
        console.log(res);
        setTimeout(()=>{
            alert('How was your food? rate your food and delivery partner')
        },2000)
    })
    .catch(err=>{
        console.error(err);
    })
}


function updateOrderStatus(){
    return new Promise ((resolve,reject) =>{
        setTimeout(()=>{
            document.getElementById('currentStatus').innerText=isOrderDelivered 
            ? 'Order Delivered Succeessfully ' : 'Preparing Your Order';
            resolve('Status Updated');
        },1500);
    })
    
}


function updateMapView()
{
    return new Promise((resolve,reject) =>{
        setTimeout(()=>{
            document.getElementById('mapview').style.opacity='1';
            resolve('map initialized');
        },1000);
    });
    
}



function startSearchingForValets(){
    //Steps
    //1. Get all locations of nearby wallets
    //2. Sort the wallets based on shortest path of restaurants to customer home
    //3.Select the wallet with shortest distance and minimum



    //Step-1 - get wallets
    const valetPromises = [];
    for(let i=0;i<5;i++)
    {
        valetPromises.push(getRandomDriver());
    }
    console.log(valetPromises);

    Promise.any(valetPromises)
    .then(selectedValet =>{
        console.log('Selected a valet=> ',selectedValet);
        isValetFound=true;
    })
    .catch(err=>{
        console.error(err);
    })
}


function getRandomDriver(){
    //Fake delay to get location data from riders
    return new Promise((resolve,reject) =>{
        const timeout = Math.random()*1000;
        setTimeout(()=>{
            resolve('Wallet ',timeout);
        },timeout);
    })
}


function checkIfValetAssigned(){
    return new Promise((resolve,reject) =>{
        valetTimer = setInterval(()=>{
            console.log('Searching for Valet');
            if(isValetFound){
                updatevaletDetails();
                resolve('updated valet Details');
                clearTimeout(valetTimer);
            }
        },1000);
    })
}


function checkIfOrderDelievered(){
    return new Promise((resolve,reject) =>{
        valetDeliveryTimer = setInterval(()=>{
            console.log('Is Order delivered by valet');
            if(isOrderDelivered){
                resolve('updated delivered valet Details');
                updateOrderStatus();
                clearTimeout(valetTimer);
                document.getElementById('status-time').classList.add('none');
                document.getElementById('status').classList.add('none');
            }
        },1000);
    })
}

function updatevaletDetails(){
    if(isValetFound){
        document.getElementById('finding-driver').classList.add('none');
        document.getElementById('found-driver').classList.remove('none');
        document.getElementById('call').classList.remove('none');
    }
}





//Promise - then,catch Callback -resolve,reject
//Types of promises
//1.Promise.all -call all operations parallely,if one fails -all fails
//2.promise.allsettled : same like upper,but if one fails that doesn't mean all other things are also failed
//3.Promise.race:First promise to complete whether it is resolve or rejected
//4.Promise.any:First promise to fullfilled that is resolved/fullfilled

