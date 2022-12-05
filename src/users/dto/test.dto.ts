import { Exclude, Expose } from "class-transformer";


export class TestDto {
  firstName: string;
  lastName: string;

  @Exclude()
  password: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  constructor(partial: Partial<TestDto>) {
    Object.assign(this, partial)
  }
}