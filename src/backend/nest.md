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
  app.enableVersioning({
    // [!code ++]
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

## Controller

```ts
import {
  Controller,
  Post,
  Body,
  Param,
  Next,
  Request, // Req
  Response, // Res
  Query,
  Headers,
  HttpCode,
  Session,
} from "@nestjs/common";
import type {
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { DemoService } from "./demo.service";
import { DemoDto } from "./dto/demo.dto";

@Controller("demo")
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post() // @Get(), @Put(), @Patch(), @Delete() 请求方法
  @HttpCode(200) // 响应状态码
  @Headers("Content-Type", "application/json") // 响应头参数
  demoApi(
    @Request() req: ExpressRequest, // 请求对象
    @Response() res: ExpressResponse, // 响应对象
    @Next() next: NextFunction, // 放行函数
    @Session() session: Record<string, unknown>, // 会话对象
    @Param(/** key?: string*/) params: Record<string, string>, // url 路径参数, e.g. @Get(':id')
    @Body(/** key: string */) demoDto: DemoDto, // 请求体参数
    @Query(/** key?: string*/) query: Record<string, string>, // 请求行参数 (查询参数)
    @Headers(/** key?: string*/) headers: Record<string, string>, // 请求头参数
  ) {
    const fields = Object.keys(req).filter((key) => !key.startsWith("_"));
    // url, method, statusCode, statusMessage, client, res,
    // next, baseUrl, originalUrl, params, body, route
    console.log(fields);
    next();
  }
}
```

| Decorator                                      | Parameter                                   | Description           |
| ---------------------------------------------- | ------------------------------------------- | --------------------- |
| `@Get(), @Post(), @Put(), @Patch(), @Delete()` |                                             | 请求方法              |
| `@HttpCode(200)`                               |                                             | 响应状态码            |
| `@Headers("Content-Type", "application/json")` |                                             | 响应头参数            |
| `@Request()`, `@Req()`                         | `req: ExpressRequest`                       | 请求对象              |
| `@Response()`, `@Res()`                        | `req: ExpressResponse`                      | 响应对象              |
| `@Next()`                                      | `next: NextFunction`                        | 放行函数              |
| `@Session()`                                   | `session: Record<string, unknown>`          | 会话对象              |
| `@Param(/** key?: string*/)`                   | `params: Record<string, string> \| string`  | url 路径参数          |
| `@Body(/** key?: string */)`                   | `body: Record<string, string> \| string`    | 请求体参数            |
| `@Query(/** key?: string*/)`                   | `query: Record<string, string> \| string`   | 请求行参数 (查询参数) |
| `@Headers(/** key?: string*/)`                 | `headers: Record<string, string> \| string` | 请求头参数            |

## Session

```bash
pnpm add express-session @types/express-session
```

::: code-group

```ts [main.ts]
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 开启跨域
  app.enableCors({
    origin: "http://localhost:4200",
    credentials: true,
  });

  // 使用 Session
  app.use(
    session({
      secret: "161043261",
      rolling: true,
      name: "161043261.sid",
      cookie: {
        httpOnly: true, // 预防 XSS
        maxAge: 1000 * 60 * 60 * 24, // 24h
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

```ts [Nest.js user/user.controller.ts]
import { Controller, Get, Post, Body, Session, Res } from "@nestjs/common";
import type { Response as ExpressResponse } from "express";
import { UserService } from "./user.service";
import svgCaptcha from "svg-captcha";

interface ISession {
  cookie: {
    path: string;
    _expires: Date;
    originalMaxAge: number;
    httpOnly: boolean;
  };
  captcha?: {
    text: string;
  };
}
@Controller({
  path: "user",
  version: "1",
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  // http://localhost:3000/v1/user
  // pnpm add svg-captcha
  @Get("captcha")
  createCaptcha(@Res() res: ExpressResponse, @Session() session: ISession) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 200,
      height: 50,
      background: "#4059bf80",
    });
    session.captcha = { text: captcha.text };
    res.send(captcha.data);
  }

  @Post("create")
  createUser(
    @Body() body,
    @Session() session: ISession,
    @Body("captcha") bodyCaptcha: string,
  ) {
    const sessionCaptcha = session.captcha?.text ?? "";
    if (bodyCaptcha.toLowerCase() === sessionCaptcha.toLowerCase()) {
      return { code: 200 };
    }
    return { code: 400 };
  }
}
```

```json [Angular proxy.config.json]
{
  "/api/**": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

```ts [Angular app/app.ts]
import {
  Component,
  signal,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from "@angular/core";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { HttpClient } from "@angular/common/http";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-root",
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatGridListModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field>
      <mat-label>username</mat-label>
      <input matInput [(ngModel)]="username" />
    </mat-form-field>

    <mat-form-field>
      <mat-label>password</mat-label>
      <input matInput [(ngModel)]="password" />
    </mat-form-field>

    <mat-form-field>
      <mat-label>captcha</mat-label>
      <input matInput [(ngModel)]="captchaText" />
    </mat-form-field>

    <div [innerHTML]="captchaData()" (click)="getCaptcha()"></div>
    <button matButton="elevated" (click)="handleSubmit()">Submit</button>
  `,
})
export class App implements OnInit {
  ngOnInit() {
    this.getCaptcha();
  }
  username = signal<string>("");
  password = signal<string>("");
  captchaData = signal<SafeHtml>("");
  captchaText = signal<string>("");
  captchaUrl = signal<string>("/api/v1/user/captcha");

  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  getCaptcha() {
    this.http
      .get("/api/v1/user/captcha", {
        responseType: "text",
      })
      .subscribe((newCaptchaData) => {
        const safeHtml = this.sanitizer.bypassSecurityTrustHtml(newCaptchaData);
        this.captchaData.set(safeHtml);
      });
  }

  handleSubmit() {
    this.http
      .post("/api/v1/user/create", {
        username: this.username(),
        password: this.password(),
        captcha: this.captchaText(),
      })
      .subscribe(console.log(res));
  }
}
```

:::
