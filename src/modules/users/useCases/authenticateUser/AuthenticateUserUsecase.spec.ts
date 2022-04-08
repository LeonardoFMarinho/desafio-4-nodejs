import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "../createUser/CreateUserError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let authenticateUserUsecase: AuthenticateUserUseCase
let createUserUsecase: CreateUserUseCase;
let inMemoryUsersRepository: IUsersRepository;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUsecase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUsecase = new CreateUserUseCase(
        inMemoryUsersRepository,
    );
  });

  it('should be able to authenticate a user exists', async () => {
    const user:ICreateUserDTO = {
      name: 'User Name Test',
      email: 'User Email Test',
      password: '12312',

    };
    await createUserUsecase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    const authenticatioinOk = await authenticateUserUsecase.execute({email: user.email, password: user.password })
    expect(authenticatioinOk.token).toBeTruthy()
    expect(authenticatioinOk).toHaveProperty('token')
    expect(authenticatioinOk.user).toHaveProperty('name')
  });
  it('should not be able to authenticate an non extistent user', () => {
    expect(async () => {
      await authenticateUserUsecase.execute({
        email: 'false@email.com',
        password: '1234',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('should be not be able to authenticate with incorrect password', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: 'user@user.com',
        password: '1234',
        name: 'user Test Error',
      };
      await createUserUsecase.execute(user);
      await authenticateUserUsecase.execute({
        email: user.email,
        password: 'incorrect password',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});


