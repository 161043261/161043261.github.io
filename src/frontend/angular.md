---
title: Angular
description: Angular
---

# Angular

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
      alert("Warning: username or password is empty");
    } else {
      alert(`${username}, ${password}`);
    }
    target.reset();
  }

  handleFirstName(e: Event) {
    this.firstName = (e.target as HTMLInputElement).value;
  }

  handleLastName(e: Event) {
    this.lastName = (e.target as HTMLInputElement).value;
  }

  handleFullName(e: Event) {
    e.preventDefault();
    if (!this.firstName || !this.lastName) {
      alert("Warning: firstName or lastName is empty");
    } else {
      alert(`${this.firstName}, ${this.lastName}`);
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
// Step 1
import { FormsModule } from "@angular/forms";

@Component({
  // Step 1
  imports: [FormsModule],
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
      alert("Warning: firstName or lastName is empty");
    } else {
      alert(`${this.firstName}, ${this.lastName}`);
    }
    this.firstName = "";
    this.lastName = "";
  }
}
```

```html [app/app.html]
<form (submit)="handleFullName($event)">
  <label for="app-firstName">firstName</label>
  <!-- Step 2 -->
  <input
    type="text"
    id="app-firstName"
    name="app-firstName"
    [(ngModel)]="firstName"
  />
  <br />
  <label for="app-lastName">lastName</label>
  <!-- Step 2 -->
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

以下 snippet 存在不必要的重复渲染

::: code-group

```ts [app/app.ts]
import { Component } from "@angular/core";
// Step 1
import { FormsModule } from "@angular/forms";

@Component({
  // Step 1
  imports: [FormsModule],
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  firstName = "";
  lastName = "";

  isValid(name: string) {
    const len = name.trim().length;
    return len >= 4 && len <= 16 ? "" : "error";
  }

  handleFullName(e: Event) {
    e.preventDefault();
    if (!this.firstName || !this.lastName) {
      alert("Warning: firstName or lastName is empty");
    } else {
      alert(`${this.firstName}, ${this.lastName}`);
    }
    this.firstName = "";
    this.lastName = "";
  }
}
```

```html [app/app.html]
<form (submit)="handleFullName($event)">
  <label for="app-firstName">firstName</label>
  <!-- Step 2 -->
  <input
    type="text"
    id="app-firstName"
    name="app-firstName"
    [(ngModel)]="firstName"
    [class]="isValid(firstName)"
  />
  <br />
  <label for="app-lastName">lastName</label>
  <!-- Step 2 -->
  <input
    type="text"
    id="app-lastName"
    name="app-lastName"
    [(ngModel)]="lastName"
    [class]="isValid(lastName)"
  />
  <button type="submit">fullName</button>
</form>
```

```css [app/app.css]
input.error {
  border: 3px solid slateblue;
  border-radius: 3px;
}
```

:::

使用 Signal 优化

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

  isValid(name: string) {
    const len = name.trim().length;
    debugger;
    return len >= 4 && len <= 16 ? "" : "error";
  }

  handleFullName(e: Event) {
    e.preventDefault();
    if (!this.firstName() || !this.lastName()) {
      alert("Warning: firstName or lastName is empty");
    } else {
      alert(`${this.firstName()}, ${this.lastName()}`);
    }
    this.firstName.set("");
    this.lastName.update((oldVal) => "");
  }
}
```

```html{8,17,19} [app/app.html]
<form (submit)="handleFullName($event)">
  <label for="app-firstName">firstName</label>
  <input
    type="text"
    id="app-firstName"
    name="app-firstName"
    [(ngModel)]="firstName"
    [class]="isValid(firstName())"
  />
  <br />
  <label for="app-lastName">lastName</label>
  <input
    type="text"
    id="app-lastName"
    name="app-lastName"
    [(ngModel)]="lastName"
    [class]="isValid(lastName())"
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

## @if, @else if, @else, @for

::: code-group

```ts
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
    { id: 0, title: "React19", done: true },
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
}
```

```html [app/app.html]
<!-- <ul>
  @for (todo of todoList(); track idx; let idx = $index) {
  <li>{{ idx }}. {{ todo.title }}</li>
  }
  @for (todo of todoList(); track $index) {
  <li>{{ $index }}. {{ todo.title }}</li>
  }
</ul> -->

<ul>
  @for (todo of todoList(); track todo.id) {
  <li>
    {{ todo.id }}. {{ todo.title }}
    <button type="button" (click)="handleClickDelete(todo.id)">Delete</button>
  </li>
  }
</ul>

<label for="app-title">title</label>
<input id="app-title" type="text" [(ngModel)]="inputText" />
<button type="button" (click)="handleClickAdd()">Add</button>
```

:::
