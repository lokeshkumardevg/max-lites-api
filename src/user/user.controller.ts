import { Body, Controller, Param, Post, Get, Put, Query } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { ROUTE } from 'src/util/constants';
import { AddressDto } from './dto/address.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller(ROUTE.USER)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('create-address')
  async createAddress(@Body() dto: AddressDto) {
    return this.userService.createAddress(dto);
  }


  @Get('address/:userId')
  async getAddress(@Param('userId') userId: string) {
    return this.userService.getAddress(userId);
  }

  @Put('update-location/:id')
  async updateLocation(
    @Param('id') userId: string,
    @Body() body: { longitude: string; latitude: string; address: string },
  ) {
    return this.userService.updateLocation(
      userId,
      body.longitude,
      body.latitude,
      body.address,
    );
  }

  @Get('nearby-users')
  async getNearbyUsers(
    @Query('longitude') longitude: string,
    @Query('latitude') latitude: string,
  ) {
    return this.userService.findNearbyUsers(longitude, latitude);
  }

  @Get('getUser/:userId')
  async getUserById(@Param('userId') userId: string) {
    return this.userService.findUserById(userId);
  }

  @Put('updateUser/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateData: Partial<CreateUserDto>,
  ) {
    return this.userService.updateUserByUserId(userId, updateData);
  }

  @Get('get-all-users')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
