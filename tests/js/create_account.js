document.getElementById('createAccountForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const loginPassword = document.getElementById('login_password').value;
  const confirmLoginPassword = document.getElementById('confirm-login-password').value;
  const masterPassword = document.getElementById('master_password').value;
  const confirmMasterPassword = document.getElementById('confirm-master-password').value;
  const errorMessage = document.getElementById('create-error-message');
  errorMessage.textContent = '';

  if (email === '' || loginPassword === '' || confirmLoginPassword === '' || masterPassword === '' || confirmMasterPassword === '') {
      errorMessage.textContent = 'Please fill in all fields.';
      return;
  }
  if (loginPassword !== confirmLoginPassword) {
      errorMessage.textContent = 'Login passwords do not match.';
      return;
  }
  if (masterPassword !== confirmMasterPassword) {
      errorMessage.textContent = 'Master passwords do not match.';
      return;
  }
  console.log(SHA256.hash(loginPassword)); // Example Login Password is Password123 | Hashed Version: 008c70392e3abfbd0fa47bbc2ed96aa99bd49e159727fcba0f2e6abeb3a9d601
  console.log(SHA256.hash(masterPassword)); // Example Master Password is 1 | Hashed Version: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b
    
  // Send a request to the server to send the verification email
  fetch('http://localhost:3000/send-verification-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
      body: JSON.stringify({ email: email })
  })
  .then(response => response.text())
  .then(data => {
    if (data.error) {
      errorMessage.textContent = 'Failed to send verification email.';
      console.error(data.error);
    } else {
      alert('Account created successfully! Please check your email for verification.');
      window.location.href = 'landing.html';
    }
  })
  .catch(error => {
      errorMessage.textContent = 'Failed to send verification email.';
      console.error('Error:', error);
  });
});

document.getElementById('showPasswordButton').addEventListener('click', function() {
  const loginPasswordField = document.getElementById('login_password');
  const confirmLoginPasswordField = document.getElementById('confirm-login-password');
  const masterPasswordField = document.getElementById('master_password');
  const confirmMasterPasswordField = document.getElementById('confirm-master-password');
  if (loginPasswordField.type === 'password') {
    loginPasswordField.type = 'text';
    confirmLoginPasswordField.type = 'text';
    masterPasswordField.type = 'text';
    confirmMasterPasswordField.type = 'text';
  } else {
    loginPasswordField.type = 'password';
    confirmLoginPasswordField.type = 'password';
    masterPasswordField.type = 'password';
    confirmMasterPasswordField.type = 'password';
  }
});

// Start of source code from AndersLindman
SHA256 = {};

SHA256.K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 
    0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 
    0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 
    0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 
    0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 
    0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 
    0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 
    0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 
    0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

SHA256.Uint8Array = function(length) {
    if (typeof Uint8Array !== 'undefined') {
        return new Uint8Array(length);
    } else {
        return new Array(length);
    }
};

SHA256.Int32Array = function(length) {
    if (typeof Int32Array !== 'undefined') {
        return new Int32Array(length);
    } else {
        return new Array(length);
    }
};

SHA256.setArray = function(target, source) {
    if (typeof Uint8Array !== 'undefined') {
        target.set(source);
    } else {
        for (var i = 0; i < source.length; i++) {
            target[i] = source[i];
        }
        for (i = source.length; i < target.length; i++) {
            target[i] = 0;
        }
    }
};

