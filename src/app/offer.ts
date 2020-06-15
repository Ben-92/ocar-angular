import { Equipment } from "./equipment";
import { User } from "./user";

export interface Offer {

    id : number;
    date : Date;
    postalCode : number;
    carBrand : String;
    carModel : string;
    year : String;
    gearbox : String;
    outerColor : String;
    fourWheelDrive : Boolean;
    description : String;
    price : String;
    user : User;
    equipments : Equipment[];


}
