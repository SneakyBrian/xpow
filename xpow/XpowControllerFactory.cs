using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace xpow
{
    public class XpowControllerFactory : DefaultControllerFactory 
    {
        const string XPOW_CONTROLLER_NAME = "xpow";

        protected override Type GetControllerType(System.Web.Routing.RequestContext requestContext, string controllerName)
        {
            if (controllerName.Equals(XPOW_CONTROLLER_NAME, StringComparison.InvariantCultureIgnoreCase))
                return typeof(XpowController);

            return base.GetControllerType(requestContext, controllerName);
        }
    }
}
