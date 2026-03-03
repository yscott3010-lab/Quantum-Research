import { getAllPostIds, getPostData } from '@/lib/markdown';
import { ReportAnimationWrapper } from '@/app/components/ReportAnimationWrapper';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    return paths;
}

export default async function ReportView({ params }: { params: { slug: string } }) {
    const postData = await getPostData(params.slug);

    return (
        <div className="container py-24 relative">
            {/* Ambient DWF-style glow behind the article */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none z-0">
                <div className="w-full h-full bg-[var(--accent-color)] opacity-[0.03] dark:opacity-[0.06] blur-[120px] rounded-full" />
            </div>

            <ReportAnimationWrapper>
                {/* Article Header */}
                <header className="mb-16 pb-12 border-b border-[var(--border-color)] relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
                        {postData.title}
                    </h1>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-6 text-[var(--text-secondary)] font-mono text-sm">
                            {postData.author && (
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />
                                    <span className="uppercase font-bold tracking-widest text-[var(--text-primary)]">{postData.author}</span>
                                </div>
                            )}
                            <time>
                                {new Date(postData.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            {postData.tags && postData.tags.map(tag => (
                                <span key={tag} className="text-sm font-mono text-[var(--accent-color)] uppercase bg-[var(--card-bg)] px-3 py-1 border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-colors duration-300 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Article Body */}
                <article
                    className="content-narrow markdown-body relative z-10"
                    dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
                />
            </ReportAnimationWrapper>
        </div>
    );
}
