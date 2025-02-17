import Edit from "@/assets/icons/edit";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { SelectsEnum } from "@/lib/common";
import { getFormSelectOptions } from "@/store/common/api";
import { useEffect, useState } from "react";

interface TagListProps {
  tags: { id: string; label: string; program_language: string[] | null }[];
  onTagRemove: (tagId: string) => void;
  onTagEdit: (tagId: string) => void;
  languageErrors: { [key: string]: string };
}

export default function TagList({
  tags,
  onTagRemove,
  onTagEdit,
  languageErrors,
}: TagListProps) {
  const {
    data: { list: programmingLanguagesList = [] },
  } = useAppSelector(({ common }) => common.formSelectOptions);

  const [languageMap, setLanguageMap] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getFormSelectOptions({
        request: `Enum/${SelectsEnum["Programming_Language"]}`,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    const map = programmingLanguagesList.reduce<Record<string, string>>(
      (acc, lang) => {
        if (lang?.master_enum_uuid) {
          acc[lang.master_enum_uuid] = lang.master_enum_name;
        }
        return acc;
      },
      {},
    );
    setLanguageMap(map);
  }, [programmingLanguagesList]);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex flex-col items-start gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm shadow-md transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">{tag.label}</span>
            <button
              onClick={() => onTagRemove(tag.id)}
              className="ml-5 text-lg transition-colors"
            >
              <span className="font-semibold">X</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {tag.program_language && tag.program_language.length > 0 ? (
              tag.program_language.map((langId) => (
                <span key={langId} className="bg-gray-300 px-2 py-1 text-xs">
                  {languageMap[langId] || ""}
                </span>
              ))
            ) : (
              <span className="text-red-600">Select a Language</span>
            )}
            <button
              onClick={() => onTagEdit(tag.id)}
              className="mt-1 transition-colors"
            >
              <Edit width={18} height={18} />
            </button>
          </div>
          {languageErrors[tag.id] && (
            <p className="text-sm font-medium text-red-600">
              {languageErrors[tag.id]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
