const addUsers = document.getElementById("add-users");
const userData = document.getElementById("user-data");
const userTable = document.getElementById("user-table");
const newUser = document.getElementById("new-user");
const userName = document.getElementById("inputUserName");
const userEmail = document.getElementById("inputEmail");
const password1 = document.getElementById("inputPassword1");
const password2 = document.getElementById("inputPassword2");
const submitUserDetails = document.getElementById("submit-user");
const deleteUserButton = document.getElementById("delete-user");
const closeButton = document.getElementById('close-button');
const userDetails = document.getElementById('details');
const editableUsername = document.getElementById('editable-username');
const editablePassword1 = document.getElementById('editable-password1');
const editablePassword2 = document.getElementById('editable-password2');
const nonEditableEmail = document.getElementById("non-editable-email")
const editButton = document.getElementById('submit-edit-button');
const closeEditButton = document.getElementById('close-edit-button')
const form = document.getElementById('my_form');
const form1 = document.getElementById('my_form1');
const logout = document.getElementById('logout');
const navbarEmail = document.getElementById('navbar-email');


navbarEmail.innerHTML = localStorage.getItem("Email");


logout.addEventListener('click', function() {
    navbarEmail.innerHTML = "UserEmail";
    localStorage.clear();
    window.open("../Login/index.html", '_self');

})




closeButton.addEventListener("click", function() {
    deleteUserButton.id = "delete-user";
})
userData.addEventListener('click', function() {

    userTable.style.display = "block";
    newUser.style.display = "none";
    form1.reset();
})


addUsers.addEventListener('click', function() {
    userTable.style.display = "none";
    newUser.style.display = "block";

})




const view = async (id) => {

    const fetchData = await fetch(`http://localhost:1800/viewUser/${id}`);
    const jsonData = await fetchData.json();
    const {
        user_name,
        user_email
    } = jsonData[0];
    console.log(user_email, user_name);
    userDetails.innerHTML = `<p>UserName : ${ user_name }</p>
    <p>Email Id : ${ user_email } `;
    console.log(jsonData);
}


const remove = async (id) => {
    deleteUserButton.id = id;

}

deleteUserButton.addEventListener('click', async () => {
    const buttonId = deleteUserButton.id;
    const url = `http://localhost:1800/deleteUser/${ buttonId }`;

    await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response => {
        alert("User Deleted Successfully");
        deleteUserButton.id = "delete-user";
        displayUserdata();

    }).catch(err => console.log(err));




})

closeEditButton.addEventListener('click', function() {
    editButton.id = "submit-edit-button";
    form.reset();


})




const edit = async (id) => {

    editButton.id = id;

    const fetchData = await fetch(`http://localhost:1800/viewUser/${id}`);
    const jsonData = await fetchData.json();
    const {
        user_name,
        user_email
    } = jsonData[0];
    nonEditableEmail.value = user_email;
    editableUsername.value = user_name;



}


editButton.addEventListener('click', async () => {
    const userId = editButton.id;
    console.log(userId);

    if ((editablePassword1.value == "") && (editablePassword2.value == ""))

    {
        alert("No Changes Made");

    } else if (editablePassword1.value != editablePassword2.value) {
        alert("Both Passwords Should Be Same");
    } else {

        fetch(`http://localhost:1800/updateUserDetails/${userId}`, {

                // Adding method type
                method: "PUT",

                // Adding body or contents to send
                body: JSON.stringify({
                    user_name: editableUsername.value,
                    user_password: editablePassword1.value
                }),

                // Adding headers to the request
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then(response => response.json())

            // Displaying results to console
            .then(json => {
                alert(json);
                form.reset();
            }).catch(err => console.log(err))

    }




})




submitUserDetails.addEventListener('click', function() {
    if (!(userEmail.value && userName.value && password1.value && password2.value)) {
        alert("Enter All The Details");
    } else if (password1.value != password2.value) {

        alert("Both Passwords Should Be Same")
    } else {

        fetch("http://localhost:1800/addUser", {

                // Adding method type
                method: "POST",

                // Adding body or contents to send
                body: JSON.stringify({
                    user_name: userName.value,
                    user_email: userEmail.value,
                    user_password: password1.value
                }),

                // Adding headers to the request
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then(response => response.json())

            // Displaying results to console
            .then(json => {
                alert(json);
                form1.reset();
            }).catch(err => console.log(err))

    }
})



const displayUserdata = async () => {

    const fetchData = await fetch(`http://localhost:1800/userData`);
    const jsonData = await fetchData.json();
    const test1 = document.getElementById('main');
    test1.innerHTML = "";


    for (const userDetails of jsonData) {
        const {
            user_id,
            user_name,
            user_email,
        } = userDetails;
        const newTable = document.createElement("tr");
        newTable.id = "t";
        newTable.innerHTML =
            `<td >${user_name}</td>
   <td >${user_email}</td>
   <td>
   <div class="btn-group" role="group" aria-label="Basic mixed styles example">
   <button id ="${user_id}" type="button" onclick="view(this.id)" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#staticBackdrop2">View</button>
   <button  id ="${user_id}" type="button" onclick="edit(this.id)" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#staticBackdrop3">Edit</button>
  <button id ="${user_id}" onclick="remove(this.id)" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Delete</button>
  </div>
   </td>`
        test1.appendChild(newTable);

    }


}

displayUserdata();