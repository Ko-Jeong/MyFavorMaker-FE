/**
 * 페이지 전환 래퍼
 * 모든 페이지에 자동으로 부드러운 전환 효과 적용
 */
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-enter flex flex-1 flex-col">{children}</div>;
}
