import express, { Express, NextFunction, Request, Response } from "express";
import mongoose, { SortOrder } from "mongoose";
import { ethers } from "ethers";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

import {
  AuthRequest,
  MediaSource,
  PostModel,
  UserModel,
  VoteModel,
  TopicModel,
  VoteType,
} from "./schemas";
import { BadRequestError, UnauthorizedError } from "./utils";
import ShareModel, { ShareMedium } from "./schemas/share";
import { AuthUser } from "..";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 6900;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:6900",
      // "https://rollover.co.nz",
      // "https://admin.rollover.co.nz",
    ],
    credentials: true,
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
  })
);
// app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("/public"));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Define the middleware function to verify JWT token
function Auth(req: AuthRequest, res: Response, next: NextFunction) {
  // Get the token from the request headers
  const [token1, token2] = req.headers["authorization"]?.split(" ") || [];
  const token = token2 || token1;

  // Check if token is provided
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, String(process.env.JWT_SECRET), async (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    const user = await UserModel.findById((decoded as any).id).lean();

    if (!user) return res.status(401).json({ message: "Invalid user" });

    req.user = decoded as AuthUser;
    next();
  });
}

function PartialAuth(req: AuthRequest, res: Response, next: NextFunction) {
  // Get the token from the request headers
  const [token1, token2] = req.headers["authorization"]?.split(" ") || [];
  const token = token2 || token1;

  // Check if token is provided
  if (!token) return next();

  jwt.verify(token, String(process.env.JWT_SECRET), async (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    const user = await UserModel.findById((decoded as any).id).lean();

    if (!user) return res.status(401).json({ message: "Invalid user" });

    req.user = decoded as AuthUser;
    next();
  });
}

const parseSort = (sortString: string): { by: string; order: SortOrder } => {
  const sortByMap = {
    rec: "created_at",
    top: "upvotes",
    rand: "shares",
  } as { [x: string]: string };

  if (sortString == "null") {
    return {
      by: sortByMap.rec,
      order: -1,
    };
  }
  const [sortBy = "", sortOrder = ""] = sortString.split("-");

  const direction = sortOrder.toLocaleLowerCase() === "desc" ? -1 : 1;

  return {
    by: sortByMap[sortBy.toLocaleLowerCase()],
    order: direction,
  };
};

const parseSince = (since: string) => {
  if (!since) return null;

  const sinceMap = {
    "1h": new Date(Date.now() - 1 * 60 * 60 * 1000), // One hour in milliseconds
    "6h": new Date(Date.now() - 6 * 60 * 60 * 1000),
    "24h": new Date(Date.now() - 24 * 60 * 60 * 1000),
    "7d": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  } as { [x: string]: any };

  return sinceMap[since] || null;
};

const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024, // 100mb max file size
  },
  fileFilter: (req, file, cb) => {
    const mime_types = ["video/webm", "video/x-msvideo", "video/mp4"];
    if (mime_types.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      const filename = uuidv4() + path.extname(file.originalname);
      cb(null, filename);
    },
  }),
});

app.use("/ping", Auth, (req: AuthRequest, res: Response) => {
  res.send(`Hello! ${req.user.address}`);
});

app.post("/auth", async (req: Request, res: Response) => {
  interface SigninMessage {
    message: string;
    signature: string;
    signerAddress: string;
  }

  try {
    // veryify signature
    const { message, signature, signerAddress }: SigninMessage = req.body;

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    // Compare the recovered address with the expected signer address
    if (recoveredAddress.toLowerCase() !== signerAddress.toLowerCase())
      throw new UnauthorizedError("Signature is invalid");

    // check if user already exist
    let user = await UserModel.findOne({ address: recoveredAddress }).exec();
    if (!user) {
      const newUser = new UserModel({
        address: recoveredAddress,
      });
      user = await newUser.save();
    }

    // generate token for user
    const token = jwt.sign(
      { id: user._id, address: user.address },
      String(process.env.JWT_SECRET),
      { expiresIn: "90h" }
    );

    res.send({
      success: true,
      message: "Signin successful",
      data: {
        address: recoveredAddress,
        access_token: token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `${error}` });
  }
});

// TODO: use transaction
app.post(
  "/post",
  Auth,
  upload.single("media"),
  async (req: AuthRequest, res: Response) => {
    console.log(req.body);
    try {
      // Update topic count or create topic
      const topic = await TopicModel.findOneAndUpdate(
        { title: req.body.topic },
        {
          $inc: { posts: 1 },
        },
        { new: true, upsert: true }
      ).exec();

      const newPost = new PostModel({
        topic_id: topic._id,
        author_id: req.user.id,
        caption: req.body.caption,
        media_url: req.file?.path,
        tiktok: `https://${req.body.tiktok.split("//").pop()}`,
        media_source: MediaSource.UPLOAD,
      });
      const savedPost = await newPost.save();

      res.send({
        success: true,
        message: "Post created",
        data: {
          _id: savedPost._id,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `${error}` });
    }
  }
);

app.get("/post", PartialAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, sort, since, topic, author } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const sinceData = parseSince(String(since));
    const sortData = parseSort(String(sort || null));

    const query = {
      ...(topic && { topic_id: topic }),
      ...(author && { author_id: author }),
      ...(sinceData && { created_at: { $gt: sinceData } }),
    };

    console.log("sort => ", { [String(sortData.by)]: sortData.order });
    console.log("query => ", query);

    const getPosts = PostModel.find(query)
      .sort({ [String(sortData.by)]: sortData.order })
      .skip(skip)
      .limit(Number(limit))
      .populate("topic_id author_id");

    const getPostsCount = PostModel.countDocuments(query).countDocuments();

    let [docs, totalCount] = await Promise.all([
      getPosts.lean().exec(),
      getPostsCount,
    ]);

    const totalPages = Math.ceil(totalCount / Number(limit));

    if (req.user !== undefined) {
      const votes = await VoteModel.find({
        user_id: req.user.id,
        post_id: {
          $in: docs.map((x) => x._id),
        },
      })
        .lean()
        .exec();

      // Post with votes
      docs = docs.map((doc) => {
        const vote = votes.filter(
          (el) => String(el.post_id) === String(doc._id)
        )[0];

        return {
          ...doc,
          ...(vote && vote.type == VoteType.UPVOTE && { upvoted: true }),
          ...(vote && vote.type == VoteType.DOWNVOTE && { downvoted: true }),
        };
      });
    }

    // TODO: show if user have votes while sending result
    res.send({
      success: true,
      message: "",
      data: {
        docs,
        meta: {
          page,
          limit,
          total_count: totalCount,
          total_pages: totalPages,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `${error}` });
  }
});

app.get("/post/:id", PartialAuth, async (req: Request, res: Response) => {
  try {
    const post = await PostModel.findById(req.params.id)
      .select("-__v -media_source")
      .populate({
        path: "topic_id",
        model: "Topic",
        select: "title",
      });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.send({
      success: true,
      message: "",
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `${error}` });
  }
});

// TODO: use transaction
app.patch("/post/:id/upvote", Auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    // check the Vote shcema to see if the person has upvoted the post before, if yes return
    let vote = await VoteModel.findOne({ user_id: userId, post_id: postId });
    if (vote && vote.type == VoteType.UPVOTE)
      throw new BadRequestError("You've already upvoted this post");

    // if downvoted, delete
    if (vote && vote.type == VoteType.DOWNVOTE) {
      await VoteModel.findByIdAndDelete(vote._id);
      await PostModel.findByIdAndUpdate(
        postId,
        { $inc: { downvotes: -1 } },
        { new: true }
      );
    }

    const newVote = new VoteModel({
      user_id: userId,
      post_id: postId,
      type: VoteType.UPVOTE,
    });
    await newVote.save();

    // check if it was shared and inc upvote the share schema by {post_id, sharerer_id, medium}
    // keep share id
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });

    res.send({
      success: true,
      message: "Post upvoted",
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `${error}` });
  }
});

