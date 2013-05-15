//for script compatibility
var window = this;

importScripts('Crypto-JS/crypto/crypto-min.js', 'Crypto-JS/crypto-sha256/crypto-sha256.js');

onmessage = function (event) {

    //debugger;

    var request = event.data;

    var numZeroes = parseInt("0x" + request.substr(0, 2));

    var respData = [];
    var response;
    var i;
    var ok;
    var dataBytes;
    var digestBytes;

    for (i = 0; i < 16; ++i) {
        respData.push(0);
    }

    while (true) {

        response = Crypto.util.bytesToHex(respData);

        dataBytes = Crypto.util.hexToBytes(request + response);

        digestBytes = Crypto.SHA256(dataBytes, { asBytes: true });

        ok = true;

        for (var j = 0; j < numZeroes; ++j) {
            if (digestBytes[j] !== 0) {
                ok = false;
                break;
            }
        }

        if (ok) {
            break;
        }

        postMessage({ found: false, response: response });

        for (i = 0; i < 16; ++i) {

            respData[i]++;

            if (respData[i] > 255) {
                respData[i] = 0;
            }
            else {
                break;
            }
        }
    }

    postMessage({ found: true, response: response });
}

