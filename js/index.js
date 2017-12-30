;(function () {
    let doc = window.document;
    let mainBlock = doc.getElementById('first-window');
    let editBlock = doc.getElementById('edit-window');
    let index = 0;
    let contacts = [];

    let addBtn = doc.getElementById('add-btn');
    let contactsField = doc.getElementById('contacts-field');
    let searchInput = doc.getElementById('search-field');
    let masForSearch = [];
    let title1 = doc.getElementById("title1");
    let title2 = doc.getElementById("title2");

    let applyBtn = doc.getElementById('apply-btn');
    let trashBtn = doc.getElementById('tresh-btn');
    let cancelBtn = doc.getElementById('cancel-btn');
    let firstNameInput = doc.getElementById('first-name-field');
    let lastNameInput = doc.getElementById('last-name-field');
    let addPhoneBtn = doc.getElementById('add-phone-btn');
    let phonesField = doc.getElementById('phones-field');
    let addEmailBtn = doc.getElementById('add-email-btn');
    let emailsField = doc.getElementById('emails-field');
    let editTitle1 = doc.getElementById('edit-title1');
    let editTitle2 = doc.getElementById('edit-title2');
    let nameBox = doc.getElementById('name-box');
    let phBox = doc.getElementById('phone-box');
    let emBox = doc.getElementById('emeils-box');

    let startMainWindow = function () {
        while (contactsField.firstChild){
            contactsField.removeChild(contactsField.firstChild);
        }
        searchInput.value="";
        masForSearch = [];
        title2.style.display="none";
        title1.style.display="block";
        mainBlock.style.display = "block";
        editBlock.style.display = "none";
        let contactsOnServer = localStorage.getItem("base");
        if (contactsOnServer){
            contacts = JSON.parse(contactsOnServer);
            contacts.sort(function (a, b) {
                if (a.forSearch > b.forSearch)
                    return 1;
                if (a.forSearch < b.forSearch)
                    return -1;
                if (a.forSearch===b.forSearch)
                    return 0;
            });
            contacts.forEach(function (contact, i, contacts) {
                addLiOnWith(contactsField,"<span class='contact-span' id='"+(i+1)+"'>"+ contact.firstName+" "+contact.lastName+"</span>");
                contact.id=i+1;
                masForSearch.push(contact.forSearch);
            });
        }
    };

    let addLiOnWith = function (parent,content) {
        let li = doc.createElement('li');
        li.innerHTML = content;
        parent.appendChild(li);
    };

    doc.onclick = function (hitObj) {
        if (hitObj.target.className === "contact-span") {
            startEditWindow(hitObj.target.id, false);
        }
    };

    addBtn.onclick = function () {
        startEditWindow(index, true);
    };

    searchInput.oninput = function () {
        if (searchInput.value){
            title1.style.display="none";
            title2.style.display="block";
        } else {
            title2.style.display="none";
            title1.style.display="block";
        }
        masForSearch.forEach(function (item, i, masForSearch) {
            if (item.indexOf(searchInput.value.toLowerCase())===0){
                if (doc.getElementById(i+1)){
                    doc.getElementById(i+1).style.display="block";}
            } else {
                if (doc.getElementById(i+1)){
                    doc.getElementById(i+1).style.display="none";}
            }
        });
        contacts.forEach(function (item, i, contacts) {
            let lcItem = item.lastName.toLowerCase();
            if (lcItem.indexOf(searchInput.value.toLowerCase())===0){
                if (doc.getElementById(i+1)){
                    doc.getElementById(i+1).style.display="block";}
            }
        });
    };

    let startEditWindow = function (id, addNewContact) {
        mainBlock.style.display = "none";
        editBlock.style.display = "block";
        while (phonesField.firstChild){
            phonesField.removeChild(phonesField.firstChild);
        }
        while (emailsField.firstChild){
            emailsField.removeChild(emailsField.firstChild);
        }
        if (addNewContact){
            editTitle1.style.display = "block";
            editTitle2.style.display = "none";
            index = contactsField.childNodes.length+1;
            firstNameInput.value="";
            lastNameInput.value="";
            firstNameInput.oninput = function () {
                if (firstNameInput.value.length>24){
                    firstNameInput.value = firstNameInput.value.substr(0,24);}
            };
            lastNameInput.oninput = function () {
                if(lastNameInput.value.length>24){
                    lastNameInput.value = lastNameInput.value.substr(0,24);}
            };
            addLiOnWith(phonesField, "<input>");
            let phInputField = phonesField.lastChild.lastChild;
            phInputField.oninput = function () {
                if (phInputField.value.length>12){phInputField.value = phInputField.value.substr(0,12);}
                let val = phInputField.value;
                phInputField.value = phoneCheck(val);
            };
            addLiOnWith(emailsField,"<input>");
            let emInputField = emailsField.lastChild.lastChild;
            emInputField.oninput = function () {
                if (emInputField.value.length>36){emInputField.value = emInputField.value.substr(0,36);}
                let eval = emInputField.value;
                emeilCheck(eval,emInputField);
            };
        } else {
            editTitle2.style.display = "block";
            editTitle1.style.display = "none";
            index = id;
            firstNameInput.value=contacts[id-1].firstName;
            lastNameInput.value=contacts[id-1].lastName;
            firstNameInput.oninput = function () {
                if (firstNameInput.value.length>24){
                    firstNameInput.value = firstNameInput.value.substr(0,24);}
            };
            lastNameInput.oninput = function () {
                if(lastNameInput.value.length>24){
                    lastNameInput.value = lastNameInput.value.substr(0,24);}
            };
            contacts[id-1].phones.forEach(function (ph, i, phones) {
                addLiOnWith(phonesField, "<input>");
                let phInputField = phonesField.lastChild.lastChild;
                phInputField.value = ph;
                phInputField.oninput = function () {
                    if (phInputField.value.length>12){phInputField.value = phInputField.value.substr(0,12);}
                    let val = phInputField.value;
                    phInputField.value = phoneCheck(val);
                };
            });
            contacts[id-1].email.forEach(function (em, i, emails) {
                addLiOnWith(emailsField, "<input>");
                emailsField.lastChild.lastChild.value = em;
                let emInputField = emailsField.lastChild.lastChild;
                emInputField.oninput = function () {
                    if (emInputField.value.length>36){emInputField.value = emInputField.value.substr(0,36);}
                    let eval = emInputField.value;
                    emeilCheck(eval,emInputField);
                };
            });
        }
    };

    addPhoneBtn.onclick = function () {
        if (phonesField.lastChild) {
            let lastInput = phonesField.lastChild.lastChild;
            if (lastInput.value !== "") {
                addLiOnWith(phonesField, "<input>");
                let phInputField = phonesField.lastChild.lastChild;
                phInputField.oninput = function () {
                    if (phInputField.value.length>12){phInputField.value = phInputField.value.substr(0,12);}
                    let val = phInputField.value;
                    phInputField.value = phoneCheck(val);
                };
            }
        } else {
            addLiOnWith(phonesField, "<input>");
            let phInputField = phonesField.lastChild.lastChild;
            phInputField.oninput = function () {
                if (phInputField.value.length>12){phInputField.value = phInputField.value.substr(0,12);}
                let val = phInputField.value;
                phInputField.value = phoneCheck(val);
            };
        }
    };

    let phoneCheck= function (inval) {
        if (typeof inval !=="undefined"){
            if (isNaN(inval)){
                inval = inval.replace(/\D/g,'');
                return inval;
            } else return inval;
        }
    };
    let emeilCheck=function (emval, inputObj) {
        if (typeof emval !=="undefined"){
            if (emval.match(/([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/img)){
                inputObj.style.color = "#000";
            }
            else {
                inputObj.style.color = "#b30000";
            }
        }
    };

    addEmailBtn.onclick = function () {
        if (emailsField.lastChild){
            let lastInput = emailsField.lastChild.lastChild;
            if ((lastInput.value !== "")&&(lastInput.value.match(/([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/img)))
            {
                addLiOnWith(emailsField,"<input>");
                let emInputField = emailsField.lastChild.lastChild;
                emInputField.oninput = function () {
                    if (emInputField.value.length>36){emInputField.value = emInputField.value.substr(0,36);}
                    let eval = emInputField.value;
                    emeilCheck(eval,emInputField);
                };
            }
        } else {
            addLiOnWith(emailsField,"<input>");
            let emInputField = emailsField.lastChild.lastChild;
            emInputField.oninput = function () {
                if (emInputField.value.length>36){emInputField.value = emInputField.value.substr(0,36);}
                let eval = emInputField.value;
                emeilCheck(eval,emInputField);
            };
        }
    };

    applyBtn.onclick = function () {
        let phNodes = phonesField.childNodes;
        let emNodes = emailsField.childNodes;
        let masPhoneNumbers = [];
        let masEmails = [];
        let contactCheck = function () {
            let contactCorrect = true;
            if (!(firstNameInput.value!==""||lastNameInput.value!=="")){
                contactCorrect = false;
                nameBox.style.backgroundColor = "#b30000";
            }
            if (masPhoneNumbers.length===0){
                contactCorrect = false;
                phBox.style.backgroundColor = "#b30000";
            }
            masEmails.forEach(function(email, i, masEmails){
                if (!email.match(/([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/img)){
                    contactCorrect=false;
                    emBox.style.backgroundColor = "#b30000";
                }
            });
            return contactCorrect;
        };
        phNodes.forEach(function (item, i, phNodes) {
            let phField = item.firstChild;
            if (phField !== null) {
                if (phField.value !== "") {
                    masPhoneNumbers.push(phField.value);
                }
            }
        });
        emNodes.forEach(function (item, i, emNodes) {
            let emField = item.firstChild;
            if (emField !== null) {
                if (emField.value !== "") {
                    masEmails.push(emField.value);
                }
            }
        });
        if (contactCheck()) {
            let contactAdd = {
                id: index,
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                phones: masPhoneNumbers,
                email: masEmails,
                forSearch: (firstNameInput.value + " " + lastNameInput.value).toLowerCase()
            };
            if (index > contactsField.childNodes.length) {
                contacts.push(contactAdd);
            }
            else {
                contacts.splice(index - 1, 1, contactAdd)
            }
            localStorage.setItem("base", JSON.stringify(contacts));
            startMainWindow();
        }
        else{
            setTimeout(backGroundNone,500);
        }
    };
    let backGroundNone = function () {
        nameBox.style.backgroundColor = "transparent";
        phBox.style.backgroundColor = "transparent";
        emBox.style.backgroundColor = "transparent";
    };

    trashBtn.onclick = function () {
        if (index<=contactsField.childNodes.length){
            contacts.splice(index-1,1);
            localStorage.setItem("base", JSON.stringify(contacts));
        }
        startMainWindow();
    };

    cancelBtn.onclick = function () {
        startMainWindow();
    };

    startMainWindow();
})();