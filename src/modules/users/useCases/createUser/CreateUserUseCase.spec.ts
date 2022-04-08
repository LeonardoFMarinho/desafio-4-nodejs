import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUsecase: CreateUserUseCase;
let inMemoryUsersRepository: IUsersRepository;

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUsecase = new CreateUserUseCase(
        inMemoryUsersRepository,
    );
  });

  it('should be able to create a new user', async () => {
    const user = {
      name: 'User Name Test',
      email: 'User Email Test',
      password: '12312',

    };
    const createUser = await createUserUsecase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(
      user.email,
    );
    expect(userCreated?.email).toBe('User Email Test');
  });
  it('should not be able to create a new user with same name', async () => {
    expect(async() => {
    const user = {
      name: 'User Name Test',
      email: 'User Email Test',
      password: '12312',

    };
    await createUserUsecase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    await createUserUsecase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });
  

    }).rejects.toBeInstanceOf(CreateUserError)

  });
});


