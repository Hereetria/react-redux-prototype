import { AxiosError } from "axios";

class ApiError extends Error {
    constructor(public statusCode: number, public message: string) {
      super(message);
      this.name = "ApiError";
    }
  }


const processApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    const { status, statusText } = error.response;

    let errorMessage: string;

    switch (status) {
      case 400:
        errorMessage = "Bad Request - The server could not understand the request.";
        break;
      case 401:
        errorMessage = "Unauthorized - Please login to continue.";
        break;
      case 403:
        errorMessage = "Forbidden - You do not have permission to access this resource.";
        break;
      case 404:
        errorMessage = "Not Found - The requested resource could not be found.";
        break;
      case 500:
        errorMessage = "Internal Server Error - Something went wrong on the server.";
        break;
      case 502:
        errorMessage = "Bad Gateway - The server received an invalid response from the upstream server.";
        break;
      case 503:
        errorMessage = "Service Unavailable - The server is temporarily unavailable.";
        break;
      default:
        errorMessage = statusText || "API Error occurred";
        break;
    }

    return new ApiError(status, errorMessage);
  }
  return new ApiError(0, "No response from the server");
};

export default processApiError
