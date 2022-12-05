import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Role } from "./role.entity";
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from "@nestjs/common";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({ length: 300, unique: true })
  name: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[]

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('password hash error')
    }
  }
}
