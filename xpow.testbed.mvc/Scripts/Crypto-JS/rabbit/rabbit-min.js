/*
 * Crypto-JS v2.5.2
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2011 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
(function(){var h=Crypto,e=h.util,k=h.charenc.UTF8,c=[],b=[],i,g=h.Rabbit={encrypt:function(a,b){var c=k.stringToBytes(a),d=e.randomBytes(8),j=b.constructor==String?h.PBKDF2(b,d,32,{asBytes:!0}):b;g._rabbit(c,j,e.bytesToWords(d));return e.bytesToBase64(d.concat(c))},decrypt:function(a,b){var c=e.base64ToBytes(a),d=c.splice(0,8),j=b.constructor==String?h.PBKDF2(b,d,32,{asBytes:!0}):b;g._rabbit(c,j,e.bytesToWords(d));return k.bytesToString(c)},_rabbit:function(a,b,f){g._keysetup(b);f&&g._ivsetup(f);
b=[];for(f=0;f<a.length;f++){if(f%16==0){g._nextstate();b[0]=c[0]^c[5]>>>16^c[3]<<16;b[1]=c[2]^c[7]>>>16^c[5]<<16;b[2]=c[4]^c[1]>>>16^c[7]<<16;b[3]=c[6]^c[3]>>>16^c[1]<<16;for(var d=0;d<4;d++)b[d]=(b[d]<<8|b[d]>>>24)&16711935|(b[d]<<24|b[d]>>>8)&4278255360;for(d=120;d>=0;d-=8)b[d/8]=b[d>>>5]>>>24-d%32&255}a[f]^=b[f%16]}},_keysetup:function(a){c[0]=a[0];c[2]=a[1];c[4]=a[2];c[6]=a[3];c[1]=a[3]<<16|a[2]>>>16;c[3]=a[0]<<16|a[3]>>>16;c[5]=a[1]<<16|a[0]>>>16;c[7]=a[2]<<16|a[1]>>>16;b[0]=e.rotl(a[2],16);
b[2]=e.rotl(a[3],16);b[4]=e.rotl(a[0],16);b[6]=e.rotl(a[1],16);b[1]=a[0]&4294901760|a[1]&65535;b[3]=a[1]&4294901760|a[2]&65535;b[5]=a[2]&4294901760|a[3]&65535;b[7]=a[3]&4294901760|a[0]&65535;for(a=i=0;a<4;a++)g._nextstate();for(a=0;a<8;a++)b[a]^=c[a+4&7]},_ivsetup:function(a){var c=e.endian(a[0]),a=e.endian(a[1]),f=c>>>16|a&4294901760,d=a<<16|c&65535;b[0]^=c;b[1]^=f;b[2]^=a;b[3]^=d;b[4]^=c;b[5]^=f;b[6]^=a;b[7]^=d;for(c=0;c<4;c++)g._nextstate()},_nextstate:function(){for(var a=[],e=0;e<8;e++)a[e]=
b[e];b[0]=b[0]+1295307597+i>>>0;b[1]=b[1]+3545052371+(b[0]>>>0<a[0]>>>0?1:0)>>>0;b[2]=b[2]+886263092+(b[1]>>>0<a[1]>>>0?1:0)>>>0;b[3]=b[3]+1295307597+(b[2]>>>0<a[2]>>>0?1:0)>>>0;b[4]=b[4]+3545052371+(b[3]>>>0<a[3]>>>0?1:0)>>>0;b[5]=b[5]+886263092+(b[4]>>>0<a[4]>>>0?1:0)>>>0;b[6]=b[6]+1295307597+(b[5]>>>0<a[5]>>>0?1:0)>>>0;b[7]=b[7]+3545052371+(b[6]>>>0<a[6]>>>0?1:0)>>>0;i=b[7]>>>0<a[7]>>>0?1:0;a=[];for(e=0;e<8;e++){var f=c[e]+b[e]>>>0,d=f&65535,g=f>>>16;a[e]=((d*d>>>17)+d*g>>>15)+g*g^((f&4294901760)*
f>>>0)+((f&65535)*f>>>0)>>>0}c[0]=a[0]+(a[7]<<16|a[7]>>>16)+(a[6]<<16|a[6]>>>16);c[1]=a[1]+(a[0]<<8|a[0]>>>24)+a[7];c[2]=a[2]+(a[1]<<16|a[1]>>>16)+(a[0]<<16|a[0]>>>16);c[3]=a[3]+(a[2]<<8|a[2]>>>24)+a[1];c[4]=a[4]+(a[3]<<16|a[3]>>>16)+(a[2]<<16|a[2]>>>16);c[5]=a[5]+(a[4]<<8|a[4]>>>24)+a[3];c[6]=a[6]+(a[5]<<16|a[5]>>>16)+(a[4]<<16|a[4]>>>16);c[7]=a[7]+(a[6]<<8|a[6]>>>24)+a[5]}}})();
