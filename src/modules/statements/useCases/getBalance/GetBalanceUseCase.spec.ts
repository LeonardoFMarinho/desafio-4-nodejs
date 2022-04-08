import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";



let createUserUsecase: CreateUserUseCase
let getBalanceUseCase: GetBalanceUseCase
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create Statement UseCase', () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository,inMemoryUsersRepository )
    createUserUsecase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(
        inMemoryUsersRepository,
        inMemoryStatementRepository,
    );
  });

  it('should be able to get balance with a user', async () => {

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
    await createStatementUseCase.execute({user_id: createWithdrawStatement.user_id, amount: createWithdrawStatement.amount, description: createWithdrawStatement.description, type: createWithdrawStatement.type})
    const balance = await getBalanceUseCase.execute({user_id: createWithdrawStatement.user_id})
    expect(balance.statement.length).toEqual(2)
    expect(balance.statement[0].type).toBe('deposit')
    expect(balance.statement[1].type).toBe('withdraw')
    expect(balance.balance).toBe(balance.statement[0].amount - balance.statement[1].amount)

  });  
  it('should not be able to get balance with a user not exist', async () => {

   expect(async () => { 
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
    await createStatementUseCase.execute({user_id: createWithdrawStatement.user_id, amount: createWithdrawStatement.amount, description: createWithdrawStatement.description, type: createWithdrawStatement.type})
    await getBalanceUseCase.execute({user_id: createWithdrawStatement.user_id})}).rejects.toBeInstanceOf(GetBalanceError)

  });  
});


