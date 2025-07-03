import { Action } from "./action";

export class MessageCreateAction extends Action {
  handle(data) {
    console.log("MessageCreateAction handle called with data:", data);
    const client = this.client; 
    return null ;
  }
}