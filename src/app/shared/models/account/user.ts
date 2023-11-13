export class User {
    firstName: string;
    lastName: string;
    token: Token;
}
export class Token {
    accessToken: string;
    expirationDate: string;
    refreshToken: RefreshToken;
}
export class RefreshToken {
    token: string;
    expirationDate: Date;
    dateCreated: Date;
    userId: string;
}