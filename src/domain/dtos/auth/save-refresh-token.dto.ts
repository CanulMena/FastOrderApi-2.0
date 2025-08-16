
export class SaveRefreshTokenDto {
  constructor(
    public userId: number, 
    public refreshtoken: string,
    public deviceName?: string,
    public deviceOS?: string,
    public ipAddress?: string
  ) {}
}
