import { render, screen, waitFor } from '@testing-library/react';
import Jobs from '../Jobs';
import { vi } from 'vitest';

describe('Jobs 컴포넌트', () => {
  const mockJobs = [
    {
      id: '1',
      title: '백엔드 개발자',
      company: 'AI Company',
      location: '서울',
      description: 'FastAPI 경력자 우대',
    },
    {
      id: '2',
      title: '프론트엔드 개발자',
      company: 'Tech Innovations',
      location: '부산',
      description: 'React 경험 필수',
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    //import.meta.env.VITE_API_BASE_URL = 'http://localhost:8000';
  });

  it('로딩 상태를 보여준다', () => {
    vi.stubGlobal('fetch', () => new Promise(() => {})); // fetch 무한 대기

    render(<Jobs />);
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('데이터가 성공적으로 로드되면 채용공고를 표시한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        })
      )
    );

    render(<Jobs />);

    await waitFor(() => {
      expect(screen.getByText('채용공고 목록')).toBeInTheDocument();
      expect(screen.getByText('백엔드 개발자')).toBeInTheDocument();
      expect(screen.getByText('프론트엔드 개발자')).toBeInTheDocument();
    });
  });

  it('API 에러 발생 시 에러 메시지를 출력한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          text: () => Promise.resolve('Internal Server Error'),
        })
      )
    );

    render(<Jobs />);

    await waitFor(() => {
      expect(screen.getByText(/에러 발생/)).toBeInTheDocument();
      expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
    });
  });
});
