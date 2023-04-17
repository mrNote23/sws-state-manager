# State manager

## Managing states with a class `State()`

### **`Class State()`**

- `store(varName: string, value: any)` - saving an object (variable) without notifying subscribers
- `extract(varName: string): any` - object extraction
- `subscribe(VarNane: string, (val:any) => void): TSubscriber` - object change subscription
- `unsubscribe(subs: TSubscriber)` - unsubscribe
- `dispatch(varName: string, value: any)` - object change with notification of subscribers
- `clear()` - deleting all objects and subscribers

[Usage example](https://stackblitz.com/edit/sws-state-manager?file=index.ts)

```HTML
<!--index.html-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
    <p>Counter: <span id="counter"></span></p>
    <button id="btn-reset">Reset counter</button>
    <script src="./index.ts" type="module"></script>
  </body>
</html>
```

```typescript
// index.ts
import { State } from "sws-state-manager"

const myState = new State()

const appDiv: HTMLElement = document.getElementById("app")
const appCounter: HTMLElement = document.getElementById("counter")
const appButton: HTMLElement = document.getElementById("btn-reset")

appDiv.innerHTML = `<h1>State manager demo</h1>`

appButton.addEventListener("click", () => {
  myState.dispatch("counter", 0)
})

const showCounter = (value) => {
  appCounter.textContent = value
}

myState.store("counter", 0)
myState.subscribe("counter", showCounter)

setInterval(() => {
  myState.dispatch("counter", myState.extract("counter") + 1)
}, 1000)
```
