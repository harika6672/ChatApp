export class User {
    firstName:string;
    lastName:string;
    photoUrl:string;
    id:string;

    constructor({id,firstName,lastName,photoUrl}){
        this.firstName=firstName;
        this.lastName=lastName;
        this.photoUrl=photoUrl;
        this.id=id;
    }
}