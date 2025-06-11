import { formatCode } from "./utils";

export async function handleError(
  e: any,
  openAlert: (
    type: "success" | "fail" | "info",
    title: string,
    message?: string
  ) => void,
  codeToCheck?: string|undefined, 
  codeToRun?:()=>void|undefined
) {
  if (!e.status) {
    if (e.code) {
      switch (e.code) {
        case "ECONNABORTED":
          return openAlert(
            "fail",
            "Failed!",
            "Request TImed out\nPlease try again later!"
          );
          

        case "ERR_NETWORK":
          return openAlert("fail", "Failed!", "Server is not reachable\n Please try again later!");
          
      }
    } else {
      return openAlert(
        "fail",
        "Failed!",
        "Unknown client side error occured\nPlease contact the developers!"
      );
    }
  }

  //Server Error
  if (e.status === 500) {
    return openAlert("fail", "Failed!", e.message);
  } else {
    
    if(codeToCheck && (codeToCheck===e.response.data.code)) codeToRun && codeToRun();
    return openAlert(
      "fail",
      formatCode(e.response.data.code),
      e.response.data.message
    );

  }
}
