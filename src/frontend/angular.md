# Angular

## cli

```bash
pnpm install -g @angular/cli

ng new <project-name> --package-manager pnpm

# ng g c <component-name>
ng generate component <component-name>
# ng g s <service-name> --type=service
ng generate service <service-name> --type=service
```

## 属性 `[props]`, 事件 `(event)`

::: code-group

```ts [app/app.ts]
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  inputText = "";
  firstName = "";
  lastName = "";

  handleInputText(e: Event) {
    this.inputText = (e.target as HTMLInputElement).value;
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    if (!username || !password) {
      alert("username or password is empty");
    } else {
      alert(`${username} ${password}`);
    }
    target.reset();
  }

  handleFirstName(e: Event) {
    this.firstName = (e.target as HTMLFormElement).value;
  }

  handleLastName(e: Event) {
    this.lastName = (e.target as HTMLFormElement).value;
  }

  handleFullName(e: Event) {
    e.preventDefault();
    if (!this.firstName || !this.lastName) {
      alert("firstName or lastName is empty");
    } else {
      alert(`${this.firstName} ${this.lastName}`);
    }
    this.firstName = "";
    this.lastName = "";
  }
}
```

```html [app/app.html]
<h1>Hello, Angular!</h1>
<label for="app-input-text">label</label>
<input type="text" id="app-input-text" (input)="handleInputText($event)" />
<p>{{ inputText }}</p>

<form (submit)="handleSubmit($event)">
  <label for="app-username">username</label>
  <input type="text" id="app-username" />
  <br />
  <label for="app-password">password</label>
  <input type="password" id="app-password" />
  <button type="submit">submit</button>
</form>

<form (submit)="handleFullName($event)">
  <label for="app-firstName">firstName</label>
  <input
    type="text"
    id="app-firstName"
    [value]="firstName"
    (input)="handleFirstName($event)"
  />
  <br />
  <label for="app-lastName">lastName</label>
  <input
    type="text"
    id="app-lastName"
    [value]="lastName"
    (input)="handleLastName($event)"
  />
  <button type="submit">fullName</button>
</form>
```

:::

## 双向绑定 `[(ngModel)]`

- Step 1 `import { FormsModule } from '@angular/forms';`
- Step 2 `[(ngModel)]="state"`

::: code-group

```ts [app/app.ts]
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms"; // [!code ++]

@Component({
  imports: [FormsModule], // [!code ++]
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  firstName = "";
  lastName = "";

  handleFullName(e: Event) {
    e.preventDefault();
    if (!this.firstName || !this.lastName) {
      alert("firstName or lastName is empty");
    } else {
      alert(`${this.firstName} ${this.lastName}`);
    }
    this.firstName = "";
    this.lastName = "";
  }
}
```

```html{7,15} [app/app.html]
<form (submit)="handleFullName($event)">
  <label for="app-firstName">firstName</label>
  <input
    type="text"
    id="app-firstName"
    name="app-firstName"
    [(ngModel)]="firstName"
  />
  <br />
  <label for="app-lastName">lastName</label>
  <input
    type="text"
    id="app-lastName"
    name="app-lastName"
    [(ngModel)]="lastName"
  />
  <button type="submit">fullName</button>
</form>
```

:::

## Signal

避免不必要的重复渲染

::: code-group

```ts [app/app.ts]
import {
  Component,
  computed,
  Signal,
  signal,
  WritableSignal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  imports: [FormsModule],
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  // firstName = ''; // [!code --]
  firstName: WritableSignal<string> = signal<string>(""); // [!code ++]
  // lastName = ''; // [!code --]
  lastName: WritableSignal<string> = signal<string>(""); // [!code ++]
  fullName: Signal<string> = computed(
    () => `${this.firstName()} ${this.lastName()}`,
  );

  getInputClassName(name: string) {
    const len = name.trim().length;
    return len >= 4 && len <= 16 ? "" : "error";
  }

  handleFullName(e: Event) {
    e.preventDefault();
    if (!this.firstName() || !this.lastName()) {
      alert("firstName or lastName is empty");
    } else {
      alert(`${this.firstName()} ${this.lastName()}`);
    }
    this.firstName.set("");
    this.lastName.update((oldVal) => "");
  }
}
```

