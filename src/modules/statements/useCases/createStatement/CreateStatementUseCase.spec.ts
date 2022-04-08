import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";


let createUserUsecase: CreateUserUseCase
let authenticateUserUsecase: AuthenticateUserUseCase
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create Statement UseCase', () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUsecase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(
        inMemoryUsersRepository,
        inMemoryStatementRepository,
    );
  });

  it('should be able to create deposit statement', async () => {

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
      description: 'deposit',
      amount: 1652,
      type: OperationType.DEPOSIT,

    };
    const statementCreated = await createStatementUseCase.execute({user_id: createStatement.user_id, amount: createStatement.amount, description: createStatement.description, type: createStatement.type})

    // const authenticatioinOk = await authenticateUserUsecase.execute({email: user.email, password: user.password })
    expect(statementCreated).toHaveProperty('id')
    expect(statementCreated.user_id).toBe(userCreate.id)
  });  
  it('should be able to create withdraw statement', async () => {

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

      //deposit
    const createDepositStatement:ICreateStatementDTO = {
      user_id: userCreate.id as string,
      description: 'deposit',
      amount: 1652,
      type: OperationType.DEPOSIT,

    };
    await createStatementUseCase.execute({user_id: createDepositStatement.user_id, amount: createDepositStatement.amount, description: createDepositStatement.description, type: createDepositStatement.type})

    //withdraw

    const createWithdrawStatement:ICreateStatementDTO = {
      user_id: userCreate.id as string,
      description: 'withdraw',
      amount: 100,
      type: OperationType.WITHDRAW,

    };
    const statementDepositCreated = await createStatementUseCase.execute({user_id: createWithdrawStatement.user_id, amount: createWithdrawStatement.amount, description: createWithdrawStatement.description, type: createWithdrawStatement.type})
    expect(statementDepositCreated).toHaveProperty('id')
    expect(statementDepositCreated.amount).not.toBe(createDepositStatement.amount)
  });  
  it('should not be able to create withdraw statement with insuficient funds', async () => {

    expect(async () => {const user: ICreateUserDTO = {
        email:'emailteste@teste.com',
        name: 'teste',
        password: '54321'
    }

      const userCreate = await createUserUsecase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

      //deposit
    const createDepositStatement:ICreateStatementDTO = {
      user_id: userCreate.id as string,
      description: 'deposit',
      amount: 1,
      type: OperationType.DEPOSIT,

    };
    await createStatementUseCase.execute({user_id: createDepositStatement.user_id, amount: createDepositStatement.amount, description: createDepositStatement.description, type: createDepositStatement.type})

    //withdraw

    const createWithdrawStatement:ICreateStatementDTO = {
      user_id: userCreate.id as string,
      description: 'withdraw',
      amount: 100,
      type: OperationType.WITHDRAW,

    };
    await createStatementUseCase.execute({user_id: createWithdrawStatement.user_id, amount: createWithdrawStatement.amount, description: createWithdrawStatement.description, type: createWithdrawStatement.type})}).rejects
    .toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });  
  it('should not be able to create statement with user not exist', async () => {

    expect(async () => {

      //deposit
    const createDepositStatement:ICreateStatementDTO = {
      user_id: '123123',
      description: 'deposit',
      amount: 1,
      type: OperationType.DEPOSIT,

    };
    await createStatementUseCase.execute({user_id: createDepositStatement.user_id, amount: createDepositStatement.amount, description: createDepositStatement.description, type: createDepositStatement.type})

    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });  

});


