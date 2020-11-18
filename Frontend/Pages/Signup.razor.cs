using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using System.Net.Http;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Http;
using Microsoft.JSInterop;
using Frontend;
using Frontend.Shared;
using System.Text.RegularExpressions;
using Frontend.Api;
using System.Diagnostics;

namespace Frontend.Pages
{
    public partial class Signup
    {
        [Inject]
        private NavigationManager NavigationManager { get; set; }
        [Inject]
        IJSRuntime JSRuntime { get; set; }
        private const string WITH_ALERT_CLASS = "text-danger mb-1";
        private const string WITHOUT_ALERT_CLASS = "mb-3";
        protected string FirstName { get; set; }
        protected string LastName { get; set; }
        protected string CafeName { get; set; }
        protected string Username { get; set; }
        protected string PhoneNumber { get; set; }
        protected string Email { get; set; }
        protected string Password { get; set; }
        protected string ConfirmPassword { get; set; }
        protected string NameAlert
        {
            get
            {
                if (IsSignupButtonClicked)
                {
                    if (string.IsNullOrEmpty(FirstName) && string.IsNullOrEmpty(LastName))
                        return "First name and last name is required";
                    if (!string.IsNullOrEmpty(FirstName) && string.IsNullOrEmpty(LastName))
                        return "Last name is required";
                    if (string.IsNullOrEmpty(FirstName) && !string.IsNullOrEmpty(LastName))
                        return "First name is required";
                    else
                        return string.Empty;
                }
                else
                    return string.Empty;
            }
        }
        protected string CafeNameAlert
        {
            get
            {
                if (IsSignupButtonClicked)
                {
                    if (string.IsNullOrEmpty(CafeName))
                        return "Cafe name is required";
                    else
                        return string.Empty;
                }
                else
                    return string.Empty;
            }
        }
        protected string UsernameAlert
        {
            get
            {
                if (IsSignupButtonClicked)
                {
                    if (string.IsNullOrEmpty(Username))
                        return "Username is required";
                    else
                        return string.Empty;
                }
                else
                    return string.Empty;
            }
        }
        protected string PhoneNumberAlert
        {
            get
            {
                if (IsSignupButtonClicked)
                {
                    if (string.IsNullOrEmpty(PhoneNumber))
                        return "Phone number is required";
                    else
                        return string.Empty;
                }
                else
                    return string.Empty;
            }
        }
        protected string EmailAlert
        {
            get
            {
                if (IsSignupButtonClicked)
                {
                    if (string.IsNullOrEmpty(Email))
                        return "Email is required";

                    bool isCorrectEmail = Regex.IsMatch(Email, @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z", RegexOptions.IgnoreCase);
                    if (!isCorrectEmail)
                        return "Email address is invalid";

                    else
                        return string.Empty;
                }
                else
                    return string.Empty;
            }
        }
        protected string PasswordAlert
        {
            get
            {
                if (IsSignupButtonClicked)
                {
                    if (string.IsNullOrEmpty(Password))
                        return "Password is required";
                    if (Password.Length < 8)
                        return "Password must contains at least 8 characters";
                    else
                        return string.Empty;
                }
                else
                    return string.Empty;
            }
        }
        protected string ConfirmPasswordAlert
        {
            get
            {
                if (IsSignupButtonClicked)
                {
                    if (string.IsNullOrEmpty(ConfirmPassword))
                        return "Password confirmation is required";
                    if (!Password.Equals(ConfirmPassword))
                        return "Password does not match";
                    else
                        return string.Empty;
                }
                else
                    return string.Empty;
            }
        }
        protected bool IsSignupButtonClicked { get; set; }
        protected override void OnInitialized()
        {
            base.OnInitialized();

            IsSignupButtonClicked = false;
        }
        protected string AlertClass(string alert) => string.IsNullOrEmpty(alert) ? WITHOUT_ALERT_CLASS : WITH_ALERT_CLASS;

        protected async Task OnTabControlItemsClickMethod(EventArgs e)
        {
            IsSignupButtonClicked = false;
        }

        protected async Task OnCafeSignupClickMethod(EventArgs e)
        {
            IsSignupButtonClicked = true;

            if (string.IsNullOrEmpty(UsernameAlert) && string.IsNullOrEmpty(CafeNameAlert) && string.IsNullOrEmpty(EmailAlert) && string.IsNullOrEmpty(PasswordAlert) && string.IsNullOrEmpty(PhoneNumberAlert))
            {
                Dictionary<string, string> parameters = new Dictionary<string, string>();

                Dictionary<string, string> body = new Dictionary<string, string>();
                body.Add("username", Username);
                body.Add("cafe_name", CafeName);
                body.Add("email", Email);
                body.Add("password", Password);
                body.Add("phone", PhoneNumber);
                body.Add("CafesUser", "true");

                var httpResponseMessage = await ApiClient.CallAsync(HttpMethod.Post, Endpoints.CafeSignup, parameters, body);
                var result = await httpResponseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
                Debug.WriteLine(result);

                NavigationManager.NavigateTo("/login");
            }

        }
        protected async Task OnUserSignupClickMethod(EventArgs e)
        {
            IsSignupButtonClicked = true;

            if (string.IsNullOrEmpty(UsernameAlert) && string.IsNullOrEmpty(NameAlert) && string.IsNullOrEmpty(EmailAlert) && string.IsNullOrEmpty(PasswordAlert) && string.IsNullOrEmpty(PhoneNumberAlert))
            {
                Dictionary<string, string> parameters = new Dictionary<string, string>();

                Dictionary<string, string> body = new Dictionary<string, string>();
                body.Add("username", Username);
                body.Add("first_name", FirstName);
                body.Add("last_name", LastName);
                body.Add("email", Email);
                body.Add("password", Password);
                body.Add("phone", PhoneNumber);
                body.Add("RegularUser", "true");

                var httpResponseMessage = await ApiClient.CallAsync(HttpMethod.Post, Endpoints.UserSignup, parameters, body);
                var result = await httpResponseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
                Debug.WriteLine(result);

                NavigationManager.NavigateTo("/login");
            }
        }

    }
}