import { User } from "./user";

export interface Sale {

    id : number;
    date : Date;
    finalPrice : String;
    user : User;
}
