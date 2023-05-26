module.exports = {
  async up(db) {
    try {
      const collection = await db.collection('TokenWhiteList');
      // TTL indexes are special single-field indexes that MongoDB can use to
      // automatically remove documents from a collection after a certain amount
      // of time or at a specific clock time.
      await collection.createIndex({ expiredAt: 1 }, { expireAfterSeconds: 0 });

      // Search for a specific field in the collection
      await collection.createIndex({ accessToken: 1, refreshToken: 1 });
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },

  async down(db) {
    const collection = await db.collection('TokenWhiteList');

    try {
      await collection.dropIndex('expiredAt_1');
      await collection.dropIndex('accessToken_1_refreshToken_1');
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },
};
