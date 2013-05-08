//
//  xpow script
//
(function () {

    //debugger;

    //load the jquery cookie script
    $.getScript("Scripts/jquery.cookie.js", function () {
        //debugger;

        var request = $.cookie('X-PoWRequest');

        //is there a xpow request
        if (request !== null) {

            $.getScript("Scripts/Crypto-JS/crypto/crypto-min.js", function () {
                $.getScript("Scripts/Crypto-JS/crypto-sha256/crypto-sha256.js", function () {

                    //load the background worker script
                    $.getScript("Scripts/worker.js", function () {

                        //debugger;

                        var worker = new Worker('Scripts/xpow_worker.js');
                        worker.onmessage = function (event) {

                            //debugger;

                            if (event.data.found) {

                                //set the cookie
                                $.cookie('X-PoWResponse', event.data.response);

                                //trigger the ready event
                                $(document).trigger('xpowready', [event.data.response]);
                            }
                            else {

                                //trigger the attempt event
                                $(document).trigger('xpowattempt', [event.data.response]);
                            }
                        };

                        //start the worker off
                        worker.postMessage(request);
                    });
                });
            });
        }
        else {
            //release the ready event
            $.holdReady(false);
        }
    });
})();