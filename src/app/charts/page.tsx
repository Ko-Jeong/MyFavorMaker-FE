"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { chartList, getGroup } from "@/data/charts";
import { groupToChart } from "@/types/chart";
import { useChartStore } from "@/store/useChartStore";

/**
 * [담당 A] 불러오기 / 선택 화면 (시안: "선택 화면")
 * 프론트에 등록된 그룹 취향표를 불러오거나, "+ new"로 새로 만듭니다.
 * (백엔드 없음 — 목록은 src/data/charts 에서 옴)
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
    <div className="flex flex-1 flex-col px-5 py-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <h1 className="font-title text-2xl">불러오기</h1>
        <Button onClick={createNew}>+ new</Button>
      </div>
      <p className="mt-2 text-sm text-zinc-500">
        미리 등록된 취향표를 불러오거나
        <br />새 취향표를 만들 수 있어요
      </p>

      {/* 목록 */}
      <ul className="mt-6 flex flex-col gap-3">
        {chartList.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => openChart(item.id)}
              className="block w-full rounded-lg border border-zinc-200 px-4 py-3 text-left font-medium hover:bg-zinc-50"
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
