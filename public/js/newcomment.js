$("#comment-form-toggleable").hide();

$("#new-comment-toggle").click(async function (e) {
	e.preventDefault();
	const res = await fetch("/api/users/logged_in?", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	const resSer = await res.json();
	if (res.ok) {
		if (resSer.logged_in) {
			$("#comment-form-toggleable").toggle();
		} else {
			document.location.replace("/login");
		}
	} else {
		alert(res.statusText);
	}
});

$(".new-comment-btn").click(async function (e) {
	e.preventDefault();
	const body = $("#comment-body-input").val();
	const post_id = $("#blogPost").data("id");
	const res = await fetch("/api/comments/", {
		method: "POST",
		body: JSON.stringify({ body, post_id }),
		headers: { "Content-Type": "application/json" },
	});

	if (res.ok) {
		document.location.reload();
	} else {
		alert(res.statusText);
	}
});
