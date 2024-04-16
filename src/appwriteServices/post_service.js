import { Client, Databases, Storage, ID, Account } from 'appwrite';
import variables from '../variables';

/**
 * Class that handles the communication with Appwrite's services
 * for posts and comments
 */
class post_service {
    /**
     * Client object used to communicate with Appwrite services
     */
    client = new Client();

    /**
     * Database service object
     */
    database;

    /**
     * Bucket service object
     */
    bucket;

    /**
     * Account service object
     */
    account;

    /**
     * Constructor that sets the Appwrite endpoint and project ID,
     * and initiates the services objects
     */
    constructor() {
        this.client
            .setEndpoint(variables.appWriteURL)
            .setProject(variables.appWriteProjectID);
        this.database = new Databases(this.client);
        this.bucket = new Storage(this.client);
        this.account = new Account(this.client);
    }

    /**
     * Returns all posts from the database
     * @returns {Promise<Array>} - Array of posts
     */
    async getPosts() {
        let posts = await this.database.listDocuments(variables.appWriteDBID, variables.appWritePostCollectionID);
        return posts.documents.map(post => {
            post.imgURL = post.reference_to_picture ? this.bucket.getFilePreview(variables.appWriteBucketID, post.reference_to_picture) : undefined;
            return post;
        });
    }

    /**
     * Returns all comments of a given post
     * @param {string} postId - Post ID to get comments from
     * @returns {Promise<Array>} - Array of comments
     */
    async getComments(postId) {
        if (postId) {
            const post = await this.database.getDocument(variables.appWriteDBID, variables.appWritePostCollectionID, postId);
            const promises = post.comments.map(async comment => await this.database.getDocument(variables.appWriteDBID, variables.appWriteCommentCollectionID, comment.$id));
            return await Promise.all(promises);
        } else {
            throw new Error('No id received');
        }
    }

    /**
     * Returns all replies of a given comment
     * @param {string} commentId - Comment ID to get replies from
     * @returns {Promise<Array>} - Array of replies
     */
    async getReplies(commentId) {
        if (commentId) {
            const comment = await this.database.getDocument(variables.appWriteDBID, variables.appWriteCommentCollectionID, commentId);
            const promises = comment.replies.map(async reply => await this.database.getDocument(variables.appWriteDBID, variables.appWriteReplyCollectionID, reply.$id));
            return await Promise.all(promises);
        } else {
            throw new Error('No id received');
        }
    }

    /**
     * Returns a post by its ID
     * @param {string} id - Post ID to get
     * @returns {Promise<Object>} - Post
     */
    async getPost(id) {
        const userId = (await this.account.get()).$id;
        const post = await this.database.getDocument(variables.appWriteDBID, variables.appWritePostCollectionID, id);
        post.imgURL = post.reference_to_picture ? this.bucket.getFileView(variables.appWriteBucketID, post.reference_to_picture) : undefined;
        post.edit = userId === post.userId ? true : false;
        return post;
    }

    /**
     * Creates a new post
     * @param {Object} formData - Data from the form
     * @param {string} userId - User ID of the user making the post
     * @param {string} userName - User name of the user making the post
     * @returns {Promise<Object>} - Post created
     */
    async createPost(formData, userId, userName) {
        const fileId = formData.file && (await this.bucket.createFile(variables.appWriteBucketID, ID.unique(), formData.file)).$id;
        delete formData.file;
        formData.userId = userId;
        formData.username = userName;
        formData.reference_to_picture = fileId;
        return await this.database.createDocument(
            variables.appWriteDBID,
            variables.appWritePostCollectionID,
            ID.unique(),
            { ...formData }
        );
    }

    /**
     * Creates a new comment
     * @param {string} comment - Comment message
     * @param {string} postId - Post ID to add the comment to
     * @param {string} userId - User ID of the user making the comment
     * @param {string} userName - User name of the user making the comment
     */
    async createComment(comment = '', postId, userId, userName) {
        if (!comment || comment === '') {
            throw new Error('No msg received');
        } else if (!postId) {
            throw new Error('No post id received');
        } else if (!userId || !userName) {
            throw new Error('Complete user info not received');
        } else {
            const id = (await this.database.createDocument(
                variables.appWriteDBID,
                variables.appWriteCommentCollectionID,
                ID.unique(),
                {
                    username: userName,
                    userId: userId,
                    msg: comment,
                }
            )).$id;
            await this.database.updateDocument(
                variables.appWriteDBID,
                variables.appWritePostCollectionID,
                postId,
                {
                    comments: [id, ...(await this.database.getDocument(variables.appWriteDBID, variables.appWritePostCollectionID, postId)).comments]
                }
            );
        }
    }

    /**
     * Creates a new reply
     * @param {string} reply - Reply message
     * @param {string} commentId - Comment ID to add the reply to
     * @param {string} userId - User ID of the user making the reply
     * @param {string} userName - User name of the user making the reply
     */
    async createReply(reply = '', commentId, userId, userName) {
        if (!reply || reply === '') {
            throw new Error('No msg received');
        } else if (!commentId) {
            throw new Error('No comment id received');
        } else if (!userId || !userId) {
            throw new Error('Complete user info not received');
        } else {
            const id = (await this.database.createDocument(
                variables.appWriteDBID,
                variables.appWriteReplyCollectionID,
                ID.unique(),
                {
                    userId: userId,
                    username: userName,
                    msg: reply,
                }
            )).$id;
            await this.database.updateDocument(
                variables.appWriteDBID,
                variables.appWriteCommentCollectionID,
                commentId,
                {
                    replies: [id, ...(await this.database.getDocument(variables.appWriteDBID, variables.appWriteCommentCollectionID, commentId)).replies]
                }
            );
        }
    }

    /**
     * Updates a post
     * @param {Object} formData - Data from the form
     * @param {string} id - Post ID to update
     * @param {string} fileId - File ID of the file to update
     * @returns {Promise<Object>} - Updated post
     */
    async updatePost(formData, id, fileId) {
        const fileData = formData.file && await this.bucket.updateFile(variables.appWriteBucketID, fileId, formData.file);
        return await this.database.updateDocument(variables.appWriteDBID, variables.appWritePostCollectionID, id, {
            title: formData.title, content: formData.content, ...(fileData ? { fileId: fileData.id } : {})
        });
    }
    /**
     * Deletes a post
     * @param {string} documentID - ID of the post to delete
     * @returns {Promise<void>} - No return value
     */
    async deletePost(documentID) {
        const document = await this.database.getDocument(variables.appWriteDBID, variables.appWritePostCollectionID, documentID);
        if (document.reference_to_picture) {
            await this.bucket.deleteFile(variables.appWriteBucketID, document.reference_to_picture);
        }
        await this.database.deleteDocument(variables.appWriteDBID, variables.appWritePostCollectionID, documentID);
    }
    /**
     * Deletes a comment
     * @param {string} commentId - ID of the comment to delete
     * @returns {Promise<void>} - No return value
     */
    async deleteComment(commentId) {
        if (commentId) {
            await this.database.deleteDocument(
                variables.appWriteDBID,
                variables.appWriteCommentCollectionID,
                commentId
            );
        } else {
            throw new Error('No id received');
        }
    }

    /**
     * Deletes a reply
     * @param {string} replyId - ID of the reply to delete
     * @returns {Promise<void>} - No return value
     */
    async deleteReply(replyId) {
        if (replyId) {
            await this.database.deleteDocument(
                variables.appWriteDBID,
                variables.appWriteReplyCollectionID,
                replyId
            );
        } else {
            throw new Error('No id received');
        }
    }
}
export default new post_service();