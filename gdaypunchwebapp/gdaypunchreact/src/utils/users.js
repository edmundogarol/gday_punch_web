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
        following_author,
      },
    }) => ({
      id: author_id,
      name: author,
      image: author_avatar,
      likes: author_likes,
      friends: author_friends,
      followers: author_followers,
      following: following_author,
    })
  );
  return arrayIdsMapToObject(productAuthorsArray);
}

export function normaliseUserStallData(user) {
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
