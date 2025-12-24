export interface STKPushRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
  callbackUrl?: string;
}

export interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface TransactionStatusRequest {
  CheckoutRequestID: string;
}

export interface TransactionStatusResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}

export interface C2BRegisterRequest {
  shortCode: string;
  responseType: "Completed" | "Cancelled";
  confirmationURL: string;
  validationURL: string;
}

export interface CallbackMetadata {
  Item: Array<{
    Name: string;
    Value: string | number;
  }>;
}

export interface STKCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: CallbackMetadata;
    };
  };
}
export interface C2BCallback {
  TransactionType: string;
  TransID: string;
  TransTime: string;
  TransAmount: string;
  BusinessShortCode: string;
  BillRefNumber: string;
  InvoiceNumber?: string;
  OrgAccountBalance?: string;
  ThirdPartyTransID?: string;
  MSISDN: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
}

export interface C2BRegisterResponse {
  OriginatorCoversationID: string;
  ResponseCode: string;
  ResponseDescription: string;
}
