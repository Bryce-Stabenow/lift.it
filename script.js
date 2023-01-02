//Initialize app data in localstorage
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