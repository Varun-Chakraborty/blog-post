import { Client, Account, ID } from 'appwrite';
import variables from '../variables';

/**
 * Auth Service handles the authentication with Appwrite
 */
class auth_service {
    /**
     * Appwrite client
     * @type {Client}
     */
    client = new Client();

    /**
     * Appwrite Account instance
     * @type {Account}
     */
    account;

    /**
     * Currently logged in user
     * @type {object}
     */
    user;

    /**
     * Constructor to set Appwrite endpoint and project ID
     */
    constructor() {
        this.client
            .setEndpoint(variables.appWriteURL)
            .setProject(variables.appWriteProjectID);
        this.account = new Account(this.client);
    }

    /**
     * Get currently logged in user
     * @returns {Promise} user object
     */
    async getUser() {
        return await this.account.get();
    }

    /**
     * Login with Appwrite
     * @param {object} userInfo - user email and password
     * @returns {Promise} user object
     */
    async login({ email, password }) {
        await this.account.createEmailPasswordSession(email, password);
        return await this.getUser();
    }

    /**
     * Register new user
     * @param {object} userInfo - user email, password and name
     * @returns {Promise} user object
     */
    async register({ email, password, name }) {
        await this.account.create(ID.unique(), email, password, name);
        return await this.login({ email, password });
    }

    /**
     * Logout current session
     * @returns {Promise} success
     */
    async logout() {
        await this.account.deleteSession('current');
    }

    /**
     * Delete current user account
     * @returns {Promise} success
     */
    async deleteAccount() {
        await this.account.updateStatus();
    }
}
export default new auth_service();