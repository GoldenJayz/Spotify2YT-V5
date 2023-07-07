const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

// Switch this to public URL instead of testing URL 
const url = 'http://localhost:6969/startGoogleAuth';
fetch(url, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		code: code
	})
})
	.then(res => res.json())
	.then(data => {
		document.cookie = `googleAuth=${data.auth};`;

		window.location.href = 'http://localhost:6969';
	})
	.catch(err => console.error(err));
