import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";


let createUserUsecase: CreateUserUseCase
let authenticateUserUsecase: AuthenticateUserUseCase
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Show User Profile With Token', () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
        inMemoryUsersRepository,
        inMemoryStatementRepository,
    );
  });

  it.only('should be able to create deposit statement', async () => {

    const user: ICreateUserDTO = {
        email:'emailteste@teste.com',
        name: 'teste',
        password: '54321'
    }

      const userCreate = await createUserUsecase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

    const createStatement:ICreateStatementDTO = {
      user_id: userCreate.id as string,
      description: 'description Test',
      amount: 1652,
      type: OperationType.DEPOSIT,

    };

    const statementCreated = await createStatementUseCase.execute({user_id: createStatement.user_id, amount: createStatement.amount, description: createStatement.description, type: createStatement.type})

    // const authenticatioinOk = await authenticateUserUsecase.execute({email: user.email, password: user.password })

    expect(statementCreated).toHaveProperty('id')
    expect(statementCreated).toHaveProperty('created_at')
    expect(statementCreated.user_id).toBe(userCreate.id)
  });  
//   it('should be able to show a profile user not exists', async () => {
//     expect(async ()=>{const user:ICreateUserDTO = {
//       name: 'User Name Test',
//       email: 'User Email Test',
//       password: '12312',

//     };
//     await createUserUsecase.execute({
//       name: user.name,
//       email: user.email,
//       password: user.password
//     });

//     await authenticateUserUsecase.execute({email: user.email, password: user.password })

//     await showUserProfileUseCase.execute('idDeExemplo')}).rejects.toBeInstanceOf(ShowUserProfileError)
    
//   });
});


