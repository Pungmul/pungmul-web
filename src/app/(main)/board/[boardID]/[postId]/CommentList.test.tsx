// CommentsList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentList from './CommentsList';

const mockComments = [
  {
    commentId: 1,
    postId: 1,
    parentId: null,
    content: 'This is a comment',
    userName: 'User1',
    profile: {
      id: 1,
      originalFilename: 'profile.jpg',
      convertedFileName: 'profile.jpg',
      fullFilePath: 'https://example.com/profile.jpg',
      fileType: 'image/jpeg',
      fileSize: 12345,
      createdAt: '2023-01-01T00:00:00Z',
    },
    createdAt: '2023-01-01T00:00:00Z',
    replies: [],
  },
];

describe('CommentList Component', () => {
  it('renders comments correctly', () => {
    render(<CommentList comments={mockComments} postId={1} />);

    expect(screen.getByText('This is a comment')).toBeInTheDocument();
    expect(screen.getByText('User1')).toBeInTheDocument();
  });

  it('handles reply button click', () => {
    render(<CommentList comments={mockComments} postId={1} />);

    const replyButton = screen.getAllByText('대댓글을 작성하시겠습니까?')[0];
    fireEvent.click(replyButton);

    expect(screen.getByPlaceholderText('댓글을 입력하세요...')).toHaveFocus();
  });

  it('handles comment submission', () => {
    render(<CommentList comments={mockComments} postId={1} />);

    const input = screen.getByPlaceholderText('댓글을 입력하세요...');
    const form = input.closest('form')!;
    fireEvent.change(input, { target: { value: 'New comment' } });
    fireEvent.submit(form);

    // Add assertions for the expected behavior after submission
  });
});