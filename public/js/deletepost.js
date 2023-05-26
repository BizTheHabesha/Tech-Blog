const deletepost = async (e) => {
	e.preventDefault();
	await fetch("");
};

document
	.querySelector(".delete-post-btn")
	.addEventListener("click", deletepost);
