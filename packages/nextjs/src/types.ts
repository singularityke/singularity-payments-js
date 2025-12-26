import { NextRequest, NextResponse } from "next/server";

export interface RouteHandler {
  POST: (request: NextRequest) => Promise<NextResponse>;
}

export interface MpesaRouteHandlers {
  stkCallback: RouteHandler;
  c2bValidation: RouteHandler;
  c2bConfirmation: RouteHandler;
  b2cResult: RouteHandler;
  b2cTimeout: RouteHandler;
  catchAll: RouteHandler;
}
