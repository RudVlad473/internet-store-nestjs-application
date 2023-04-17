import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { GoogleAuthController } from './controllers/google-auth.controller';
import { AssignRoleInterceptor } from './interceptors/assign-role.interceptor';
import { AuthService } from './providers/auth.service';
import { GoogleService } from './providers/google-auth.service';
import { RoleService } from './providers/role.service';
import { GoogleStrategy, JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})],
  exports: [RoleService],
  providers: [
    AuthService,
    GoogleService,
    RoleService,
    AssignRoleInterceptor,
    JwtStrategy,
    GoogleStrategy,
  ],
  controllers: [AuthController, GoogleAuthController],
})
export class AuthModule {}
