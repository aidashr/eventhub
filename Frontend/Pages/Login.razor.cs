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
using Radzen;
using Radzen.Blazor;

namespace Frontend.Pages
{
    public partial class Login
    {
        protected string Username { get; set; }
        protected string UsernameAlertContent => IsLoginButtonClicked && string.IsNullOrEmpty(Username) ? "Username is required" : string.Empty;
        protected string Password { get; set; }
        protected string PasswordAlertContent => IsLoginButtonClicked && string.IsNullOrEmpty(Password) ? "Password is required" : string.Empty;
        protected bool IsLoginButtonClicked { get; set; }
        protected override void OnInitialized()
        {
            base.OnInitialized();

            IsLoginButtonClicked = false;
        }


        protected async Task OnLoginButtonClickMethod(EventArgs e)
        {
            IsLoginButtonClicked = true;


        }

    }
}