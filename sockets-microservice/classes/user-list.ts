import { User } from './user';

export class UserList {
  private userList: User[] = [];

  public addUser(user: User) {
    this.userList.push(user);
    return user;
  }

  public configUser(socketId: string, name: string, userId: number) {
    for (const user of this.userList) {
      if (user.socketId === socketId) {
        user.name = name;
        user.userId = userId;
        break;
      }
    }
  }

  public getSocketIdsByUserIds(userIds: string | string[]): {
    socketIds: string | string[];
    users: User[];
  } {
    const users = this.userList.filter((user: User) => {
      return user.userId ? userIds.includes(user.userId.toString()) : false;
    });
    return { socketIds: users.map(user => user.socketId), users };
  }

  public getList() {
    return this.userList.filter(user => user.name !== 'nameless');
  }

  public getUser(socketId: string) {
    return this.userList.find(user => user.socketId === socketId);
  }

  public deleteUser(socketId: string) {
    const user = this.getUser(socketId);

    this.userList = this.userList.filter(user => user.socketId !== socketId);

    return user;
  }
}
