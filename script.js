//Utility functions and get tab ------------------------------------------------------------------//
const navTabs = document.querySelectorAll('.navTab');
let currentTab = 'pushTab';

if (!localStorage.getItem('currentTab')){
    localStorage.setItem('currentTab', 'pushTab');
}
else {
    currentTab = localStorage.getItem('currentTab');
};

//Initialize local storage before rendering ------------------------------------------------------//
if(!localStorage.getItem('brawnData')){
    resetData();
};

const capFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const removeAllChildren = (element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
};

const manualReset = () => {
    confirm('Are you sure you want to reset your data?') ? resetData() : toggleCreditsModal();
};

//Load CRUD Logic -------------------------------------------------------------------------------//
const addLift = (category, newData) => {
    let existingLifts = JSON.parse(localStorage.getItem(category));
    let id = newData.id !== "" ? newData.id : Object.keys(existingLifts).length + 1;

    if(existingLifts[id]){
        editLift(category, id, newData);
    };

    existingLifts[id] = {
        id: id,
        name: newData.name,
        category: newData.category,
        weight: newData.weight ?? '',
        time: newData.time ?? '',
        reps: newData.reps ?? '',
        speed: newData.speed ?? '',
    };
    
    localStorage.setItem(category, JSON.stringify(existingLifts));
};

const inspectLift = (e) => {
    let id = e.currentTarget.dataset.id;
    let dataName = 'brawn' + capFirst(localStorage.getItem("currentTab").replace('Tab', ''));
    let lift = JSON.parse(localStorage.getItem(dataName))[id];
    openModal();

    //Set values in form
    document.querySelector("form>h4").innerText = 'Edit Exercise:';
    document.querySelector("input[name='submit']").value = 'Save';
    document.querySelector("input[name='liftName']").value = lift.name;
    document.querySelector("input[name='id']").value = lift.id;
    document.querySelector("input[name='liftWeight']").value = lift.weight;
    document.querySelector("input[name='speed']").value = lift.speed;
    document.querySelector("input[name='time']").value = lift.time;
    document.querySelector("select[name='liftCategory']").value = lift.category;
    lift.reps.forEach((rep, index) => {
        let name = "input[name='reps" + (index +1) + "']";
        document.querySelector(name).value = rep;
    })
    document.querySelector("button#deleteLift").style.display = 'inline-block';
};

const renderLifts = (category) => {
    category = category.replace('Tab', '');
    let name = 'brawn' + capFirst(category);
    let lifts = JSON.parse(localStorage.getItem(name));
    let keys = Object.keys(lifts);
    removeAllChildren(document.querySelector('main'));

    if(keys.length > 0){
        keys.forEach(key => {
            let data = (lifts[key]);

            //Create elements to add
            let fragment = document.createDocumentFragment();
            let newLiftCard = fragment.appendChild(document.createElement('div'));
            let topCard = newLiftCard.appendChild(document.createElement('div'));
            let cardTitle = topCard.appendChild(document.createElement('h2'));
            let cardWeight = topCard.appendChild(document.createElement('h3'));
            let reps = newLiftCard.appendChild(document.createElement('h3'));

            //Set text for elements
            cardTitle.textContent = data.name;

            if(data.weight !== '' && category !== 'cardio'){
                cardWeight.textContent = data.weight + ' lbs.';
            } else if (data.time !== '' && category === 'cardio'){
                cardWeight.textContent = 'Speed: ' + data.speed;
            }

            if(data.reps.length > 0 && category !== 'cardio'){
                reps.textContent = 'Sets: ' + data.reps.join(', ');
            } else if (data.speed !== '' && category === 'cardio'){
                reps.textContent = data.time + ' min.';
            }

            //Add attributes
            newLiftCard.setAttribute('class', 'liftCard pointer');
            newLiftCard.setAttribute('data-id', data.id)
            cardTitle.setAttribute('class', 'liftCardTitle');
            topCard.setAttribute('class', 'cardTop');
            cardWeight.setAttribute('class', 'liftCardWeight');
            reps.setAttribute('class', 'liftCardReps');

            document.querySelector('main').appendChild(fragment);
        });
    } else if (keys.length === 0){
        let fragment = document.createDocumentFragment();
        let text = fragment.appendChild(document.createElement('p'));

        text.textContent = 'No Exercises Yet';
        text.setAttribute('class','message');
        document.querySelector('main').appendChild(fragment);
    }

    document.querySelectorAll('.liftCard').forEach(card => {
        card.addEventListener('click', inspectLift);
    })
};

const removeLift = () => {
    let category = 'brawn' + capFirst(currentTab.replace('Tab', ''));
    let existingLifts = JSON.parse(localStorage.getItem(category));
    let liftIdToDelete = document.querySelector("input[name='id']").value;

    if(confirm('Continue deleting this lift?')){
        delete existingLifts[liftIdToDelete];

        localStorage.setItem(category, JSON.stringify(existingLifts));
        renderLifts(currentTab);
        closeModal();
    };
};

const editLift = (category, liftName, liftData) => {
    let existingLifts = JSON.parse(localStorage.getItem(category));

    if(!existingLifts[liftName]){
        alert("That didn't seem to work. Please try again");
    };

    delete existingLifts[liftName];

    existingLifts[liftData.name] = liftData;

    localStorage.setItem(category, JSON.stringify(existingLifts));
};

renderLifts('pushTab')

