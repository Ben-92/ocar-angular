import { User } from "./user";

export interface Sale {

    id : number;
    date : Date;
    finalPrice : String;
    commissionRate : number;
    user : User;
}
