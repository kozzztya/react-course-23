import faker from 'faker';

const defaultState = [
  {
    id: faker.random.uuid(),
    imageUrl:
      'data:image/jpeg;base64,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',
    likes: faker.random.number(),
    isLiked: false,
    userId: faker.random.uuid()
  },
  {
    id: faker.random.uuid(),
    imageUrl: 'https://files.slack.com/files-pri/TU28NEQUT-FV9CN8WCC/264332097_361093.jpg',
    likes: faker.random.number(),
    isLiked: false,
    userId: faker.random.uuid()
  },
  {
    id: faker.random.uuid(),
    imageUrl:
      'https://starecat.com/content/wp-content/uploads/me-makes-small-change-to-the-css-my-websites-looks-ridiculous.jpg',
    likes: faker.random.number(),
    isLiked: false,
    userId: faker.random.uuid()
  }
];

export const posts = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_POST':
      return [
        ...state,
        {
          id: faker.random.uuid(),
          imageUrl: action.payload.imageUrl,
          likes: 0,
          isLiked: false,
          userId: action.payload.userId
        }
      ];
    case 'TOGGLE_LIKE':
      const { id } = action.payload;

      return state.map((post) => {
        if (post.id !== id) return post;

        const isLiked = !post.isLiked;
        const likes = isLiked ? post.likes + 1 : post.likes - 1;

        return { ...post, isLiked, likes };
      });
    default:
      return state;
  }
};