// The digest function returns the hash value (digest)
// as a 32 byte (typed) array.
// message: the string or byte array to hash
SHA256.digest = function(message) {
    var h0 = 0x6a09e667;
    var h1 = 0xbb67ae85;
    var h2 = 0x3c6ef372;
    var h3 = 0xa54ff53a;
    var h4 = 0x510e527f;
    var h5 = 0x9b05688c;
    var h6 = 0x1f83d9ab;
    var h7 = 0x5be0cd19;
    var K = SHA256.K;
    if (typeof message == 'string') {
       var s =  unescape(encodeURIComponent(message)); // UTF-8
        message = SHA256.Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) {
            message[i] = s.charCodeAt(i) & 0xff;
        }
    }
    var length = message.length;
    var byteLength = Math.floor((length + 72) / 64) * 64;
    var wordLength = byteLength / 4;
    var bitLength = length * 8;
    var m = SHA256.Uint8Array(byteLength);
    SHA256.setArray(m, message);
    m[length] = 0x80;
    m[byteLength - 4] = bitLength >>> 24;
    m[byteLength - 3] = (bitLength >>> 16) & 0xff;
    m[byteLength - 2] = (bitLength >>> 8) & 0xff;
    m[byteLength - 1] = bitLength & 0xff;
    var words = SHA256.Int32Array(wordLength);
    var byteIndex = 0;
    for (i = 0; i < words.length; i++) {
        var word = m[byteIndex] << 24;
        word |= m[byteIndex + 1] << 16;
        word |= m[byteIndex + 2] << 8;
        word |= m[byteIndex + 3];
        words[i] = word;
        byteIndex += 4;
    }
    var w = SHA256.Int32Array(64);
    for (var j = 0; j < wordLength; j += 16) {
        for (i = 0; i < 16; i++) {
            w[i] = words[j + i];
        }
        for (i = 16; i < 64; i++) {
            var v = w[i - 15];
            var s0 = (v >>> 7) | (v << 25);
            s0 ^= (v >>> 18) | (v << 14);
            s0 ^= (v >>> 3);
            v = w[i - 2];
            var s1 = (v >>> 17) | (v << 15);
            s1 ^= (v >>> 19) | (v << 13);
            s1 ^= (v >>> 10);
            w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & 0xffffffff; 
        }
        var a = h0;
        var b = h1;
        var c = h2;
        var d = h3;
        var e = h4;
        var f = h5;
        var g = h6;
        var h = h7;
        for (i = 0; i < 64; i++) {
            s1 = (e >>> 6) | (e << 26);
            s1 ^= (e >>> 11) | (e << 21);
            s1 ^= (e >>> 25) | (e << 7);
            var ch = (e & f) ^ (~e & g);
            var temp1 = (h + s1 + ch + K[i] + w[i]) & 0xffffffff;
            s0 = (a >>> 2) | (a << 30);
            s0 ^= (a >>> 13) | (a << 19);
            s0 ^= (a >>> 22) | (a << 10);
            var maj = (a & b) ^ (a & c) ^ (b & c);
            var temp2 = (s0 + maj) & 0xffffffff;
            h = g;
            g = f;
            f = e;
            e = (d + temp1) & 0xffffffff;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) & 0xffffffff;
        }
        h0 = (h0 + a) & 0xffffffff;
        h1 = (h1 + b) & 0xffffffff;
        h2 = (h2 + c) & 0xffffffff;
        h3 = (h3 + d) & 0xffffffff;
        h4 = (h4 + e) & 0xffffffff;
        h5 = (h5 + f) & 0xffffffff;
        h6 = (h6 + g) & 0xffffffff;
        h7 = (h7 + h) & 0xffffffff;
    }
    var hash = SHA256.Uint8Array(32);
    for (i = 0; i < 4; i++) {
        hash[i] = (h0 >>> (8 * (3 - i))) & 0xff;
        hash[i + 4] = (h1 >>> (8 * (3 - i))) & 0xff;
        hash[i + 8] = (h2 >>> (8 * (3 - i))) & 0xff;
        hash[i + 12] = (h3 >>> (8 * (3 - i))) & 0xff;
        hash[i + 16] = (h4 >>> (8 * (3 - i))) & 0xff;
        hash[i + 20] = (h5 >>> (8 * (3 - i))) & 0xff;
        hash[i + 24] = (h6 >>> (8 * (3 - i))) & 0xff;
        hash[i + 28] = (h7 >>> (8 * (3 - i))) & 0xff;
    }
    return hash;
};   

// The hash function returns the hash value as a hex string.
// message: the string or byte array to hash
SHA256.hash = function(message) {
    var digest = SHA256.digest(message);
    var hex = '';
	for (i = 0; i < digest.length; i++) {
		var s = '0' + digest[i].toString(16);
        hex += s.length > 2 ? s.substring(1) : s;
	}
    return hex;
};/* End of source code from AndersLindman
https://github.com/AndersLindman/SHA256/blob/254e29ca2fb2d0697ced7e4fea03149e210ce8b9/js/sha256.js
*/
