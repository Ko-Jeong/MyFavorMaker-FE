"use client";

import { useRouter } from "next/navigation";
import { chartList, getGroup } from "@/data/charts";
import { groupToChart } from "@/types/chart";
import { useChartStore } from "@/store/useChartStore";

/**
 * 그룹 불러오기 + 선택
 */
export default function ChartsPage() {
  const router = useRouter();
  const { loadChart, reset } = useChartStore();

  const openChart = (id: string) => {
    const group = getGroup(id);
    if (group) {
      // 그룹 명단 → 왼% 0 인 빈 카드로 변환해 편집 화면으로
      loadChart(groupToChart(group));
      router.push("/editor");
    }
  };

  const createNew = () => {
    reset();
    router.push("/editor");
  };

  return (
    <div className="flex h-dvh flex-col px-7 py-6">
      {/* 헤더 (고정) */}
      <div className="flex shrink-0 items-start justify-between">
        <h1 className="font-title text-[30px]">불러오기</h1>
        <button
          onClick={createNew}
          className="rounded-[12px] bg-primary px-[14px] py-[2px] text-[18px] font-light text-white"
        >
          + new
        </button>
      </div>
      <p className="mt-2 shrink-0 text-[16px] font-semibold leading-[22px] text-[#363636]">
        미리 등록된 취향표를 불러오거나
        <br />새 취향표를 만들 수 있어요
      </p>

      {/* 목록 (이 영역만 스크롤) — 음수 마진+패딩으로 박스 그림자 잘림 방지 */}
      <ul className="mt-6 -mx-1 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-1 py-1">
        {chartList.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => openChart(item.id)}
              className="block w-full rounded-[12px] bg-white px-[14px] py-[14px] text-left text-[16px] font-semibold text-[#363636] shadow-[0px_0px_2px_rgba(0,0,0,0.1)]"
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
