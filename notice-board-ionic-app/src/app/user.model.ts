export class UserData {
  constructor(
    public DisplayName: string,
    public Email: string,
    public Uid: string,
    public CreationTime: string,
    public LastSignInTime: string,
    public IsNewUser?: boolean,
    public PhotoUrl?: string,
    public PhoneNumber?: string
  ) {}
}
export class LoginUserData {
  constructor(
    public name: string,
    public rollno: string,
    public erpId: string,
    public div: string,
    public department: string,
    public year: string
  ) {}
}
