import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

console.log(matchers);

// export default clerkMiddleware((auth, req) => {
//   // if (isProtectedRoute(req)) auth().protect()

//   const { sessionClaims } = auth();

//   console.log({sessionClaims})

//   const role = sessionClaims?.role as string;

//   for (const { matcher, allowedRoles } of matchers) {
//     if (matcher(req) && !allowedRoles.includes(role!)) {
//       return NextResponse.redirect(new URL(`/${role}`, req.url));
//     }
//   }
// });

export default clerkMiddleware((auth, req) => {
  const { sessionClaims } = auth();
  const role = sessionClaims?.role as string | undefined;

  console.log("URL:", req.nextUrl.pathname);
console.log("ROLE:", role);

  if (!role) return;

  

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(
          new URL(`/${role}`, req.url)
        );
      }
      break; // stop checking once matched
    }
  }
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};