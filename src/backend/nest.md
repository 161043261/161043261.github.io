# Nest.js

## cli

```bash
pnpm install -g @nestjs/cli

nest new <project-name> --package-manager pnpm

# nest g co <controller-name> [--no-spec]
nest generate controller <controller-name> [--no-spec]
# nest g mo <module-name>
nest generate module <module-name>
# nest g s <service-name>
nest generate service <service-name>
# nest g c <resource-name>
nest generate resource <resource-name>
# nest g mi <middleware-name>
nest generate middleware <middleware-name>
# nest g itc <interceptor-name>
nest generate interceptor <interceptor-name>
# nest g f <filter-name>
nest generate filter <filter-name>
# nest g pi <pipe-name>
nest generate pipe <pipe-name>
# nest g gu <guard-name>
nest generate guard <guard-name>
# nest g d <decorator-name>
nest generate decorator <decorator-name>
```

## API 版本

::: code-group

```ts{7-9} [main.ts]
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
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

```ts [user/user.controller.ts]
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

  // pnpm add svg-captcha
  // http://localhost:3000/v1/user/captcha
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
import { Component, signal, inject, OnInit } from "@angular/core";
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

## Provider 提供者

::: code-group

```ts{3} [user/user.service.ts]
import { Injectable } from "@nestjs/common";

@Injectable() // 可注入
export class UserService {}
```

```ts{7} [user/user.module.ts]
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService], // 提供者
})
export class UserModule {}
```

```ts{6} [user/user.controller.ts]
import { Controller } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {} // 依赖注入
}
```

:::

### 自定义注入

- `useClass` 自定义注入类
- `useValue` 自定义注入值
- `useFactory` 自定义注入工厂函数

::: code-group

```ts{3} [user/user.service.ts]
import { Injectable } from "@nestjs/common";

@Injectable() // 可注入
export class UserService {}
```

```ts [user/user.module.ts]
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: "user-service",
      useClass: UserService,
    }, // 自定义注入类
    {
      provide: "injectable-value",
      useValue: ["React", "Vue3", "Angular"],
    }, // 自定义注入值
    {
      provide: "injectable-factory-method",
      inject: [UserService /** line10 */, "user-service" /** line14 */],
      async useFactory(userService: UserService, userService2: UserService) {
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve(userService === userService2);
          }, 5000);
        });
      },
    }, // 自定义注入工厂函数
  ], // 提供者
})
export class UserModule {}
```

```ts{7-9} [user/user.controller.ts]
import { Controller } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('user-service') private readonly userService2: UserService,
    @Inject('injectable-value') private readonly injectedArr: string[],
    @Inject('injectable-factory-method') private readonly returnValue: boolean,
  ) {
    console.log('userService === userService2:', userService === userService2); // false
    console.log('injectedArr:', injectedArr); // [ 'React', 'Vue3', 'Angular' ]
    console.log('returnValue:', returnValue); // false
  } // 依赖注入
}
```

:::

## 模块

模块导出, 全局模块, 动态模块

::: code-group

```ts{12,15,18} [config/config.module.ts]
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

export interface IConfig {
  baseUrl: string;
}

const globalConfigProvider: Provider = {
  provide: 'global-config',
  useValue: <IConfig>{ baseUrl: '/api/v1' },
};

@Global() // 全局模块
@Module({
  providers: [globalConfigProvider],
  exports: [globalConfigProvider], // 模块导出
})
export class ConfigModule {
  // 动态模块: 静态方法, 返回 DynamicModule 对象
  static dynamicGlobalConfig(config: IConfig): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'dynamic-global-config',
          useValue: config,
        },
      ],
      exports: ['dynamic-global-config'], // 模块导出
    };
  }
}
```

