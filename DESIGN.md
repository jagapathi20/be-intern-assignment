
## 1. Database Schema Design and Entity Relationships
The database is structured using a relational model to maintain strict data integrity and support complex social interactions.

* **User Entity**: Serves as the primary node. It manages one-to-many relationships with `Post` and `Like` entities. It also handles a self-referencing relationship for the social graph via `Followers` and `Following`.
* **Post Entity**: The core content unit. It has a Many-to-One relationship with `User` and a Many-to-Many relationship with `Hashtag` via the `post_hashtags` junction table.
* **Follow Entity**: A junction table that connects users to each other. It explicitly stores `followerId` and `followingId` to represent the directed edges of a social graph.
* **Like Entity**: A junction entity between `User` and `Post`. It uses `onDelete: 'CASCADE'` to ensure that if a user or post is removed, the associated likes are automatically cleaned up.
* **Hashtag Entity**: Stores unique tags. The Many-to-Many relationship with posts allows for efficient categorization and discovery of content.


---

## 2. Indexing Strategy for Performance Optimization
To ensure the application remains performant as the dataset grows, several indexing strategies have been applied:

* **Unique Composite Indexes**:
    * `Follow (followerId, followingId)`: Ensures a user cannot follow the same person more than once and speeds up "check following status" queries.
    * `Like (userId, postId)`: Prevents duplicate likes on a single post and optimizes the toggle-like logic.
* **Retrieval Optimization**:
    * `Post (userId, createdAt)`: A composite index designed to optimize the performance of fetching a user's chronological feed or profile posts.
    * `Hashtag (name)`: A unique index on the name column to allow $O(1)$ or $O(\log n)$ lookup times when filtering posts by tag.
* **Clustered Indexes**: All tables utilize an auto-incrementing integer `id` as the Primary Key for fast row identification and joining.

---

## 3. Scalability Considerations and Solutions
The design incorporates several features to handle increasing loads:

* **Pagination (Offset-based)**: All list-based endpoints (Feeds, Activity, Followers, Hashtag searches) implement `take` (limit) and `skip` (offset) to prevent high memory consumption and slow response times.
* **Sub-query Optimization**: The `getUserFeed` implementation uses a Query Builder to fetch `followingId` values first. This avoids the "N+1 Problem" by fetching a list of relevant IDs before retrieving the associated post data.
* **Raw Data Access**: By using `getRawMany()` for ID lookups in the feed logic, the system reduces the overhead of full ORM object instantiation, saving CPU and RAM.

---

## 4. Other Important Design Considerations
* **Atomic Toggles**: The `toggleFollowUser` and `togglePostLike` methods are designed to be idempotent, checking for the existence of a record before creating or deleting it to prevent database inconsistencies.
* **Referential Integrity**: Strategic use of `JoinColumn` and `JoinTable` ensures that relationships are correctly mapped at the database level, preventing orphaned records.
* **Type Safety**: Leveraging TypeScript and TypeORM decorators ensures that the backend remains predictable and that database schema changes are strictly controlled through the code.