using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Security.Cryptography;

namespace xpow
{
    public class Processor
    {
        const string LEADING_BYTES = "LeadingBytes";
        const string LEADING_BYTES_VALUE = "LeadingBytesValue";

        public byte[] GenerateRequestData()
        {
            var requestData = new byte[16];
            
            var random = new Random();

            random.NextBytes(requestData);

            requestData[0] = byte.Parse(ConfigurationManager.AppSettings[LEADING_BYTES]);
            requestData[1] = byte.Parse(ConfigurationManager.AppSettings[LEADING_BYTES_VALUE]);

            return requestData;            
        }

        public bool ValidateResponse(byte[] requestData, byte[] responseData)
        {
            var leadingBytes = byte.Parse(ConfigurationManager.AppSettings[LEADING_BYTES]);
            var leadingBytesValue = byte.Parse(ConfigurationManager.AppSettings[LEADING_BYTES_VALUE]);

            if (leadingBytes != requestData[0])
                return false;

            if (leadingBytesValue != requestData[1])
                return false;

            var combined = requestData.Concat(responseData).ToArray();

            using (var sha256 = new SHA256Managed())
            {
                var hash = sha256.ComputeHash(combined);

                var considerData = hash.Take(leadingBytes).ToArray();

                var considerValue = ByteArrayToValue(considerData);

                return considerValue <= leadingBytesValue;
            }
        }

        public static int ByteArrayToValue(byte[] byteArray)
        {
            var value = 0;
            for (var i = byteArray.Length - 1; i >= 0; i--)
            {
                value = (value * 256) + byteArray[i];
            }
            return value;
        }

        public static string ByteArrayToString(byte[] ba)
        {
            string hex = BitConverter.ToString(ba);
            return hex.Replace("-", "");
        }

        public static byte[] StringToByteArray(String hex)
        {
            int numberChars = hex.Length;
            byte[] bytes = new byte[numberChars / 2];
            for (int i = 0; i < numberChars; i += 2)
                bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
            return bytes;
        }

    }
}