```ts [app.module.ts]
import { Inject, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DemoModule } from "./demo/demo.module";
import { UserModule } from "./user/user.module";
import { DemoService } from "./demo/demo.service";
import { ConfigModule, type IConfig } from "./config/config.module";

// ConfigModule 是全局模块
// AppModule 和 AppModule 的子模块 (DemoModule, UserModule) 都可以使用 ConfigModule
// 都可以注入 ConfigModule 提供的 'global-config' 和 'dynamic-global-config'
@Module({
  imports: [
    DemoModule,
    UserModule,
    ConfigModule,
    ConfigModule.dynamicGlobalConfig({ baseUrl: "/api/v2" }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private readonly demoService: DemoService,
    @Inject("global-config") globalConfig: IConfig,
    @Inject("dynamic-global-config") dynamicGlobalConfig: IConfig,
  ) {
    console.log(globalConfig); // { baseUrl: '/api/v1' }
    console.log(dynamicGlobalConfig); // { baseUrl: '/api/v2' }
    console.log(demoService.globalConfig); // { baseUrl: '/api/v1' }
    console.log(demoService.dynamicGlobalConfig); // { baseUrl: '/api/v2' }
    console.log(globalConfig === demoService.globalConfig); // true
    console.log(dynamicGlobalConfig === demoService.dynamicGlobalConfig); // true
  }
}
```

```ts [demo/demo.module.ts]
import { Module } from "@nestjs/common";
import { DemoService } from "./demo.service";

@Module({
  providers: [DemoService],
  exports: [DemoService], // 模块导出
})
export class DemoModule {}
```

```ts [demo/demo.service.ts]
import { Inject, Injectable } from "@nestjs/common";
import { type IConfig } from "../config/config.module";

@Injectable()
export class DemoService {
  globalConfig: IConfig;
  dynamicGlobalConfig: IConfig;

  constructor(
    @Inject("global-config") config: IConfig,
    @Inject("dynamic-global-config") config2: IConfig,
  ) {
    this.globalConfig = config;
    this.dynamicGlobalConfig = config2;
  }
}
```

:::

## 中间件

::: code-group

```ts [logger/logger.middleware.ts]
import { Injectable, NestMiddleware } from "@nestjs/common";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    // res.send('Intercepted by LoggerMiddleware') // 拦截 [!code --]
    next(); // 放行 [!code ++]
  }
}
```

```ts [user/user.module.ts]
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { LoggerMiddleware } from "../logger/logger.middleware";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 写法 1
    consumer.apply(LoggerMiddleware).forRoutes("v1/user/captcha");
    // 写法 2
    consumer.apply(LoggerMiddleware).forRoutes({
      path: "v1/user/captcha",
      method: RequestMethod.GET,
    });
    // 写法 3
    consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}
```

:::

全局中间件

```ts [main.ts]
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  Handler,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";

// 全局中间件
const globalMiddleware: Handler = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  console.log(req.originalUrl);
  next();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(globalMiddleware);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## 静态目录, 文件上传/下载

```bash
pnpm add multer @nestjs/platform-express # 文件 (批量) 上传
pnpm add @types/multer -D
pnpm add compressing # 流式下载
```

::: code-group

```ts [upload/upload.module.ts]
import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { existsSync, mkdirSync } from "fs";

