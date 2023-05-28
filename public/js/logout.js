console.log(`lgo_h_init: Initialized`);
const logoutHandler = async (event) => {
	event.preventDefault();
	console.log(`lgo_h_init: Recieved`);
	const response = await fetch("/api/users/logout", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});

	if (response.ok) {
		document.location.replace("/");
	} else {
		alert(response.statusText);
	}
};

document
	.querySelector(".logout-nav-button")
	.addEventListener("click", logoutHandler);
