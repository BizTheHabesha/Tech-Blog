const deletepost = async (e) => {
	e.preventDefault();

	const res = await fetch("/api/posts/", {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});

	if (res.ok) {
		document.location.reload();
	} else {
		alert(`There was an error: ${res.statusText}`);
	}
};

document
	.querySelector(".delete-post-btn")
	.addEventListener("click", deletepost);
