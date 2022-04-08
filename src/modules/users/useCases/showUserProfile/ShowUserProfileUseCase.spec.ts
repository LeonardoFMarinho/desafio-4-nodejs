import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserError } from "../createUser/CreateUserError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let authenticateUserUsecase: AuthenticateUserUseCase
let createUserUsecase: CreateUserUseCase;
let inMemoryUsersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase

describe('Show User Profile With Token', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUsecase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUsecase = new CreateUserUseCase(
        inMemoryUsersRepository,
    );
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  });

  it('should be able to show a profile user with token', async () => {
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

    const showProfile = await showUserProfileUseCase.execute(authenticatioinOk.user.id as string)
    console.log(showProfile)
    expect(authenticatioinOk.token).toBeTruthy()
    expect(authenticatioinOk).toHaveProperty('token')
    expect(authenticatioinOk.user).toHaveProperty('name')
  });  
  it('should be able to show a profile user not exists', async () => {
    expect(async ()=>{const user:ICreateUserDTO = {
      name: 'User Name Test',
      email: 'User Email Test',
      password: '12312',

    };
    await createUserUsecase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    await authenticateUserUsecase.execute({email: user.email, password: user.password })

    await showUserProfileUseCase.execute('idDeExemplo')}).rejects.toBeInstanceOf(ShowUserProfileError)
    
  });
});


