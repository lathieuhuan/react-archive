export interface FetchedPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface FetchedComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface FetchedAlbum {
  userId: number;
  id: number;
  title: string;
}

export interface FetchedPhoto {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface FetchedTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface FetchedUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface GetPostsParams {
  _limit: number;
}
