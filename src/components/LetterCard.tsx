import Link from "next/link";

interface LetterCardProps {
  letter: {
    id: string;
    content: string;
    created_at: string;
    read_at: string | null;
    author: { nickname: string } | null;
    recipient: { nickname: string } | null;
  };
  isMine: boolean;
}

export default function LetterCard({ letter, isMine }: LetterCardProps) {
  const preview =
    letter.content.length > 80
      ? letter.content.slice(0, 80) + "..."
      : letter.content;

  const date = new Date(letter.created_at).toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const authorName = letter.author?.nickname ?? "?";
  const recipientName = letter.recipient?.nickname ?? "?";

  return (
    <Link href={`/letter/${letter.id}`} className="block">
      <div
        className={`rounded-lg border p-4 transition hover:shadow-sm ${
          isMine
            ? "border-orange-200 bg-orange-50"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">
            {isMine ? `你 You → ${recipientName}` : `${authorName} → 你 You`}
          </p>
          <div className="flex items-center gap-2">
            {!isMine && !letter.read_at && (
              <span className="h-2 w-2 rounded-full bg-orange-500" />
            )}
            <time className="text-xs text-gray-400">{date}</time>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{preview}</p>
      </div>
    </Link>
  );
}
