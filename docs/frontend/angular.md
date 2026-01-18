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

```ts
import { Component, signal } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <h1>Hello, Angular!</h1>
    <label>
      label
      <input type="text" (input)="handleInputText($event)" />
    </label>
    <p>{{ inputText() }}</p>

    <form (submit)="handleSubmit($event)">
      <label>
        username
        <input type="text" name="username" />
      </label>

      <label>
        password
        <input type="password" name="password" />
      </label>

      <button type="submit">submit</button>
    </form>

    <form (submit)="handleFullName($event)">
      <label>
        firstName
        <input
          type="text"
          [value]="firstName()"
          (input)="handleFirstName($event)"
        />
      </label>

      <label>
        lastName
        <input
          type="text"
          [value]="lastName()"
          (input)="handleLastName($event)"
        />
      </label>

      <button type="submit">fullName</button>
    </form>
  `,
})
export class App {
  inputText = signal("");
  firstName = signal("");
  lastName = signal("");

  handleInputText(e: Event) {
    this.inputText.set((e.target as HTMLInputElement).value);
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
    this.firstName.set((e.target as HTMLInputElement).value);
  }

  handleLastName(e: Event) {
    this.lastName.set((e.target as HTMLInputElement).value);
  }

  handleFullName(e: Event) {
    e.preventDefault();
    if (!this.firstName() || !this.lastName()) {
      alert("firstName or lastName is empty");
    } else {
      alert(`${this.firstName()} ${this.lastName()}`);
    }
    this.firstName.set("");
    this.lastName.set("");
  }
}
```

## 双向绑定 `[(ngModel)]`

```ts
import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms"; // [!code ++]

@Component({
  imports: [FormsModule], // [!code ++]
  selector: "app-root",
  template: `
    <form (submit)="handleFullName($event)">
      <label>
        firstName
        <input type="text" name="firstName" [(ngModel)]="firstName" />
      </label>

      <label>
        lastName
        <input type="text" name="lastName" [(ngModel)]="lastName" />
      </label>
      <button type="submit">fullName</button>
    </form>
  `,
})
export class App {
  firstName = signal("");
  lastName = signal("");

  handleFullName(e: Event) {
    e.preventDefault();
    if (!this.firstName() || !this.lastName()) {
      alert("firstName or lastName is empty");
    } else {
      alert(`${this.firstName()} ${this.lastName()}`);
    }
    this.firstName.set("");
    this.lastName.set("");
  }
}
```

## Signal

```ts
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
  template: `
    <form (submit)="handleFullName($event)">
      <label>
        firstName
        <input
          type="text"
          name="firstName"
          [(ngModel)]="firstName"
          [class]="getInputClassName(firstName())"
        />
      </label>

      <label>
        lastName
        <input
          type="text"
          name="lastName"
          [(ngModel)]="lastName"
          [class]="getInputClassName(lastName())"
        />
      </label>

      <button type="submit">fullName {{ fullName() }}</button>
    </form>
  `,
  styles: `
    input.error {
      border: 0.1rem solid red;
      border-radius: 0.3rem;
    }
  `,
})
export class App {
  firstName: WritableSignal<string> = signal<string>("");
  lastName: WritableSignal<string> = signal<string>("");
  fullName: Signal<string> = computed(
    () => `${this.firstName()} ${this.lastName()}`,
  ); // [!code ++]

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
    this.lastName.update((_oldVal) => "");
  }
}
```

## @if, @else if, @else

- @if, @else if, @else
- @for, @empty
- @switch, @case, @default

::: code-group

```ts [app/app.ts]
import { Component, signal } from "@angular/core";
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
  // styleUrls: ["./app.css"],
})
export class App {
  inputText = signal<string>("");
  todoList = signal<ITodoItem[]>([]);
  currentId = signal<number>(0);
  handleClickAdd() {
    this.todoList.update((list) => {
      return [
        ...list,
        { id: this.currentId(), title: this.inputText(), done: false },
      ];
    });
    this.currentId.update((id) => id + 1);
    this.inputText.set("");
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
  @if (todoList().length) { @for (todo of todoList(); track todo.id) {
  <li [class]="todo.done ? 'done-text' : ''">
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
  <li [class]="todo.done ? 'done-text' : ''">
    {{ todo.id }}. {{ todo.title }}
    <button type="button" (click)="handleClickDone(todo.id)">
      @if (todo.done) { Undo } @else { Done }
    </button>
    <button type="button" (click)="handleClickDelete(todo.id)">Delete</button>
  </li>
  } @empty { Todo list is empty }
</ul>

<label>
  title
  <input type="text" [(ngModel)]="inputText" />
</label>

<button type="button" (click)="handleClickAdd()">Add</button>
```

```css [app/app.css]
.done-text {
  text-decoration: line-through;
}
```

:::

## 组件, input/output

- input: 类似 Vue3 defineProps
- output: 类似 Vue3 defineEmits

```bash
# ng g c bg-green
ng generate component bg-green
```

::: code-group

```ts{25-27,30-34} [app/bg-green/bg-green.ts]
import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from "@angular/core";

@Component({
  selector: "app-bg-green",
  template: `
    <label>
      Is background green?
      <input
        type="checkbox"
        [checked]="bgGreen()"
        (change)="handleBgGreenChange($event)"
      />
    </label>
  `,
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

```ts{18,20-23} [app/app.ts]
import { Component, signal } from '@angular/core';
import { BgGreen } from './bg-green/bg-green';

@Component({
  imports: [BgGreen],
  selector: 'app-root',
  template: `
    <app-bg-green
      [bg-green]="bgGreen()"
      (on-bg-green-change)="handleBgGreenChange($event)"
    />
  `,
  styles: `
    .bg-green {
      background: hsl(117, 50%, 50%, 50%);
    }
  `,
})
export class App {
  bgGreen = signal<boolean>(false);

  handleBgGreenChange(value: { bgGreen: boolean }) {
    const { bgGreen: newBgGreen } = value;
    this.bgGreen.set(newBgGreen);
  }
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
  template: `
    <label>
      <ng-content />
      <!-- <input
              type="checkbox"
              [checked]="bgGreen()"
              (change)="handleBgGreenChange($event)" /> -->
      <input type="checkbox" [(ngModel)]="bgGreen" />
    </label>
  `,
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
  styles: `
    .bg-green {
      background: hsl(117, 50%, 50%, 50%);
    }
  `,
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
  selector: "app-root",
  template: `
    <h1>App</h1>
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
    </button>
  `,
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
      this.errorMessage.set(String(err));
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
      res.writeHead(200);
      res.end(JSON.stringify({ message: new Date().toLocaleString() }));
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
import { provideHttpClient, withFetch } from "@angular/common/http"; // [!code ++]

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
  selector: "app-root",
  template: `
    <h1>App</h1>
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
    </button>
  `,
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

```bash
# ng g s service --type=service
ng generate service message --type=service
```

::: code-group

```ts [app/message.service.ts]
import { inject, signal, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, catchError, of, finalize } from "rxjs";

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
        if (newMessage) {
          this.currentMessage.set(newMessage);
          this.errorMessage.set("");
        }
      });
  }
}
```

```ts [app/app.ts]
import { Component, inject, OnInit } from "@angular/core";
import { MessageService } from "./message.service";

@Component({
  selector: "app-root",
  template: `
    <h1>App</h1>
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
    </button>
  `,
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
