"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Camera, X } from "lucide-react";
import { type CharacterCard, rightPercent } from "@/types/chart";
import { useChartStore } from "@/store/useChartStore";
import RatioSlider from "@/components/ui/RatioSlider";
import Card from "@/components/ui/Card";
import MemberPhoto from "@/components/chart/MemberPhoto";
import RatioSummary from "@/components/chart/RatioSummary";

const syncTextareaHeight = (element: HTMLTextAreaElement) => {
  element.style.height = "0px";
  element.style.height = `${element.scrollHeight}px`;
};

const MAX_PHOTO_SIZE = 1024;
const PHOTO_QUALITY = 0.82;

function PencilIcon() {
  return (
    <img
      src="/icons/pencil.svg"
      alt=""
      aria-hidden="true"
      className="h-[14px] w-[14px]"
    />
  );
}

/**
 * 편집용 카드 (editor 화면).
 * 이름 / 사진 업로드 / 왼 퍼센트(숫자 입력) / 코멘트 수정 + 삭제(×).
 * 퍼센트바는 유저가 직접 조절하지 않고, 왼 퍼센트 값에 따라 자동으로 채워집니다.
 */
export default function CharacterCardEdit({ card }: { card: CharacterCard }) {
  const { updateCard, removeCard } = useChartStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const nameMeasureRef = useRef<HTMLSpanElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [nameWidth, setNameWidth] = useState<number>(0);
  const right = rightPercent(card);
  const trimmedName = card.name.trim();
  const displayName = trimmedName || "name";
  const trimmedComment = card.comment?.trim() ?? "";

  const setLeftPercent = (raw: string) => {
    const n = Number(raw.replace(/[^0-9]/g, ""));
    updateCard(card.id, { leftPercent: Math.max(0, Math.min(100, n || 0)) });
  };

  const setPhoto = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;

      const image = new Image();
      image.onload = () => {
        const scale = Math.min(
          1,
          MAX_PHOTO_SIZE / Math.max(image.naturalWidth, image.naturalHeight),
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

        const context = canvas.getContext("2d");
        if (!context) {
          updateCard(card.id, { photoUrl: result });
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        updateCard(card.id, {
          photoUrl: canvas.toDataURL("image/jpeg", PHOTO_QUALITY),
        });
      };
      image.onerror = () => {
        updateCard(card.id, { photoUrl: result });
      };
      image.src = result;
    };
    reader.onerror = () => {
      reader.abort();
    };
    reader.readAsDataURL(file);
  };

  const setComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { currentTarget } = event;
    syncTextareaHeight(currentTarget);
    updateCard(card.id, { comment: currentTarget.value });
  };

  const stopNameEditOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsEditingName(false);
      event.currentTarget.blur();
    }
  };

  useEffect(() => {
    if (!isEditingName || !nameInputRef.current) return;

    const { current } = nameInputRef;
    current.focus();
    const end = current.value.length;
    current.setSelectionRange(end, end);
  }, [isEditingName]);

  useEffect(() => {
    if (!isEditingComment || !commentTextareaRef.current) return;

    const { current } = commentTextareaRef;
    current.focus();
    syncTextareaHeight(current);
    const end = current.value.length;
    current.setSelectionRange(end, end);
  }, [isEditingComment]);

  useEffect(() => {
    if (!nameMeasureRef.current) return;
    setNameWidth(nameMeasureRef.current.offsetWidth);
  }, [card.name]);

  return (
    <Card className="relative">
      {/* 삭제 버튼 */}
      <button
        type="button"
        onClick={() => removeCard(card.id)}
        className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
        aria-label="카드 삭제"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <div className="flex items-center gap-3">
        {/* 사진 업로드 */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400"
          aria-label="사진 추가"
        >
          {card.photoUrl ? (
            <MemberPhoto
              src={card.photoUrl}
              alt={card.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <Camera className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            setPhoto(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        <div className="min-w-0 flex-1 pr-8">
          {/* 이름 */}
          <div className="flex items-center gap-1.5">
            <div
              className="min-w-0 max-w-full"
              style={{
                width: nameWidth
                  ? `min(${nameWidth + 2}px, calc(100% - 15px))`
                  : undefined,
              }}
            >
              <span
                ref={nameMeasureRef}
                className="pointer-events-none absolute -z-10 whitespace-pre font-semibold opacity-0"
              >
                {displayName}
              </span>
              {isEditingName ? (
                <input
                  ref={nameInputRef}
                  value={card.name}
                  onChange={(e) => updateCard(card.id, { name: e.target.value })}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={stopNameEditOnEnter}
                  className="block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap bg-transparent p-0 font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none"
                  placeholder="name"
                />
              ) : (
                <p
                  className={
                    trimmedName
                      ? "truncate font-semibold text-zinc-900"
                      : "truncate font-semibold text-zinc-400"
                  }
                >
                  {displayName}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="shrink-0"
              aria-label="이름 수정"
            >
              <PencilIcon />
            </button>
          </div>
          {/* 왼/른 퍼센트 텍스트 — 왼 값을 숫자로 입력하면 바가 자동 반영 */}
          <RatioSummary
            leftPercent={card.leftPercent}
            rightPercent={right}
            editable
            onLeftPercentChange={setLeftPercent}
          />
        </div>
      </div>

      {/* 퍼센트바 (읽기전용, 왼 퍼센트에 따라 자동 반영) */}
      <div className="mt-3">
        <RatioSlider leftPercent={card.leftPercent} />
      </div>

      {/* 코멘트 */}
      <div className="mt-3 flex items-start gap-1.5">
        {isEditingComment ? (
          <textarea
            ref={commentTextareaRef}
            value={card.comment ?? ""}
            onChange={setComment}
            onBlur={() => setIsEditingComment(false)}
            rows={1}
            className="w-full resize-none overflow-hidden bg-transparent text-sm text-zinc-600 outline-none"
            placeholder="comment"
          />
        ) : (
          <div className="inline-flex items-end gap-1.5 text-sm text-zinc-400">
            <span
              className={
                trimmedComment
                  ? "whitespace-pre-wrap text-zinc-600"
                  : "whitespace-pre-wrap"
              }
            >
              {trimmedComment || "comment"}
            </span>
            <button
              type="button"
              onClick={() => setIsEditingComment(true)}
              className="shrink-0"
              aria-label="코멘트 수정"
            >
              <PencilIcon />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
