using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.UI.WebControls.WebParts;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using SS.BL.Domain.Users;
using SS.BL.Users;
using SS.DAL;
using SS.UI.Web.MVC.Controllers.Utils;
using SS.UI.Web.MVC.Models;
using SS.UI.Web.MVC.Providers;
using UI_MVC;
using UI_MVC.Results;

namespace SS.UI.Web.MVC.Controllers
{
    [Authorize]
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;
        private readonly IUserManager _userMgr;

        public AccountController(IUserManager userManager)
        {
            this._userMgr = userManager;
        }

        public AccountController(ApplicationUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        //GET api/Account/GetRole
        [Route("GetRole")]
        public string GetRole(string email)
        {
            var rm = new RoleStore<IdentityRole>(new ApplicationDbContext());
            var roleManager = new RoleManager<IdentityRole>(rm);
            var roleNames = roleManager.Roles.ToList();
            var role = UserManager.FindByEmail(email).Roles.First();
            


           for (var i = 0; i < roleNames.Count; i++)
            {
                if (roleNames[i].Id.Equals(role.RoleId))
                {
                    return roleNames[i].Name;
                }
            }
            return null;
        }

        //POST api/Account/GiveUserAccess
        [Route("GiveUserAccess")]
        public async Task<IHttpActionResult> GiveUserAccess(string email)
        {
            ApplicationUser user = UserManager.FindByEmail(email);
            user.LockoutEnabled = false;
            user.LockoutEndDateUtc = null;
            return Ok();
        }

        //POST api/Account/IsAccountEnabled
        [AllowAnonymous]
        [Route("IsAccountEnabled")]
        public async Task<IHttpActionResult> IsAccountEnabled(string email)
        {
            ApplicationUser user = UserManager.FindByName(email);
            if (user != null)
            {
                if (user.LockoutEnabled)
                {
                    return Content(HttpStatusCode.BadRequest, "Your account hasn't been granted access yet.");
                }
            }
            else
            {
                return Content(HttpStatusCode.BadRequest, "The email address isn't registered.");
            }
            return Ok("User has access");
        }

        //GET api/Account/GetUserId
        [Route("GetUserId")]
        public long GetUserId(string email)
        {
            return _userMgr.ReadUser(email).Id;
        }
        
        [Route("GetAllAdminInfo")]
        public AdminInformationModel GetAdminInfo()
        {
            AdminInformationModel model = new AdminInformationModel()
            {
                BlockedUsers = new List<User>()
            };
            foreach (var applicationUser in UserManager.Users.Where(u => u.LockoutEnabled).Where(p => p.LockoutEndDateUtc == null))
            {
                model.BlockedUsers.Add(_userMgr.ReadUser(applicationUser.Email));
            }
            return model;
        }

        [Route("GetAllUsers")]
        public IEnumerable<IGrouping<int, User>> GetAllUsers()
        {
            List<User> users = new List<User>();
            foreach (var applicationUser in UserManager.Users)
            {
                users.Add(_userMgr.ReadUser(applicationUser.Email));
            }
            return users.GroupBy(x=>x.DateRegistered.Month);
        }

        //GET api/Account/GetAllUsersForAdmin
        [Route("GetAllUsersForAdmin")]
        public List<ApplicationUser> GetAllUsersForAdmin()
        {
            var admin = _userMgr.ReadUser(1);
            IEnumerable<ApplicationUser> users = UserManager.Users.Where(a => !a.Email.Equals(admin.Email)).AsEnumerable();
            return users.ToList();
        }

        [Route("AllowUser")]
        public async Task<IHttpActionResult> AllowUser(string email)
        {
            var user = UserManager.Users.Single(u => u.Email == email);
            await UserManager.SetLockoutEndDateAsync(user.Id, DateTimeOffset.Now);
            await UserManager.SetLockoutEnabledAsync(user.Id, false);
            return Ok(email + " will now have access to Sussol");
        }
        [Route("DenyUser")]
        public async Task<IHttpActionResult> DenyUser(string email)
        {
            var user = UserManager.Users.Single(u => u.Email == email);
            await UserManager.SetLockoutEnabledAsync(user.Id, true);
            await UserManager.SetLockoutEndDateAsync(user.Id, DateTimeOffset.MaxValue);
            return Ok(email + " is blocked from Sussol");
        }

        //GET api/Account/GetUserInfo
        [Route("GetUserInfo")]
        public IHttpActionResult GetUserInformation(long id)
        {
            User user = _userMgr.ReadUser(id);
            if (User.Identity.Name == user.Email)
            {
                var model = new UserInformationViewModel()
                {
                    Id = user.Id,
                    Firstname = user.Firstname,
                    Lastname = user.Lastname,
                    Picture = null
                };
                if (user.AvatarUrl != null)
                {
                    model.Picture = user.AvatarUrl;
                }
                return Ok(model);
            }
            return BadRequest();

        }

        //POST api/Account/ChangeAvatar
        [Route("ChangeAvatar")]
        public async Task<IHttpActionResult> ChangeAvatar()
        {
            string root = HttpContext.Current.Server.MapPath("~/App_Data");
            var provider = new MultipartFormDataStreamProvider(root);
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            var email = "";
            MultipartFileData picture = null;
            try
            {
                await Request.Content.ReadAsMultipartAsync(provider);

                email = provider.FormData.Get("email");
                if (provider.FileData.Count != 0)
                {
                    picture = provider.FileData[0];
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            string imagePath = null;
            if (picture != null && picture.LocalFileName.Length > 0)
            {
                imagePath = FileHelper.GetImagePathFromRequest(picture, "UsersImgPath");
            }

            User user = _userMgr.ReadUser(email);

            user.AvatarUrl = imagePath;

            _userMgr.UpdateUser(user);

            return Ok();
        }

        // POST api/Account/Logout
        [Route("Logout")]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }

        // GET api/Account/ManageInfo?returnUrl=%2F&generateState=true
        [Route("ManageInfo")]
        public async Task<ManageInfoViewModel> GetManageInfo(string returnUrl, bool generateState = false)
        {
            IdentityUser user = await UserManager.FindByIdAsync(User.Identity.GetUserId());

            if (user == null)
            {
                return null;
            }

            List<UserLoginInfoViewModel> logins = new List<UserLoginInfoViewModel>();

            foreach (IdentityUserLogin linkedAccount in user.Logins)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = linkedAccount.LoginProvider,
                    ProviderKey = linkedAccount.ProviderKey
                });
            }

