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
