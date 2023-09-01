## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Issue

#### 1. entity 를 validation 하는것

```ts
...
import { User } from '../user/user.entity';
...

register(@Body() user: Partial<User>) {
  return this.authService.register(user);
}
```

`Partial<User>` 타입을 사용하여 객체의 일부분만 필요한 경우에는 해당 부분만 전달할 수 있어 편리하지만, <br/>
이로 인해 class-validator의 검증이 동작하지 않을 수 있습니다<br/>
class-validator는 실제로 class 인스턴스에 직접 작동하는 데 의존하며, <br/>
`Partial<User>` 와 같이 부분적으로 정의된 객체는 class 인스턴스가 아니므로 검증이 작동하지 않을 수 있습니다.

#### 1. entity 를 validation 하는것

## License

Nest is [MIT licensed](LICENSE).
