export type User = {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string;
};

export type Comment = {
  id: string;
  userId: string;
  text: string;
  createdAt: number; // epoch ms
};

export type Post = {
  id: string;
  userId: string;
  imageUrl: string; // can be data URL or remote URL
  caption: string;
  createdAt: number;
  likeUserIds: string[];
  comments: Comment[];
};

export type AppState = {
  currentUserId: string;
  users: Record<string, User>;
  posts: Post[];
};