const uploadDir = join(__dirname, "../static");
if (existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, callback) => {
          const fname = `${Date.now()}${extname(file.originalname)}`;
          return callback(null /** error */, fname);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
```

```ts{20} [upload/upload.controller.ts]
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import {
  FileInterceptor, // 文件上传
  // FilesInterceptor, // 文件批量上传
} from '@nestjs/platform-express';
import { join } from 'path';
import { readdirSync } from 'fs';
import type { Response as ExpressResponse } from 'express';
import { zip } from 'compressing';

@Controller({
  path: 'upload',
  version: '1',
})
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 文件上传
  @UseInterceptors(FileInterceptor('entity' /** fieldName */))
  @Post('single')
  upload(@UploadedFile() file: Express.Multer.File) {
    const uploadDir = join(__dirname, '../static');
    const items = readdirSync(uploadDir, { recursive: true });
    return { file, items };
  }

  // 文件下载
  @Get('download')
  download(@Query('filename') filename: string, @Res() res: ExpressResponse) {
    const url = join(__dirname, `../static/${filename}`);
    res.download(url);
  }

  // 流式下载
  // pnpm add compressing
  @Get('stream')
  downloadStream(
    @Query('filename') filename: string,
    @Res() res: ExpressResponse,
  ) {
    const stream = new zip.Stream();
    const url = join(__dirname, `../static/${filename}`);
    stream.addEntry(url);
    res.setHeader('Content-Type', 'application/octet-stream');
    stream.pipe(res);
  }
}
```

```ts [main.ts]
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // 静态资源访问目录
  app.useStaticAssets(join(__dirname, "uploads"));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

```ts{29} [Angular app/app.ts]
import { Component, signal, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';

interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

function download(data: ArrayBuffer | Blob, filename: string) {
  const blob = new Blob([data]);
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

@Component({
  selector: 'app-root',
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatDividerModule,
  ],
  template: `
    <input type="file" (change)="handleInputFile($event)" />
    <button matButton="elevated" (click)="handleUpload()">Upload</button>

    <ul>
      @for (item of uploadedItems(); track item) {
        <li>{{ item }}</li>
      } @empty {
        Empty Uploaded Items
      }
    </ul>

    <mat-divider />

    <mat-form-field>
      <mat-label>filename</mat-label>
      <input matInput placeholder="filename" [(ngModel)]="filename" />
    </mat-form-field>
    <button matButton="elevated" (click)="handleDownload()">Download</button>
    <button matButton="elevated" (click)="handleStreamDownload()">Stream Download</button>
  `,
})
export class App {
  uploadedFile = signal<File | null>(null);
  uploadedItems = signal<string[]>([]);
  filename = signal<string>('');

  private http = inject(HttpClient);

  handleInputFile(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.uploadedFile.set(files[0]);
    }
  }

  handleUpload() {
    if (!this.uploadedFile()) {
      return;
    }
    const formData = new FormData();
    formData.append('entity', this.uploadedFile()!);
    this.http
      .post<{
        file: IFile;
        items: string[];
      }>('/api/v1/upload/single', formData)
      .subscribe(({ file, items }) => {
        const { filename } = file;
        this.filename.set(filename);
        this.uploadedItems.set(items);
      });
  }

  async handleDownload() {
    const blobPart = await fetch(`/api/v1/upload/download?filename=${this.filename()}`).then(
      (res) => res.blob(),
    );
    download(blobPart, this.filename());
  }

  async handleStreamDownload() {
    const buf = await fetch(`/api/v1/upload/stream?filename=${this.filename()}`).then((res) =>
      res.arrayBuffer(),
    );
    download(buf, this.filename() + '.zip');
  }
}
```

:::

## rxjs

- Observable
- Subscription
- Operators

::: code-group

```ts
import { Observable, Subscription, interval, retry, of } from "rxjs";
import { take, map, filter } from "rxjs/operators";

// pnpm test src/app.spec.ts
describe("app tests", () => {
  // tests
});
```

```ts [rxjs test]
// pnpm test src/app.spec.ts --testNamePattern="rxjs test"
it("rxjs test", (done) => {
  const observable = new Observable((subscribe) => {
    subscribe.next(0);
    subscribe.next(1);

    setTimeout(() => {
      subscribe.next(2);
      subscribe.complete();
    }, 3000);
  });

  observable.subscribe({
    next: console.log,
    complete: () => {
      console.log("Done!");
      done();
    },
  });
}, 5000 /** timeout */);
```

```ts [rxjs test2]
// pnpm test src/app.spec.ts --testNamePattern="rxjs test2"
it("rxjs test2", (done) => {
  interval(1000)
    .pipe(take(3))
    .subscribe({
      next: console.log,
      complete: () => {
        console.log("Done!");
        done();
      },
    });
}, 5000);
```

