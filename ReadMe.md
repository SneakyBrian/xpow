# X-POW #

## Proof Of Work for ASP.NET MVC ##

X-POW is a [proof-of-work](http://en.wikipedia.org/wiki/Proof-of-work_system "proof-of-work") implementation for ASP.NET MVC

## How It Works ##

The server-side implementation is as an MVC ActionFilterAttribute called [RequireXpowAttribute](https://github.com/SneakyBrian/xpow/blob/master/xpow/RequireXpowAttribute.cs "RequireXpowAttribute"). This does not allow the request through unless the hash problem has been solved.

The client-side implementation is a javascript library that uses Web Workers to perform the hash calculations off the main javascript thread. It raises an event when the hash has been solved, informing the page that it can continue on to the original target.

## Configuration ##

There are two settings that can be tweaked in the web.config:

    <appSettings>
      <add key="LeadingBytes" value="2"/>
      <add key="LeadingBytesValue" value="7"/>
    </appSettings>

- **LeadingBytes** is the number of bytes at the start of the hash to consider when checking the value
- **LeadingBytesValue** is the maximum value that the leading bytes of the hash should be to be considered valid

Both of these settings are a single byte, and so are in the range of 0 to 7


## Original Technical Details ##

*These details are from the original spec I wrote, and so are slightly out-of-date. I will update them as soon as I can!*

**Overview**

Client requests page. Server sends back page with X-PoWRequest header containing 128bit value. First byte is number of leading zeroes that hash result must have, the other 15 bytes are random. Server also sets cookie value with same name. Client must generate own 128bit value so that when server value and client value are combined into a single 256bit value and hashed using SHA-256 the first N bytes of the hash are zero


**Example**

Server sends:

                  NZ[       random data          ]
    X-PoWRequest: 0465A709F1CE40EABEFEF4C94FA0E9A8

Where NZ is number of leading zero bytes the hash of the result must have, in this case 4
Also stores value in a list of request values for the session.

Client responds:

    X-PoWRequest: 0465A709F1CE40EABEFEF4C94FA0E9A8
    X-PoWResponse: ED807302BF6A403ABE0C0864E271E284

Server checks that X-PoWRequest is present, if not response invalid.

Server checks that X-PoWResponse is present, if not response invalid.

Server checks that X-PoWRequest is in the list of values in the session, if not response invalid.

Server combines values into single 256bit value:

    [         server value         ][         client value         ]
    0465A709F1CE40EABEFEF4C94FA0E9A8ED807302BF6A403ABE0C0864E271E284

Computes hash:

    [                              hash                            ]
    00000000891444D0AE14416C4D25E59EACE0404151F44C118F8B1CF868C314A8

Checks first 4 bytes are zero, if so response valid
server removes request value from session list

**Client**

client is a javascript library that is included in any page that will need to pass x-pow tests. 
Starts up once document has finished loading (body.onload, or $(document).ready())

Possibly postpone body.onload, and/or $(document).ready() until the script has solved the problem? http://api.jquery.com/jQuery.holdReady/ 

It will do nothing if the X-PoWRequest cookie/header is not present - raise ready event immediately.

If it is present, then it will start attempting to solve the problem.
Maybe each attempt is on a timer in order to keep other scripts responsive - use webworker if available? http://code.google.com/p/ie-web-worker/

Once problem is solved X-PoWRequest and X-PoWResponse cookie/headers are added and javascript event is raised to indicate that the page is ready to communicate with the server again.
This event should be used to update the dom to enable interaction with server - GET/POST/PUT/DELETE etc.

Other possible client implementations:

Create Portable Class Library (http://msdn.microsoft.com/en-us/library/gg597391.aspx) that adds support to Silverlight/WP7/.NET applications.

Create a single static method that returns Task<T> and performs the calculations asynchronously in a background thread, something like:

    public static Task<byte[]> GenerateResponse(byte[] request)
    public static Task<string> GenerateResponse(string request)
    public static Task GenerateResponse(HttpContext context)

Other helper methods:

    public static bool RequiresResponse(HttpContext context)
    public static string GetRequest(HttpContext context)
    public static byte[] GetRequest(HttpContext context)
    public static void SetResponse(HttpContext context, byte[] request, byte[] response)
    public static void SetResponse(HttpContext context, string request, string response)

**Server**

Server is an ASP.NET MVC Filter Attribute which checks the request value is the one stored for the session, and then calculates the hash of the request and response values, and checks that the leading zeros are the correct number.

Also need an element that adds the X-PoWRequest header to server responses that are required to interact with controller actions that have the filter attribute applied to them. Perhaps an attribute on controller actions that return views that then need to interact with other controller actions that require xpow.

**[ActivateXpow]** - ActionResult returned has X-PoWRequest header present, and server value added to session xpow value cache.

**[RequireXpow]** - Checks that the X-PoWRequest and X-PoWResponse headers are present. Checks the request value is the one stored for the session. Calculates the hash of the request and response values. Checks that the leading zeros are the correct number.

Possible other approach:

Single attribute - **[RequireXpow]** - When an initial request is made to the action with this attribute, the action redirects to a built in action that delivers a defined view and also the xpow request to the browser, which performs the calculation and resubmits the request to the original action with the xpow response included automatically without the need for user intervention. This defined view just needs to be a simple "processing" animation, perhaps with some kind of feedback.

Issues with this approach would be preserving the original HTTP POST data (although this might be trivial).