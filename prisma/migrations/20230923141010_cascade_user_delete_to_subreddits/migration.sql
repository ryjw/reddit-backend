-- DropForeignKey
ALTER TABLE "Subreddit" DROP CONSTRAINT "Subreddit_userId_fkey";

-- AddForeignKey
ALTER TABLE "Subreddit" ADD CONSTRAINT "Subreddit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