```html [app/app.html]
<form (submit)="handleFullName($event)">
  <label for="app-firstName">firstName</label>
  <input
    type="text"
    id="app-firstName"
    name="app-firstName"
    [(ngModel)]="firstName"
    [class]="getInputClassName(firstName())"
  />
  <br />
  <label for="app-lastName">lastName</label>
  <input
    type="text"
    id="app-lastName"
    name="app-lastName"
    [(ngModel)]="lastName"
    [class]="getInputClassName(lastName())"
  />
  <button type="submit">fullName {{ fullName() }}</button>
</form>
```

```css [app/app.css]
input.error {
  border: 3px solid slateblue;
  border-radius: 3px;
}
```

:::

## `@if`, `@else if`, `@else`, ...

- `@if`, `@else if`, `@else`
- `@for`, `@empty`
- `@switch`, `@case`, `@default`

::: code-group

```ts [app/app.ts]
import { Component, signal, WritableSignal } from "@angular/core";
import { FormsModule } from "@angular/forms";

interface ITodoItem {
  id: number;
  title: string;
  done: boolean;
}

@Component({
  imports: [FormsModule],
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  inputText: WritableSignal<string> = signal<string>("");
  todoList: WritableSignal<ITodoItem[]> = signal<ITodoItem[]>([
    { id: 0, title: "React", done: true },
    { id: 1, title: "Vue3", done: true },
    { id: 2, title: "Angular", done: false },
  ]);
  handleClickAdd() {
    this.todoList.update((list) => {
      return [
        ...list,
        { id: list.length, title: this.inputText(), done: false },
      ];
    });
  }
  handleClickDelete(id: number) {
    this.todoList.update((list) => list.filter((item) => item.id !== id));
  }
  handleClickDone(id: number) {
    this.todoList.update((list) =>
      list.map((item) => {
        if (item.id === id) {
          item.done = !item.done;
        }
        return item;
      }),
    );
  }
}
```

```html [app/app.html]
<ul>
  <!-- @if (todoList().length) { @for (todo of todoList(); track id; let id = todo.id) { -->
  @if (todoList().length) { @for (todo of todoList(); track todo.id) {
  <li [class]="todo.done ? 'deleted-text' : ''">
    {{ todo.id }}. {{ todo.title }}
    <button type="button" (click)="handleClickDone(todo.id)">
      @if (todo.done) { Undo } @else { Done }
    </button>
    <button type="button" (click)="handleClickDelete(todo.id)">Delete</button>
  </li>
  }} @else { Todo list is empty }
</ul>

<ul>
  @for (todo of todoList(); track todo.id) {
  <li [class]="todo.done ? 'deleted-text' : ''">
    {{ todo.id }}. {{ todo.title }}
    <button type="button" (click)="handleClickDone(todo.id)">
      @if (todo.done) { Undo } @else { Done }
    </button>
    <button type="button" (click)="handleClickDelete(todo.id)">Delete</button>
  </li>
  } @empty { Todo list is empty }
</ul>

<label for="app-title">title</label>
<input id="app-title" type="text" [(ngModel)]="inputText" />
<button type="button" (click)="handleClickAdd()">Add</button>
```

:::

## 组件, input/output

- input: 类似 Vue3 defineProps
- output: 类似 Vue3 defineEmits

::: code-group

```ts{26-28,31-35} [app/bg-green/bg-green.ts]
import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from "@angular/core";

@Component({
  selector: "app-bg-green",
  template: `<label>
    <span>Is background green?</span>
    <input
      id="app-checkbox"
      type="checkbox"
      [checked]="bgGreen()"
      (change)="handleBgGreenChange($event)"
    />
  </label>`,
})
export class BgGreen {
  // input: 类似 Vue3 defineProps
  // bgGreen = input<boolean>(false /** initialValue */, {
  //   alias: 'bg-green', // opts
  // }); //! readonly
  bgGreen: InputSignal<boolean> = input.required<boolean>({
    alias: "bg-green", // opts
  }); //! readonly

  // output: 类似 Vue3 defineEmits
  onBgGreenToggle: OutputEmitterRef<{
    bgGreen: boolean;
  }> = output<{ bgGreen: boolean }>({
    alias: "on-bg-green-change", // opts
  });

  handleBgGreenChange(e: Event) {
    const newValue = (e.target as HTMLInputElement).checked;
    this.onBgGreenToggle.emit({
      bgGreen: newValue,
    });
  }
}
```

