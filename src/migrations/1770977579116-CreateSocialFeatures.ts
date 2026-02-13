import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSocialFeatures1770977579116 implements MigrationInterface {
    name = 'CreateSocialFeatures1770977579116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_74b9b8cd79a1014e50135f266f" ON "likes" ("userId", "postId") `);
        await queryRunner.query(`CREATE TABLE "hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(100) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_7fedde18872deb14e4889361d7b" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7fedde18872deb14e4889361d7" ON "hashtags" ("name") `);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE INDEX "IDX_d5c404ce74b775e290b4514085" ON "posts" ("userId", "createdAt") `);
        await queryRunner.query(`CREATE TABLE "post_hashtags" ("hashtagId" integer NOT NULL, "postId" integer NOT NULL, PRIMARY KEY ("hashtagId", "postId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_31c935be539e76295a7f1c632a" ON "post_hashtags" ("hashtagId") `);
        await queryRunner.query(`CREATE INDEX "IDX_003e77538237089ff217a1cfe7" ON "post_hashtags" ("postId") `);
        await queryRunner.query(`CREATE TABLE "follows" ("followingId" integer NOT NULL, "followerId" integer NOT NULL, PRIMARY KEY ("followingId", "followerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ef463dd9a2ce0d673350e36e0f" ON "follows" ("followingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fdb91868b03a2040db408a5333" ON "follows" ("followerId") `);
        await queryRunner.query(`DROP INDEX "IDX_74b9b8cd79a1014e50135f266f"`);
        await queryRunner.query(`CREATE TABLE "temporary_likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_e2fe567ad8d305fefc918d44f50" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_likes"("id", "userId", "postId", "createdAt", "updatedAt") SELECT "id", "userId", "postId", "createdAt", "updatedAt" FROM "likes"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`ALTER TABLE "temporary_likes" RENAME TO "likes"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_74b9b8cd79a1014e50135f266f" ON "likes" ("userId", "postId") `);
        await queryRunner.query(`DROP INDEX "IDX_d5c404ce74b775e290b4514085"`);
        await queryRunner.query(`CREATE TABLE "temporary_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_posts"("id", "content", "userId", "createdAt", "updatedAt") SELECT "id", "content", "userId", "createdAt", "updatedAt" FROM "posts"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts" RENAME TO "posts"`);
        await queryRunner.query(`CREATE INDEX "IDX_d5c404ce74b775e290b4514085" ON "posts" ("userId", "createdAt") `);
        await queryRunner.query(`DROP INDEX "IDX_31c935be539e76295a7f1c632a"`);
        await queryRunner.query(`DROP INDEX "IDX_003e77538237089ff217a1cfe7"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_hashtags" ("hashtagId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "FK_31c935be539e76295a7f1c632aa" FOREIGN KEY ("hashtagId") REFERENCES "hashtags" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_003e77538237089ff217a1cfe74" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("hashtagId", "postId"))`);
        await queryRunner.query(`INSERT INTO "temporary_post_hashtags"("hashtagId", "postId") SELECT "hashtagId", "postId" FROM "post_hashtags"`);
        await queryRunner.query(`DROP TABLE "post_hashtags"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_hashtags" RENAME TO "post_hashtags"`);
        await queryRunner.query(`CREATE INDEX "IDX_31c935be539e76295a7f1c632a" ON "post_hashtags" ("hashtagId") `);
        await queryRunner.query(`CREATE INDEX "IDX_003e77538237089ff217a1cfe7" ON "post_hashtags" ("postId") `);
        await queryRunner.query(`DROP INDEX "IDX_ef463dd9a2ce0d673350e36e0f"`);
        await queryRunner.query(`DROP INDEX "IDX_fdb91868b03a2040db408a5333"`);
        await queryRunner.query(`CREATE TABLE "temporary_follows" ("followingId" integer NOT NULL, "followerId" integer NOT NULL, CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("followingId", "followerId"))`);
        await queryRunner.query(`INSERT INTO "temporary_follows"("followingId", "followerId") SELECT "followingId", "followerId" FROM "follows"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`ALTER TABLE "temporary_follows" RENAME TO "follows"`);
        await queryRunner.query(`CREATE INDEX "IDX_ef463dd9a2ce0d673350e36e0f" ON "follows" ("followingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fdb91868b03a2040db408a5333" ON "follows" ("followerId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_fdb91868b03a2040db408a5333"`);
        await queryRunner.query(`DROP INDEX "IDX_ef463dd9a2ce0d673350e36e0f"`);
        await queryRunner.query(`ALTER TABLE "follows" RENAME TO "temporary_follows"`);
        await queryRunner.query(`CREATE TABLE "follows" ("followingId" integer NOT NULL, "followerId" integer NOT NULL, PRIMARY KEY ("followingId", "followerId"))`);
        await queryRunner.query(`INSERT INTO "follows"("followingId", "followerId") SELECT "followingId", "followerId" FROM "temporary_follows"`);
        await queryRunner.query(`DROP TABLE "temporary_follows"`);
        await queryRunner.query(`CREATE INDEX "IDX_fdb91868b03a2040db408a5333" ON "follows" ("followerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ef463dd9a2ce0d673350e36e0f" ON "follows" ("followingId") `);
        await queryRunner.query(`DROP INDEX "IDX_003e77538237089ff217a1cfe7"`);
        await queryRunner.query(`DROP INDEX "IDX_31c935be539e76295a7f1c632a"`);
        await queryRunner.query(`ALTER TABLE "post_hashtags" RENAME TO "temporary_post_hashtags"`);
        await queryRunner.query(`CREATE TABLE "post_hashtags" ("hashtagId" integer NOT NULL, "postId" integer NOT NULL, PRIMARY KEY ("hashtagId", "postId"))`);
        await queryRunner.query(`INSERT INTO "post_hashtags"("hashtagId", "postId") SELECT "hashtagId", "postId" FROM "temporary_post_hashtags"`);
        await queryRunner.query(`DROP TABLE "temporary_post_hashtags"`);
        await queryRunner.query(`CREATE INDEX "IDX_003e77538237089ff217a1cfe7" ON "post_hashtags" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_31c935be539e76295a7f1c632a" ON "post_hashtags" ("hashtagId") `);
        await queryRunner.query(`DROP INDEX "IDX_d5c404ce74b775e290b4514085"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME TO "temporary_posts"`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "userId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "posts"("id", "content", "userId", "createdAt", "updatedAt") SELECT "id", "content", "userId", "createdAt", "updatedAt" FROM "temporary_posts"`);
        await queryRunner.query(`DROP TABLE "temporary_posts"`);
        await queryRunner.query(`CREATE INDEX "IDX_d5c404ce74b775e290b4514085" ON "posts" ("userId", "createdAt") `);
        await queryRunner.query(`DROP INDEX "IDX_74b9b8cd79a1014e50135f266f"`);
        await queryRunner.query(`ALTER TABLE "likes" RENAME TO "temporary_likes"`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "likes"("id", "userId", "postId", "createdAt", "updatedAt") SELECT "id", "userId", "postId", "createdAt", "updatedAt" FROM "temporary_likes"`);
        await queryRunner.query(`DROP TABLE "temporary_likes"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_74b9b8cd79a1014e50135f266f" ON "likes" ("userId", "postId") `);
        await queryRunner.query(`DROP INDEX "IDX_fdb91868b03a2040db408a5333"`);
        await queryRunner.query(`DROP INDEX "IDX_ef463dd9a2ce0d673350e36e0f"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP INDEX "IDX_003e77538237089ff217a1cfe7"`);
        await queryRunner.query(`DROP INDEX "IDX_31c935be539e76295a7f1c632a"`);
        await queryRunner.query(`DROP TABLE "post_hashtags"`);
        await queryRunner.query(`DROP INDEX "IDX_d5c404ce74b775e290b4514085"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP INDEX "IDX_7fedde18872deb14e4889361d7"`);
        await queryRunner.query(`DROP TABLE "hashtags"`);
        await queryRunner.query(`DROP INDEX "IDX_74b9b8cd79a1014e50135f266f"`);
        await queryRunner.query(`DROP TABLE "likes"`);
    }

}
