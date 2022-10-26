'use strict'

const pointA = 'A';
const pointB = 'B';
const travelTime = 50;

const routeSelector = document.getElementById('route');
let routes = [
    {
        startPoint: pointA,
        endPoint: pointB,
        price: 700,
        needReturn: false,
    },
    {
        startPoint: pointB,
        endPoint: pointA,
        price: 700,
        needReturn: false,
    },
    {
        startPoint: pointA,
        endPoint: pointB,
        price: 1200,
        needReturn: true,
    },
];

routes.forEach(option => {
    let formatPoint = option.needReturn ? ` из ${option.startPoint} в ${option.endPoint} и обратно в ${option.startPoint}` :` из ${option.startPoint} в ${option.endPoint}`;
    routeSelector.add(new Option(formatPoint));
    
});

const selectBackBlock = document.querySelector('.container__timeBack')
const timeSelector = document.getElementById('time');
const timeSelectorBack = document.getElementById('timeBack');

let schedule = [
    [
        {time: getFullTime(18, 0)},
        {time: getFullTime(18, 30)},
        {time: getFullTime(18, 45)},
        {time: getFullTime(19, 0)},
        {time: getFullTime(19, 15)},
        {time: getFullTime(21, 0)},
        
    ],
    [
        {time: getFullTime(18, 10)},
        {time: getFullTime(18, 50)},
        {time: getFullTime(18, 45)},
        {time: getFullTime(19, 0)},
        {time: getFullTime(19, 15)},
        {time: getFullTime(19, 35)},
        {time: getFullTime(19, 50)},
        {time: getFullTime(21, 50)},
        {time: getFullTime(21, 55)},
    ]
];

function getFullTime(hours, minutes){
    let newDate = new Date();
    newDate.setHours(hours, [minutes]);
    return newDate;
}

let backSchedule = [];

function formatOptionBack(date){
    backSchedule.length = 0;
    let array = schedule[1];
    for(let i = 0; i < array.length; i++){
        let nextTime = array[i].time;
        if(date > nextTime){
            continue;
        }
        backSchedule.push(nextTime);
    }
    return backSchedule;
}

function addOptions(array){
    array.forEach(option => {  
        let formatTime = `${option.time.getHours()}:${option.time.getMinutes()}`;
        timeSelector.add(new Option(formatTime));
    })
}

function addTicketOption(){
    while (timeSelector.options.length) {
        timeSelector.remove(0);
    }
    if(routeSelector.selectedIndex == 2){
        addOptions(schedule[0]);
        selectBackBlock.style.display = 'flex';
        return
    }
    selectBackBlock.style.display = 'none';
    let arrayScheduleElements = getShedule(routeSelector.selectedIndex);
    addOptions(arrayScheduleElements);
}

function addTicketOptionBack(){
    if(routeSelector.selectedIndex !== 2){
        return
    }
    let datesObjects = schedule[0];
    let dateObject = datesObjects[timeSelector.selectedIndex];
    let currentTime = dateObject.time;
    let arrivalTime = getArrivalTime(currentTime);//end of the trip
    let t = formatOptionBack(arrivalTime); //nearest to the end of the trip
    for(let time of t){
        let option = time;
        let formatTime = `${option.getHours()}:${option.getMinutes()}`;
        timeSelectorBack.add(new Option(formatTime));
    }
}

const showTicketBlock = document.querySelector('.show__tickets');
const button = document.querySelector('.sum');

button.addEventListener('click', () => {
    calculate();
})

function getShedule(index){
    if(index < schedule.length){
       return schedule[index];
    }
    let arrayScheduleElements = new Array;
    for(let i = 0; i < schedule.length; i++){
        let elements = schedule[i];
        for(let k = 0; k < elements.length; k++){
            arrayScheduleElements.push(elements[k]);
        }
    }
    return arrayScheduleElements;
}

function calculate(){
    let routeIndex = routeSelector.selectedIndex;
    let currentRoute = routes[routeIndex];//selected path
    let datesObjects = getShedule(routeIndex);
    let dateObject = datesObjects[timeSelector.selectedIndex];
    let currentTime = dateObject.time; //sending time
    let currentCount = document.getElementById('num').value; //number of tickets
    let currentPrice = currentRoute.price*currentCount; //total cost
    let formatPoint = currentRoute.needReturn ? ` из ${currentRoute.startPoint} в ${currentRoute.endPoint} и обратно в ${currentRoute.startPoint}` :` из ${currentRoute.startPoint} в ${currentRoute.endPoint}`;
    let arrivalTime = getArrivalTime(currentTime);//end trip
    let text;
    if(currentRoute.needReturn){
        let backTime = backSchedule[timeSelectorBack.selectedIndex];//selected reverse time
        let arrivalTimeBack = getArrivalTime(backTime); //end return trip
        let stop = getStopTime(backTime, arrivalTime);
        text = `Вы выбрали ${currentCount} билет(а/ов) по маршруту ${formatPoint}. Итоговая сумма к оплате составит ${currentPrice} p. Длительность поездки составляет: ${travelTime} мин из пункта А в пункт В,  ${stop} на ожидание следующего теплохода и ${travelTime} мин из пункта В в пункт А.
        Ваше путешествие начнется в ${currentTime.toLocaleTimeString('en-GB')}, и закончится в ${arrivalTimeBack.toLocaleTimeString('en-GB')}.`;
        showTicketStyle(text);
        return;
    }
    text = `Вы выбрали ${currentCount} билет(а/ов) по маршруту ${formatPoint}. Итоговая сумма к оплате составит ${currentPrice} p.
    Это путшествие займет у вас ${travelTime} минут. Теплоход отправляется в ${currentTime.toLocaleTimeString('en-GB')}, а прибудет в ${arrivalTime.toLocaleTimeString('en-GB')}.`;
    showTicketStyle(text);
}

function getArrivalTime(date){
    return new Date(date.getTime() + travelTime*60000);
}

function getStopTime(date1, date2){ 
    let BAHours =  date1.getHours();
    let BAMinutes = date1.getMinutes();
    let ABHours = date2.getHours();
    let ABMinutes = date2.getMinutes();
    let hours = BAHours - ABHours;
    let minutes = BAMinutes - ABMinutes;
    let result  = `${hours}ч ${minutes}мин`;
    return result;
}

function getClosestTime(date){
    let array = schedule[1];
    for(let i = 0; i < array.length; i++){
        let nextTime = array[i].time;
        if(date.getTime() < nextTime)
            continue;
        return nextTime;
    }
}

function showTicketStyle(text){
    let closeContainer = document.querySelector('.container');
    closeContainer.style.display = 'none';
    showTicketBlock.style.display = 'block';
    showTicketBlock.textContent = text;
    let buttonReturn = document.createElement('button');
    buttonReturn.innerHTML = '<a href="index.html">Купить еще</a>';
    showTicketBlock.append(buttonReturn);
}







 