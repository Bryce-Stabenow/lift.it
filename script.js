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

    e.target.classList.add('selectedTab');

    renderLifts(e.target.id);
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
            let cardTitle = newLiftCard.appendChild(document.createElement('h2'));
            let rightCard = newLiftCard.appendChild(document.createElement('div'));
            let cardWeight = rightCard.appendChild(document.createElement('h3'));
            let reps = rightCard.appendChild(document.createElement('h3'));

            //Set text for elements
            cardTitle.textContent = data.name;
            cardWeight.textContent = data.weight + ' lbs.';
            reps.textContent = 'Sets: ' + data.reps;

            //Add Classes
            newLiftCard.setAttribute('class', 'liftCard');
            cardTitle.setAttribute('class', 'liftCardTitle');
            rightCard.setAttribute('class', 'cardRight');
            cardWeight.setAttribute('class', 'liftCardWeight');
            reps.setAttribute('class', 'liftCardReps');

            document.querySelector('main').appendChild(newLiftCard);
        });
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