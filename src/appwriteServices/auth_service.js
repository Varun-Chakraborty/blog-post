import { Client, Account, ID } from 'appwrite';
import variables from '../variables';

class auth_service {
    client = new Client();
    account;
    user;
    constructor() {
        this.client
            .setEndpoint(variables.appWriteURL)
            .setProject(variables.appWriteProjectID);
        this.account = new Account(this.client);
    }
    async getUser() {
        return await this.account.get();
    }
    async login({ email, password }) {
        await this.account.createEmailPasswordSession(email, password);
        return await this.getUser();
    }
    async register({ email, password, name }) {
        await this.account.create(ID.unique(), email, password, name);
        return await this.login({ email, password });
    }
    async logout() {
        await this.account.deleteSession('current');
    }
    async deleteAccount() {
        await this.account.updateStatus();
    }
}
export default new auth_service();