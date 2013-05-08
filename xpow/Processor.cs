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
        const string LEADING_ZEROES = "LeadingZeroes";

        public byte[] GenerateRequestData()
        {
            var requestData = new byte[16];
            
            var random = new Random();

            random.NextBytes(requestData);

            requestData[0] = byte.Parse(ConfigurationManager.AppSettings[LEADING_ZEROES]);

            if (requestData[0] > 32)
                throw new ApplicationException("Number of leading zeroes cannot be greater than 32");

            return requestData;            
        }

        public bool ValidateResponse(byte[] requestData, byte[] responseData)
        {
            var leadingZeroes = byte.Parse(ConfigurationManager.AppSettings[LEADING_ZEROES]);

            if (leadingZeroes > 32)
                throw new ApplicationException("Number of leading zeroes cannot be greater than 32");

            if (leadingZeroes != requestData[0])
                throw new ApplicationException("Request Configuration Data does not match Application Configuration Data");

            var combined = requestData.Concat(responseData).ToArray();

            using (var sha256 = new SHA256Managed())
            {
                var hash = sha256.ComputeHash(combined);

                for (var i = 0; i < leadingZeroes; ++i)
                {
                    if (hash[i] > 0)
                        return false;
                }
            }

            return true;
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