//Initialize app logic ---------------------------------------------------------------------------//
function resetData(){
    localStorage.setItem('brawnPush', JSON.stringify({}));
    localStorage.setItem('brawnPull', JSON.stringify({}));
    localStorage.setItem('brawnLegs', JSON.stringify({}));
    localStorage.setItem('brawnCardio', JSON.stringify({}));
    localStorage.setItem('brawnAbs', JSON.stringify({}));
    localStorage.setItem('brawnData',  true);
    document.querySelector(".credits-modal-overlay").style.display = 'none';
    window.location.reload();
};

const updateTab = (e) => {
    navTabs.forEach((tab) => {
        tab.classList.remove('selectedTab')
    });

    if(typeof(e) === 'string'){
        document.querySelector('#' + e).classList.add('selectedTab');
        renderLifts(e);
        localStorage.setItem('currentTab', e);

    } else {
        e.target.classList.add('selectedTab');
        renderLifts(e.target.id);
        localStorage.setItem('currentTab', e.target.id);
    }
};

updateTab(currentTab);

navTabs.forEach((tab) => {
    tab.addEventListener('click', updateTab);
});

let swapInputs = document.querySelectorAll('.swapInput');

//Initialize Modals ------------------------------------------------------------------------------//
const setCardioInputs = () => {
    swapInputs.forEach(input => {
        input.classList.toggle('hidden');
    });
};

const checkInputType = () => {
    let category = document.querySelector('[name="liftCategory"]').value;
    let cardioVisible = document.querySelector('#cardioTrigger').classList.contains('hidden') === false;
    if(category === 'cardio' && cardioVisible === false){
        setCardioInputs();
    }
    else if(category !== 'cardio' && cardioVisible === true){
        setCardioInputs();
    };
};

const clearModal = () => {
    document.querySelector("form>h4").innerText = 'Add an Exercise:';
    document.querySelector("input[name='submit']").value = 'Add';
    document.querySelector("input[name='liftName']").value = '';
    document.querySelector("input[name='liftWeight']").value = '';
    document.querySelector("select[name='liftCategory']").value = localStorage.getItem("currentTab").replace('Tab', '');
    for(let i = 0; i < 5; i++){
        let name = "input[name='reps" + (i +1) + "']";
        document.querySelector(name).value = '';
    };
    document.querySelector("button#deleteLift").style.display = 'none';
};

const openModal = () => {
    let overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'flex';
    clearModal();
    checkInputType();
};

const closeModal = () => {
    let overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'none';
};

const submitModal = (e) => {
    e.preventDefault();

    let category =  'brawn' + capFirst(e.currentTarget.liftCategory.value);

    let reps = [
        e.currentTarget.reps1.value, 
        e.currentTarget.reps2.value, 
        e.currentTarget.reps3.value, 
        e.currentTarget.reps4.value, 
        e.currentTarget.reps5.value, 
    ];

    let newLift = {
        id: e.currentTarget.id.value,
        name: e.currentTarget.liftName.value,
        category: e.currentTarget.liftCategory.value,
        weight: e.currentTarget.liftWeight.value,
        reps: reps.filter((set) => set !== ''),
        time: e.currentTarget.time.value,
        speed: e.currentTarget.speed.value,
    };

    addLift(category, newLift);
    closeModal();
    updateTab(e.currentTarget.liftCategory.value + 'Tab');
};

const toggleCreditsModal = () => {
    let creditsModal = document.querySelector(".credits-modal-overlay");

    if(creditsModal.style.display === 'flex'){
        creditsModal.style.display = 'none';
    }
    else {
        creditsModal.style.display = 'flex';
    }
};

const toggleTimerModal = () => {
    let timerModal = document.querySelector(".timer-modal-overlay");

    if(timerModal.style.display === 'flex'){
        timerModal.style.display = 'none';
    }
    else {
        timerModal.style.display = 'flex';
    }
};

document.querySelector('[name="addLift"]').addEventListener('submit', submitModal);
document.querySelector('[name="liftCategory"]').addEventListener('change', checkInputType);

//Timer ------------------------------------------------------------------------------//
let interval = null;
let time = 0;

const getUserTimerInputs = () => {
    let timerMinutes = parseInt(document.querySelector('#timerMinutes').value);
    let timerSeconds = parseInt(document.querySelector('#timerSeconds').value);

    return [timerMinutes, timerSeconds];
};

const getMSFromUserInputs = () => {
    let inputs = getUserTimerInputs();
    let timerMinutes = inputs[0];
    let timerSeconds = inputs[1];
    return (timerMinutes * 60000) + (timerSeconds * 1000);
};

const formatTime = (timeInMS) => {
    return (timeInMS / 1000);
};

const renderTime = (inputInMS) => {
    let display = document.querySelector('.timerTime');
    let formattedTime = formatTime(inputInMS);
    time = inputInMS;

    display.innerText = formattedTime + ' sec.';
};

renderTime(getMSFromUserInputs());

const countSecond = () => {
    time = time - 1000;

    if(time > 0){
        renderTime(time);
    }
    else if(time <= 0){
        stopTimer();
        document.querySelector('.timerTime').innerText = "TIME'S UP";
        document.querySelector('.timerTime').classList.add('flash');
    };
};

const startTimer = () => {
    if(!interval){
        interval = setInterval(countSecond, 1000);
    };
};

const stopTimer = () => {
    clearInterval(interval);
    interval = null;
};

const resetTimer = () => {
    renderTime(getMSFromUserInputs());
};