import { getSortedPostsData } from '@/lib/markdown';
import { ResearchContent } from '@/app/components/ResearchContent';

export default function ResearchIndex() {
    const allPostsData = getSortedPostsData();
    return <ResearchContent posts={allPostsData} />;
}
