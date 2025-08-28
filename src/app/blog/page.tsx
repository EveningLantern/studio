import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BlogPage() {
  return (
    <div className="container mx-auto max-w-4xl py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
          Our Blog
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Insights, news, and articles from our team.
        </p>
      </div>

      <div className="grid gap-8">
        {[1, 2, 3].map((item) => (
          <Card key={item}>
            <CardHeader>
              <CardTitle>Blog Post Title {item}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is a placeholder for a blog post summary. Check back later for more updates.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
