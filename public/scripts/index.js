console.log('Hi!');

window.onload = () => {
	let trimmedCookies = document.cookie.length > 1 ? document.cookie : undefined;

	if (trimmedCookies == undefined) {
		return;
	}
    
	let cookies = trimmedCookies.split(';');
	let spotifyAuth = cookies[0].slice(12);
	let googleAuth = cookies[1].trim().slice(11);
	setTimeout(() => {
		fetch('http://localhost:6969/exchangeTokens', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				googleToken: googleAuth,
				spotifyToken: spotifyAuth
			})
		})
			.then(res => res.json())
			.then(data => console.log(data.hash))
			.catch(err => console.log(err));
	}, 2000);
};
