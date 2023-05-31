$(".signup-btn").click(async function (e) {
	e.preventDefault();
	const name = $("#name-form-input").val().trim();
	const email = $("#email-form-input").val().trim();
	const password = $("#passowrd-form-input").val().trim();

	console.log(`NAME: ${name} | EMAIL: ${email} | PASSWORD: ${password}`);

	if (name && email && password) {
		const response = await fetch("/api/users/", {
			method: "POST",
			body: JSON.stringify({ name, email, password }),
			headers: { "Content-Type": "application/json" },
		});

		if (response.ok) {
			document.location.replace("/dashboard");
		} else {
			console.log(JSON.stringify(response));
			alert(response.statusText);
		}
	} else {
		alert("Please enter a valid email, name, and password!");
	}
});
