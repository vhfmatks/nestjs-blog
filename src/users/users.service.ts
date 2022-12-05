import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { IUserWithRoles } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, password, roles } = createUserDto;

    //const newUserRoles = roles.map((role) => this.roleRepository.findOneBy({ name: role }))
    const newUserRoles = await this.roleRepository
      .createQueryBuilder()
      .where('name IN (:...name)', { name: roles })
      .getMany();
    console.log(newUserRoles);

    const newUser = new User();
    newUser.name = name;
    newUser.password = password;
    newUser.roles = newUserRoles;
    return await this.userRepository.save(newUser);
  }
  async createRole(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;
    const newRole = new Role();
    newRole.name = name;
    return await this.roleRepository.save(newRole);
  }

  async findAll() {
    // return await this.userRepository.find({ relations: ['roles'] });
    const users = await this.userRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.roles', 't')
      .getMany();
    // return users.map(user => ({
    //   ...user,
    //   roles: user.roles.map(role => role.name)
    // }))
    return users;
  }

  async findOneByName(name: string): Promise<IUserWithRoles> | undefined {
    const user = await this.userRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.roles', 't')
      .where('m.name = :name', { name })
      .getOne();
    return {
      ...user,
      roles: user.roles.map((role) => role.name),
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
