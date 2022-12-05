import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { RetrieveUserDto } from './dto/retrieve-user.dto';
import { TestDto } from './dto/test.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/roles')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.usersService.createRole(createRoleDto);
  }

  @UseGuards(AuthGuard('local'))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Request() req): Promise<RetrieveUserDto[]> {
    console.log(req.user);

    return null;
    // return await this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('test')
  async findTest(): Promise<TestDto> {
    return new TestDto({
      firstName: '123',
      lastName: 'abc',
      password: 'bba'
    });
  }

  @Public()
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.usersService.findOneByName(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
