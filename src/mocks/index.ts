export async function initMocks() {
  if (process.env.NEXT_PUBLIC_USE_MOCK !== 'true') return;

  console.log('is mocked!')

  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen();
  }else{
    const { worker } = await import('./browser');
    worker.start();
  }
}

export * from './browser'
export * from './server'