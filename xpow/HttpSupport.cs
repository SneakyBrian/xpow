using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace xpow
{
    public class HttpSupport
    {
        const string REQUEST_HEADER = "X-PoWRequest";
        const string RESPONSE_HEADER = "X-PoWResponse";

        public static void SetupRequest(HttpContextBase context)
        {
            var processor = new Processor();

            var requestData = processor.GenerateRequestData();

            var requestString = Processor.ByteArrayToString(requestData);

            context.Response.Headers.Add(REQUEST_HEADER, requestString);
            context.Response.Cookies.Add(new HttpCookie(REQUEST_HEADER, requestString));

            var activeRequests = context.Session[REQUEST_HEADER] as List<byte[]>;

            lock (context.Session)
            {
                if (activeRequests == null)
                    activeRequests = new List<byte[]>();

                activeRequests.Add(requestData);

                context.Session[REQUEST_HEADER] = activeRequests;
            }
        }

        public static bool ValidateResponse(HttpContextBase context)
        {
            var requestString = context.Request.Cookies[REQUEST_HEADER] != null ?
                context.Request.Cookies[REQUEST_HEADER].Value : 
                context.Request.Headers[REQUEST_HEADER];

            if (string.IsNullOrWhiteSpace(requestString))
                return false;

            var responseString = context.Request.Cookies[RESPONSE_HEADER] != null ?
                context.Request.Cookies[RESPONSE_HEADER].Value : 
                context.Request.Headers[RESPONSE_HEADER];

            if (string.IsNullOrWhiteSpace(responseString))
                return false;

            var requestData = Processor.StringToByteArray(requestString);

            var activeRequests = context.Session[REQUEST_HEADER] as List<byte[]>;

            if (activeRequests == null)
                return false;

            lock (context.Session)
            {
                byte[] foundRequest = null;
                foreach (var activeRequest in activeRequests)
                {
                    foundRequest = activeRequest;
                    for (int i = 0; i < activeRequest.Length; i++)
                    {
                        if (activeRequest[i] != requestData[i])
                        {
                            foundRequest = null;
                            break;
                        }
                    }

                    if (foundRequest != null) 
                        break;
                }

                if (foundRequest != null)
                    activeRequests.Remove(foundRequest);
                else
                    return false;
            }

            var responseData = Processor.StringToByteArray(responseString);

            var processor = new Processor();

            return processor.ValidateResponse(requestData, responseData);
        }



    }
}
