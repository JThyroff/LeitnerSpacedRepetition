document.addEventListener("DOMContentLoaded", function () {
    const inputs = [
        "interval-1", "interval-2", "interval-3", "interval-4", "interval-5", "interval-6", "interval-7",
    ];

    function reset_interval(document, id){
        let val = 0;
        switch(id){
            case "interval-1":
                val = 1;
                break;
            case "interval-2":
                val = 3;
                break;
            case "interval-3":
                val = 7;
                break;
            case "interval-4":
                val = 14;
                break;
            case "interval-5":
                val = 30;
                break;
            case "interval-6":
                val = 60;
                break;
            case "interval-7":
                val = 120;
                break;
            default:
                val = 0;
        }
        document.getElementById(id).value = val;
    }

    function date_diff(){
        // Get today's date
        const today = new Date();

        // Target date: 8th March 2025
        const targetDate = new Date(2025, 2, 7); // Month is 0-indexed (2 = March)

        // Calculate the difference in milliseconds
        const diffTime = today - targetDate;

        // Convert milliseconds to days
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        console.log(`Days since 08.03.2025: ${diffDays}`);

        return diffDays;
    }

    const storage = chrome.storage || browser.storage; // Use `chrome.storage` if available, fallback to `browser.storage`

    function update_levels(id, diffDays, daystring, endstring){
        let levels_todo = ""
        //Calculate the levels the respective day
        storage.local.get(inputs).then((result) =>{
            inputs.forEach(id =>{
                if ((diffDays % result[id]) === 0){
                    const level_number = id.replace("interval-", "");
                    levels_todo = levels_todo + level_number + ","
                }
            });

            levels_todo = levels_todo.replace(/,$/, ""); //remove trailing comma (,)

            console.log(levels_todo)
    
            document.getElementById(id).textContent = "Your levels due " + daystring + ": " +levels_todo + endstring;
        });
    }

    function update_all_levels(){
        const diffDays = date_diff();

        update_levels("levellabel",diffDays, "today", " ☺️");
        update_levels("levellabelyesterday",diffDays-1, "yesterday","");
        update_levels("levellabeltomorrow",diffDays+1, "tomorrow","");
    }

    // Load saved values when the popup opens
    storage.local.get(inputs).then((result) => {
        inputs.forEach(id => {
            if (result[id] !== undefined) {
                document.getElementById(id).value = result[id];
            }else{
                reset_interval(document,id);
            }
        });
        update_all_levels();
    });

    // Save values when clicking the save button
    document.getElementById("savebutton").addEventListener("click", function () {
        let values = {};
        inputs.forEach(id => {
            values[id] = document.getElementById(id).value;
        });

        storage.local.set(values).then(() => {
            alert("Settings saved!");
        });

        update_all_levels();
    });

    // Reset values when clicking the reset button
    document.getElementById("resetbutton").addEventListener("click", function () {
        let values = {};
        inputs.forEach(id => {
            reset_interval(document,id);
            values[id] = document.getElementById(id).value;
        });

        storage.local.set(values).then(() => {
            alert("Values reset and settings saved!");
        });

        update_all_levels();
    });
});
