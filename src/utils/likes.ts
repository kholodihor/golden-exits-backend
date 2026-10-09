// Builds an atomic update that toggles `likes.<userId>` on a document with a `likes` Map.
export function toggleLikeUpdate(likes: Map<string, boolean> | undefined, userId: string) {
  const liked = Boolean(likes?.get(userId));
  const update = liked
    ? { $unset: { [`likes.${userId}`]: "" } }
    : { $set: { [`likes.${userId}`]: true } };
  return { liked: !liked, update };
}
