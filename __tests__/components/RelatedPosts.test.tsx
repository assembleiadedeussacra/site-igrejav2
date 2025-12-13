import { render, screen } from '@testing-library/react';
import RelatedPosts from '@/components/posts/RelatedPosts';
import type { Post } from '@/lib/database.types';

// Mock Next.js Image and Link
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('RelatedPosts', () => {
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Test Post 1',
      slug: 'test-post-1',
      description: 'Description 1',
      content: 'Content 1',
      type: 'blog',
      tags: ['tag1'],
      published: true,
      views: 10,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Test Post 2',
      slug: 'test-post-2',
      description: 'Description 2',
      content: 'Content 2',
      type: 'blog',
      tags: ['tag2'],
      published: true,
      views: 20,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];

  it('renders related posts correctly for blog type', () => {
    render(<RelatedPosts posts={mockPosts} type="blog" />);
    
    expect(screen.getByText('Artigos Relacionados')).toBeInTheDocument();
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
  });

  it('renders related posts correctly for study type', () => {
    render(<RelatedPosts posts={mockPosts} type="study" />);
    
    expect(screen.getByText('Estudos Relacionados')).toBeInTheDocument();
  });

  it('does not render when posts array is empty', () => {
    const { container } = render(<RelatedPosts posts={[]} type="blog" />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when posts is null', () => {
    const { container } = render(<RelatedPosts posts={[]} type="blog" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders post links with correct hrefs', () => {
    render(<RelatedPosts posts={mockPosts} type="blog" />);
    
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/blog/test-post-1');
    expect(links[1]).toHaveAttribute('href', '/blog/test-post-2');
  });
});
