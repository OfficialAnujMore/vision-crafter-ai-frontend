import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoaderProvider } from '../../src/components/LoaderContext';
import { vi } from 'vitest';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
  withGoogle?: boolean;
  withLoader?: boolean;
}

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <GoogleOAuthProvider clientId="test-client-id">
    <BrowserRouter>
      <LoaderProvider>
        {children}
      </LoaderProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);

export function customRender(
  ui: ReactElement,
  {
    withRouter = true,
    withGoogle = true,
    withLoader = true,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  let Wrapper = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );

  if (withGoogle && withRouter && withLoader) {
    Wrapper = AllProviders;
  } else {
    const providers = [];
    if (withGoogle) providers.push(GoogleOAuthProvider);
    if (withRouter) providers.push(BrowserRouter);
    if (withLoader) providers.push(LoaderProvider);

    if (providers.length > 0) {
      Wrapper = ({ children }: { children: React.ReactNode }) => {
        let result: React.ReactNode = children;
        for (const Provider of providers) {
          if (Provider === GoogleOAuthProvider) {
            result = (
              <GoogleOAuthProvider clientId="test-client-id">
                {result}
              </GoogleOAuthProvider>
            );
          } else if (Provider === BrowserRouter) {
            result = <BrowserRouter>{result}</BrowserRouter>;
          } else if (Provider === LoaderProvider) {
            result = <LoaderProvider>{result}</LoaderProvider>;
          }
        }
        return <>{result}</>;
      };
    }
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock common API responses
export const mockAuthResponse = {
  status: true,
  data: {
    user: {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
    },
    token: 'test-token',
  },
  message: 'Login successful',
};

export const mockProjectResponse = {
  id: 1,
  file_id: 'file-123',
  title: 'Test Project',
  width: 1920,
  height: 1080,
  project_url: 'https://cdn.example.com/project.json',
  thumbnail_url: 'https://cdn.example.com/thumbnail.jpg',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z',
  user_id: 1,
};

export const mockImageKitResponse = {
  fileId: 'ik-file-123',
  name: 'test-image.jpg',
  filePath: '/test-image.jpg',
  fileType: 'image',
  url: 'https://ik.imagekit.io/test/test-image.jpg',
  width: 1920,
  height: 1080,
};

// Mock axios
export const createMockAxiosInstance = () => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  put: vi.fn(),
});

export * from '@testing-library/react';
