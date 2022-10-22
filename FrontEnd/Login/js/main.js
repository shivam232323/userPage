const signIn = document.getElementById('signIn');
const email = document.getElementById('email');
const password = document.getElementById('password-field');

signIn.addEventListener('click', function(e) {
    e.preventDefault();

    validate();
});


const validate = async () => {
    if (!(email.value && password.value)) {
        alert("ALL INPUT REQUIRED");
    } else {

        fetch("http://localhost:1800/userLogin", {

                // Adding method type
                method: "POST",

                // Adding body or contents to send
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                }),

                // Adding headers to the request
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then(response => response.json())

            // Displaying results to console

            .then(json => {


                if (json.message == "Credentials are Correct") {
                    window.open("../UserPage/user.html", '_self');
                    localStorage.setItem("Email", json.response);


                } else {
                    alert(json);
                    console.log(json.message)
                }
            }).catch(err => console.log(err))

    }
}