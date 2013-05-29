//for script compatibility
var window = this;

importScripts('Crypto-JS/crypto/crypto-min.js', 'Crypto-JS/crypto-sha256/crypto-sha256.js');

onmessage = function (event) {

    //debugger;

    var request = event.data,
        leadBytes = parseInt("0x" + request.substr(0, 2)),
        leadBytesValue = parseInt("0x" + request.substr(2, 2)),
        respData = [],
        response,
        i, j,
        dataBytes,
        digestBytes,
        considerValueBytes,
        considerValue,
        byteArrayToLong = function (byteArray) {
            var value = 0, i;
            for (i = byteArray.length - 1; i >= 0; i--) {
                value = (value * 256) + byteArray[i];
            }
            return value;
        };

    for (i = 0; i < 16; ++i) {
        respData.push(0);
    }

    while (true) {

        response = Crypto.util.bytesToHex(respData);

        dataBytes = Crypto.util.hexToBytes(request + response);

        digestBytes = Crypto.SHA256(dataBytes, { asBytes: true });

        considerValueBytes = [];

        for (j = 0; j < leadBytes; ++j) {
            considerValueBytes[j] = digestBytes[j];
        }

        considerValue = byteArrayToLong(considerValueBytes);

        if (considerValue <= leadBytesValue) {
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