            if (user.PasswordHash != null)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = LocalLoginProvider,
                    ProviderKey = user.UserName,
                });
            }

            return new ManageInfoViewModel
            {
                LocalLoginProvider = LocalLoginProvider,
                Email = user.UserName,
                Logins = logins,
                ExternalLoginProviders = GetExternalLogins(returnUrl, generateState)
            };
        }

        // POST api/Account/ChangePassword
        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(string currentPassword, string newPassword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), currentPassword,
                newPassword);
            
            if (!result.Succeeded)
            {
                return Content(HttpStatusCode.BadRequest, "Incorrent password or new password doesn't suffice to the rules." +
                                                          " Password must contain a capital, a number and must consist out atleast 6 characters.");
            }

            return Ok("Your password has been changed.");
        }

        // POST api/Account/SetPassword
        [Route("SetPassword")]
        public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/AddExternalLogin
        [Route("AddExternalLogin")]
        public async Task<IHttpActionResult> AddExternalLogin(AddExternalLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

            AuthenticationTicket ticket = AccessTokenFormat.Unprotect(model.ExternalAccessToken);

            if (ticket == null || ticket.Identity == null || (ticket.Properties != null
                && ticket.Properties.ExpiresUtc.HasValue
                && ticket.Properties.ExpiresUtc.Value < DateTimeOffset.UtcNow))
            {
                return BadRequest("External login failure.");
            }

            ExternalLoginData externalData = ExternalLoginData.FromIdentity(ticket.Identity);

            if (externalData == null)
            {
                return BadRequest("The external login is already associated with an account.");
            }

            IdentityResult result = await UserManager.AddLoginAsync(User.Identity.GetUserId(),
                new UserLoginInfo(externalData.LoginProvider, externalData.ProviderKey));

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/RemoveLogin
        [Route("RemoveLogin")]
        public async Task<IHttpActionResult> RemoveLogin(RemoveLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result;

            if (model.LoginProvider == LocalLoginProvider)
            {
                result = await UserManager.RemovePasswordAsync(User.Identity.GetUserId());
            }
            else
            {
                result = await UserManager.RemoveLoginAsync(User.Identity.GetUserId(),
                    new UserLoginInfo(model.LoginProvider, model.ProviderKey));
            }

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // GET api/Account/ExternalLogin
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalCookie)]
        [AllowAnonymous]
        [Route("ExternalLogin", Name = "ExternalLogin")]
        public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
        {
            if (error != null)
            {
                return Redirect(Url.Content("~/") + "#error=" + Uri.EscapeDataString(error));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return new ChallengeResult(provider, this);
            }

            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            if (externalLogin == null)
            {
                return InternalServerError();
            }

            if (externalLogin.LoginProvider != provider)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                return new ChallengeResult(provider, this);
            }

            ApplicationUser user = await UserManager.FindAsync(new UserLoginInfo(externalLogin.LoginProvider,
                externalLogin.ProviderKey));

            bool hasRegistered = user != null;

            if (hasRegistered)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                
                 ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(UserManager,
                    OAuthDefaults.AuthenticationType);
                ClaimsIdentity cookieIdentity = await user.GenerateUserIdentityAsync(UserManager,
                    CookieAuthenticationDefaults.AuthenticationType);

                AuthenticationProperties properties = ApplicationOAuthProvider.CreateProperties(user.UserName);
                Authentication.SignIn(properties, oAuthIdentity, cookieIdentity);
            }
            else
            {
                IEnumerable<Claim> claims = externalLogin.GetClaims();
                ClaimsIdentity identity = new ClaimsIdentity(claims, OAuthDefaults.AuthenticationType);
                Authentication.SignIn(identity);
            }

            return Ok();
        }

        // GET api/Account/ExternalLogins?returnUrl=%2F&generateState=true
        [AllowAnonymous]
        [Route("ExternalLogins")]
        public IEnumerable<ExternalLoginViewModel> GetExternalLogins(string returnUrl, bool generateState = false)
        {
            IEnumerable<AuthenticationDescription> descriptions = Authentication.GetExternalAuthenticationTypes();
            List<ExternalLoginViewModel> logins = new List<ExternalLoginViewModel>();

            string state;

            if (generateState)
            {
                const int strengthInBits = 256;
                state = RandomOAuthStateGenerator.Generate(strengthInBits);
            }
            else
            {
                state = null;
            }

            foreach (AuthenticationDescription description in descriptions)
            {
                ExternalLoginViewModel login = new ExternalLoginViewModel
                {
                    Name = description.Caption,
                    Url = Url.Route("ExternalLogin", new
                    {
                        provider = description.AuthenticationType,
                        response_type = "token",
                        client_id = Startup.PublicClientId,
                        redirect_uri = new Uri(Request.RequestUri, returnUrl).AbsoluteUri,
                        state = state
                    }),
                    State = state
                };
                logins.Add(login);
            }

            return logins;
        }

        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register()
        {
            string root = HttpContext.Current.Server.MapPath("~/App_Data");
            var provider = new MultipartFormDataStreamProvider(root);
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            var firstname = "";
            var lastname = "";
            var email= "";
            var password = "";
            MultipartFileData picture = null;
            try
            {
                await Request.Content.ReadAsMultipartAsync(provider);

                firstname = provider.FormData.Get("firstname");
                lastname = provider.FormData.Get("lastname");
                email = provider.FormData.Get("email");
                password = provider.FormData.Get("password");
                if (provider.FileData.Count != 0)
                {
                    picture = provider.FileData[0];
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            string imagePath = null;
            if (picture != null && picture.LocalFileName.Length > 0)
            {
                imagePath = FileHelper.GetImagePathFromRequest(picture, "UsersImgPath");
            }

            User user = _userMgr.ReadUser(email);
            if (user != null)
            {
                return BadRequest("Email address already in use");
            }
  

                var applicationUser = new ApplicationUser() { UserName = email, Email = email, LockoutEnabled = true};
                user = _userMgr.CreateUser(firstname, lastname, email, imagePath);
                IdentityResult result = await UserManager.CreateAsync(applicationUser, password);
                if (result.Succeeded)
                {
                    UserManager.AddToRole(applicationUser.Id, "User");
                    Authentication.SignIn();
                return Ok("Registration was successful. Your application has been send to an administrator. " +
                              "When you're accepted you can login.");
                }
                _userMgr.DeleteUser(user);
            return BadRequest("Password must contain a capital, a number and must consist out atleast 6 characters");
        }

        // POST api/Account/RegisterExternal
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("RegisterExternal")]
        public async Task<IHttpActionResult> RegisterExternal(RegisterExternalBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var info = await Authentication.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return InternalServerError();
            }

            var user = new ApplicationUser() { UserName = model.Email, Email = model.Email };

            IdentityResult result = await UserManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            result = await UserManager.AddLoginAsync(user.Id, info.Login);
            if (!result.Succeeded)
            {
                return GetErrorResult(result); 
            }
            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }

            public IList<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }

        #endregion
    }
}