```html [app/app.html]
<app-bg-green
  [bg-green]="bgGreen()"
  (on-bg-green-change)="handleBgGreenChange($event)"
/>
```

```ts{11,13-16} [app/app.ts]
import { Component, signal } from "@angular/core";
import { BgGreen } from './bg-green/bg-green';

@Component({
  imports: [BgGreen],
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  bgGreen = signal<boolean>(false);

  handleBgGreenChange(value: { bgGreen: boolean }) {
    const { bgGreen: newValue } = value;
    this.bgGreen.set(newValue);
  }
}
```

```css [app/app.css]
.bg-green {
  background: hsl(117, 50%, 50%, 50%);
}
```

:::

## 双向绑定 model

::: code-group

```ts{7,14} [app/bg-green/bg-green.ts]
import { Component, model, ModelSignal } from "@angular/core";
import { FormsModule } from '@angular/forms';

@Component({
  selector: "app-bg-green",
  template: `<label>
    <ng-content />
    <!-- <input
      id="app-checkbox"
      type="checkbox"
      [checked]="bgGreen()"
      (change)="handleBgGreenChange($event)"
    /> -->
    <input id="app-checkbox" type="checkbox" [(ngModel)]="bgGreen" />
  </label>`,
  imports: [FormsModule],
})
export class BgGreen {
  // bgGreen: InputSignal<boolean> = input.required<boolean>({ // [!code --]
  //   alias: "bg-green", // opts // [!code --]
  // }); //! readonly // [!code --]

  // bgGreen = model<boolean>(false /** initialValue */, {
  //   alias: 'bg-green',  // opts
  // });
  bgGreen: ModelSignal<boolean> = model.required<boolean>({ // [!code ++]
    alias: "bg-green", // opts // [!code ++]
  }); // [!code ++]

  handleBgGreenChange(e: Event) {
    const newValue = (e.target as HTMLInputElement).checked;
    this.bgGreen.set(newValue);
    // this.bgGreen.update((oldValue) => !oldValue);
  }
}
```

```ts [app/app.ts]
import { Component, computed, signal } from "@angular/core";
import { BgGreen } from "./bg-green/bg-green";

@Component({
  imports: [BgGreen],
  selector: "app-root",
  template: `
    <app-bg-green [(bg-green)]="parentBgGreen">
      <span>Is background green?</span>
    </app-bg-green>
  `,
  styleUrl: "./app.css",
})
export class App {
  parentBgGreen = signal<boolean>(false);
}
```

:::

## 插槽 `<ng-content />`

类似 Vue3 的 slot, React 的 children

## 生命周期

| Vue3 (Composition API) | Angular                   |
| ---------------------- | ------------------------- |
| setup()                | constructor(), ngOnInit() |
| onBeforeMount()        | ngOnInit()                |
| onMounted()            | ngAfterViewInit()         |
| onBeforeUpdate()       |                           |
| onUpdated()            | ngAfterViewChecked()      |
| onBeforeUnmount()      | ngOnDestroy()             |
| onUnmounted()          | ngOnDestroy()             |
| onErrorCaptured()      | --                        |
| watch(), watchEffect() | ngOnChanges()             |

```ts
import { Component, OnInit, signal } from "@angular/core";

const getMessage = (): Promise<{ message: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve({ message: new Date().toLocaleString() });
      } else {
        reject("Failed to get message");
      }
    }, 3000);
  });
};

@Component({
  selector: "message-app",
  template: `<h1>Message App</h1>
    @if (isLoading()) {
      <p>Loading...</p>
    } @else {
      @if (currentMessage().length) {
        <p>{{ currentMessage() }}</p>
      } @else if (errorMessage().length) {
        <p>{{ errorMessage() }}</p>
      } @else {
        <p>No message</p>
      }
    }
    <button type="button" (click)="handleGetMessage()" [disabled]="isLoading()">
      Click to get message
    </button> `,
})
export class App implements OnInit {
  ngOnInit() {
    this.handleGetMessage();
  }
  currentMessage = signal<string>("");
  errorMessage = signal<string>("");
  isLoading = signal(false);

  async handleGetMessage() {
    try {
      this.isLoading.set(true);
      const res = await getMessage();
      this.currentMessage.set(res.message);
      this.errorMessage.set("");
    } catch (err) {
      this.currentMessage.set("");
      this.errorMessage.set(JSON.stringify(err));
    } finally {
      this.isLoading.set(false);
    }
  }
}
```

