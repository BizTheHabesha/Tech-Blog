console.log("framework_l_: Loaded successfully _ Into INIT");
const loginFormHandler = async (event) => {
	console.log("framework_l_: detcli _ From INIT");
	event.preventDefault();

	// Collect values from the login form
	const email = document.querySelector("#email-form-input").value.trim();
	const password = document
		.querySelector("#passowrd-form-input")
		.value.trim();

	if (email && password) {
		// Send a POST request to the API endpoint
		const response = await fetch("/api/users/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
			headers: { "Content-Type": "application/json" },
		});

		if (response.ok) {
			// If successful, redirect the browser to the profile page
			document.location.replace("/dashboard");
		} else {
			alert(response.statusText);
		}
	}
	console.log("framework_l_: detsend_ From INIT");
};

document
	.querySelector(".submit-login")
	.addEventListener("click", loginFormHandler);
