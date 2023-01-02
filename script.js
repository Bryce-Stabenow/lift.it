const navTabs = document.querySelectorAll('.navTab');

const capFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const removeAllChildren = (element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
}

const updateTab = (e) => {
    navTabs.forEach((tab) => {
        tab.classList.remove('selectedTab')
    });

    if(typeof(e) === 'string'){
        document.querySelector('#' + e).classList.add('selectedTab');
        renderLifts(e);
    } else {
        e.target.classList.add('selectedTab');
        renderLifts(e.target.id);
    }
}

//Main CRUD Logic
const addLift = (category, newData) => {
    let existingLifts = JSON.parse(localStorage.getItem(category));

    if(existingLifts[newData.name]){
        alert("A lift with that name already exists; please edit that lift instead.");
    };

    existingLifts[newData.name] = {
        name: newData.name,
        weight: newData.weight,
        reps: newData.reps
    };
    
    localStorage.setItem(category, JSON.stringify(existingLifts));
}

const renderLifts = (category) => {
    let name = 'brawn' + capFirst(category.replace('Tab', ''));
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
            cardWeight.textContent = data.weight + ' lbs.';
            reps.textContent = 'Sets: ' + data.reps.join(', ');

            //Add Classes
            newLiftCard.setAttribute('class', 'liftCard');
            cardTitle.setAttribute('class', 'liftCardTitle');
            topCard.setAttribute('class', 'cardTop');
            cardWeight.setAttribute('class', 'liftCardWeight');
            reps.setAttribute('class', 'liftCardReps');

            document.querySelector('main').appendChild(fragment);
        });
    } else if (keys.length === 0){
        let fragment = document.createDocumentFragment();
        let text = fragment.appendChild(document.createElement('p'));

        text.textContent = 'No Lifts Yet';
        text.setAttribute('class','message');
        document.querySelector('main').appendChild(fragment);
    }
}

const removeLift = (category, liftName) => {
    let existingLifts = JSON.parse(localStorage.getItem(category));

    if(!existingLifts[liftName]){
        alert("No lift was found to delete");
    };

    delete existingLifts[liftName];

    localStorage.setItem(category, JSON.stringify(existingLifts));
}

const editLift = (category, liftName, liftData) => {
    let existingLifts = JSON.parse(localStorage.getItem(category));

    if(!existingLifts[liftName]){
        alert("That didn't seem to work. Please try it again");
    };

    delete existingLifts[liftName];

    existingLifts[liftData.name] = liftData;

    localStorage.setItem(category, JSON.stringify(existingLifts));
}

//Initialize app logic
if(!localStorage.getItem('brawnData')){
    localStorage.setItem('brawnPush', JSON.stringify({
        "First Lift": {name: 'First Lift', weight: 45, reps: [12,12,10]},
    }));
    localStorage.setItem('brawnPull', JSON.stringify({}));
    localStorage.setItem('brawnLegs', JSON.stringify({}));
    localStorage.setItem('brawnCardio', JSON.stringify({}));
    localStorage.setItem('brawnAbs', JSON.stringify({}));
    localStorage.setItem('brawnData',  true);
}

navTabs.forEach((tab) => {
    tab.addEventListener('click', updateTab);
});

renderLifts('push');

//Initialize Modal
const openModal = () => {
    let overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'flex';
}

const closeModal = () => {
    let overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'none';
}

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
        name: e.currentTarget.liftName.value,
        weight: e.currentTarget.liftWeight.value,
        reps: reps.filter((set) => set !== ''),
    };

    addLift(category, newLift);
    closeModal();
    updateTab(e.currentTarget.liftCategory.value + 'Tab');
}

document.querySelector('[name="addLift"]').addEventListener('submit', submitModal);