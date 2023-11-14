export class UserDto{
    firstName:string;
    lastName:string;
    jwt:string;
}
export class RefreshTokenDto{
    token:string;
    userId:string;
}