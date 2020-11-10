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
using frontend;
using frontend.Shared;

namespace frontend.Pages
{
    public partial class Signup
    {
         
        private const string ACTIVE_TAB_CLASS = "nav-link font-weight-bold active";
        private const string DEACTIVE_TAB_CLASS = "nav-link font-weight-bold";
        protected string FirstName { get; set; }
        protected string LastName { get; set; }
        protected string CafeName { get; set; }
        protected string Username { get; set; }
        protected string PhoneNumber { get; set; }
        protected string Email { get; set; }
        protected string Password { get; set; }
        protected string ConfirmPassword { get; set; }
        protected bool IsCafeActive { get; set; }
        protected string CafeTabClass { get; set; }
        protected string UserTabClass { get; set; }

        protected override void OnInitialized()
        {
            base.OnInitialized();

            IsCafeActive = true;
            CafeTabClass = ACTIVE_TAB_CLASS;
            UserTabClass = DEACTIVE_TAB_CLASS;
        }
        protected void OnCafeTabClickMethod(EventArgs e)
        {
            IsCafeActive = true;
            CafeTabClass = ACTIVE_TAB_CLASS;
            UserTabClass = DEACTIVE_TAB_CLASS;
        }
        protected void OnUserTabClickMethod(EventArgs e)
        {
            IsCafeActive = false;
            CafeTabClass = DEACTIVE_TAB_CLASS;
            UserTabClass = ACTIVE_TAB_CLASS;
        }

        protected async Task OnSignupClickMethod(EventArgs e)
        {
        }
    
    }
}