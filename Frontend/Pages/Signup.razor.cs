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

namespace Frontend.Pages
{
    public partial class Signup
    {
        protected string FirstName { get; set; }
        protected string LastName { get; set; }
        protected string CafeName { get; set; }
        protected string Username { get; set; }
        protected string PhoneNumber { get; set; }
        protected string Email { get; set; }
        protected string Password { get; set; }
        protected string ConfirmPassword { get; set; }
        protected bool IsCafeActive { get; set; }

        protected async Task OnSignupClickMethod(EventArgs e)
        {
        }

    }
}