```ts [rxjs test3]
// pnpm test src/app.spec.ts --testNamePattern="rxjs test3"
it("rxjs test3", (done) => {
  const subscription = interval(1000)
    .pipe(
      map((item) => ({ val: item })),
      filter((item) => item.val % 2 === 0),
    )
    .subscribe((item) => {
      console.log(item);
      if (item.val >= 2) {
        subscription.unsubscribe();
        done();
      }
    });
}, 5000);
```

```ts [rxjs test4]
// pnpm test src/app.spec.ts --testNamePattern="rxjs test4"
it("rxjs test4", (done) => {
  const observable = of(0, 1, 2, 3).pipe(
    map((item) => {
      const rand = Math.random();
      if (rand < 0.3) {
        throw new Error(`${rand.toFixed(2)} < 0.3`);
      }
      return { val: item };
    }),
    filter((item) => item.val % 2 === 0),
    retry(3),
    // catchError((err: Error) => {
    //   console.log('[catchError] err:', err.message);
    //   throw err;
    // }),
  );
  const subscription = new Subscription();
  subscription.add(
    observable.subscribe({
      next: (item) => {
        console.log("[subscribe] item:", item);
        if (item.val >= 2) {
          subscription.unsubscribe();
          done();
        }
      },
      error: (err: Error) => {
        console.log("[subscribe] err.message:", err.message);
        done(err.message);
      },
    }),
  );
}, 5000);
```

:::

## 拦截器

### 全局响应拦截器

::: code-group

```ts [response/response.interceptor.ts]
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { Request as ExpressRequest } from "express";

interface IRes {
  data: unknown;
  code: number;
  message: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IRes> {
    // 前置拦截器
    const req = context.switchToHttp().getRequest<ExpressRequest>();
    console.log(req.url);

    // controller

    // 后置拦截器
    return next.handle().pipe(
      map((data: unknown) => ({
        data,
        code: 200,
        message: "OK",
      })),
    );
  }
}
```

