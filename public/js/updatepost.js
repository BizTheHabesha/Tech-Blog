$(".update-post-button").click(async function (e) {
	e.preventDefault();
	const title = $("#post-title-input").val();
	const body = $("#post-body-input").val();
	const id = $(e.target).data("id");

	const res = await fetch(`/api/posts/${id}`, {
		method: "PUT",
		body: JSON.stringify({ body, title }),
		headers: { "Content-Type": "application/json" },
	});
	if (res.ok) {
		document.location.replace("/dashboard");
	} else {
		alert(res.statusText);
	}
});
