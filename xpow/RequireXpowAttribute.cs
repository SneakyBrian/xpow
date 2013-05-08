using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Web.Routing;

namespace xpow
{
    public class RequireXpowAttribute : ActionFilterAttribute
    {
        public RequireXpowAttribute()
        {
            RedirectController = "Xpow";
            RedirectAction = "Index";
        }

        public string RedirectController { get; set; }
        public string RedirectAction { get; set; }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!HttpSupport.ValidateResponse(filterContext.HttpContext))
            {
                filterContext.Result =
                    new RedirectToRouteResult(
                        new RouteValueDictionary{{ "controller", RedirectController },
                                                 { "action", RedirectAction }
                                                });
            }

            base.OnActionExecuting(filterContext);
        }
    }
}
