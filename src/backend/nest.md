# Nest.js

## cli

```bash
pnpm install -g @nestjs/cli

nest new <project-name> --package-manager pnpm

# nest g co <controller-name>
nest generate controller <controller-name>
# nest g mo <module-name>
nest generate module <module-name>
# nest g s <service-name>
nest generate service <service-name>
# nest g c <resource-name>
nest generate resource <resource-name>
```

## API 版本

::: code-group

```ts [main.ts]
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({ // [!code ++]
    type: VersioningType.URI, // [!code ++]
  }); // [!code ++]
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

```ts{6,17} [user/user.controller.ts]
import { Controller, Get, Param, Version } from '@nestjs/common';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}
  // http://localhost:3000/v1/user
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // http://localhost:3000/v2/user/123
  @Version('2')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number.parseInt(id, 10));
  }
}
```

:::