## HTTPClient

::: code-group

```ts [main.ts]
import { createServer, IncomingMessage, ServerResponse } from "http";

interface Message {
  message: string;
}

function middlewareCORS(
  handler: (req: IncomingMessage, res: ServerResponse) => void,
): (req: IncomingMessage, res: ServerResponse) => void {
  return (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS",
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }
    handler(req, res);
  };
}

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.url === "/api/v1/message") {
    const handler = middlewareCORS((_req, res) => {
      res.setHeader("Content-Type", "application/json");
      const message: Message = { message: "Hello, TypeScript!" };
      res.writeHead(200);
      res.end(JSON.stringify(message));
    });
    handler(req, res);
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("http://localhost:3000");
});
```

```ts [app/app.config.ts]
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter, Routes } from "@angular/router";

import { provideHttpClient, withFetch } from "@angular/common/http";

const routes: Routes = [];
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()), // [!code ++]
  ],
};
```

```ts [app/app.ts]
import { Component, inject, OnInit, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";

interface IResponse {
  message: string;
}

@Component({
  selector: "message-app",
  template: `<h1>Message App</h1>
    @if (isLoading()) {
      <p>Loading...</p>
    } @else {
      @if (currentMessage().length) {
        <p>{{ currentMessage() }}</p>
      } @else if (errorMessage().length) {
        <p>{{ errorMessage() }}</p>
      } @else {
        <p>No message</p>
      }
    }
    <button type="button" (click)="handleGetMessage()" [disabled]="isLoading()">
      Click to get message
    </button> `,
  styles: ``,
})
export class App implements OnInit {
  http = inject(HttpClient); // [!code ++]
  ngOnInit() {
    this.handleGetMessage();
  }
  currentMessage = signal<string>("");
  errorMessage = signal<string>("");
  isLoading = signal(false);

  async handleGetMessage() {
    this.http
      .get<IResponse>("http://localhost:3000/api/v1/message", {
        timeout: 3000,
      })
      .subscribe({
        next: (res) => {
          this.currentMessage.set(res.message);
          this.errorMessage.set("");
        },
        error: (err) => {
          this.currentMessage.set("");
          this.errorMessage.set(JSON.stringify(err));
        },
      });
  }
}
```

:::

## Service

::: code-group

```ts [app/message.service.ts]
import { inject, signal, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

interface IResponse {
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private http = inject(HttpClient);

  currentMessage = signal<string>("");
  errorMessage = signal<string>("");
  isLoading = signal(false);

  async getMessage() {
    this.isLoading.set(true);
    this.http
      .get<IResponse>("http://localhost:3000/api/v1/message", {
        timeout: 3000,
      })
      // .subscribe((res) => {
      //   this.currentMessage.set(res.message);
      //   this.errorMessage.set('');
      // });

      // .subscribe({
      //   next: (res) => {
      //     this.currentMessage.set(res.message);
      //     this.errorMessage.set('');
      //   },
      //   error: (err) => {
      //     this.currentMessage.set('');
      //     this.errorMessage.set(JSON.stringify(err));
      //   },
      // });

      .pipe(
        map((res) => res.message),
        catchError((err) => {
          this.errorMessage.set(JSON.stringify(err));
          return of("" /** newMessage */);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((newMessage) => {
        this.currentMessage.set(newMessage);
        this.errorMessage.set("");
      });
  }
}
```

```ts [app/app.ts]
import { Component, inject, OnInit, signal } from "@angular/core";
import { MessageService } from "./message.service";

@Component({
  selector: "message-app",
  template: `<h1>Message App</h1>
    @if (isLoading()) {
      <p>Loading...</p>
    } @else {
      @if (currentMessage().length) {
        <p>{{ currentMessage() }}</p>
      } @else if (errorMessage().length) {
        <p>{{ errorMessage() }}</p>
      } @else {
        <p>No message</p>
      }
    }
    <button type="button" (click)="handleGetMessage()" [disabled]="isLoading()">
      Click to get message
    </button> `,
  styles: ``,
})
export class App implements OnInit {
  messageService = inject(MessageService);
  currentMessage = this.messageService.currentMessage;
  errorMessage = this.messageService.errorMessage;
  isLoading = this.messageService.isLoading;

  handleGetMessage() {
    this.messageService.getMessage();
  }

  ngOnInit() {
    this.messageService.getMessage();
  }
}
```

:::
