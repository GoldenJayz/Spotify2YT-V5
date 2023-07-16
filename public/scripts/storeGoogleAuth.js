const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

// Switch this to public URL instead of testing URL 
const url = `${window.location.protocol}//${window.location.host}/startGoogleAuth`;
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

		window.location.href = `${window.location.protocol}//${window.location.host}/`; // To be determined
	})
	.catch(err => console.error(err));
