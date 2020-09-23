let source;
let destination;
let db;
let data;
let matches;

function getLabelData() {
    if (!matches) {
        // Generate NodeList of all label data elements
        matches = window.frames["output"].contentDocument.querySelectorAll('[data-label]');
    }

    source = db({id: parseInt(document.labels.source.value)}).first();
    destination = db({id: parseInt(document.labels.destination.value)}).first();

    for (const e of matches) {
        switch (e.dataset.label) {
            case "from-id":
                e.textContent = ["FROM:", source.id].join(" ");
                break;
            case "from-name":
                e.textContent = source.name;
                break;
            case "from-address-1":
                e.textContent = source.address;
                break;
            case "from-address-2":
                e.textContent = [source.city, source.state, source.zip].join(" ");
                break;
            case "to-id":
                e.textContent = ["TO:", destination.id].join(" ");
                break;
            case "to-name":
                e.textContent = destination.name;
                break;
            case "to-address-1":
                e.textContent = destination.address;
                break;
            case "to-address-2":
                e.textContent = [destination.city, destination.state, destination.zip].join(" ");
                break;
            case "hub-route-id":
                e.textContent = [destination.hub, "-", destination.routeid].join(" ");
                break;
            case "barcode":
                e.textContent = ["*", destination.id, "*"].join(" ");
                break;
            case "seo":
                // empty if no value
                e.textContent = destination.seo ? ["SEO:", destination.seo].join(" ") : "";
                break;
            default:
                e.textContent = 'ERROR'
        }
    }
}

function printLabels() {
    window.frames["output"].focus();
    window.frames["output"].contentWindow.print();
}

// Populate the form dropdowns
function loadOptions() {
    db().each(function (record) {
        let x, y;
        x = document.createElement("option");
        y = document.createElement("option");
        x.text = y.text = record["name"] + " (" + record["id"] + ") "; // ex: Huntington Branch Library (4809)
        x.value = y.value = record["id"];
        document.getElementById("source").add(x);
        document.getElementById("destination").add(y);
    });
}

// Initialise TaffyDB from JSON file
function initDB() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            data = JSON.parse(this.responseText);
            db = TAFFY(data);
            db.sort("name"); // Alphabetize
            loadOptions();
        }
    };
    xmlhttp.open("GET", "output.json", true);
    xmlhttp.send();
}
