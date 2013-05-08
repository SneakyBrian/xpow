using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace xpow
{
    public class XpowController : Controller
    {
        public ActionResult Index()
        {
            //set this view up with an xpow request
            HttpSupport.SetupRequest(HttpContext);

            //TODO: whatever was posted or present in the query string must be preserved 
            //      for the redirect back to the original target once the xpow response 
            //      has been generated

            return View();
        }
    }
}
