import { arrayIdsMapToObject } from "./utils";

export function extractProductUsers(products) {
  const productAuthorsArray = Object.values(products).map(
    ({
      manga_details: {
        author,
        author_id,
        author_avatar,
        author_likes,
        author_friends,
        author_followers,
        author_followings,
        following_author,
        orientation,
      },
    }) => ({
      id: author_id,
      name: author,
      image: author_avatar,
      likes: author_likes,
      friends: author_friends,
      followers: author_followers,
      following: following_author,
      followings: author_followings,
      japanese_reading: orientation === "japanese",
    })
  );

  return arrayIdsMapToObject(productAuthorsArray);
}

export function extractCommentUsers(comments) {
  const commentsAuthorsArray = comments.map((comment) => comment.author);
  return arrayIdsMapToObject(commentsAuthorsArray);
}

export function normaliseAuthorData(user) {
  if (!user) return;
  // Loggedin User
  if (user.author_details) {
    return {
      ...user.author_details,
      cover: user.cover,
    };
  }
  // Fetched User public data
  return user;
}
