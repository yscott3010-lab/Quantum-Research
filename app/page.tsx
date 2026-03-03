import { getSortedPostsData } from '@/lib/markdown';
import { HomeContent } from './components/HomeContent';

export default function Home() {
  const allPostsData = getSortedPostsData();
  const recentPosts = allPostsData.slice(0, 3);

  return <HomeContent recentPosts={recentPosts} />;
}