```ts{13} [main.ts]
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ResponseInterceptor } from "./response/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

:::

### 全局异常过滤器

::: code-group

```ts [http-exception/http-exception.filter.ts]
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<ExpressRequest>();
    const response = ctx.getResponse<ExpressResponse>();
    response.status(exception.getStatus()).json({
      data: exception.getResponse(),
      code: exception.getStatus(),
      message: exception.message,
      extra: {
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
```

```ts{13} [main.ts]
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { HttpExceptionFilter } from "./http-exception/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

:::

## 管道

### 内置类型校验, 转换管道

- ValidationPipe
- ParseIntPipe
- ParseFloatPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- ParseEnumPipe
- DefaultValuePipe

```ts
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
} from "@nestjs/common";
import { PipeService } from "./pipe.service";
import { v4 as uuid } from "uuid";

console.log(uuid());

@Controller("pipe")
export class PipeController {
  constructor(private readonly pipeService: PipeService) {}

  @Get(":id")
  test(@Param("id") id: string) {
    return { typeofId: typeof id }; // { typeofId: 'string' }
  }

  @Get("int/:id")
  testParseIntPipe(@Param("id", ParseIntPipe) id: number) {
    return { typeofId: typeof id }; // { typeofId: 'number' }
  }

  @Get("uuid/:uuid")
  testParseUUIDPipe(@Param("uuid", ParseUUIDPipe) uuid: string) {
    return { uuid };
  }
}
```

### 全局管道, 自定义管道

```bash
pnpm add class-validator class-transformer
```

::: code-group

```ts [main.ts 全局管道]
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType, ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

```ts [login/login.pipe.ts 自定义管道]
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class LoginPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    console.log("[LoginPipe] value:", value);
    console.log("[LoginPipe] metadata:", metadata);
    if (!metadata.metatype) {
      return value;
    }
    const dto: unknown = plainToInstance(metadata.metatype, value);
    console.log("[LoginPipe] dto:", dto);
    if (typeof dto !== "object" || dto === null) {
      return value;
    }
    const validationErrors = await validate(dto);
    console.log("[LoginPipe] validationErrors:", validationErrors);
    if (validationErrors.length) {
      throw new HttpException({ validationErrors }, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
```

```ts [login/login.controller.ts]
import { Controller, Post, Body, Version } from "@nestjs/common";
import { LoginPipe } from "./login.pipe";
import { CreateLoginDto } from "./dto/create-login.dto";

@Controller("login")
export class LoginController {
  // 使用全局管道 ValidationPipe
  // curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"name": "lark", "age": 23}'
  @Post()
  testCustomPipe(@Body() body: CreateLoginDto) {
    return { body };
  }

  // 使用自定义管道 LoginPipe
  // curl -X POST http://localhost:3000/v2/login -H "Content-Type: application/json" -d '{"name": "lark", "age": 23}'
  // [LoginPipe] value: { name: 'lark', age: 23 }
  // [LoginPipe] metadata: { metatype: [class CreateLoginDto], type: 'body', data: undefined }
  // [LoginPipe] dto: CreateLoginDto { name: 'lark', age: 23 }
  // [LoginPipe] validationErrors: []
  @Post()
  @Version("2")
  testCustomPipe2(@Body(LoginPipe) body: CreateLoginDto) {
    return { body };
  }

  // 使用自定义管道 LoginPipe
  // curl -X POST http://localhost:3000/v3/login -H "Content-Type: application/json" -d '{"name": "lark", "age": 23}'
  // [LoginPipe] value: 23
  // [LoginPipe] metadata: { metatype: [Function: Number], type: 'body', data: 'age' }
  // [LoginPipe] dto: 23
  // [LoginPipe] value: lark
  // [LoginPipe] metadata: { metatype: [Function: String], type: 'body', data: 'name' }
  // [LoginPipe] dto: lark
  @Post()
  @Version("3")
  testCustomPipe3(
    @Body("name", LoginPipe) name: string,
    @Body("age", LoginPipe) age: number,
  ) {
    return { name, age };
  }
}
```

:::

## 守卫

全局守卫

```ts
app.useGlobalGuards(new DemoGuard());
```

### 自定义守卫

::: code-group

```ts [demo/demo.guard.ts]
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Request as ExpressRequest } from "express";

@Injectable()
export class DemoGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    const role = request.query.role;
    console.log("[DemoGuard] role:", role);
    const whitelist = this.reflector.get<string[] | undefined>(
      "whitelist",
      context.getHandler(),
    );
    console.log("[DemoGuard] whitelist:", whitelist);
    if (typeof role === "string" && whitelist && !whitelist.includes(role)) {
      return false;
    }
    return true;
  }
}
```

```ts [demo/demo.controller.ts]
import {
  Controller,
  Get,
  Query,
  SetMetadata,
  UseGuards,
  Version,
} from "@nestjs/common";
import { DemoGuard } from "./demo.guard";

@Controller("demo")
@UseGuards(DemoGuard)
export class DemoController {
  // curl http://localhost:3000/demo?role=user
  @Get()
  @SetMetadata("whitelist", ["admin", "user"])
  testGuard(@Query() params: unknown) {
    return { params };
  }

  // curl http://localhost:3000/v2/demo?role=user
  @Get()
  @Version("2")
  testGuard2(@Query() params: unknown) {
    return { params };
  }
}
```

:::

## 自定义装饰器

::: code-group

```ts [whitelist/whitelist.decorator.ts]
import { SetMetadata } from "@nestjs/common";

export const Whitelist = (...args: string[]) => SetMetadata("whitelist", args);
```

```ts [request-url/request-url.decorator.ts]
// 自定义参数装饰器
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request as ExpressRequest } from "express";

export const RequestUrl = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    console.log("[RequestUrl] data:", data);
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    return request.url;
  },
);
```

```ts [demo/demo.controller.ts]
import { Controller, Get, Query, UseGuards, Version } from "@nestjs/common";
import { DemoGuard } from "./demo.guard";
import { Whitelist } from "src/whitelist/whitelist.decorator";
import { RequestUrl } from "src/request-url/request-url.decorator";

