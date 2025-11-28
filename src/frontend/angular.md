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
import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  imports: [FormsModule],
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  // firstName = ''; // [!code --]
  firstName = signal<string>(""); // [!code ++]
  // lastName = ''; // [!code --]
  lastName = signal<string>(""); // [!code ++]

  isValid(name: string) {
    const len = name.trim().length;
    debugger;
    return len >= 4 && len <= 16 ? "" : "error";
  }

  handleFullName(e: Event) {
    e.preventDefault();
    if (!this.firstName || !this.lastName) {
      alert("Warning: firstName or lastName is empty");
    } else {
      alert(`${this.firstName}, ${this.lastName}`);
    }
    // this.firstName = ''; // [!code --]
    this.firstName.set(""); // [!code ++]
    // this.lastName = ''; // [!code --]
    this.lastName.update((oldVal) => ""); // [!code ++]
  }
}
```

```html{8,17} [app/app.html]
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
  <button type="submit">fullName</button>
</form>
```

:::
