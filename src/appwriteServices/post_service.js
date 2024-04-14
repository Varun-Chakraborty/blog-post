import { Client, Databases, Storage, ID, Account } from 'appwrite';
import variables from '../variables';

class post_service {
    client = new Client();
    database;
    bucket;
    account;
    user;
    constructor() {
        this.client
            .setEndpoint(variables.appWriteURL)
            .setProject(variables.appWriteProjectID);
        this.database = new Databases(this.client);
        this.bucket = new Storage(this.client);
        this.account = new Account(this.client);
    }
    async getPosts() {
        let userId = (await this.account.get()).$id;
        let posts = await this.database.listDocuments(variables.appWriteDBID, variables.appWritePostCollectionID);
        return posts.documents.map(post => {
            post.imgURL = post.reference_to_picture ? this.bucket.getFilePreview(variables.appWriteBucketID, post.reference_to_picture) : undefined;
            post.edit = userId === post.userId ? true : false;
            return post;
        });
    }
    async getPost(id) {
        const userId = (await this.account.get()).$id;
        const post = await this.database.getDocument(variables.appWriteDBID, variables.appWritePostCollectionID, id);
        post.imgURL = post.reference_to_picture ? this.bucket.getFileView(variables.appWriteBucketID, post.reference_to_picture) : undefined;
        post.edit = userId === post.userId ? true : false;
        return post;
    }
    async createPost(formData) {
        const userId = (await this.account.get()).$id;
        const fileId = formData.file && (await this.bucket.createFile(variables.appWriteBucketID, ID.unique(), formData.file)).$id;
        delete formData.file;
        formData.userId = userId;
        formData.reference_to_picture = fileId;
        return await this.database.createDocument(
            variables.appWriteDBID,
            variables.appWritePostCollectionID,
            ID.unique(),
            { ...formData }
        );
    }
    async createComment(comment = '', postId) {
        if (comment && postId && comment !== '') {
            const id = (await this.database.createDocument(
                variables.appWriteDBID,
                variables.appWriteCommentCollectionID,
                ID.unique(),
                {
                    name: 'abc',
                    msg: comment,
                    pfp: "<div style='height:2rem; background-color: rgb(147 197 253); aspect-ratio: 1; border-radius: 9999px;' />",
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
        } else {
            Error('No msg received');
        }
    }
    async deleteComment(commentId) {
        if (commentId) {
            await this.database.deleteDocument(
                variables.appWriteDBID,
                variables.appWriteCommentCollectionID,
                commentId
            );
        } else {
            Error('No id received');
        }
    }
    async getComments(postId) {
        if (postId) {
            const post = await this.database.getDocument(variables.appWriteDBID, variables.appWritePostCollectionID, postId);
            const promises = post.comments.map(async comment => await this.database.getDocument(variables.appWriteDBID, variables.appWriteCommentCollectionID, comment.$id));
            return await Promise.all(promises);
        } else {
            Error('No id received');
        }
    }
    async createReply(reply = '', commentId) {
        if (reply && commentId && reply !== '') {
            const id = (await this.database.createDocument(
                variables.appWriteDBID,
                variables.appWriteReplyCollectionID,
                ID.unique(),
                {
                    name: 'abc',
                    msg: reply,
                    pfp: "<div style='height:2rem; background-color: rgb(147 197 253); aspect-ratio: 1; border-radius: 9999px;' />",
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
        } else {
            Error('No msg received');
        }
    }
    async deleteReply(replyId) {
        if (replyId) {
            await this.database.deleteDocument(
                variables.appWriteDBID,
                variables.appWriteReplyCollectionID,
                replyId
            );
        } else {
            Error('No id received');
        }
    }
    async getReplies(commentId) {
        if (commentId) {
            const comment = await this.database.getDocument(variables.appWriteDBID, variables.appWriteCommentCollectionID, commentId);
            const promises = comment.replies.map(async reply => await this.database.getDocument(variables.appWriteDBID, variables.appWriteReplyCollectionID, reply.$id));
            return await Promise.all(promises);
        } else {
            Error('No id received');
        }
    }
    async updatePost(formData, id, fileId) {
        const fileData = formData.file && await this.bucket.updateFile(variables.appWriteBucketID, fileId, formData.file);
        await this.database.updateDocument(variables.appWriteDBID, variables.appWritePostCollectionID, id, {
            title: formData.title, content: formData.content, ...(fileData ? { fileId: fileData.id } : {})
        });
    }
    async deletePost(documentID) {
        let document = await this.database.getDocument(variables.appWriteDBID, variables.appWritePostCollectionID, documentID);
        document.reference_to_picture && await this.bucket.deleteFile(variables.appWriteBucketID, document.reference_to_picture);
        await this.database.deleteDocument(variables.appWriteDBID, variables.appWritePostCollectionID, documentID);
    }
}
export default new post_service();