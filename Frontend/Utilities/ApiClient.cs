using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace Frontend.Api
{
    internal class ApiClient
    {
        private const string API_URL = @"http://127.0.0.1:8000/";
        public static async Task<HttpResponseMessage> CallAsync(HttpMethod method, string endpoint, Dictionary<string, string> parameters, Dictionary<string, string> body)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(API_URL);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            string finalEndpoint = 0 < parameters.Count() ? endpoint + "?" + string.Join("&", parameters.Select(pair => pair.Key + "=" + pair.Value).ToArray()) : endpoint;
            var request = new HttpRequestMessage(method, finalEndpoint);
            request.Content = new FormUrlEncodedContent(body);

            return await client.SendAsync(request).ConfigureAwait(false);
        }
    }
}