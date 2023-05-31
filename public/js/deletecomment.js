$(".delete-comment-btn").click(async function (e) {
	e.preventDefault();
	const res = await fetch(`/api/comments/${$(e.target).data("id")}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});

	if (res.ok) {
		document.location.reload();
	} else {
		alert(res.statusText);
	}
});
