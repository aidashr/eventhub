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

namespace Frontend.Shared.Component
{
    public partial class Post
    {
        [Parameter]
        public string ImageSource { get; set; }
        protected string Username { get => "Username"; }
        protected string Likes { get => "Likes"; }
    }
}