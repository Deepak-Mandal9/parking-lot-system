# Date Arithmetic in TypeScript

The one rule for date arithmetic in TypeScript is to use `.getTime()`.

```ts
// Always use .getTime() — gives milliseconds since epoch
const ms = exitTime.getTime() - entryTime.getTime()
const hours = Math.ceil(ms / (1000 * 60 * 60)) // ms → hours
```
