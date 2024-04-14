export default {
    appWriteURL: String(import.meta.env.VITE_APPWRITE_URL),
    appWriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appWriteDBID: String(import.meta.env.VITE_DATABASE_ID),
    appWritePostCollectionID: String(import.meta.env.VITE_POST_COLLECTION_ID),
    appWriteCommentCollectionID: String(import.meta.env.VITE_COMMENT_COLLECTION_ID),
    appWriteReplyCollectionID: String(import.meta.env.VITE_REPLY_COLLECTION_ID),
    appWriteBucketID: String(import.meta.env.VITE_BUCKET_ID)
};