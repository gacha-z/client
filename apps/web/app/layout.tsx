import './globals.css';

import type { ReactNode } from 'react';

/** web은 최소 뼈대 — Query/Jotai 필요 시 Client Provider 래퍼 추가 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
