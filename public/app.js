const actionBtn = document.getElementById("action-button");

const makeNote = document.getElementById("make-new");


const results = document.getElementById("results");

const status = document.getElementById("status");


function clearForm() {

     document.getElementById('training-name').value ='';
     document.getElementById('description').value='';
     document.getElementById('easy').checked;
}

function clearResults() {
    document.getElementById("results").innerHTML='';
}

function updateFormFields(data) {
    
    document.getElementById('training-name').value= data.name;
    document.getElementById('description').value= data.description;

    switch(data.difficulty) {
        case 'easy':
            document.getElementById('easy').checked = true;
          break;
        case 'medium':
            document.getElementById('medium').checked = true;
            break;
          case 'hard':
            document.getElementById('hard').checked = true;
            break;
          default:
          
    }
}

function getResults() {
    clearResults();

    fetch("/training")
        .then(function(response) {
            if (response.status !== 200) {
                console.log("Looks like there was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function(data) {
                newRecordSnippet(data);
            });
        })
        .catch(function(err) {
            console.log("Fetch Error :-S", err);
        });
}

function newRecordSnippet(res) {
    for (var i = 0; i < res.length; i++) {
        let data_id = res[i]["_id"];
        let trName = res[i]["name"];
        let trDifficulty = res[i]["difficulty"];
        let trDesc = res[i]["description"];
        let trList = document.getElementById("results");
        snippet = `
      <p class="data-entry">
      <span class="data-training-name" data-id=${data_id}>${trName}</span>
      <span class="data-training-name" data-id=${data_id}>${trDesc}</span>
      <span class="data-training-name" data-id=${data_id}>${trDifficulty}</span>
      <span onClick="delete" class="delete" data-id=${data_id}>x</span>;
      </p>`;
        trList.insertAdjacentHTML("beforeend", snippet);
    }
}

getResults();



results.addEventListener("click", function(e) {
    if (e.target.matches(".delete")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/training/" + data_id, {
                method: "delete"
            })
            .then(function(response) {
                if (response.status !== 200) {
                    console.log("Looks like there was a problem. Status Code: " + response.status);
                    return;
                }
                element.parentNode.remove();
                clearForm();
                
                let newButton = `
                    <button id='make-new'>Submit</button>`;
                actionBtn.innerHTML = newButton;
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    } else if (e.target.matches(".data-training-name")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        status.innerText = "Editing"

        fetch("/training/" + data_id, { method: "get" })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                updateFormFields(data);
                let newButton = `<button id='updater' data-id=${data_id}>Update</button>`;
                actionBtn.innerHTML = newButton;
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    }
});

actionBtn.addEventListener("click", function(e) {

    if (e.target.matches("#updater")) {
        updateBtnEl = e.target;
        data_id = updateBtnEl.getAttribute("data-id");
        const name = document.getElementById("training-name").value;
        const description = document.getElementById("description").value;
        var  difficulty = "";
        if (document.getElementById('easy').checked) {
            difficulty = "easy";
        } else if (document.getElementById('medium').checked)   {
            difficulty = "medium";
        } else {
            difficulty = "hard";
            }

        fetch("/training/" + data_id, {
                method: "put",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    description,
                    difficulty
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                clearForm();
                updateFormFields(data);
                let newButton = `<button id='make-new'>Submit</button>`;
                actionBtn.innerHTML = newButton;
                status.innerText = "Creating"
                
                location.reload();
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    } else if (e.target.matches("#make-new")) {
        element = e.target;

        data_id = element.getAttribute("data-id");
        var diff = "";
        if (document.getElementById('easy').checked) {
            diff = "easy";
        } else if (document.getElementById('medium').checked) 
        {
            diff = "medium";
        } else {
            diff = "hard";
            }

        fetch("/submit", {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: document.getElementById("training-name").value,
                    description: document.getElementById("description").value,
                    difficulty: diff
                })
            })
            .then(result => result.json().then(newEx => {
                location.reload();
            }));
        clearForm();
    }
});
