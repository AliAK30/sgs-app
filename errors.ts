import { formatCode } from "./utils";

export async function handleError(e:any, openAlert: (type: "success" | "fail" | "info", title: string, message?: string) => Promise<void>) {

    if (!e.status) {
      if(e.code){
        switch (e.code) {
          case "ECONNABORTED":
            await openAlert(
              "fail",
              "Failed!",
              "Request TImed out\nPlease try again later!"
            );
            return;

          case "ERR_NETWORK":
            await openAlert(
              "fail",
              "Failed!",
              "Server address not found!"
            );
            return;
        }
      } else {
        await openAlert(
              "fail",
              "Failed!",
              "Unknown client side error occured\nPlease contact the developers!"
            );
      }
    }

    //Server Error
    if (e.status === 500) {

        await openAlert("fail", "Failed!", e.message);

    } else {

        await openAlert('fail', formatCode(e.response.data.code), e.response.data.message)
    } 

    return;
}