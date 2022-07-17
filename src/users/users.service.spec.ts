import { Test, TestingModule } from '@nestjs/testing';
import { connect, Connection, Model } from 'mongoose';
import { User, UserSchema } from './user.schema';
import { UsersService } from './users.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
    const app: TestingModule = await Test.createTestingModule({
      // controllers: [AppController],
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();
    service = app.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Testing findById', () => {
    it('should return undefine if user doesnt exists', async () => {
      expect(
        await service.findById('62d36aa162528aeac76cd6f6'),
      ).toBeUndefined();
    });
    it('should return user', async () => {
      const { _id: id } = await new userModel({
        email: 'odi@odi.com',
        name: 'odi',
        password: 'odi',
        username: 'odi',
      }).save();
      const result = await service.findById(id.toString());
      expect(result).toBeDefined();
    });
  });
  describe('Testing findByEmail', () => {
    it('should return undefine if user doesnt exists', async () => {
      expect(await service.findByEmail('fake@email.com')).toBeUndefined();
    });
    it('should return user', async () => {
      expect(await service.findByEmail('odi@odi.com')).toBeUndefined();
      await new userModel({
        email: 'odi@odi.com',
        name: 'odi',
        password: 'odi',
        username: 'odi',
      }).save();
      const result = await service.findByEmail('odi@odi.com');
      expect(result.email).toBe('odi@odi.com');
    });
  });
  describe('Testing findByUsername', () => {
    it('should return undefine if user doesnt exists', async () => {
      expect(await service.findByUsername('odi')).toBeUndefined();
    });
    it('should return user', async () => {
      await new userModel({
        email: 'odi@odi.com',
        name: 'odi',
        password: 'odi',
        username: 'odi',
      }).save();
      const result = await service.findByUsername('odi');
      expect(result.username).toBe('odi');
    });
  });
});
