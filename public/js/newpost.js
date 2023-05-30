const newPostHandler = async (e) => {
	e.preventDefault();
	const title = document.getElementById("post-title-input").value;
	const body = document.getElementById("post-body-input").value;

	if (!title) {
		alert("Post title cannot be empty!");
		return;
	}
	if (!body) {
		alert("Post body cannot be empty!");
		return;
	}
	const res = await fetch("/api/posts", {
		method: "POST",
		body: JSON.stringify({ body, title }),
		headers: { "Content-Type": "application/json" },
	});
	if (res.ok) {
		document.location.replace("/dashboard");
	} else {
		alert(res.statusText);
	}
};

document
	.querySelector(".create-post-button")
	.addEventListener("click", newPostHandler);
