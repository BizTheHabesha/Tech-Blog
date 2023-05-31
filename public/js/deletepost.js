console.log("deletepost.js : initialized");
$(".delete-post-btn").click(async function (e) {
	console.log("deletepost.js : clicked");
	e.preventDefault();
	const res = await fetch(`/api/posts/${$(e.target).data("id")}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});

	console.log(`deletepost.js : res => ${JSON.stringify(res)}`);
	if (res.ok) {
		document.location.replace("/dashboard");
	} else {
		alert(`There was an error: ${res.statusText}`);
	}
});
