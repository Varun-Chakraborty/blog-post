const prismaMock = {
    post: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    comment: {
        create: jest.fn(),
    },
}

jest.mock('@/db', () => ({
    getPrismaClient: jest.fn(() => prismaMock),
}));

import { ExpressTypes } from "@/types";
import { commentOnPost } from "@/controllers/post.controller";

describe("commentOnPost", () => {
    let req: Partial<ExpressTypes.Req>;
    let res: Partial<ExpressTypes.Res>;
    let next: Partial<ExpressTypes.Next>;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            user: {
                id: "1",
                username: "user1",
                name: "User 1",
                role: "USER"
            },
            params: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should return 400 if postId is not provided", async () => {
        await commentOnPost(
            req as ExpressTypes.Req,
            res as ExpressTypes.Res,
            next as ExpressTypes.Next
        );
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "PostId is required",
            })
        );
    });

    it("should return 400 if comment is not provided", async () => {
        req.params = {
            postId: "1"
        };
        await commentOnPost(
            req as ExpressTypes.Req,
            res as ExpressTypes.Res,
            next as ExpressTypes.Next
        );
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "A comment message is required",
            })
        );
    });

    it("should return 404 if post does not exist", async () => {
        req.params = {
            postId: "1",
        };
        req.body = {
            message: "This is a comment",
        };
        prismaMock.post.findUnique.mockResolvedValue(null);
        await commentOnPost(
            req as ExpressTypes.Req,
            res as ExpressTypes.Res,
            next as ExpressTypes.Next
        );
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Post not found",
            })
        );
    });

    it("should comment on the post", async () => {
        req.params = {
            postId: "1",
        };
        req.body = {
            message: "This is a comment",
        };
        prismaMock.post.findUnique.mockResolvedValue({
            id: "1",
            userId: "1",
            title: "Test Post",
            content: "This is a test post",
            likes: ["1"],
        });
        await commentOnPost(
            req as ExpressTypes.Req,
            res as ExpressTypes.Res,
            next as ExpressTypes.Next
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Comment created successfully",
            })
        );
    });
});
