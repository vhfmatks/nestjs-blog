import { Exclude, Expose } from "class-transformer";
import { Transform } from "stream";
import { Role } from "../entities/role.entity";


export class RetrieveUserDto {
  id: number;
  name: string;

  @Exclude()
  roles: Role[];

  @Expose()
  get Roles(): string[] {
    return this.roles.map(role => role.name)
  }
  @Exclude()
  password: string;
}