@Controller("demo")
@UseGuards(DemoGuard)
export class DemoController {
  // curl http://localhost:3000/demo?role=user
  @Get()
  // @SetMetadata('whitelist', ['admin', 'user']) // [!code --]
  @Whitelist("admin", "user") // [!code ++]
  testGuard(
    @Query() params: unknown,
    @RequestUrl()
    requestUrl: string,
  ) {
    return { params, requestUrl };
  }

  // curl http://localhost:3000/v2/demo?role=user
  @Get()
  @Version("2")
  testGuard2(
    @Query() params: unknown,
    // [RequestUrl] data: { method: 'GET', version: '2' }
    @RequestUrl({ method: "GET", version: "2" }) requestUrl: string,
  ) {
    return { params, requestUrl };
  }
}
```

:::

## 集成 swagger

```bash
pnpm add @nestjs/swagger swagger-ui-express
```

```ts
import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

export default function enableSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Nest.js")
    .setDescription("Demo")
    .setVersion("1")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);
}
```

## TypeORM

```bash
pnpm add @nestjs/typeorm typeorm mysql2
```

::: code-group

```yml [docker-compose.yml]
# docker-compose up -d # daemon
services:
  # docker-compose up -d mysql
  mysql:
    image: mysql:latest
    # command: --mysql-native-password=ON
    container_name: mysql
    hostname: mysql
    ports:
      - "3333:3306"
    privileged: true
    restart: on-failure
    environment:
      # MYSQL_NATIVE_PASSWORD: ON
      # MYSQL_ROOT_PASSWORD: pass
      MYSQL_DATABASE: db0
      MYSQL_USER: user
      MYSQL_PASSWORD: pass
      MYSQL_RANDOM_ROOT_PASSWORD: yes
      TZ: Asia/Shanghai
  # docker-compose down mysql -v
# docker-compose down -v # volume
```

```ts [app.module.ts]
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DemoModule } from "./demo/demo.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      username: "user",
      password: "pass",
      host: "localhost",
      port: 3333, // "3333:3306"
      database: "db0",
      // entities: [__dirname + '/**/*.entity{.ts,.js}'], // 加载实体
      autoLoadEntities: true, // 自动加载实体
      synchronize: true, // 自动将 @Entity() 实体类同步到数据库
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    DemoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```ts [demo/demo.module.ts]
import { Module } from "@nestjs/common";
import { DemoService } from "./demo.service";
import { DemoController } from "./demo.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Demo } from "./entities/demo.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Demo])],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
```

```ts [demo/demo.entity.ts]
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
} from "typeorm";

enum Gender {
  MALE = "male",
  FEMALE = "female",
}

@Entity()
export class Demo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  age: number;
  @Column({ type: "enum", enum: Gender, default: Gender.MALE })
  gender: Gender;
  @Column({
    type: "varchar",
    length: 255,
    name: "password", // 数据库列名
    nullable: true,
    select: false, // 查询实体时, select 语句中是否自动包含该字段
    comment: "password",
  })
  password: string;
  @Generated("uuid")
  uuid: string;
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
  // @Column({ type: 'enum', enum: ['male', 'female'], default: 'male' })
  // gender: 'male' | 'female';
  @Column("simple-array")
  techs: string[]; // 使用 techs.join(',') 存储
  @Column("simple-json")
  p: { name: string; age: number }; // 使用 JSON.stringify(p) 存储
}
```

:::