// TODO: use transaction
app.patch(
  "/post/:id/downvote",
  Auth,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;

      // check the Vote shcema to see if the person has upvoted the post before, if yes return
      let vote = await VoteModel.findOne({ user_id: userId, post_id: postId });
      if (vote && vote.type == VoteType.DOWNVOTE)
        throw new BadRequestError("You've already downvoted this post");

      // if downvoted, delete
      if (vote && vote.type == VoteType.UPVOTE) {
        await VoteModel.findByIdAndDelete(vote._id);
        await PostModel.findByIdAndUpdate(
          postId,
          { $inc: { upvotes: -1 } },
          { new: true }
        );
      }

      const newVote = new VoteModel({
        user_id: userId,
        post_id: postId,
        type: VoteType.DOWNVOTE,
      });
      await newVote.save();

      // check if it was shared and inc upvote the share schema by {post_id, sharerer_id, medium}
      // keep share id
      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        { $inc: { downvotes: 1 } },
        { new: true }
      );
      if (!updatedPost)
        return res.status(404).json({ message: "Post not found" });

      res.send({
        success: true,
        message: "Post downvoted",
        data: {},
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `${error}` });
    }
  }
);

app.patch("/post/:id/unvote", Auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    // check vote schema to see if user has vote
    let vote = await VoteModel.findOneAndDelete({
      user_id: userId,
      post_id: postId,
    });
    if (!vote) throw new BadRequestError("You've already unvoted this post");

    // decrement post upvote or downvote
    await PostModel.findByIdAndUpdate(
      postId,
      {
        $inc:
          vote.type == VoteType.UPVOTE ? { upvotes: -1 } : { downvotes: -1 },
      },
      { new: true }
    );
    res.send({
      success: true,
      message: "Post unvoted",
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `${error}` });
  }
});

// when a post loads it hits this endpoint
app.post("/share", Auth, async (req: AuthRequest, res: Response) => {
  try {
    // m - Medium
    // s- sharerer id
    // p - post id
    const { m, s, p } = req.body;

    const user = await UserModel.findById(s);
    if (!user) return;

    const post = await PostModel.findById(p);
    if (!post) return;

    // create record if it doesnt exist and increase click count
    await ShareModel.findOneAndUpdate(
      {
        post_id: p,
        sharerer_id: s,
        medium: Object.values(ShareMedium).includes(m)
          ? m
          : ShareMedium.GENERIC,
      },
      {
        $inc: { clicks: 1 },
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.send({
      success: true,
      message: "",
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `${error}` });
  }
});

app.listen(port, async () => {
  const connectDB = async () => {
    try {
      const uri = "mongodb://localhost:27017/bitcast";
      await mongoose.connect(uri);
      console.log("[MongoDB] Connected successfully!");
    } catch (error) {
      console.error("[MongoDB] Error connecting: ", error);
      process.exit(1);
    }
  };

  await connectDB();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// (async function () {
//   const wallet = new ethers.Wallet(
//     "55c0ada3c1d377b334e455b92bf041cb93aeca8c400fba00b32e92cb8f0ff6dd"
//   );
//   const signature = await wallet.signMessage("message");
//   console.log(`Signature: ${signature}`);

//   (async function () {
//     const recoveredAddress = ethers.verifyMessage("message", signature);
//     console.log(`Signer: ${recoveredAddress}`);
//   })();
// })();
