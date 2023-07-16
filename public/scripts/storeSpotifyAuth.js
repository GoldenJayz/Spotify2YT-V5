const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

// Switch this to public URL instead of testing URL 
const url = `${window.location.protocol}//${window.location.host}/startAuth`;
fetch(url, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		code: code
	})
})
	.then(res => res.json())
	.then(data => {
		document.cookie = `spotifyAuth=${data.auth};`;

		window.location.href = data.googleUrl;
	})
	.catch(err => console.error(err));
