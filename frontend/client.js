async function query(data) {
	const response = await fetch(
		"http://127.0.0.1:8080",
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}
	);
	const result = await response.blob();
	return result;
}

query({"prompt": "Astronaut riding a horse"}).then((response) => {
	let img = document.getElementById('image_bin')
	var objectURL = URL.createObjectURL(response);
	img.src = objectURL
});